import GameCoreEvent from "./gamecore/GameCoreEvent";
import GameManager from "./gamecore/managers/GameManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class AlertMain extends cc.Component {

    @property(cc.Node)
    okBtn:cc.Node = null;

    @property(cc.Node)
    offBtn:cc.Node = null;

    @property(cc.Label)
    titleLabel:cc.Label = null;

   
    callbak:Function;

    title:string;


    start () {
        this.okBtn.on(cc.Node.EventType.TOUCH_END, this.okBtnTapHandler, this);
        this.offBtn.on(cc.Node.EventType.TOUCH_END,this.offBtnTapHandler,this)
        this.titleLabel.string = this.title;
    }




    // update (dt) {}


    private okBtnTapHandler(e:cc.Event):void {
        if (this.callbak != null) {
            this.callbak.call(null, "ok");
        }
        // this.node.dispatchEvent(new cc.Event(GameCoreEvent.COMMON_CLOSE, false));
        GameManager.popUpManager.removePopUp(this.node);
    }
    private offBtnTapHandler(e:cc.Event):void {
        if (this.callbak != null) {
            this.callbak.call(null, "off");
        }
        // 执行完毕移除这个几点
        GameManager.popUpManager.removePopUp(this.node);
    }
}
