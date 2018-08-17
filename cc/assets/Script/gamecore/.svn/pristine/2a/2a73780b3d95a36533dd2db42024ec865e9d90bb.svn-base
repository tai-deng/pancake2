
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
 * 事件管理
 */
@ccclass
export default class EventManager extends cc.Node {
    
    /**
     *
     */
    constructor() {
        super();
    }


    /**
     * 派发事件。自动生成cc.Event对象。
     * 
     * @param eventName         事件名称
     * @param data              携带数据
     */
    dispatchEventWith(eventName:string, data:any = null):void {
        let evt:cc.Event = new cc.Event(eventName, false);
        if (data) evt["data"] = data;

        this.dispatchEvent(evt);
    }

    // update (dt) {}

    

}
