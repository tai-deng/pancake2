
import StateManage from "../StateManage/StateManage";
import ShowJson from "../gameData";
import ShopItem from "./ShopItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopMod extends cc.Node {
    private static _instance:ShopMod = null;
    public static get instance():ShopMod {
        if (!ShopMod._instance) ShopMod._instance = new ShopMod();
        return ShopMod._instance;
    }

    constructor(){
        super();
        this.getData();
    }

    // 渲染页面的数据
    private _potList:Array<object> = [];
    private _pancakeList:Array<object> = [];
    // json 数据
    private sumPotRes = new ShowJson().pot;
    private sumCakeRes = new ShowJson().cake;
    // 用户使用数据 - 存本地
    private _potStore:Array<object> = [];
    private _cakeStore:Array<object> = [];
    // Tab true 锅 false 饼
    public isTab:boolean = true;

    // 第一次初始化数据
    private initData(){
        for(let i = 0;i < this.sumPotRes.length; ++i){
            let shopItem = this.initNewItem(i,this.sumPotRes)
            this._potList.push(shopItem);
        }
        for(let i = 0;i < this.sumCakeRes.length; ++i){
            let shopItem = this.initNewItem(i,this.sumCakeRes)
            this._pancakeList.push(shopItem);
        }
        console.log(this._pancakeList,"_pancakeList")
    }
    // 获取仓库数据
    private getData(){
        let data = StateManage.instance.getData(StateManage.KEY_SHOPDATA);
        if(JSON.stringify(data) == "{}"){
            this.initData();
        }else{
            data = JSON.parse(data);
            // console.log(data["potSkin"],"---------获取仓库数据22---------")

            // this._potStore = data["potSkin"];
            // this._cakeStore = data["cakeSkin"];

            // this._potList = this.updaNewItem(this._potStore,this._potList);
            // this._pancakeList = this.updaNewItem(this._cakeStore,this._pancakeList);

            this._potList = data["potSkin"];
            this._pancakeList = data["cakeSkin"];
        }
    }
    // 序列化每一个商品
    private initNewItem(index:number,res:Array<object>):object{
        let shopItem = new ShopItem();
        shopItem.id = index;
        shopItem.skinsRes = res[index];
        shopItem.price = res[index]["price"];
        if(index == 0){
            shopItem.isBuy = true;
            shopItem.isUse = true;
            shopItem.waitBuy = true;
            shopItem.newPro = false;
        }else if(index == 1){
            shopItem.isBuy = false;
            shopItem.isUse = false;
            shopItem.waitBuy = true;
            shopItem.newPro = true;
        }else{
            shopItem.isBuy = false;
            shopItem.isUse = false;
            shopItem.waitBuy = false;
            shopItem.newPro = false;
        }
        return shopItem;
    }
    // 把缓存里的用户使用信息更新出来
    private updaNewItem(storageRes:Array<object>,newRes:Array<object>):Array<object>{
        for(let i = 0;i < newRes.length;i++){
            for(let j = 0; j < storageRes.length;j++){
                if(storageRes[j]["id"] == newRes[i]["id"]){
                    newRes[i] = storageRes[i]
                }
            }
        }
        return newRes;
    }
    // 获取锅数据
    public getPotList():Array<any> {
        return this._potList.concat();
    }
    // 获取饼数据
    public getCakeList(){
        return this._pancakeList.concat();
    }
    // 购买锅皮肤
    public buyShopPot(current:object){
        let updatePot = [];
        this._potList.forEach(function(ele,ind) {
            // 待解锁改成 已解锁,已购买,取消新品  下个商品改成 待解锁 未购买 新品
            ele["isUse"] = false;

            if(current["isBuy"]){
                if(!current["isUse"]){
                    current["isUse"] = true;
                }
            }else if(current["waitBuy"]){
                current["isBuy"] = true;
                current["isUse"] = true;
                current["iswaitBuy"] = true;
                current["newPRO"] = false;
            }
            if(ele["id"] == current["id"]){
                ele = current;
                if(this._potList.length > ind+1){
                    this._potList[ind+1]["isBuy"] = false;
                    this._potList[ind+1]["isUse"] = false;
                    this._potList[ind+1]["waitBuy"] = true;
                    this._potList[ind+1]["newPro"] = true;
                }
            }
        }.bind(this));
        this._potStore = this.updateLocality(this._potStore,updatePot);
        this.dispatchEvent(new cc.Event("potDataChanged", false));
    }
    // 购买饼皮肤
    public buyShopCake(current:object){
        cc.log(current,this._pancakeList,"被点击的ITEM")
        let updateCake = [];
        this._pancakeList.forEach(function(ele,ind) {
            // 待解锁改成 已解锁,已购买,取消新品  下个商品改成 待解锁 未购买 新品
            ele["isUse"] = false;
            
            if(current["isBuy"]){
                if(!current["isUse"]){
                    current["isUse"] = true;
                }
            }else if(current["waitBuy"]){
                current["isBuy"] = true;
                current["isUse"] = true;
                current["iswaitBuy"] = true;
                current["newPRO"] = false;
            }
            if(ele["id"] == current["id"]){
                ele = current;
                if(this._pancakeList.length > ind+1){
                    this._pancakeList[ind+1]["isBuy"] = false;
                    this._pancakeList[ind+1]["isUse"] = false;
                    this._pancakeList[ind+1]["waitBuy"] = true;
                    this._pancakeList[ind+1]["newPro"] = true;
                }
            }
        }.bind(this));
        this._pancakeList = this.updateLocality(this._pancakeList,updateCake);
        this.dispatchEvent(new cc.Event("cakeDataChanged", false));
    }
    // USE 锅皮肤
    public usePot(current:object){
        let updatePot = [];
        this._potList.forEach(function(ele,ind) {
            ele["isUse"] = false;
            if(current["isBuy"]){
                if(!current["isUse"]){
                    current["isUse"] = true;
                }
            }
            if(ele["id"] == current["id"]){
                ele = current;
            }
        }.bind(this));
        this._potStore = this.updateLocality(this._potStore,updatePot);
        this.dispatchEvent(new cc.Event("potDataChanged", false));
    }
    // USE 饼皮肤
    public useCake(current:object){
        let updateCake = [];
        this._pancakeList.forEach(function(ele,ind) {
            ele["isUse"] = false;
            if(current["isBuy"]){
                if(!current["isUse"]){
                    current["isUse"] = true;
                }
            }
            if(ele["id"] == current["id"]){
                ele = current;
            }
        }.bind(this));
        this._pancakeList = this.updateLocality(this._pancakeList,updateCake);
        this.dispatchEvent(new cc.Event("cakeDataChanged", false));
    }
    // 更新本地缓存数据
    private updateLocality(locRes:Array<object>,newRes:Array<object>):Array<object>{
        for(let i =0;i < locRes.length;i++){
            for(let j = 0;j < newRes.length;j++){
                if(locRes[i]["id"] == newRes[j]){
                    locRes[i] = newRes[j];
                }
            }
        }
        return locRes
    }
    // 更新仓库数据
    public updateData(){
        let temp ={};
        temp['potSkin'] = this.getPotList();
        temp['cakeSkin'] = this.getCakeList();

        StateManage.instance.setData(StateManage.KEY_SHOPDATA,JSON.stringify(temp));
        console.log(JSON.stringify(temp),"-------------******----------")
    }
}
