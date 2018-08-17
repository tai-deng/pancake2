import GameManager from "../gamecore/managers/GameManager";
import GameSceneEvents from "./GameSceneEvents";
import GameEventNames from "../GameEventNames";
import DiamondMain from "./DiamondMain";
import PancakeMain from "./PancakeMain";
import PancakeStates from "./PancakeStates";
import GameData from "../GameData";
import LevelData from "./LevelData";
import GameConfig from "../GameConfig";
import WXCore from "../gamecore/wechat/WXCore";
import StateManage from "../StateManage/StateManage";
import Utils from "../gamecore/managers/Utils";

const {ccclass, property} = cc._decorator;


// 手臂类执行体
@ccclass
export default class ActionMain extends cc.Component {

    //锅底尺寸，大
    private static PAN_SIZE_B:number = 330;
    //锅底尺寸，中
    private static PAN_SIZE_M:number = 297;
    //锅底尺寸，小
    private static PAN_SIZE_S:number = 265;


    //油喷溅特效
    @property(cc.Prefab)
    oilEffectPrefab:cc.Prefab = null;

    //煎饼初始化时，离锅底的距离
    public cakeInitDistance:number = 300;

    //钻石预制体
    @property(cc.Prefab)
    diamondPrefab:cc.Prefab = null;

    //煎饼预制体
    @property(cc.Prefab)
    pancakePrefab:cc.Prefab = null;
    
    //钻石容器
    @property(cc.Node)
    diamondContainer:cc.Node = null;
    
    //锅底碰撞体
    @property({
        type:cc.Node,
        displayName:"锅底"
    })
    panBottomNode:cc.Node = null;

    //手臂1段
    @property(cc.Node)
    theArm1:cc.Node = null;
    //手臂2段
    @property(cc.Node)
    theArm2:cc.Node = null;
    //手臂3段
    @property(cc.Node)
    theArm3:cc.Node = null;
    // 手臂上最高分
    @property(cc.Label)
    maxScore:cc.Label = null;

    //交互节点
    @property(cc.Node)
    touchNode:cc.Node = null;


    //火特效节点
    @property(cc.Node)
    fireEffectNode:cc.Node = null;

    //是否正在触摸
    private _isTouching:boolean = false;


    //煎饼
    private _pancake:cc.Node;
    private _pancakeMain:PancakeMain;

    onLoad(){

    }

    start(){
        //设置可操作
        this.enableTouch = true;
        
        // 设置最高分
        this.maxScore.string = StateManage.instance.getData(StateManage.KEY_MAXSCORE);

        //生效皮肤
        this.applySkinData();

        //创建新的煎饼
        this.createNewPancake();

        //输出皮肤信息
        if (GameManager.isDebug) {
            let arms:Array<cc.Node> = [this.theArm1, this.theArm2, this.theArm3];
            let skinData:Array<object> = [];
            arms.forEach(function(arm:cc.Node):void {
                let content:cc.Node = arm.getChildByName("content");
                skinData.push({"x":content.x, "y":content.y, "w":content.width, "h":content.height, "sx":content.scaleX, "sy":content.scaleY, "r":content.rotation});
            });
            cc.info("================================================");
            cc.info("================== 皮肤数据 =====================");
            cc.info(JSON.stringify(skinData));
            cc.info("================================================");
        }
        
        // 监听最高分
        StateManage.instance.on("change",this.stateChangeHandler,this);
        //监听游戏结束事件
        this.node.on(GameEventNames.GAME_OVER, this.gameOverHandler, this);
    }


    private _levelData:LevelData;

    // 请查看GameConfig中的等级数据配置
    public get levelData():LevelData {
        return this._levelData;
    }


    /**
     * 设置等级数据
     */
    public set levelData(v:LevelData) {
        if (!v) return;
        if (this._levelData && this._levelData.level == v.level) return;

        this._levelData = v;

        this.refreshPanSkin();

        //更新物理参数
        if (this._pancakeMain) {
            this._pancakeMain.levelData = this._levelData;
        }
    }



