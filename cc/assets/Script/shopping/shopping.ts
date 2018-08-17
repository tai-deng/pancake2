
import ShopMod from "./ShopMod";
import GameManager from "../gamecore/managers/GameManager";
import Utils from "../gamecore/managers/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Shopping extends cc.Component {

    @property(cc.Node)
    potBtn:cc.Node = null;
    @property(cc.Node)
    cakeBtn:cc.Node = null;
    @property([cc.SpriteFrame])
    btnImg:Array<cc.SpriteFrame> = [];
    // 容器
    @property(cc.Node)
    container:cc.Node;

    private itemHeight:number = 176;
    // onLoad () {}

    private getPotData(){
        let potData = ShopMod.instance.getPotList();
        this.ambry = potData;
    }
    private getCakeData(){
        let cakeData = ShopMod.instance.getCakeList();
        this.ambry = cakeData;
    }

    private _itemData:Array<object> = [];
    get ambry():Array<object> {
        return this._itemData;
    }
    set ambry(v:Array<object>) {
        if (this._itemData != v) {
            this._itemData = v;
            this.getData(this.ambry);
        }
    }

    private dataChanged(ev:cc.Event):void{
        if(ev.type == "potDataChanged"){
            this.getPotData();
        }
        if(ev.type == "cakeDataChanged"){
            this.getCakeData();
        }
    }
    // 锅皮肤按钮
    public potButton(){
        cc.log("锅皮肤")
        GameManager.soundsManager.playTapSound();
        ShopMod.instance.isTab = true;
        this.potBtn.getComponent(cc.Sprite).spriteFrame = this.btnImg[1]; //  使用中
        this.cakeBtn.getComponent(cc.Sprite).spriteFrame = this.btnImg[0]; //  未使用
        this.getPotData();
    }
    // 饼皮肤按钮
    public cakeButton(){
        cc.log("饼皮肤");
        GameManager.soundsManager.playTapSound();
        ShopMod.instance.isTab = false;
        this.potBtn.getComponent(cc.Sprite).spriteFrame = this.btnImg[0]; //  使用中
        this.cakeBtn.getComponent(cc.Sprite).spriteFrame = this.btnImg[1]; //  未使用
        
        let cakeData = ShopMod.instance.getCakeList();
        this.ambry = cakeData;
    }

    start () {
        // 注册数据改变事件
        ShopMod.instance.on("potDataChanged",this.dataChanged,this)
        ShopMod.instance.on("cakeDataChanged",this.dataChanged,this)
        this.getPotData();
        Utils.scaleContentAuto(cc.find("shopping",this.node))
    }
    // 渲染商品
    private getData(goods:Array<object>){
        this.container.removeAllChildren();
        let goodNumber = goods.length;
        let row = Math.floor(goodNumber / 3) + (goodNumber % 3 == 0 ? 0 : 1);
        this.container.height = (this.itemHeight+14) * row + 14;
        cc.loader.loadRes("shopping/item", function(err, prefab){
            for(let i = 0;i < goods.length; ++i){
                let item = cc.instantiate(prefab);
                item.getComponent("goods").deploy = goods[i];
                this.container.addChild(item);
            }
        }.bind(this));
        cc.find("Canvas/shopping/scroll").getComponent(cc.ScrollView).scrollToTop(0.1)
    }
    // 购买新皮肤
    public shopping(event, customEventData){
        cc.log("购买",event.target.parent)
    }
    // update (dt) {}
    onDestroy() {
        // 页面退出时保持用户使用信息
        ShopMod.instance.updateData();
        ShopMod.instance.isTab = true;

        // StateManage.instance.off("change", this.stateChangeHandler);
    }
}
