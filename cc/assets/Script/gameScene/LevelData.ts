import GameConfig from "../GameConfig";

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
 * 等级数据
 */
@ccclass
export default class LevelData {
    //等级
    public level:number = 0;

    public desc:string = "";

    //分数区间
    public minScore:number = 0;
    public maxScore:number = 0;

    //宝石出现概略
    public diamondValues:Array<number> = null;

    // 0:大, 1:中, 2:小
    public panSize:number = 0;

    // [停留多少秒开始着火, 每多秒扣一分]
    public timeLimitedValue:Array<number> = null;

    //施加力
    public forceValue:number = GameConfig.PANCAKE_FORCE_VALUE;

    //重力系数
    public gravityScale:number = GameConfig.PANCAKE_GRAVITY_SCALE;

    //摩擦系数
    public friction:number = GameConfig.PANCAKE_FRICTION;

    //摩擦系数
    public restitution:number = GameConfig.PANCAKE_RESTITUTION;



    // "level":number,                         //等级，比如1, 2, 3...
    // "score":[number, number],               //分数区间比如[0, 100]
    // "desc":string,                         //描述
    // "dv":[number, number, number],         //[x1概率, x2概率， x3概率]。宝石概率
    // "panSize":{number, null},               //0:大, 1:中, 2:小，默认为大
    // "tl":[],                                 //[停留多少秒开始着火, 每多秒扣一分]不限时，请勿设置该字段。
    // "fv":{number, null},                     //施加力量，可以为空
    // "g":{number, null},                      //重力系数，可以为空
    // "f":{number, null},                      //摩擦系数，可以为空
    // "r":{number, null},                      //弹性系数，可以为空
    public fromObj(obj:object):void {
        if (!obj) return;
        this.level = obj["level"];

        this.desc = obj["desc"];
        
        this.minScore = obj["score"][0];
        this.maxScore = obj["score"][1];
        
        
        if (obj["dv"] != undefined) {
            this.diamondValues = obj["dv"];
        }

        if (obj["panSize"] != undefined) {
            this.panSize = obj["panSize"];
        }
        
        if (obj["tl"] != undefined) {
            this.timeLimitedValue = obj["tl"];
        }
        
        if (obj["fv"] != undefined) {
            this.forceValue = obj["fv"];
        }

        if (obj["g"] != undefined) {
            this.gravityScale = obj["g"];
        }

        if (obj["f"] != undefined) {
            this.friction = obj["f"];
        }

        //弹性系数
        if (obj["r"] != undefined) {
            this.restitution = obj["r"];
        }
        

    }
}
