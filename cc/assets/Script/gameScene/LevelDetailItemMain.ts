import GameConfig from "../GameConfig";
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
 * 等级详细信息面本item
 * 
 */
@ccclass
export default class LevelDetailItemMain extends cc.Component {

    @property(cc.SpriteFrame)
    currentTitleBGSF:cc.SpriteFrame = null;

    //title bg
    @property(cc.Sprite)
    titleBG:cc.Sprite = null;

    //title
    @property(cc.Label)
    titleLabel:cc.Label = null;
    

    //锅
    @property(cc.Sprite)
    panSprite:cc.Sprite = null;

    //中锅底
    @property(cc.SpriteFrame)
    panSF_m:cc.SpriteFrame = null;
    //小锅底
    @property(cc.SpriteFrame)
    panSF_s:cc.SpriteFrame = null;

    //油
    @property(cc.Sprite)
    oilSprite:cc.Sprite = null;

    //中油
    @property(cc.SpriteFrame)
    oilSF_m:cc.SpriteFrame = null;
    //小油
    @property(cc.SpriteFrame)
    oilSF_s:cc.SpriteFrame = null;

    //火
    @property(cc.Node)
    fireNode:cc.Node = null;


    //锅大小信息
    @property(cc.Label)
    panInfoLabel:cc.Label = null;
    //油信息
    @property(cc.Label)
    oilInfoLabel:cc.Label = null;
    //火信息
    @property(cc.Label)
    fireInfoLabel:cc.Label = null;


    //等级数据
    public levelData:LevelData = null;
    

    //当前等级
    public currentLevel:number = 1;

    // onLoad () {}

    start () {
        this.refreshUI();
    }

    /**
     * 
     */
    private refreshUI():void {
        if (!this._isOnLoadCalled) return;
        if (!this.levelData) return;

        if (this.currentLevel == this.levelData.level) {
            //当前等级
            this.titleLabel.string = "当前等级";
            this.titleBG.spriteFrame = this.currentTitleBGSF;
        } else if (this.currentLevel > this.levelData.level){
            this.titleLabel.string = "等级 " + this.levelData.level;
            this.titleBG.spriteFrame = this.currentTitleBGSF;
            this.titleBG.node.opacity = 160;
        } else {
            this.titleLabel.string = "等级 " + this.levelData.level;
        }

        let panSize:number = this.levelData.panSize;
        if (isNaN(panSize) || panSize == 0) {
            this.panInfoLabel.string = "大";
        } else if (panSize == 1) {
            this.panInfoLabel.string = "中";
            this.panSprite.spriteFrame = this.panSF_m;
            this.oilSprite.spriteFrame = this.oilSF_m;
        } else if (panSize == 2)  {
            this.panInfoLabel.string = "小";
            this.panSprite.spriteFrame = this.panSF_s;
            this.oilSprite.spriteFrame = this.oilSF_s;
        }

        //摩擦系数
        let frictionV:number = this.levelData.friction;
        if (isNaN(frictionV)) frictionV = GameConfig.PANCAKE_FRICTION;
        if (frictionV > GameConfig.PANCAKE_FRICTION) {
            this.oilInfoLabel.string = "大";
            this.oilSprite.node.active = false;
        } else if (frictionV == GameConfig.PANCAKE_FRICTION) {
            this.oilInfoLabel.string = "中";
            this.oilSprite.node.active = true;
        } else if (frictionV < GameConfig.PANCAKE_FRICTION) {
            this.oilInfoLabel.string = "小";
            this.oilSprite.node.active = true;
        }

        //是否有限时
        let tl:Array<number> = this.levelData.timeLimitedValue;
        if (tl && tl.length > 0) {
            this.fireInfoLabel.string = "有";
            this.fireNode.active = true;
        } else {
            this.fireInfoLabel.string = "无";
            this.fireNode.active = false;
        }
    }
}
