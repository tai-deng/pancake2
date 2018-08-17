import WXCore from "./WXCore";
import GameManager from "../managers/GameManager";

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
 * 微信设备相关功能
 */

@ccclass
export default class WXDevice {
    /**
     * 获取系统信息
     * 
     * @see https://developers.weixin.qq.com/minigame/dev/document/system/system-info/wx.getSystemInfoSync.html
     */
    private static getSystemInfo():void {
        cc.info("----  WXDevice ----");
        cc.info("-  getSystemInfo  -");
        
        if(typeof wx == "undefined") return;
        
        let info = wx.getSystemInfoSync();

        //设备参数
        if (info && info["benchmarkLevel"] != undefined) {
            let v:number = parseInt("" + info["benchmarkLevel"]);
            if (!isNaN(v) && v > 0) {
                WXDevice._benchmarkLevel = v;
            }
        }

        WXDevice._systemInfo = info;
    }

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
        if (!WXDevice._systemInfo) {
            WXDevice.getSystemInfo();
        }

        return WXDevice._systemInfo;
    }

    /**
     * 获取wx SDK版本号
     */
    static get SDKVersion():string {
        if (!WXDevice._systemInfo) {
            WXDevice.getSystemInfo();
        }

        if (WXDevice._systemInfo) {
            return WXDevice._systemInfo["SDKVersion"];
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
        return WXDevice._benchmarkLevel;
    }


    
    //短震动反馈
    static vibrateShort():void {
        cc.info("----  WXDevice  ----");
        cc.info("-  vibrateShort  -");

        if (!GameManager.canVibrate) {
            cc.info("已设置不可震动(GameManager.canVibrate");
            return;
        }

        if(typeof wx == "undefined") return;

        try {
            wx.vibrateShort({});
        } catch (error) {
            cc.info("catch a error from wx:")
            cc.info(error);
        }
    }



    //长震动
    static vibrateLong():void {
        cc.info("----  WXDevice  ----");
        cc.info("-  vibrateLong  -");

        if (!GameManager.canVibrate) {
            cc.info("已设置不可震动(GameManager.canVibrate");
            return;
        }

        if(typeof wx == "undefined") return;

        try {
            wx.vibrateLong({});
        } catch (error) {
            cc.info("catch a error from wx:")
            cc.info(error);
        }
    }
}
