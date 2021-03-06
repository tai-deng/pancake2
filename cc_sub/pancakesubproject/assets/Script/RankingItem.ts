import WXCore from "./WXCore";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RankingItem extends cc.Component {
    @property(cc.Label)     // 积分
    integral:cc.Label=null;
    @property(cc.Sprite)    // 用户头像
    userPic:cc.Sprite=null;
    @property(cc.Label)     // 用户昵称
    userName:cc.Label=null;
    @property(cc.Sprite)    // 奖牌节点
    medalNode:cc.Sprite = null;
    @property(cc.SpriteFrame)  // 第一名
    medalOne:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)  // 第二名
    medalTwo:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)  // 第三名
    medalThree:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)  // 其他名次奖牌
    medalFour:cc.SpriteFrame = null;
    @property(cc.Label) // 其他名次
    place:cc.Label = null;

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
        if(!this._isOnLoadCalled) return;
        this.refreshUI();
    }

    private refreshUI(){
        // console.log(this.data,"rankingItem")

        this.integral.string = this.data["maxScore"];
        this.userPic.spriteFrame= WXCore.createImage(this.data["avatarUrl"]);

        this.place.string = this.data["rank"];
        this.userName.string = this.data["nickname"];

        if(this.data["rank"] == 1){
            this.medalNode.spriteFrame = this.medalOne;
            this.place.node.color = new cc.Color(255, 0, 0);
        }

        if(this.data["rank"] == 2){
            this.medalNode.spriteFrame = this.medalTwo;
            this.place.node.color = new cc.Color(255, 255, 255);
        }
        
        if(this.data["rank"] == 3){
            this.medalNode.spriteFrame = this.medalThree;
            this.place.node.color = new cc.Color(255, 255, 255);
        }

        if(this.data["rank"] > 3){
            this.medalNode.spriteFrame = this.medalFour;
            this.place.node.color = new cc.Color(255, 255, 255);
            this.place.node.y = 0;
        }
    }
        // update (dt) {}
}
