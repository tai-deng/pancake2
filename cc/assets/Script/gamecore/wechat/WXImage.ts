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
 * 微信和图片相关的接口
 */

@ccclass
export default class WXImage {

    /**
     * 创建图片
     * 
     */
    static createImage(imageURL:string):cc.SpriteFrame {
        cc.info("----  WXImage ----");
        cc.info("-  createImage  -");
        cc.info(imageURL);

        if(typeof wx == "undefined") return null;

        let tex:cc.Texture2D = new cc.Texture2D();
                
        let icon = wx.createImage();
        icon.src = imageURL;
        icon.onload = function() {
            tex.initWithElement(icon);
            tex.handleLoadedTexture();
        }

        return new cc.SpriteFrame(tex);
    }

    /**
     * 保存图片到相册
     * 
     * @param imagePath 
     * @param success               保存成功回调
     * @param fail                  保存失败回调
     * @param complete              完成回调
     */
    static saveImageToPhotosAlbum(imagePath:string, success:Function = null, fail:Function = null, complete:Function = null):void {
        cc.info("----  WXImage ----");
        cc.info("-  saveImageToPhotosAlbum  -");
        cc.info(imagePath);

        if(typeof wx == "undefined") return;

        try {
            wx.saveImageToPhotosAlbum(
                {
                    "filePath":imagePath,
                    "success":success,
                    "fail":fail,
                    "complete":complete,
                }
            );
        } catch (error) {
            
        }
    }


    /**
     * 预览图片
     * 
     * @param images 图片的url列表
     */
    static previewImage(images:Array<string>):void {
        cc.info("----  WXImage ----");
        cc.info("-  previewImage  -");
        cc.info(images);

        if(typeof wx == "undefined") return;

        try {
            wx.previewImage(
                {
                    "urls":images
                }
            );
        } catch (error) {
            
        }
    }

    /**
     * 获取屏幕截图
     * 
     * @param scale     缩放系数
     * 
     * @return  截图保存的临时文件目录
     */
    static getSnapshotFile(scale:number = 0.5):string {
        cc.info("----  WXImage ----");
        cc.info("-  getSnapshotFile  -");

        if(typeof wx == "undefined") return;

        // let winSize:cc.Size = cc.director.getWinSize();
        // cc.info(winSize.width, winSize.height);
        let frameSize:cc.Size = cc.view.getFrameSize();
        let ratio:number = cc.view.getDevicePixelRatio();
        // cc.info(frameSize.width, frameSize.height, );

        let canvas:any = cc.game.canvas;

        let tempFilePath = canvas.toTempFilePathSync({
            x: 0,
            y: 0,
            // width: winSize.width,
            // height: winSize.height,
            destWidth: frameSize.width * ratio * scale,
            destHeight: frameSize.height * ratio * scale,
        });

        return tempFilePath;
    }


    /**
     * 获取屏幕截图
     * 
     */
    static getSnapshotImage():cc.SpriteFrame {
        cc.info("----  WXImage ----");
        cc.info("-  getSnapshotImage  -");

        if(typeof wx == "undefined") return null;

        // let frameSize:cc.Size = cc.view.getFrameSize();
        // let ratio:number = cc.view.getDevicePixelRatio();

        let canvas:any = cc.game.canvas;
        let data:string = canvas.toDataURL();
        return WXImage.createImage(data);
    }

    
    

}
