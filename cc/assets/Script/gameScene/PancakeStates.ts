
const {ccclass, property} = cc._decorator;

/**
 * 煎饼状态
 */
@ccclass
export default class PancakeStates {

    //准备状态，用户激活后自动落下
    public static READY:number = 0;


    //下落中
    public static FALLING:number = 1;

    //在平底锅上安静躺着
    public static QUIET:number = 2;

    //上抛中
    public static RISING:number = 3;

}
