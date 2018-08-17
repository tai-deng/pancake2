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


if(typeof wx != "undefined"){
    wx.onShow(function(res:object):void {
        cc.info("----  WX Core ----");
        cc.info("-  onShow  -");
        cc.info(res);

        WXCore.query = res["query"];
    });
}

/**
 * 微信核心接口库
 */
@ccclass
export default class WXCore {
    //启动时携带的参数对象
    static query:object;


    private static _systemInfo:object;

    /**
     * 系统信息
     * 
     * brand	    string	    手机品牌	1.5.0
     * model	    string	    手机型号	
     * pixelRatio	number	    设备像素比	
     * screenWidth	number	    屏幕宽度	1.1.0
     * screenHeight	number	    屏幕高度	1.1.0
     * windowWidth	number	    可使用窗口宽度	
     * windowHeight	number	    可使用窗口高度	
     * language	    string	    微信设置的语言	
     * version	    string	    微信版本号	
     * system	    string	    操作系统版本	
     * platform	    string	    客户端平台	
     * fontSizeSetting	number	用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位 px。	1.5.0
     * SDKVersion	    string	客户端基础库版本	1.1.0
     * benchmarkLevel	number	性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好(目前设备最高不到50)	1.8.0
     * battery	        number	电量，范围 1 - 100	1.9.0
     * wifiSignal	    number	wifi 信号强度，范围 0 - 4
     */
    static get systemInfo():object {
        if (!WXCore._systemInfo) {
            WXCore.getSystemInfo();
        }

        return WXCore._systemInfo;
    }

    /**
     * 获取wx SDK版本号
     */
    static get SDKVersion():string {
        if (!WXCore._systemInfo) {
            WXCore.getSystemInfo();
        }

        if (WXCore._systemInfo) {
            return WXCore._systemInfo["SDKVersion"];
        }

        return null;
    }


    private static _benchmarkLevel:number = -1;
    /**
     * 获取性能得分
     * 
     * 性能等级，-2 或 0：该设备无法运行小游戏，-1：性能未知，>=1 设备性能值，该值越高，设备性能越好(目前设备最高不到50)	1.8.0
     */
    public static get benchmarkLevel():number {
        return WXCore._benchmarkLevel;
    }


    /**
     * 获取请求携带参数
     */
    static get queryData():object {
        cc.info("----  WX Core ----");
        cc.info("-  queryData  -");
        
        if(typeof wx == "undefined") return null;

        let options:object = wx.getLaunchOptionsSync();
        cc.info("----  小幺鸡 API ----");
        cc.info("-  wx.getLaunchOptionsSync  -");
        cc.info(options);
    
        if (options)  return options["query"];

        return null;
    }

    /**
     * 获取系统信息
     * 
     * @see https://developers.weixin.qq.com/minigame/dev/document/system/system-info/wx.getSystemInfoSync.html
     */
    private static getSystemInfo():void {
        cc.info("----  WX Core ----");
        cc.info("-  getSystemInfo  -");
        
        if(typeof wx == "undefined") return;
        
        let info = wx.getSystemInfoSync();

        //设备参数
        if (info && info["benchmarkLevel"] != undefined) {
            let v:number = parseInt("" + info["benchmarkLevel"]);
            if (!isNaN(v) && v > 0) {
                WXCore._benchmarkLevel = v;
            }
        }

        WXCore._systemInfo = info;
    }

    



    /**
     * 显示信息提示
     * 
     * @param info 信息内容
     * @param duration 显示时间（毫秒）
     */
    static showToast(info:string, duration:number = 1500):void {
        cc.info("----  WX Core ----");
        cc.info("-  showToast  -");
        cc.info(info)

        if(typeof wx == "undefined") return;

        try {
            wx.showToast({
                "title":info,
                "icon":"none",  	    //有效值 "success", "loading", "none"	
                "duration":duration,  	//提示的延迟时间，单位毫秒，默认：1500
                "mask":false,           //是否显示透明蒙层，防止触摸穿透，默认：false	
            });
        } catch (error) {
            
        }
    }

    //震动反馈
    static vibrateShort():void {
        cc.info("----  WX Core ----");
        cc.info("-  vibrateShort  -");

        if(typeof wx == "undefined") return;

        try {
            wx.vibrateShort({});
        } catch (error) {
            cc.info("catch a error from wx:")
            cc.info(error);
        }
    }


