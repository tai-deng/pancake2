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
 * 显示子域内容组件。需要显示子域内容时，请挂载该组件到一个空节点
 * 
 */
@ccclass
export default class Comp_SubDomainContent extends cc.Component {

    @property({
        displayName:"刷新间隔(秒)",
        tooltip:"如果设置为0，则每帧刷新"
    })
    delayTime:number = 0;

    /**
     * 
     */
    private _sharedSprite:cc.Sprite = null;

    private _sharedTex : cc.Texture2D = null;

    // onLoad () {}

    start () {
        cc.info("【Comp_SubDomainContent】 start");

        //设置节点尺寸
        let winSize:cc.Size = cc.director.getWinSize();
        this.node.width = winSize.width;
        this.node.height = winSize.height;
        
        //获取sprite组件
        this._sharedSprite = this.node.getComponent(cc.Sprite);
        if (!this._sharedSprite) {
            this._sharedSprite = this.node.addComponent(cc.Sprite);
        }

        this._sharedTex = new cc.Texture2D();

        this.updateSubDomainContent();
    }


    //记录上一次刷新子域内容时间点
    private _lastUpdateTime:number = 0;

    update (dt) {
        try {
            if (this.delayTime > 0) {
                let now:number = new Date().getTime();
                if (now - this._lastUpdateTime < this.delayTime * 1000) {
                    return;
                }
                this._lastUpdateTime = now;
            }

            this.updateSubDomainContent();
        } catch (err) {
            
        }

    }


    private _contentScale:number;

    /**
     * 更新子域内容
     */
    private updateSubDomainContent() {
        // cc.info("刷新子域~~~");
        if (typeof wx == "undefined") return;

        cc.info("【Comp_SubDomainContent】刷新子域内容");
        let openDataContext = wx.getOpenDataContext();
        let sharedCanvas = openDataContext.canvas;

        
        this._sharedTex.initWithElement(sharedCanvas);
        this._sharedTex.handleLoadedTexture();
        this._sharedSprite.spriteFrame = new cc.SpriteFrame(this._sharedTex);

        //缩放内容
        if (isNaN(this._contentScale)) {
            let w:number = sharedCanvas.width;
            let h:number = sharedCanvas.height;

            cc.info("shared canvas width is", w);
            cc.info("shared canvas height is", h);
        
            let winSize:cc.Size = cc.director.getWinSize();
            this._contentScale = winSize.width / w;
            this.node.scale = this._contentScale;
        }
    }

}
