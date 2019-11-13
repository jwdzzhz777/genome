import { Context } from 'egg';
import { ApiData } from '../lib/types';
import { apiPaths, apiDoc } from '../lib/decorators';

/**
 * 获得注册过的路由方法的元数据
 * @param  ctx  egg ctx 对象
 * @param  next egg next 方法
 * @return      ApiData
 */
export async function getApiParams(ctx: Context, next: any): Promise<ApiData> {
    let { stack } = ctx.app.router;
    let result: any = [];
    /** egg 所有的路由数据都在这里了 */
    for (let layer of stack) {
        if (!apiPaths.has(layer.path)) continue;
        /** 最后一个中间件就是对应的 Controller method 了 */
        let wrappedController = layer.stack[layer.stack.length - 1];
        if (!wrappedController) continue;

        let data = await wrappedController(Object.assign({ [apiDoc]: true }, ctx) as any, next);

        result.push({
            methods: Array.prototype.concat([], layer.methods),
            path: layer.path,
            ...data
        });
    }
    return result;
}