    //当前皮肤
    private _currentSkinName:string = "default";
    
    
    /**
     * 设置当前皮肤名
     */
    public set currentSkinName(v:string) {
        if (this._currentSkinName == v) return;
        this._currentSkinName = v;

        this.applySkinData();
    }


    public get currentSkinName():string {
        return this._currentSkinName;
    }
   


    //当前煎饼皮肤
    private _currentPancakeSkinName:string = "default";
    
    
    /**
     * 设置当前煎饼皮肤名
     */
    public set currentPancakeSkinName(v:string) {
        if (this._currentPancakeSkinName == v) return;
        this._currentPancakeSkinName = v;

        this.createNewPancake();
    }


    public get currentPancakeSkinName():string {
        return this._currentPancakeSkinName;
    }


    //当前煎饼文本皮肤
    private _currentPancakeText:string = null;
    
    
    /**
     * 设置当前煎饼文本皮肤。
     * 
     * 如果设置了文本皮肤，则贴图皮肤会忽略。
     * 
     */
    public set currentPancakeText(v:string) {
        if (this._currentPancakeText == v) return;
        this._currentPancakeText = v;

        this.createNewPancake();
    }


    public get currentPancakeText():string {
        return this._currentPancakeText;
    }


    


    /**
     * 生效皮肤数据
     * 
     */
    private applySkinData():void {
        if (!this._isOnLoadCalled) return;

        // name:"defult",
        // bigArm:'resources/action/defult/bigArm.png',
        // lowerArm:'resources/action/defult/lowerArm.png',
        // hand:'resources/action/defult/hand.png',
        // pancake:'resources/action/defult/pancake.png',
        // data:[{"x":1.3,"y":-3,"w":152,"h":324,"sx":1,"sy":1},{"x":0,"y":0,"w":143,"h":206,"sx":1,"sy":1},{"x":109.9,"y":0,"w":463,"h":66,"sx":1,"sy":1}],

        //当前皮肤数据
        let targetSkinData:object;

        let gameData:GameData = new GameData();
        let skins:Array<object> = gameData.pot;
        for (let i:number = 0; i < skins.length; i++) {
            let skinData:object = skins[i];
            cc.info(skinData["name"], this._currentSkinName);
            if (skinData["name"] == this._currentSkinName) {
                targetSkinData = skinData;
                break;
            }
        }

        cc.info("------------ 皮肤数据 ---------------");
        cc.info(JSON.stringify(targetSkinData));
        cc.info("-----------------------------------");
        if (!targetSkinData) return;

        let script:ActionMain = this;

        let arm1Content:cc.Node = this.theArm1.getChildByName("content");
        arm1Content.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame( cc.textureCache.addImage( cc.url.raw(targetSkinData["bigArm"]), null, null) );

        let arm2Content:cc.Node = this.theArm2.getChildByName("content");
        arm2Content.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame( cc.textureCache.addImage( cc.url.raw(targetSkinData["lowerArm"]), null, null) );

        let arm3Content:cc.Node = this.theArm3.getChildByName("content");
        // this._lastPanSkinURL = targetSkinData["hand"];
        // arm3Content.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame( cc.textureCache.addImage( cc.url.raw(this._lastPanSkinURL), null, null) );


        //位置、大小、缩放、旋转
        let arms:Array<cc.Node> = [arm1Content, arm2Content, arm3Content];
        let vdata:Array<object> = targetSkinData["vdata"];
        if (vdata && vdata.length == arms.length) {
            for (let i:number = 0; i < arms.length; i++) {
                let armContent:cc.Node = arms[i];
                let theData:object = vdata[i];
                // armContent.x = theData["x"];
                // armContent.y = theData["y"];
                // armContent.width = theData["w"];
                // armContent.height = theData["h"];
                // armContent.scaleX = theData["sx"];
                // armContent.scaleY = theData["sy"];
                // armContent.rotation = theData["r"];
            }
        } else {
            cc.info("-----------------------------------");
            cc.info("皮肤 " + this._currentSkinName + " vdata 数据不正确");
            cc.info("-----------------------------------");
        }

        this.refreshPanSkin();
    }



    private _lastPanSkinURL:string;

