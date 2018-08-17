
const {ccclass, property} = cc._decorator;

@ccclass
export default class RankingItem extends cc.Component {

    @property(cc.Label)     // 积分
    integral:cc.Label=null;
    @property(cc.Sprite)    // 用户头像
    userPic:cc.Sprite=null;
    @property(cc.Label)     // 用户昵称
    userName:cc.Label=null;

    @property(cc.Node)  // 第一名
    selfOne:cc.Node = null;
    @property(cc.Node)  // 第二名
    selfTwo:cc.Node = null;
    @property(cc.Node)  // 第三名
    selfThree:cc.Node = null;
    @property(cc.Node)  // 其他名次奖牌
    selfFour:cc.Node = null;
    @property(cc.Label) // 其他名次
    selfPlace:cc.Label = null;

    @property(cc.Node)  // 第一名
    medalOne:cc.Node = null;
    @property(cc.Node)  // 第二名
    medalTwo:cc.Node = null;
    @property(cc.Node)  // 第三名
    medalThree:cc.Node = null;
    @property(cc.Node)  // 其他名次奖牌
    medalFour:cc.Node = null;
    @property(cc.Label) // 其他名次
    place:cc.Label = null;

    private _data:object;
    get data():object {
        return this._data;
    }
    set data(v:object) {
        if(this._data != v){
            this._data = v;
            this.refreshUI();
        }
    }
    // onLoad () {}

    start () {
    }

    private refreshUI(){
        let data = this._data;
    }
    // update (dt) {}
}
