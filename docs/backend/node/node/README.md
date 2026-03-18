---
title: Node 题目整理
date: 2026-03-13
categories:
  - Backend
tags:
  - node
  - interview
sidebar: 'auto'
publish: true
---

## 👋 Node.js 题目整理

:::right
来自 [Sapphire611](http://sapphire611.github.io)
:::

## 什么是 Nodejs？

> Node.js 是一个基于 Chrome V8 引擎 的 JavaScript 运行时，用于在服务器端高效运行 JavaScript 代码。它采用 事件驱动、非阻塞 I/O 模型，使其轻量且高效，特别适合构建高性能、可扩展的网络应用。

## 1. Koa 和 Express 有哪些不同？

## 2. fs.readFile() 和 fs.createReadStream() 有什么区别？

| 区别     | fs.readFile()          | fs.createReadStream()                    |
| -------- | ---------------------- | ---------------------------------------- |
| 读取到   | 全部读取到内存         | 分成一系列小块（缓冲区），逐块读取和处理 |
| 适用于   | 较小的文件或数据       | 大型文件或数据集                         |
| callback | 作为回调函数的参数返回 | 通过监听完成读取操作                     |

> express 框架是一个基于 Node.js 平台的极简、灵活的 web 应用开发框架，

> koa 是 Express 原班人马基于 ES6 新特性重新开发的框架,框架自身不包含任何中间件，很多功能需要借助第三方中间件解决

- 由于其基于 ES6 generator 特性的异步流程控制，解决了 "callback hell" 和麻烦的错误处理问题。

1. express 内置了许多中间件 & 模块可供使用，而 koa 没有。

<span style="color:red">2. express 的中间件模型为线型，而 koa 的中间件模型为 U 型，也可称为洋葱模型构造中间件。</span>

> Express
> 优点：线性逻辑，可用模块丰富，社区活跃
> 缺点：callback.hell

> Koa
> 优点：🧅，解决了 callback hell，轻量
> 缺点：社区相对较小。

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
|                    | // 输出顺序：promise → timeout                                                           | // 输出顺序可能随机（取决于事件循环启动时间）                                        |
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

## 4. Node 性能如何监控以及优化?

### 性能优化是什么？

> Node 作为一门服务端语言，性能方面尤为重要，其衡量指标一般有如下：

- CPU
- 内存
- I/O
- 网络

> CPU 主要有两个量化指标：

- CPU 负载：在某个时间段内，占用以及等待 CPU 的进程总数

- CPU 使用率：CPU 时间占用状况，等于 1 - 空闲 CPU 时间(idle time) / CPU 总时间

:::right
———— Node 应用一般不会消耗很多的 CPU，如果 CPU 占用率高，则表明应用存在很多同步操作，导致异步任务回调被阻塞
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
———— 在 Node 中，一个进程的最大内存容量为 1.5GB。因此我们需要减少内存泄露
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

> 正确使用 Stream

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

## 5. 如何封装 Node.js 中间件？

> 在 NodeJS 中，中间件主要是指封装 http 请求细节处理的方法

- 例如在 express、koa 等 web 框架中，中间件的本质为一个回调函数，参数包含请求对象、响应对象和执行下一个中间件的函数

- 在这些中间件函数中，我们可以执行业务逻辑代码，修改请求和响应对象、返回响应数据等操作

```js
exports.validate = (schema) => {
  if (!schema) {
    return function (ctx, next) {
      return next();
    };

    // ...

    return next();
  }
};
```

## 6. NodeJs 中 require('...') 函数的顺序

- 缓存的模块 > 内置模块(fs/path) > 相对/绝对路径(有文件后缀 > 无文件后缀) > 相对/绝对路径(无文件后缀) > 目录/第三方模块

- 如果是目录，则根据 package.json 的 main 属性值决定目录下入口文件，默认情况为 index.js

- 如果文件为第三方模块，则会引入 node_modules 文件，如果不在当前仓库文件中，则自动从上级递归查找，直到根目录

## 7. Node.js 事件循环机制

> 事件循环是基于 libuv 实现，libuv 是一个多平台的专注于异步 IO 的库，具体流程如下：

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

- 除了上述 6 个阶段，还存在**process.nextTick**，其不属于事件循环的任何一个阶段，它属于该阶段与下阶段之间的过渡, 即本阶段执行结束, 进入下一个阶段前, 所要执行的回调，类似插队。

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

## 8. Node 中的 EventEmitter 是什么？

> Node 的 events 模块提供了一个 EventEmitter，这个类实现了 Node 异步事件驱动架构的基本模式——观察者模式

> 在这种模式中，被观察者(主体)维护着一组其他对象派来(注册)的观察者，有新的对象对主体感兴趣就注册观察者，不感兴趣就取消订阅，主体有更新的话就依次通知观察者们

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// 1. on / addListener - 添加监听器到数组尾部
myEmitter.on('event', () => console.log('尾部添加'));
myEmitter.addListener('event', () => console.log('同样尾部添加'));

// 2. prependListener - 添加监听器到数组头部
myEmitter.prependListener('event', () => console.log('头部添加'));

// 3. once - 只执行一次的监听器
myEmitter.once('event', () => console.log('只执行一次'));

// 4. emit - 触发事件
myEmitter.emit('event');
// 输出顺序:
// "头部添加"
// "尾部添加"
// "同样尾部添加"
// "只执行一次"

myEmitter.emit('event');
// "只执行一次" 不会再输出

// 5. removeListener / off - 移除指定监听器
function callback() {
  console.log('要移除的监听器');
}
myEmitter.on('event', callback);
myEmitter.removeListener('event', callback); // 或 myEmitter.off('event', callback)

// 6. removeAllListeners - 移除所有监听器
myEmitter.removeAllListeners('event'); // 移除event事件的所有监听器
myEmitter.removeAllListeners(); // 移除所有事件的所有监听器
```

### 实现一个 EventEmitter

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

  addListener(type, handler) {
    this.on(type, handler);
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
    this.events[type] = this.events[type].filter((item) => item !== handler);
  }

  off(type, handler) {
    this.removeListener(type, handler);
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
    const state = { fired: false, handler, type, target };
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

## 9. 说说对 Node 中 Stream 的理解？

> 流（Stream），是一个数据传输手段，是端到端信息交换的一种方式，而且是有顺序的,是逐块读取数据、处理内容，以 Buffer 为单位

- 流可以分成三部分：source、dest、pipe

- 在 source 和 dest 之间有一个连接的管道 pipe,它的基本语法是 source.pipe(dest)，source 和 dest 就是通过 pipe 连接，让数据从 source 流向了 dest，如下图所示:

```
┌──────────────┐                ┌──────────────┐
│              │      pipe      │              │
│    source    ├───────────────►│     dest     │
│              │                │              │
└──────────────┘                └──────────────┘
```

```js
// 基础pipe用法
const fs = require('fs');

// 从source.txt读取，写入到dest.txt
fs.createReadStream('./source.txt').pipe(fs.createWriteStream('./dest.txt'));

// 链式pipe - 文件压缩
fs.createReadStream('./source.txt')
  .pipe(zlib.createGzip()) // 压缩
  .pipe(fs.createWriteStream('./source.txt.gz'));

console.log('文件复制完成');
```

```js
// 事件监听方式（不使用pipe）
const fs = require('fs');

const readStream = fs.createReadStream('./source.txt');
const writeStream = fs.createWriteStream('./dest.txt');

// 可读流事件
readStream.on('data', (chunk) => {
  console.log(`接收到 ${chunk.length} 字节数据`);
  writeStream.write(chunk);
});

readStream.on('end', () => {
  console.log('读取完成');
  writeStream.end(); // 结束写入流
});

readStream.on('error', (err) => {
  console.error('读取错误:', err);
});

writeStream.on('finish', () => {
  console.log('写入完成');
});

// 处理背压（back pressure）
readStream.on('data', (chunk) => {
  if (!writeStream.write(chunk)) {
    readStream.pause(); // 如果写入缓冲区满了，暂停读取
  }
});

writeStream.on('drain', () => {
  readStream.resume(); // 写入缓冲区清空后，继续读取
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

```js
const { Duplex } = require('stream');

// 最简双工流 - 直接传入对象
const duplex = new Duplex({
  read() {
    this.push('read data\n');
    this.push(null); // 结束读取
  },
  write(chunk, enc, cb) {
    console.log('write:', chunk.toString());
    cb(); // 必须调用
  },
});

// 使用
duplex.write('hello'); // write: hello
duplex.on('data', (chunk) => console.log('read:', chunk.toString()));
// read: read data
```

```js
const zlib = require('zlib');
const fs = require('fs');
const { Transform } = require('stream');

// zlib.createGzip() 返回的就是一个转换流
const gzip = zlib.createGzip(); // 这是一个 Transform Stream

// 验证类型
console.log(gzip instanceof Transform); // true
console.log(gzip instanceof require('stream').Transform); // true

// 使用转换流进行压缩
fs.createReadStream('./input.txt')
  .pipe(gzip) // 转换流：压缩数据
  .pipe(fs.createWriteStream('./input.txt.gz'));

console.log('压缩完成');

// 解压也是转换流
const gunzip = zlib.createGunzip(); // 也是 Transform Stream

fs.createReadStream('./input.txt.gz')
  .pipe(gunzip) // 转换流：解压数据
  .pipe(fs.createWriteStream('./output.txt'));

console.log('解压完成');
```

## 11. 宏任务 / 微任务

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

## 12. net 模块的作用是什么？

- net 模块提供 TCP/IP 和 Socket 的 API，用于创建底层网络通信的服务端和客户端

```js
const net = require('net');

// 服务端
const server = net.createServer((socket) => {
  socket.write('连接成功\n');

  socket.on('data', (data) => {
    console.log('收到:', data.toString());
    socket.write('服务端已接收\n');
  });
});

server.listen(3000);

// 客户端
const client = net.createConnection({ port: 3000 }, () => {
  client.write('你好，服务端');
});

client.on('data', (data) => {
  console.log('服务端响应:', data.toString());
});
```

## 13. 什么是背压？highWaterMark 有什么作用？

> 背压是数据流动中生产速度 > 消费速度时的处理机制

- highWaterMark 是流的缓冲区大小阈值。可读流是读多少字节暂停，可写流是写多少字节触发 drain

```js
const { Readable, Writable } = require('stream');

// 1. Create a readable stream with custom highWaterMark
const readStream = new Readable({
  highWaterMark: 16 * 1024, // 16KB default
  read() {
    // Push data when consumer is ready
    if (this.dataCount < 100) {
      this.push(Buffer.alloc(1024, `chunk-${this.dataCount++}`));
    } else {
      this.push(null); // End of stream
    }
  },
});

readStream.dataCount = 0;

// 2. Create a writable stream
const writeStream = new Writable({
  highWaterMark: 16 * 1024, // 16KB buffer limit
  write(chunk, encoding, callback) {
    // Simulate slow writing (e.g., writing to disk/network)
    setTimeout(() => {
      console.log(`Written: ${chunk.toString().slice(0, 20)}...`);
      callback();
    }, 100);
  },
});

// 3. Handle back pressure
readStream.on('data', (chunk) => {
  const canContinue = writeStream.write(chunk);

  if (!canContinue) {
    // Buffer is full, pause reading
    console.log('⏸️  Buffer full, pausing read stream');
    readStream.pause();
  }
});

writeStream.on('drain', () => {
  // Buffer drained, resume reading
  console.log('✅ Buffer drained, resuming read stream');
  readStream.resume();
});

readStream.on('end', () => {
  writeStream.end();
  console.log('🎉 Stream completed');
});
```

## 14. 什么是 Buffer？为什么需要它？

> Buffer 是 Node.js 用于处理二进制数据的类，继承自 JavaScript 的 `Uint8Array`

### 为什么需要 Buffer？

JavaScript 最初设计用于处理网页中的字符串，没有真正的二进制数据类型。但 Node.js 需要处理：

- 文件系统操作
- 网络数据流
- 加密解密
- 图像处理

因此需要 Buffer 来高效处理二进制数据。

### Buffer 的特点

- **内存管理**：分配在 V8 堆外内存，由 C++ 层管理，效率高
- **大小固定**：创建后大小不可变（但内容可修改）
- **创建方式**：使用 `Buffer.alloc()` 和 `Buffer.from()`，避免安全隐患（旧的 `new Buffer()` 已废弃）

```js
// 创建 Buffer
const buf1 = Buffer.alloc(10); // 创建 10 字节的空 Buffer
const buf2 = Buffer.from('hello'); // 从字符串创建
const buf3 = Buffer.from([1, 2, 3]); // 从数组创建
```

---

## 15. Buffer 和字符串转换及乱码处理

### 转换方式

```js
// 字符串 -> Buffer
const buf = Buffer.from('hello', 'utf8');

// Buffer -> 字符串
const str = buf.toString('utf8');

// 支持多种编码：utf8, base64, hex, ascii 等
const base64 = buf.toString('base64'); // aGVsbG8=
const hex = buf.toString('hex'); // 68656c6c6f
```

### 实际应用场景

| 场景          | 说明                                |
| ------------- | ----------------------------------- |
| 文件 MD5 校验 | 读取文件为 Buffer 计算哈希值        |
| 分片合并      | 使用 `Buffer.concat()` 合并多个分片 |
| 加密签名      | 升级包签名基于 Buffer 操作          |

### 乱码处理

在流式读取文本时，可能出现一个字符被切分到两个数据块的情况，导致乱码。

**解决方案**：

```js
const fs = require('fs');

// 方案1: 使用 setEncoding
const readStream = fs.createReadStream('file.txt');
readStream.setEncoding('utf8');
readStream.on('data', (chunk) => {
  console.log(chunk); // 自动处理边界
});

// 方案2: 手动维护剩余字节
let leftover = Buffer.alloc(0);
readStream.on('data', (chunk) => {
  const combined = Buffer.concat([leftover, chunk]);
  // 处理完整字符...
  // 保存不完整的字节到 leftover
});
```

## 16. Nodejs 垃圾回收机制

::: right
Node.js 使用 V8 引擎的垃圾回收机制（Garbage Collection，GC），自动管理内存，无需手动释放
:::

### 一、什么是垃圾回收？

垃圾回收（GC）是自动内存管理机制，自动识别不再使用的对象并释放其占用的内存。

```javascript
// 示例：垃圾回收的基本概念
function createUser() {
  const user = { name: 'John', age: 25 }; // 局部变量
  return user; // 返回给外部，不会被回收
}

function createTemp() {
  const temp = { data: 'temporary' }; // 局部变量
  // 函数执行完毕，temp 不再被引用
  // GC 会自动回收这个对象
}

createTemp(); // temp 对象成为垃圾，等待回收
```

### 二、V8 的内存分代

V8 将堆内存分为**新生代**和**老生代**，采用不同的 GC 算法。

```
┌─────────────────────────────────────────┐
│           V8 堆内存 (Heap)               │
├──────────────────┬──────────────────────┤
│    新生代         │      老生代           │
│   (New Space)    │    (Old Space)       │
│                  │                      │
│  • 小对象         │  • 存活时间长的对象    │
│  • 生命周期短     │  • 大对象             │
│  • Scavenge 算法  │  • Mark-Sweep 算法   │
│                  │  • Mark-Compact 算法 │
│  大小: 1-64MB    │  大小: 可扩展到 1GB+  │
└──────────────────┴──────────────────────┘
```

**新生代（New Space）**

- 存放生命周期较短的小对象
- 使用 **Scavenge 算法**（复制算法）
- 空间小（通常 1-64MB）
- GC 频繁，但速度快

**老生代（Old Space）**

- 存放生命周期长或大对象
- 使用 **Mark-Sweep-Compact 算法**（标记-清除-整理）
- 空间大（可达 1GB 以上）
- GC 频率低，但耗时较长

### 三、垃圾回收算法

#### 1️⃣ Scavenge 算法（新生代）

**原理**：将内存分为 From 区和 To 区，复制存活对象到另一个区。

```
GC 前的 From 区          GC 后的 To 区
┌─────────────────┐     ┌─────────────────┐
│ obj1 (存活)     │     │ obj1 (复制)     │
│ obj2 (垃圾)     │  ─▶ │ obj3 (复制)     │
│ obj3 (存活)     │     │                 │
│ obj4 (垃圾)     │     │                 │
└─────────────────┘     └─────────────────┘
```

**工作流程：**

```javascript
// ========== Scavenge GC 流程 ==========

// 1. 对象分配在 From 区
const obj1 = { data: 'A' }; // From 区
const obj2 = { data: 'B' }; // From 区

// 2. GC 触发
// - 从根对象（Root）开始标记
// - 将存活对象复制到 To 区
// - 清空 From 区

// 3. From 和 To 区互换角色
// 下一轮 GC 时，当前 To 区变为 From 区
```

**特点：**

- ✅ 速度快：只处理存活对象
- ✅ 无内存碎片：复制时紧凑排列
- ❌ 空间浪费：只能使用一半内存

#### 2️⃣ Mark-Sweep 算法（老生代 - 标记清除）

**原理**：标记所有存活对象，清除未标记的对象。

```
标记阶段：
Root → obj1 → obj2
        ↓
       obj3

清除阶段：
obj1 ✅ (存活)
obj2 ✅ (存活)
obj3 ✅ (存活)
obj4 ❌ (未标记，清除)
obj5 ❌ (未标记，清除)
```

**代码示例：**

```javascript
// ========== Mark-Sweep GC 流程 ==========

// 1. 标记阶段（Mark）
// 从 GC Root 开始遍历
const root = {
  user: { name: 'John' },
  session: { id: 123 },
};

// 标记所有可达对象
function mark(root) {
  // 递归标记所有引用
  if (root.user) root.user._marked = true;
  if (root.session) root.session._marked = true;
}

// 2. 清除阶段（Sweep）
// 释放未标记的对象
function sweep(heap) {
  heap.forEach((obj) => {
    if (!obj._marked) {
      // 释放内存
      free(obj);
    }
  });
}

// 3. 整理阶段（Compact）
// 可选：整理内存碎片
```

**特点：**

- ✅ 空间利用率高
- ❌ 会产生内存碎片
- ❌ 需要两次遍历（标记 + 清除）

#### 3️⃣ Mark-Compact 算法（老生代 - 标记整理）

**原理**：标记存活对象后，将它们向一端移动，消除内存碎片。

```
整理前：
[✅][❌][✅][❌][✅][❌][✅][❌]

整理后：
[✅][✅][✅][✅][     自由空间     ]
```

**特点：**

- ✅ 无内存碎片
- ✅ 空间利用率高
- ❌ 移动对象成本高

### 四、GC 的触发时机

#### 自动触发条件

```javascript
// ========== GC 触发场景 ==========

// 1. 新生代空间不足
const arr = [];
for (let i = 0; i < 1000000; i++) {
  arr.push({ index: i }); // 频繁创建对象
  // 新生代满了 → 触发 Scavenge GC
}

// 2. 老生代空间不足
const hugeArray = new Array(10000000).fill({ data: 'large' });
// 老生代空间不足 → 触发 Mark-Sweep GC

// 3. 定期检查
// V8 会定期检查是否需要 GC
```

#### 手动触发 GC

```javascript
// ========== 手动触发 GC ==========

// 方式1: 使用 global.gc()（需要 --expose-gc 参数）
if (global.gc) {
  global.gc(); // 手动触发垃圾回收
  console.log('GC 已执行');
}

// 启动命令
// node --expose-gc app.js

// 方式2: 使用 v8 模块
const v8 = require('v8');
v8.writeHeapSnapshot(); // 生成堆快照

// 方式3: 使用 process.memoryUsage() 监控
function checkMemory() {
  const usage = process.memoryUsage();
  console.log('堆使用情况:', {
    rss: `${Math.round(usage.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(usage.external / 1024 / 1024)}MB`,
  });

  // 堆使用超过 80% 时手动 GC
  if (usage.heapUsed / usage.heapTotal > 0.8) {
    global.gc && global.gc();
  }
}

// 定期检查
setInterval(checkMemory, 10000);
```

### 五、GC 性能优化

#### 1. 减少对象创建

```javascript
// ❌ 频繁创建对象
function process(items) {
  items.forEach((item) => {
    const result = { ...item, processed: true }; // 每次都创建新对象
    store(result);
  });
}

// ✅ 复用对象
function process(items) {
  const result = {};
  items.forEach((item) => {
    Object.assign(result, item, { processed: true });
    store(result);
  });
}
```

#### 2. 避免内存泄漏

```javascript
// ❌ 全局变量持有对象
const cache = {};

function addUser(id, user) {
  cache[id] = user; // 永不释放
}

// ✅ 使用 WeakMap 或设置过期
const cache = new Map();

function addUser(id, user) {
  cache.set(id, user);
  setTimeout(() => cache.delete(id), 60000); // 1分钟后删除
}

// ✅ 或者使用 WeakMap
const cache = new WeakMap();

function addUser(obj, metadata) {
  cache.set(obj, metadata);
  // obj 被回收时，metadata 自动释放
}
```

#### 3. 使用对象池

```javascript
// ========== 对象池模式 ==========

class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];

    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }

  acquire() {
    return this.pool.pop() || this.createFn();
  }

  release(obj) {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

// 使用示例
const bufferPool = new ObjectPool(
  () => Buffer.allocUnsafe(1024),
  (buf) => buf.fill(0),
  100
);

function processData(data) {
  const buffer = bufferPool.acquire();
  // 使用 buffer 处理数据
  buffer.write(data);
  // ...
  bufferPool.release(buffer); // 归还到池中
}
```

#### 4. 调整 V8 内存限制

```bash
# 调整新生代大小（单位：KB）
node --max-new-space-size=64 app.js   # 64MB
node --min-new-space-size=16 app.js   # 最小 16MB

# 调整老生代大小（单位：MB）
node --max-old-space-size=4096 app.js # 4GB

# 查看内存使用
node --trace-gc app.js                # 跟踪 GC
node --trace-gc-verbose app.js        # 详细 GC 日志
node --prof app.js                    # 生成性能分析
```

### 六、监控和调试

#### 使用 Chrome DevTools

```javascript
// 生成堆快照
const v8 = require('v8');

// 方式1: 生成快照文件
v8.writeHeapSnapshot('./heap-snapshot.heapsnapshot');

// 方式2: 在代码中触发
if (process.argv.includes('--heap-snapshot')) {
  v8.writeHeapSnapshot();
  console.log('堆快照已生成');
}

// 方式3: 使用 heapdump 模块
const heapdump = require('heapdump');

// 监听信号生成快照
process.on('SIGUSR2', () => {
  const filename = `/tmp/heapdump-${Date.now()}.heapsnapshot`;
  heapdump.writeSnapshot(filename);
  console.log(`堆快照已保存到: ${filename}`);
});
```

#### 内存泄漏检测

```javascript
// ========== 内存泄漏检测脚本 ==========

const v8 = require('v8');

let snapshotCount = 0;

function takeSnapshot(label = '') {
  const filename = `./snapshot-${snapshotCount++}${label}.heapsnapshot`;
  v8.writeHeapSnapshot(filename);
  console.log(`📸 堆快照: ${filename}`);
}

// 使用示例
function detectMemoryLeak() {
  takeSnapshot('initial');

  // 执行操作
  const items = [];
  for (let i = 0; i < 10000; i++) {
    items.push({ id: i, data: 'leak' });
  }

  takeSnapshot('after-creation');

  // 清理
  items.length = 0;
  global.gc && global.gc(); // 手动 GC

  takeSnapshot('after-gc');
}

detectMemoryLeak();
```

### 七、常见 GC 问题

#### 1. GC 频繁导致性能下降

```javascript
// 问题：频繁创建和销毁对象
function render() {
  const data = new Array(1000).fill(0); // 每次渲染都创建
  // ...
  requestAnimationFrame(render);
}

// 优化：复用数组
const data = new Array(1000).fill(0);
function render() {
  // 复用 data
  requestAnimationFrame(render);
}
```

#### 2. 老生代 GC 阻塞主线程

```javascript
// 问题：一次性处理大量数据
function processLargeDataset() {
  const dataset = new Array(10000000).fill({ data: 'large' });
  // 可能触发 Full GC，阻塞主线程
}

// 优化：分批处理
async function processLargeDataset() {
  const batchSize = 10000;
  for (let i = 0; i < 10000000; i += batchSize) {
    const batch = new Array(batchSize).fill({ data: 'large' });
    process(batch);
    await setImmediate(); // 让事件循环有机会执行
  }
}
```

### 八、总结

| 算法             | 使用区域 | 优点           | 缺点                |
| ---------------- | -------- | -------------- | ------------------- |
| **Scavenge**     | 新生代   | 速度快、无碎片 | 空间利用率低（50%） |
| **Mark-Sweep**   | 老生代   | 空间利用率高   | 有内存碎片          |
| **Mark-Compact** | 老生代   | 无碎片         | 移动成本高          |

::: tip 优化建议

1. **避免频繁创建对象**：使用对象池、复用对象
2. **及时释放引用**：删除不再使用的属性、清空数组
3. **监控内存使用**：使用 `process.memoryUsage()` 定期检查
4. **调整内存参数**：根据应用特点调整 `--max-old-space-size`
5. **生成堆快照**：使用 `v8.writeHeapSnapshot()` 分析内存泄漏
   :::

**注意**：下一节（第 17 节）会详细讲解新生代如何晋升到老生代，本节重点理解 GC 的基本概念和算法。

## 17. Node GC 新生代如何转变为老生代？

> V8 引擎的垃圾回收机制将内存分为**新生代**（New Space）和**老生代**（Old Space）。

### V8 内存结构

```
┌─────────────────────────────────────────┐
│           V8 堆内存 (Heap)               │
├──────────────────┬──────────────────────┤
│    新生代         │      老生代           │
│   (New Space)    │    (Old Space)       │
│                  │                      │
│  ┌────────────┐  │  ┌────────────────┐  │
│  │ From 区    │  │  │  老生代指针区   │  │
│  └────────────┘  │  │                │  │
│  ┌────────────┐  │  │  老生代数据区   │  │
│  │ To 区      │  │  │                │  │
│  └────────────┘  │  └────────────────┘  │
│                  │                      │
│  大小: 1-64MB    │  大小: 可扩展到 1GB+  │
└──────────────────┴──────────────────────┘
```

### 新生代 → 老生代的晋升条件

| 晋升条件           | 说明                             | 默认阈值         |
| ------------------ | -------------------------------- | ---------------- |
| **经历 GC 次数**   | 对象从 From 区复制到 To 区的次数 | 通常为 1-2 次    |
| **To 区内存不足**  | To 区空间不足以存放复制对象      | 视 To 区大小而定 |
| **大对象直接分配** | 超过一定大小的对象直接进入老生代 | 通常为几十 KB    |

### 晋升机制详解

#### 1️⃣ 基于 GC 次数的晋升

```javascript
// 示例：对象经历多次 Scavenge GC 后晋升

// ========== 第一次 GC ==========
// 对象在 From 区被创建
let obj = { data: 'new object' };

// GC 发生：obj 从 From 复制到 To 区
// 记录：obj.age = 1

// ========== 第二次 GC ==========
// From 和 To 区互换
// obj 又从新的 From 复制到 To 区
// 记录：obj.age = 2

// ========== 晋升触发 ==========
// 当 obj.age 达到阈值（默认 2）
// obj 被移动到老生代
// 之后的 GC 使用 Mark-Sweep-Compact 算法
```

**晋升阈值可通过启动参数调整：**

```bash
# 设置晋升阈值（默认为 2）
node --max-new-space-size=64 --gc-interval=100 app.js

# 查看当前 GC 情况
node --trace-gc app.js
```

#### 2️⃣ To 区内存不足时的晋升

```javascript
// ========== To 区空间不足场景 ==========
const largeArray = new Array(10000).fill({ data: 'large' });

// 当 From 区的许多对象需要复制到 To 区
// 但 To 区空间不足时，这些对象会被直接晋升到老生代
// 避免频繁触发 Full GC
```

#### 3️⃣ 大对象直接分配

```javascript
// ========== 大对象直接进入老生代 ==========

// 小对象（通常 < 32KB）→ 新生代
let smallObj = { name: 'small' };

// 大对象（通常 >= 32KB）→ 老生代
let largeObj = new Buffer(32 * 1024); // 32KB

// 或者大数组
let hugeArray = new Array(100000);
```

### 晋升过程示意图

```
初始状态：
┌─────────────┐     ┌─────────────┐
│  From 区    │     │   To 区     │
│  ┌──────┐  │     │  (空闲)     │
│  │ obj  │  │  →  │             │
│  └──────┘  │     │             │
└─────────────┘     └─────────────┘
     age=0

第一次 GC：
┌─────────────┐     ┌─────────────┐
│  From 区    │     │   To 区     │
│  (空闲)     │     │  ┌──────┐  │
│             │ ←  │  │ obj  │  │
│             │     │  └──────┘  │
└─────────────┘     └─────────────┘
     age=0              age=1

第二次 GC：
┌─────────────┐     ┌─────────────┐
│  From 区    │     │   To 区     │
│  ┌──────┐  │     │  (空闲)     │
│  │ obj  │  │  →  │             │
│  └──────┘  │     │             │
└─────────────┘     └─────────────┘
     age=1              age=2

晋升到老生代：
┌───────────────────────────────────┐
│           老生代                   │
│  ┌──────┐                         │
│  │ obj  │  (age >= 2，晋升)       │
│  └──────┘                         │
└───────────────────────────────────┘
```

### 代码示例：观察 GC

```javascript
// ========== 观察对象晋升过程 ==========
// 运行：node --trace-gc --trace-gc-verbose your-script.js

// 创建短命对象（新生代）
function createShortLivedObjects() {
  for (let i = 0; i < 1000; i++) {
    let temp = { id: i, data: 'temporary' };
    // temp 在函数结束后即可被回收
  }
}

// 创建长命对象（最终晋升到老生代）
let longLivedObjects = [];

function createLongLivedObjects() {
  for (let i = 0; i < 1000; i++) {
    longLivedObjects.push({
      id: i,
      data: 'persistent',
      timestamp: Date.now(),
    });
  }
  // 这些对象会经历多次 GC，最终晋升到老生代
}

// 触发 GC
if (global.gc) {
  global.gc(); // 手动触发 GC
}
```

::: tip 本节总结
本节重点讲解**新生代如何晋升到老生代**，关于 GC 算法详解、性能优化等内容请查看**第 16 节：Nodejs 垃圾回收机制**。

**晋升三个关键点：**

1. **经历 GC 次数**（默认 2 次）- 对象在新生代存活越久，越可能晋升
2. **To 区内存不足** - 复制时空间不够，直接晋升
3. **大对象直接分配** - 超过 32KB 的对象直接进老生代
   :::

## 18. 如何使用 nodejs 读取一个本地文件

> **fs.readFile** 是一个异步方法，它接受一个回调函数作为参数，当文件读取完成时，回调函数会被调用。这种方式适合在非阻塞的情况下执行文件读取操作，不会阻止后续代码的执行。

> **fs.readFileSync** 是一个同步方法，它会阻塞当前线程，直到文件读取完成。这意味着在文件读取完成之前，程序无法执行其他操作。因此，通常不建议在主线程中使用同步方法，特别是在服务器端应用中，因为它可能导致性能问题和阻塞。

> **fs.promises.readFile** 是一个异步 Promise 方法，它返回一个 Promise 对象，允许您使用 async/await 或 Promise 链式调用来处理文件读取操作。这种方式在异步编程中更加方便和可读，不会阻塞主线程。

## 19. 如何做到创建 nodejs 集群并做到不中断重启？

```js
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 创建子进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // 监听子进程退出事件
  cluster.on('exit', (worker, code, signal) => {
    console.log(`子进程 ${worker.process.pid} 停止运行`);
    // 重启子进程
    cluster.fork();
  });
} else {
  // 在子进程中创建 HTTP 服务器
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end('Hello, World!');
    })
    .listen(8000);

  console.log(`子进程 ${process.pid} 正在运行`);
}
```

## 20. Node 如何设置使用内存大小

> 默认为 4GB，不同机器可能有不同

```bash
node --max-old-space-size=2048 your-app.js
```

## 21. Node 主进程和子进程是否共享内存？

> 在 Node.js 中，主进程和子进程之间**不共享内存**。主进程和子进程是独立的进程，它们拥有自己的独立内存空间。这是操作系统级别的分离。

当你在 Node.js 中创建子进程时，每个子进程都有自己的 JavaScript 执行环境和内存空间。这意味着主进程和子进程之间不能直接共享变量或数据，除非你明确地使用进程间通信（Inter-Process Communication，IPC）机制来实现数据传递，例如使用 `child_process` 模块的 `send()` 和 `on('message')` 方法。


---

### Node.js SHA-256 加密方式

::: right
来自 [Sapphire611](http://sapphire611.github.io)
:::
---

#### 前端加密

```js
var file = $("#file_upload...")[0].files[0]; // 上传的文件
if(!file) return;

// 计算文件的SHA-256
const arrayBuffer = await file.arrayBuffer() // 二进制数据,与字符编码关系不大
const digestBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)// 计算摘要buffer
const digestArray = Array.from(new Uint8Array(digestBuffer))

// 转换为16进制字符串
const digestHex = digestArray.map((b) => b.toString(16).padStart(2, '0')).join('')
```

#### 后端加密

```js
const sha256 = crypto.createHash('sha256').update(binaryStr,'utf-8').digest('hex') 
// const sha256 = crypto.createHash('sha256').update(binaryStr,'ASCII').digest('hex') 
```

::: tip
在计算文件的SHA-256哈希时，使用 `crypto.subtle.digest()` 方法，这通常涉及处理二进制数据。
既然是二进制数据，默认编码通常与字符编码关系不大，因为二进制数据直接处理字节而不是字符。在这个上下文中，编码主要与将数据转换为字符串有关，例如为了显示或保存哈希值。

当你提到字符编码时，可能是指将二进制哈希值转为字符串时的默认处理方式。
通常在计算完SHA-256后，需要以特定的编码格式呈现结果，例如转换为十六进制（Hex）或Base64。
:::

::: warning
```js
const bytes = new Uint8Array(e.target.result) // [72, 101, 108, 108, 111]
const length = bytes.byteLength
for (let i = 0; i < length; i++) {
    binaryStr += String.fromCharCode(bytes[i]) //二进制转换字符串,这是使用UTF-16转换的
}

const decoder = new TextDecoder("utf-8"); // 创建 UTF-8 解码器
const binaryUtf8Str = decoder.decode(bytes); // 直接将二进制转换为'utf-8'字符串
```
::: 

---

### UTF-8 字节数计算函数

> 在 JavaScript 中，字符串的长度和字节数之间的关系可能会因字符串中包含的字符而有所不同。由于 UTF-8 编码是一种变长编码，每个字符可能占用不同数量的字节。

- 以下是一个简单的 JavaScript 函数，可以用于计算一个字符串在 UTF-8 编码下所占的字节数：

```js
function utf8ByteLength(str) {
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);

    if (code <= 0x7f) {
      count += 1;
    } else if (code <= 0x7ff) {
      count += 2;
    } else if (code <= 0xffff) {
      count += 3;
    } else if (code <= 0x10ffff) {
      count += 4;
    }
  }

  return count;
}
```