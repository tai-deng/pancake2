import StateManage from "../StateManage/StateManage";
import GameManager from "../gamecore/managers/GameManager";
import GameEventNames from "../GameEventNames";
import LevelData from "./LevelData";

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
 * 游戏等级信息
 */
@ccclass
export default class LevelInfoMain extends cc.Component {

    //进度条
    @property(cc.Sprite)
    progressSprite:cc.Sprite = null;

    //等级名称
    @property(cc.Label)
    levelName:cc.Label = null;

    //等级详情
    @property(cc.Label)
    levelDetail:cc.Label = null;

    //红点提示节点
    @property(cc.Node)
    redPointNode:cc.Node = null;

    //升级小特效
    @property(cc.Animation)
    levelUpAni:cc.Animation = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        cc.info("【LevelInfoMain start】");

        this.node.on(cc.Node.EventType.TOUCH_END, this.tapHandler, this);
    }



    private tapHandler(e:cc.Event):void {
        //音效
        GameManager.soundsManager.playTapSound();

        //不再提示红点
        this.redPointNode.active = false;
        
        GameManager.eventManager.dispatchEventWith(GameEventNames.SHOW_LEVEL_DETAIL, this._levelData);
    }


    private _score:number = 0;

    /**
     * 设置分数
     */
    public set score(value:number) {
        if (this._score == value) return;
        this._score = value;

        this.refreshUI();
    }

    private _levelData:LevelData;

    /**
     * 设置等级信息
     */
    public set levelData(value:LevelData) {
        if (!value) return;
        this._levelData = value;

        this.refreshUI();
        this.redPointNode.active = true;
    }


    /**
     * 刷新UI
     */
    private refreshUI():void {
        if (!this._levelData) {
            return;
        }

        // cc.info(JSON.stringify(this._levelData));

        this.levelName.string = "等级 " + this._levelData.level;
        
        this.levelDetail.string = this._levelData.desc;
        
        //显示进度
        this.progressSprite.fillRange = (this._score - this._levelData.minScore) / (this._levelData.maxScore - this._levelData.minScore + 1);
    }



    // update (dt) {}


    onDestroy() {

    }
}
