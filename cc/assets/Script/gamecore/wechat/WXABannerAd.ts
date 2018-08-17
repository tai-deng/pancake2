import WXBannerAd from "./WXBannerAd";
import WXEventType from "./WXEventType";
import GameManager from "../managers/GameManager";
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

const {ccclass, property} = cc._decorator;

/**
 * 一个banner广告
 */

@ccclass
export default class WXABannerAd extends cc.Component {

    @property({
        displayName:"广告ID"
    })
    adID:string = "";


    @property({
        displayName:"位置",
        tooltip:"BC:底部居中\rTC:顶部居中"
    })
    adLocation:string = "BC";

    //广告最大宽度
    @property({
        displayName:"最大宽度"
    })
    maxWidth:number = 0;


    //广告垂直方向的便宜
    @property({
        displayName:"Y轴偏移"
    })
    verticalIndent:number = 0;
    
    //广告水平方向的便宜
    @property({
        displayName:"X轴偏移"
    })
    horizontalIndent:number = 0;
    
    
    //广告垂直方向的便宜
    @property({
        displayName:"最大高度",
        tooltip:"如果设置了该参数，则会忽略Y轴偏移的参数设定"
    })
    maxHeight:number = 0;

    //默认广告
    @property({
        type:cc.Node,
        displayName:"默认广告",
        tooltip:"没有微信广告时，显示默认广告"
    })
    defaultAd:cc.Node = null;


    private _wxBannerAd:WXBannerAd;

    start () {
        this.node.scale = 0;

        //改变锚点
        this.node.anchorX = 0;
        this.node.anchorY = 0;

        if (!this.adLocation) this.adLocation = LocationValues.BOTTOM_CENTER
        if (this.maxWidth <= 0) this.maxWidth = NaN;

        this._wxBannerAd = new WXBannerAd(this.adID, this.adLocation, this.maxWidth, this.verticalIndent, this.horizontalIndent);
        if (this.maxHeight > 0) this._wxBannerAd.maxHeight = this.maxHeight;
        
        this._wxBannerAd.on(WXEventType.BANNER_AD_HIDE, this.adHideHandler, this);
        this._wxBannerAd.on(WXEventType.BANNER_AD_SHOW, this.adShowHandler, this);
        this._wxBannerAd.on(WXEventType.BANNER_AD_RESIZE, this.adResizeHandler, this);
        this._wxBannerAd.show();
    }


    /**
     * banner显示
     * 
     * @param e 
     */
    private adShowHandler(e:cc.Event):void {
        this.node.active = true;
        if (this.defaultAd) this.defaultAd.active = false;
    }

    /**
     * banner隐藏
     * 
     * @param e 
     */
    private adHideHandler(e:cc.Event):void {
        this.node.active = false;
        if (this.defaultAd) this.defaultAd.active = true;
    }
    


    private adResizeHandler(e:cc.Event):void {
        let rect:cc.Rect = this._wxBannerAd.adRect;
        rect = Utils.fromScreenRect(rect);

        // cc.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@1");
        // cc.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@2");
        // cc.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@3");
        // cc.info(rect.x, rect.y, rect.width, rect.height);

        this.node.x = rect.x;
        this.node.y = rect.y;
        this.node.scaleX = rect.width / this.node.width;
        this.node.scaleY = rect.height / this.node.height;

        this.node.dispatchEvent(new cc.Event(WXEventType.BANNER_AD_RESIZE, false));

        //尝试再次显示，以便兼容iphoneX
        if (Utils.isIphoneX) this.fixIphoneXBug();
    }
    
    
    //尝试再次显示，以便兼容iphoneX
    private static _isDoneFixed:boolean;
    private fixIphoneXBug():void {
        if (!WXABannerAd._isDoneFixed) {
            WXABannerAd._isDoneFixed = true;

            // this.schedule(function():void {
            //     this._wxBannerAd.hide();
            // }, 0.5, 1);

            this.schedule(function():void {
                this._wxBannerAd.show();
            }, 1.5, 1);
        }
    }

    // update (dt) {}

    onDestroy () {
        if (this._wxBannerAd) {
            this._wxBannerAd.off(WXEventType.BANNER_AD_HIDE, this.adHideHandler, this);
            this._wxBannerAd.off(WXEventType.BANNER_AD_SHOW, this.adShowHandler, this);
            this._wxBannerAd.off(WXEventType.BANNER_AD_RESIZE, this.adResizeHandler, this);

            // this._wxBannerAd.hide();
            this._wxBannerAd.dispose();
            this._wxBannerAd = null;
        }
            
    }
}
