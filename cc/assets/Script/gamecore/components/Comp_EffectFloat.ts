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
 * 循环浮动效果
 */

@ccclass
export default class Comp_EffectFloat extends cc.Component {

    
    @property({
        displayName:"浮动特效时长(秒)"
    })
    duration:number = 1.5;

    @property({
        displayName:"浮动间隔时长(秒)"
    })
    delay:number = 2;

    @property({
        displayName:"浮动距离(y)"
    })
    distanceY:number = 20;

    @property({
        displayName:"浮动距离(x)"
    })
    distanceX:number = 0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    private _theAction:cc.Action;

    start () {
        this.play();
    }

    public play():void {
        if (this._theAction) return;

        this.unschedule(this.play);
        this._theAction = this.node.runAction(
            cc.sequence(
                cc.moveTo(this.duration, this.node.x + this.distanceX, this.node.y + this.distanceY).easing(cc.easeOut(1)),
                cc.moveTo(this.duration, this.node.x, this.node.y).easing(cc.easeBackIn()),
                cc.callFunc(this.effectCompleteCallback, this)
            )   
        );
    }


    private effectCompleteCallback():void {
        this._theAction = null;

        let delay:number = this.delay * Math.random() / 2 + this.delay / 2;
        this.schedule(this.play, delay, 1);
    }


    /**
     * 暂停效果
     */
    public stop():void {
        this.unschedule(this.play);

        if (this._theAction) {
            this.node.stopAction(this._theAction);
            this._theAction = null;
        }
    }

    // update (dt) {}


    onDestroy() {
        this.stop();
    }
}
