import 'reflect-metadata';
import { mergeObjList } from './utils';

/** 用于存储 path 装饰符修饰过的路由 */
export const apiPaths = new Set();

/** useful!!! symbol.description is defined in es2019 */
/// <reference lib="es2019.Symbol" />
export const apiDoc = Symbol('apiDoc');
const routePaths = Symbol('paths');

const paramsMetadataKey = Symbol('params');
const queryMetadataKey = Symbol('query');
const bodyMetadataKey = Symbol('body');
const responseMetadataKey = Symbol('response');
const descMetadataKey = Symbol('description');

/** 所有会存储在方法上的元数据名称的集合 */
let keys = [
    paramsMetadataKey,
    responseMetadataKey,
    queryMetadataKey,
    descMetadataKey,
    bodyMetadataKey
];

/**
 * Api 类装饰器, 只有装饰了该装饰器的类才能提供相关能力
 * 由于 egg-router 对传入的 Controller 方法进行了封装:
 * const wrappedController = (ctx, next) => {
 *     return utils.callFn(controller, [ ctx, next ], ctx);
 * };
 * 所以无发通过遍历获得所有 route 对应的方法及方法的父 Controller 类
 * 方案是通过该装饰器返回一个新的构造函数,遍历函数内所有方法，并重载
 * 重载过的函数会判断传入的参数中是否含有预设的参数,若有不调用原方法,并返回方法上的元数据
 * @param  ...args [description]
 * @return         [description]
 */
export function Api<T extends {new(...args: any[]): {}}>(constructor: T) {
    // 拿到 controller 下的所有可遍历的方法
    let methods = Object.keys(constructor.prototype);
    /**
     * 统一存储存有元数据的方法对应的 path 路径
     * 父类 Api 装饰, 自身 path 装饰的方法才会有元数据 同时存对应路由 path
     */
    let { [routePaths]: paths } = constructor.prototype;
    paths && paths.forEach((path: string) => apiPaths.add(path));
    return class extends constructor {
        /** 重载所有方法, 对方法进行拦截  */
        constructor(...args: any[]) {
            super(...args);

            /** 被该装饰器装饰过啦 */
            this[apiDoc] = true;

            methods.forEach(key => {
                this[key] = (ctx: any, next: any) => {
                    if (ctx[apiDoc]) {
                        return this.getMetadata(key);
                    } else {
                        return super[key](ctx, next);
                    }
                };
            });
        }
        /**
         * 获得对应方法名的
         * @param  name 方法名
         * @return   该方法的元数据
         */
        public getMetadata(name: string) {
            let result = {};
            keys.forEach((key: any) => {
                let data = Reflect.getMetadata(key, this, name);
                data && (result[key.description] = data);
            });
            return result;
        }
    };
}

/**
 * path 装饰器
 * path 用于存储防止未被装饰过的方法被该插件调用, 会出现很大的问题
 * @param  path 传入的路由必须和 egg-route 注册的路由一致 否则没用
 */
export function path(path: string) {
    // @ts-ignore
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        /**
         * 装饰器的执行顺序 为先方法装饰器再类装饰器
         * 所以存储 path 的操作放在类装饰器中
         */
        if (target[routePaths]) {
            target[routePaths].push(path);
        } else {
            target[routePaths] = [ path ];
        }
        /**
         * 将该方法设置可枚举,方便我遍历
         * 只有可遍历的方法才会被 Api 装饰器重载
         */
        descriptor.enumerable = true;
    };
}

/**
 * params 装饰器
 * @param  data 接口入参
 */
export function params(...data: object[]) {
    return Reflect.metadata(paramsMetadataKey, mergeObjList(data));
}

/**
 * query 装饰器
 * @param  data 接口查询入参
 */
export function query(...data: object[]) {
    return Reflect.metadata(queryMetadataKey, mergeObjList(data));
}

/**
 * desc 装饰器
 * @param  description 描述
 */
export function desc(description: string) {
    return Reflect.metadata(descMetadataKey, description);
}

/**
 * response 装饰器
 * @param  data 接口出参
 */
export function response(data: any) {
    return Reflect.metadata(responseMetadataKey, data);
}

/**
 * body 装饰器
 * @param  data post 接口入参
 */
export function body(...data: object[]) {
    return Reflect.metadata(bodyMetadataKey, mergeObjList(data));
}
