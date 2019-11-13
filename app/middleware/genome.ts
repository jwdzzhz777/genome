import { Context } from 'egg';

export default () => {
    return async (ctx: Context, next: () => Promise<any>) => {
        if (ctx.path === '/api') {
            let params = await ctx.helper.getApiParams(ctx, next);

            Object.keys(params).forEach(path => {
                let item = params[path];
                Object.keys(item).forEach(key => {
                    if (item[key] && key !== 'methods' && key !== 'description') {
                        if (typeof item[key] === 'object') {
                            Object.keys(item[key]).forEach(field => {
                                if (item[key][field] === Object(item[key][field])) {
                                    item[key][field] = JSON.stringify(item[key][field]);
                                    // item[key][field] = `( ${item[key][field].type || ''}  ${item[key][field].description || ''} )`;
                                }
                            });
                        }
                    }
                });
            });

            return ctx.render('api', { data: params });
        }
        await next();
    };
};
