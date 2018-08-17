import RankCtrl from "./RankCtrl";
import WXCore from "./WXCore";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Small extends cc.Component {

    @property(cc.Node)
    moreBtn:cc.Node = null;
    @property(cc.Node)
    content:cc.Node = null;
    @property(cc.Node)
    shareBtn:cc.Node = null;
    @property(cc.Node)
    againBtn:cc.Node = null;

    private _data:Array<object>;
    get data():Array<object>{
        return this._data;
    }
    set data(v:Array<object>){
        if(this._data != v){
            this._data = v;
            this.refreshUI();
        }
    }
    // onLoad () {}

    start () {
        if(!this._isOnLoadCalled) return;
        this.moreBtn.on(cc.Node.EventType.TOUCH_END,this.more,this.node);
        // this.shareBtn.on(cc.Node.EventType.TOUCH_END,this.share,this.node);
        this.againBtn.on(cc.Node.EventType.TOUCH_END,this.again,this.node);
        
        RankCtrl.instance.on("getsmallRank", this.getsmallRank, this);
        this.scaleContentAuto(cc.find("container",this.node));
        this.scaleContentAuto(cc.find("title",this.node));
        this.scaleContentAuto(cc.find("again",this.node));
        this.getsmallRank();
    }
    private getsmallRank(){
        this.data = RankCtrl.instance.getSmallRank();
        console.log("small",this.data)
    }

    private refreshUI(){
        let data = this.data;
        console.log(cc.director.getScene);
        this.content.removeAllChildren();
        cc.loader.loadRes("small", function(err, prefab){
            for(let i = 0;i < data.length; ++i){
                let item = cc.instantiate(prefab);
                item.getComponent("SmallItem").data = data[i];
                this.content.addChild(item);
            }
        }.bind(this));
    }
    // 查看更多
    private more(ev:Event):void{
        cc.director.loadScene("wholeRank");

        // cc.audioEngine.play(cc.url.raw("sounds/tap"), false, 1);

        // cc.audioEngine.play(cc.url.raw(sourceURL), false, 1);


        console.log("查看更多排名",ev)
    }
    // 分享
    private share(ev:Event):void{
        console.log("分享",ev)
    }
    // 再来一局
    private again(ev:Event):void{
        console.log("again")
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
