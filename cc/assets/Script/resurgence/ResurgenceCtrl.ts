import StateManage from "../StateManage/StateManage";
import WXCore from "../gamecore/wechat/WXCore";
import GameManager from "../gamecore/managers/GameManager";
import GameEventNames from "../GameEventNames";
import XYJAPI from "../gamecore/xiaoyaoji/XYJAPI";
import Utils from "../gamecore/managers/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ResurgenceCtrl extends cc.Node {
    
    constructor(){
        super();
        this.initData();
    }

    private static _instance:ResurgenceCtrl=null;
    public static get instance():ResurgenceCtrl{
        if(!this._instance) this._instance = new ResurgenceCtrl();
        return this._instance;
    }

    private _resurgenceCardNum:number=0;
    private get resurgenceCardNum():number{
        return this._resurgenceCardNum;
    }
    private set resurgenceCardNum(v:number){
        if(this._resurgenceCardNum != v){
            this._resurgenceCardNum = v;

            this.dispatchEvent(new cc.Event("esurgenceCard",false));

        }
    }
    private initData(){
        // this.resurgenceCardNum = StateManage.instance.getData(StateManage.KEY_RESURGENCECARDNUM);

        //获取复活卡数量
        let v:number = XYJAPI.reviveCount;
        this.resurgenceCardNum = Utils.toInt(v);
    }
    // 获得复活卡 +1
    public addResurgenceCard(){
        // by laan
        //复活卡增加是通过XYJAPI的登陆接口来实现的
        //这里不增加复活卡

        // this.resurgenceCardNum = this.resurgenceCardNum + 1;
        // StateManage.instance.setData(StateManage.KEY_RESURGENCECARDNUM,this.resurgenceCardNum);
    }

    // 使用复活卡 -1
    // public minusResurgenceCard(){
    //     let temp = this.resurgenceCardNum - 1;
    //     console.log("temp",temp)
    //     if(temp < 0){
    //         GameManager.eventManager.dispatchEventWith(GameEventNames.SHOW_ALERT, ["复活卡不足，是否马上向好友求助？", function(res){
    //             if(res == "ok"){
    //                 // WXCore.setOnShareAppMessage();
    //                 WXCore.showToast("分享朋友获得复活卡")
    //             }
    //         }]);
    //         return false;
    //     }
    //     this.resurgenceCardNum = temp;
    //     // StateManage.instance.setData(StateManage.KEY_RESURGENCECARDNUM,this.resurgenceCardNum);
    //     //使用次数 +1
    //     let resurgenceCar = StateManage.instance.getData(StateManage.KEY_RESURGENCECAR) + 1;
    //     StateManage.instance.setData(StateManage.KEY_RESURGENCECAR,resurgenceCar)
    //     WXCore.showToast("使用成功!")
    // }
    
    // 获取当前复活卡数量
    public getResurgenceCardNum():number{
        return this.resurgenceCardNum;
    }
}