    /**
     * 更新锅底的皮肤
     */
    private refreshPanSkin():void {
        cc.info("【refreshPanSkin】", this._levelData, this._currentSkinName)
        if (!this._levelData || !this._currentSkinName) return;

        //当前皮肤数据
        let targetSkinData:object;

        let gameData:GameData = new GameData();
        let skins:Array<object> = gameData.pot;
        for (let i:number = 0; i < skins.length; i++) {
            let skinData:object = skins[i];
            cc.info(skinData["name"], this._currentSkinName);
            if (skinData["name"] == this._currentSkinName) {
                targetSkinData = skinData;
                break;
            }
        }

        if (!targetSkinData) return;

        let panSkinURL:string = targetSkinData["hand"];

        //"panSize":{number, null},               //0:大, 1:中, 2:小，默认为大
        let panSize:number = this._levelData.panSize;
        let panW:number = 0;
        if (panSize == 1) {//中
            panSkinURL = panSkinURL.replace("_b.png", "_m.png");
            panW = ActionMain.PAN_SIZE_B;
        } else if (panSize == 2) {//小
            panSkinURL = panSkinURL.replace("_b.png", "_s.png");
            panW = ActionMain.PAN_SIZE_S;
        } else {
            panW = ActionMain.PAN_SIZE_B;
        }

        let collider:cc.PhysicsBoxCollider = this.panBottomNode.getComponent(cc.PhysicsBoxCollider);
        collider.size.width = panW;
        collider.apply();

        let joint:cc.WeldJoint = this.panBottomNode.getComponent(cc.WeldJoint);
        joint.anchor.x = -panW/2;
        joint.apply();

        if (panSkinURL != this._lastPanSkinURL) {
            this._lastPanSkinURL = panSkinURL;

            let arm3Content:cc.Node = this.theArm3.getChildByName("content");
            let sf:cc.SpriteFrame = new cc.SpriteFrame( cc.textureCache.addImage( cc.url.raw(this._lastPanSkinURL), null, null) );
            arm3Content.getComponent(cc.Sprite).spriteFrame = sf;
        }

    }

    /**
     * 创建新的蛋糕
     * 
     */
    public createNewPancake():void {
        if (this._pancake) {
            this._pancake.removeFromParent(true);
            this._pancake = null;
            this._pancakeMain = null;
        }

        //删除所有钻石
        while (this._diamonds.length) {
            this._diamonds.pop().removeFromParent();
        }

        //=====================================================================
        //当前皮肤数据
        //=====================================================================
        let targetPancakeSkinData:object;
        let gameData:GameData = new GameData();
        let skins:Array<object> = gameData.cake;
        for (let i:number = 0; i < skins.length; i++) {
            let skinData:object = skins[i];
            if (skinData["name"] == this._currentPancakeSkinName) {
                targetPancakeSkinData = skinData;
                break;
            }
        }

        let texture:cc.Texture2D;
        if (targetPancakeSkinData) {
            texture = cc.textureCache.addImage( cc.url.raw(targetPancakeSkinData["pancake"]), null, null);
        }
        //=====================================================================
         

        this._pancake = cc.instantiate(this.pancakePrefab);
        this._pancakeMain = this._pancake.getComponent(PancakeMain);
        this._pancakeMain.levelData= this._levelData;

        
        //皮肤
        if (texture) this._pancakeMain.pancakeTexture = texture;
        
        //文字皮肤
        // if (this._currentPancakeText) this._pancakeMain.pancakeText = this._currentPancakeText;


        this._pancake.x = this.panBottomNode.x;
        this._pancake.y = this.panBottomNode.y + this.cakeInitDistance;
        this.node.addChild(this._pancake);

        //监听事件
        this._pancake.on(PancakeMain.EVENT_TOUCH_PAN, this.pancakeEventsHandler, this);
        this._pancake.on(PancakeMain.EVENT_ON_PAN, this.pancakeEventsHandler, this);
        this._pancake.on(PancakeMain.EVENT_LEAVE_PAN, this.pancakeEventsHandler, this);
        this._pancake.on(PancakeMain.EVENT_GET_DIAMOND, this.pancakeEventsHandler, this);
        this._pancake.on(PancakeMain.EVENT_GET_SCORE, this.pancakeEventsHandler, this);
        this._pancake.on(PancakeMain.EVENT_DIE, this.pancakeEventsHandler, this);
    }

