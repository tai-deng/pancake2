import { Bounce, Elastic } from "../libs/EasePack";
import GameManager from "../managers/GameManager";
import XYJAPI from "./XYJAPI";
import WXCore from "../wechat/WXCore";

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
 * 广告按钮
 */

@ccclass
export default class AdButton extends cc.Component {

    /**
     * 动画间隔
     */
    effectDelay:number = 3;

    start () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.tapHandler, this);

        this.showEffect();

        this.schedule(this.getAdData, 2, 1);

        //默认不可见
        // this.node.active = false;
        this.node.opacity = 0;
    }

    /**
     * {
     *      imageurl: "https://ball.yz071.com/Upload/image/2018-06-06/P_15282657218141544.jpg ", 
     *      title: "篮球大作战", 
     *      bili: "4:3"
     * }
     */
    private _adData:object;

    private getAdData():void {
        cc.info("get ad data");
        if (this._adData) return;

        //请求数据
        let script:AdButton = this;
        XYJAPI.getAdImageData(function(data:object):void {
            if (data && data["imageurl"]) {
                script._adData = data;
                //script.node.active = true;
                script.node.opacity = 255;
            }
        });

        this.schedule(this.getAdData, 3, 1);
    }


    // update (dt) {}

    /**
     * 广告按钮点击
     * @param e 
     */
    private tapHandler(e:cc.Event.EventTouch):void {
        if (this.node.opacity < 10) return;
        
        GameManager.soundsManager.playTapSound();

        //预览图片
        if (this._adData) {
            WXCore.previewImage([this._adData["imageurl"]]);
        }
    }


    /**
     * 播放效果
     */
    private showEffect():void {
        this.node.stopAllActions();
        
        if (this._adData) {
            if (Math.random() > 0.5) {
                this.effectZoom();
            } else {
                this.effectShake();
            }
        }

        this.schedule(this.showEffect, this.effectDelay + Math.random(), 1);
    }


    private shakeTween:any;

    /**
     * 晃动
     */
    private effectShake():void {
        let toR:number = (40 + Math.random() * 10) * (Math.random() > 0.5 ? 1 : -1);
        
        // let cc.sequence(cc.rotateTo(0.5, toR));
        let act:cc.ActionInterval = cc.sequence(
            cc.rotateTo(0.5, toR),
            cc.rotateTo(0.5, 0).easing(cc.easeBounceOut())
        )

        this.node.runAction(act);
    }


    /**
     * 缩放
     */
    private effectZoom():void {
        let toS:number = 0.6 + Math.random() * 0.2;

        // let cc.sequence(cc.rotateTo(0.5, toR));
        let act:cc.ActionInterval = cc.sequence(
            cc.scaleTo(0.5, toS),
            cc.scaleTo(0.5, 1).easing(cc.easeBounceOut())
        )

        this.node.runAction(act);
    }


    onDestroy() {
        this.node.stopAllActions();

        this.unschedule(this.showEffect);
        this.unschedule(this.getAdData);
    }
}
