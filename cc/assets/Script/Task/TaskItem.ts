
import GameManager from "../gamecore/managers/GameManager";
import GameEventNames from "../GameEventNames";
import StateManage from "../StateManage/StateManage";
import TaskMode from "./TaskMode";
import WXOpenData from "../gamecore/wechat/WXOpenData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TaskItem extends cc.Component {

    // public data:object=null;

    @property(cc.Label)
    taskName:cc.Label = null;
    @property(cc.Label)
    taskDetails:cc.Label = null;
    @property(cc.Label)
    plan:cc.Label = null;
    @property(cc.Node)
    progress:cc.Node = null;
    // 未领取
    @property(cc.Node)
    rewardedBtnY:cc.Node = null;
    // 能领取
    @property(cc.Node)
    rewardedBtnN:cc.Node = null;
    // 进行中
    @property(cc.Node)
    playbar:cc.Node = null;
    // 刷新按钮
    @property(cc.Node)
    refreshBtn:cc.Node = null;

    private _itemData: object;
    get data(): object {
        return this._itemData;
    }
    set data(v: object) {
        if (this._itemData != v) {
            this._itemData = v;
            this.refreshUI();
        }
    }
    // onLoad () {}
    // start () {}
    // 更新UI
    private refreshUI():void{
        let data = this.data;
        this.taskName.string = data["taskContent"]["title"];
        this.taskDetails.string = "任务奖励：宝石×"+data["taskContent"]["awardNum"];
        let selfPlan:number = StateManage.instance.getData(data["taskContent"]["value"]);
        let goal = data["taskContent"]["goal"];

        cc.log("------STATE-----",this.data)
        
        if(this.data["isFinish"]){
            this.playbar.active = false;
            if(this.data["isgaina"]){
                cc.log("不能领取")

                this.plan.string = goal + "/" + goal;
                this.progress.width = 116;

                this.rewardedBtnN.active = true;
                this.rewardedBtnY.active = false;

                if(this.data["tasknum"] >0){
                    this.refreshBtn.active = true;
                }else{
                    this.refreshBtn.active = false;
                }
            }else{
                cc.log("能领取")
                selfPlan = selfPlan > goal ? goal : selfPlan;
                this.plan.string = selfPlan + "/" + goal;
                this.progress.width = (116/goal) * selfPlan;
                this.refreshBtn.active = false;

                this.rewardedBtnY.active = true;
                this.rewardedBtnN.active = false;
                
            }
        }else{
            selfPlan = selfPlan > goal ? goal : selfPlan;
            this.plan.string = selfPlan + "/" + goal;
            this.progress.width = (116/goal) * selfPlan;

            this.playbar.active = true;
            this.rewardedBtnN.active = false;
            this.rewardedBtnY.active = false;
            if(this.data["tasknum"]>0){
                this.refreshBtn.active = true;
            }else{
                this.refreshBtn.active = false;
            }
        }
    }
    /**
     * 完成任务获取指定奖励
     * 任务状态 1 完成了    2 未完成    finish
     * 完成了   1 已领取    2 未领取    gain
     */
    public affirmBtn(event:cc.Event):void{
        GameManager.soundsManager.playTapSound();
        TaskMode.instance.receiveAward(this.data);
        this.refreshUI();
    }
    // 开始游戏或者分享
    public playbarBtn(event:cc.Event):void{
        GameManager.soundsManager.playTapSound();

        cc.director.loadScene("gameScene");
        StateManage.instance.setData(StateManage.KEY_USE_RESURGENCECAR,1);
        WXOpenData.postMessage({"integral":0,"direction":3});
        cc.log("开始游戏或者分享");
    }
    // 刷新任务
    public refresh(){
        let title:string = "";
        let script:TaskItem = this;
        let callback:Function = function(){};
        title = "要分享一次游戏来替换这个任务吗？";
        callback = function(label:string):void {
            cc.info(label)
            if (label == "ok") {
                script.affirm();
            }
            if(label == "off"){}
            GameManager.soundsManager.playTapSound();
        }
        GameManager.eventManager.dispatchEventWith(GameEventNames.SHOW_ALERT, [title, callback]);
        GameManager.soundsManager.playTapSound();
    }
    // 确认更新
    public affirm(){
        GameManager.eventManager.dispatchEventWith(GameEventNames.SHARE_EVENT);
        this.scheduleOnce(()=>{
            TaskMode.instance.refreshTask(this.data);
        },2)
        
    }
    // update (dt) {}

}
