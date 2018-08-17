import GameManager from "../gamecore/managers/GameManager";
import GameEventNames from "../GameEventNames";
import AlertCommand from "../commands/AlertCommand";
import StateManage from "../StateManage/StateManage";
import TaskMode from "../Task/TaskMode";
import WXCore from "../gamecore/wechat/WXCore";
import ResurgenceCtrl from "../resurgence/ResurgenceCtrl";
import XYJAPI from "../gamecore/xiaoyaoji/XYJAPI";
import GameSystem from "../GameSystem";
import Utils from "../gamecore/managers/Utils";
import XYJEventNames from "../gamecore/xiaoyaoji/XYJEventNames";
import WXOpenData from "../gamecore/wechat/WXOpenData";
import WXUtils from "../gamecore/wechat/WXUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class index extends cc.Component {

    //标题节点
    @property(cc.Node)
    titleNode:cc.Node = null;

    @property(cc.Node)
    starBar:cc.Node = null;
    @property(cc.Node)
    luckyMoneyBar:cc.Node = null;
    @property(cc.Node)
    rankingBar:cc.Node = null;
    @property(cc.Node)
    resurgenceBar:cc.Node = null;
    @property(cc.Node)
    shoppingBar:cc.Node = null;
    @property(cc.Node)
    soundBar:cc.Node = null;
    @property(cc.Node)
    taskBar:cc.Node = null;
    @property(cc.SpriteFrame)
    voiceON:cc.SpriteFrame=null;
    @property(cc.SpriteFrame)
    voiceOFF:cc.SpriteFrame=null;
    @property(sp.Skeleton)
    spine:sp.Skeleton=null;
    private sec:number = 0;

    // onLoad () {}

    // private _tasks:Array<object>=[];

    

    start () {
        GameSystem.init();


        //布局标题节点
        Utils.scaleContentAuto(this.titleNode);

        // 任务进度监听
        TaskMode.instance.on("bubbleChanged",this.bubbleChanged,this)

        this.starBar.on(cc.Node.EventType.TOUCH_END,this.onStartGame,this);
        this.luckyMoneyBar.on(cc.Node.EventType.TOUCH_END,this.onLuckyMoney,this);
        this.rankingBar.on(cc.Node.EventType.TOUCH_END,this.onRanking,this);
        this.resurgenceBar.on(cc.Node.EventType.TOUCH_END,this.onResurgence,this);
        this.shoppingBar.on(cc.Node.EventType.TOUCH_END,this.onShopping,this);
        this.soundBar.on(cc.Node.EventType.TOUCH_END,this.onSound,this);
        this.taskBar.on(cc.Node.EventType.TOUCH_END,this.onTask,this);

        this.initSystem();
        this.refreshUI();
        this.schedule(function() {
            this.spineAnimation();
        }, this.interval);

        // GameManager.eventManager.dispatchEventWith(GameEventNames.SHARE_RELAY_EVENT);

        //监听小幺鸡接口事件
        GameManager.eventManager.on(XYJEventNames.EVENT_READY, this.xyjAPIReadyHandler, this);
        GameManager.eventManager.on(XYJEventNames.EVENT_INIT_FAILED, this.xyjAPIReadyHandler, this);
    }


    /**
     * XYJAPI 获得数据
     * @param e 
     */
    private xyjAPIReadyHandler(e:cc.Event):void {
        GameManager.eventManager.off(XYJEventNames.EVENT_READY, this.xyjAPIReadyHandler, this);
        GameManager.eventManager.off(XYJEventNames.EVENT_INIT_FAILED, this.xyjAPIReadyHandler, this);

        let userInfo:object = XYJAPI.userInfo;
        if (userInfo) {
            StateManage.instance.setData(StateManage.KEY_USEINFO, userInfo)
    
            WXOpenData.postMessage({"userInfo":userInfo});
            console.log("传用户信息",userInfo)
        } else {
            console.log("无法获得用户信息")//TODO:NEXT
        }
    }

    private static _systemInitialized:boolean;
    // 任务气泡
    private _flicker:number=TaskMode.instance.flicker;
    // 排行气泡动画,默认进入游戏就会闪,查看后停止
    private _rankBubble:boolean=StateManage.instance.getData(StateManage.KEY_RANKBUBBLE);
    private interval:number=5;

    // spine ainimation
    private spineAnimation(){
        let arr = ["interlude","toppot"]
        let index = Math.floor(Math.random()*2);
        if(index == 2) index = 1;
        
        this.spine.animation=arr[index];
        this.interval = Math.floor(Math.random() * 10) +5;
    }
    // 系统初始化
    private initSystem():void {
        if (index._systemInitialized) return;
        index._systemInitialized = true;

        // 綁定弹窗事件到命令
        GameManager.context.mapEvent(GameEventNames.SHOW_ALERT, AlertCommand);
    }
    // 任务数据监听
    private bubbleChanged(ev:cc.Event):void{
        this._flicker = TaskMode.instance.flicker;
        this.refreshTaskState();
    }
    // 刷新 UI
    private refreshUI(){
        // if(!this._isOnLoadCalled)return;
        let rankBubbleNode = cc.find("Canvas/controlLeft/ranking/marvel")

        if(this._rankBubble){
            this.buMotion(rankBubbleNode,3);
        }else{
            this.buMotion(rankBubbleNode,1);
        }

        
        let voiceSwitch = GameManager.soundsManager.musicMuted;
        if(voiceSwitch){
            // 停止播放背景音乐
            this.soundBar.getComponent(cc.Sprite).spriteFrame = this.voiceOFF;
        }else{
            // 播放背景音乐
            this.soundBar.getComponent(cc.Sprite).spriteFrame = this.voiceON;
        }

        this.refreshTaskState();
        
       

    }
    // 获取任务状态改变气泡
    private refreshTaskState():void {
        let litterNode:cc.Node = cc.find("Canvas/controlRight/task/marvel");
        let motion:number = this._flicker;
        this.buMotion(litterNode, motion);
    }
    // 气泡动作
    private buMotion(node:cc.Node,num:number){
        if(num == 3){
            let seq = cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(0.8,1.1,1.1),
                    cc.scaleTo(0.4,0.9,0.9)
            ));
            node.runAction(seq);
            node.active = true;
        }else if(num == 2){
            node.active = true;
        }else if(num == 1){
            node.active = false;
        }
    }
    // 开始
    private onStartGame(e:cc.Event):void{
        GameManager.soundsManager.playTapSound();
        
        cc.director.loadScene("gameScene");
        StateManage.instance.setData(StateManage.KEY_USE_RESURGENCECAR,1);
        WXOpenData.postMessage({"integral":0,"direction":3});
    }
    // 红包
    private onLuckyMoney(e:cc.Event):void{
        GameManager.soundsManager.playTapSound();
        WXUtils.showToast("暂未开放，敬请期待..");
    }
    // 排行
    private onRanking(e:cc.Event):void{
        cc.director.loadScene("ranking");
        StateManage.instance.setData(StateManage.KEY_RANKBUBBLE,false);
        GameManager.soundsManager.playTapSound();
        WXOpenData.postMessage({"direction":2});
        console.log("排行榜子域")
    }
    // 复活
    private onResurgence(e:cc.Event):void{
        GameManager.soundsManager.playTapSound();
        GameManager.eventManager.dispatchEventWith(GameEventNames.SHOW_RESURGENCE);
    }
    // 商店
    private onShopping(e:cc.Event):void{
        GameManager.soundsManager.playTapSound();
        cc.director.loadScene("shopping");
    }
    // 音效
    private onSound(e:cc.Event):void{
        GameManager.soundsManager.playTapSound();
        let voiceSwitch = GameManager.soundsManager.musicMuted;
        if(!voiceSwitch){
            // 停止播放背景音乐
            this.soundBar.getComponent(cc.Sprite).spriteFrame = this.voiceOFF;
            GameManager.soundsManager.muteMusic();
        }else{
            // 播放背景音乐
            this.soundBar.getComponent(cc.Sprite).spriteFrame = this.voiceON;
            GameManager.soundsManager.unmuteMusic();
        }
        console.log("---背景音效---",voiceSwitch);
    }
    // 任务
    private onTask(e:cc.Event):void{
        GameManager.soundsManager.playTapSound();
        GameManager.eventManager.dispatchEventWith(GameEventNames.SHOW_TASK);
    }
    update (dt) {
        this.sec += dt;
        if(Math.floor(this.sec) == 1){
            TaskMode.instance.setTimeDay();
            this.sec = 0;
        }
    }

    
    onDestroy() {
        GameManager.eventManager.off(XYJEventNames.EVENT_READY, this.xyjAPIReadyHandler, this);
        GameManager.eventManager.off(XYJEventNames.EVENT_INIT_FAILED, this.xyjAPIReadyHandler, this);
    }
}
