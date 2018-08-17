import GameConfig from "../GameConfig";
import PancakeStates from "./PancakeStates";
import LevelData from "./LevelData";

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
 * 煎饼
 */
@ccclass
export default class PancakeMain extends cc.Component {
    //ready
    public static EVENT_UI_READY:string = "uiReady"

    //获取到宝石
    public static EVENT_GET_DIAMOND:string = "getDiamond"

    //落在了铁盘上
    public static EVENT_ON_PAN:string = "onPan";

    //离开铁盘
    public static EVENT_LEAVE_PAN:string = "leavePan";

    //接触铁盘
    public static EVENT_TOUCH_PAN:string = "touchPan";

    //死亡
    public static EVENT_DIE:string = "die";

    //获得分数
    public static EVENT_GET_SCORE:string = "getScore";


    //煎饼贴图
    public pancakeTexture:cc.Texture2D;

    //已文字形态体现煎饼。如果设置了该字段，则会忽略 pancakeTexture字段
    public pancakeText:string;


    //中间节点
    private _centerNode:cc.Node;


    //每小块密度
    private _sliceDensity:number = 1;

    //每小块重叠像素
    private _sliceOverlap:number = 2;

    //片段节点
    private _slices:Array<cc.Node> = []


    //当前分数
    private _score:number = 0;

    start () {
        this.node.on(PancakeMain.EVENT_UI_READY, this.uiReadyHandler, this);

        if (this.pancakeText) {
            this.createTextPancake();
        } else {
            this.createPancake();
        }
    }


    /**
     * 煎饼UI准备完毕
     * 
     * @param e 
     */
    private uiReadyHandler(e:cc.Event):void {
        this.node.off(PancakeMain.EVENT_UI_READY, this.uiReadyHandler, this);

        this.createRigidBodies();
        this.applyLevelData();

        //中间节点
        this._centerNode = this._slices[Math.floor(this._slices.length / 2)];
        
        //落在锅底上时，结算分数
        this.node.on(PancakeMain.EVENT_ON_PAN, this.onPanHandler, this);

        this._isReady = true;
    }


    private _isReady:boolean;

    /**
     * 煎饼是否已准备好
     * 
     */
    public get isReady():boolean {
        return this._isReady;
    }


    /**
     * 创建煎饼
     */
    private createPancake():void {
        //煎饼重量。
        // const pancakeWeight:number = 168 * 28;

        this._sliceDensity = 1;
        this._sliceOverlap = 2;

        //煎饼宽
        let pancakeW:number = 168;
        //煎饼高
        let pancakeH:number = 28;

        //煎饼分块数量
        let sliceCount:number = GameConfig.PANCAKE_SLICE_COUNT;

        let sliceW:number = pancakeW/sliceCount;

        for (let i:number = 0; i < sliceCount; i++) {
            let sliceNode:cc.Node = new cc.Node();
            sliceNode.width = sliceW + this._sliceOverlap * 2;
            sliceNode.height = pancakeH;
            sliceNode.x = i * sliceW - pancakeW / 2;

            //贴图
            if (this.pancakeTexture) {
                let child:cc.Node = new cc.Node();
                child.x = -sliceNode.x - sliceW/2;
                sliceNode.addChild(child);

                let sprite:cc.Sprite = child.addComponent(cc.Sprite);
                sprite.spriteFrame = new cc.SpriteFrame(this.pancakeTexture);

                let mask:cc.Mask = sliceNode.addComponent(cc.Mask);
                mask.type = cc.Mask.Type.RECT;
            }

            this.node.addChild(sliceNode);
            this._slices.push(sliceNode);
        }

        this.node.dispatchEvent(new cc.Event(PancakeMain.EVENT_UI_READY, false));
    }



    /**
     * 创建文字煎饼
     */
    private createTextPancake():void {
        if (!this.pancakeText || this.pancakeText.length == 0) return;

        let realText:string = this.pancakeText;
        if (realText.length > 10) {
            realText = realText.substr(0, 9) + "…";
        }
        for (let i:number = 0; i < realText.length; i++) {
            let sliceNode:cc.Node = new cc.Node();
            let label:cc.Label = sliceNode.addComponent(cc.Label);
            label.fontFamily = "苹方";
            label.fontSize = 25;
            label.lineHeight = 28;
            label.string = realText.charAt(i);
            // label.overflow = cc.Label.Overflow.CLAMP;
            sliceNode.height = 28;
            sliceNode.color = new cc.Color(0, 0, 0);

            this.node.addChild(sliceNode);
            this._slices.push(sliceNode);
        }

        this.schedule(this.layoutTextPancake, 0.2, 1);
    }


