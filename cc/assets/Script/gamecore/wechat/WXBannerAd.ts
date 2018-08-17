import WXCore from "./WXCore";
import GameManager from "../managers/GameManager";
import WXEventType from "./WXEventType";
import WXABannerAd from "./WXABannerAd";
import LocationValues from "../LocationValues";
import Utils from "../managers/Utils";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

/**
 * 微信条形广告
 * 
 */
@ccclass
export default class WXBannerAd extends cc.Node {

    //广告边框宽
    static AD_BORDER_WEIGHT: number = 2;

    //当前banner广告
    private static _currentAd: WXBannerAd;

    static get currentAd(): WXBannerAd {
        return WXBannerAd._currentAd;
    }


    //最大高度
    //如果设置了最大高度，再广告resize时，超出该高度时，会自动调节_verticalIndent属性。
    //此时，会忽略_verticalIndent的设置
    public maxHeight: number = 0;

    //广告对象
    private static _theAd: any;

    //广告对象表
    private _adID: string;


    //广告位置
    private _location: string;


    //广告对象
    private _bannerAd: any;


    //广告最大宽
    private _maxWidth: number;


    //是否新建了新的广告
    private _isNewAd: boolean;


    //垂直方向上偏移像素
    private _vertialIndent: number = 0;
    //水平方向上偏移像素
    private _horizontalIndent: number = 0;

    /**
     *  
     * @param adID                  广告ID
     * @param location              广告位置
     * @param maxWidth              广告最大宽
     * @param verticalIndent        广告垂直方向上偏移像素
     * @param horizontalIndent      广告水平方向上偏移像素
     */
    constructor(adID: string,
        location: string = "BC",
        maxWidth: number = NaN,
        verticalIndent: number = 0,
        horizontalIndent: number = 0,
    ) {
        super();

        //记录当前banner ad
        WXBannerAd._currentAd = this;

        this._adID = adID;
        this._location = location;
        this._maxWidth = maxWidth;
        this._vertialIndent = verticalIndent;
        this._horizontalIndent = horizontalIndent;

        this.createAd();
    }


    /**
     * 
     * 
     */
    private createAd(): void {
        if (typeof wx == "undefined") return;


        this._isNewAd = (WXBannerAd._theAd == null);

        if (this._isNewAd) {
            let screenSize: cc.Size = cc.view.getFrameSize();
            let minW: number = 300;
            let maxW: number = minW * 1.5;
            if (!isNaN(this._maxWidth) && this._maxWidth > minW) {
                maxW = this._maxWidth;
            }

            let adW: number = Math.max(minW, Math.min(screenSize.width, maxW));

            let adX: number = 0;
            let adY: number = 0;
            switch (this._location) {
                //TODO:NEXT 后期需补齐算法
                case LocationValues.BOTTOM_CENTER:
                    adX = (screenSize.width - adW) / 2;
                    adY = screenSize.height;
                    break;
                case LocationValues.TOP_CENTER:
                    adX = (screenSize.width - adW) / 2;
                    adY = 0;
                    break;
            }

            //计算边框
            adX += WXBannerAd.AD_BORDER_WEIGHT;
            adY += WXBannerAd.AD_BORDER_WEIGHT;
            adW -= WXBannerAd.AD_BORDER_WEIGHT * 2;

            cc.info("----  微信banner广告 ----");
            cc.info("-  init  -");
            cc.info(adX, adY, adW);
            cc.info("-  done  -");

            WXBannerAd._theAd = wx.createBannerAd({
                adUnitId: this._adID,
                style: {
                    left: adX,
                    top: adY,
                    width: adW
                }
            });
        }


        let wxBannerAd: WXBannerAd = this;

        //监听事件
        WXBannerAd._theAd.onLoad(function (): void {
            if (!wxBannerAd._disposed) {
                wxBannerAd.adLoadCallback();
            }
        });

        WXBannerAd._theAd.onResize(function (res): void {
            if (!wxBannerAd._disposed) {
                wxBannerAd.adResizeCallback(res);
            }
        });

        WXBannerAd._theAd.onError(function (res): void {
            if (!wxBannerAd._disposed) {
                wxBannerAd.adErrorCallback(res);
            }
        });

        this._bannerAd = WXBannerAd._theAd;
    }


    // private _isReady:boolean;

    // /**
    //  * 广告是否已准备好
    //  */
    // get isReady():boolean {
    //     return this._isReady;
    // }


    private _adRect: cc.Rect;


    /**
     * 获取广告在屏幕上的矩形区域
     */
    get adRect(): cc.Rect {
        return this._adRect;
    }


