# egg-genome

plugin for Egg.js. use to generate api doc

> NOTE: <br>
> 没有集成 `swagger` <br>
> 此插件的实现可能会对系统造成影响勿生产使用 <br>
> 请在 `typescript` 项目使用 <br>
> 使用了 `symbol.description` ,请在 node 11.0.0 以上的环境使用。

[![NPM version][npm-image]][npm-url]
[![996.icu][icu-image]][icu-url]

[npm-image]: https://img.shields.io/npm/v/@jwdzzhz777/egg-genome?style=flat-square
[npm-url]: https://www.npmjs.com/package/@jwdzzhz777/egg-genome
[icu-image]: https://img.shields.io/badge/link-996.icu-red.svg
[icu-url]: https://996.icu

## Install

```bash
$ npm install @jwdzzhz777/egg-genome
```

别忘了配置

```js
// in plugin.js
export {
    genome: {
        enable: true,
        package: '@jwdzzhz777/egg-genome'
    }
}
```

## 如何使用

### `@Api` （必须）

要想使用功能 `contorller` 类必须被 `Api` 装饰器装饰

```ts
@Api
class YourController extends Controller {
    // your code
}
```

### `@path` （必须）

要想路由信息被插件收集，`contorller methods` 必须被 `@path` 装饰器装饰，且传入 `router` 传入时相同的 `path`

```ts
// in your controller
@Api
class YourController extends Controller {
    @path('/api/your/path')
    public async yourControllerMethod() {
        // your code
    }
}

// in router.ts
router.get('/api/your/path', controller.your.yourControllerMethod);
```

> 警告：别指错了，你肯定不希望我不小心调用了你的方法

### `@desc`

路由的描述，允许你传入字符串

```ts
@Api
class YourController extends Controller {
    @path('/api/your/path')
    @desc('这是一段描述')
    public async yourControllerMethod() {
        // your code
    }
}
```

### `@param`、`@body`、`@response`

都是些语义化的东西，用法一样，可以接受任意对象

```ts
@Api
class YourController extends Controller {
    @path('/api/your/path')
    @param({
        id: 1,
        token: 12345
    })
    public async yourControllerMethod() {
        // your code
    }
}
```

同时也接受任意数量的对象

```ts
@Api
class YourController extends Controller {
    @path('/api/your/path')
    @param({
        id: 1,
        other: 'haha'
    }, {
        token: 12345
    })
    public async yourControllerMethod() {
        // your code
    }
}
```

实际上会按照顺序合并 `Object.assign`

### 内置模版

插件内置了一个简单的模版，依赖 `egg-view-nunjucks` 插件

```bash
$ npm install egg-view-nunjucks
```

需要你手动配置

```js
// in plugin
export {
    nunjucks: {
        enable: true,
        package: 'egg-view-nunjucks'
    }
}
```

#### example

内置模版的例子

```js
// in controller/test.ts
import { Api, path, query, desc, response } from '@jwdzzhz777/egg-genome';

@Api
class TestController extends Controller {
    @path('/api/test')
    @query({
        name: 'string',
        id: 'number'
    })
    @desc('juse for test')
    @response({
        age: 'number'
    })
    public async test() {}
}

// in router.ts
router.get('/api/test', controller.test.test);
```

运行并访问 `/api` 即可。

#### 自定义访问的路由

不想用 `/api` 访问你也可以自己改

```ts
// in config.xxx.ts
export default () => {
    return {
        genome: {
            path: '/your/path'
        }
    };
};
```

访问 `/your/path`

### 自定义

你也可以不用内置模版，自己搞个页面，你可以通过 `getApiParams` 的 helper 方法来获得所有数据

```ts
public test(ctx) {
    let a = await this.ctx.helper.getApiParams(ctx);
    console.log(a);
}

// 结果：
[
 {
    methods: [ 'HEAD', 'GET' ],
    path: '/api/test',
    response: { age: 'number' },
    query: { name: 'string', id: 'number' },
    description: 'juse for test'
  }
]
```

这样你就可以移除 `egg-view-nunjucks` 自由发挥

> note: 别忘了配置 `config.genome.path = ''`

### 获取方法的元数据

你也可以在 `Controller` 中获取某个方法的数据

```ts
public test(ctx) {
    let data = this.getMetadata('test');
    console.log(daat);
}

// 结果：
{
  response: { age: 'number' },
  query: { name: 'string', id: 'number' },
  description: 'juse for test'
}
```
