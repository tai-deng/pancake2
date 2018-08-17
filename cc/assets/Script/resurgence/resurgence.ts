import ResurgenceCtrl from "./ResurgenceCtrl";
import GameManager from "../gamecore/managers/GameManager";
import Utils from "../gamecore/managers/Utils";
import WXCore from "../gamecore/wechat/WXCore";
import StateManage from "../StateManage/StateManage";
import GameEventNames from "../GameEventNames";
import XYJAPI from "../gamecore/xiaoyaoji/XYJAPI";

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
export default class Resurgence extends cc.Component {

    @property(cc.Label)
    cardNum:cc.Label = null;
    @property(cc.Button)
    shareBtn:cc.Button = null;

    // onLoad () {}
    private _data:number;
    get data():number{
        return this._data;
    }
    set data(v:number){
        if(this._data != v){
            this._data = v;
            this.refreshUI();
        }
    }

    start () {
        if(!this._isOnLoadCalled)return;

        ResurgenceCtrl.instance.on("esurgenceCard",this.getEsurgenceCard,this);
        this.shareBtn.node.on(cc.Node.EventType.TOUCH_END,this.onShareBtn,this);

        Utils.scaleContentAuto(this.node);

        this.getEsurgenceCard();

        this.refreshUI();
    }
    private getEsurgenceCard(){
        this.data = ResurgenceCtrl.instance.getResurgenceCardNum();
    }

    /**
     * 刷新UI
     */
    private refreshUI(){
        if (!this._isOnLoadCalled) return;

        //获取复活卡数量
        let v:number = XYJAPI.reviveCount;
        v = Utils.toInt(v);
        console.log(v,"复活卡数量")

        this.cardNum.string = `x ${v}`
    }

    public onShareBtn(){
        GameManager.soundsManager.playTapSound();

        GameManager.eventManager.dispatchEventWith(GameEventNames.SHARE_EVENT);
        
        this.refreshUI();
        // WXCore.shareApp("煎饼", cc.url.raw("resources/share/shareBG.jpg"),{share:1},function(res){
        //     console.log(res,"分享才成功! 复活卡 + 1")
        //     // 获得复活卡任务 +1 复活卡数量 +1
        //     let fdrelay = StateManage.instance.getData(StateManage.KEY_FDRELAY) + 1;
        //     StateManage.instance.setData(StateManage.KEY_FDRELAY,fdrelay);
        //     ResurgenceCtrl.instance.addResurgenceCard();
        // });
    }
    // update (dt) {}
}
