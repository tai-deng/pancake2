import ItemBase from "./ItemBase";
import ItemTypes from "./ItemTypes";
import GameManager from "../GameManager";
import GameCoreEvent from "../../GameCoreEvent";

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
 * 道具管理器
 */

@ccclass
export default class ItemManager {



    //道具
    private _allItems:Array<ItemBase> = [];


    /**
     * 获取道具
     */
    public get allItems():Array<ItemBase> {
        return this._allItems.concat();
    }

    /**
     * 根据道具名称获取道具
     * 
     * @param itemName 道具名称
     */
    public getItemsByName(itemName:string):Array<ItemBase> {
        let items:Array<ItemBase> = [];

        this._allItems.forEach(function(ele:ItemBase):void {
            if (ele.name == itemName) {
                items.push(ele);
            }
        })
        return items;
    }


    /**
     * 道具被使用次数
     */
    private _inGameItemUsedCount:object = {};
    private _itemUsedCountTotal:object = {};


    /**
     * 获取某个游戏中道具在一句游戏中使用的次数
     * 
     * @param itemName 
     */
    public getItemUsedCountInGame(itemName:string):number {
        let v:number;
        if (this._inGameItemUsedCount[itemName] != undefined) {
            v = this._inGameItemUsedCount[itemName];
        }

        cc.info("getItemUsedCountInGame");
        cc.info(JSON.stringify(this._inGameItemUsedCount));

        if (isNaN(v) || v < 0) v = 0;

        return v;
    }

    /**
     * 获取某个游戏中道具在整个游戏中使用的次数
     * 
     * @param itemName 
     */
    public getItemUsedCountTotal(itemName:string):number {
        let v:number;
        if (this._itemUsedCountTotal[itemName] != undefined) {
            v = this._itemUsedCountTotal[itemName];
        }

        if (isNaN(v) || v < 0) v = 0;

        return v;
    }


    /**
     * 使用道具
     * 
     * @param item 
     */
    public useItem(item:ItemBase):void {
        let itemName:string = item.name;
        cc.info("used item " + itemName);

        //检查道具是否存在
        let index:number = this._allItems.indexOf(item);
        if (index == -1) return;

        let v:number = this._inGameItemUsedCount[itemName];
        if (isNaN(v) || v < 0) v = 0;
        this._inGameItemUsedCount[itemName] = v + 1;

        v = this._itemUsedCountTotal[itemName];
        if (isNaN(v) || v < 0) v = 0;
        this._itemUsedCountTotal[itemName] = v + 1;

        //使用道具
        item.useItem();

        //删除
        this._allItems.splice(index, 1);

        //抛出事件
        GameManager.eventManager.dispatchEventWith(GameCoreEvent.ITEM_USED, item);

    }



    /**
     * 添加道具
     * 
     * @param item 
     */
    public addItem(item:ItemBase):void {
        if (!item || item.type == ItemTypes.ABSTRACT) return;

        if (this._allItems.indexOf(item) == -1) {
            this._allItems.push(item);

            cc.info("添加道具", item.name);

            //抛出事件
            GameManager.eventManager.dispatchEventWith(GameCoreEvent.ITEM_ADDED, item);
        }
    }


    /**
     * 移除道具
     * 
     * @param item 
     */
    public removeItem(item:ItemBase):void {
        let index:number = this.allItems.indexOf(item);
        if (index != -1) {
            this._allItems.splice(index, 1);

            //抛出事件
            GameManager.eventManager.dispatchEventWith(GameCoreEvent.ITEM_REMOVED, item);
        }
    }



    /**
     * 当游戏结束时，调用该方法，让游戏中道具数据清空。
     */
    public gameEnded():void {
        for (let i:number = 0; i < this._allItems.length; i++) {
            let item:ItemBase = this._allItems[i];
            if (item.type == ItemTypes.IN_GAME) {
                this._allItems.splice(i, 1);
                i--;
            }
        }

        this._inGameItemUsedCount = {};
    }

}
