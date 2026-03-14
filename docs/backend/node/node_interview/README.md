---
title: 面试真题记录
date: 2026-3-13
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

### STICKY

[什么是 nodejs?](/backend/node/node/#_0-什么是-nodejs) /
[nodejs 事件循环机制](/backend/node/node/#_7-node-js-事件循环机制) /
[浏览器和 Node 中 事件循环区别](/backend/node/node/#_3-浏览器和-node-中-事件循环有什么区别) /
[防抖和节流函数](/frontend/vue/#防抖-debounce-和-节流-throttle-函数)

### AltenChina(HP)

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

[MySQL 分布式事务是如何实现的？](/backend/mysql/#_8-mysql-分布式事务是如何实现的)

[MongoDB 千万级数据如何导出，并在实际业务中操作？](/backend/mongodb/#_5-mongodb-千万级数据如何导出-并在实际业务中操作)

[Docker Compose 如何指定网络 IP？](/deploy/docker/#docker-compose-如何指定网络-ip)

[Redis List 常用命令 (lrange k1 0 -1)](/backend/redis/#list-常用命令)

[Redis Hash 常用命令 (hkeys k1)](/backend/redis/#hash-常用命令)

[MongoDB ABC 联合索引，AB AC 是否生效？](/backend/mongodb/#_6-mongodb-设置了-abc-联合索引-那-ab-ac-之类的生效吗)

[MySQL 与 MongoDB 地理索引对比](/backend/mysql/#_11-mysql-与-mongodb-地理索引对比)

[Node GC 新生代如何转变为老生代？](/backend/node/node/#_16-node-gc-新生代如何转变为老生代)

[js 原生数组头部插入删除 (unshift,shift)](#)

[js 参数传递是值传递还是引用传递 (基本类型传值、引用类型传递引用)](#)

- 基本类型: String Number Boolean Symbol null undefined
- 引用类型: Object Array Function

---

## HUAWANG

[计算属性 (computed) 和侦听器 (watch/watchEffect) 对比](/frontend/vue/#计算属性-computed-和侦听器-watch-watcheffect-对比)

[Vue2/3 的响应式原理](/frontend/vue/#vue的响应式原理是如何实现的-请描述object-defineproperty和proxy的区别及其优缺点)

[toRef 什么时候使用](/frontend/vue/#toref-什么时候使用)

[type 和 interface 的区别](/frontend/typescript/#_2-type-和-interface-的区别)

[any、unknown、never 的区别](/frontend/typescript/#_3-any、unknown、never-的区别)

[> CommonJS 是运行时引入,ESM 是编译时静态分析 + 运行时执行](#)

## CPIC

[css-矩形旋转](/frontend/interview/#css-矩形旋转)

[防抖和节流函数](/frontend/vue/#防抖-debounce-和-节流-throttle-函数)

[Promise.all Vs Promise.allSettled](/frontend/interview/#promise-all-vs-promise-allsettled)

[Vue 路由传参](/frontend/interview/#vue-路由传参)

## CTrip

[NestJS 数据初始化的时机](/backend/node/node_frame/#nestjs-数据初始化的时机)

[Nestjs 全链路追踪方案](/backend/node/node_frame/#nestjs-全链路追踪方案)

## DEEPSIGHT

[浏览器的事件循环](/backend/node/node/#_3-浏览器和-node-中-事件循环有什么区别)

[VUE 响应式原理](/frontend/vue/#vue的响应式原理是如何实现的-请描述object-defineproperty和proxy的区别及其优缺点)

---

[70. 爬楼梯](/backend/node/leetcode-js/#_70-爬楼梯)

[867. 转置矩阵](/backend/node/leetcode-js/#_867-转置矩阵)

## YIKA

- Redis 缓存续期问题（计划任务时间大于轮询时间时，双重缓存/缓存续期）

[prisma 和 typeorm 区别](/backend/node/node_frame/#orm-的选型)

- NestJS 解决循环依赖的问题(forwardRef)

```ts
// module-a.module.ts
@Module({
  imports: [forwardRef(() => ModuleB)],
})
export class ModuleA {}

// module-b.module.ts
@Module({
  imports: [forwardRef(() => ModuleA)],
})
export class ModuleB {}
```

[Nest 守卫、拦截器、中间件 的区别](/backend/node/node_frame/#nest-守卫、拦截器、中间件-的区别)

[手写装饰器](/frontend/interview/#手写装饰器)

## SHANGHAI LONGYI

[express 和 koa 中间件的区别(线性 / 洋葱圈)](/backend/node/node/#_1-koa-和-express-有哪些不同)

[MySQL 和 MongoDB 的索引数据结构](/backend/sql/#mysql-和-mongodb-的索引数据结构)

[B 树 和 B+树](/backend/sql/#b-tree)

[Docker 常用的网络模式有哪些?](/deploy/docker/#docker-常用的网络模式有哪些)

[Nest 守卫、拦截器、中间件 的区别](/backend/node/node_frame/#nest-守卫、拦截器、中间件-的区别)

---

[算法题:非递减数列](/backend/node/leetcode-js/#_665-非递减数列)

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

### 1. Node 和 Ajax 有什么区别？

> Node.js 和 Ajax 是两个不同的概念。

- Node.js 是一个基于 JavaScript 的运行时环境，用于在服务器端运行 JavaScript 代码。它使得开发者能够使用 JavaScript 编写服务器端应用程序，并提供了一系列的内置模块和扩展库，用于简化服务器端应用程序的开发。

- Ajax 是一种基于 JavaScript 和 XML（或 JSON）的技术，用于实现客户端和服务器端之间的异步通信。Ajax 可以在不刷新整个页面的情况下更新部分页面内容，从而提高了网站的响应速度和用户体验。Ajax 主要是在客户端使用的技术，通过浏览器内置的 **XMLHttpRequest** 对象来实现与服务器端的异步通信。

> 因此，Node.js 和 Ajax 是两个不同的概念。Node.js 主要是用于在服务器端运行 JavaScript 代码，而 Ajax 主要是用于在客户端和服务器端之间进行异步通信。

[Node Stream 是什么？有哪些种类的 Stream？](/backend/node/node/#_10-node-stream-是什么-有哪些种类的-stream)

### 3. fs.readFile() 和 fs.createReadStream() 有什么区别？

| 区别     | fs.readFile()          | fs.createReadStream()                    |
| -------- | ---------------------- | ---------------------------------------- |
| 读取到   | 全部读取到内存         | 分成一系列小块（缓冲区），逐块读取和处理 |
| 适用于   | 较小的文件或数据       | 大型文件或数据集                         |
| callback | 作为回调函数的参数返回 | 通过监听完成读取操作                     |

---

## MiaoDian

[Mysql 查询学生三门科目总分最高的 前三名](/backend/sql/#mysql-查询学生三门科目总分最高的-前三名)

## 心悦互娱

### 1. 如何使用 nodejs 读取一个本地文件？

> **fs.readFile** 是一个异步方法，它接受一个回调函数作为参数，当文件读取完成时，回调函数会被调用。这种方式适合在非阻塞的情况下执行文件读取操作，不会阻止后续代码的执行。

> **fs.readFileSync** 是一个同步方法，它会阻塞当前线程，直到文件读取完成。这意味着在文件读取完成之前，程序无法执行其他操作。因此，通常不建议在主线程中使用同步方法，特别是在服务器端应用中，因为它可能导致性能问题和阻塞。

> **fs.promises.readFile** 是一个异步 Promise 方法，它返回一个 Promise 对象，允许您使用 async/await 或 Promise 链式调用来处理文件读取操作。这种方式在异步编程中更加方便和可读，不会阻塞主线程。

### 3. 如何做到创建 nodejs 集群并做到不中断重启？

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

### 5. mongo 扣减库存时如何保证原子一致性？

> 这里使用 mongoose 的版本

```js
const session = await mongoose.startSession();
session.startTransaction();

try {
  // 在 session 中执行操作
  await InventoryModel.updateOne({ _id: productId, quantity: { $gte: quantity } }, { $inc: { quantity: -quantity } }, { session });

  await RecordModel.create(
    {
      productId: productId,
      quantity: -quantity,
      timestamp: new Date(),
    },
    { session }
  );

  await session.commitTransaction();
  session.endSession();
} catch (error) {
  await session.abortTransaction();
  session.endSession();
  throw error;
}
```

### 6.请写出符合下列要求的 mongodb 查询语句:

> 查询表 user 中，name 是 abc，且 age 大于 30 岁或小于等于 10 岁的数据，跳过 100 条数据之后的 50 条数据，按年龄逆序排列，并仅返回 name 和 age 两个字段

```js
const query = await User.find({
  name: 'abc',
  $or: [{ age: { $gt: 30 } }, { age: { $lte: 10 } }],
})
  .skip(100)
  .limit(50)
  .sort({ age: -1 })
  .select('name age');
```

```js
const oprs = [
  {
    $match: {
      name: 'abc',
      $or: [{ age: { $gt: 30 } }, { age: { $lte: 10 } }],
    },
  },
  { $sort: { age: -1 } },
  { $skip: 100 },
  { $limit: 50 },
  { $project: { name: 1, age: 1 } },
];

await User.aggregate(oprs);
```

### 7. 如何使用 redis 实现简单的消息队列？

> 要使用 Redis 实现简单的消息队列，你可以借助 Redis 的列表数据结构来实现。

> 以下是一个基本的示例，展示如何使用 Redis 来创建一个简单的消息队列：

> DaoyouLun: 实现消息队列长度为 5

```js
const Redis = require('ioredis');
const client = new Redis(6379, '127.0.0.1');

async function send(msg) {
  const cur = await client.llen('test_queue');
  console.log(cur); // 设置消息队列上限为5

  if (cur > 5) {
    console.error('size more than 5');
    return;
  }
  await client.lpush('test_queue', msg);
}

async function poll() {
  try {
    const message = await client.rpop('test_queue');
    if (message) {
      console.debug(message);
    }
  } catch (err) {
    console.error(err);
  }

  process.nextTick(poll);
}

poll();

async function main() {
  await send('111');
  await send('222');
  await send('333');
  await send('444');
  await send('555');
  await send('666');
}

main();
```

### 8.用 redis 实现一个分数排行榜，并从中查找前十名的数据

```bash
zadd leaderboard 100 PlayerA
zadd leaderboard 80 PlayerB
zadd leaderboard 120 PlayerC
zrevrange leaderboard 0 9 WITHSCORES
```

```js
const redis = require('ioredis');
const client = redis.createClient();

// 添加成员和分数到排行榜
function addMemberToLeaderboard(member, score) {
  client.zadd('leaderboard', score, member, (err, reply) => {
    if (err) {
      console.error('Failed to add member to leaderboard:', err);
    } else {
      console.log('Member added to leaderboard:', member);
    }
  });
}

// 获取排行榜前十名的数据
function getTopTenFromLeaderboard() {
  client.zrevrange('leaderboard', 0, 9, 'WITHSCORES', (err, results) => {
    if (err) {
      console.error('Failed to get top ten from leaderboard:', err);
    } else {
      console.debug(results);
      // [
      //     'PlayerL', '123',     'PlayerI',
      //     '122',     'PlayerF', '121',
      //     'PlayerC', '120',     'PlayerJ',
      //     '103',     'PlayerG', '102',
      //     'PlayerD', '101',     'PlayerA',
      //     '100',     'PlayerK', '83',
      //     'PlayerH', '82'
      //   ]
      console.log('Top ten from leaderboard:');
      for (let i = 0; i < results.length; i += 2) {
        const member = results[i];
        const score = results[i + 1];
        console.log(`${i / 2 + 1}. Member: ${member}, Score: ${score}`);
      }
    }
  });
}

// 示例添加成员和分数到排行榜
addMemberToLeaderboard('PlayerA', 100);
addMemberToLeaderboard('PlayerB', 80);
addMemberToLeaderboard('PlayerC', 120);

addMemberToLeaderboard('PlayerD', 101);
addMemberToLeaderboard('PlayerE', 81);
addMemberToLeaderboard('PlayerF', 121);

addMemberToLeaderboard('PlayerG', 102);
addMemberToLeaderboard('PlayerH', 82);
addMemberToLeaderboard('PlayerI', 122);

addMemberToLeaderboard('PlayerJ', 103);
addMemberToLeaderboard('PlayerK', 83);
addMemberToLeaderboard('PlayerL', 123);

// 查询排行榜前十名的数据
getTopTenFromLeaderboard();
```

### 9.和他人在同一个 git 分支开发，在本地开发好一个功能后，如何提交并上传服务器可以尽可能的减少冲突并保留完整提交历史，列举使用的命令或操作

```bash
git stash # 保存当前工作区
git pull # 拉取远程分支
git stash apply # 恢复工作区
git add . # 添加修改
git commit -m 'xxx' # 提交修改
git push # 推送到远程分支
```

### 10.列举 js 中数组遍历相关的方法

1. for 循环

```javascript
const array = [1, 2, 3, 4, 5];
for (let i = 0; i < array.length; i++) {
  console.log(array[i]);
}
```

2. for...of 循环：用于遍历可迭代对象，例如数组、字符串等。

```javascript
const array = [1, 2, 3, 4, 5];
for (const item of array) {
  console.log(item);
}
```

3. forEach 方法：

```javascript
const array = [1, 2, 3, 4, 5];
array.forEach((item) => {
  console.log(item);
});
```

4. map 方法：返回一个新的数组，其中包含对原始数组每个元素进行处理后的结果。

```javascript
const array = [1, 2, 3, 4, 5];
const newArray1 = array.map((item) => item * 2);
console.log(newArray);
```

5. filter 方法：返回一个新的数组，其中包含满足特定条件的原始数组元素。

```javascript
const array = [1, 2, 3, 4, 5];
const newArray2 = array.filter((item) => item > 2);
console.log(newArray);
```

6. reduce 方法：通过对原始数组的累积计算，返回一个单一的值。

> 回调函数（callback function）：这是一个用于处理数组元素的函数，它接受四个参数：累加器（accumulator）、当前值（current value）、当前索引（current index）和原始数组（array）。回调函数在每个数组元素上被调用，可以执行任意操作并返回一个值，该值将作为下一次迭代的累加器的值

> 初始累加器的值（initial accumulator value）：这是可选的参数，指定初始的累加器的值。如果未提供该参数，则将使用数组的第一个元素作为初始累加器的值，并从数组的第二个元素开始迭代。

```javascript
const array = [1, 2, 3, 4, 5];
const sum = array.reduce((accumulator, currentValue) => accumulator + currentValue);
console.log(sum);
```

### 11.列举几个 es6 以后的新特性

1. 块级作用域（Block Scope）：通过使用 let 和 const 关键字，引入了块级作用域，使得变量和常量的作用域仅限于定义它们的块内部。

2. 箭头函数（Arrow Functions）：使用 => 语法定义函数，可以更简洁地编写函数表达式，并自动绑定函数体内的 this 值。

3. 解构赋值（Destructuring Assignment）：可以从数组或对象中快速提取值，并将它们分配给变量，以便进行更方便的赋值操作。

4. 默认参数（Default Parameters）：在函数定义中，可以为参数设置默认值，当调用函数时没有提供该参数时，将使用默认值。

5. 模板字面量（Template Literals）：使用反引号 包围的字符串，可以包含变量、表达式和换行符，并使用 ${} 语法进行插值。

6. 扩展运算符（Spread Operator）：通过使用 ... 语法，可以将数组或对象在函数调用、数组字面量或对象字面量中展开，使其元素或属性被拆分成独立的项。

7. 类和模块（Classes and Modules）：引入了类和模块的概念，可以更简洁地定义和组织对象的行为和结构。

8. async/await（Promises）：引入了 Promise 对象，用于处理异步操作，使得异步代码更易于编写和管理。

9. for...of 循环（For...of Loop）：提供了一种简单的遍历数组、字符串和其他可迭代对象的方式。

10 模块化导入和导出（Module Import and Export）：通过 import 和 export 关键字，支持模块化的文件导入和导出，方便代码的组织和复用。

### 12.将两个数组的元素合并并去重

```js
const array1 = [1, 2, 3];
const array2 = [2, 3, 4];

// 将两个数组合并
const mergedArray = [...array1, ...array2];

// 去重
const uniqueArray = [...new Set(mergedArray)];

console.log(uniqueArray);
```

### 13.列举几个处理异步请求嵌套的方法

```js
// 嵌套回调函数处理异步请求
asyncRequest1((err, res) => {
  asyncRequest2(() => {
    asyncRequest3(() => {
      console.log('All requests completed.');
    });
  });
});

function asyncRequest3() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Async Request 3 Completed');
      resolve();
    }, 1000);
  });
}

// 使用 Promise 链式调用处理异步请求
asyncRequest1()
  .then(() => asyncRequest2())
  .then(() => asyncRequest3())
  .then(() => {
    console.log('All requests completed.');
  });

// 使用 async/await 处理异步请求
async function nestedAsyncRequests() {
  await asyncRequest1();
  await asyncRequest2();
  await asyncRequest3();

  console.log('All requests completed.');
}

// 使用 Promise.all 并行处理异步请求
Promise.all([asyncRequest1(), asyncRequest2(), asyncRequest3()]).then((results) => {
  console.log('All requests completed.');
  console.log('Results:', results);
});
```

### 14. 用 ts 实现多态，父类 animal，子类 cat 和 dog，包含 name 属性，实现 say 方法

```ts
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  say(): void {
    console.log('Animal says...');
  }
}

class Cat extends Animal {
  say(): void {
    console.log('Meow!');
  }
}

class Dog extends Animal {
  say(): void {
    console.log('Woof!');
  }
}

// 多态性的应用
const animals: Animal[] = [new Cat('Tom'), new Dog('Max'), new Cat('Kitty')];

animals.forEach((animal) => {
  console.log(`Name: ${animal.name}`);
  animal.say();
  console.log('------------------');
});

// yarn add global ts-node typescript
// npx ts-node test.ts
```

### 15.如何不使用第三个变量来交换两个数的值?

```js
let a = 10;
let b = 5;

a = a + b; // 将 a 的值与 b 相加，结果赋给 a
b = a - b; // 用新的 a 值减去原始的 b 值，结果赋给 b
a = a - b; // 用新的 a 值减去新的 b 值，结果赋给 a

console.log(a); // 输出 5
console.log(b); // 输出 10
```

```js
let a = 10;
let b = 5;

a = a ^ b; // 对 a 和 b 进行位异或操作，结果赋给 a
b = a ^ b; // 用新的 a 值与原始的 b 值进行位异或操作，结果赋给 b
a = a ^ b; // 用新的 a 值与新的 b 值进行位异或操作，结果赋给 a

console.log(a); // 输出 5
console.log(b); // 输出 10
```

### 17.现有 1000 个苹果，10 个盒子，问各个盒子内应该分别放入多少个苹果，才能使得用户要买任意 1 至 1000 之间的一个苹果数，都可以给他

> (卖的时候是整个盒子卖，不能拆盒子的包装)。

```js
盒子1（第1位）放入1个苹果。
盒子2（第2位）放入2个苹果。
盒子3（第3位）放入4个苹果。
盒子4（第4位）放入8个苹果。
盒子5（第5位）放入16个苹果。
盒子6（第6位）放入32个苹果。
盒子7（第7位）放入64个苹果。
盒子8（第8位）放入128个苹果。
盒子9（第9位）放入256个苹果。
盒子10（第10位）放入475个苹果（剩余的苹果数量）。
```

---

## KeLuoDa

### 2. node 设置使用内存大小

> 默认为 4GB，不同机器可能有不同

```bash
node --max-old-space-size=2048 your-app.js
```

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

### 5. 主进程和子进程是否共享内存？

> 在 Node.js 中，主进程和子进程之间**不共享内存**。主进程和子进程是独立的进程，它们拥有自己的独立内存空间。这是操作系统级别的分离。

当你在 Node.js 中创建子进程时，每个子进程都有自己的 JavaScript 执行环境和内存空间。这意味着主进程和子进程之间不能直接共享变量或数据，除非你明确地使用进程间通信（Inter-Process Communication，IPC）机制来实现数据传递，例如使用 `child_process` 模块的 `send()` 和 `on('message')` 方法。

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
