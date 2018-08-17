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
 * 小鹿游戏配置
 */
@ccclass
export default class DeerGameConfig{


    private _dataURL:string;



    constructor(dataURL:string) {
        // super();

        this._dataURL = dataURL;

        this.loadData();
    }



    /**
     * 加载数据
     */
    private loadData():void {
        console.log("【DeerGameConfig】loadData", this._dataURL);

        cc.loader.load(this._dataURL, this.loadDataCallback.bind(this));
    }


    private loadDataCallback(err, res):void {
        cc.info("【DeerGameConfig】loadDataCallback");
        cc.info(res, err);
    }
    
}
