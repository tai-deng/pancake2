import GameManager from "./GameManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class SoundsManager extends cc.EventTarget {
    //背景音乐
    static bgSoundID: number = NaN;

    //====================================================================================
    //常用音效设置
    //====================================================================================

    //面板弹出声效素材地址
    popUpSoundSource:string = null;
    

    //点击音效
    tapSoundSource:string = null;
    //====================================================================================

    //场景背景音乐id
    private sceneBgSoundIDs: Array<number> = [];
    private sceneBgSoundURLs: Array<string> = [];

    /**
     *
     */
    constructor() {
        super();

        //读取本地数据
        let v:any = cc.sys.localStorage.getItem("__l__soundsManager_soundMuted");
        if (v == "true") {
            this.muteSound();
        }

        v = cc.sys.localStorage.getItem("__l__soundsManager_musicMuted");
        if (v == "true") {
            this.muteMusic();
        }
    }

    //推入场景背景音乐
    public pushSceneBgMusic(sourceURL:string) {
        let lastURL;
        if (this.sceneBgSoundURLs.length > 0) {
             lastURL = this.sceneBgSoundURLs[this.sceneBgSoundURLs.length - 1];
        }

        if (lastURL != sourceURL) {
            //如果当前有背景音乐，需要暂停
            if (this.sceneBgSoundURLs.length > 0) {
                let lastBgSoundID:number = this.sceneBgSoundIDs[this.sceneBgSoundIDs.length - 1];
                cc.info("暂停背景音乐", this.sceneBgSoundURLs[this.sceneBgSoundURLs.length - 1]);
                cc.audioEngine.pause(lastBgSoundID);
            }

            let id:number = cc.audioEngine.play(cc.url.raw(sourceURL), true, this._musicVolume);
            this.sceneBgSoundIDs.push(id);
            this.sceneBgSoundURLs.push(sourceURL);
            cc.info("播放背景音乐", sourceURL);

            this.refreshBgMusic();
        }
    }

    //推出场景背景音乐（回到上一个场景的背景音乐）
    public popSceneBgMusic() {
        if (this.sceneBgSoundURLs.length <= 1) return;

        let bgSoundID:number = this.sceneBgSoundIDs.pop();
        cc.audioEngine.pause(bgSoundID);

        this.sceneBgSoundURLs.pop();

        bgSoundID = this.sceneBgSoundIDs[this.sceneBgSoundIDs.length - 1];
        cc.audioEngine.resume(bgSoundID);

        this.refreshBgMusic();
    }

    //更新背景音乐
    private refreshBgMusic() {
        //如果当前有背景音乐，需要暂停
        if (this.sceneBgSoundURLs.length == 0) return;
        
        let lastBgSoundID:number = this.sceneBgSoundIDs[this.sceneBgSoundIDs.length - 1];
        console.log("@@@lastBgSoundID", lastBgSoundID);
        if (this._musicMuted) {
            cc.audioEngine.pause(lastBgSoundID);
            cc.audioEngine.setVolume(lastBgSoundID, 0);
        } else {
            cc.audioEngine.resume(lastBgSoundID);
            cc.audioEngine.setVolume(lastBgSoundID, this._musicVolume);
        }
    }





    //是否已静音背景音乐
    private _musicMuted:boolean = false;

    get musicMuted():boolean {
        return this._musicMuted;
    }

    //是否已静音特效声音
    private _soundMuted:boolean = false;

    get soundMuted():boolean {
        return this._soundMuted;
    }

    //静音背景音乐
    muteMusic() {
        if (this._musicMuted) return;

        this._musicMuted = true;
        this.refreshBgMusic();
        
        //本地保存
        cc.sys.localStorage.setItem("__l__soundsManager_musicMuted", this._musicMuted);
    }

    //取消静音背景音乐
    unmuteMusic() {
        if (!this._musicMuted) return;

        this._musicMuted = false;
        this.refreshBgMusic();

        //本地保存
        cc.sys.localStorage.setItem("__l__soundsManager_musicMuted", this._musicMuted);
    }


    //背景音乐音量
    private _musicVolume:number = 1;


    public get musicVolume():number {
        return this._musicVolume;
    }


    //设置背景音乐音量
    public set musicVolume(value:number) {
        if (value >= 0 && this._musicVolume != value) {
            this._musicVolume = value;
            
            this.refreshBgMusic();
        }
    }



    //静音特效音乐
    muteSound() {
        if (this._soundMuted) return;

        this._soundMuted = true;

        //本地保存
        cc.sys.localStorage.setItem("__l__soundsManager_soundMuted", this._soundMuted);
    }


    //取消静音特效音乐
    unmuteSound() {
        if (!this._soundMuted) return;

        this._soundMuted = false;

        //本地保存
        cc.sys.localStorage.setItem("__l__soundsManager_soundMuted", this._soundMuted);
    }

    //音效音量
    private _soundVolume:number = 1;


    public get soundVolume():number {
        return this._soundVolume;
    }


    //设置音效音量
    public set soundVolume(value:number) {
        if (value >= 0 && this._soundVolume != value) {
            this._soundVolume = value;
        }
    }



    //音频资源
    private _audioClipMap:object = {};

    private _loopAudioMap:object = {};

    /**
     * 播放音效
     * 
     * @param   sourceURL           音乐url
     * @param   loop                是否循环播放
     */
    playSound(sourceURL:string, loop:boolean = false):void {
        if (!sourceURL) return;
        if (this._soundMuted) return;

        //如果是循环播放，而且已经存在了，直接忽略
        if (loop && this._loopAudioMap[sourceURL] != undefined) {
            return;
        }

        //如果已经存在AudioClip，直接使用
        if (this._audioClipMap[sourceURL] != undefined) {
            this.playSound_do(sourceURL, loop);
        } else {
            cc.info("【playSound】load sound", sourceURL, loop);
            //加载资源
            let script:SoundsManager = this;
            
            //加载资源
            let realURL:string = sourceURL.replace(/^\/?resources\//, "");
            // sourceURL = cc.url.raw(sourceURL);
            cc.loader.loadRes(realURL, function(err, audio:cc.AudioClip):void {
                if (audio) {
                    script._audioClipMap[sourceURL] = audio;
                    script.playSound_do(sourceURL, loop);
                }
            });
        }

    }


    private playSound_do(sourceURL:string, loop:boolean = false):void {
        let clip:cc.AudioClip = this._audioClipMap[sourceURL];
        if (!clip) return;

        let theAS:cc.AudioSource = new cc.AudioSource();
        theAS.clip = clip;
        if (loop) {
            //如果是循环，记录索引，以便停止
            this._loopAudioMap[sourceURL] = theAS;
            theAS.loop = true;
        }
        theAS.volume = this._soundVolume;
        theAS.play();
    }


    /**
     * 停止播放音效。只有设置了循环播放的音效才能被停止
     * 
     * @param sourceURL 
     */
    stopSound(sourceURL:string):void {
        let theAS:cc.AudioSource = this._loopAudioMap[sourceURL];
        if (!theAS) return;

        theAS.stop();
        delete this._loopAudioMap[sourceURL]
    }


    /**
     * 重置所有音效数据；清空缓存数据。
     * 
     */
    public reset():void {
        //音频资源
        this._audioClipMap = {};

        //停止所有循环播放音效
        for (let key in this._loopAudioMap) {
            let theAS:cc.AudioSource = this._loopAudioMap[key];
            if (theAS) theAS.stop();
        }

        this._loopAudioMap = {};
    }

    /**
     * 播放点击音效。前提是已经设置了 SoundsManager.tapSoundSource;
     */
    playTapSound():void {
        if (this.tapSoundSource) {
            this.playSound(this.tapSoundSource);
        }
    }
}
