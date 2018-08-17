import Command from "../gamecore/managers/legs/Command";
import GameManager from "../gamecore/managers/GameManager";
import AlertMain from "../AlertMain";

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
export default class AlertCommand extends Command {

    constructor() {
        super();

        this._prefabURL = "toast/toast";
    }
   


    execute() {
        let values:Array<any> = this.data;

        let toast:cc.Node = cc.instantiate(this.prefab);
        
        let script:AlertMain = toast.getComponent(AlertMain);
        script.title = values[0];
        script.callbak = values[1];

        GameManager.popUpManager.addPopUp(toast);
    }
}
