import Command from "../gamecore/managers/legs/Command";
import LevelDetailPanelMain from "../gameScene/LevelDetailPanelMain";
import GameManager from "../gamecore/managers/GameManager";

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
 * 显示等级详细信息
 */
@ccclass
export default class ShowLevelDetailCommand extends Command {

    
    constructor() {
        super();

        this._prefabURL = "prefabs/gameScene/levelDetailPanel"
    }

    execute() {
        let panel:cc.Node = cc.instantiate(this.prefab);
        panel.getComponent(LevelDetailPanelMain).currentLevelData = this.data;
        
        GameManager.popUpManager.addPopUp(panel, true, true);
    }

}
