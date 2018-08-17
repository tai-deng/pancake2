import GameManager from "../gamecore/managers/GameManager";
import StateManage from "../StateManage/StateManage";
import WXRewardVideoAd from "../gamecore/wechat/WXRewardVideoAd";
import WXCore from "../gamecore/wechat/WXCore";
import WXEventType from "../gamecore/wechat/WXEventType";
import GameCoreEvent from "../gamecore/GameCoreEvent";
import XYJAPI from "../gamecore/xiaoyaoji/XYJAPI";
import GameEventNames from "../GameEventNames";


const {ccclass, property} = cc._decorator;
/**
 * 展示游戏结果
 */
@ccclass
export default class GameOverPanelMain extends cc.Component {

    //播放视频广告
    @property(cc.Node)
    playVideoAdBtn:cc.Node = null;

    //再来一次
    @property(cc.Node)
    playAgainBtn:cc.Node = null;

    //使用复活卡
    @property(cc.Node)
    userCardBtn:cc.Node = null;

    //复活卡数量文本
    @property(cc.Label)
    resurrectionCardLabel:cc.Label = null;


    //分数显示
    @property(cc.Label)
    scoreLabel:cc.Label = null;

    // 正常结束粒子
    @property(cc.Node)
    overPar:cc.Node = null;

    // 超越粒子 top left right
    @property(cc.Node)
    topPar:cc.Node = null;
    @property(cc.Node)
    leftPar:cc.Node = null;
    @property(cc.Node)
    rightPar:cc.Node = null;

    // 弹窗了之后不计时点击了之后重新计时
    private flag:boolean = true;

    start() {
        let score:number = StateManage.instance.getData(StateManage.KEY_SCORE);
        this.scoreLabel.string = "" + score;
        this.playParticle(score);
        this.playAgainBtn.on(cc.Node.EventType.TOUCH_END, this.playAgainBtnTapHandler, this);
        this.playVideoAdBtn.on(cc.Node.EventType.TOUCH_END, this.playVideoAdBtnTapHandler, this);
        this.userCardBtn.on(cc.Node.EventType.TOUCH_END, this.userCardBtnBtnTapHandler, this);

        // this.schedule(this.checkTime, 1, 10000);

        //检查视频是否可用。如果不可用，禁用按钮
        // if (!WXRewardVideoAd.isReady) {
        //     let btn:cc.Button = this.playVideoAdBtn.getComponent(cc.Button);
        //     btn.enableAutoGrayEffect = true;
        //     btn.interactable = false;
        // }

        if(XYJAPI.reviveCount > 0){
            // 显示数量
            this.resurrectionCardLabel.node.parent.active = true;
            this.resurrectionCardLabel.string = "" + XYJAPI.reviveCount;
        }else{
            this.resurrectionCardLabel.node.parent.active = false;
        }

        //播放音效
        GameManager.soundsManager.playSound("resources/sounds/gameover.mp3");
    }

    // 播放粒子特效
    private playParticle(score:number){
        let maxScore:number = StateManage.instance.getData(StateManage.KEY_MAXSCORE);
        if(score > maxScore){
            this.overPar.active = false;
            this.topPar.active = true;
            this.leftPar.active = true;
            this.rightPar.active = true;
        }else{
            this.overPar.active = true;
            this.topPar.active = false;
            this.leftPar.active = false;
            this.rightPar.active = false;
        }
    }
    private _passedTime:number = 0;

    /**
     * 检查时间
     */
    private checkTime():void {
        if (WXRewardVideoAd.isPlaying) return;
        if(this.flag){
            this._passedTime++;
            if (this._passedTime > 6) {
                //进入小排行榜场景
                cc.director.loadScene("rankSmall");
            }
        }
    }

    /**
     * 点击跳过
     * 
     * @param e 
     */
    private playAgainBtnTapHandler(e:cc.Event):void {
        GameManager.soundsManager.playTapSound();

        cc.director.loadScene("rankSmall");
    }