    /**
     * 重新布局
     */
    private relayout(): void {
        cc.info("----  微信banner广告 ----");
        cc.info("-  relayout  -");
        cc.info(this._bannerAd);

        if (!this._bannerAd) return;
        if (!this._bannerAd.style) return;

        let rw: number = this._bannerAd.style.realWidth;
        let rh: number = this._bannerAd.style.realHeight;

        let adW: number = this._bannerAd.style.width;

        if (isNaN(rw) || isNaN(rh)) return;

        cc.info("【WXBannerAd】rw, rh, maxHeight", rw, rh, this.maxHeight);

        let screenSize: cc.Size = cc.view.getFrameSize();
        let winSize:cc.Size = cc.director.getWinSize();
        let scaleFactor:number = screenSize.width / winSize.width;
        cc.info("frame size", screenSize);
        cc.info("window size", winSize);
        cc.info("scaleFactor is ", scaleFactor);

        let adX: number = 0;
        let adY: number = 0;

        switch (this._location) {
            //TODO:NEXT 后期需补齐算法
            case LocationValues.BOTTOM_CENTER:
                adX = (screenSize.width - adW) / 2;
                adY = screenSize.height - rh - WXBannerAd.AD_BORDER_WEIGHT;

                if (this.maxHeight > 0 && rh > this.maxHeight * scaleFactor) {
                    this._vertialIndent = rh - this.maxHeight * scaleFactor;
                }
                break;
            case LocationValues.TOP_CENTER:
                adX = (screenSize.width - adW) / 2;
                adY = WXBannerAd.AD_BORDER_WEIGHT;

                if (this.maxHeight > 0 && rh > this.maxHeight * scaleFactor) {
                    this._vertialIndent = -(rh - this.maxHeight * scaleFactor);
                }
                break;
        }

        //偏移
        adX += this._horizontalIndent;
        adY += this._vertialIndent;

        //如果是iphoneX，再往下编译
        // if (Utils.isIphoneX) adY += Utils.iphoneXBottomBarHeight;

        this._bannerAd.style.left = adX;
        this._bannerAd.style.top = adY;

        this._adRect = new cc.Rect(adX - WXBannerAd.AD_BORDER_WEIGHT, adY - WXBannerAd.AD_BORDER_WEIGHT, rw + WXBannerAd.AD_BORDER_WEIGHT * 2, rh + WXBannerAd.AD_BORDER_WEIGHT * 2);

        this.dispatchEvent(new cc.Event(WXEventType.BANNER_AD_RESIZE, false));
    }


    /**
     * 显示广告
     */
    show(): void {
        cc.info("----  微信banner广告 ----");
        cc.info("-  show  -");

        if (this._bannerAd) {
            this._bannerAd.show();
            this.dispatchEvent(new cc.Event(WXEventType.BANNER_AD_SHOW, false));

            if (!this._isNewAd) {
                this.relayout();
            }
        }

    }


    /**
     * 隐藏广告
     */
    hide(): void {
        cc.info("----  微信banner广告 ----");
        cc.info("-  hide  -");

        if (this._bannerAd) {
            this._bannerAd.hide();
            this.dispatchEvent(new cc.Event(WXEventType.BANNER_AD_HIDE, false));
        }

    }

    private _disposed: boolean;

    /**
     * 销毁广告
     * 
     * 
     * @param   doReal 是否真的释放。如果是，则销毁广告，否则只是隐藏。
     * 
     */
    dispose(doReal: boolean = false): void {
        if (this._disposed) return;
        this._disposed = true;

        //重置当前广告索引
        if (WXBannerAd._currentAd == this) {
            WXBannerAd._currentAd = null;
        }

        cc.info("----  微信banner广告 ----");
        cc.info("-  destroy  -");

        if (this._bannerAd) {
            if (doReal) {
                WXBannerAd._theAd.destroy();
            } else {
                this._bannerAd.hide();
            }

            this._bannerAd = null;
        }
    }



    /**
     * 广告加载完成回调
     */
    private adLoadCallback(): void {
        cc.info("----  微信banner广告 ----");
        cc.info("-  adLoadCallback  -");
    }

    /**
     * 广告resize回调
     */
    private adResizeCallback(res: object): void {
        cc.info("----  微信banner广告 ----");
        cc.info("-  adResizeCallback  -");
        cc.info(res);
        cc.info(this, this.relayout);

        //TODO:DEBUG
        // this.relayout();
        setTimeout(this.relayout.bind(this), 1);
    }

    /**
     * 广告错误回调
     */
    private adErrorCallback(res: object): void {
        cc.info("----  微信banner广告 ----");
        cc.info("-  adErrorCallback  -");
        cc.info(res);

    }



}
