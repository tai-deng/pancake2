import RankCtrl from "./RankCtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ranking extends cc.Component {

    @property(cc.Node)  // 所有人的排名容器
    playersContainer:cc.Node = null;
    @property(cc.Node)  // 滑块节点
    scroll:cc.Node = null;
    private itemHeight:number = 112;

    private _data:Array<object>;
    get data():Array<object>{
        return this._data;
    }
    set data(v:Array<object>){
        if(this._data != v){
            this._data = v;
            this.init();
        }
    }
    // onLoad () {}
    
    start () {
        if(!this._isOnLoadCalled) return;
        console.log("总榜",this.data)
        RankCtrl.instance.on("getTotalRankEvent", this.getTotalRank, this);
        this.getTotalRank();
        this.scaleContentAuto(cc.find("container",this.node));
    }
    private getTotalRank(){
        this.data = RankCtrl.instance.getTotallRank();
        console.log(this.data,"ranking");
    }
    private init(){
        this.playersContainer.removeAllChildren();
        let goodNumber = this.data.length;
        this.playersContainer.height = (this.itemHeight+20) * goodNumber + 20;
        cc.loader.loadRes("player", function(err, prefab){
            for(let i = 0;i < this.data.length; ++i){
                let item = cc.instantiate(prefab);
                item.getComponent("RankingItem").data = this.data[i];
                this.playersContainer.addChild(item);
                // cc.log(item.getComponent("RankingItem").data)
            }
        }.bind(this));
        this.scroll.getComponent(cc.ScrollView).scrollToTop(0.1)
    }
    private scaleContentAuto(content:cc.Node):void {
        let desS:number = 750/1334;//设计比例

        let winSize:cc.Size = cc.director.getWinSize();
        let winS:number = winSize.height / winSize.width;
        if (winS > desS) {
            content.scale = winSize.width / 750;
        }
    }
    // update (dt) {}
}
