import WXCore from "./WXCore";

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
export default class SmallItem extends cc.Component {

    

    @property(cc.Label)     // 积分
    integral:cc.Label=null;
    @property(cc.Sprite)    // 用户头像
    userPic:cc.Sprite=null;
    @property(cc.Node)     // 用户昵称
    selfBg:cc.Node=null;

    @property(cc.Sprite)       // 奖牌节点
    rankNode:cc.Sprite=null;
    @property(cc.SpriteFrame)  // 第一名
    selfOne:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)  // 第二名
    selfTwo:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)  // 第三名
    selfThree:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)  // 其他名次奖牌
    selfFour:cc.SpriteFrame = null;
    @property(cc.Label) // 其他名次
    selfPlace:cc.Label = null;

    private _data:object;
    get data():object {
        return this._data;
    }
    set data(v:object) {
        if(this._data != v){
            this._data = v;
            this.refreshUI();
        }
    }

    // onLoad () {}

    start () {
        if(!this._isOnLoadCalled)return;
        this.refreshUI();
        // console.log("小排行榜数据渲染",this.data)
    }
    private refreshUI(){
        this.integral.string = this.data["maxScore"];
        
        this.userPic.spriteFrame= WXCore.createImage(this.data["avatarUrl"]);


        this.selfPlace.string = this.data["rank"];
        
        if(this.data["rank"] == 1){
            this.rankNode.spriteFrame = this.selfOne;
            this.rankNode.node.color = new cc.Color(255, 0, 0);
        }

        if(this.data["rank"] == 2){
            this.rankNode.spriteFrame = this.selfTwo;
            this.rankNode.node.color = new cc.Color(255, 255, 255);
        }
        
        if(this.data["rank"] == 3){
            this.rankNode.spriteFrame = this.selfThree;
            this.rankNode.node.color = new cc.Color(255, 255, 255);
        }

        if(this.data["rank"] > 3){
            this.rankNode.spriteFrame = this.selfFour;
            this.rankNode.node.color = new cc.Color(255, 255, 255);
            this.selfPlace.node.y = 0;
        }

        if(this.data["isSelf"]){
            this.selfBg.active = true;
        }else{
            this.selfBg.active = false;
        }
    }

    // update (dt) {}
}
