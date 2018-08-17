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
 * 功能管理
 */
@ccclass
export default class Utils {

    


    //============================================================================

    //iphone x 顶部条高度
    static get iphoneXTopBarHeight():number {
        return 44;
    }

    //iphone x 底部条高度
    static get iphoneXBottomBarHeight():number {
        return 44;
    }


    /**
     * 检查是否是iphoneX
     * 
     */
    static get isIphoneX():boolean {
        try {
            return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375);
        } catch (error) {
            
        }

        return false;
    }



    /**
     * 将cocos中canvas的rect数据转换为屏幕中的rect数据
     * 
     * @param rect 
     */
    static toScreenRect(rect:cc.Rect):cc.Rect {
        // cc.info("!!!!!!!!!!!!!!!!!!!!!!");
        let winSize:cc.Size = cc.director.getWinSize();
        
        let newRect:cc.Rect = rect.clone();
        // cc.info(newRect.x, newRect.y, newRect.width, newRect.height, newRect.xMin, newRect.yMax);
        //转换为左上角作为(0, 0)点的坐标
        newRect.x = rect.xMin;
        newRect.y = winSize.height - newRect.yMax;
        // cc.info(newRect.x, newRect.y, newRect.width, newRect.height);
        
        //获取屏幕尺寸
        let screenSize:cc.Size = cc.view.getFrameSize();
        // cc.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        // cc.info(screenSize.width, screenSize.height);
        
        //计算缩放比例
        //TODO:NEXT，需要检查canvas的适配策略
        let s:number = screenSize.height / winSize.height;
        // cc.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", s);
        
        
        newRect.x *= s;
        newRect.y *= s;
        newRect.width *= s;
        newRect.height *= s;
        // cc.info(newRect.x, newRect.y, newRect.width, newRect.height);

        return newRect;
    }


    /**
     * 将屏幕中的矩形区域，转换为cocos中canvas的矩形区域
     * 
     * @param rect 
     */
    static fromScreenRect(rect:cc.Rect):cc.Rect {
        // cc.info("!!!!!!!!!!!!!!!!!!!!!!");
        // cc.info("fromScreenRect");

        let winSize:cc.Size = cc.director.getWinSize();
        
        let newRect:cc.Rect = rect.clone();
        // cc.info(newRect.x, newRect.y, newRect.width, newRect.height);
        
        //获取屏幕尺寸
        let screenSize:cc.Size = cc.view.getFrameSize();
        // cc.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        // cc.info(screenSize.width, screenSize.height);
        newRect.y = screenSize.height - newRect.y - newRect.height;
        
        //计算缩放比例
        //TODO:NEXT，需要检查canvas的适配策略
        let s:number = screenSize.height / winSize.height;
        newRect.x /= s;
        newRect.y /= s;
        newRect.width /= s;
        newRect.height /= s;
        
        let canvasRect:cc.Rect = new cc.Rect(newRect.x, newRect.y, newRect.width, newRect.height);
        // cc.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", s);
        // cc.info(canvasRect.x, canvasRect.y, canvasRect.width, canvasRect.height)
        return canvasRect;
    }


    /**
     * 将cocos的资源路径转换为微信小游戏的资源路径。
     * 
     * @param resourcePath 
     */
    static toWechatMiniGameResourcePath(resourcePath:string):string {
        if (resourcePath.charAt(0) == "/") resourcePath = resourcePath.substr(1);
        return "res/raw-assets/" + resourcePath;
    }


    /**
     * 将一个值转换为整型。如果失败，则返回0
     * 
     * @param value
     */
    static toInt(value:any):number {
        let v:number = parseInt("" + value);
        if (isNaN(v)) v = 0;
        return v;
    }



    /**
     * 自动缩放内容
     * 
     * @param content 
     */
    static scaleContentAuto(content:cc.Node):void {
        let desS:number = 1334/750;//设计比例

        let winSize:cc.Size = cc.director.getWinSize();
        let winS:number = winSize.height / winSize.width;
        cc.info("【scaleContentAuto】", desS, winS);
        if (winS > desS) {
            content.scale = winSize.width / 750;
        }
    }



    //==============================================================
    private static _labelToValueMap:object = {};

    /**
     * 将一个label的值增加到或减少到另外一个值。
     * 比如是整数。
     * 
     * @param label 
     * @param v 
     * @param duration          动画时间
     */
    static labelStringToValue(label:cc.Label, v:number, duration:number = 0.5):void {
        if (isNaN(v)) return;
        
        let currentV:number = parseInt(label.string);
        if (isNaN(currentV) || currentV < 0) currentV = 0;
        if (currentV == v) return;

        let uuid:string = label.uuid;
        clearInterval(this._labelToValueMap[uuid]);

        let stepV:number = (v - currentV) / 10;
        let step:number = 0;

        this._labelToValueMap[uuid] = setInterval(function():void {
            step++;
            if (step == 10) {
                label.string = "" + v;
                // cc.info("label to value", v, label.string);
                
                clearInterval(Utils._labelToValueMap[uuid]);
            } else {
                label.string = "" + (currentV + Math.floor(stepV * step));
                // cc.info(v, label.string);
            }

        }, 50);
    }


    /**
     * 将fromNode节点的一个点，转换为toNode节点中的位置
     * 
     * @param po 
     * @param fromNode 
     * @param toNode 
     */
    static positionToPosition(po:cc.Vec2, fromNode:cc.Node, toNode:cc.Node):cc.Vec2 {
        // cc.info("【positionToPosition】")
        // cc.info("original point", po.x, po.y);
        
        po = new cc.Vec2(po.x, po.x);
        po.x += fromNode.width * fromNode.anchorX;
        po.y += fromNode.height * fromNode.anchorY;
        
        po = fromNode.convertToWorldSpace(po);
        // cc.info("world point", po.x, po.y);
        
        po = toNode.convertToNodeSpace(po);
        po.x -= toNode.width * toNode.anchorX;
        po.y -= toNode.height * toNode.anchorY;
        // cc.info("to node point", po.x, po.y);

        return po;
    }


    /**
     * 创建一个带颜色的点
     * 
     * @param size 
     */
    static newPoint(size:number = 10, color:cc.Color = null):cc.Node {
        let theNode:cc.Node = new cc.Node();
        theNode.width = size;
        theNode.height = size;
        var ctx:cc.Graphics = theNode.addComponent(cc.Graphics);
        if (color == null) color = new cc.Color(255, 0, 0, 255);
        ctx.fillColor = color;
        ctx.fillRect(0, 0, theNode.width, theNode.height);
        ctx.stroke();

        return theNode;
    }


 }
