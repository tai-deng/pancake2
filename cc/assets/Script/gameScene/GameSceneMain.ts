
import Config from "../StateManage/StateManage";
import GameManager from "../gamecore/managers/GameManager";
import StateManage from "../StateManage/StateManage";
import GameSystem from "../GameSystem";
import GameEventNames from "../GameEventNames";
import GameSceneEvents from "./GameSceneEvents";
import ActionMain from "./ActionMain";
import GameConfig from "../GameConfig";
import LevelInfoMain from "./LevelInfoMain";
import Utils from "../gamecore/managers/Utils";
import LevelData from "./LevelData";
import WXCore from "../gamecore/wechat/WXCore";
import Comp_SubDomainContent from "../gamecore/components/Comp_SubDomainContent";
const {ccclass, property} = cc._decorator;


/**
 * 游戏场景脚本
 * 
 */
@ccclass
export default class GameSceneMain extends cc.Component {


    @property(cc.Prefab)
    actionPrefab:cc.Prefab = null;


    //用户等级显示
    @property(LevelInfoMain)
    levelInfo:LevelInfoMain = null;

    //分数显示
    @property(cc.Label)
    scoreLabel:cc.Label = null;

    //分数显示
    @property(cc.Node)
    tapTipNode:cc.Node = null;

    //升级特效
    @property(cc.Node)
    levelUpEffectNode:cc.Node = null;


    //子域内容
    @property(cc.Node)
    subdomainContentNode:cc.Node = null;

    //手臂结构
    private _actionNode:cc.Node;

    //手臂结构脚本
    private _action:ActionMain;
    

    onLoad () {
        cc.info("【GameSceneMain init】");

        //初始化系统
        GameSystem.init();

        //初始化物理系统
        cc.director.getPhysicsManager().enabled = true;
        if (GameManager.isDebug) cc.director.getPhysicsManager().debugDrawFlags = 0;

        //设备性能差的情况下，降低刷新频率
        //检查设备性能
        if (WXCore.benchmarkLevel > 0 && WXCore.benchmarkLevel < 10) {
            //4秒刷新一次子域内容
            this.subdomainContentNode.getComponent(Comp_SubDomainContent).delayTime = 4;
        } else {
            //2秒刷新一次
            this.subdomainContentNode.getComponent(Comp_SubDomainContent).delayTime = 2;
        }
    }

    
    start () {
        cc.info(this.node.name)
        cc.info("【GameSceneMain start】");
        
        //监听事件
        this.node.on(GameSceneEvents.LEVEL_CHANGED, this.levelChangedHandler, this);

        //点击等级信息，显示等级详细信息
        this.levelInfo.node.on(cc.Node.EventType.TOUCH_END, this.levelInfoTapHandler, this);

        this.initAction();
        this.refreshLevel();

        //刷新子域
        this.refreshSubDomainContent();
    }


    /**
     * 初始化手臂结构
     */
    private initAction():void {
        cc.info("【GameSceneMain initAction】");

        this._actionNode = cc.instantiate(this.actionPrefab);
        this._action = this._actionNode.getComponent(ActionMain);

        //检查剪切板内容
        if (GameSystem.clipboardContent) {
            //如果是第一次，不能使用文本
            let isFirstDone:boolean = GameManager.dataManager.getData("pancake_first_d");
            if (isFirstDone === true) {
                let lastClipboardContent:string = "" + GameManager.dataManager.getData("gsm_lastClipboardContent");
                if (lastClipboardContent != GameSystem.clipboardContent) {
                    GameManager.dataManager.setData("gsm_lastClipboardContent", GameSystem.clipboardContent, true);
                    this._action.currentPancakeText = GameSystem.clipboardContent;
                }
            }
        }
        GameManager.dataManager.setData("pancake_first_d", true);

        //===============================================================
        //皮肤
        //===============================================================
        let currentSkinData:string = StateManage.instance.getData(StateManage.KEY_SKINPOT);
        if (currentSkinData) {
            try {
                let data:object = JSON.parse(currentSkinData);
                this._action.currentSkinName = data["name"];
            } catch (err) {
                
            }
        }
        //煎饼皮肤
        let currentPancakeSkinData:string = StateManage.instance.getData(StateManage.KEY_SKINCAKE);
        if (currentPancakeSkinData) {
            try {
                let data:object = JSON.parse(currentPancakeSkinData);
                this._action.currentPancakeSkinName = data["name"];
            } catch (err) {

            }

        }
        //===============================================================

        //监听事件
        this._actionNode.on(GameSceneEvents.GAME_START, this.actionEventsHandler, this);
        this._actionNode.on(GameSceneEvents.SCORE_CHANGED, this.actionEventsHandler, this);
        this._actionNode.on(GameSceneEvents.DIAMONDS_CHANGED, this.actionEventsHandler, this);
        this._actionNode.on(GameSceneEvents.GAME_OVER, this.actionEventsHandler, this);
        this.node.getChildByName("actionContainer").addChild(this._actionNode);

    }


