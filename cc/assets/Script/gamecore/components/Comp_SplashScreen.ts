import GameManager from "../managers/GameManager";
import LoadingSceneMain from "../managers/scene/LoadingSceneMain";

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
 * 启动屏场景。该脚本请挂载在场景下
 */

@ccclass
export default class Comp_SplashScreen extends cc.Component {

    @property({
        tooltip:"该场景过后进入的场景名称",
        displayName:"主场景名"
    })
    mainSceneName:string = "";


    @property({
        displayName:"停留时间(秒)"
    })
    showTime:number = 2;

    // onLoad () {}

    //主场景是否已加载完成
    private _mainSceneLoaded:boolean;

    start () {
        this.schedule(this.doShowMainScene, 0.1);

        //预加载场景
        if (this.mainSceneName) {
            let script:Comp_SplashScreen = this;
            GameManager.sceneManager.preloadScene(this.mainSceneName, 
                function():void {
                    script.mainSceneLoadedCallback();
                });
        }
    }


    private mainSceneLoadedCallback():void {
        cc.info("【mainSceneLoadedCallback】", this);
        this._mainSceneLoaded = true;
    }


    private _passedTime:number = 0;
    private doShowMainScene():void {
        this._passedTime += 0.1;

        if (this._passedTime > this.showTime && this._mainSceneLoaded) {
            this.unschedule(this.doShowMainScene);

            //====================================================================
            //尝试将加载场景通过动画方式移除
            //====================================================================
            //移除加载场景
            let loadingScript:LoadingSceneMain = this.node.getComponent(LoadingSceneMain);
            if (loadingScript) {
                cc.info("【sceneLoadedCallback】释放加载场景");
                loadingScript.doPreDestory(0.3);
                
                let script:Comp_SplashScreen = this;
                setTimeout(function():void {
                    GameManager.sceneManager.pushScene(script.mainSceneName);
                }, 400);
                return;
            } else {
                GameManager.sceneManager.pushScene(this.mainSceneName);
            }
            //====================================================================
        }
    }




    // update (dt) {}


    onDestroy() {
        this.unschedule(this.doShowMainScene);
    }

}
