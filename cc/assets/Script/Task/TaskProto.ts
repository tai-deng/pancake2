
export default class TaskProto {

    public taskContent:object = {};        // 任务内容
    public isgaina:boolean = false;        // 是否领取
    public isFinish:Boolean = false;       // 是否完成
    public tasknum:number = 1;             // 剩余任务次数

    public isMidnight:boolean = true;      // 是否能更新
    public nextDay:boolean = false;        // 第二天 0 点
}
