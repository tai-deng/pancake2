import WXCore from "../wechat/WXCore";
import GameManager from "../managers/GameManager";
import WXUser from "../wechat/WXUser";
import WXUtils from "../wechat/WXUtils";
import WXImage from "../wechat/WXImage";

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
 * 条形广告
 */
@ccclass
export default class Comp_BannerAd extends cc.Component {

    @property({
        displayName:"预览图url"
    })
    previewImageURL:string = "";

    @property({
        displayName:"小程序ID",
        tooltip:"优先跳转小程序"
    })
    miniAppID:string = "";


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.tapHandler, this);
    }

    // update (dt) {}


    /**
     * 点击回调
     * @param e 
     */
    private tapHandler(e:cc.Event):void {
        GameManager.soundsManager.playTapSound();
        
        if (this.miniAppID != "") {
            WXUtils.navigateToMiniProgram(this.miniAppID);
        } else if (this.previewImageURL != "") {
            WXImage.previewImage([this.previewImageURL]);
        }
    }
}
