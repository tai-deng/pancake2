

const {ccclass, property} = cc._decorator;

@ccclass
export default class TaskJson  {
    public task:Array<object> = [
        {
            id:"0001",                     // 任务id
            title:"翻转煎饼20次",           // 任务名
            content:"累计得分200分",        // 任务说明
            goal:20,                       // 任务目标
            plan:0,                        // 任务完成度
            value:"overturn",              // 任务数据名称
            awardName:"gem",               // 奖励数据名称
            awardNum:50,                   // 奖励数量
        },
        {
            id:"0002",
            title:"获得20个钻石",
            content:"累计获得钻石个",
            goal:20,
            plan:18,
            value:"tagem",
            awardName:"gem",
            awardNum:50,
        },
        {
            id:"0003",
            title:"完成3次一周转体",
            content:"累计完成10次在一次抛接中获得2分的情况",
            goal:3,
            plan:5,
            value:"turn",
            awardName:"gem",
            awardNum:50,
        },
        {
            id:"0004",
            title:"在5秒内翻转3次",
            content:"记录10秒内获得的分数的最大值",
            goal:3,
            plan:0,
            value:"tmturn",
            awardName:"gem",
            awardNum:50,
        },
        {
            id:"0005",
            title:"升级到3级",
            content:"所能达到的等级",
            goal:3,
            plan:0,
            value:"tagrade",
            awardName:"gem",
            awardNum:50,
        },
        {
            id:"0006",
            title:"使用1次复活卡",
            content:"累计使用复活卡1次",
            goal:1,
            plan:0,
            value:"resurgenceCar",
            awardName:"gem",
            awardNum:50,
        },
        // {
        //     id:"0007",
        //     title:"3个好友参与接龙比赛",
        //     content:"累计3个好友点击链接参与了接龙比赛",
        //     goal:3,
        //     plan:20,
        //     value:"fdrelay",
        //     awardName:"gem",
        //     awardNum:50,
        // },
        // {
        //     id:"0008",
        //     title:"疯狂点击中点击100次",
        //     content:"累计疯狂点击次数",
        //     goal:100,
        //     plan:0,
        //     value:"crazyTap",
        //     awardName:"gem",
        //     awardNum:50,
        // },
        {
            id:"0009",
            title:"分享2次",
            content:"累计任意类型分享次数2次",
            goal:2,
            plan:0,
            value:"anyShare",
            awardName:"gem",
            awardNum:50,
        },
        // {
        //     id:"0010",
        //     title:"将20位好友煎至8成熟并分享",
        //     content:"在煎烤好友模式中，获得X分及以上（得X分即X成熟），并进行分享",
        //     goal:20,
        //     plan:10,
        //     value:"ripeShare",
        //     awardName:"gem",
        //     awardNum:50,
        // },
    ]
}
