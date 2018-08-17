
const {ccclass, property} = cc._decorator;

/**
 * 游戏配置
 */
@ccclass
export default class GameConfig {

    //=============================================================
    //等级配置
    //=============================================================
    static LEVELS:Array<object> = [
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
        {level:1, score:[0, 2], desc:"3分升级",
            dv:[0.93, 0.07, 0, 0],
            panSize:0,
            fv:null, g:null, f:1
        },
        {level:2, score:[3, 6], desc:"7分升级",
            dv:[0.93, 0.067, 0.003, 0],  
            panSize:0, 
            fv:null, g:null, f:0.5, r:null
        },
        {level:3, score:[7, 11], desc:"12分升级",
            dv:[0.93, 0.063, 0.007, 0],  
            panSize:1, 
            fv:null, g:null, f:0.5, r:null
        },
        {level:4, score:[12, 18], desc:"19分升级",
            dv:[0.93, 0.06, 0.01, 0], 
            panSize:2, 
            fv:null, g:null, f:0.5, r:null
        },
		{level:5, score:[19, 29], desc:"30分升级",
            dv:[0.93, 0.056, 0.01, 0.004], 
			tl:[0, 3],
            panSize:0, 
            fv:null, g:null, f:0.5, r:null
        },
		{level:6, score:[30, 99999], desc:"突破最高分！",
            dv:[0.93, 0.052, 0.012, 0.006], 
			tl:[0, 3],
            panSize:2, 
            fv:null, g:null, f:0.5, r:null
        },
    ];
    //=============================================================


    //=============================================================
    //宝石概率配置
    //=============================================================


    //=============================================================
    //游戏主玩法配置
    //=============================================================
    //煎饼分段数量
    static PANCAKE_SLICE_COUNT:number = 6;
    //煎饼重力系数
    static PANCAKE_GRAVITY_SCALE:number = 2.5;
    //煎饼摩擦系数(0-1)
    static PANCAKE_FRICTION:number = 0.65;
    //煎饼弹性系数(0-1)
    static PANCAKE_RESTITUTION:number = 0.05;
    //煎饼弯曲系数(0-2)
    static PANCAKE_BEND:number = 1.1;
    //煎饼角速度衰减。数值越大，煎饼越难以翻面
    static PANCAKE_ANGULAR_DAMPING:number = 1.2;


    //点击屏幕时，施加给手臂的力量（数值越大，抛得越高）
    static PANCAKE_FORCE_VALUE:number = 4000;
    //释放时，事假给手臂的力量（反向）
    static PANCAKE_BACK_FORCE_VALUE:number = -1000;

    //煎饼离开锅底时给予的x方向上的力
    static PANCAKE_LEAVE_FORCE_X:number = 12;
    //煎饼离开锅底时给予的y方向上的力(因子)
    static PANCAKE_LEAVE_FORCE_Y_FACTOR:number = 0.9;
    //=============================================================



}
