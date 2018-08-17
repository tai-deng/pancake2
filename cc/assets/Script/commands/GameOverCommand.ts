
import Command from "../gamecore/managers/legs/Command";
import GameManager from "../gamecore/managers/GameManager";

const {ccclass, property} = cc._decorator;

/**
 * 
 */
@ccclass
export default class GameOverCommand extends Command {

    constructor() {
        super();

        this._prefabURL = "prefabs/gameScene/gameOverPanel";
    }
    

    execute() {
        let panel:cc.Node = cc.instantiate(this.prefab);
        console.log("--------over-------")
        GameManager.popUpManager.addPopUp(panel, true, false);
    }
}
