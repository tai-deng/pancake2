import RankCtrl from "./RankCtrl";
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
export default class GameScence extends cc.Component {

    @property(cc.Node)
    userNode:cc.Node=null;
    @property(cc.Sprite)
    userPic:cc.Sprite=null;
    @property(cc.Label)
    point:cc.Label=null;
    @property(cc.Label)
    surpassText:cc.Label=null;
    // onLoad () {}
    private _data:object;
    get data():object{
        return this._data;
    }
    set data(v:object){
        if(this._data != v){
            this._data = v;
            this.refreshUI();
        }
    }

    start () {
        if(!this._isOnLoadCalled) return;
        // this.data = RankCtrl.instance.getDetectionNext();
        RankCtrl.instance.on("onDetectionNextFd",this.onDetectionNext,this);
        console.log("主游戏页面渲染---1",this.data);
    }
    private refreshUI(){
        let data = this.data;
        // if(!this.data["avatarUrl"]) this.node.active = false;
        this.userNode.x = data['posX'] ? data['posX']:0;
        this.userNode.y = data['posY'] ? data['posY']:0;
        if(this.data["avatarUrl"]){
            this.userPic.spriteFrame= WXCore.createImage(this.data["avatarUrl"]);
        }else{
            this.node.active = false;
        }
        this.point.string = data['point'];

        if(data["self"]){
            this.surpassText.string = "超越自我";
        }else{
            this.surpassText.string = "即将超越";
        }
        
        console.log("主游戏页面渲染---2",this.data)
    }
    private onDetectionNext(){
        this.data = RankCtrl.instance.getDetectionNext();
    }
    // update (dt) {}
}