    //宝石
    private _diamonds:Array<cc.Node> = [];

    /**
     * 创建一个新的钻石
     */
    private createNewDiamond():void {
        cc.info("【createNewDiamond】");
        if (this._diamonds.length > 0) return;

        //================================================================
        //钻石数量
        //================================================================
        let diamCount:number = 0;

        //请查看GameConfig中的等级数据配置
        let values:Array<number> = this.levelData.diamondValues;
        if (values && values.length > 0) {
            let randomV:number = Math.random();
            let v:number = 0;
            for (let i:number = 0; i < values.length; i++) {
                v += values[i];
                if (v >= randomV) {
                    diamCount = i;
                    break;
                }
            }
        }
        //================================================================

        if (diamCount > 0) {
            let diam:cc.Node = cc.instantiate(this.diamondPrefab);
            diam.x = this.diamondContainer.width / 2 - Math.random() * this.diamondContainer.width;
            diam.y = this.diamondContainer.height / 2 - Math.random() * this.diamondContainer.height;
            diam.getComponent(DiamondMain).count = diamCount;

            this.diamondContainer.addChild(diam);
            this._diamonds.push(diam);
        }
    }

    /**
     * 移除宝石
     */
    private removeADiamond(diam:cc.Node):void {
        let index:number = this._diamonds.indexOf(diam);
        if (index >= 0) {
            this._diamonds.splice(index, 1);
            
            // diam.removeFromParent(true);
            diam.getComponent(DiamondMain).doDisappear();
        }
    }


    //是否是第一次tap
    private _doneFirstTap:boolean;

    //开始触摸
    private touchStartHandler(e:cc.Event):void {
        cc.info("【touchStartHandler】");
        this._isTouching = true;

        let body:cc.RigidBody = this.theArm1.getComponent(cc.RigidBody);
        let force:number = this._levelData.forceValue;
        if (this._levelData.panSize == 2) force *= ActionMain.PAN_SIZE_M/ActionMain.PAN_SIZE_S;//中
        else if (this._levelData.panSize == 1) force *= 1;//小
        else force *= ActionMain.PAN_SIZE_B/ActionMain.PAN_SIZE_S//大
        body.applyLinearImpulse(new cc.Vec2(force, 0), new cc.Vec2(0, 0), true);

        this.activeCake();
    }


    // 触摸结束
    private touchEndHandler(e:cc.Event):void {
        this._isTouching = false;

        let body:cc.RigidBody = this.theArm1.getComponent(cc.RigidBody);
        body.applyLinearImpulse(new cc.Vec2(-2000, 0), new cc.Vec2(0, 0), true);
    }

    /**
     * 获取饼是否已激活
     */
    public get cakeActived():boolean {
        return this._pancakeMain.actived;
    }
    

    /**
     * 激活饼
     * 
     */
    public activeCake():void {
        if (this._pancakeMain && this._pancakeMain.isReady == true) {
            this._pancakeMain.active();
        }

        if (!this._doneFirstTap) {
            this._doneFirstTap = true;
            this.node.dispatchEvent(new cc.Event(GameSceneEvents.GAME_START, true));
        } else {
            //音效
            GameManager.soundsManager.playSound("resources/sounds/throw.mp3");
        }
    }



    private _enableTouch:boolean;


