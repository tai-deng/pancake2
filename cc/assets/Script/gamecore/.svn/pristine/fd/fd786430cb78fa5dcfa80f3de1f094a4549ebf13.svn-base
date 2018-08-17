import GameCoreEvent from "../GameCoreEvent";
import GameManager from "./GameManager";

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
 * 数据管理器。可以通过该管理器管理全局数据。
 */
@ccclass
export default class DataManager {
    //字段名
    private static L_KEY:string = "$__dml";

    /**
     * 数据
     */
    private _data:any = {};

    //保存到本地的数据
    private _localData:any = {};


    
    constructor() {
        this.unserialize();


        //每隔10秒保存一次数据
        setInterval(function():void {
            GameManager.dataManager.doSerialize();
        }, 5000);

        if (typeof wx != "undefined") {
            wx.onHide(function():void {
                cc.info("【DataManager】onHide");
                GameManager.dataManager.doSerialize();
            });
        }
    }
    
    //上次改变的字段
    private _lastChangedKey:string;

    /**
     * 获取上次变化值的key值
     */
    public get lastChangedKey():string {
        return this._lastChangedKey;
    }


    /**
     * 设置全局数据。
     * 
     * 
     * 
     * @param key               字段名
     * @param value             字段值
     * @param saveToLocal       是否保存到本地。如果保存到本地，字段值类型必须是简单类型，比如number、boolean、array
     * @param justToday         日期变化后是否删除。该参数只有在saveToLocal参数为true的时候生效。
     * 
     */
    public setData(key:string, 
                   value:any, 
                   saveToLocal:boolean = false,
                   justToday:boolean = false
                ):void {
        if (this._data[key] !== value) {
            this._data[key] = value;

            //保存到本地
            if (saveToLocal === true) {
                let data:any = {"v":value};
                if (justToday === true) data["today"] = GameManager.todayValue;

                this._localData[key] = data;

                //记录变更的key
                if (this._changedKeys.indexOf(key) == -1) {
                    this._hasChanged = true;
                    this._changedKeys.push(key);
                }
            }

            this._lastChangedKey = key;
            GameManager.eventManager.dispatchEventWith(GameCoreEvent.DATA_CHANGE, key);
        }

    }


    /**
     * 获取全局数据
     * 
     * @param key 
     */
    public getData(key:string):any {
        return this._data[key];
    }


    /**
     * 移除数据
     * 
     * @param key 
     */
    public remoteData(key:string):void {
        delete this._data[key];
        delete this._localData[key];

        let index:number = this._changedKeys.indexOf(key);
        if (index >= 0) this._changedKeys.splice(index, 1);

        this._hasChanged = true;
    }


    /**
     * 重置数据
     * 
     */
    public resetData():void {
        this._data = {};
        this._localData = {};

        this._lastChangedKey = null;
        this._changedKeys = [];

        this._hasChanged = true;
    }


    //是否有改变
    private _hasChanged:boolean = false;

    //改变的字段
    private _changedKeys:Array<string> = [];

    /**
     * 序列化数据
     */
    private doSerialize():void {
        cc.info("【DataManager】doSerialize", this._hasChanged, this._changedKeys);

        if (this._hasChanged === false) return;
        this._hasChanged = false;

        //======================================================================
        //写入keys
        //======================================================================
        let keys:Array<string> = [];
        for (let theKey in this._localData) {
            keys.push("" + theKey);
        }
        cc.sys.localStorage.setItem("__" + DataManager.L_KEY + "__keys", JSON.stringify(keys));
        //======================================================================

        while(this._changedKeys.length > 0) {
            let theKey:string = this._changedKeys.pop();
            cc.sys.localStorage.setItem(DataManager.L_KEY + "__" + theKey, JSON.stringify(this._localData[theKey]));
        }
        
    }


    /**
     * 反序列化
     */
    private unserialize():void {
        try {
            //读取所有key
            let v:string = cc.sys.localStorage.getItem("__" + DataManager.L_KEY + "__keys");
            let keys:any = JSON.parse(v);

            for (let i:number = 0; i < keys.length; i++) {
                let key:string = "" + keys[i];

                let v:string = cc.sys.localStorage.getItem(DataManager.L_KEY + "__" + key);
                this._localData[key] = JSON.parse(v);
            }

            //复制数据
            for (let key in this._localData) {
                //{"v":数据值, "today":日期值}
                let data:object = this._localData[key];
                let v:any = data["v"];

                let today:string = data["today"];
                //如果有设置隔日删除，则需要检查日期值
                if (!today || GameManager.todayValue != today) {
                    this._data[key] = v;
                }
            }

        } catch (err) {
            this._localData = {};
        }
    }
    

}
