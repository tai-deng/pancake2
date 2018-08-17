
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameEventNames {

    //显示alert面板
    static SHOW_ALERT:string = "showAlert";

    //游戏结束
    static GAME_OVER:string = "gameOver";

    //显示等级详细信息
    static SHOW_LEVEL_DETAIL:string = "showLevelDetail";
    
    // 显示保存图片面板
    static SHOW_SHAREFD:string = "shareFd";

    // 分享朋友圈事件
    static SHARE_EVENT:string = "shareEvent";

    // 分享接力事件
    static SHARE_RELAY_EVENT:string = "shareRelayEvent";

    // 展示复活卡面板
    static SHOW_RESURGENCE:string = "showResurgence";

    // 展示任务面板
    static SHOW_TASK:string = "showTask";

}