    //记录上一次宝石的数量
    private _lastDiamondCount:number = 0;

    //记录上一次的分数
    private _lastScore:number = 0;
    

    /**
     * 
     * @param e 
     */
    private actionEventsHandler(e:cc.Event):void {
        let eType:string = e.type;


        switch (eType) {
            case GameSceneEvents.GAME_START:
                //提示不可见
                this.tapTipNode.active = false;
                break;
            case GameSceneEvents.SCORE_CHANGED:
                let score:number = this._action.score;

                // 和翻转有关的任务
                this.turnTaskEvent(score);

                //分数改变
                StateManage.instance.setData(StateManage.KEY_SCORE, score);

                //显示分数
                this.scoreLabel.string = "" + score;

                if (this._lastScore < score) {
                    //增加分数，正常颜色
                    this.scoreLabel.node.color = new cc.Color().fromHEX("#B2B2B2");
                } else {
                    //减少分数，红色显示
                    this.scoreLabel.node.color = new cc.Color().fromHEX("#ff0000");
                }
                this._lastScore = score;

                //改变位置
                let toX:number = this.scoreLabel.node.x + this.scoreLabel.node.width / 2 + this.levelInfo.node.width / 2 + 5;
                let maxX:number = cc.director.getWinSize().width / 2 - this.levelInfo.node.width / 2 - 10;
                if (toX > maxX) toX = maxX;
                this.levelInfo.node.runAction(cc.moveTo(0.3, toX, this.levelInfo.node.y).easing(cc.easeBackOut()));
                // this.levelInfo.node.x = toX;

                //刷新数据
                this.levelInfo.score = score;

                //刷新等级
                this.refreshLevel();

                //刷新子域内容
                this.refreshSubDomainContent();
                break;
            case GameSceneEvents.DIAMONDS_CHANGED:
                //宝石数量改变
                let v:number = StateManage.instance.getData(StateManage.KEY_GEM);
                v = Utils.toInt(v);
                v = v + this._action.diamondCount - this._lastDiamondCount;
                StateManage.instance.setData(StateManage.KEY_GEM, v);

                // 宝石 任务
                let task:number = StateManage.instance.getData(StateManage.KEY_TAGEM);
                task = Utils.toInt(task);
                task = task + this._action.diamondCount - this._lastDiamondCount;
                StateManage.instance.setData(StateManage.KEY_TAGEM, task);

                this._lastDiamondCount = this._action.diamondCount;
                break;
            case GameSceneEvents.GAME_OVER:
                //游戏结束

                cc.find("Canvas/topNavigationBar").getComponent("TopNavigationBar").change = 1;

                GameManager.eventManager.dispatchEventWith(GameEventNames.GAME_OVER);
                // 当前得分大于最高得分的时候给 上传腾讯发消息  更新最高得分
                if(StateManage.instance.getData(StateManage.KEY_MAXSCORE) <=　this._lastScore){
                    WXCore.setUserBestScore(this._lastScore);
                    StateManage.instance.setData(StateManage.KEY_MAXSCORE,this._lastScore);
                    if(typeof wx == "undefined") return;
                    let openData = wx.getOpenDataContext();
                    openData.postMessage({
                        "userInfo":StateManage.instance.getData(StateManage.KEY_USEINFO),
                    })
                    
                }
                break;
        }
    }


    //当前等级信息
    private _currentLevelData:LevelData = null;


