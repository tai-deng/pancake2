const {ccclass, property} = cc._decorator;

import SoundsManager from "./SoundsManager";
import PopUpManager from "./PopUpManager";
import EventManager from "./EventManager";
import LocationValues from "../LocationValues";
import DataManager from "./DataManager";
import ItemManager from "./item/ItemManager";
import Utils from "./Utils";
import Context from "./legs/Context";
import SceneManager from "./scene/SceneManager";

@ccclass
export default class GameManager {

    //版本号
    static gameVersion:string = "1.0";

    //内部版本号
    static gameInternalVersionCode:string;

    //是否是测试
    static isDebug:boolean = false;

    //总事件控制器
    private static _eventManager:EventManager = new EventManager();
    public static get eventManager():EventManager {return GameManager._eventManager};

    //场景管理器
    private static _sceneManager:SceneManager = new SceneManager();
    public static get sceneManager():SceneManager {return GameManager._sceneManager};

    //全局数据管理器
    private static _dataManager:DataManager = new DataManager();
    public static get dataManager():DataManager {return GameManager._dataManager};
    
    //声音管理器
    private static _soundsManager:SoundsManager = new SoundsManager();
    public static get soundsManager():SoundsManager {return GameManager._soundsManager};

    //popup管理器
    private static _popUpManager:PopUpManager = new PopUpManager();
    public static get popUpManager():PopUpManager {return GameManager._popUpManager};

    //道具管理器
    private static _itemManager:ItemManager = new ItemManager();
    public static get itemManager():ItemManager {return GameManager._itemManager};

    //legs框架上下文
    private static _context:Context = new Context();
    public static get context():Context {return GameManager._context};


    //是否已初始化
    private static _initialized:boolean;

    private static init():void {
        if (GameManager._initialized) return;
        GameManager._initialized = true;

        GameManager._canVibrate = true;

        //读取本地数据
        let v:any = cc.sys.localStorage.getItem("__l__gameManager_vibrateoff");
        if (v == "true") {
            GameManager.vibrateOff();
        }

        //检测是否是微信环境
        if (typeof wx == "undefined") GameManager._isOnWX = false;
        else GameManager._isOnWX = true;
    }
    

    private static _temp:any = GameManager.init();


    //是否可震动
    private static _canVibrate:boolean = true;

    /**
     * 获取是否可震动
     */
    static get canVibrate():boolean {
        return GameManager._canVibrate;
    }


    /**关闭震动*/
    static vibrateOff():void {
        if (!GameManager._canVibrate) return;

        GameManager._canVibrate = false;
        cc.sys.localStorage.setItem("__l__gameManager_vibrateoff", true);
    }


    /**
     * 开启震动
     */
    static vibrateOn():void {
        if (GameManager._canVibrate) return;

        GameManager._canVibrate = true;
        cc.sys.localStorage.removeItem("__l__gameManager_vibrateoff");
    }



    private static _isOnWX:boolean = false;

    /**
     * 是否是在微信环境下
     */
    public static get isOnWX():boolean {
        return GameManager._isOnWX;
    }


    private static _todayValue:string;

    /**
     * 获取今日日期值。比如2018-07-07
     */
    public static get todayValue():string {
        if (!GameManager._todayValue) {
            let date:Date = new Date();
            GameManager._todayValue = "" + date.getFullYear();

            GameManager._todayValue += "-";
            let v:number = date.getMonth() + 1;
            GameManager._todayValue += (v < 10) ? ("0" + v) : v;

            GameManager._todayValue += "-";
            v = date.getDate();
            GameManager._todayValue += (v < 10) ? ("0" + v) : v;

        }

        return GameManager._todayValue;
    }


    /**
     * 添加版本信息
     * 
     */
    public static addVersionInfo():void {
        
        cc.info("----  gamecore ----");
        cc.info("-  addVersionInfo   -");

        // if (this._versionInfo) return;
        let n:cc.Node = new cc.Node();
        let label:cc.Label = n.addComponent(cc.Label);
        label.fontSize = 20;
        label.lineHeight = label.fontSize * 1.1;
        if (GameManager.isDebug) n.color = new cc.Color().fromHEX("#ff0000");

        let vStr:string = GameManager.gameVersion;
        if (GameManager.gameInternalVersionCode) {
            vStr += "." + GameManager.gameInternalVersionCode;
        }
        
        if (GameManager.isDebug) vStr += "【测试】"

        label.string = vStr;

        let winSize:cc.Size = cc.director.getWinSize();

        n.anchorX = 0;

        if (Utils.isIphoneX) {
            n.x = 20;
            n.y = winSize.height - label.lineHeight / 2;
        } else {
            n.x = 0;
            n.y = winSize.height - label.lineHeight / 2;
        }
        
        cc.director.getScene().addChild(n);
    }
    
}
