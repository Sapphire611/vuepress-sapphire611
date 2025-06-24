---
title: Node 题目整理
date: 2025-6-17
categories:
  - Backend
tags:
  - node
  - interview
sidebar: "auto"
publish: true
showSponsor: true
---

## 👋  Node.js 题目整理

:::right
来自 [Sapphire611](http://sapphire611.github.io)
:::

## 1. Koa 和 Express 有哪些不同？

> express框架是一个基于 Node.js 平台的极简、灵活的 web 应用开发框架，

> koa是 Express 原班人马基于 ES6 新特性重新开发的框架,框架自身不包含任何中间件，很多功能需要借助第三方中间件解决

- 由于其基于 ES6 generator 特性的异步流程控制，解决了 "callback hell" 和麻烦的错误处理问题。


1. express内置了许多中间件 & 模块可供使用，而koa没有。

<span style="color:red">2. express的中间件模型为线型，而koa的中间件模型为U型，也可称为洋葱模型构造中间件。</span>

> Express
优点：线性逻辑，可用模块丰富，社区活跃
缺点：callback.hell

> Koa
优点：🧅，解决了callback hell，轻量
缺点：社区相对较小。

---

## 3. 浏览器和 Node 中 事件循环有什么区别？

> 浏览器和 Node.js 都实现了事件循环（Event Loop）来处理异步任务，但它们的实现机制和应用场景有所不同。以下是它们的主要区别：

| **特性**           | **浏览器事件循环**                                                                       | **Node.js 事件循环**                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **运行环境**       | 基于 Web APIs（如 `setTimeout`、DOM 事件），由浏览器引擎（如 V8 + Blink）实现。          | 基于 libuv 库，提供非阻塞 I/O（如文件、网络操作），不涉及 DOM。                      |
| **事件循环阶段**   | 分为宏任务（Macro Task）和微任务（Micro Task），每次循环处理一个宏任务后清空微任务队列。 | 分为 6 个阶段（Timers、Pending、Poll、Check、Close 等），按顺序执行每个阶段的任务。  |
| **微任务执行时机** | 在每个宏任务执行后立即执行（如 `Promise.then`）。                                        | 在事件循环阶段切换之间执行（Node.js v11+ 后行为与浏览器一致）。                      |
| **特有 API**       | `requestAnimationFrame`、`MutationObserver`。                                            | `setImmediate`（Check 阶段）、`process.nextTick`（当前操作后立即执行，优先级最高）。 |
| **I/O 处理**       | 用户交互（点击、网络请求等），依赖 Web APIs。                                            | 系统级 I/O（文件、网络等），依赖 libuv 的线程池和事件驱动。                          |
|                    | setTimeout(() => console.log('timeout'), 0);                                             | setTimeout(() => console.log('timeout'), 0);                                         |
|                    | Promise.resolve().then(() => console.log('promise'));                                    | setImmediate(() => console.log('immediate'));                                        |
|                    | // 输出顺序：promise → timeout                                                           | // 输出顺序可能随机（取决于事件循环启动时间）
| **关键差异总结**   | 微任务优先级高，与 UI 渲染紧密关联。                                                     | 多阶段处理复杂 I/O，`nextTick` 和 `setImmediate` 是特有机制。                        |

### 3.1. 运行环境与职责
浏览器：处理 DOM 事件、UI 渲染、网络请求（如 fetch）、用户交互（如点击）等。

Node.js：处理文件 I/O、网络请求（如 http 模块）、子进程等系统级操作。

### 3.2. 事件循环的阶段（Phases）

#### 浏览器的事件循环

> 基于 HTML5 规范，分为宏任务（Macro Task）和微任务（Micro Task）：

宏任务：包括 script（整体代码）、setTimeout、setInterval、I/O、UI 渲染、postMessage 等。

微任务：包括 Promise.then、MutationObserver、queueMicrotask 等。

执行顺序：

执行一个宏任务 → 清空微任务队列 → 渲染（如有需要）→ 下一个宏任务。

#### Node.js 的事件循环

基于 libuv 库，分为 6 个阶段（按顺序执行）：

Timers：执行 setTimeout 和 setInterval 的回调。

Pending Callbacks：处理系统操作（如 TCP 错误）的回调。

Idle/Prepare：内部使用（可忽略）。

Poll：检索新的 I/O 事件，执行 I/O 回调（如文件读取、网络请求）。

Check：执行 setImmediate 的回调。

Close Callbacks：处理关闭事件的回调（如 socket.on('close')）。

微任务（Promise.then、process.nextTick）：

process.nextTick 在阶段切换前优先执行（优先级高于微任务）。



## 如何实现JWT鉴权机制？

### JWT是什么

JWT（JSON Web Token）分成了三部分，头部（Header）、载荷（Payload）、签名（Signature），并以.进行拼接。其中头部和载荷都是以JSON格式存放数据，只是进行了编码

 
1. header
每个JWT都会带有头部信息，这里主要声明使用的算法。声明算法的字段名为alg，同时还有一个typ的字段，默认JWT即可。以下示例中算法为HS256

``` js
{  "alg": "HS256",  "typ": "JWT" } 
```

- 因为JWT是字符串，所以我们还需要对以上内容进行Base64编码，编码后字符串如下：

```js
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9        
```

2. payload
   
载荷即消息体，这里会存放实际的内容，也就是Token的数据声明，例如用户的id和name，默认情况下也会携带令牌的签发时间iat，通过还可以设置过期时间，如下：

```js
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

- 同样进行Base64编码后，字符串如下：

```js
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ
```

3. Signature

签名是对头部和载荷内容进行签名，一般情况，设置一个secretKey，对前两个的结果进行HMACSHA25算法，公式如下：

> Signature = HMACSHA256(base64Url(header)+.+base64Url(payload),secretKey)

一旦前面两部分数据被篡改，只要服务器加密用的密钥没有泄露，得到的签名肯定和之前的签名不一致

### 如何实现JWT

```js
Token的使用分成了两部分：

生成token：登录成功的时候，颁发token
验证token：访问某些资源或者接口时，验证token
生成 token
借助第三方库jsonwebtoken，通过jsonwebtoken 的 sign 方法生成一个 token：

第一个参数指的是 Payload

第二个是秘钥，服务端特有

第三个参数是 option，可以定义 token 过期时间
```

```js
const moment = require('moment');
const jwt = require('jsonwebtoken');

jwt.sign(payload, secret, options, callback);
// option :{ expiresIn: moment().add(1, 'days').valueOf() }
```
- 在前端接收到token后，一般情况会通过localStorage进行缓存，然后将token放到HTTP请求头Authorization 中，关于Authorization的设置，前面要加上 Bearer ，注意后面带有空格

### 校验token

```js
const jwt = require('jsonwebtoken');
return jwt.decode(token);
```
### 优缺点

优点：

- json具有通用性，所以可以跨语言

- 组成简单，字节占用小，便于传输

- 服务端无需保存会话信息，很容易进行水平扩展

- 一处生成，多处使用，可以在分布式系统中，解决单点登录问题

- 可防护CSRF攻击

缺点：

- payload部分仅仅是进行简单编码，所以只能用于存储逻辑必需的非敏感信息

- 需要保护好加密密钥，一旦泄露后果不堪设想

- 为避免token被劫持，最好使用https协议

## 4. Node性能如何监控以及优化?

### 性能优化是什么？

> Node作为一门服务端语言，性能方面尤为重要，其衡量指标一般有如下：

- CPU
  
- 内存
  
- I/O
  
- 网络

> CPU 主要有两个量化指标：

- CPU负载：在某个时间段内，占用以及等待CPU的进程总数

- CPU使用率：CPU时间占用状况，等于 1 - 空闲CPU时间(idle time) / CPU总时间

:::right
———— Node应用一般不会消耗很多的CPU，如果CPU占用率高，则表明应用存在很多同步操作，导致异步任务回调被阻塞
:::


```js
'use strict';

// /app/lib/memory.js
const os = require('os');
// 获取当前Node内存堆栈情况
// rss：表示node进程占用的内存总量。
// heapTotal：表示堆内存的总量。
// heapUsed：实际堆内存的使用量。
// external ：外部程序的内存使用量，包含Node核心的C++程序的内存使用量
const { rss, heapUsed, heapTotal } = process.memoryUsage();
// 获取系统空闲内存
const sysFree = os.freemem();
// 获取系统总内存
const sysTotal = os.totalmem();

const res = {
  sys: 1 - sysFree / sysTotal, // 系统内存占用率
  heap: heapUsed / heapTotal, // Node堆内存占用率
  node: rss / sysTotal, // Node占用系统内存的比例
};

console.log(res);

// {
//   sys: 0.9960613250732422,
//   heap: 0.825187360036645,
//   node: 0.0016584396362304688
// }
```

:::right
———— 在Node中，一个进程的最大内存容量为1.5GB。因此我们需要减少内存泄露
:::

---

> 硬盘的 IO 开销是非常昂贵的，硬盘 IO 花费的 CPU 时钟周期是内存的 164000 倍

> 内存 IO 比磁盘 IO 快非常多，所以使用内存缓存数据是有效的优化方法。常用的工具如 **redis**、**memcached** 等

### 如何监控？

```js
const easyMonitor = require('easy-monitor');
easyMonitor('你的项目名称');
```

### 优化代码

> 正确使用Stream

```js
const http = require('http');
const fs = require('fs');

// bad
http.createServer(function (req, res) {
    fs.readFile(__dirname + '/data.txt', function (err, data) {
        res.end(data);
    });
});

// good
http.createServer(function (req, res) {
    const stream = fs.createReadStream(__dirname + '/data.txt');
    stream.pipe(res);
});
```

### 内存管理优化

> 在 V8 中，主要将内存分为新生代和老生代两代：

- 新生代：对象的存活时间较短。新生对象或只经过一次垃圾回收的对象

- 老生代：对象存活时间较长。经历过一次或多次垃圾回收的对象

- 若新生代内存空间不够，直接分配到老生代

- 通过减少内存占用，可以提高服务器的性能。如果有内存泄露，也会导致大量的对象存储到老生代中，服务器性能会大大降低

如下面情况：

```js
const buffer = fs.readFileSync(__dirname + '/source/index.htm');

app.use(
    mount('/', async (ctx) => {
        ctx.status = 200;
        ctx.type = 'html';
        ctx.body = buffer;
        leak.push(fs.readFileSync(__dirname + '/source/index.htm'));
    })
);

const leak = [];
// leak的内存非常大，造成内存泄露，应当避免这样的操作，通过减少内存使用，是提高服务性能的手段之一
// 而节省内存最好的方式是使用池，其将频用、可复用对象存储起来，减少创建和销毁操作
```
## 5. 如何封装Node.js中间件？

> 在NodeJS中，中间件主要是指封装http请求细节处理的方法

- 例如在express、koa等web框架中，中间件的本质为一个回调函数，参数包含请求对象、响应对象和执行下一个中间件的函数

- 在这些中间件函数中，我们可以执行业务逻辑代码，修改请求和响应对象、返回响应数据等操作

```js
exports.validate = (schema) => {
	if (!schema) {
		return function (ctx, next) {
			return next();
		};

    // ...
	
		return next();
	};
};
```

## 6. NodeJs 中 require('...') 函数的顺序

- 缓存的模块 > 内置模块(fs/path) > 相对/绝对路径(有文件后缀 > 无文件后缀) > 相对/绝对路径(无文件后缀) > 目录/第三方模块

- 如果是目录，则根据 package.json的main属性值决定目录下入口文件，默认情况为 index.js

- 如果文件为第三方模块，则会引入 node_modules 文件，如果不在当前仓库文件中，则自动从上级递归查找，直到根目录


## 7. Node.js 事件循环机制

> 事件循环是基于libuv实现，libuv是一个多平台的专注于异步IO的库，具体流程如下：

```
     ┌────────────────┐
┌───►│     timers     │ // setTimeout、setInterval
│    └────────┬───────┘
│             │
│    ┌────────┴───────┐
│    │  I/O callback  │ // 上一轮循环未被执行的一些 I/O 回调
│    └────────┬───────┘
│             │
│    ┌────────┴───────┐
│    │  idle,prepare  │ // 闲置阶段
│    └────────┬───────┘              ┌────────────────┐
│             │                      │                │ // 检索、执行I/O  
│    ┌────────┴───────┐              │    incoming    │ // 除了 setImmediate()
│    │      poll      │◄─────────────┤                │ // 适当阻塞
│    └────────┬───────┘              │   connections  │
│             │                      │                │
│    ┌────────┴───────┐              └────────────────┘
│    │     check      │// setImmediate()
│    └────────┬───────┘
│             │
│    ┌────────┴───────┐
└────┤ close callback │ // socket.on('close', ...)
     └────────────────┘
```

- 每个阶段对应一个队列，当事件循环进入某个阶段时, 将会在该阶段内执行回调，直到队列耗尽或者回调的最大数量已执行, 那么将进入下一个处理阶段

- 除了上述6个阶段，还存在**process.nextTick**，其不属于事件循环的任何一个阶段，它属于该阶段与下阶段之间的过渡, 即本阶段执行结束, 进入下一个阶段前, 所要执行的回调，类似插队。

---

### 题目
```js
'use strict';

async function async1() {
  console.log('async1 start'); // 2
  await async2();
  console.log('async1 end'); // 9
}

async function async2() {
  console.log('async2'); // 3
}

console.log('script start'); // 1

setTimeout(function () {
  console.log('setTimeout0'); // 11
}, 0);

setTimeout(function () {
  console.log('setTimeout2'); // 13
}, 300);

setImmediate(() => console.log('setImmediate')); // 12

process.nextTick(() => console.log('nextTick1')); // 7

async1();

process.nextTick(() => console.log('nextTick2')); // 8

new Promise(function (resolve) {
  console.log('promise1'); // 4
  resolve();
  console.log('promise2'); // 5
}).then(function () {
  console.log('promise3'); // 10
});

console.log('script end'); // 6
```
---

```js
分析过程：

先找到同步任务，输出script start

遇到第一个 setTimeout，将里面的回调函数放到 timer 队列中

遇到第二个 setTimeout，300ms后将里面的回调函数放到 timer 队列中

遇到第一个setImmediate，将里面的回调函数放到 check 队列中

遇到第一个 nextTick，将其里面的回调函数放到本轮同步任务执行完毕后执行

执行 async1函数，输出 async1 start

执行 async2 函数，输出 async2，async2 后面的输出 async1 end进入微任务，等待下一轮的事件循环

遇到第二个，将其里面的回调函数放到本轮同步任务执行完毕后执行

遇到 new Promise，执行里面的立即执行函数，输出 promise1、promise2

then里面的回调函数进入微任务队列

遇到同步任务，输出 script end

执行下一轮回到函数，先依次输出 nextTick 的函数，分别是 nextTick1、nextTick2

然后执行微任务队列，依次输出 async1 end、promise3

执行timer 队列，依次输出 setTimeout0

接着执行 check 队列，依次输出 setImmediate

300ms后，timer 队列存在任务，执行输出 setTimeout2
```

---

## 8. Node中的EventEmmiter是什么？

> Node 的events模块提供了一个 EventEmitter，这个类实现了Node异步事件驱动架构的基本模式——观察者模式

> 在这种模式中，被观察者(主体)维护着一组其他对象派来(注册)的观察者，有新的对象对主体感兴趣就注册观察者，不感兴趣就取消订阅，主体有更新的话就依次通知观察者们

```js
const EventEmitter = require('events')

class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

function callback() {
    console.log('触发了event事件！')
}
myEmitter.on('event', callback) // 注册event事件
myEmitter.emit('event') // 通过emit触发
myEmitter.removeListener('event', callback); // 通过RemoveListener取消注册
```
``` js
// 常见方法:
emitter.addListener/on(eventName, listener) // 添加类型为 eventName 的监听事件到事件数组尾部
emitter.prependListener(eventName, listener) // 添加类型为 eventName 的监听事件到事件数组头部
emitter.emit(eventName[, ...args]) // 触发类型为 eventName 的监听事件
emitter.removeListener/off(eventName, listener) // 移除类型为 eventName 的监听事件
emitter.once(eventName, listener) // 添加类型为 eventName 的监听事件，以后只能执行一次并删除
emitter.removeAllListeners([eventName]) // 移除全部类型为 eventName 的监听事件
```

### 实现一个EventEmmiter

```js
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(type, handler) {
        if (!this.events[type]) {
            this.events[type] = [];
        }
        this.events[type].push(handler);
    }

    addListener(type,handler){
        this.on(type,handler)
    }

    prependListener(type, handler) {
        if (!this.events[type]) {
            this.events[type] = [];
        }
        this.events[type].unshift(handler);
    }

    removeListener(type, handler) {
        if (!this.events[type]) {
            return;
        }
        this.events[type] = this.events[type].filter(item => item !== handler);
    }

    off(type,handler){
        this.removeListener(type,handler)
    }

    emit(type, ...args) {
        this.events[type].forEach((item) => {
            Reflect.apply(item, this, args);
        });
    }

    once(type, handler) {
        this.on(type, this._onceWrap(type, handler, this));
    }

    _onceWrap(type, handler, target) {
        const state = { fired: false, handler, type , target};
        const wrapFn = this._onceWrapper.bind(state);
        state.wrapFn = wrapFn;
        return wrapFn;
    }

    _onceWrapper(...args) {
        if (!this.fired) {
            this.fired = true;
            Reflect.apply(this.handler, this.target, args);
            this.target.off(this.type, this.wrapFn);
        }
    }
}
```

## 9. 说说对Node中Stream的理解？

> 流（Stream），是一个数据传输手段，是端到端信息交换的一种方式，而且是有顺序的,是逐块读取数据、处理内容，以 Buffer 为单位

- 流可以分成三部分：source、dest、pipe

- 在source和dest之间有一个连接的管道pipe,它的基本语法是source.pipe(dest)，source和dest就是通过pipe连接，让数据从source流向了dest，如下图所示:

```
┌──────────────┐                ┌──────────────┐
│              │      pipe      │              │
│    source    ├───────────────►│     dest     │
│              │                │              │
└──────────────┘                └──────────────┘
```

### Stream 的种类 

> 在NodeJS，几乎所有的地方都使用到了流的概念，分成四个种类：

- 可读流： 可读取数据的流。例如fs.createReadStream() 可以从文件读取内容

- 可写流：可写入数据的流。例如 fs.createWriteStream() 可以使用流将数据写入文件

- 双工流： 既可读又可写的流。例如 net.Socket

- 转换流： 可以在数据写入和读取时修改或转换数据的流。
  - 例如，在文件压缩操作中，可以向文件写入压缩数据，并从文件中读取解压数据


```
在NodeJS中HTTP服务器模块中，request 是可读流，response 是可写流。
还有fs模块，能同时处理可读和可写文件流

