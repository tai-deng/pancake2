
const {ccclass, property} = cc._decorator;

/**
 * 定义位置常量
 */

@ccclass
export default class LocationValues {

    //顶部居中
    static TOP_CENTER:string = "TC";
    //顶部靠左
    static TOP_LEFT:string = "TL";
    //顶部靠右
    static TOP_RIGHT:string = "TR";

    //底部居中
    static BOTTOM_CENTER:string = "BC";
    //底部靠左
    static BOTTOM_LEFT:string = "BL";
    //底部靠右
    static BOTTOM_RIGHT:string = "BR";
}
