// import Json from "../Json/Json";
import StateManage from "../StateManage/StateManage";
import TaskItem from "./TaskItem";
import TaskMode from "./TaskMode";
import Utils from "../gamecore/managers/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Task extends cc.Component {
    private sec:number = 0;
    
    // 任务节点
    @property([cc.Node])
    items:Array<cc.Node> = [];
    // 所有任务
    // private tasks:Array<object> = [];
    // 当前任务
    private currentTask:Array<object> = [];
    private date:Date = new Date();

    
    private _itemData:Array<object>;
    get useData():Array<object> {
        return this._itemData;
    }
    set useData(v:Array<object>) {
        if (this._itemData != v) {
            this._itemData = v;
            this.initTask();
        }
    }

    onLoad () {
        // this.tasks = new Json().tasks;
    }

    start () {
        // this.init();
        if(!this._isOnLoadCalled) return;
        this.useData = TaskMode.instance.handOut();
        TaskMode.instance.on("useDataChanged",this.dataChanged,this);
        Utils.scaleContentAuto(this.node);
    }
    private dataChanged(ev:cc.Event):void{
        this.useData = TaskMode.instance.handOut();
        console.log("数据更新后获取+++++++++++++++++++",this.useData)
    }
    private initTask(){
        if(!this._isOnLoadCalled)return;
        for(let i = 0;i<this.items.length;i++){
            let item:cc.Node = this.items[i] as cc.Node
            item.getComponent(TaskItem)["data"] = this.useData[i];
        }
    }
    /**
     * 定时更新任务
     * 1.获取当前的日期 年月日
     * 2.获取下一天0点的时间戳
     * 3.当前的时间大于这个时间就给一个刷新机会
     * 4.给过机会之后重新获取当前的日期 年月日
     */
    // update (dt) {}
    onDestroy(){
        console.log("生命周期结束!!!!!!")
        TaskMode.instance.setStorageData();
    }
}
