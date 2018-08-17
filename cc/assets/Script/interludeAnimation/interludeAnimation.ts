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
export default class InterludeAnimation extends cc.Component {

    @property(cc.Animation)
    clickAnim:cc.Animation=null;
    @property(cc.Animation)
    notimeAnim:cc.Animation=null;
    @property(cc.Node)
    surpassNode:cc.Node=null;
    private countDown:number = 3;
    private count:number=0;
    // onLoad () {}

    start () {
        if(!this._isOnLoadCalled) return;
        this.node.on(cc.Node.EventType.TOUCH_END,this.countEvent,this)
        this.schedule(this.onAnimo,1)
    }
    private onAnimo(){
        this.notimeAnim.node.active=true;
        this.clickAnim.node.active=true;
        this.surpassNode.active= false;
        this.notimeAnim.play();
        this.clickAnim.play();
        this.countDown -=1;

        if(this.countDown == 0){
            this.node.off(cc.Node.EventType.TOUCH_END,this.countEvent,this);
            this.unschedule(this.onAnimo);
            this.notimeAnim.stop();
            this.clickAnim.stop();
            this.notimeAnim.node.active=false;
            this.clickAnim.node.active=false;
            this.surpassNode.active= true;
            
            if(this.count>=4){
                // 执行背景图下行 4 动作    1334
                let action = cc.speed(
                    cc.sequence(
                        cc.moveBy(1, 0, -1334*4).easing(cc.easeCubicActionOut()),
                        cc.moveBy(1, 0, 1334*4).easing(cc.easeCubicActionIn()),
                    ), 1);
                this.surpassNode.runAction(action);
            }
            if(this.count == 3){
                let action = cc.speed(
                    cc.sequence(
                        cc.moveBy(1, 0, -1334*3).easing(cc.easeCubicActionOut()),
                        cc.moveBy(1, 0, 1334*3).easing(cc.easeCubicActionIn()),
                    ), 1);
                this.surpassNode.runAction(action);
            }
            if(this.count == 2){
                let action = cc.speed(
                    cc.sequence(
                        cc.moveBy(1, 0, -1334*2).easing(cc.easeCubicActionOut()),
                        cc.moveBy(1, 0, 1334*2).easing(cc.easeCubicActionIn()),
                    ), 1);
                this.surpassNode.runAction(action);
            }
            if(this.count == 1){
                let action = cc.speed(
                    cc.sequence(
                        cc.moveBy(1, 0, -1334).easing(cc.easeCubicActionOut()),
                        cc.moveBy(1, 0, 1334).easing(cc.easeCubicActionIn()),
                    ), 1);
                this.surpassNode.runAction(action);
            }
        }
    }
    private countEvent(){
        this.count += 1;
    }
    // update (dt) {}
}
