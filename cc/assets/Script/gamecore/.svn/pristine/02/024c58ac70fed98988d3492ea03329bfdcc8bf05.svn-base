
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
 * 微信功能类
 */

@ccclass
export default class WXUtils {


    /**
     * 显示信息提示
     * 
     * @param info 信息内容
     * @param duration 显示时间（毫秒）
     */
    static showToast(info:string, duration:number = 1500):void {
        cc.info("----  WX Utils ----");
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

    
}
