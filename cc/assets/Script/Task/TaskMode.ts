import StateManage from "../StateManage/StateManage";
import TaskJson from "./TaskJson";
import TaskProto from "./TaskProto";
import WXCore from "../gamecore/wechat/WXCore";


const {ccclass, property} = cc._decorator;

@ccclass
export default class TaskMode extends cc.Node {
    constructor(){
        super();
        this.initTaskData();
        StateManage.instance.on("change", this.stateChangeHandler, this);
    }

    private static _instance:TaskMode = null;
    public static get instance():TaskMode {
        if(!TaskMode._instance) TaskMode._instance = new TaskMode();
        return  TaskMode._instance;
    }

    private _storageTaskData:Array<object>=[];
    private _taskDataJson:Array<object>= new TaskJson().task;
    private _useData:Array<object>=[];
    private date:Date = new Date();
    public  flicker:number = 2;
    // 初始化渲染数据
    private initTaskData(){
        let data = StateManage.instance.getData(StateManage.KEY_TASKDATA);
        console.log("获取storage+++++++++",data)
        if(JSON.stringify(data) == "{}"){
            this.creation();
        }else{
            this._useData = data;
        }
    }
    // 创建任务实例
    private create(){
        while (true){
            let length = this._taskDataJson.length;
            let ind = Math.floor(Math.random() * length);
            ind = ind == length ? length - 1 : ind;
            let item = this._taskDataJson[ind];
            
            let hasSame:boolean = false;
            for(let i = 0;i < this._useData.length;++i){
                if(this._useData[i]["taskContent"]['id'] == item['id']) {
                    hasSame = true;
                    break;
                }
            }
            if (!hasSame) {
                let task = new TaskProto();
                task["taskContent"] = item;
                this.rezreo(item["value"]);
                this._useData.push(task);
                if(this._useData.length>3){
                    this._useData.splice(3, 1);
                }
                return task;
            }
        }
    }
    // 任务数据归零
    private rezreo (el:string){
        console.log("-------------归零----------",el)
        switch(el){
            case "overturn":
            StateManage.instance.setData(StateManage.KEY_OVERTURN,0);
            break;
            case "tagem":
            StateManage.instance.setData(StateManage.KEY_TAGEM,0);
            break;
            case "turn":
            StateManage.instance.setData(StateManage.KEY_TURN,0);
            break;
            case "tmturn":
            StateManage.instance.setData(StateManage.KEY_TMTURN,0);
            break;
            case "tagrade":
            StateManage.instance.setData(StateManage.KEY_TAGRADE,0);
            break;
            case "resurgenceCar":
            StateManage.instance.setData(StateManage.KEY_RESURGENCECAR,0);
            break;
            case "fdrelay":
            StateManage.instance.setData(StateManage.KEY_FDRELAY,0);
            break;
            case "crazyTap":
            StateManage.instance.setData(StateManage.KEY_CRAZYTAP,0);
            break;
            case "anyShare":
            StateManage.instance.setData(StateManage.KEY_ANYSHARE,0);
            break;
            case "ripeShare":
            StateManage.instance.setData(StateManage.KEY_RIPESHARE,0);
            break;
        }
    }
    // 创建任务数量
    private creation(){
        for(let i =0;i<3;i++){
            this.create();
        }
    }
    public handOut(){
        return this._useData.concat();
    }
    // 功能1 看视频 刷新任务
    public refreshTask(task:object){
        let data = this._useData;
        for(let i = 0;i < data.length;i++){
            if(data[i]["taskContent"]["id"] == task["taskContent"]["id"]){
                this._useData[i] = this.create();
                this._useData[i]["isgaina"] = false;
                this._useData[i]["isFinish"] = false;
                this._useData[i]["tasknum"] = 0;
            }
        }
        console.log(data,"**********************")
        this.dispatchEvent(new cc.Event("useDataChanged", false));
    }
    // 功能2 开始游戏或分享
    public watchVideo(task:object){
        console.log("开始游戏或分享")
        this.dispatchEvent(new cc.Event("useDataChanged", false));
    }
    // 功能3 领取奖励
    public receiveAward(task:object){
        let data = this._useData;
        let awardName = task["taskContent"]["awardName"];
        let awardNum = task["taskContent"]["awardNum"];
        WXCore.showToast(`获得 宝石 ×${awardNum}`);
        awardNum = awardNum + StateManage.instance.getData(awardName);
        StateManage.instance.setData(awardName,awardNum);
        let flag:number = 0;

        for(let i =0;i<data.length;i++){
            if(data[i]["taskContent"]["id"] == task["taskContent"]["id"]){
                this._useData[i]["isgaina"]=true;
                this._useData[i]["isFinish"]=true;
                this._useData[i]["tasknum"]=0;
                // this.rezreo(this._useData[i]["taskContent"]["value"]);
            }
            console.log("++++++++++",this._useData[i]["isFinish"])
            if(this._useData[i]["isgaina"]){
                flag+=1;
            }
        }

        console.log(data,"------------",flag)

        if(flag >= 3){
            this.flicker=1;
            this.dispatchEvent(new cc.Event("bubbleChanged",false));
        }
        console.log("领取完成************",this._useData)
        // this.setStorageData();
        this.dispatchEvent(new cc.Event("useDataChanged", false));
    }
    // 功能4 完成任务
    public finishTask(task:object){
        let data = this._useData;
        /* for(let i =0;i<data.length;i++){
            if(data[i]["taskContent"]["id"] == task["taskContent"]["id"]){
                this._useData[i]["isgaina"]=false;
                this._useData[i]["isFinish"]=true;
                this._useData[i]["tasknum"]=0;
                this._useData[i]["tasknum"]= this._useData[i]["tasknum"]-1;
            }
        }
        cc.log(this._useData)
        this.dispatchEvent(new cc.Event("useDataChanged", false)); */
    }
    // 功能5 刷已经完成的任务
    public refreshDoneTask(){
        let data = this._useData;
        for(let i = 0;i < data.length;i++){
            if(data[i]["isgaina"] && data[i]["isFinish"]){
                console.log("刷新已完成的任务!!!!!!!!!!!!!!!!!!!!!!!!!!!!",this._useData)
                this._useData[i] = this.create();
                this._useData[i]["isgaina"] = false;
                this._useData[i]["isFinish"] = false;
            }
        }
        this.dispatchEvent(new cc.Event("useDataChanged", false));
    }
    // 功能6 定时更新任务
    public setTimeDay(){
        let nextDay = StateManage.instance.getData(StateManage.KEY_NEXTDAY);
        // let today = StateManage.instance.getData(StateManage.KEY_TODAY);

        // today = this.date.getTime();
        // 没有目标时间的时候
        if(nextDay == 0){
            this.renewal();
        }else if(new Date().getTime() > nextDay){
            this.newNextDay()
        }
    }
    // 创建目标时间
    public renewal(){
        let time = new Date().getTime();
        let newDate = new Date(time+86400000);
        newDate.setHours(0,0,0);
        let nextDay = newDate.getTime();
        StateManage.instance.setData(StateManage.KEY_NEXTDAY,nextDay);
    }
    // 更新目标时间
    public newNextDay(){
        let time = new Date().getTime();
        let newDate = new Date(time+86400000);
        newDate.setHours(0,0,0);
        let nextDay = newDate.getTime();
        StateManage.instance.setData(StateManage.KEY_NEXTDAY,nextDay);
        this.refreshDoneTask();
    }
    // 保存使用中的任务到
    public setStorageData(){

        console.log("setData",this._useData)
        StateManage.instance.setData(StateManage.KEY_TASKDATA, JSON.parse(JSON.stringify(this._useData)));
        console.log("getData",StateManage.instance.getData(StateManage.KEY_TASKDATA))
    }
    
    // 数据值监控
    private stateChangeHandler(e:cc.Event):void {
        let key:string = StateManage.instance.lastChangedKey;
        for(let i =0;i < this._useData.length;i++){
            if(key == this._useData[i]["taskContent"]["value"]){
                let current = StateManage.instance.getData(StateManage.instance.lastChangedKey);
                let want = this._useData[i]["taskContent"]["goal"];
                console.log("~~~~~~~~~STATE~~~~~~~~~~",this._useData[i]["isgaina"])
                if(!this._useData[i]["isgaina"]){
                    if(current >= want){
                        this._useData[i]["isFinish"] = true;
                        this._useData[i]["isgaina"] = false;
                        this.dispatchEvent(new cc.Event("useDataChanged", false));
                        this.flicker=3;
                    }else{
                        this.flicker=2;
                    }
                    this.dispatchEvent(new cc.Event("bubbleChanged",false));
                    console.log(this._useData,"this._flicker",this.flicker)
                }else{
                    console.log("已经领取~~~~~~~~~~~~~~~~~~~~~~~~~~~")
                }
                // this.setStorageData();
            }
        }
    }
}
