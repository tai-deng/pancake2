import GameManager from "../managers/GameManager";
import WXCore from "../wechat/WXCore";
import { md5 } from "../libs/md5";
import ShareTypes from "./ShareTypes";
import Utils from "../managers/Utils";
import GameCoreEvent from "../GameCoreEvent";
import XYJEventNames from "./XYJEventNames";
import WXShare from "../wechat/WXShare";


const {ccclass, property} = cc._decorator;

if(typeof wx != "undefined"){
    wx.onShow(function(res:object):void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  wx.onShow  -");
        cc.info(res);

        let query:any = res["query"];
         //分享者id
         XYJAPI.inviterOpenID = query.openID;
         //分享者id
         XYJAPI.inviterUserID = query.userID;
         //分享者昵称
         XYJAPI.inviterNickname = decodeURIComponent(query.nickname)
         
         //分享的时间戳（秒）
         XYJAPI.inviterTime = parseInt(query.time);
         if (isNaN(XYJAPI.inviterTime)) XYJAPI.inviterTime = 0;

         XYJAPI.gameStartTime = Math.floor(new Date().getTime()/1000);
 
         //分享做什么
         XYJAPI.inviterAction = query.action;
         XYJAPI.inviterChannel = query.channel;

        //分享来自哪一局游戏
        XYJAPI.inviterGameRecordID = query.recordID;
    });
}

/**
 * 小幺鸡api
 * 
 * @see http://www.xiaoyaoji.cn/share/MsmrbiWWx/UNX8Vu1aN?password=wx
 */
@ccclass
export default class XYJAPI {

    //基础URL
    private static _baseURL:string;

    //渠道id
    private static _channelID:string = null;

    /**
     * 获取渠道ID
     */
    public static get channelID():string {
        return XYJAPI._channelID;
    }

    //版本号
    static gameVersion:string = null;

    //==============================================================
    //邀请者相关
    //==============================================================
    //邀请者open id
    static inviterOpenID:string = null;

    //邀请者id
    static inviterUserID:string = null;
    
    
    //邀请者昵称
    static inviterNickname:string = null;
    
    //分享时间戳(秒)
    static inviterTime:number = 0;
    
    //游戏开始时间
    static gameStartTime:number = 0;
    
    //分享目标
    static inviterAction:string = null;

    //邀请者游戏局id
    static inviterGameRecordID:string = null;
    
    //推广来源
    static inviterChannel:string = null;
    //==============================================================

    //接力限制时间（秒）。默认30秒，即用户分享30秒内可以被接力。
    static relayLimitedTime:number = 30;

    //用户open id
    static userOpenID:string = null;
    //用户id
    static userID:string = null;
    static userUnionID:string = null;

    //用户昵称
    static userNickname:string = null;

    private static userToken:string = null;

    private static encryptedData:string = null;

    private static iv:string = null;

    /**
     * avatarUrl	string	用户头像图片 url	
     * city	        string	用户所在城市	
     * country	    string	用户所在国家	
     * gender	    number	用户性别	
     * language	    string	显示 country province city 所用的语言	
     * nickName	    string	用户昵称	
     * openId	    string	用户 openId	
     * province	    string	用户所在省份
     */
    private static _userInfo:object = null;
    public static get userInfo():object {return XYJAPI._userInfo;}

    



    //是否已初始化
    static _initialized:boolean;

    /**
     * 初始化
     * 
     * @param channelID         渠道ID
     */
    static init(channelID:string):void {
        if (XYJAPI._initialized) return;
        XYJAPI._initialized = true;


        //渠道id
        XYJAPI._channelID = channelID;
        
        //检查是否是调试模式
        if (GameManager.isDebug) {
            XYJAPI._baseURL = "https://tball.yz071.com/";
        } else {
            XYJAPI._baseURL = "https://ball.yz071.com/";
        }

        cc.info("----  小幺鸡 API ----");
        cc.info("-  init   -");
        cc.info(XYJAPI._baseURL);
        
        if(typeof wx == "undefined") return;

        wx.login(
            {
                "success":XYJAPI.loginCallback,
            }
        );
    }


