
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    clickBtn:cc.Node=null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        if(!this._isOnLoadCalled) return;
        this.clickBtn.active = true;
        this.clickBtn.on(cc.Node.EventType.TOUCH_END,this.click,this);
    }
    private click(ev:cc.Event){
        this.clickBtn.active = false;
    }
    // update (dt) {}
}