    /**
     * 设置是否可操作
     */
    public set enableTouch(v:boolean) {
        cc.info("【enableTouch】", v);

        if (this._enableTouch == v) return;
        this._enableTouch = v;

        if (this._enableTouch) {
            this.touchNode.on(cc.Node.EventType.TOUCH_START, this.touchStartHandler, this);
            this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEndHandler, this);
        } else {
            this._isTouching = false;

            this.touchNode.off(cc.Node.EventType.TOUCH_START, this.touchStartHandler, this);
            this.touchNode.off(cc.Node.EventType.TOUCH_END, this.touchEndHandler, this);
        }
    }


    public get enableTouch():boolean {
        return this._enableTouch;
    }
    


    /**
     * 宝石数量
     */
    private _diamondCount:number = 0;

    public get diamondCount():number {
        return this._diamondCount;
    }



    /**
     * 分数
     */
    private _score:number = 0;

    public get score():number {
        return this._score;
    }



    //上次播放接触音效的时间点
    private _lastTouchPanSoundTime:number = 0;

    /**
     * 
     * @param e
     */
    private pancakeEventsHandler(e:cc.Event):void {
        // cc.info("【ActionMain pancakeEventsHandler】", e.type);

        let eType:string = e.type;
        switch (eType) {
            case PancakeMain.EVENT_TOUCH_PAN:
                //接触锅底
                let pancakeMain:PancakeMain = this._pancake.getComponent(PancakeMain);
                if (pancakeMain.state == PancakeStates.FALLING) {
                    //如果是下落过程，播放油喷溅效果
                    let point:cc.Vec2 = e["data"];
                    // cc.info(point.x, point.y);
                    // let newPo:cc.Vec2 = this.node.convertToNodeSpace(point);
                    // cc.info(newPo.x, newPo.y, "@@@@@@@@");
                    this.newOilEffect(point);


                    let now:number = new Date().getTime();
                    if (now - this._lastTouchPanSoundTime > 300) {
                        this._lastTouchPanSoundTime = now;
                        GameManager.soundsManager.playSound("resources/sounds/getscore.mp3");
                    }
                }
                break;
            case PancakeMain.EVENT_ON_PAN:
                this.createNewDiamond();

                this.pancakeOnPan();
                break;
            case PancakeMain.EVENT_LEAVE_PAN:
                this.cancelPancakeOnPan();
                break;
            case PancakeMain.EVENT_GET_SCORE:
                let score:number = parseInt(e["data"]);
                if (!isNaN(score) && score > 0) {
                    cc.info("获得分数", score);

                    this._score += score;

                    //音效
                    // this.schedule(function():void {
                    //     GameManager.soundsManager.playSound("resources/sounds/getscore.mp3");
                    // }, 0.1, score - 1);

                    //抛出事件
                    this.node.dispatchEvent(new cc.Event(GameSceneEvents.SCORE_CHANGED, false));
                    
                    // 累计翻转任务
                    let taskR:number = StateManage.instance.getData(StateManage.KEY_OVERTURN);
                    console.log(score,"------累计翻转A------",taskR)
                    taskR = Utils.toInt(taskR) + score;
                    StateManage.instance.setData(StateManage.KEY_OVERTURN, taskR);
                    console.log(score,"------累计翻转B------",taskR)

                }
                break;
            case PancakeMain.EVENT_GET_DIAMOND:
                let theDiamond:cc.Node = e["data"] as cc.Node;

                //播放音效
                GameManager.soundsManager.playSound("resources/sounds/getdiam.mp3");

                //每个宝石节点会携带不同数量的宝石数量
                this._diamondCount += theDiamond.getComponent(DiamondMain).count;

                //移除宝石
                this.removeADiamond(theDiamond);

                //抛出事件
                this.node.dispatchEvent(new cc.Event(GameSceneEvents.DIAMONDS_CHANGED, false));
                break;
            case PancakeMain.EVENT_DIE:
                //抛出事件
                this.node.dispatchEvent(new cc.Event(GameSceneEvents.GAME_OVER, false));

                this.createNewPancake();
                break;
        }
    }


    private _oilEffects:Array<cc.Node> = [];
    private _lastOilEffectTime:number = 0;

    /**
     * 创建一个油溅效果
     */
    private newOilEffect(po:cc.Vec2):void {
        //检查摩擦系数
        if (this._levelData.friction >= GameConfig.PANCAKE_FRICTION) return;

        //最小间隔时间限制
        let now:number = new Date().getTime();
        if (now - this._lastOilEffectTime < 100) return;
        this._lastOilEffectTime = now;

        let effect:cc.Node;
        if (this._oilEffects.length < 3) {
            effect = cc.instantiate(this.oilEffectPrefab);
            cc.director.getScene().addChild(effect)
        } else {
            effect = this._oilEffects.shift();
            effect.getComponent(cc.ParticleSystem).resetSystem();
        }
        
        this._oilEffects.push(effect);

        effect.x = po.x;
        effect.y = po.y;
        // this.node.addChild(effect);
    }

    
    /**
     * 煎饼在锅底上是，开始处理限时逻辑
     * 
     */
    private pancakeOnPan():void {
        //[停留多少秒开始着火, 每多秒扣一分]
        //扣分至当前等级最低分时，停止扣分
        cc.info("【pancakeOnPan】", this._levelData.timeLimitedValue);
        if (!this._levelData.timeLimitedValue) return;

        this.fireEffectNode.active = false;
        this._onPanTime = 0;
        this._lastMinusScoreTime = NaN;

        this.unschedule(this.onPaning);
        this.schedule(this.onPaning, 1, 1000);
    }

    //在锅底上的时间（秒）
    private _onPanTime:number;
    private _lastMinusScoreTime:number;
    private onPaning():void {
        if (!this._levelData.timeLimitedValue) return;

        this._onPanTime++;

        //[停留多少秒开始着火, 每多秒扣一分, 多少秒后直接死亡]
        if (this._onPanTime >= this._levelData.timeLimitedValue[0]) {
            this.fireEffectNode.active = true;

            //播放音效
            GameManager.soundsManager.playSound("resources/sounds/firing.mp3", true);

            if (isNaN(this._lastMinusScoreTime)) this._lastMinusScoreTime = this._levelData.timeLimitedValue[0];

            let deltaT:number = this._onPanTime - this._lastMinusScoreTime;
            deltaT = Math.floor(deltaT / this._levelData.timeLimitedValue[1]);
            if (deltaT > 0) {
                //检查最低分
                if (this._score > this._levelData.minScore) {
                    //减去分数
                    this._score -= 1;

                    //抛出事件
                    this.node.dispatchEvent(new cc.Event(GameSceneEvents.SCORE_CHANGED, false));
                    this._lastMinusScoreTime = this._onPanTime;
                } else {
                    this.cancelPancakeOnPan();
                }

            }
        }
    }


    /**
     * 煎饼离开锅底
     */
    private cancelPancakeOnPan():void {
        if (!this._levelData.timeLimitedValue) return;

        //停止播放音效
        GameManager.soundsManager.stopSound("resources/sounds/firing.mp3");


        this.fireEffectNode.active = false;
        this.unschedule(this.onPaning);
    }



    /**
     * 游戏结束事件
     * 
     * @param e 
     */
    private gameOverHandler(e:cc.Event):void {
        this.cancelPancakeOnPan();

        if (this._pancake) {
            this._pancake.removeFromParent(true);
            this._pancake = null;
            this._pancakeMain = null;
        }
    }


    update (dt) {
        //如果有触发
        if (this._isTouching) {
            let body:cc.RigidBody = this.theArm1.getComponent(cc.RigidBody);
            let force:number = this._levelData.forceValue;
            if (this._levelData.panSize == 2) force *= 1.15;//中
            else if (this._levelData.panSize == 1) force *= 1;//小
            else force *= 1.3//大
            body.applyLinearImpulse(new cc.Vec2(force, 0), new cc.Vec2(0, 0), true);
        } else {
            let body:cc.RigidBody = this.theArm1.getComponent(cc.RigidBody);
            body.applyLinearImpulse(new cc.Vec2(GameConfig.PANCAKE_BACK_FORCE_VALUE, 0), new cc.Vec2(0, 0), true);
        }



        // let frames:number = cc.director.getTotalFrames();
        // if (frames % 20 == 0) {
        // }


    }

    private stateChangeHandler(ev:cc.Event):void{
        let key:string = StateManage.instance.lastChangedKey;
        if (key == StateManage.KEY_MAXSCORE) {
            // 设置最高分
            this.maxScore.string = StateManage.instance.getData(StateManage.KEY_MAXSCORE);
        }
    }

    onDestroy() {
        cc.info("【ActionMain】onDestroy");

        this.cancelPancakeOnPan();

        if (this._pancake) {
            this._pancake.removeFromParent(true);
            this._pancake = null;
            this._pancakeMain = null;
        }
    }
}
