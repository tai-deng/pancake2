import StateManage from "../StateManage/StateManage";

const {ccclass, property} = cc._decorator;

/**
 * 宝石类
 */
@ccclass
export default class DiamondMain extends cc.Component {


    //数量
    @property(cc.Label)
    countLabel:cc.Label = null;

    @property(cc.Node)
    iconNode:cc.Node = null;

    //数量
    public count:number = 1;

    onLoad() {
    }


    start() {
        if (this.count > 1) {
            this.countLabel.string = "×" + this.count;
        }

        
        this.node.opacity = 0;
        this.node.runAction(cc.fadeTo(0.3, 255));

        this.iconNode.scale = 0.5;
        this.iconNode.runAction(cc.scaleTo(0.3, 1, 1).easing(cc.easeBounceIn()));
    }



    /**
     * 消失
     */
    public doDisappear():void {
        this.node.getComponent(cc.RigidBody).enabled = false;

        this.countLabel.node.active = false;
        
        let ani:cc.Animation = this.iconNode.getComponent(cc.Animation);
        let aniState:cc.AnimationState = ani.play();

        // 注册
        // ani.on('play',      this.onPlay,        this);
        // ani.on('stop',      this.onStop,        this);
        // ani.on('lastframe', this.onLastFrame,   this);
        ani.on('finished', this.onDiamondAniFinished, this);
        // ani.on('pause',     this.onPause,       this);
        // ani.on('resume',    this.onResume,      this);
    }


    private onDiamondAniFinished(e:cc.Event):void {
        this.node.removeFromParent(true);
    }

    // update (dt) {

    // }
}