    /**
     * 获取需要携带的数据
     * 
     * @param shareType         分享类型。
     * 
     * @see ShareTypes 
     */
    static getShareQueryData(shareType:string = ShareTypes.NORMAL):object {
        let queryObj:object = {
            "openID":XYJAPI.userOpenID,
            "userID":XYJAPI.userID,
            "channel":XYJAPI.inviterChannel,
            "action":shareType,
            "time":Math.floor(new Date().getTime()/1000)
        };


        if (XYJAPI.userInfo) {
            queryObj["nickname"] = XYJAPI.userInfo["nickName"];
            queryObj["avatar"] = XYJAPI.userInfo["avatarUrl"];
        }

        return queryObj;
    }



    /**
     * 检查是否是接力
     * 
     * @param inTime        在游戏开始多少秒后可以接力
     */
    static checkCanRelay(inTime:number = 60):boolean {
        if (!XYJAPI.userOpenID) {
            cc.info("[接力]尚未登录");
            return false;
        }

        let query:any = WXCore.queryData;
        if (!query) return false;

        if (!GameManager.isDebug) {
            if (XYJAPI.userOpenID == XYJAPI.inviterOpenID) {
                cc.info("[接力]不能给自己接力");
                return false;
            }
        } else {
            cc.info("[接力]调试模式下可以给自己接力");
        }

        let nowS:number = Math.round(new Date().getTime() / 1000);
        if ((nowS - XYJAPI.gameStartTime) > inTime) {
            cc.info("[接力]游戏已开始" + (nowS - XYJAPI.gameStartTime));
            return false;
        }

        if (XYJAPI.inviterAction != ShareTypes.RELAY) return false;

        return true;
    }



    /**
     * 用户的登陆回调
     * 
     * 
     * @see http://www.xiaoyaoji.cn/share/MsmrbiWWx/MsJg6RxLg
     * 
     * @param res 
     */
    private static loginCallback(res:object):void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  loginCallback   -");
        cc.info(res);