    /**
     * 上报用户分数
     */
    static saveUserScore(score:number) {
        cc.info("----  WX Core ----");
        cc.info("-  saveUserScore  -");

        if(typeof wx == "undefined") return;

        let timestamp = (new Date()).valueOf();
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


    /**
     * 获取我的数据
     * 
     * @see https://developers.weixin.qq.com/minigame/dev/document/open-api/data/wx.getUserCloudStorage.html
     */
    static getUserScore(successCallback:Function, failCallback:Function = null) {
        cc.info("----  WX Core ----");
        cc.info("-  getUserScore  -");

        if(typeof wx == "undefined") return;

        try {
            wx.getUserCloudStorage(
                {
                    "keyList":["score"],
                    "success":successCallback,
                    "fail":failCallback
                }
            );
        } catch (error) {
            cc.info(error);
        }
    }



    /**
     * 获取我的好友数据
     */
    static getFriendData(successCallback:Function, failCallback:Function = null) {
        cc.info("----  WX Core ----");
        cc.info("-  getFriendData  -");

        if(typeof wx == "undefined") return;

        wx.getFriendCloudStorage(
            {
                "keyList":["score"],
                "success":successCallback,
                "fail":failCallback
            }
        );
    }


    /**
     * 预览图片
     * 
     * @param images 图片的url列表
     */
    static previewImage(images:Array<string>):void {
        cc.info("----  WX Core ----");
        cc.info("-  vibrateShort  -");

        if(typeof wx == "undefined") return;

        try {
            wx.previewImage(
                {
                    "urls":images
                }
            );
        } catch (error) {
            
        }
    }



    /**
     * 保存图片到相册
     * 
     * @param imagePath 
     * @param success               保存成功回调
     * @param fail                  保存失败回调
     * @param complete              完成回调
     */
    static saveImageToPhotosAlbum(imagePath:string, success:Function = null, fail:Function = null, complete:Function = null):void {
        cc.info("----  WX Core ----");
        cc.info("-  saveImageToPhotosAlbum  -");
        cc.info(imagePath);

        if(typeof wx == "undefined") return;

        try {
            wx.saveImageToPhotosAlbum(
                {
                    "filePath":imagePath,
                    "success":success,
                    "fail":fail,
                    "complete":complete,
                }
            );
        } catch (error) {
            
        }
    }

    
    /**
     * 分享app
     * 
     * @param   title       分享的title
     * @param   imageURL    分享的图片url
     * @param   queryObj    分享携带数据
     * @param   callback    成功回调
     */
    static shareApp(title:string, 
                    imageURL:string, 
                    queryObj:object = null,
                    callback:Function = null
                ):void {
        cc.info("----  WX Core ----");
        cc.info("-  shareApp  -");

        if(typeof wx == "undefined") return;

        try {
            let obj:object = {
                title : title,
                imageUrl : imageURL,
                success:callback
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
     * 设置关闭小游戏时，是否退出游戏
     * 
     * @param v 
     */
    // static setExitGameWhenHide(v:boolean):void {
    //     cc.info("----  WX Core ----");
    //     cc.info("-  setExitGameWhenHide  -");
    //     cc.info(v);

    //     if(typeof wx == "undefined") return;

    //     if (v) {
    //         wx.onHide(WXCore.hideForExitGameCallback);
    //     } else {
    //         wx.offHide(WXCore.hideForExitGameCallback);
    //     }

    // }


    // private static hideForExitGameCallback():void {
    //     wx.exitMiniProgram();//退出游戏
    // }



    /**
     * 创建图片
     * 
     */
    static createImage(imageURL:string):cc.SpriteFrame {
        cc.info("----  WX Core ----");
        cc.info("-  createImage  -");
        cc.info(imageURL);

        if(typeof wx == "undefined") return null;

        let tex:cc.Texture2D = new cc.Texture2D();
                
        let icon = wx.createImage();
        icon.src = imageURL;
        icon.onload = function() {
            tex.initWithElement(icon);
            tex.handleLoadedTexture();
        }

        return new cc.SpriteFrame(tex);
    }



    static getUserInfo(successCallback, failCallback) {
        try {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                lang: 'zh_CN',
                success:successCallback,
                fail:failCallback
            });
        } catch (error) {
            
        }
    }


    //上报数据
    static setUserBestScore(score:number) {
        let timestamp = (new Date()).valueOf();
        cc.info("setUserBestScore", score, timestamp, typeof timestamp);

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


    //获取我的数据
    static getUserBestScore(successCallback, failCallback) {
        try {
            wx.getUserCloudStorage(
                {
                    "keyList":["score"],
                    "success":successCallback,
                    "fail":failCallback
                }
            );
        } catch (error) {
            cc.info(error);
        }
    }
}
