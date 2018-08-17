import Command from "../gamecore/managers/legs/Command";
import GameManager from "../gamecore/managers/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShareFdCommand extends Command {
    constructor(){
        super();
        this._prefabURL = "shareFD/sharePanel";
    }

    public execute(){
        let node:cc.Node = cc.instantiate(this.prefab);
        GameManager.popUpManager.addPopUp(node, true, true);
    }
}
