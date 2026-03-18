---
title: 面试真题记录
date: 2026-03-13
categories:
  - Backend
tags:
  - node
  - interview
  - personal
sidebar: 'auto'
publish: true
sticky: 2
---

## STICKY

[什么是 nodejs?(事件驱动、非阻塞 I/O)](/backend/node/node/#_0-什么是-nodejs)

[nodejs 事件循环机制(timers >> I/O callback >> idle,prepare >> poll >> check >> close callback)](/backend/node/node/#_7-node-js-事件循环机制)

[浏览器和 Node 中 事件循环区别浏览器和 Node 中 事件循环区别 (浏览器:每次循环处理一个宏任务后清空微任务队列](/backend/node/node/#_3-浏览器和-node-中-事件循环有什么区别)

[防抖和节流函数(return function(...args),fn.apply(this,args))](/frontend/vue/#防抖-debounce-和-节流-throttle-函数)

[手写装饰器(className, methodName, originalMethod,return function (...args) )](/frontend/interview/#手写装饰器)

## Soloent

[Electron GitLab CI (缓存 node_modules、自动化测试、交叉编译)](/frontend/electron/#ci-自动化测试)

[Electron 多平台处理(配置文件分离、特定的应用行为(mac)、菜单和快捷键、渲染进程识别平台等)](/frontend/electron/#多平台处理差异)

[Electron 如何实现遥测(监听用户的特定行为、收集错误信息、指标信息、用于改进产品)](/frontend/electron/#如何实现遥测)

[大模型如何拥有记忆(并没有，只是通过维护上下文，将系统提示词+会话摘要+最近 N 轮对话+当前用户对话 合并发送)](/misc/AI/#大模型如何拥有记忆-如何记住之前的信息)

[CLAUDE.md 是什么？实现原理是？(持久化记忆文件 用户级记忆+项目级记忆+模块化规则+自动记忆)](/misc/AI/#claude-md-是什么-实现原理)

## AltenChina(HP)

#### Electron

[IPC 的核心功能模块 (send+on、invoke+handle、sendSync)](/frontend/electron/#ipc-的核心功能模块)

[如何设置只开启单窗口（app.requestSingleInstanceLock() 请求单例锁，没拿到应用程序退出）](/frontend/electron/#如何设置只开启单窗口)

[多窗口之间如何通信(通过主进程转发、使用 BroadcastChannel API)](/frontend/electron/#多窗口之间如何通信)

[如何实现窗口透明背景(BrowserWindow transparent: true,frame: false, html-body-background: transparent;)](/frontend/electron/#如何实现窗口透明背景)

[发生内存泄漏如何排查(Chromium DevTools-Memory-记录两个 Snapshot-选择 HeapSnapshot-comparison)](/frontend/electron/#发生内存泄漏如何排查)

#### 其他

[Redux 核心概念（单一数据源、State 只读、通过 Reducer 进行修改）](/frontend/react/#redux-mobx-的核心概念)

[Typescript 什么是类型断言(就是 as 而已)](/frontend/typescript/#_4-什么是类型断言)

[JS 怎么实现深拷贝 （JSON.parse(JSON.stringify(obj)) / structuredClone(obj)）](#)

[观察者模式(Nodejs = EventEmitter，js = addEventListener(或者自己封装 EventEmitter，js))](/backend/node/node/#_8-node-中的-eventemitter-是什么)

[箭头函数和普通函数的区别（this 指向不同、不能作为构造函数、没有 arguments、call、apply、bind、prototype）](#)

[自己封装 Ajax](/frontend/interview/#ajax-是什么-如何手动封装一个-ajax)

[CSS flex 实现表格(flex-table 设置 max-width，table-row 设置 display:flex,table-cell 设置 flex: 1 均分宽度)](/frontend/html/#flex-实现表格布局)

```html
<div class="flex-table">
  <!-- 表头行 -->
  <div class="table-row table-header">
    <div class="table-cell">ID</div>
    <div class="table-cell">姓名</div>
    <div class="table-cell">年龄</div>
    <div class="table-cell">城市</div>
  </div>
</div>
```

## UXN

[22. 括号生成](/backend/node/leetcode-js/#_22-括号生成)

[2700. 两个对象之间的差异](/backend/node/leetcode-js/#_2700-两个对象之间的差异)

[SQL 题目](/backend/sql/#uxn-sql-题目)

## FUXUN

[MySQL 分布式事务是如何实现的？(mysql=XA+2PC,XA_START、END、PREPARE、COMMIT、ROLLBACK)](/backend/mysql/#_8-mysql-分布式事务是如何实现的)

[MongoDB 千万级数据如何导出，并在实际业务中操作？（后台 CRON 预聚合/实时需要优化聚合+索引）](/backend/mongodb/#_5-mongodb-千万级数据如何导出-并在实际业务中操作)

[Docker Compose 如何指定网络 IP？(networks: 容器: ipv4_address)](/deploy/docker/#docker-compose-如何指定网络-ip)

[Redis List 常用命令 (lrange k1 0 -1)](/backend/redis/#list-常用命令)

[Redis Hash 常用命令 (hkeys k1)](/backend/redis/#hash-常用命令)

[MongoDB ABC 联合索引，AB AC 是否生效？(最左前缀原则，AB 完全生效、AC 部分生效)](/backend/mongodb/#_6-mongodb-设置了-abc-联合索引-那-ab-ac-之类的生效吗)

[MySQL 与 MongoDB 地理索引对比（POINT, LINESTRING, POLYGON SPATIAL 索引 vs GeoJson 2d 索引,mongodb 原生支持 WGS84）](/backend/mysql/#_11-mysql-与-mongodb-地理索引对比)

[Node GC 新生代如何转变为老生代？(通过晋升、经历 GC 次数、To 区内存不足、大对象直接分配)](/backend/node/node/#_17-node-gc-新生代如何转变为老生代)

[js 原生数组头部插入删除 (unshift,shift)](#)

[js 参数传递是值传递还是引用传递 (基本类型传值、引用类型传递引用)](#)

- 基本类型: String Number Boolean Symbol null undefined
- 引用类型: Object Array Function

---

## HUAWANG

[计算属性 (computed) 和侦听器 (watch/watchEffect) 对比（前者有缓存值和返回，watch 能获取旧值，watchEffect 优先级高+自动收集）](/frontend/vue/#计算属性-computed-和侦听器-watch-watcheffect-对比)

[Vue2/3 的响应式原理 (Object.defineProperty vs Proxy)](/frontend/vue/#vue的响应式原理是如何实现的-请描述object-defineproperty和proxy的区别及其优缺点)

[toRef 什么时候使用 (reactive > ref 可以. value)](/frontend/vue/#toref-什么时候使用)

[type 和 interface 的区别 &/extends，interface 支持声明合并且只能定义 object](/frontend/typescript/#_2-type-和-interface-的区别)

[any、unknown、never 的区别（any=放弃检查，unknown=类型安全的 any，never=不可能）](/frontend/typescript/#_3-any、unknown、never-的区别)

[> CommonJS 是运行时引入,ESM 是编译时静态分析 + 运行时执行](#)

## CPIC

[css-矩形旋转(transform: rotate(45deg))](/frontend/interview/#css-矩形旋转)

[防抖和节流函数](/frontend/vue/#防抖-debounce-和-节流-throttle-函数)

[Promise.all Vs Promise.allSettled(all 只要有一个 Promise 拒绝就结束，只能返回第一个发生的错误，allSettled 一定会返回所有的结果)](/frontend/interview/#promise-all-vs-promise-allsettled)

[Vue 路由传参(this.$router.push/query/params)](/frontend/vue/#vue-路由传参)

## CTrip

[NestJS 数据初始化的时机(OnApplicationBootstrap)](/backend/node/node_frame/#nestjs-数据初始化的时机)

[Nestjs 全链路追踪方案(middleware 生成追踪 id，LoggerService 封装，interceptor 记录请求耗时 return next.handle().pipe(()=>{}))](/backend/node/node_frame/#nestjs-全链路追踪方案)

## DEEPSIGHT

[浏览器的事件循环](/backend/node/node/#_3-浏览器和-node-中-事件循环有什么区别)

[VUE2/3 响应式原理](/frontend/vue/#vue的响应式原理是如何实现的-请描述object-defineproperty和proxy的区别及其优缺点)

---

[70. 爬楼梯](/backend/node/leetcode-js/#_70-爬楼梯)

[867. 转置矩阵](/backend/node/leetcode-js/#_867-转置矩阵)

## YIKA

[redis 计划任务时间大于轮询时间时怎么处理(双重缓存/缓存续期)](/backend/redis/#计划任务时间大于轮询时间时怎么处理)

[prisma 和 typeorm 区别](/backend/node/node_frame/#orm-的选型)

[NestJS 解决循环依赖的问题(forwardRef)](/backend/node/node_frame/#nestjs-如何解决模块之间循环依赖的问题)

[Nest 守卫、拦截器、中间件 的区别](/backend/node/node_frame/#nest-守卫、拦截器、中间件-的区别)

[手写装饰器(className, methodName, originalMethod,return function (...args) )](/frontend/interview/#手写装饰器)

## SHANGHAI LONGYI

[express 和 koa 中间件的区别(线性 / 洋葱圈)](/backend/node/node/#_1-koa-和-express-有哪些不同)

[MySQL 和 MongoDB 的索引数据结构(B+ Tree vs B Tree)](/backend/sql/#mysql-和-mongodb-的索引数据结构)

[B 树(B-) 和 B+树(B 树所有节点都存储数据，B+树只有叶子节点存储数据，相互链接，查询更稳定，效率更高)](/backend/sql/#b-tree)

[Docker 常用的网络模式有哪些?(默认 bridge、host 直接用主机、none 无网络)](/deploy/docker/#docker-常用的网络模式有哪些)

[Nest 守卫、拦截器、中间件 的区别](/backend/node/node_frame/#nest-守卫、拦截器、中间件-的区别)

---

[665. 非递减数列](/backend/node/leetcode-js/#_665-非递减数列)

[简答题:微信登陆数据流向](/architecture/#微信扫码登录全流程-前后端数据流向)

## StoreHub

[什么是微服务？使用微服务的优势/缺点有哪些？](/architecture/#%E4%BB%80%E4%B9%88%E6%98%AF%E5%BE%AE%E6%9C%8D%E5%8A%A1-%E4%BD%BF%E7%94%A8%E5%BE%AE%E6%9C%8D%E5%8A%A1%E7%9A%84%E4%BC%98%E5%8A%BF-%E7%BC%BA%E7%82%B9%E6%9C%89%E5%93%AA%E4%BA%9B)

[Mysql & MongoDB & Redis 介绍，分别在哪些场景下发挥优势?](/backend/SQL/#mysql-mongodb-redis-介绍-分别在哪些场景下发挥优势)

[查找 4 月份的日志，基于 name 去重](/backend/SQL/#查找-4-月份的日志-基于-name-去重)

[mongodb 中索引有哪些类型？分别怎么使用？](/backend/mongodb/#mongodb-中索引有哪些类型-分别怎么使用)

[把 callback 改写成 Promise](/frontend/interview/#_16-把-callback-改写成-promise)

### 算法题：括号匹配 leetcode 20

[算法题：括号匹配 leetcode 20](/backend/node/leetcode-js/#_20-有效的括号)

[算法题：搜索旋转排序数组 leetcode 33](/backend/node/leetcode-js/#_33-搜索旋转排序数组)

## NGA

[什么是 控制反转 && 依赖注入?](/architecture/#什么是-控制反转-依赖注入)

[多实例情况下，怎么通过 redis 防止定时任务多次执行](/backend/sql/#多实例情况下-怎么通过-redis-防止定时任务多次执行)

---

## ShuRui

[Node Stream 是什么？有哪些种类的 Stream？](/backend/node/node/#_10-node-stream-是什么-有哪些种类的-stream)

---

## MiaoDian

[Mysql 查询学生三门科目总分最高的 前三名](/backend/sql/#mysql-查询学生三门科目总分最高的-前三名)

## XINYUE

[fs.readFile() 和 fs.createReadStream() 有什么区别？](/backend/node/node/#_2-fs-readfile-和-fs-createreadstream-有什么区别)

[如何使用 nodejs 读取一个本地文件](/backend/node/node/#_18-如何使用-nodejs-读取一个本地文件)

[如何做到创建 nodejs 集群并做到不中断重启](/backend/node/node/#_19-如何做到创建-nodejs-集群并做到不中断重启)

[mongo 扣减库存时如何保证原子一致性](/backend/mongodb/#_7-mongo-扣减库存时如何保证原子一致性)

[请写出符合下列要求的 mongodb 查询语句](/backend/mongodb/#_8-请写出符合下列要求的-mongodb-查询语句)

[如何使用 redis 实现简单的消息队列](/backend/redis/#如何使用-redis-实现简单的消息队列)

[用 redis 实现一个分数排行榜，并从中查找前十名的数据(zadd board 100 Player1, zrevrange board 0 9 WITHSCORES)](/backend/redis/#用-redis-实现一个分数排行榜-并从中查找前十名的数据)

[列举 js 中数组遍历相关的方法](/backend/node/es6/#列举-js-中数组遍历相关的方法)

[列举几个 es6 以后的新特性](/backend/node/es6/#列举几个-es6-以后的新特性)

[用 ts 实现多态，父类 animal，子类 cat 和 dog，包含 name 属性，实现 say 方法](/frontend/typescript/#_5-用-ts-实现多态-父类-animal-子类-cat-和-dog-包含-name-属性-实现-say-方法)

---

## CAROTA

[node 如何设置使用内存大小](/backend/node/node/#_20-node-如何设置使用内存大小)

[Node 主进程和子进程是否共享内存](/backend/node/node/#_21-node-主进程和子进程是否共享内存)

### 3. 如何预防 XSS 攻击？

> 👀 预防跨站脚本攻击（XSS）是构建安全 web 应用程序的重要一环。XSS 攻击的目标是向网页注入恶意脚本，以便攻击者可以窃取用户的信息或执行恶意操作。以下是一些防止 XSS 攻击的最佳实践：

1. 输入验证和过滤：

对于所有用户输入的数据，包括表单输入、URL 参数和 cookie，都要进行验证和过滤。只允许预期的、合法的字符和数据通过。

2. 转义输出
   在将用户输入显示在网页上之前，确保对其进行适当的转义。这可以通过编程语言的内置函数或模板引擎来完成，以确保任何用户输入都不会被解释为代码。使用安全的 HTML、CSS 和 JavaScript 输出编码方法，

```js
如 htmlspecialchars()、encodeURIComponent(),md5() 等。
```

3. 内容安全策略 (CSP)：
   配置 CSP 头，限制浏览器加载和执行的内容。CSP 可以阻止内联脚本和其他不受信任的内容，减少 XSS 攻击的风险。
   在 HTTP 头中包含 Content-Security-Policy 来启用 CSP。

```js
Content-Security-Policy: same-origin // 只允许加载同源的资源
Content-Security-Policy: default-src 'self' www.example.com // 只允许加载同源的资源和 www.example.com 域名下的资源
Content-Security-Policy: script-src 'none'
```

### 4. http 和 https 的区别？证书认证过程？pki？

|          | http | https |
| -------- | ---- | ----- |
| 传输协议 | 明文 | 加密  |
| 默认端口 | 80   | 443   |
| 证书     | 无   | 有    |

HTTPS 证书认证过程:

1. 服务器端证书生成:
   服务器管理员生成一个证书请求（CSR），其中包含服务器的公钥。
   证书请求被发送到受信任的证书颁发机构（CA）。

2. 证书颁发机构认证:
   CA 验证证书请求的合法性，并验证服务器所有者的身份。
   CA 签发包含服务器公钥的数字证书，并使用 CA 的私钥进行签名。

3. 服务器配置证书:
   服务器收到 CA 签发的证书后，将其配置到服务器上。

4. 客户端验证:
   当客户端连接到服务器时，服务器会返回证书。
   客户端的浏览器会验证证书的有效性，包括检查 CA 的签名和证书是否在有效期内。
   如果证书有效，客户端会生成一个随机的对称密钥，然后使用服务器的公钥加密它，并将其发送回服务器。
   建立安全通信:

::: tip
服务器使用其私钥解密客户端发送的随机密钥。
从此刻起，客户端和服务器之间的通信都使用这个共享的对称密钥进行加密和解密。
:::

#### 公钥基础设施（PKI）:

- PKI 是一种广泛用于加密和认证的体系结构。它包括证书颁发机构（CA）和数字证书，用于确保安全通信。PKI 的基本原理是使用非对称加密，其中每个实体（如服务器或用户）都有一对公钥和私钥。私钥是保密的，而公钥可以公开使用。CA 颁发数字证书，用于验证公钥的真实性和身份。

- 在 HTTPS 中，PKI 用于确保服务器的身份，并协助在客户端和服务器之间建立加密通信。通过 CA 颁发的数字证书，客户端可以验证服务器的身份，从而确保它正在与预期的安全服务器通信。

> 总之，HTTP 是一种不安全的协议，而 HTTPS 使用加密和数字证书来保护通信的安全性和真实性。 PKI 是 HTTPS 的基础，用于验证和加密通信。


## ZStack

[1. Node.js 事件循环机制](/backend/node/node/#_7-node-js-%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6)

[2. useMemo / useCallback / useEffect 三者区别](/frontend/react/#_1-react-中-usememo-usecallback-useeffect-三者区别)

#### 3. 什么是 $facet

> `$facet` 是 MongoDB 聚合管道（aggregation pipeline）中的一个阶段，它允许你在一个聚合管道中执行多个独立的子聚合，并将它们的结果整合到一个单一的文档中。

```json
{
  $facet: {
    "outputField1": [ <stage1>, <stage2>, ... ],
    "outputField2": [ <stage3>, <stage4>, ... ],
    // 更多输出字段和子聚合阶段
  }
}

```

```json
{
  "$facet": {
    "salesByAgent": [{ "$sort": { "totalSales": -1 } }, { "$limit": 5 }],
    "totalSales": [{ "$group": { "_id": null, "total": { "$sum": "$totalSales" } } }]
  }
}
```

## DAOYOUYUN

### 1. 什么是 node.js

- Node.js 是一个开源的 JavaScript 运行环境，它允许开发者在服务器端运行 JavaScript 代码。它是建立在`Chrome V8` JavaScript 引擎之上的，并且提供了一系列的库和工具，使开发者能够轻松地构建高性能的网络应用程序。

- 关键词 `事件驱动` `非阻塞I/O模型` `轻量` `高性能` `跨平台`

### [2. Node.js 事件循环机制](/backend/node/node/#_7-node-js-%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6)

### [3. 宏任务 / 微任务](/backend/node/node/#_11-宏任务-微任务)

### 4. 范型

> 泛型提供了一种抽象的方式，允许你在不知道具体数据类型的情况下编写通用的算法、数据结构或函数，以适用于不同的数据类型，同时保持类型安全

```ts
function identity<T>(value: T): T {
  return value;
}

let result = identity('Hello, TypeScript'); // result的类型为string
```

节流技术确保在一定时间内执行函数的频率受到限制，无论触发频率如何。例如，你可以设置一个函数每隔一定时间执行一次，而不管触发事件的频率。节流通常用于减少事件处理的频率，以防止过多的计算或请求。

示例（使用 Node.js 的 setInterval 函数实现节流）：

```js
function throttle(func, delay) {
  let canCall = true;
  return function (...args) {
    if (canCall) {
      func.apply(this, args);
      canCall = false;
      setTimeout(() => {
        canCall = true;
      }, delay);
    }
  };
}

const throttledFunction = throttle(() => {
  console.log('Throttled function called');
}, 1000);

// 调用throttledFunction，但只有在每隔1秒后才能再次执行
throttledFunction();
```

> 无论是防抖还是节流，都可以在 Node.js 中使用，以限制函数调用的频率，从而更好地控制资源的使用或事件的触发。这些技术在前端开发中经常用于优化性能和提高用户体验，也可以在后端应用程序中处理类似的情况。

### 6. 如何 做 http 缓存

> HTTP 缓存是一种用于提高网站性能和减少服务器负载的技术。通过将资源（如网页、图像、样式表和脚本）缓存在客户端浏览器或中间代理服务器上，可以减少重复的请求，从而加快页面加载速度。以下是实施 HTTP 缓存的一般步骤：

1. 设置 HTTP 头部：
   在 HTTP 响应头部中设置缓存相关的 HTTP 头部是实施 HTTP 缓存的第一步。以下是常用的 HTTP 头部：

```bash
Cache-Control：这个头部用于指定缓存策略。常见的指令包括：
  max-age=<seconds>：定义资源在客户端缓存中的最大存活时间（秒）。
  s-maxage=<seconds>：与max-age类似，但仅适用于共享缓存（例如代理服务器）。
  public：指示响应可以被任何缓存存储。
  private：指示响应只能被单个用户的私有缓存存储。
  no-store：禁止缓存，每次请求都必须从服务器获取最新资源。
  no-cache：缓存资源需要经过重新验证，即需要与服务器确认资源是否过期。
Expires：定义资源的过期日期，是一个HTTP日期时间格式。
ETag：给每个资源分配一个唯一的标识符，服务器可以使用它来验证资源是否发生了变化。
Last-Modified：资源的最后修改日期，也用于验证资源是否发生了变化。
```

### 7. TCP / UDP

|        | TCP                        | UDP            |
| ------ | -------------------------- | -------------- |
| 安全性 | 可靠性                     | 不可靠         |
| 连接   | 有，双向，流控制和拥塞控制 | 无连接，低开销 |
| 适用于 | 可靠性要求高               | 实时应用       |

### 8. 算法题目

1. 求 x 的 n 次方, 不能用 Math.pow(x,n)

```js
const pow = (x, n) => {
  if (n === 0) return 1;

  return x * pow(x, n - 1);
};
```

2. 手写 arr.flat() ,

```js
const arr = [
  [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ],
  [
    [11, 12, 13],
    [14, 15, 16],
    [17, 18, 19],
  ],
  [
    [21, 22, 23],
    [24, 25, 26],
    [27, 28, 29],
  ],
];

const myflat = (arr) => {
  let result = [];
  for (const each of arr) {
    if (Array.isArray(each)) result = result.concat(myflat(each));
    else result.push(each);
  }
  return result;
};

const flattenedArr = myflat(arr);
console.log(flattenedArr);
```
