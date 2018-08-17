import GameManager from "../managers/GameManager";
import WXEventType from "./WXEventType";
import WXCore from "./WXCore";

const {ccclass, property} = cc._decorator;

/**
 * 微信激励视频广告
 * 
 */
@ccclass
export default class WXRewardVideoAd {

    //视频广告对象
    private static _ad:any;


    private static _adID:string;

    /**
     * 设置广告id
     */
    static set adID(value:string) {
        cc.info("----  微信视频广告 ----");
        cc.info("-  set ad id  -");
        cc.info(value);

        if (WXRewardVideoAd._adID != value) {
            WXRewardVideoAd._adID = value;

            WXRewardVideoAd.reset();
        }
    }


    //广告是否已准备好
    private static _isReady:boolean = false;

    /**
     * 广告是否已准备好
     */
    static get isReady():boolean {
        return WXRewardVideoAd._isReady;
    }


    //上一次视频广告完成播放时间（毫秒、本地时间）
    private static _lastVideoAdTime:number = 0;

    //获取上一次视频广告完成播放时间（毫秒、本地时间）
    public static get lastVideoAdTime():number {
        return WXRewardVideoAd._lastVideoAdTime;
    }


    private static _isPlaying:boolean;

    /**
     * 是否正在播放视频广告
     */
    static get isPlaying():boolean {
        return WXRewardVideoAd._isPlaying;
    }


    //记录当前背景音乐是否已静音
    private static _originalBGMMuted:boolean;

    /**
     * 显示广告
     */
    static show():boolean {
        cc.info("----  微信视频广告 ----");
        cc.info("-  show  -");
        cc.info("WXRewardVideoAd._isReady", WXRewardVideoAd._isReady);
        cc.info("WXRewardVideoAd._isPlaying", WXRewardVideoAd._isPlaying);

        if (!WXRewardVideoAd._isReady) return false;
        if (WXRewardVideoAd._isPlaying) return false;

        //记录当前背景音乐是否已静音
        WXRewardVideoAd._originalBGMMuted = GameManager.soundsManager.musicMuted;
        
        WXRewardVideoAd._ad.show();
        WXRewardVideoAd._isPlaying = true;
        
        //静音背景音乐
        GameManager.soundsManager.muteMusic();

        return true;
    }
    /**
     * 重置
     */
    static reset():void {
        cc.info("----  微信视频广告 ----");
        cc.info("-  reset  -");

        if (WXRewardVideoAd._ad) {
            WXRewardVideoAd._ad.offLoad(WXRewardVideoAd.adLoadCallback);
            WXRewardVideoAd._ad.offClose(WXRewardVideoAd.adCloseCallback);
            WXRewardVideoAd._ad.offError(WXRewardVideoAd.adErrorCallback);
            
            WXRewardVideoAd._ad = null;
        }

        //重置参数
        WXRewardVideoAd._isReady = false;
        WXRewardVideoAd._isPlaying = false;

        if (!WXRewardVideoAd._adID) return;

        if (typeof wx == "undefined") return;

        WXRewardVideoAd._ad = wx.createRewardedVideoAd({
            adUnitId: WXRewardVideoAd._adID
        });

        //监听事件
        WXRewardVideoAd._ad.onLoad(WXRewardVideoAd.adLoadCallback);
        WXRewardVideoAd._ad.onClose(WXRewardVideoAd.adCloseCallback);
        WXRewardVideoAd._ad.onError(WXRewardVideoAd.adErrorCallback);
        WXRewardVideoAd._ad.load();
    }


    /**
     * 广告加载完成回调
     */
    private static adLoadCallback():void {
        cc.info("----  微信视频广告 ----");
        cc.info("-  adLoadCallback  -");

        WXRewardVideoAd._isReady = true;
        GameManager.eventManager.dispatchEventWith(WXEventType.REWARD_VIDEO_AD_READY);
    }
    
    /**
     * 广告关闭回调
     */
    private static adCloseCallback(res:object = null):void {
        cc.info("----  微信视频广告 ----");
        cc.info("-  adCloseCallback  -");
        cc.info(res);

        //恢复背景音乐
        if (!WXRewardVideoAd._originalBGMMuted) {
            GameManager.soundsManager.unmuteMusic();
            WXRewardVideoAd._originalBGMMuted = false;
        }

        WXRewardVideoAd._isPlaying = false;

        // if (res) {
        if (res && res["isEnded"] == true) {
            //记录播放时间
            WXRewardVideoAd._lastVideoAdTime = new Date().getTime();
            
            GameManager.eventManager.dispatchEventWith(WXEventType.REWARD_VIDEO_AD_COMPLETE);
        } else {
            //显示信息提示
            WXCore.showToast("请看完整段视频");

            GameManager.eventManager.dispatchEventWith(WXEventType.REWARD_VIDEO_AD_CLOSE);
        }
        // } else {
        //     //兼容处理
        //     GameManager.eventManager.dispatchEventWith(WXEventType.REWARD_VIDEO_AD_COMPLETE);
        // }
    }

    /**
     * 广告错误回调
     */
    private static adErrorCallback(res:object):void {
        cc.info("----  微信视频广告 ----");
        cc.info("-  adErrorCallback  -");
        cc.info(res);

        //恢复背景音乐
        if (!WXRewardVideoAd._originalBGMMuted) {
            GameManager.soundsManager.unmuteMusic();
            WXRewardVideoAd._originalBGMMuted = false;
        }

        WXRewardVideoAd._isPlaying = false;

        GameManager.eventManager.dispatchEventWith(WXEventType.REWARD_VIDEO_AD_ERROR);
    }




    
}