        if (res) {
            XYJAPI._code = res["code"];
            XYJAPI.login();
        }
    }

    private static _code:string;

    /**
     * 登陆平台
     */
    public static login():void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  login   -");
        
        if(typeof wx == "undefined") return;

        let theData:object = {
            code : "" + XYJAPI._code,
            opId : "" + XYJAPI.inviterOpenID,
            channel : "" + XYJAPI.inviterChannel,
        };


        // 1	开局增加分数分享
        // 3	赠送好友道具分享
        // 4	邀请好友帮忙拆红包分享

        //如果是来自增加基础分的分享
        if (XYJAPI.inviterAction == ShareTypes.ADD_BASE_SCORE) {
            theData["shareStatus"] = "1";
        } else if (XYJAPI.inviterAction == ShareTypes.HONG_BAO) {
            theData["shareStatus"] = "4";
        } else if (XYJAPI.inviterAction == ShareTypes.SEND_ITEM) {
            theData["shareStatus"] = "3";
        } else if (XYJAPI.inviterAction == ShareTypes.ADD_SCORE) {
            theData["record_id"] = XYJAPI.inviterGameRecordID;
        }

        cc.info("the data is", theData);
        
        cc.info("request Ball.Api.Auth.WechatLogin");
        cc.info("url is " + XYJAPI._baseURL + "api/?do=Ball.Api.Auth.WechatLogin");
        wx.request({
            url : XYJAPI._baseURL + "api/?do=Ball.Api.Auth.WechatLogin",

            data : theData, 

            header : {
                "X-Version": XYJAPI.gameVersion,
                "X-Source": XYJAPI.channelID,
            },

            method : "POST",

            success : XYJAPI.loginFeedbackCallback,

            fail: function(res) {
                cc.info("failed to call Ball.Api.Auth.WechatLogin");
                cc.info(res);

                //抛出事件
                GameManager.eventManager.dispatchEventWith(XYJEventNames.EVENT_INIT_FAILED);
            }
        });
    }

    /**
     * 向小幺鸡平台发送登陆反馈后回调
     */
    private static loginFeedbackCallback(res:object):void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  loginFeedbackCallback   -");
        cc.info(res);

        if (!res["data"]) {
            cc.info("loginFeedbackCallback 数据错误");
            return;
        }

        try {
            XYJAPI.userOpenID = res["data"].data.openid;
            XYJAPI.userID = res["data"].data.userid;
            XYJAPI.userToken = res["data"].data.token;
            cc.info("userOpenID=" + XYJAPI.userOpenID);
            cc.info("userToken=" + XYJAPI.userToken);
            cc.info("userID=" + XYJAPI.userID);
    
            XYJAPI.getUserInfo();
        } catch (err) {
            cc.info("【ERROR】", err);

            //抛出事件
            GameManager.eventManager.dispatchEventWith(XYJEventNames.EVENT_INIT_FAILED);
        }

    }



    /**
     * 获取用户信息
     */
    static getUserInfo():void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  getUserInfo   -");

        //检查是否存在该数据
        if (XYJAPI._userInfo) return;

        if(typeof wx == "undefined") return;

        wx.getUserInfo({
            "success":XYJAPI.getUserInfoCallback
        });
    }


    /**
     * 获取用户信息回调
     * @param res
     */
    private static getUserInfoCallback(res:object):void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  getUserInfoCallback   -");
        cc.info(res);

        XYJAPI.encryptedData = res["encryptedData"];
        XYJAPI.iv = res["iv"];
        XYJAPI._userInfo = res["userInfo"];

        cc.info("encryptedData=" + XYJAPI.encryptedData);
        cc.info("iv=" + XYJAPI.iv);
        cc.info("userInfo=", XYJAPI._userInfo);

        //登录绑定unionid
        wx.request({
            url : XYJAPI._baseURL + "api/?do=Ball.Api.Auth.Binding",
            data : {
                encryptedData : XYJAPI.encryptedData,
                iv : XYJAPI.iv,
            },
            header : {
                "X-Token": XYJAPI.userToken,
                "X-Version": XYJAPI.gameVersion,
                "X-Source": XYJAPI.channelID,
            },

            method : "POST",

            success:XYJAPI.loginBindingCallback,

            fail: function(res) {
                cc.info("failed to call Ball.Api.Auth.Binding");
                cc.info(res);

                //抛出事件
                GameManager.eventManager.dispatchEventWith(XYJEventNames.EVENT_INIT_FAILED);
            }
        });
    }


    /**
     * 登陆绑定
     * 
     * @param res
     */
    private static loginBindingCallback(res:object):void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  loginBindingCallback   -");
        cc.info(res);

        XYJAPI.userUnionID = res["data"].data.unionId;
        cc.info("userUnionID=" +  XYJAPI.userUnionID);

        //抛出事件
        GameManager.eventManager.dispatchEventWith(XYJEventNames.EVENT_READY);

        //绑定成功后，获取复活卡数目
        XYJAPI.getRevive();
        //获取是否可分享并获得复活卡
        XYJAPI.getRemoteCanShare();
        //获取公众号二维码图片信息
        XYJAPI.getWXMiniAppData();
        //获取分享的数据
        XYJAPI.getShareData();
    }


    //远程设置值，是否可分享
    private static _r_canShare:boolean;


    /**
     * 是否可以分享。
     */
    static get canShare():boolean {
        return XYJAPI._r_canShare;
    }


    
    /**
     * 获取远程设置的是否可分享的值
     */
    private static getRemoteCanShare():void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  getRemoteCanShare  -");

        if(typeof wx == "undefined") return;

        wx.request({
            url : XYJAPI._baseURL + "api/?do=Ball.Api.Share.AppSet",

            header : {

                "X-Token": XYJAPI.userToken,
                "X-Version": XYJAPI.gameVersion,
                "X-Source": XYJAPI.channelID,

            },

            method : "GET",

            success : (res)=>{
                cc.info("---- Ball.Api.Share.AppSet ----")
                cc.info(res);

                if (res["data"] && res["data"].data) {
                    XYJAPI._r_canShare = (res["data"].data.status == 1);
                    cc.info("分享是否已开启" + XYJAPI._r_canShare);
                }
                    
            },

        });
    }


    private static _reviveCount:number = 0;

    /**
     * 获取复活卡数量
     */
    static get reviveCount():number {
        return this._reviveCount;
    }

    /**
     * 获取复活卡数量。回调方法接收一个number类型的参数。
     */
    static getRevive(callback:Function = null):void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  getRevive  -");

        if(typeof wx == "undefined") return;

        wx.request({
            url : XYJAPI._baseURL + "api/?do=Ball.Api.Share.GetRevive",

            header : {
                "X-Token": XYJAPI.userToken,
                "X-Version": XYJAPI.gameVersion,
                "X-Source": XYJAPI.channelID,
            },

            method : "GET",

            success : function(res):void {
                cc.info("---- Ball.Api.Share.GetRevive ----")
                cc.info(res);

                XYJAPI._reviveCount = Utils.toInt(res.data.data.revive);
                cc.info("用户剩余的复活卡" + XYJAPI._reviveCount);

                if (callback != null) {
                    callback.call(null, XYJAPI._reviveCount);
                }
            },
        });
    }


    /**
     * 使用复活卡
     * 
     * @param callback 
     */
    static useRevive(callback:Function = null):void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  userRevive  -");

        if (XYJAPI._reviveCount <= 0) {
            cc.info("复活卡数量不足");
            return;
        }


        //减少一个复活卡
        XYJAPI._reviveCount--;

        if(typeof wx == "undefined") return;

        wx.request({
            url : XYJAPI._baseURL + "api/?do=Ball.Api.Share.SetRevive",

            header : {
                "X-Token": XYJAPI.userToken,
                "X-Version": XYJAPI.gameVersion,
                "X-Source": XYJAPI.channelID,

            },

            method : "GET",

            success : function(res:object):void {
                cc.info("---- Ball.Api.Share.SetRevive ----")
                cc.info(res);

                let suc:boolean = (res && res["data"] && res["data"].code == 200);

                if (callback != null) {
                    callback.call(null, suc);
                }
            },

            fail : function(res):void {
                cc.info("---- Ball.Api.Share.SetRevive ----")
                cc.info(res);

                if (callback != null) {
                    callback.call(null, false);
                }
            }


        });
    }



    /**
     * 保存分数
     * 
     * @param score 
     */
    static saveScore(score:number):void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  saveScore  -");
        cc.info(score);

        if (!XYJAPI._userInfo)  {
            cc.info("需要先登录才能调用该接口")
            return;
        }

        if(typeof wx == "undefined") return;

        cc.info("-  data  -");
        cc.info({score : "" + score, headimg: XYJAPI._userInfo["avatarUrl"],nickname : XYJAPI._userInfo["nickName"],});

        wx.request({
            url : XYJAPI._baseURL + "api/?do=Ball.Api.Share.SaveScore",

            data : {
                score : "" + score,
                headimg: XYJAPI._userInfo["avatarUrl"],
                nickname : XYJAPI._userInfo["nickName"],
             },

            header : {
                "X-Token": XYJAPI.userToken,
                "X-Version": XYJAPI.gameVersion,
                "X-Source": XYJAPI.channelID,
            },

            method : "POST",

            success : function(res:object):void {
                cc.info("---- Ball.Api.Share.SaveScore ----")
                cc.info(res);
            },
        });
    }


    //从服务器获取的分享数据
    private static _shareDataMap:object = {};
    //{"imageurl":string, "title":string}
    // private static _shareData:object;


    /**
     * 获取分享数据
     * 
     * @param callback      接受一个object对象:
     * 
     * {"imageurl":string, "title":string}
     *  
     */
    static getShareData(callback:Function = null, status:number = 0):void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  getShareData  -");
        cc.info("status=" + status);
        
        if (XYJAPI._shareDataMap[status]) {
            if (callback != null) {
                callback.call(null, XYJAPI._shareDataMap[status]);
            }
            return;
        }

        if(typeof wx == "undefined") return;

        wx.request({
            url : XYJAPI._baseURL + "api/?do=Ball.Api.Share.Get",

            header : {
                "X-Token": XYJAPI.userToken,
                "X-Version": XYJAPI.gameVersion,
                "X-Source": XYJAPI.channelID,
            },

            data: {
                "status":status
            },

            method : "GET",

            success : function(res:object):void {
                cc.info("---- Ball.Api.Share.Get ----")
                cc.info(res);

                let data:object = res["data"]["data"];
                XYJAPI._shareDataMap[status] = data;
                if (data) {
                    if (callback != null) {
                        callback.call(null, data);
                    }

                    if (status == 0) {
                        WXShare.setOnShareAppMessage(
                            data["title"],
                            data["imageurl"],
                            XYJAPI.getShareQueryData(ShareTypes.SHARE_APP)
                        );
                    }
                }
            },

            fail : function(res:object):void {
                cc.info("---- Ball.Api.Share.Get FAIL ----")
                cc.info(res);
            }
        });
    }

    /**
     * 广告数据
     */
    private static _adImageData:object;

    /**
     * 获取交叉推广图。接收一个obj参数。
     * 
     * {
     *      imageurl: XYJAPI._baseURL + "Upload/image/2018-06-06/P_15282657218141544.jpg ", 
     *      title: "篮球大作战", 
     *      bili: "4:3"
     * }
     * 
     * @see http://www.xiaoyaoji.cn/share/MsmrbiWWx/Rif1Qd3cp
     */
    static getAdImageData(callback:Function, refreshAgain:boolean = false):void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  getAdImage   -");

        //如果不是强制刷新数据，使用老数据
        if (!refreshAgain && XYJAPI._adImageData) {
            if (callback != null) {
                callback.call(null, XYJAPI._adImageData);
            }
            return;
        }

        if(typeof wx == "undefined") return;

        wx.request({
            "url":XYJAPI._baseURL + "api/?do=Ball.Api.Share.Shunt",
            "data":{
            },

            "header" : {
                "X-Source": XYJAPI.channelID,
            },

            "method":"GET",

            "success":function(res:object):void {
                cc.info("---- Ball.Api.Share.Shunt ----")
                cc.info(res);

                if (res && res["data"]) {
                    //这里返回了很多图片，需要去一个比例最接近的尺寸
                    let images:Array<object> = res["data"].data;
                    if (!images || images.length == 0) return;

                    let winSize:cc.Size = cc.director.getWinSize();
                    let currentHWV:number = winSize.height / winSize.width;

                    let minHWV:number = 100;
                    let minHWVObj:object;

                    for (let i:number = 0; i < images.length; i++) {
                        //{imageurl: XYJAPI._baseURL + "Upload/image/2018-06-06/P_15282657218141544.jpg ", title: "篮球大作战", bili: "4:3"}
                        let imgObj:object = images[i];

                        let hwv:Array<string> = String(imgObj["bili"]).split(":");
                        let v:number = Math.abs(Number(hwv[0]) / Number(hwv[1]) - currentHWV);
                        cc.info("current hwv is " + v);

                        if (v < minHWV) {
                            minHWV = v;
                            minHWVObj = imgObj;
                        }
                    }

                    if (minHWVObj) {
                        XYJAPI._adImageData = minHWVObj;
                        callback.call(null, XYJAPI._adImageData);
                    }

                }
            }

        });
    }



    //从服务器获取的分享数据
    //{"imageurl":string}
    private static _wxMiniAppData:object;


    /**
     * 微信小程序数据
     * 
     * {"imageurl":string}
     */
    static get wxMiniAppData():object {
        if (XYJAPI._wxMiniAppData) {
            return XYJAPI._wxMiniAppData;
        }

        XYJAPI.getWXMiniAppData();
        return null;
    }



    //是否正在请求微信小程序数据
    private static _isGettingWXMiniAppData:boolean;

    /**
     * 获取微信小程序数据
     * 
     * 
     * @see http://www.xiaoyaoji.cn/share/MsmrbiWWx/VBHsTd2nE
     * 
     * 
     *  
     */
    private static getWXMiniAppData():void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  getWXMiniAppData  -");
        cc.info("is requesting is" + XYJAPI._isGettingWXMiniAppData);

        if (XYJAPI._isGettingWXMiniAppData) return;
        
        if(typeof wx == "undefined") return;

        //标记正在请求数据
        XYJAPI._isGettingWXMiniAppData = true;

        wx.request({
            url : XYJAPI._baseURL + "api/?do=Ball.Api.Erweima.GetMoney",

            header : {
                "X-Token": XYJAPI.userToken,
                "X-Version": XYJAPI.gameVersion,
                "X-Source": XYJAPI.channelID,
            },

            method : "GET",

            success : function(res:object):void {
                cc.info("---- Ball.Api.Erweima.GetMoney SUCCESS ----")
                cc.info(res);

                XYJAPI._wxMiniAppData = res["data"]["data"];
            },

            fail : function(res:object):void {
                cc.info("---- Ball.Api.Erweima.GetMoney FAIL ----")
                cc.info(res);
            },

            complete : function():void {
                XYJAPI._isGettingWXMiniAppData = false;
            }
        });
    }



    //================================================================================================
    //接力逻辑
    //================================================================================================


    /**
     * 上报接力分数
     * 
     * 
     * @param score             接力分数
     * @param startTime         接力开始时间（玩家开始玩游戏时间），秒
     * 
     * 
     * @see http://www.xiaoyaoji.cn/share/MsmrbiWWx/5DA71JiTP
     */
    static saveRelayScore(score:number, startTime:Date):void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  saveRelayScore  -");
        cc.info(score, startTime);
        
        if (!XYJAPI._userInfo)  {
            cc.info("需要先登录才能调用该接口")
            return;
        }

        let theData:object = {};
        //分数
        theData["score"] = "" + score;
        theData["headimg"] = XYJAPI._userInfo["avatarUrl"],
        theData["nickname"] = XYJAPI._userInfo["nickName"],
        // theData["hid"] = XYJAPI.inviterOpenID;
        theData["hid"] = XYJAPI.inviterUserID;
        theData["stamp"] = XYJAPI.inviterTime;
        theData["startTime"] = "" + Math.floor(startTime.getTime()/1000);
        theData["endTime"] = "" + Math.round(new Date().getTime()/1000);

        //输出信息
        cc.info("the data is:", theData);

        let signValue:string = XYJAPI.createSign(theData);
        cc.info("sign is:" + signValue);
        cc.info("url is:" + XYJAPI._baseURL + "api/?do=Ball.Api.Share.saveHelpScore" + "&sign=" + signValue);

        if(typeof wx == "undefined") return;

        wx.request({
            url : XYJAPI._baseURL + "api/?do=Ball.Api.Share.saveHelpScore" + "&sign=" + signValue,

            header : {
                "X-Token": XYJAPI.userToken,
                "X-Version": XYJAPI.gameVersion,
                "X-Source": XYJAPI.channelID,
            },

            data : theData, 

            method : "POST",

            success : function(res:object):void {
                cc.info("---- Ball.Api.Share.saveHelpScore ----")
                cc.info(res);

                //提示用户
                WXCore.showToast("成功给" + XYJAPI.inviterNickname + "助力");
            },

            complete : function():void {
            }
        });
    }


    //接力数据
    private static _relayData:object;

    //本次接力结束时间
    // private static _relayEndDate:Date;


    /**
     * 接力数据
     * 
     * 
     * @see Ball.Api.Room.Activity
     */
    static getRelayData(callback:Function = null):void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  getRelayData  -");
        
        if (!XYJAPI._userInfo)  {
            cc.info("需要先登录才能调用该接口")
            return;
        }

        //使用老数据
        // if (XYJAPI._relayData && XYJAPI._relayEndDate) {
        //     let now:Date = new Date();
        //     if (XYJAPI._relayData > now) {
        //         if (callback != null) callback.call(null, XYJAPI._relayData);
        //     }
        // }

        let theData:object = {};

        //输出信息
        cc.info("the data is:", theData);

        if(typeof wx == "undefined") return;

        wx.request({
            url : XYJAPI._baseURL + "api/?do=Ball.Api.Room.Activity",

            header : {
                "X-Token": XYJAPI.userToken,
                "X-Version": XYJAPI.gameVersion,
                "X-Source": XYJAPI.channelID,
            },

            data : theData, 

            method : "POST",

            success : function(res:object):void {
                cc.info("---- Ball.Api.Room.Activity ----")
                cc.info(res);

                let data:object = res["data"]["data"];
                XYJAPI._relayData = data;

                //结束时间
                // if (data) {
                //     let remaining:object = data["remaining"];
                //     if (remaining && remaining["end_time"]) {
                //         XYJAPI._relayEndDate = new Date(remaining["end_time"] * 1000);
                //     }
                // }
                
                if (callback != null) callback.call(null, data);
            },

            fail:function(res:object):void {
                WXCore.showToast("数据请求失败");
            },

            complete : function():void {
            }
        });
    }




    /**
     * 获取分享邀请的好友个数（分渠道）
     * 
     * @param 分享类型          1:增加基础分分享
     * 
     * @see Ball.Api.Room.Activity
     */
    static getNewUserCountFromShare(shareStatus:string, callback:Function = null):void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  getNewUserCountFromShare  -");
        
        if (!XYJAPI._userInfo)  {
            cc.info("需要先登录才能调用该接口")
            return;
        }

        // if (XYJAPI._relayData && XYJAPI._relayEndDate) {
        //     let now:Date = new Date();
        //     if (XYJAPI._relayData > now) {
        //         if (callback != null) callback.call(null, XYJAPI._relayData);
        //     }
        // }

        let theData:object = {"code":shareStatus};

        //输出信息
        cc.info("the data is:", theData);

        if(typeof wx == "undefined") return;

        wx.request({
            url : XYJAPI._baseURL + "api/?do=Ball.Api.Share.GetShareStatus",

            header : {
                "X-Token": XYJAPI.userToken,
                "X-Version": XYJAPI.gameVersion,
                "X-Source": XYJAPI.channelID,
            },

            data : theData, 

            method : "POST",

            success : function(res:object):void {
                cc.info("---- Ball.Api.Share.GetShareStatus ----")
                cc.info(res);

                let data:object = res["data"]["data"];
                let count:number = data["count"]
                if (!isNaN(count) && count > 0) {
                    if (callback) callback.call(null, count);
                }
            },

            fail:function(res:object):void {
                WXCore.showToast("数据请求失败");
            },

            complete : function():void {
            }
        });
    }



    /**
     * 获取红包数据
     * 
     * {
     *      "money":红包金额,
     *      "state":    1:可领取，2:已领取, 0:其他
     *      "message":
     * }
     * 
     * 
     * @see Ball.Api.Forward.Envelopes
     */
    static getHongBaoData(callback:Function = null, useHongBao:boolean = false):void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  getHongBaoData  -");
        
        if (!XYJAPI._userInfo)  {
            cc.info("需要先登录才能调用该接口")
            return;
        }

        let theData:object = {"type":"1"};
        //如果使用红包
        if (useHongBao) theData["type"] = "2";

        //输出信息
        cc.info("the data is:", theData);

        if(typeof wx == "undefined") return;

        wx.request({
            url : XYJAPI._baseURL + "api/?do=Ball.Api.Forward.Envelopes",

            header : {
                "X-Token": XYJAPI.userToken,
                "X-Version": XYJAPI.gameVersion,
                "X-Source": XYJAPI.channelID,
            },

            data : theData, 

            method : "POST",

            success : function(res:object):void {
                cc.info("---- Ball.Api.Forward.Envelopes ----")
                cc.info(res);

                let result:object = {};

                let code:string = "" + res["data"]["code"];
                if (code == "200") {
                    //可领取
                    result["state"] = 1;
                } else if (code == "405") {
                    //已领取
                    result["state"] = 2;
                } else {
                    result["state"] = 0;
                    result["message"] = res["data"]["message"];
                }

                let data:object = res["data"]["data"];
                if (data && data["money"]) result["money"] = data["money"];
                
                cc.info(result);
                if (callback != null) callback.call(null, result);
            },

            fail:function(res:object):void {
                cc.info("---- Ball.Api.Forward.Envelopes ----")
                cc.info(res)
                WXCore.showToast("数据请求失败");
            },

            complete : function():void {
            }

        });
    }


    /**
     * 获取本局游戏成功邀请的好
     * 
     * 
     * @see http://www.xiaoyaoji.cn/share/MsmrbiWWx/D7MB1O0q4
     */
    static getNewsInCurrentGameRecord(recordID:string, callback:Function = null):void {
        cc.info("----  小幺鸡 API ----");
        cc.info("-  getNewsInCurrentGameRecord  -");
        
        if (!XYJAPI._userInfo)  {
            cc.info("需要先登录才能调用该接口")
            return;
        }

        let theData:object = {"record_id":recordID};

        //输出信息
        cc.info("the data is:", theData);

        if(typeof wx == "undefined") return;

        wx.request({
            url : XYJAPI._baseURL + "api/?do=Ball.Api.Share.GetGameRecord",

            header : {
                "X-Token": XYJAPI.userToken,
                "X-Version": XYJAPI.gameVersion,
                "X-Source": XYJAPI.channelID,
            },

            data : theData, 

            method : "POST",

            success : function(res:object):void {
                cc.info("---- Ball.Api.Share.GetGameRecord ----")
                cc.info(res);

                let result:object = {};

                let users:number = parseInt(res["data"]["data"]);
                if (!isNaN(users) && users > 0) {
                    if (callback != null) {
                        callback.call(null, users);
                    }
                }
            },

            fail:function(res:object):void {
                cc.info("---- Ball.Api.Share.GetGameRecord ----")
                cc.info(res)
            },

            complete : function():void {
            }

        });
    }



    //================================================================================================
    //通用方法
    //================================================================================================

    /**
     * 创建签名
     */
    static createSign(data:any):string {
        let keys:Array<string> = [];

        for (let key in data) {
            let v:any = data[key];
            if (v == undefined || v == "") continue;
            keys.push("" + key);
        }

        keys.sort();

        let sign:string = "";
        for (let i:number = 0; i < keys.length; i++) {
            let theKey:string = keys[i];

            if (i > 0) sign += "&";
            sign += "" + theKey + "=" + data[theKey];
        }

        //加上key（即渠道号）
        sign += "&key=" + XYJAPI.channelID;

        //计算md5
        sign = md5(sign);

        //大写
        sign = sign.toUpperCase();
        
        return sign;
    }
}
