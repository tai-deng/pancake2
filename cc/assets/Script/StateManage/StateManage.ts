import GameManager from "../gamecore/managers/GameManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class StateManage extends cc.Node {

    static KEY_SHOPDATA:string = "shopdata"             // 商品数据
    static KEY_TASKDATA:string = "taskdata"             // 任务数据
    static KEY_SKINPOT:string = "skinPot";              // 锅皮肤
    static KEY_SKINCAKE:string = "skinCake";            // 饼皮肤
    static KEY_SCORE:string = "score";                  // 得分
    static KEY_ISOVER:string = 'isOver';                // 是否结束
    static KEY_GEM:string = "gem"                       // 宝石数量
    // static KEY_RESURGENCECARDNUM:string= "resurgenceCardNum"    // 复活卡数量
    static KEY_MAXSCORE:string = "maxscore"             // 最高分
    static KEY_USEINFO:string = 'userinfo'              // 用户信息
    static KEY_TAGEM:string = "tagem"                   // 钻石任务
    static KEY_TAGRADE:string = "tagrade"               // 等级任务
    static KEY_OVERTURN:string = "overturn"             // 翻转次数
    
    static KEY_TURN:string = "turn"                     // 一周转体次数
    static KEY_TMTURN:string = "tmturn"                 // 十秒内翻转次数
    static KEY_GRADE:string = "grade"                   // 等级
    static KEY_RESURGENCECAR:string = "resurgenceCar"   // 累计使用复活卡次数
    static KEY_FDRELAY:string = "fdrelay"               // 好友接力数量
    static KEY_CRAZYTAP:string = "crazyTap"             // 疯狂点击中点次数
    static KEY_ANYSHARE:string = "anyShare"             // 累计任意分享
    static KEY_RIPESHARE:string = "ripeShare"           // 煎烤好友并分享
    static KEY_NEXTDAY:string = "nextDay"               // 第二天 0 点
    static KEY_TODAY:string = "today"                   // 现在的时间
    static KEY_VOICESWITCH:string = "voiceSwitch"       // 声音状态
    static KEY_RANKBUBBLE:string = "rankbubble"         // 排行气泡
    static KEY_MIDNIGHT:string = "isMidnight"           // 是否午夜更新 
    static KEY_USE_RESURGENCECAR:string = "userResurgenceCar"   // 使用复活卡

    public shopdata:object={};
    public taskdata:object={};
    public resurgenceCardNum:number=0;
    public maxscore:number = 0;
    public userinfo:object = {};
    public skinPot:object={};
    public skinCake:object={};
    public score:string = "0";
    public isOver:number = 2;
    public gem:number = 0;

    public overturn:number = 0;
    public turn:number = 0;
    public tmturn:number = 0;
    public grade:number = 0;
    public resurgenceCar:number = 0;
    public fdrelay:number = 0;
    public crazyTap:number = 0;
    public anyShare:number = 0;
    public ripeShare:number = 0;
    public nextDay:number = 0;
    public currentTask:Array<object> = [];
    public tagrade:number = 0;
    public tagem:number = 0;
    public isMidnight:number = 0;
    public today:number = 0;
    public rankbubble:boolean=true;
    public voiceSwitch:boolean=true;
    public userResurgenceCar:number = 1;

    private static _instance:StateManage = null;

    public static get instance():StateManage {
        if (!StateManage._instance) StateManage._instance = new StateManage();
        
        return StateManage._instance;
    }

    private _lastChangedKey:string;

    /**
     *  被修改的 KEY
     */
    public get lastChangedKey():string {
        return this._lastChangedKey;
    }

    
    // KEY 抛出改变事件
    public setData(key:string, value:any){

        // if (this[key] !== value && this[key] != void 0) {
            this[key] = value;
            this._lastChangedKey = key;

            if(key == "rankbubble"||key == "userResurgenceCar" || key == 'userinfo'){
                GameManager.dataManager.setData(key,value);
            }else{
                GameManager.dataManager.setData(key, value, true);
                // cc.info("set data", key, value)
            }
            
            this.dispatchEvent(new cc.Event("change", false));
        // }
    }
    // 获取状态
    public getData(key:string){
        let storage = GameManager.dataManager.getData(key);
        if(storage == undefined || storage == null){
            return this[key];
        }

        return storage;
    }
}