    /**
     * 排布文字煎饼
     */
    private layoutTextPancake():void {
        let totalW:number = 0;

        for (let i:number = 0; i < this._slices.length; i++) {
            let sliceNode:cc.Node = this._slices[i];
            sliceNode.x = totalW;
            if (sliceNode.width < 20) sliceNode.width = 20;
            totalW += sliceNode.width;
        }

        for (let i:number = 0; i < this._slices.length; i++) {
            let sliceNode:cc.Node = this._slices[i];
            sliceNode.x -= totalW/2;
        }

        //煎饼尺寸为168x28
        this._sliceDensity = (168 * 28)/(totalW * 28);
        this._sliceOverlap = 0;

        this.node.dispatchEvent(new cc.Event(PancakeMain.EVENT_UI_READY, false));
    }


    /**
     * 创建钢体结构
     * 
     */
    private createRigidBodies():void {
        let lastSliceBody:cc.RigidBody;

        for (let i:number = 0; i < this._slices.length; i++) {
            let sliceNode:cc.Node = this._slices[i];

            let realW:number = sliceNode.width - this._sliceOverlap * 2;

            cc.info("====  createRigidBodies  ====");
            // let rigidBody:cc.RigidBody = sliceNode.addComponent(cc.RigidBody);
            let collider:cc.PhysicsBoxCollider = sliceNode.addComponent(cc.PhysicsBoxCollider);
            let rigidBody:cc.RigidBody = sliceNode.getComponent(cc.RigidBody);
            //类型
            // rigidBody.type = cc.RigidBodyType.Dynamic;
            rigidBody.type = cc.RigidBodyType.Static;
            //角速度衰减
            rigidBody.angularDamping = GameConfig.PANCAKE_ANGULAR_DAMPING;
            rigidBody.gravityScale = GameConfig.PANCAKE_GRAVITY_SCALE;//重力系数
            //不旋转
            // rigidBody.fixedRotation = true;
            collider.size = new cc.Size(realW, sliceNode.height);
            collider.friction = GameConfig.PANCAKE_FRICTION;//摩擦系数
            collider.restitution = GameConfig.PANCAKE_RESTITUTION;//弹性系数
            collider.density = this._sliceDensity;
            collider.apply();

            if (!lastSliceBody) {
                lastSliceBody = rigidBody;
            } else {
                //创建连接点
                let revoluteJoint:cc.RevoluteJoint = sliceNode.addComponent(cc.RevoluteJoint);
                revoluteJoint.anchor = new cc.Vec2(-realW/2, 0);
                revoluteJoint.connectedAnchor = new cc.Vec2(realW/2, 0);
                revoluteJoint.connectedBody = lastSliceBody;
                revoluteJoint.collideConnected = false;//连接的两个钢体不碰撞
                revoluteJoint.apply();
                
                //上头绳索
                let ropeJoint:cc.RopeJoint = sliceNode.addComponent(cc.RopeJoint);
                ropeJoint.anchor = new cc.Vec2(0, sliceNode.height / 2 - 0);
                ropeJoint.connectedAnchor = new cc.Vec2(0, sliceNode.height / 2 - 0);
                ropeJoint.connectedBody = lastSliceBody;
                ropeJoint.maxLength = realW + GameConfig.PANCAKE_BEND;
                ropeJoint.collideConnected = false;
                ropeJoint.apply();
                
                //下头绳索
                ropeJoint = sliceNode.addComponent(cc.RopeJoint);
                ropeJoint.anchor = new cc.Vec2(0, -sliceNode.height / 2 + 2);
                ropeJoint.connectedAnchor = new cc.Vec2(0, -sliceNode.height / 2 + 2);
                ropeJoint.connectedBody = lastSliceBody;
                ropeJoint.maxLength = realW + GameConfig.PANCAKE_BEND;
                ropeJoint.collideConnected = false;
                ropeJoint.apply();

                lastSliceBody = rigidBody;
            }


            //======================================================
            //监听事件
            //======================================================
            // body.fixedRotation = true;
            rigidBody.enabledContactListener = true;
            rigidBody.onBeginContact = this.onBeginContact.bind(this);
            // rigidBody.onBeginContact = function(contact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherCollider:cc.PhysicsCollider){
            //     script.onBeginContact(contact, selfCollider, otherCollider);
            // }
            // rigidBody.onEndContact = function(contact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherCollider:cc.PhysicsCollider){
                //     script.onEndContact(contact, selfCollider, otherCollider);
                // }
            rigidBody.onPostSolve = this.onPostSolve.bind(this);
            // rigidBody.onPostSolve = function(contact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherCollider:cc.PhysicsCollider){
                // script.onPostSolve(contact, selfCollider, otherCollider);
            // }
            //======================================================
                    
            
        }
    }



