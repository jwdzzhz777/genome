export * from './app/lib/types';
export * from './app/lib/decorators';

/** 参考 egg-aop index.d.ts 依靠 ts 自动生成, egg declare 在入口处 */
import 'egg';

declare module 'egg' {
    interface Controller {
        /** 此方法只有 api 装饰器修饰过的 controller 才有！！ */
        getMetadata(name: string): any;
    }
    interface Context {

    }
}
