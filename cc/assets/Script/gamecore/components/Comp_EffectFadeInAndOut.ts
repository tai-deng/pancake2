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
 * 循环淡隐淡现效果
 */

@ccclass
export default class Comp_EffectFadeInAndOut extends cc.Component {

    
    @property({
        displayName:"淡隐特效时长(秒)"
    })
    duration:number = 1.5;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    private _theAction:cc.Action;

    start () {
        this.play();
    }

    public play():void {
        if (this._theAction) return;

        this._theAction = this.node.runAction(
            cc.repeatForever(
                cc.sequence(
                    cc.fadeTo(this.duration, 100),
                    cc.fadeTo(this.duration, 255),
                    cc.delayTime(0.1),
                )   
            )
        );
    }


    /**
     * 暂停效果
     */
    public stop():void {
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
