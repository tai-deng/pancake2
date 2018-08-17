import Command from "../gamecore/managers/legs/Command";
import WXCore from "../gamecore/wechat/WXCore";
import StateManage from "../StateManage/StateManage";
import WXShare from "../gamecore/wechat/WXShare";

const {ccclass, property} = cc._decorator;
/**
 * 分享接力命令 执行体
 */
@ccclass
export default class ShareRelayCommand extends Command {
    constructor(){
        super();
    }

    public execute(){
        let titles = ["煎饼--黄铜","煎饼--黄金","煎饼--铂金","煎饼--大师","煎饼--钻石"];
        let index = Math.floor(Math.random()*titles.length);
        if(index == titles.length) index = 1;
        let title = titles[index];
        let image = cc.url.raw("resources/share/shareBG.jpg")
        let score = StateManage.instance.getData(StateManage.KEY_MAXSCORE);
        let queryObj = {
            score,
            openId:1001,
            userId:123,
        }
        WXShare.setOnShareAppMessage(title,image,queryObj);
    }
}