    private _levelData:LevelData;
    /**
     * 设置当前等级数据
     * 
     */
    public set levelData(v:LevelData) {
        if (!v) return;
        if (this._levelData && this._levelData.level == v.level) return;

        this._levelData = v;
        this.applyLevelData();
    }


    /**
     * 提交物理参数设定
     * 
     */
    private applyLevelData():void {
        if (!this._isOnLoadCalled || !this._slices) return;
        if (!this._levelData) return;

        cc.info("【applyLevelData】", JSON.stringify(this._levelData));

        let levelData:LevelData = this._levelData;
        this._slices.forEach(function(sliceNode:cc.Node):void {
            // let rigidBody:cc.RigidBody = sliceNode.addComponent(cc.RigidBody);
            let collider:cc.PhysicsBoxCollider = sliceNode.getComponent(cc.PhysicsBoxCollider);
            let rigidBody:cc.RigidBody = sliceNode.getComponent(cc.RigidBody);
            rigidBody.gravityScale = levelData.gravityScale;
            collider.friction = levelData.friction;//摩擦系数
            collider.restitution = levelData.restitution;//弹性系数
            collider.apply();
        });
    }

    public get centerNode():cc.Node {
        return this._centerNode;
    }




    /**
     * //准备状态，用户激活后自动落下
     * public static READY:number = 0;
     * //下落中
     * public static FALLING:number = 1;
     * //在平底锅上安静躺着
     * public static QUIET:number = 2;
     * //上抛中
     * public static RISING:number = 3;
     */
    private _state:number = 0;


    /**
     * 获取煎饼状态
     * 
     * @see PancakeStates
     */
    public get state():number {
        return this._state;
    }


    //上一次停止的时候的旋转度
    private _lastRotation:number = 0;


    update (dt) {
        if (!this._isReady) return;

        let frames:number = cc.director.getTotalFrames();

        if (frames % 20 == 0) {
            //检查煎饼的线性速度
            let centerBody:cc.RigidBody = this._centerNode.getComponent(cc.RigidBody);
            let velocity:cc.Vec2 = centerBody.getWorldPoint(new cc.Vec2(0, 0), null);
            velocity = centerBody.getLinearVelocityFromWorldPoint(velocity, null);
            if (velocity) {
                // cc.info(this._state, velocity.x, velocity.y);
                
                //=====================================================
                //计算获得分数
                //=====================================================
                let v:number = this.centerNode.rotation;
                v = v - this._lastRotation;
                v = Math.abs(Math.round(v/180));
                if (v > 0) {
                    //获得分数
                    this._score++;
                    
                    this._lastRotation = Math.round(this.centerNode.rotation/180) * 180;
                }
                //=====================================================
                
                let minSpeed:number = 20;
                
                let xv:number = Math.abs(velocity.x);
                let yv:number = Math.abs(velocity.y);
                // cc.info("xv", xv, "yv", yv);
                if (this._state == PancakeStates.FALLING && xv < minSpeed && yv < minSpeed) {
                    if (this._state == PancakeStates.FALLING) {
                        //落在铁盘上
                        this.node.dispatchEvent(new cc.Event(PancakeMain.EVENT_ON_PAN, false));
                    }
                    this._state = PancakeStates.QUIET;//安静躺着
                } else if (velocity.y > minSpeed) {
                    if (this._state == PancakeStates.FALLING) {
                        //下落过程中
                        this.node.dispatchEvent(new cc.Event(PancakeMain.EVENT_ON_PAN, false));
                        this.node.dispatchEvent(new cc.Event(PancakeMain.EVENT_LEAVE_PAN, false));
                    } else if (this._state == PancakeStates.QUIET) {
                        this.node.dispatchEvent(new cc.Event(PancakeMain.EVENT_LEAVE_PAN, false));
                    }
                    
                    this._state = PancakeStates.RISING;//上升
                } else if (velocity.y < -minSpeed) {
                    this._state = PancakeStates.FALLING;//下落
                }
            }
        }
    }


