import GameManager from "./gamecore/managers/GameManager";
import GameEventNames from "./GameEventNames";
import GameOverCommand from "./commands/GameOverCommand";
import XYJAPI from "./gamecore/xiaoyaoji/XYJAPI";
import ShowLevelDetailCommand from "./commands/ShowLevelDetailCommand";
import ShareFdCommand from "./commands/ShareFdCommand";
import ShareEventCommand from "./commands/ShareEventCommand";
import ShareRelayCommand from "./commands/ShareRelayCommand";
import ResurgenceCommand from "./commands/ResurgenceCommand";
import AlertCommand from "./commands/AlertCommand";
import ShowTaskCommand from "./commands/ShowTaskCommand";

const {ccclass, property} = cc._decorator;

/**
 * 整个游戏系统管理器
 */

@ccclass
export default class GameSystem {

    //剪切板内容
    public static clipboardContent:string;

    private static _initialized:boolean;

    /**
     * 初始化系统
     */
    public static init():void {
        cc.info("【GameSystem】init");
        //游戏版本号
        GameManager.gameVersion = "1.0";
        GameManager.gameInternalVersionCode = "0725";
        // GameManager.isDebug = true;
        GameManager.addVersionInfo();


        if (GameSystem._initialized === true) return;
        GameSystem._initialized = true;

        //初始化小幺鸡API
        // XYJAPI.channelID = "1008";
        XYJAPI.gameVersion = GameManager.gameVersion;
        XYJAPI.init('1008');
        
        // cc.game.setFrameRate(40);

        //初始化点击音效
        GameManager.soundsManager.tapSoundSource = "resources/sounds/tap.mp3";
        //背景音乐
        GameManager.soundsManager.pushSceneBgMusic("resources/sounds/bgm.mp3");
        GameManager.soundsManager.musicVolume = 0.5;

        // GameManager.soundsManager.unmuteMusic();

        //绑定事件到命令
        GameManager.context.mapEvent(GameEventNames.GAME_OVER, GameOverCommand);
        GameManager.context.mapEvent(GameEventNames.SHOW_LEVEL_DETAIL, ShowLevelDetailCommand);

        // 绑定分享到朋友圈面板
        GameManager.context.mapEvent(GameEventNames.SHOW_SHAREFD, ShareFdCommand);

        // 分享事件
        GameManager.context.mapEvent(GameEventNames.SHARE_EVENT,ShareEventCommand);

        // 分享接力事件
        GameManager.context.mapEvent(GameEventNames.SHARE_RELAY_EVENT,ShareRelayCommand);

        // 复活卡面板
        GameManager.context.mapEvent(GameEventNames.SHOW_RESURGENCE,ResurgenceCommand);
        // 綁定弹窗事件到命令
        GameManager.context.mapEvent(GameEventNames.SHOW_ALERT, AlertCommand);
        // 任务系统
        GameManager.context.mapEvent(GameEventNames.SHOW_TASK, ShowTaskCommand);


        //获取剪贴板内容
        // GameSystem.clipboardContent = "b5KAzIirRLBqaoXLmN9roF";
        if (typeof wx != "undefined") {

            console.log("-----onShowBefore-----")
            wx.onShow (function(ops){
                console.log("-----onShow-index-----",ops);
                wx.getClipboardData({
                    success:function(res) {
                        cc.info("【GameSystem】", res);
                        let content:string = "" + res["data"];
                        if (content) {
                            GameSystem.clipboardContent = content;
                        }
                    }
                });
            })

            // wx.onHide (function(ops){
            //     console.log("-----onHide-index-----",ops)
            // })

            wx.getClipboardData({
                success:function(res) {
                    cc.info("【GameSystem】", res);
                    let content:string = "" + res["data"];
                    if (content) {
                        GameSystem.clipboardContent = content;
                    }
                }
            });
        }
    }
}
