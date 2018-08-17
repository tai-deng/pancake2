import DeerGameConfig from "./DeerGameConfig";

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

const BASE_URL:string = "https://deer-cdn.youkongwan.com"

/**
 * 小鹿游戏
 */
@ccclass
export default class DeerGame {

    private static _initialized:boolean = false;
    /**
     * 初始化
     * 
     * 
     * @param 
     */
    public static init(gameID:string, 
                       configURL:string = null):void {

        if (DeerGame._initialized === true) return;
        DeerGame._initialized = true;


        if (configURL == null) configURL = BASE_URL + "/game/" + gameID + "/config.json";
        DeerGame._gameConfig = new DeerGameConfig(configURL);
        // DeerGame._gameConfig.loadData(configURL);
    }


    private static _gameID:string;

    /**
     * 获取游戏ID
     * 
     */
    public static get gameID():string {
        return DeerGame._gameID;
    }

    private static _gameConfig:DeerGameConfig;


    /**
     * 游戏配置
     */
    public static get gameConfig():DeerGameConfig {
        return DeerGame._gameConfig;
    }
}