    //是否已激活

    private _actived:boolean;

    public get actived():boolean {
        return this._actived;
    }


    /**
     * 让煎饼掉落
     * 
     */
    public active():void {
        if (this._actived) return;
        this._actived = true;

        this._slices.forEach(function(ele:cc.Node):void {
            let body:cc.RigidBody = ele.getComponent(cc.RigidBody);
            body.type = cc.RigidBodyType.Dynamic;
        });

        this._state = PancakeStates.FALLING;//下落
    }



    /**
     * 落在锅底上结算分数
     * 
     * @param e 
     */
    private onPanHandler(e:cc.Event):void {
        if (this._score > 0) {
            let evt:cc.Event = new cc.Event(PancakeMain.EVENT_GET_SCORE, false);
            evt["data"] = this._score;
            this.node.dispatchEvent(evt);

            this._score = 0;
        }
    }


    private _isDie:boolean = false;
    private _lastDiamondUUID:string;

    // 饼碰撞开始
    private onBeginContact(contact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherCollider:cc.PhysicsCollider){
        let tag:number = otherCollider["tag"];
        // cc.info("【Pancake onBeginContact】", tag);

        // 碰撞到锅
        if(tag != 100){
            contact.disabled = true;
        } else {
            //碰撞点
            let points:Array<cc.Vec2> = contact.getWorldManifold().points;
            if (points && points.length > 0) {
                let po:cc.Vec2 = points[0];
                po = selfCollider.body.getLocalPoint(po, null);
                po = selfCollider.body.node.convertToWorldSpace(po);

                let e:any = new cc.Event(PancakeMain.EVENT_TOUCH_PAN, false);
                e["data"] = po;
                this.node.dispatchEvent(e);
            }
        }

        // 碰撞到钻石
        if(tag == 200 ){
            let diamondNode:cc.Node = otherCollider.body.node;
            if (this._lastDiamondUUID != diamondNode.uuid) {
                this._lastDiamondUUID = diamondNode.uuid;

                let e:any = new cc.Event(PancakeMain.EVENT_GET_DIAMOND, false);
                e["data"] = otherCollider.body.node;
                this.node.dispatchEvent(e);
            }
        }

        //碰撞到墙壁
        if (this._isDie === false && tag >= 300 && tag < 400) {
            this._isDie = true;
            this.node.dispatchEvent(new cc.Event(PancakeMain.EVENT_DIE, false));
        }
    }

    // 饼碰撞结束
    private onEndContact(contact:cc.PhysicsContact,selfCollider:cc.PhysicsCollider,otherCollider:cc.PhysicsCollider){
        // let tag:number = otherCollider["tag"];
        // cc.info("【Pancake onEndContact】", tag);

        // // 碰撞到锅
        // if(tag == 100){
        // }
    }

    //一次接触
    private onPostSolve(contact:cc.PhysicsContact, selfCollider:cc.PhysicsCollider, otherCollider:cc.PhysicsCollider){
        let tag:number = otherCollider["tag"];
        // cc.info("【Pancake onPostSolve】", tag);

        // 碰撞到锅
        if(tag == 100){
            let theBody:cc.RigidBody = selfCollider.body;
            let velocity:cc.Vec2 = theBody.linearVelocity;
            if (velocity.y > 50) {
                // cc.info("-------------@@@@-----------");
                // cc.info("this.state", this.state);
                // cc.info("施加力");
                theBody.linearVelocity = new cc.Vec2(GameConfig.PANCAKE_LEAVE_FORCE_X, velocity.y * GameConfig.PANCAKE_LEAVE_FORCE_Y_FACTOR);
                velocity = theBody.linearVelocity;
            }
        }
    }



    onDestroy() {
        // cc.info("@@@@@@@@@@@@@@@@@@@@");
        // cc.info(this._slices)
        // this._slices.forEach(function(sliceNode:cc.Node):void {
        //     // let rigidBody:cc.RigidBody = sliceNode.addComponent(cc.RigidBody);
        //     let collider:cc.PhysicsBoxCollider = sliceNode.getComponent(cc.PhysicsBoxCollider);
        //     let rigidBody:cc.RigidBody = sliceNode.getComponent(cc.RigidBody);
        //     rigidBody.enabledContactListener = true;
        //     rigidBody.onBeginContact = null;
        //     rigidBody.onPostSolve = null;
        // });
    }

}
