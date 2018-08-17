import StateManage from "../StateManage/StateManage";
import WXCore from "../gamecore/wechat/WXCore";
import GameManager from "../gamecore/managers/GameManager";
import GameEventNames from "../GameEventNames";
import ShopMod from "./ShopMod";
import GameData from "../GameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Goods extends cc.Component {

    @property(cc.Label)
    price: cc.Label = null;
    @property(cc.Node)
    use: cc.Node;
    @property(cc.Node)
    useIn: cc.Node;
    @property(cc.Node)
    priceNode: cc.Node;
    @property(cc.Node)
    lock: cc.Node;
    @property(cc.Node)
    shopPic: cc.Node;
    @property(cc.Node)
    newPro: cc.Node
    @property(cc.Sprite)
    showPic:cc.Sprite=null;

    private _itemData: object;
    get deploy(): object {
        return this._itemData;
    }
    set deploy(v: object) {
        if (this._itemData != v) {
            this._itemData = v;
            this.initialize();
        }
    }
    // onLoad () {
    // }

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTap, this.node)
    }
    // 渲染 UI
    private initialize() {
        let isTab = ShopMod.instance.isTab;
        let currentImg:cc.SpriteFrame=null;
        if(isTab){
            let arr = new GameData()["pot"];
            let name = this.deploy["skinsRes"]["name"];
            for(let i = 0;i < arr.length;i++){
                if(name == arr[i]["name"]){
                    currentImg = new cc.SpriteFrame( cc.textureCache.addImage( cc.url.raw(arr[i]["hand"]), null, null) );
                }
            }
        }else{
            let arr = new GameData()["cake"];
            let name = this.deploy["skinsRes"]["name"];
            this.showPic.node.scale = 0.55;
            for(let i = 0;i < arr.length;i++){
                if(name == arr[i]["name"]){
                    currentImg = new cc.SpriteFrame( cc.textureCache.addImage( cc.url.raw(arr[i]["pancake"]), null, null) );
                }
            }
        }
        let data = this.deploy;
        for (const key in data) {
            if (key == "price") {
                let myMoney = StateManage.instance.getData(StateManage.KEY_GEM);
                let wantMoney = data[key];
                let color:cc.Color;
                if(myMoney>=wantMoney){
                    color = new cc.Color(0, 0, 255);
                }else{
                    color = new cc.Color(255, 0, 0);
                }
                this.price.getComponent(cc.Label).string = data[key];
                this.price.node.color = color;
            }
            // 买了 或者 使用了
            if (data["isBuy"]) {
                this.shopPic.active = true;
                this.showPic.spriteFrame = currentImg;
                this.newPro.active = false;
                this.lock.active = false;
                this.priceNode.active = false;
                if (data["isUse"]) {
                    this.useIn.active = true;
                    this.use.active = false;
                } else {
                    this.useIn.active = false;
                    this.use.active = true;
                }
            } else if (data["waitBuy"]) {
                this.shopPic.active = true;
                this.showPic.spriteFrame = currentImg;
                this.newPro.active = true;
                this.lock.active = false;
                this.priceNode.active = true;
                this.useIn.active = false;
                this.use.active = false;
            } else {
                this.shopPic.active = false;
                this.newPro.active = false;
                this.lock.active = true;
                this.priceNode.active = false;
                this.useIn.active = false;
                this.use.active = false;
            }
        }
    }
    // 确认购买
    private affirmBuy(trade: object) {
        let myGem = StateManage.instance.getData(StateManage.KEY_GEM);
        let shopPrice = Number(trade["price"])
        // let showInfo = '';
        // if (myGem >= shopPrice) {
        console.log(trade,"------------------------------")
        //     cc.log("购买成功", shopPrice, ShopMod.instance.isTab)
            let surplus = myGem - shopPrice;
            StateManage.instance.setData(StateManage.KEY_GEM, surplus);
            // showInfo = "购买成功，同时解锁了新购买项！";
            let isTab = ShopMod.instance.isTab;
            if (isTab) {
                ShopMod.instance.buyShopPot(trade);
                StateManage.instance.setData(StateManage.KEY_SKINPOT,JSON.stringify(trade["skinsRes"]));
            } else {
                ShopMod.instance.buyShopCake(trade);
                StateManage.instance.setData(StateManage.KEY_SKINCAKE,JSON.stringify(trade["skinsRes"]));
            }

        // } else {
        //     showInfo = "宝石不足";
        // }
        WXCore.showToast("购买成功，同时解锁了新购买项！")
    }
    // 确认 USE
    private affirmUse(trade: object) {
        let isTab = ShopMod.instance.isTab;
        if (isTab) {
            ShopMod.instance.usePot(trade);
            StateManage.instance.setData(StateManage.KEY_SKINPOT,JSON.stringify(trade["skinsRes"]));
        } else {
            ShopMod.instance.useCake(trade);
            StateManage.instance.setData(StateManage.KEY_SKINCAKE,JSON.stringify(trade["skinsRes"]));
        }
    }
    private onTap(ev: cc.Event) {
        let targetNode = ev.target.getComponent("goods");
        targetNode.tapItem(targetNode.deploy);
    }
    // 点击 item
    public tapItem(targetNode: object): void {
        // 是否是已购买的    
        GameManager.soundsManager.playTapSound();

        let myGem = StateManage.instance.getData(StateManage.KEY_GEM);
        let shopPrice = Number(targetNode["price"])

        if (targetNode["isBuy"]) {
            if (targetNode["isUse"]) {
                WXCore.showToast("皮肤已在使用中");
            } else {
                this.affirmUse(targetNode);
                WXCore.showToast("使用成功!");
            }
            // 是否是解锁的
        } else if (targetNode["waitBuy"]){
            if (myGem >= shopPrice) {
                let title: string = "确认购买?";
                let script: Goods = this;
                let callback: Function = function (label: string): void {
                    cc.info(label)
                    if (label == "ok") {
                        script.affirmBuy(targetNode);
                    }
                    if (label == "off") {}
                    GameManager.soundsManager.playTapSound();
                }
                
                GameManager.eventManager.dispatchEventWith(GameEventNames.SHOW_ALERT, [title, callback]);
            } else {
                WXCore.showToast("宝石不足!")
            }
        }else{
            WXCore.showToast("购买上一个皮肤后解锁!")
        }
    }
    // update (dt) {}
}
