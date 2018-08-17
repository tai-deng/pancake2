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
 * wx的事件定义
 */
@ccclass
export default class WXEventType {

    //条形广告resize
    static BANNER_AD_RESIZE:string = "bannerAdResize";

    //条形广告显示
    static BANNER_AD_SHOW:string = "bannerAdShow";
    //条形广告影藏
    static BANNER_AD_HIDE:string = "bannerAdHide";

    //激励视频广告关闭，未播放完成
    static REWARD_VIDEO_AD_CLOSE:string = "rewardVideoAdClose";
    //激励视频广告播放完成
    static REWARD_VIDEO_AD_COMPLETE:string = "rewardVideoAdComplete";
    //激励视频广告准备好
    static REWARD_VIDEO_AD_READY:string = "rewardVideoAdReady";
    //激励视频广告显示错误
    static REWARD_VIDEO_AD_ERROR:string = "rewardVideoAdError";
}