可读流和可写流都是单向的，比较容易理解，而另外两个是双向的
```
### 双工流 demo

> 比如 websocket 通信，是一个全双工通信，发送方和接受方都是各自独立的方法，发送和接收都没有任何关系

```js
const { Duplex } = require('stream');

const myDuplex = new Duplex({
  read(size) {
    // ...
  },
  write(chunk, encoding, callback) {
    // ...
  }
});

```
---
### 转换流 demo

```js
const { Transform } = require('stream');

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // ...
  }
});
```

### 主要应用场景

stream的应用场景主要就是处理IO操作，而http请求和文件操作都属于IO操作

思想一下，如果一次IO操作过大，硬件的开销就过大，而将此次大的IO操作进行分段操作，让数据像水管一样流动，知道流动完成

常见的场景有：

```js
// 文件操作
// 创建一个可读数据流readStream，一个可写数据流writeStream，通过pipe管道把数据流转过去

const fs = require('fs')
const path = require('path')

// 两个文件名
const fileName1 = path.resolve(__dirname, 'data.txt')
const fileName2 = path.resolve(__dirname, 'data-bak.txt')
// 读取文件的 stream 对象
const readStream = fs.createReadStream(fileName1)
// 写入文件的 stream 对象
const writeStream = fs.createWriteStream(fileName2)
// 通过 pipe执行拷贝，数据流转
readStream.pipe(writeStream)
// 数据读取完成监听，即拷贝完成
readStream.on('end', function () {
    console.log('拷贝完成')
})
```

```js
// 读取minioClient的图片(ReadableStream)，然后转换成base64
const readable = await S3FileAdapter.minioClient.getObject(config.bucketName,each);

