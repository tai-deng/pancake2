import WXRankVO from "./WXRankVO";
import WXRankEventNames from "./WXRankEventNames";

const {ccclass, property} = cc._decorator;


/**
 * 微信排行榜数据管理器
 * 
 */
@ccclass
export default class WXRankDataManager extends cc.Node {

    private static _instance:WXRankDataManager;

    /**
     * 获取管理器单例
     */
    public static get instance():WXRankDataManager {
        if (!WXRankDataManager._instance) new WXRankDataManager();
        return WXRankDataManager._instance;
    }


    //好友排行榜数据
    private _friendRankData:Array<WXRankVO> = [];



    constructor() {
        super();

        cc.info("【WXRankDataManager】初始化");

        if (WXRankDataManager._instance) {
            throw new Error("Please use WXRankDataManager.instance");
        }

        WXRankDataManager._instance = this;


        //刷新排行榜数据
        this.refreshRankingData();

        try {
            wx.onMessage(function(data:object):void {
                cc.info("【WXRankDataManager】constructor, wx.onMessage")
                cc.info(data);
                
                if (!data) return;

                let action:string = data["action"];

                switch(action) {
                    case "__rdm__myScore":
                        //设置我的分数
                        WXRankDataManager._instance.myScore = data["value"];
                        break;
                }
            });
        } catch (error) {
            
        }
    }


    /**
     * 获取排行榜数据
     */
    public get friendRankData():Array<WXRankVO> {
        return this._friendRankData.concat();
    }


    private _friendRankNext:WXRankVO;

    /**
     * 获取我的下一个超越的目标
     */
    public get friendRankNext():WXRankVO {
        return this._friendRankNext;
    }


    private _friendRankPrevious:WXRankVO;

    /**
     * 获取我的上一个超越的目标
     */
    public get friendRankPrevious():WXRankVO {
        return this._friendRankPrevious;
    }


    private _friendRankMine:WXRankVO;

    /**
     * 获取我排行榜数据
     */
    public get friendRankMine():WXRankVO {
        return this._friendRankMine;
    }



    private _myScore:number = 0;

    /**
     * 设置我的分数
     */
    public set myScore(v:number) {
        if (this._myScore == v) return;

        this._myScore = v;

        //抛出事件
        WXRankDataManager._instance.dispatchEvent(new cc.Event(WXRankEventNames.MY_SCORE_CHANGE, false));

        //刷新所有数据
        this.refreshAllData();

    }

    public get myScore():number {
        return this._myScore;
    }


    /**
     * avatarUrl	string	用户头像图片 url	
     * city	string	用户所在城市	
     * country	string	用户所在国家	
     * gender	number	用户性别	
     * language	string	显示 country province city 所用的语言	
     * nickName	string	用户昵称	
     * openId	string	用户 openId	
     * province	string	用户所在省份
     */
    private _userInfo:object;

    /**
     * 获取个人信息
     */
    private getUserInfo():void {
        try {
            wx.getUserInfo({
                "openIdList":['selfOpenId'],
                "success":function(res:object):void {
                    cc.info("user info");
                    cc.info(res);

                    let data:Array<object> = res["data"];
                    WXRankDataManager._instance._userInfo = data[0];

                    //刷新小排行榜
                    WXRankDataManager._instance.refreshAllData();
                },
                "fail":null
            })
        } catch (error) {
            
        }
    }



    /**
     * 重新计算所有数据
     */
    private refreshAllData():void {
        if (!this._userInfo) {
            this.getUserInfo();
            return;
        }


        let openID:string = this._userInfo["openId"];
        let avatarURL:string = this._userInfo["avatarUrl"];
        avatarURL = avatarURL.replace(/\/\d+$/, "");
        cc.info("my avatar url", avatarURL);

        let theLen:number = this._friendRankData.length;
        for (let i:number = 0; i < theLen; i++) {
            let vo:WXRankVO = this._friendRankData[i];
            cc.info(vo["avatar"])
            let currentAvatarURL:string = vo["avatar"]
            currentAvatarURL = currentAvatarURL.replace(/\/\d+$/, "");

            if (vo.openID == openID || currentAvatarURL == avatarURL) {
                this._friendRankMine = vo;

                if (this._myScore > vo.score) {
                    vo.score = this._myScore;
                    this.sortFriendRankData();
                }
            }
        }

        if (!this._friendRankData) return;
        let index:number = this._friendRankData.indexOf(this._friendRankMine);
        cc.info("my rank is " + index, ", total is " + theLen);

        if (index >= 1) {
            this._friendRankNext = this._friendRankData[index - 1];
        } else {
            this._friendRankNext = null;
        }

        if (index < theLen - 1) {
            this._friendRankPrevious = this._friendRankData[index + 1];
        } else {
            this._friendRankPrevious = null;
        }

        WXRankDataManager._instance.dispatchEvent(new cc.Event(WXRankEventNames.FRIEND_RANK_CHANGE, false));
    }


    /**
     * 排序数据
     */
    private sortFriendRankData():void {
        //排序
        this._friendRankData.sort(function(a:WXRankVO, b:WXRankVO):number {
            return b.score - a.score;
        });

        let len:number = this._friendRankData.length;
        for (let i:number = 0; i < len; i++) {
            this._friendRankData[i].rank = i + 1;
        }
    }

    /**
     * 刷新排行榜数据
     * 
     */
    public refreshRankingData():void {
        cc.info("获取排行榜数据。。。。。");

        // try {
            wx.getFriendCloudStorage({
                "keyList":["score"],
                "success": function(res):void {
                    cc.info(res);

                    let ranks:Array<WXRankVO> = [];

                    let data:Array<object> = res.data;
                    for (let i = 0; i < data.length; i++) {
                        let obj:object = data[i];

                        let vo:WXRankVO = new WXRankVO();
                        vo.nickname = obj["nickname"];
                        vo.avatar = obj["avatarUrl"];
                        vo.openID = obj["openId"];

                        // try {
                            let kvData = obj["KVDataList"][0];
                            cc.info(kvData);
                            cc.info(kvData["value"]);
                            //"{"wxgame": {"score":100, "update_time": 1527429380432}}"
                            let valueObj = JSON.parse(kvData["value"]);
                            cc.info(valueObj);
                            vo.score = parseInt(valueObj["wxgame"]["score"]);
                        // } catch (error) {
                            
                        // }

                        ranks.push(vo);
                        // cc.info(rankData);
                    }

                    WXRankDataManager._instance._friendRankData = ranks;
                    //排序
                    WXRankDataManager._instance.sortFriendRankData();
                    //刷新数据
                    WXRankDataManager._instance.refreshAllData();
                }
            });
        // } catch (error) {
        //     cc.info("error for wechat api")
        //     cc.info(error);
        // }
    }
}
