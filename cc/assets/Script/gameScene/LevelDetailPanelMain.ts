import GameConfig from "../GameConfig";
import LevelDetailItemMain from "./LevelDetailItemMain";
import LevelData from "./LevelData";
import GameData from "../GameData";

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
 * 等级详细信息面板
 * 
 */
@ccclass
export default class LevelDetailPanelMain extends cc.Component {

    @property(cc.Prefab)
    itemPrefab:cc.Prefab = null;

    //背景
    @property(cc.Node)
    bg:cc.Node = null;

    //itemsContent
    @property(cc.Node)
    itemsContainer:cc.Node = null;

    @property(cc.ScrollView)
    itemsScroll:cc.ScrollView = null;

    public currentLevelData:LevelData;

    start () {
        // this.currentLevelData.level = 3;
        this.refreshUI();
    }

    // update (dt) {}


    private refreshUI():void {
        let levels:Array<object> = GameConfig.LEVELS;

        let currentLevelY:number;

        for (let i:number = 0; i < levels.length; i++) {
            let item:cc.Node = cc.instantiate(this.itemPrefab);
            cc.info(item, levels[i]);
            let levelData:LevelData = new LevelData();
            levelData.fromObj(levels[i]);

            item.getComponent(LevelDetailItemMain).levelData = levelData;
            item.getComponent(LevelDetailItemMain).currentLevel = this.currentLevelData.level;
            
            item.y = -item.height * i - item.height / 2;
            this.itemsContainer.addChild(item);
            
            this.itemsContainer.height = item.height * (i + 1);

            if (levelData.level == this.currentLevelData.level) {
                currentLevelY = item.y + item.height / 2;
            }
        }


        this.itemsScroll.scrollToOffset(new cc.Vec2(0, -currentLevelY), 2.5);
    }
}
