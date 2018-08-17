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

@ccclass
export default class GameCoreEvent extends cc.Event {
    //关闭事件
    static COMMON_CLOSE:string = "commonClose";
    //准备事件
    static COMMON_READY:string = "commonReady";

    //数据改变事件
    static DATA_CHANGE:string = "dataChange";



    //===============================================================
    //道具事件
    //===============================================================

    //获得道具
    static ITEM_ADDED:string = "itemAdded";
    //删除道具
    static ITEM_REMOVED:string = "itemRemoved";
    //使用道具
    static ITEM_USED:string = "itemUsed";
    //===============================================================
}