    /**
     * 获取当前等级信息
     */
    public get currentLevelData():LevelData {
        return this._currentLevelData;
    }


    /**
     * 刷新等级
     */
    private refreshLevel():void {
        let data:object;

        let score:number = this._action.score;
        for (let i:number = 0; i < GameConfig.LEVELS.length; i++) {
            let obj:object = GameConfig.LEVELS[i];
            let scoreValues:[number, number] = obj["score"];
            if (score >= scoreValues[0] && score <= scoreValues[1]) {
                data = obj;
                break;
            }
        }

        if (data) {
            if (!this._currentLevelData || (this._currentLevelData.level != data["level"])) {
                this._currentLevelData = new LevelData();
                this._currentLevelData.fromObj(data);

                //抛出事件
                this.node.dispatchEvent(new cc.Event(GameSceneEvents.LEVEL_CHANGED, false));
            }
        }
    }



    /**
     * 等级变化回调
     * 
     * @param e 
     */
    private levelChangedHandler(e:cc.Event):void {
        cc.info("【levelChangedHandler】");

        //设置数据
        this.levelInfo.levelData = this._currentLevelData;
        this._action.levelData = this._currentLevelData;

        //如果不是等级1
        if (this._currentLevelData.level > 1) {
            this.enterNewLevel();
        }
    }


    /**
     * 进入新的等级
     */
    private enterNewLevel():void {
        //音效
        GameManager.soundsManager.playSound("resources/sounds/upgrade.mp3");
        // 等级任务
        let task:number = StateManage.instance.getData(StateManage.KEY_TAGRADE);
        task = Utils.toInt(task) + 1;
        StateManage.instance.setData(StateManage.KEY_TAGRADE, task);

        //不可操作
        // this._action.enableTouch = false;

        //等级提升特效
        this.levelUpEffectNode.active = true;
        this.levelUpEffectNode.getComponent(cc.Animation).play();
        //2秒后停止
        this.schedule(function():void {
            // this._action.enableTouch = true;
            this.levelUpEffectNode.active = false;    
        }, 2, 1);

    }


    /**
     * 点击等级信息
     * 
     * @param e 
     */
    private levelInfoTapHandler(e:cc.Event):void {
        //播放音效
        GameManager.soundsManager.playTapSound();
    }


    /**
     * 刷新子域内容
     */
    private refreshSubDomainContent():void {
       //发送数据
       if (typeof wx == "undefined") return;

       //打补丁
       if (!this._actionNode) return;
       let node:cc.Node = this._actionNode.getChildByName("bigArmPoint");
       let po:cc.Vec2 = new cc.Vec2(node.x, node.y + 90);
       cc.info("【refreshSubDomainContent】", po.x, po.y);

       //半透明节点
    //    let alphaNode:cc.Node = Utils.newPoint();
    //    alphaNode.x = po.x;
    //    alphaNode.y = po.y;
    //    this.node.addChild(alphaNode);

       let winSize:cc.Size = cc.director.getWinSize();
    //    cc.info("主域win size", winSize.width, winSize.height);
       wx.postMessage({
           "integral":this._lastScore,
           "posX":po.x/winSize.width,
           "posY":po.y/winSize.height
       });

    }

    // 十秒内翻转的次数
    private task_time:number = 0;
    private timing:boolean = true;

    /**
     * 翻转相关任务
     */
    private turnTaskEvent(score:number){
        // 一周转体任务
        let taskP:number = StateManage.instance.getData(StateManage.KEY_TURN);
        taskP = taskP + Math.floor(Utils.toInt(score) / 2);
        StateManage.instance.setData(StateManage.KEY_TURN, taskP);

        // 十秒内翻转次数任务
        this.schedule(()=>{
            this.timing = false;
        },10)
        if(this.timing){
            this.task_time +=score;
            let taskTime:number = StateManage.instance.getData(StateManage.KEY_TMTURN);
            if(this.task_time > taskTime){
                StateManage.instance.setData(StateManage.KEY_TMTURN, this.task_time);
            }
        }else{
            this.task_time = 0;
        }

    }
    // update (dt) {
    // }


    onDestroy() {
        //关闭物理系统
        cc.director.getPhysicsManager().enabled = false;
    }
}
