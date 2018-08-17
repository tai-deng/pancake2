import Command from "../gamecore/managers/legs/Command";
import WXCore from "../gamecore/wechat/WXCore";
import XYJAPI from "../gamecore/xiaoyaoji/XYJAPI";
import ShareTypes from "../gamecore/xiaoyaoji/ShareTypes";
import StateManage from "../StateManage/StateManage";

const {ccclass, property} = cc._decorator;
/**
 * 分享朋友圈命令 执行体
 */
@ccclass
export default class ShareEventCommand extends Command {
    constructor(){
        super();
    }

    public execute() {
        let anyShare = StateManage.instance.getData(StateManage.KEY_ANYSHARE);
        //请求服务器数据
        XYJAPI.getShareData(function(data:object):void {
            if (data) {
                StateManage.instance.setData(StateManage.KEY_ANYSHARE,anyShare+1);
                let queryObj:object = XYJAPI.getShareQueryData(ShareTypes.NORMAL);
                console.log("--------queryObj---------",queryObj)
                let title:string = data["title"];
                let imageURL:string = data["imageurl"];

                cc.info(imageURL, typeof imageURL);
                if (!imageURL) imageURL = cc.url.raw("resources/share/shareBG.jpg");

                WXCore.shareApp(title, imageURL, queryObj);
            } else {
                WXCore.showToast("请求失败，稍后再试");
            }
        });

        // WXCore.shareApp("煎饼侠",cc.url.raw("resources/share/shareBG.jpg"))
    }
}
