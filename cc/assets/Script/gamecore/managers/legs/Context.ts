import Command from "./Command";
import GameManager from "../GameManager";

const {ccclass, property} = cc._decorator;

/**
 * legs框架上下文
 * 
 */
@ccclass
export default class Context {

    //事件管理器
    private _eventMap:object = {};

    /**
     * 绑定事件至命令。收到该事件时，会新建一个命令并执行。
     * 
     * @param eventName                 事件名
     * @param commandClass              命令类
     */
    mapEvent(eventName:string, commandClass):void {
        if (this._eventMap[eventName] == undefined) {
            this._eventMap[eventName] = [];
            GameManager.eventManager.on(eventName, this.eventsHandler, this);
        }

        let commandClasses:Array<any> = this._eventMap[eventName];
        if (commandClasses.indexOf(commandClass) == -1) {
            commandClasses.push(commandClass);
        }
    }


    /**
     * 取消绑定事件
     * 
     * @param eventName                     事件名
     * @param commandClass                  命令类。如果传递null，则取消绑定所有命令
     */
    unmapEvent(eventName:string, commandClass = null):void {
        let commandClasses:Array<any> = this._eventMap[eventName];
        if (commandClasses != undefined) {
            if (commandClass) {
                //取消绑定该事件的指定命令
                let index:number = commandClasses.indexOf(commandClass);
                if (index >= 0) {
                    commandClasses.splice(index, 1);
                    if (commandClasses.length == 0) {
                        delete this._eventMap[eventName];
                        GameManager.eventManager.off(eventName, this.eventsHandler, this);
                    }
                }
            } else {
                //取消绑定所有该事件的命令
                delete this._eventMap[eventName];
                GameManager.eventManager.off(eventName, this.eventsHandler, this);
            }
        }
    }

    /**
     * 解绑所有事件
     */
    unmapAllEvent():void {
        for (let key in this._eventMap) {
            this.unmapEvent(key);
        }
    }


    /**
     * 事件管理器
     */
    private eventsHandler(evt:cc.Event):void {
        let eventName:string = evt.type;
        let eventData:any = evt["data"];

        let commandClasses:Array<any> = this._eventMap[eventName];
        if (commandClasses != undefined) {
            let len:number = commandClasses.length;
            for (let i:number = 0; i < len; i++) {
                let command:Command = new commandClasses[i]();
                command.event = evt;
                command.data = eventData;

                //如果有设置预制体，先加载预制体
                if (command.prefabURL) {
                    command.loadPrefab(function():void {
                        command.execute();
                    });
                } else {
                    command.execute();
                }
            }
        }

    }
}