    /**
     * 点击播放视频
     * 
     * @param e 
     */
    private playVideoAdBtnTapHandler(e:cc.Event):void {
        GameManager.soundsManager.playTapSound();

        //检查是否广告是否可用
        // if (WXRewardVideoAd.isReady) {
        //     WXCore.showToast("微信视频暂时无法展现!");
        //     return;
        // }

        // GameManager.eventManager.on(WXEventType.REWARD_VIDEO_AD_CLOSE, this.rewardVideoEventsHandler, this);
        // GameManager.eventManager.on(WXEventType.REWARD_VIDEO_AD_ERROR, this.rewardVideoEventsHandler, this);
        // GameManager.eventManager.on(WXEventType.REWARD_VIDEO_AD_COMPLETE, this.rewardVideoEventsHandler, this);

        //广告播放完成后，关闭面板，继续游戏
        let v:number = StateManage.instance.getData(StateManage.KEY_USE_RESURGENCECAR);
        console.log(v,"---播放视频---",v>0)
        if(v>0){
            this.resurrect();
            StateManage.instance.setData(StateManage.KEY_USE_RESURGENCECAR,v-1);
            GameManager.eventManager.dispatchEventWith(GameEventNames.SHARE_EVENT);
        }else{
            WXCore.showToast("每次挑战只能分享一次游戏");
        }
    }


    /**
     * 视频广告事件控制
     * 
     * @param e 
     */
    private rewardVideoEventsHandler(e:cc.Event):void {
        GameManager.eventManager.off(WXEventType.REWARD_VIDEO_AD_CLOSE, this.rewardVideoEventsHandler, this);
        GameManager.eventManager.off(WXEventType.REWARD_VIDEO_AD_ERROR, this.rewardVideoEventsHandler, this);
        GameManager.eventManager.off(WXEventType.REWARD_VIDEO_AD_COMPLETE, this.rewardVideoEventsHandler, this);

        if (e.type == WXEventType.REWARD_VIDEO_AD_COMPLETE) {
            //广告播放完成后，关闭面板，继续游戏
            this.resurrect();
        } else {
            this._passedTime = 3;
        }
    }

    /**
     * 点击复活卡
     * 
     * @param e 
     */
    private userCardBtnBtnTapHandler(e:cc.Event):void {
        GameManager.soundsManager.playTapSound();
        let v:number = StateManage.instance.getData(StateManage.KEY_USE_RESURGENCECAR);
        let resurgenceCar = StateManage.instance.getData(StateManage.KEY_RESURGENCECAR);
        if(v>0){
            if (XYJAPI.reviveCount > 1) {
                XYJAPI.useRevive((suc) =>  {
                    if (suc) {
                        this.resurrect();
                        StateManage.instance.setData(StateManage.KEY_USE_RESURGENCECAR,v-1);
                        StateManage.instance.setData(StateManage.KEY_RESURGENCECAR,resurgenceCar+1);
                    } else {
                        this._passedTime = 3;
                    }
                });
            } else {
                this.flag = false;
                this._passedTime = 0;
                let that = this;
                GameManager.eventManager.dispatchEventWith(GameEventNames.SHOW_ALERT,["复活卡数量不足是否向好友求助?",function(label:string):void{
                    if(label == "ok"){
                        GameManager.soundsManager.playTapSound();
                        GameManager.eventManager.dispatchEventWith(GameEventNames.SHARE_EVENT);
                        // that.resurrect();
                        StateManage.instance.setData(StateManage.KEY_USE_RESURGENCECAR,v-1);
                        that.flag = true;
                    }
                    if(label == "off"){
                        GameManager.soundsManager.playTapSound();
                        that.flag = true;
                    }
                }])
            }
        }else{
            WXCore.showToast("每次挑战只能使用一次复活卡");
        }
    }




    /**
     * 复活
     */
    private resurrect():void {
        if (this._disposed) return;

        this.node.dispatchEvent(new cc.Event(GameCoreEvent.COMMON_CLOSE, false));
        
        // let v:number = XYJAPI.reviveCount;
        // let v:number = StateManage.instance.getData(StateManage.KEY_USE_RESURGENCECAR);
        // console.log("---------v---------",v)
        // if(v>0){
        //     XYJAPI.useRevive();
        //     GameManager.eventManager.dispatchEventWith(GameEventNames.SHARE_EVENT);
        //     StateManage.instance.setData(StateManage.KEY_USE_RESURGENCECAR,v-1);
        // }else{
        //     WXCore.showToast("每次挑战只能使用一次复活卡");
        // }
    }
    

    //是否已释放
    private _disposed:boolean;
    
    onDestroy() {
        this._disposed = true;

        // this.unschedule(this.checkTime);
        // StateManage.instance.off("change", this.stateChangeHandler);
    }
}
