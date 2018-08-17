import WXCore from "./WXCore";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RankCtrl extends cc.Node {
    constructor(){
        super();
        this.onMessage();
    }
    private static _instance:RankCtrl=null;
    public static get instance():RankCtrl{
        if(!this._instance) this._instance = new RankCtrl();
        return  this._instance;
    }
    private _flicker:boolean;
    get flicker():boolean{
        return this._flicker;
    }
    set flicker(v:boolean){
        if(this._flicker != v){
            this._flicker=v;
            this.dispatchEvent(new cc.Event("onRankBubble",false))
        }
    }
    private avatarUrl:string;
    // 即将超越下一位
    private _detectionNext:object={};
    get detectionNext():object{
        return this._detectionNext;
    }
    set detectionNext(v:object){
        if(this._detectionNext !=v){
            this._detectionNext = v;

        }
    }
    // 第几名
    private _currentIndex:number=0;
    get currentIndex():number{
        return this._currentIndex;
    }
    set currentIndex(v:number){
        if(this._currentIndex != v){
            this._currentIndex = v;
            this.dispatchEvent(new cc.Event("getSelfRank",false))
        }
    }
    // 所有排行数据
    private _totalRank:Array<object>=[];
    get totalRank():Array<object>{
        return this._totalRank;
    }
    set totalRank(v:Array<object>){
        if(this._totalRank != v){
            this._totalRank = v;
            console.log("==总榜数据==",this._totalRank);
            this.dispatchEvent(new cc.Event("getTotalRankEvent",false));
        }
    }
    // 自己的游戏数据
    private _selfRank:object={};
    get selfRank():object{
        return this._selfRank;
    }
    set selfRank(v:object){
        if(this._selfRank != v){
            this._selfRank = v;
            console.log("==个人数据==",this._selfRank)
            this.dispatchEvent(new cc.Event("getselfRankEvent",false));
        }
    }
    // 小排行榜数据
    private _smallRank:Array<object>=[];
    get smallRank():Array<object>{
        return this._smallRank;
    }
    set smallRank(v:Array<object>){
        if(this._smallRank != v){
            this._smallRank = v;
            console.log("==小榜数据==",this._smallRank)
            this.dispatchEvent(new cc.Event("getsmallRank",false));
        }
    }

    public initData(){
        this.allDataTrim();
        this.selfDataTrim();
        // this.smallDataTrim();
    }
    // 朋友的游戏数据处理
    private allDataTrim():void{
        let that:RankCtrl = this;
        function success(res){
            let arr = res.data;
            let tempData:Array<object>=[];

            for(let i = 0;i < arr.length;i++){
                let parts:Array<object> = arr[i]["KVDataList"];
                let max:number=JSON.parse(parts[0]["value"])["wxgame"]["score"];
                let time:number=JSON.parse(parts[0]["value"])["wxgame"]["update_time"];
                let user:object={};
                for(let j = 0;j < parts.length;++j){
                    if(j+1<parts.length){
                        let score1 = JSON.parse(parts[j+1]["value"])["wxgame"]["score"];
                        let time1 = JSON.parse(parts[j+1]["value"])["wxgame"]["update_time"];
                        if(max < score1){
                            max = score1;
                            time = time1;
                        }
                    }
                }
                if(arr[i]["nickname"]){
                    user["maxScore"] = max;
                    user["dateTime"] = time;
                    user["avatarUrl"] = arr[i]["avatarUrl"];
                    user["nickname"] = arr[i]["nickname"];
                    user["openid"] = arr[i]["openid"];
                    tempData.push(user);
                }
            }
            // 按分数降序
            that.totalRank = tempData.sort(function (obj1, obj2) {
                var val1 = obj1["maxScore"];
                var val2 = obj2["maxScore"];
                if (val1 < val2) {
                    return 1;
                } else if (val1 > val2) {
                    return -1;
                } else {
                    return 0;
                }            
            });
            
            for(let i =0;i < that.totalRank.length;++i){
                that.totalRank[i]["rank"] = i+1;
            }
            that.smallDataTrim();
            console.log(res,"--朋友的数据--",that.totalRank)
        }
        WXCore.getFriendData(success,function(res){
            console.log(res,"朋友的数据---err")
        })
    }
    // 我的游戏数据处理
    private selfDataTrim():void{
        let that = this;
        let success = function(res){
            console.log(res,"我的游戏数据--处理前")
            let arr = res.KVDataList;
            let max:number=JSON.parse(arr[0]["value"])["wxgame"]["score"];
            let time:number=JSON.parse(arr[0]["value"])["wxgame"]["update_time"];
            for(let j = 0;j < arr.length;++j){
                if(j+1<arr.length){
                    let score1 = JSON.parse(arr[j+1]["value"])["wxgame"]["score"];
                    let time1 = JSON.parse(arr[j+1]["value"])["wxgame"]["update_time"];
                    if(max < score1){
                        max = score1;
                        time = time1;
                    }
                }
            }
            let obj = {};
            obj["maxScore"] = max;
            obj["dateTime"] = time;
            obj["isSelf"] = true;
            that.selfRank = obj;
            console.log("--我的数据--处理后",that.selfRank)
        }

        WXCore.getUserScore(success,function(res){
            console.log(res,"我的游戏数据---err")
        })
    }
    // 小排行榜数据处理
    private smallDataTrim():void{
        if(!this.totalRank) return;
        console.log(this.currentIndex,"当前排名")
        let allData = this.totalRank.concat();
        let selfData = this.selfRank;
        let selfTemp:Array<object>=[];
        let selfAvatarUrl = this.avatarUrl;
        let arr:Array<number>=[];

        for(let i =0;i < allData.length;i++){
            
            let Url = allData[i]["avatarUrl"]
            let newUrl = Url.substring(0,Url.lastIndexOf('/'));

            console.log("自己",selfAvatarUrl,"大家",newUrl)
            if(selfAvatarUrl == newUrl){
                this.currentIndex = i;
            }
        }

        allData[this.currentIndex]["isSelf"]=true;
        if(this.currentIndex == allData.length-1 && this.currentIndex > 0){
            if(allData[this.currentIndex-2]){
                arr[0] = this.currentIndex-2;
                arr[1] = this.currentIndex-1;
                arr[2] = this.currentIndex;
            }else if(allData[this.currentIndex-1]){
                arr[0] = this.currentIndex-1;
                arr[1] = this.currentIndex;
            }else{
                arr[0] = this.currentIndex;
            }
        }else if(this.currentIndex == 0){
            if(allData[this.currentIndex+2]){
                arr[0] = this.currentIndex;
                arr[1] = this.currentIndex+1;
                arr[2] = this.currentIndex+2;
            }else if(allData[this.currentIndex+1]){
                arr[0] = this.currentIndex+1;
                arr[1] = this.currentIndex;
            }else{
                arr[0] = this.currentIndex;
            }
        }else{
            arr[0] = this.currentIndex-1;
            arr[1] = this.currentIndex;
            arr[2] = this.currentIndex+1;
        }

        for(let i = 0;i < arr.length;i++){
            selfTemp.push(allData[arr[i]]);
        }

        this.smallRank.length = 0;
        this.smallRank = selfTemp;
        console.log(allData,"------*------",arr,"------*------",this.currentIndex,"-------+++----",this.smallRank);
    }
    // 获取总榜排名
    public getTotallRank(){
        console.log("获取总榜排名",this.totalRank)
        return this.totalRank.concat();
        // return [];
    }
    // 获取自己的排名
    public getSelfRank(){
        let obj = this.totalRank[this.currentIndex];
        let newObj = {};
        for (const k in obj) {
            newObj[k] = obj[k];
        }
        // obj["isSelf"] = true;
        console.log("获取自己的排名",this.selfRank)
        return newObj;
    }
    // 获取小排行榜数据
    public getSmallRank(){
        console.log("获取小排行榜数据",this.smallRank)
        return this.smallRank.concat();
        // return [];
    }
    // 小排行榜获取即将超越的朋友
    public surpassNext(){
        console.log("即将超越的朋友");
        let totalRank:Array<object> = this.totalRank.concat();
        let index:number = this.currentIndex;
        let obj:object = {};
        if(totalRank[index-1]){
            obj = totalRank[index-1];
        }else{
            obj = totalRank[index];
        }
        return obj;
    }
    // 接收主域消息
    private onMessage(){
        let that = this;
        if(typeof wx == "undefined") return;
        wx.onMessage(function(res){

            if(res.direction == 1){
                let scene = cc.director.getScene().name;
                if(scene != "smallRank"){
                    cc.director.loadScene("smallRank");
                }
            }

            if(res.direction == 2){
                cc.director.loadScene("wholeRank");
                console.log("跳转大排行榜")
                that.flicker = false;
            }

            if(res.direction == 3){
                cc.director.loadScene("gameScene");
                console.log("跳转游戏场景")
            }

            if(typeof res.integral == "number"){
                console.log("(((~)))",res["integral"])
                that.onDetectionNext(res);
            }

            if(res.userInfo){
                let str = res.userInfo.avatarUrl;
                that.avatarUrl = str.substring(0,str.lastIndexOf('/'));
                that.initData();
            }
            console.log(res,"接收主域消息");
        })
    }
    // GameScene 即将超越的下一位
    private onDetectionNext(res:object){
        let arr = this.totalRank.concat();
        let temp = {"maxScore":res["integral"],"next":true}
        let index:number;
        arr.push(temp)
        console.log("(((!)))",arr,temp)
        let newArr:Array<object> = arr.sort(function (obj1, obj2) {
            var val1 = obj1["maxScore"];
            var val2 = obj2["maxScore"];
            if (val1 < val2) {
                return 1;
            } else if (val1 > val2) {
                return -1;
            } else {
                return 0;
            }            
        });

        for(let i = 0;i < newArr.length;i++){
            if(newArr[i]["next"]){
                index=i;
            }
        }
        console.log("(((@)))",index)

        if(index-1 <= 0){
            index = 0;
        }else if(index-1 == this.totalRank.length-1){
            index = this.totalRank.length-1;
        }else{
            index = index - 1;
        }
        console.log("(((#)))",index)
        if(this.totalRank[index]){
            let winSize:cc.Size = cc.director.getWinSize();
            cc.info("子域winsize", winSize.width, winSize.height);
            this.detectionNext = {
                "nickname":this.totalRank[index]["nickname"],
                "avatarUrl":this.totalRank[index]["avatarUrl"],
                "posX":res["posX"] * winSize.width,
                "posY":res["posY"] * winSize.height,
                "point":this.totalRank[index]["maxScore"],
                "self":true,
            }

            if(this.currentIndex == index){
                this.detectionNext["self"] = true;
            }else{
                this.detectionNext["self"] = false;
            }
        }
        this.dispatchEvent(new cc.Event("onDetectionNextFd",false));
        if(this.currentIndex>index){
            this.flicker=true;
        }
        console.log("index-->",index,"arr-->",arr,"detectionNext-->",this.detectionNext)
    }
    // 游戏场景 -->> 即将超越下一位好友节点
    public getDetectionNext():object{
        console.log("游戏场景");
        return this.detectionNext;
    }
    // 首页排行气泡
    public getRankBubble():boolean{
        console.log("排行气泡",this.flicker)
        return  this.flicker;
    }
    // 判断是不是自己
    private isSelf(obj:object):number{
        let self:string = this.avatarUrl.substring(0,this.avatarUrl.lastIndexOf('/'));
        let other:string = obj["avatarUrl"].substring(0,obj["avatarUrl"].lastIndexOf('/'));
        let res:number;
        if(self == other){
            res = 1;
        }else{
            res = 0;
        }
        return res;
    }
}
