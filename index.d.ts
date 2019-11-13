import 'egg';

declare module 'egg' {
    interface Controller {
        /** 此方法只有 api 装饰器修饰过的 controller 才有！！ */
        getMetadata(name: string): any;
    }
}
