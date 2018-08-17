import GameManager from "../gamecore/managers/GameManager";
import WXCore from "../gamecore/wechat/WXCore";
import Utils from "../gamecore/managers/Utils";
import GameEventNames from "../GameEventNames";
import GameSystem from "../GameSystem";
import WXOpenData from "../gamecore/wechat/WXOpenData";
import StateManage from "../StateManage/StateManage";
const {ccclass, property} = cc._decorator;

@ccclass
export default class RankSmall extends cc.Component {

    @property(cc.Node)
    moreBtn: cc.Node = null;
    @property(cc.Node)
    anewStart:cc.Node = null;
    @property(cc.Node)
    share:cc.Node = null;
    @property(cc.Node)
    shareFBtn:cc.Node=null;
    
    // onLoad () {}

    start () {
        // GameSystem.init();
        
        if(!this._isOnLoadCalled) return;
        this.moreBtn.on(cc.Node.EventType.TOUCH_END,this.onMoreBtn,this);
        this.anewStart.on(cc.Node.EventType.TOUCH_END,this.onAnewStart,this);
        this.share.on(cc.Node.EventType.TOUCH_END,this.onShare,this);
        this.shareFBtn.on(cc.Node.EventType.TOUCH_END,this.onSharFd,this);
        this.refreshUI();
        
        Utils.scaleContentAuto(cc.find("container",this.node));
        Utils.scaleContentAuto(cc.find("title",this.node));
        Utils.scaleContentAuto(cc.find("again",this.node));
        Utils.scaleContentAuto(cc.find("shareFriend",this.node));
        Utils.scaleContentAuto(cc.find("subContent",this.node));
        console.log(cc.find("container",this.node).name,cc.find("title",this.node).name,cc.find("again",this.node).name,cc.find("subContent",this.node).name)
    }
    private onSharFd(){
        GameManager.eventManager.dispatchEventWith(GameEventNames.SHOW_SHAREFD);
        GameManager.soundsManager.playTapSound();
        console.log("弹出预制体")
    }
    private onMoreBtn(){
        this.moreBtn.active = false;
        this.share.active = false;
        this.anewStart.active = false;
        this.shareFBtn.active = false;
        GameManager.soundsManager.playTapSound();
        WXOpenData.postMessage({"direction":2});
        console.log("更多排行榜")
    }
    private onAnewStart(){
        console.log("再来一次")
        this.anewStart.active = false;
        GameManager.soundsManager.playTapSound();
        
        cc.director.loadScene("gameScene");
        StateManage.instance.setData(StateManage.KEY_USE_RESURGENCECAR,1);
        WXOpenData.postMessage({"integral":0,"direction":3});
    }
    private onShare(){
        console.log("分享")
        GameManager.soundsManager.playTapSound();
        
        // WXCore.shareApp("煎饼",cc.url.raw("resources/share/shareBG.jpg"));
        GameManager.eventManager.dispatchEventWith(GameEventNames.SHARE_EVENT);
    }
    private refreshUI(){
        this.moreBtn.active = true;
        this.anewStart.active = true;
        this.share.active = true;
        WXOpenData.postMessage({"direction":1});
    }
    // update (dt) {}
}
