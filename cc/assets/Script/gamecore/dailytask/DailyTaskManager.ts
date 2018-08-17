import DailyTaskBase from "./DailyTaskBase";
import DailyTaskConfig from "./DailyTaskConfig";
import DailyTaskEventType from "./DailyTaskEventType";


const {ccclass, property} = cc._decorator;

/**
 * 每日任务管理器
 */
@ccclass
export default class DailyTaskManager extends cc.Node {

    //本地保存的键名称
    private static KEY_NAME:string = "__taskmanager_refresh_date";

    private static _instance:DailyTaskManager;

    /**
     * 获取每日任务管理器单例
     * 
     */
    public static get instance():DailyTaskManager {
        if (!DailyTaskManager._instance) {
            new DailyTaskManager();
        }

        return DailyTaskManager._instance;
    }

    constructor() {
        super();
        if (DailyTaskManager._instance) throw new Error("Please use DailyTaskManager.instance");

        DailyTaskManager._instance = this;


        this.refreshTask();
    }



    /**
     * 今日任务
     */
    private _todayTasks:Array<DailyTaskBase> = [];


    /**
     * 获取今日任务
     */
    public get todayTasks():Array<DailyTaskBase> {
        return this._todayTasks.concat();
    }



    /**
     * 刷新任务
     */
    public refreshTask():void {
        //获取上次刷新时间
        let now:Date = new Date();
        let todayV:string = "" + now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate();
        let refreshDate:string = cc.sys.localStorage.getItem(DailyTaskManager.KEY_NAME);
        if (refreshDate === todayV) return;
        
        let hasChange:boolean = false;

        while(this._todayTasks.length > DailyTaskConfig.MAX_COUNT) {
            this._todayTasks.pop();
            hasChange = true;
        }

        while(this._todayTasks.length < DailyTaskConfig.MAX_COUNT) {
            this._todayTasks.push(this.createNewTask());
            hasChange = true;
        }

        if (hasChange) {
            //记录任务刷新日期
            cc.sys.localStorage.setItem(DailyTaskManager.KEY_NAME, todayV);

            this.dispatchEvent(new cc.Event(DailyTaskEventType.TODAY_TASK_CHANGED, false));
        }
    }


    /**
     * 创建一个新的任务
     */
    private createNewTask():DailyTaskBase {
        return null;
    }


    
    /**
     * 重置
     * 
     */
    public reset():void {
        cc.sys.localStorage.removeItem(DailyTaskManager.KEY_NAME);

        this._todayTasks = [];
        this.refreshTask();
    }
}
