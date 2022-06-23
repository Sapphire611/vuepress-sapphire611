---
title: Ceibs Backend Guide
date: 2022-2-26
categories:
  - Me
tags:
  - guide
sidebar: "auto"
publish: false
showSponsor: true
---

## 💬  Hi! (给可能会看这个项目的前端)  

> 我会尽可能清楚讲解后端相关内容的，至少可以把项目 跑 起 来～

::: right
来自 [Sapphire611](https://sapphire611.github.io)
:::

### 项目结构

<img style="border:2;" src="/img/ceibs-backend.png">

::: danger 简要概括，【这里面的内容比较重要】
- backend
  - config 存放配置项
  - dist 打包后的目录
  - mock4BigData 这个是用于模拟大数据的独立项目，也可以启动
  - src 核心资源文件
    - infra ( = infrastructure) 存放基本插件，封装好的库等
    - misc 一些插件，不太重要
    - model 【用户模型】 model ,定义集合字段（类似SQL中的表）
    - server 存放服务相关内容
      - middleware 存放中间件
      - public 公共目录（我没用到过，哈哈
      - router 【路由】
      - schema 【数据校验】
      - views 静态页面
    - service 具体方法的实现
    - App.js
    - index.js
  - package.json 
  - ...
:::

### 如何运行项目？

[0. 先行安装 node.js LTS](https://nodejs.org/en/)
- [使用 n 快速切换并管理 node版本](https://sapphire611.github.io/node/#n-%E6%AF%94-nvm-%E5%A5%BD%E7%94%A8)
- git 你肯定有

[1. 先看这里，安装Docker后并在Terminal 运行【常用后台服务挂载命令】，5个全要 (mongodb注意灵活变通)](https://sapphire611.github.io/docker/#%E5%B8%B8%E7%94%A8%E5%90%8E%E5%8F%B0%E6%9C%8D%E5%8A%A1%E6%8C%82%E8%BD%BD%E5%91%BD%E4%BB%A4)

2. 进项目目录,安装必要库并运行

```shell
cd backend # 运行master分支的内容就行了～
yarn  // npm install 
yarn start  // npm run start
```

#### 你可能会遇到的问题:
[Node-gyp 编译失败? （Windows下额外需要 Cmake、Python3、Visual Studio（指定版本））](https://sapphire611.github.io/node/#node-gyp-%E5%AE%89%E8%A3%85-windows-only)

- mongodb / Redis 连接失败？

```shell
## config/default.yaml
port: 19008

# db: mongodb://10.253.8.200:27017/s365-health
# redis: redis://10.253.8.200:6379/3

db: mongodb://127.0.0.1:27017/s365-health # 这些连接的ip地址要换成你本地的，其他同理
redis: redis://127.0.0.1:6379/3
```
> 前端大概率会在第二步崩溃（指想砸键盘），如果有任何问题，请私聊我，我看到后会第一时间回复😄

#### 成功图示

<img style="border:2;" src="/img/backend_Success.jpeg">

3. 运行成功后，介绍对应接口的代码思路

> 以 查看所有用户列表 为例  >> router/v2/contacts
> 
```js
/**
 * 获取用户信息列表  GET /api/v2/contacts/list
 */
const router = new Router({ prefix: "/api/v2/contacts" });

// ...

router.get("/list", validate(contactSchema.list), async (ctx) => {
  const { query } = ctx.validateResult;

  const { pageable } = ctx.state;

  const realQuery = {
    ...query,
  };

  ctx.body = await contactService.list(pageable, realQuery);
  ctx.status = 201;
});
```

::: tip
1. 上面这个接口的路由是 /api/v2/contacts/list
2. validate(contactSchema.list) 这个中间件负责数据校验，限制前端的传参
   - 按住Ctrl，鼠标放在【list】 上可以点进去看
```js
// schema/contact.js
exports.list = {
  query: {
    department: Joi.string().trim(),
    cname: Joi.string().trim(),
    ...getList,
  },
};
``` 

```js
// ..getList 在/schema/globalTemplates
exports.getListNoSort = {
    page: Joi.number().integer().min(0),
    size: Joi.number().integer().min(1),
  };

exports.sort = {
    // column: Joi.string().default('updatedAt'),
    sort: Joi.string(),
  };

exports.getList = {
  ...exports.getListNoSort,
  ...exports.sort,
};
```

3. 概括来说，这个接口只允许以下参数通过：
     - department 字符串
     - cname 字符串
     - page 数字
     - size 数字
     - sort 字符串
4. 主要使用库是Joi,语法看上去不难的 [Joi - npm](https://www.npmjs.com/package/joi/v/14.0.4)
5. 通过数据校验后，解构出相关属性，调用Service层的方法实现
   - 这个接口的Service 在 service/contactService.js 中
   - 分页使用到了 [mongoose-paginate-v2](https://www.npmjs.com/package/mongoose-paginate-v2)

6. 运行接口？apifox右上角先设置环境 http://127.0.0.1:19008
:::

> Done，我尽力啦 ^_^


