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
 * 微信分享相关接口
 * 
 */
@ccclass
export default class WXShare {

    /**
     * 监听用户点击右上角菜单的“转发”按钮时触发的事件
     * 
     * @param title             分享title
     * @param imageURL          分享的图片加载地址
     * @param queryObj          分享携带参数
     * 
     * @see https://developers.weixin.qq.com/minigame/dev/document/share/wx.onShareAppMessage.html
     */
    static setOnShareAppMessage(title:string, imageURL:string, queryObj:object = null):void {
        cc.info("----  WXShare ----");
        cc.info("-  setOnShareAppMessage  -");
        
        if(typeof wx == "undefined") return;

        cc.info(title, imageURL, queryObj)

        let obj:object = {
            title : title,
            imageUrl : imageURL
        }

        if (queryObj) {
            let queryStr:string  = "";
            for (let key in queryObj) {
                if (queryStr != "") queryStr += "&";
                queryStr += encodeURIComponent(key) + "=" + encodeURIComponent(queryObj[key]);
            }
            obj["query"] = queryStr;
        }
        

        wx.onShareAppMessage(function():object {
            return obj;
        });


        wx.showShareMenu(
            {
                "withShareTicket":true
            }
        );
    }



    /**
     * 分享app
     * 
     * @param   title       分享的title
     * @param   imageURL    分享的图片url
     * @param   queryObj    分享携带数据
     */
    static shareApp(title:string, imageURL:string, queryObj:object = null):void {
        cc.info("----  WX Core ----");
        cc.info("-  shareApp  -");

        if(typeof wx == "undefined") return;

        try {
            let obj:object = {
                title : title,
                imageUrl : imageURL
            }

            if (queryObj) {
                let queryStr:string  = "";
                for (let key in queryObj) {
                    if (queryStr != "") queryStr += "&";
                    queryStr += encodeURIComponent(key) + "=" + encodeURIComponent(queryObj[key]);
                }
                obj["query"] = queryStr;
            }

            wx.shareAppMessage(obj);
        } catch (error) {

        }
    }



    /**
     * 分享到群
     * 
     * @param   title       分享的title
     * @param   imageURL    分享的图片url
     * @param   queryObj    分享携带数据
     * @param   callback    返回回调。接受一个string类型参数，为shareTicket
     */
    static shareAppToGroup(title:string, imageURL:string, queryObj:object = null, callback:Function = null):void {
        cc.info("----  WXShare ----");
        cc.info("-  shareAppToGroup  -");

        if(typeof wx == "undefined") return;

        try {
            let obj:object = {
                title : title,
                imageUrl : imageURL,
            }


            if (callback != null) {
                obj["success"] = function(res:object):void {
                    let shareTicket:string = null;
                    if (res && res["shareTickets"]) {
                        shareTicket = res["shareTickets"][0];
                    }

                    callback.call(null, shareTicket);
                }
            }

            if (queryObj) {
                let queryStr:string  = "";
                for (let key in queryObj) {
                    if (queryStr != "") queryStr += "&";
                    queryStr += encodeURIComponent(key) + "=" + encodeURIComponent(queryObj[key]);
                }
                obj["query"] = queryStr;
            }

            wx.shareAppMessage(obj);
        } catch (error) {

        }
    }
}
