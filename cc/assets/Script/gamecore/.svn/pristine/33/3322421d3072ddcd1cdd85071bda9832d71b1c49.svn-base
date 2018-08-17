import GameManager from "../GameManager";

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
 * 加载场景脚本
 */

@ccclass
export default class LoadingSceneMain extends cc.Component {

    //title节点
    @property({
        type:cc.Node,
        displayName:"title节点"
    })
    titleNode:cc.Node = null;

    //icon节点
    @property({
        type:cc.Node,
        displayName:"icon节点"
    })
    iconNode:cc.Node = null;

    //logo节点
    @property({
        type:cc.Node,
        displayName:"logo节点"
    })
    logoNode:cc.Node = null;

    // onLoad () {}


    start () {
        //如果有设置icon节点，显示时，让icon缓慢显示
        if (this.iconNode) {
            this.iconNode.opacity = 0;
            this.iconNode.runAction(cc.sequence(
                cc.delayTime(0.1),
                cc.fadeTo(0.5, 255)
            ));
        }

        if (this.logoNode) {
            this.logoNode.opacity = 0;
            this.logoNode.runAction(
                cc.fadeTo(0.3, 255)
            );
        }
    }



    /**
     * 销毁前操作。这里会做一些动画
     */
    public doPreDestory(duration:number = 0):void {
        if (duration <= 0) return;

        if (this.titleNode) {
            this.titleNode.stopAllActions();
            this.titleNode.runAction(cc.fadeTo(duration, 0));
        }

        if (this.iconNode) {
            this.iconNode.stopAllActions();
            this.iconNode.runAction(cc.fadeTo(duration, 0));
        }

        if (this.logoNode) {
            this.logoNode.stopAllActions();
            let winSize:cc.Size = cc.director.getWinSize();
            this.logoNode.runAction(cc.moveTo(duration, this.logoNode.x, -winSize.height / 2 - this.logoNode.height));
        }

        // this.node.stopAllActions();
        // this.node.runAction(cc.fadeTo(0.3, 0));
    }


    // update (dt) {}


    onDestroy() {
        this.node.stopAllActions();

        if (this.titleNode) {
            this.titleNode.stopAllActions();
        }

        if (this.iconNode) {
            this.iconNode.stopAllActions();
        }

        if (this.logoNode) {
            this.logoNode.stopAllActions();
        }
    }
}
