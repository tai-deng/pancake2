import StateManage from "../StateManage/StateManage";
import GameManager from "../gamecore/managers/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TopNavigationBar extends cc.Component {
    /**
     * 顶部导航三个元素
     */
    @property(cc.Node)
    back: cc.Node = null;
    @property(cc.Label)
    maxScore: cc.Label = null;
    @property(cc.Label)
    score: cc.Label = null;
    @property(cc.Animation)
    animation:cc.Animation=null;
    backHome(){
        cc.director.loadScene("indexScene");
        GameManager.soundsManager.playTapSound();
    }

    private _change:number=2;
    get change ():number{
        return this._change;
    }
    set change (v:number){
        if(this._change != v){
            this._change = v;
            this.onChange(this._change);
        }
    }
    // onLoad () {}

    start () {
        StateManage.instance.on("change",this.stateChangeHandler,this);
        this.score.string = StateManage.instance.getData(StateManage.KEY_GEM);
        this.maxScore.string = StateManage.instance.getData(StateManage.KEY_MAXSCORE)
        if(cc.director.getScene().name == "indexScene"){
            this.back.active = false;
        }
        if(cc.director.getScene().name == "rankSmall"){
            this.change = 1;
        }
        if(cc.director.getScene().name == "gameScene"){
            this.maxScore.node.parent.active = false;
        }
    }

    // update (dt) {}
    private stateChangeHandler(e:cc.Event):void {
        let key:string = StateManage.instance.lastChangedKey;
        // 监控钻石
        if (key == StateManage.KEY_GEM) {
            this.score.string = StateManage.instance.getData(key);
            // if(cc.director.getScene().name == "indexScene"){
                this.animation.node.active = true;
                let aimo:cc.AnimationState = this.animation.play();
                this.animation.on("finished",this.aimationEvent,this);
            // }
        }
        if (key == StateManage.KEY_MAXSCORE) {
            this.maxScore.string = StateManage.instance.getData(key);
        }
    }
    private aimationEvent(){
        this.animation.node.active = false;
    }
    private onChange(ev:number){
        if(ev == 1){
            this.maxScore.node.color = new cc.Color(255,255,255);
        }
        if(ev == 2){
            this.maxScore.node.color = new cc.Color(132,93,49);
        }
    }
}