const chunks = [];
readable.on('readable', () => {
  let chunk;
  // console.log('Stream is readable (new data received in buffer)');
  // Use a loop to make sure we read all currently available data
  while (null !== (chunk = readable.read())) {
    // console.log(`Read ${chunk.length} bytes of data...`);
    chunks.push(chunk);
  }
});

readable.on('end', async () => {
  const content = chunks; // [Uint8Array(13343), Uint8Array(27960), Uint8Array(65536), Uint8Array(2114),...]

  let res = []; // 将结果重组成array形式
  for (let i = 0; i < content.length; i++) {
    res = [...res, ...content[i]];
  }

  const base64 = Buffer.from(res, 'utf-8').toString('base64');
  const thumbnail = 'data:image/jpeg;base64,' + base64; // ok...
  console.log(`Read data end Length : ${res.length}...`);
});

```

## 10. Node Stream 是什么？有哪些种类的 Stream？

> 在 Node.js 中，Stream 是一种用于**处理流数据的抽象接口**。它提供了一种处理大量数据的方式，以及对数据进行流式传输和处理的能力。Stream 可以通过**读取、写入、转换、过滤**等方式来处理数据，而不需要一次性加载全部数据到内存中。这使得处理大文件或大量数据变得更加高效和可行。Node.js 中的 Stream 有四种类型：

| 类型                   | 描述                                                                    | 典型示例                                   | 重要事件                        | 重要方法                      |
| ---------------------- | ----------------------------------------------------------------------- | ------------------------------------------ | ------------------------------- | ----------------------------- |
| **Readable** (可读流)  | 数据来源，可以被读取                                                    | 文件读取流、HTTP 请求、process.stdin       | `data`, `end`, `error`, `close` | `pipe()`, `read()`, `pause()` |
| **Writable** (可写流)  | 数据目标，可以被写入                                                    | 文件写入流、HTTP 响应、process.stdout      | `drain`, `finish`, `error`      | `write()`, `end()`, `cork()`  |
| **Duplex** (双工流)    | 同时实现 Readable 和 Writable 接口，读写通道独立                        | TCP sockets、WebSockets、child_process IPC | 包含可读和可写流的所有事件      | 包含可读和可写流的所有方法    |
| **Transform** (转换流) | 特殊的 Duplex 流，写入和读取时自动转换数据（输出与输入有计算/转换关系） | zlib 压缩流、加密流、CSV 解析器            | `data`, `end`, `finish`         | `_transform()`, `_flush()`    |

## 11.宏任务 / 微任务

> 宏任务（Macro Task）和微任务（Micro Task）是与事件循环（Event Loop）相关的概念，用于管理 JavaScript 代码的执行顺序和异步操作。它们有助于理解 JavaScript 中的异步编程和事件处理

### 宏任务

**宏任务代表一组一起执行的操作**，通常是由开发者定义的异步操作或事件。

宏任务包括诸如`setTimeout`、`setInterval`、`I/O`操作等。

当宏任务被添加到执行队列时，它们会被排队等待执行，直到 JavaScript 引擎可以执行它们。一次只执行一个宏任务。

### 微任务

- 微任务也是异步操作，但它们的**优先级高于宏任务**。微任务包括`new Promise().then`、MutationObserver 的回调等。

- 当一个微任务被添加到执行队列时，它会立即被执行，而不需要等待当前的宏任务完成。
  因此，**微任务能够在宏任务之间执行**。

- 微任务通常用于执行与当前任务相关的清理、回调或更新操作。

::: warning
事件循环是一个不断运行的循环，它负责执行宏任务和微任务，以确保 JavaScript 代码能够按照正确的顺序执行。

👀 事件循环的基本流程如下：

1. 从宏任务队列中选择最早的一个任务执行。
2. 执行完当前宏任务后，检查微任务队列，并依次执行微任务，直到微任务队列为空。
3. 回到宏任务队列，选择下一个宏任务执行。

重复上述过程，不断循环执行宏任务和微任务，直到所有任务都完成。
:::

## 12. 什么是Nodejs？ 

> Node.js 是一个基于 Chrome V8 引擎 的 JavaScript 运行时，用于在服务器端高效运行 JavaScript 代码。它采用 事件驱动、非阻塞 I/O 模型，使其轻量且高效，特别适合构建高性能、可扩展的网络应用。