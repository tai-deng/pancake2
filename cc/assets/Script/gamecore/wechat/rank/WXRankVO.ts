const {ccclass, property} = cc._decorator;


/**
 * 微信排行榜数据
 * 
 */
@ccclass
export default class WXRankVO {

    //用户排名(从1开始)
    rank:number = 0;

    //用户昵称
    nickname:string = null;

    //用户头像加载地址
    avatar:string = null;

    //用户openID
    openID:string = null;

    //用户得分
    score:number = 0;


}