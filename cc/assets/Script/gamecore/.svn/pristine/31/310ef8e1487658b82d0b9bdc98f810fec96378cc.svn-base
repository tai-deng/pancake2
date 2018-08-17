import LoadingSceneMain from "./LoadingSceneMain";
import GameManager from "../GameManager";

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
 * 场景管理器
 */

@ccclass
export default class SceneManager {

    //加载场景最小显示时间(毫秒)
    private static MIN_LOADING_TIME:number = 2000;
    
    //场景队列
    private _sceneStack:Array<string> = [];


    //加载场景。
    //如果有设置加载场景，再切换场景时，会先进入加载场景
    public loadingSceneName:string;

    //当前场景
    private _currentSceneName:string;


    constructor() {
        // cc.info("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        // cc.info("GameManager.sceneManager", GameManager.sceneManager);
        // if (GameManager.sceneManager) {
        //     throw new Error("Please use GameManager.sceneManager");
        // }
    }

    /**
     * 获取当前场景名称
     */
    public get currentSceneName():string {
        return this._currentSceneName;
    }



    /**
     * 推入场景
     * 
     * @param sceneName 场景名称
     */
    public pushScene(sceneName:string):void {
        this._sceneStack.push(sceneName);

        this.loadScene(sceneName);
    }

    /**
     * 预加载场景
     * 
     * @param sceneName 场景名称
     */
    public preloadScene(sceneName:string, success:Function = null, fail:Function = null):void {
        //预加载场景
        cc.director.preloadScene(sceneName, function(err:Error):void {
            cc.info("err", err);
            if (!err) {
                if (success != null) success.call(null);
            } else {
                cc.info("场景" + GameManager.sceneManager.currentSceneName + "加载失败");
                if (fail != null) fail.call(null);
            }
        });
    }



    /**
     * 推出场景，回到上一个场景
     */
    public popScene():string {
        if (this._sceneStack.length > 1) {
            let v:string = this._sceneStack.pop();

            let toScene:string = this._sceneStack[this._sceneStack.length - 1];
            this.loadScene(toScene);
            return v;
        }

        return null;
    }


    /**
     * 重置
     * 
     */
    public reset():void {
        this._sceneStack = [];
        this._currentSceneName = null;
    }



    /**
     * 加载场景
     * 
     * @param sceneName 
     */
    private loadScene(sceneName:string) {
        if (this._currentSceneName == sceneName) return;

        //如果有设置加载场景
        if (this.loadingSceneName) {
            //不能同时加载多个场景
            if (this._isLoading) return;

            this._currentSceneName = sceneName;
            this.showLoadingScene();
            
            //预加载场景
            cc.director.preloadScene(sceneName, function(err:Error):void {
                cc.info("err", err);
                if (!err) {
                    GameManager.sceneManager.sceneLoadedCallback(sceneName);
                } else {
                    cc.info("场景" + GameManager.sceneManager.currentSceneName + "加载失败");

                    //返回到上一个场景
                    GameManager.sceneManager._isLoading = false;
                    GameManager.sceneManager.popScene();
                }
            })
        } else {
            this._currentSceneName = sceneName;
            cc.director.loadScene(sceneName);
        }
    }



    /**
     * 场景加载完毕回调
     * 
     * @param sceneName 加载的场景名
     */
    private sceneLoadedCallback(sceneName:string):void {
        if (this._currentSceneName != sceneName) return;

        //检查最小时间
        let now:number = new Date().getTime();
        cc.info(now - this._startLoadingTime);
        if (now - this._startLoadingTime < SceneManager.MIN_LOADING_TIME) {
            setTimeout(function():void {
                GameManager.sceneManager.sceneLoadedCallback(sceneName);
            }, 1000);
            return;
        }

        //====================================================================
        //尝试将加载场景通过动画方式移除
        //====================================================================
        //移除加载场景
        let canvas:cc.Node = cc.find("Canvas");
        if (canvas) {
            let loadingScript:LoadingSceneMain = canvas.getComponent(LoadingSceneMain);
            if (loadingScript) {
                cc.info("【sceneLoadedCallback】释放加载场景");
                loadingScript.doPreDestory(0.3);
                
                setTimeout(function():void {
                    GameManager.sceneManager.showCurrentScene();
                }, 400);
                return;
            }
        }
        //====================================================================

        this.showCurrentScene();        
    }


    /**
     * 显示当前场景
     */
    private showCurrentScene():void {
        this._isLoading = false;
        cc.director.loadScene(this._currentSceneName);
    }


    private _isLoading:boolean;

    //开始加载的时间（毫秒）
    private _startLoadingTime:number = 0;


    /**
     * 是否正在加载场景
     */
    public get isLoading():boolean {
        return this._isLoading;
    }

    /**
     * 显示加载场景
     */
    private showLoadingScene():void {
        //记录开始显示加载场景的时间
        this._startLoadingTime = new Date().getTime();

        if (this._isLoading) return;
        this._isLoading = true;

        cc.director.loadScene(this.loadingSceneName);
    }

}
