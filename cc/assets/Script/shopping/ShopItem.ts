

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopItem {
    // 皮肤id
    public id:number;
    // 皮肤资源
    public skinsRes:object ={};
    // 价格
    public price:number = 0;

    // 是否购买 true 购买 false 未购买
    public isBuy:boolean;

    // 是否使用中 true 使用中  false 未使用
    public isUse:boolean;

    // 是否解锁   true 已经解锁    false 待解锁
    public waitBuy: boolean;
    
    // 新品 true 是的 false 不是的
    public newPro:boolean;
}
