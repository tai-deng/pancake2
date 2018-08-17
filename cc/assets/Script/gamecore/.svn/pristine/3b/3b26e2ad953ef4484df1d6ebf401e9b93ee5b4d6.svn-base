// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

/**
 * 微信开放数据域接口
 */
@ccclass
export default class WXOpenData {

    /**
     * 像子域发送消息
     * 
     * @param msg 
     */
    public static postMessage(msg:object):void {
        cc.info("----  WXOpenData ----");
        cc.info("-  postMessage  -");
        cc.info(msg);

        if(typeof wx == "undefined") return null;

        let openData = wx.getOpenDataContext();
        openData.postMessage(msg);
    }



    /**
     * 上报用户分数
     */
    public static saveUserScoreToCloud(score:number) {
        cc.info("----  WXOpenData ----");
        cc.info("-  saveScoreToCloud  -");

        if(typeof wx == "undefined") return;


        //发送消息
        WXOpenData.postMessage({"action":"__rdm__myScore", "value":score});

        let timestamp:number = (new Date()).valueOf();
        // cc.info("setUserBestScore", score, timestamp, typeof timestamp);

        try {
            wx.setUserCloudStorage(
                {
                    "KVDataList":[
                        {
                            "key":"score",
                            "value":'{"wxgame":{"score":' + score + ', "update_time":' + timestamp + '}}',
                        }
                    ]
                }   
            );
        } catch (error) {
            
        }
    }
}
