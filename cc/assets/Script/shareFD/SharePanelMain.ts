import WXCore from "../gamecore/wechat/WXCore";
import GameManager from "../gamecore/managers/GameManager";
import GameEventNames from "../GameEventNames";
import WXImage from "../gamecore/wechat/WXImage";

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

@ccclass
export default class SharePanelMain extends cc.Component {
    @property(cc.Node)
    shareFd:cc.Node = null;
    @property(cc.Node)
    save:cc.Node = null;

    start () {
        this.shareFd.on(cc.Node.EventType.TOUCH_END, this.onShareFd, this);
        this.save.on(cc.Node.EventType.TOUCH_END, this.onSave, this);
    }

    private onShareFd(){
        let image = cc.url.raw("resources/share/friden.jpg");
        WXImage.saveImageToPhotosAlbum(image,function(res){
            WXCore.showToast("保存图片成功!")
        });
    }
    private onSave(){
        // let image = cc.url.raw("resources/share/shareBG.jpg");
        // WXCore.shareApp("翻锅",image,);
        // console.log("分享给朋友")
        GameManager.eventManager.dispatchEventWith(GameEventNames.SHARE_EVENT);
    }
    // update (dt) {}
}
