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
 * 远程图片
 */
@ccclass
export default class Comp_RemoteImage extends cc.Component {

    @property({
        displayName:"图片URL"
    })
    imageURL:string = "";

    // onLoad () {}

    private _sprite:cc.Sprite;

    start () {
        this._sprite = this.node.getComponent(cc.Sprite);
        if (!this._sprite) {
            this._sprite = this.node.addComponent(cc.Sprite);
        }

        if (this.imageURL) {
            this.setImageURL(this.imageURL);
        }

    }

    // update (dt) {}


    public setImageURL(v:string):void {
        this.imageURL = v;

        this._sprite.spriteFrame = WXCore.createImage(this.imageURL);
    }
}
