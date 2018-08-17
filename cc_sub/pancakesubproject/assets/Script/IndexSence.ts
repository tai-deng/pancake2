import RankCtrl from "./RankCtrl";


const {ccclass, property} = cc._decorator;

@ccclass
export default class IndexSence extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _flicker:boolean=false;
    get flicker():boolean{
            return this._flicker;
        }
    set flicker(v:boolean){
        if(this._flicker != v){
            this._flicker = v;
            this.onRankBubble();
        }
    }

    start () {
        this.node.on("onRankBubble",this.onRankBubble,this);
    }
    private onRankBubble(){
        this.flicker = RankCtrl.instance.getRankBubble();
        let motion:number = this._flicker? 3:2;
        this.buMotion(motion);
        
    }
    // 气泡动作
    private buMotion(num:number){
        if(num == 3){
            let seq = cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(0.8,1.1,1.1),
                    cc.scaleTo(0.4,0.9,0.9)
            ));
            this.node.runAction(seq);
            this.node.active = true;
        }else if(num == 2){
            this.node.active = false;
        }
    }

    // update (dt) {}
}
