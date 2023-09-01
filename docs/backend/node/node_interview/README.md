---
title: Node.js Backend Developer
date: 2023-9-1
categories:
  - Backend
tags:
  - node
  - interview
sidebar: "auto"
keys:
 - 6e0dc2521bd023fa6d124a78c1317ab9
publish: true
---

## StoreHub

### 3-minutes self-introduction in English

### 什么是微服务？使用微服务的优势/缺点有哪些？

> 微服务是一种软件架构风格，它将一个应用程序拆分成许多独立的服务，每个服务都是一个独立的进程，且与其他服务通信。这种架构风格的目的是让应用程序更容易开发、部署、维护和扩展。

- 使用微服务的优势包括：
    - 更容易开发和维护：将应用程序拆分为许多小型服务可以让开发人员更容易地理解和修改代码。
    - 更容易部署：因为每个服务都是独立的，所以可以独立部署。这使得可以更快地更新应用程序，并且可以轻松进行 A/B 测试。
    - 更容易扩展：微服务架构使得可以更轻松地扩展应用程序的某些部分，而不会影响到整个应用程序。
    - 更容易处理不同技术栈：在微服务架构中，每个服务可以使用不同的语言、框架和数据存储技术。

### SQL

#### Mysql & MongoDB & Redis 介绍，分别在哪些场景下发挥优势？
> MySQL、MongoDB 和 Redis 都是常用的数据库系统，它们在不同的应用场景下发挥优势。

- MySQL 是一种关系型数据库管理系统，具有高度可移植性、稳定性和安全性。它在处理复杂的关系型数据时表现优越，例如在订单管理、用户管理等应用中。

- MongoDB 是一种文档型数据库系统，它提供了高性能、高可扩展性和高可用性。它能够轻松处理大量非结构化数据，例如在日志管理、用户行为分析等应用中。

- Redis 是一种内存型数据库系统，它支持快速读写，具有高吞吐量和低延迟。它适用于缓存、消息队列和其他对实时性要求较高的应用，例如在实时推荐、游戏状态管理等应用中。

### 查找4月份的日志，基于name去重

```sql 
Log
id, name, actions, createdTime, modifiedTime
```
#### mongodb: 

```js
db.logs.aggregate([
  {
    $match:{
      createdTime:{
         "$gte": ISODate("2023-04-01T00:00:00.000Z"), // 这里取决于时间戳的格式 ISO/unix
         "$lt": ISODate("2023-05-01T00:00:00.000Z")
      }
    }
  },
  {
    $group: {
      _id: '$name', // 基于name字段去重
      original: {
        $first: '$$ROOT', // 在original中保留$group第一个结果，用于显示。
        // （$push会保留重复的结果）
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: '$original', // 让original变成根节点
    },
  },
]);
```

#### mysql: 

``` sql
SELECT name,action,createdTime,modifiedTime 
FROM Log 
WHERE createdTime BETWEEN '2022-04-01' and '2022-04-30' 
GROUP BY name,action,createdTime,modifiedTime;
```

### mongodb中索引有哪些类型？分别怎么使用？

 | 类型             | 说明         | 作用                                                |
 | ---------------- | ------------ | --------------------------------------------------- |
 | Single Filed     | 单字段索引   | 在普通字段、子文挡以及子文档的某个 字段上建立的索引 |
 | Compound Index   | 复合索引     | 同时在多个字段上建立的索引                          |
 | Multikey Index   | 多键索引     | 对数组建立的索引                                    |
 | Geospatial Index | 地理空间索引 | 对地理位置型数据建立的索引（支持球面和平面）        |
 | Textlndex        | 全文索引     | 对每一个词建立索引，支持全文搜索                    |
 | Hashed Index     | 哈希索引     | 索引中存储的是被索引键的哈希值                      |

### 把 callback 改写成 Promise 

```js
function test(arg, callback) {
    // … 
    if (err) {
        callback(err);
    } else {
        callback(null, arg);
    }
}

function testAsync(arg) {
    //… Write here
}

const main = async function () {
    try {
        const a = await testAsync(arg);
    } catch (error) {
        console.error(error);
    }
}
main()
```
---

```js
/**
 *  @Author     :   ruanchuhao
 *  @Date       :   2022/11/30
 *  @Name       :   test.js
 *  @Content    :   ruanchuhao@shgbit.com
 *  @Desc       :
 */

'use strict';

// ### 把 callback 改写成 Promise

function test(arg, callback) {
    const err = undefined;
    // …
    if (err) {
        callback(err);
    } else {
        callback(null, arg);
    }
}

function testAsync(arg) {
    return new Promise((resolve, reject) => {
        test(arg, (err, arg) => {
            if (err) {
                reject(err);
            } else {
                resolve(arg);
            }
        });
    });
}

const main = async function () {
    try {
        const arg = {};
        const a = await testAsync(arg);
        console.log(a)
    } catch (error) {
        console.error(error);
    }
}

main()
```
### 算法题：括号匹配 leetcode 20 

[算法题：括号匹配 leetcode 20](/backend/node/leetcode-js/#_20-有效的括号)

[算法题：搜索旋转排序数组 leetcode 33](/backend/nodeß/leetcode-js/#_33-搜索旋转排序数组)

## NGA

### 什么是 控制反转 && 依赖注入？

依赖注入 (Dependency Injection) 和控制反转 (Inversion of Control, IoC) 是相关的设计模式，但它们有一些重要的区别。

控制反转是一种设计思想，它强调由一个中央控制器（通常是一个IoC容器）来管理对象之间的依赖关系，而不是由对象自己来管理这些关系。这样可以使得代码更加松耦合，并使得系统更易于扩展和维护。

依赖注入是一种设计模式，它允许一个对象在运行时获得所需的依赖对象。这样可以更加灵活地管理对象之间的关系，并使得代码更易于测试和维护。

```js
class Engine { }

class Car {
  constructor(engine) {
    this.engine = engine;
  }
}

const engine = new Engine();
const car = new Car(engine);
```

> 所以可以说依赖注入是一种具体的实现方式，而控制反转是一种设计思想，控制反转被用来实现依赖注入。

> 实现方式：构造函数注入，属性注入，setter注入
```js
class Engine { }

class Car {
  constructor() {
    this.engine = null;
  }
}

const container = new Map(); // IOC容器注入
container.set("Engine", Engine);
container.set("Car", Car);

const car = container.get("Car");
car.engine = container.get("Engine");
```
### 多实例情况下，怎么通过redis防止定时任务多次执行？

> 在多实例情况下，可以使用 Redis 分布式锁来防止定时任务多次执行。

1.在执行定时任务之前，使用 Redis 的 SETNX 命令尝试获取锁。如果获取成功，说明该实例获得了锁，可以执行定时任务。

2.在执行完定时任务之后，使用 Redis 的 DEL 命令释放锁。

3.如果获取锁失败，说明其他实例已经获得了锁，该实例应该等待其他实例释放锁。

代码示例：

```js
const Redis = require("ioredis");
const redis = new Redis();

const taskName = "myTask";
const lockTTL = 60; // lock expires in 60 seconds

async function runTask() {
  // try to acquire lock
  const lockAcquired = await redis.setnx(taskName, 1);
  if (!lockAcquired) {
    console.log("Task already running, exiting...");
    return;
  }
  
  // set lock expiration
  await redis.expire(taskName, lockTTL);
  
  try {
    // perform task
    console.log("Running task...");
    // ...
  } finally {
    // release lock
    await redis.del(taskName);
  }
}
```

> 这样可以确保一次只有一个实例在执行定时任务，避免了多次执行的问题。

> 需要注意的是使用 Redis 分布式锁时，要尽量避免死锁的情况，如果锁被占用过长可以在超时时间后自动释放锁或者人工释放。

---

## ShuRui

### 1. Node 和 Ajax 有什么区别？

> Node.js 和 Ajax 是两个不同的概念。

- Node.js 是一个基于 JavaScript 的运行时环境，用于在服务器端运行 JavaScript 代码。它使得开发者能够使用 JavaScript 编写服务器端应用程序，并提供了一系列的内置模块和扩展库，用于简化服务器端应用程序的开发。

- Ajax 是一种基于 JavaScript 和 XML（或 JSON）的技术，用于实现客户端和服务器端之间的异步通信。Ajax 可以在不刷新整个页面的情况下更新部分页面内容，从而提高了网站的响应速度和用户体验。Ajax 主要是在客户端使用的技术，通过浏览器内置的 **XMLHttpRequest** 对象来实现与服务器端的异步通信。

> 因此，Node.js 和 Ajax 是两个不同的概念。Node.js 主要是用于在服务器端运行 JavaScript 代码，而 Ajax 主要是用于在客户端和服务器端之间进行异步通信。

### 2. Node Stream 是什么？有哪些种类的Stream？

> 在Node.js中，Stream是一种用于**处理流数据的抽象接口**。它提供了一种处理大量数据的方式，以及对数据进行流式传输和处理的能力。Stream可以通过**读取、写入、转换、过滤**等方式来处理数据，而不需要一次性加载全部数据到内存中。这使得处理大文件或大量数据变得更加高效和可行。Node.js中的Stream有四种类型：

1. Readable Stream：用于读取数据的Stream，例如从文件、网络等源读取数据。

2. Writable Stream：用于写入数据的Stream，例如将数据写入文件、发送数据到网络等。

3. Duplex Stream：可同时读取和写入数据的Stream，例如网络套接字等。

4. Transform Stream：是一种特殊的Duplex Stream，用于处理和转换数据流。例如，可以使用Transform Stream将文件内容进行加密或解密，或将CSV数据转换为JSON格式。

### 3. fs.readFile() 和 fs.createReadStream() 有什么区别？

| 区别     | fs.readFile()          | fs.createReadStream()                    |
| -------- | ---------------------- | ---------------------------------------- |
| 读取到   | 全部读取到内存         | 分成一系列小块（缓冲区），逐块读取和处理 |
| 适用于   | 较小的文件或数据       | 大型文件或数据集                         |
| callback | 作为回调函数的参数返回 | 通过监听完成读取操作                     |

---

# MiaoDian 

### 1. node 语言的劣势

1. 单线程：Node.js采用**单线程**的事件驱动模型，这意味着它只能处理一个请求或事件的同时。这在处理计算密集型任务或长时间运行的操作时可能导致性能问题

::: warning
尽管Node.js通过异步非阻塞的方式来处理I/O操作，但如果应用程序需要进行大量的计算，会阻塞整个应用程序的执行。
::: 

2. 内存占用：Node.js在处理大规模并发请求时可能会**占用较多的内存**。每个请求都需要一定的内存分配，因此当同时处理大量请求时，Node.js应用程序的内存消耗会增加。这对于内存有限的服务器来说可能是一个问题。

::: tip
需要注意的是，尽管Node.js有这些劣势，它在处理**高并发**、**I/O密集型任务**和**构建实时应用**等方面仍然表现出色。选择使用Node.js还是其他后端语言，取决于具体的应用需求和团队的技术栈。
:::

### 2. mongodb的劣势

1. 高存储空间需求：相比于传统的关系型数据库，MongoDB在存储数据时通常**需要更多的磁盘空间**。

> 这是因为MongoDB使用了一些额外的数据结构和索引来提供高效的查询和灵活的数据模型。

2. 缺乏事务支持：MongoDB在早期版本中缺乏原生的多文档事务支持，尽管在后续版本中引入了一些事务功能，但相对于传统的关系型数据库，它的事务支持还不够成熟和强大。这可能对某些需要严格事务处理的应用场景造成限制。

::: tip
Mongodb 4.0 之后支持事务
:::

3. 不适合复杂的关系型查询：MongoDB是一种文档数据库，其设计目标主要是为了支持灵活的数据模型和大规模的水平扩展。然而，对于需要执行复杂的关系型查询（例如多表连接、聚合等）的应用，MongoDB的查询能力相对较弱。在这种情况下，传统的关系型数据库可能更适合。

4. 较小的社区和生态系统：相对于一些传统的关系型数据库，MongoDB的社区和生态系统相对较小。这可能意味着在解决问题、找到支持和寻找第三方工具时，可能需要付出更多的努力。

### 3. Mysql 查询学生三门科目总分最高的 前三名

1. 学生和成绩分表
  
```sql
CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(50)
);

CREATE TABLE scores (
  student_id INT,
  subject VARCHAR(50),
  score INT
);
```

```sql
select name,sum(score) as total
from students
join scores on scores.student_id = students.id
GROUP BY name
ORDER BY total desc
limit 3
```

---

2. 学生和成绩合表

```sql
CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  subject1_score INT,
  subject2_score INT,
  subject3_score INT
);
```

```sql
select name,(subject1_score + subject2_score + subject3_score) as total
from student
ORDER BY total desc
limit 3
```

# 心悦互娱

### 1. 如何使用nodejs读取一个本地文件？


> **fs.readFile** 是一个异步方法，它接受一个回调函数作为参数，当文件读取完成时，回调函数会被调用。这种方式适合在非阻塞的情况下执行文件读取操作，不会阻止后续代码的执行。

> **fs.readFileSync** 是一个同步方法，它会阻塞当前线程，直到文件读取完成。这意味着在文件读取完成之前，程序无法执行其他操作。因此，通常不建议在主线程中使用同步方法，特别是在服务器端应用中，因为它可能导致性能问题和阻塞。

> **fs.promises.readFile** 是一个异步 Promise 方法，它返回一个 Promise 对象，允许您使用 async/await 或 Promise 链式调用来处理文件读取操作。这种方式在异步编程中更加方便和可读，不会阻塞主线程。

### 3. 如何做到创建nodejs集群并做到不中断重启？

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
    http.createServer((req, res) => {
        res.writeHead(200);
        res.end('Hello, World!');
    }).listen(8000);

    console.log(`子进程 ${process.pid} 正在运行`);
}
```

### 4. nodejs集群的优势和限制

#### 优势

1. 高可扩展性：Node.js集群允许在多个进程中并行处理请求，从而提高系统的整体处理能力和吞吐量。每个子进程都可以独立地处理请求，而不会阻塞其他进程。

2. 高可用性：当一个子进程崩溃或发生异常时，主进程可以检测到并重新启动新的子进程，从而确保应用程序的可用性和稳定性。这种机制可以最大程度地减少因为单个进程故障导致整个应用程序崩溃的风险。
  
3. 负载均衡：Node.js集群可以通过将请求分发给不同的子进程来实现负载均衡，确保请求在多个进程之间均匀分布。这样可以充分利用系统资源，提高系统的并发处理能力。

4. 多核利用：Node.js集群可以充分利用多核处理器的优势，每个子进程可以运行在不同的CPU核心上，提高系统的性能和响应能力。

#### 限制

1. 共享状态管理：Node.js集群中的子进程是相互独立的，它们之间无法直接共享内存或状态。如果应用程序依赖于共享状态管理，需要使用其他的机制来实现状态共享，例如使用共享数据库或消息队列等。

2. 内存消耗：每个子进程都会占用一定的内存资源，因此在创建多个子进程时需要考虑内存消耗的增加。如果服务器资源有限，过多的子进程可能会导致内存不足或交换内存频繁，影响性能。

3. 进程间通信：在Node.js集群中，子进程之间的通信需要通过进程间通信（IPC）机制来实现，例如使用消息队列或共享内存。这可能增加一些开发和管理的复杂性。

4. 上下文切换开销：在多个子进程之间切换上下文会带来一些开销，尤其是在大量的请求并发时。因此，在设计和配置Node.js集群时需要平衡并发能力和上下文切换开销。

> 综上所述，Node.js集群在高并发、高可扩展性和高可靠性方面具有优势，但在共享状态管理、内存消耗和进程间通信等方面存在一些限制，需要综合考虑和权衡来选择适合的方案。

### 5. mongo 扣减库存时如何保证原子一致性？

> 这里使用mongoose的版本

```js
const session = await mongoose.startSession();
session.startTransaction();

try {
  // 在 session 中执行操作
  await InventoryModel.updateOne(
    { _id: productId, quantity: { $gte: quantity } },
    { $inc: { quantity: -quantity } },
    { session }
  );

  await RecordModel.create(
    {
      productId: productId,
      quantity: -quantity,
      timestamp: new Date()
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
  $or: [
    { age: { $gt: 30 } },
    { age: { $lte: 10 } }
  ]
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
      $or: [
        { age: { $gt: 30 } },
        { age: { $lte: 10 } }
      ]
    }
  },
  { $sort: { age: -1 } },
  { $skip: 100 },
  { $limit: 50 },
  { $project: { name: 1, age: 1 } }
];

await User.aggregate(oprs);
```

### 7. 如何使用redis实现简单的消息队列？

> 要使用 Redis 实现简单的消息队列，你可以借助 Redis 的列表数据结构来实现。

> 以下是一个基本的示例，展示如何使用 Redis 来创建一个简单的消息队列：


```js
const Redis = require('ioredis');
const client = new Redis(6379, "127.0.0.1");

async function send(msg){
    const cur = await client.llen('test_queue');
    console.log(cur); // 设置消息队列上限为5

    if(cur > 5){
        console.error('size more than 5');
        return;
    }
    await client.lpush('test_queue',msg);
}

async function poll(){
    try{
        const message = await client.rpop('test_queue');
        if(message){
            console.debug(message);
        }
    } catch (err){
        console.error(err);
    }

    process.nextTick(poll);
}


poll();

async function main(){
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
for (const item of array) {  console.log(item);}
```

3. forEach 方法：
   
```javascript 
const array = [1, 2, 3, 4, 5];
array.forEach(item => {  console.log(item);});
```

4. map 方法：返回一个新的数组，其中包含对原始数组每个元素进行处理后的结果。
```javascript
const array = [1, 2, 3, 4, 5];
const newArray1 = array.map(item => item * 2);
console.log(newArray);
```

5. filter 方法：返回一个新的数组，其中包含满足特定条件的原始数组元素。
```javascript
const array = [1, 2, 3, 4, 5];
const newArray2 = array.filter(item => item > 2);
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
asyncRequest1((err,res) => {
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
Promise.all([asyncRequest1(), asyncRequest2(), asyncRequest3()])
  .then(results => {
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

### 16.简述负责项目中的跨服设计和存储设计

```js
当涉及到具体的跨服设计和存储设计时，以下是一些常见的实践和技术：

跨服设计：

通信协议和接口：使用标准的网络协议（如HTTP、WebSocket）或自定义协议进行服务器之间的通信，通过定义清晰的接口规范来实现跨服务器通信和数据交换。
负载均衡和路由：使用负载均衡器（如Nginx、HAProxy）将请求分发到多个服务器节点，根据负载情况和健康状况来动态调整流量分配。
数据同步和共享：使用分布式缓存（如Redis）或消息队列（如Kafka、RabbitMQ）来实现数据的同步和共享，确保数据在不同服务器之间的一致性。
异常处理和故障转移：实施监控和自动化运维策略，当服务器发生故障或异常时，自动进行故障转移和恢复操作，确保系统的高可用性。
存储设计：

数据库选择：根据项目需求选择适当的数据库类型。例如，关系型数据库（如MySQL、PostgreSQL）适合处理复杂的数据关系，文档数据库（如MongoDB）适合存储灵活的非结构化数据。
数据库模式设计：根据项目的数据结构和查询需求，设计合理的数据库模式。包括表结构、索引设计、关系定义和数据分片等，以提高查询性能和数据访问效率。
数据缓存和缓存策略：使用缓存技术（如Redis、Memcached）缓存常用的数据，以减少数据库查询和提高响应速度。选择合适的缓存策略，如过期时间、LRU（最近最少使用）等。
数据备份和恢复：定期进行数据备份，并制定合适的备份策略（如全量备份、增量备份），以防止数据丢失，并能够快速恢复数据。
数据安全和权限控制：实施严格的数据安全措施，包括数据加密、访问控制、身份验证和授权等，以保护数据的机密性和完整性。
这些是跨服设计和存储设计的一些常见实践和技术，具体的实现方式和工具选择会根据项目的需求、规模和技术栈而有所差异。建议在实施具体设计时结合实际情况，进行合理的架构和技术选择。
```

### 17.现有 1000 个苹果，10 个盒子，问各个盒子内应该分别放入多少个苹果，才能使得用户要买任意1 至 1000 之间的一个苹果数，都可以给他 

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

### 1. 不能使用 await 的情况下，如何保证串行

> 在不能使用await的情况下，你可以使用回调函数、Promise 链、或者 Generator 函数来保证异步操作的串行执行。这些方法可以帮助你在不阻塞主线程的情况下按顺序执行异步任务。

使用回调函数：
```js
function task1(callback) {
    // 异步任务1
    setTimeout(() => {
        console.log("Task 1 complete");
        callback();
    }, 1000);
}

function task2(callback) {
    // 异步任务2
    setTimeout(() => {
        console.log("Task 2 complete");
        callback();
    }, 2000);
}

task1(() => {
    task2(() => {
        // 所有任务完成
        console.log("All tasks complete");
    });
});

```

使用Promise链：
```javascript
function task1() {
    return new Promise((resolve) => {
        // 异步任务1
        setTimeout(() => {
            console.log("Task 1 complete");
            resolve();
        }, 1000);
    });
}

function task2() {
    return new Promise((resolve) => {
        // 异步任务2
        setTimeout(() => {
            console.log("Task 2 complete");
            resolve();
        }, 2000);
    });
}

task1()
    .then(() => task2())
    .then(() => {
        // 所有任务完成
        console.log("All tasks complete");
    });

```

使用Generator函数：

```javascript

function* main() {
    yield task1();
    yield task2();
    // 所有任务完成
    console.log("All tasks complete");
}

function task1() {
    return new Promise((resolve) => {
        // 异步任务1
        setTimeout(() => {
            console.log("Task 1 complete");
            resolve();
        }, 1000);
    });
}

function task2() {
    return new Promise((resolve) => {
        // 异步任务2
        setTimeout(() => {
            console.log("Task 2 complete");
            resolve();
        }, 2000);
    });
}

const iterator = main();

function run(iterator) {
    const { value, done } = iterator.next();
    if (!done) {
        value.then(() => run(iterator));
    }
}

run(iterator);
```
::: tip
这些方法中，回调函数是最基本的方式，但容易导致回调地狱。Promise 链更清晰一些，并且支持更好的错误处理。Generator 函数允许你使用同步的代码结构来编写异步任务。你可以根据具体的需求选择合适的方法来保证异步任务的串行执行。
::: 


### 2. node 设置使用内存大小

> 默认为4GB，不同机器可能有不同

```bash
node --max-old-space-size=2048 your-app.js
```

### 3. 如何预防XSS攻击？

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

4. HTTP Only 和 Secure Cookies：
使用 HttpOnly 标志来设置 cookie，以防止 JavaScript 访问 cookie 数据。
在需要安全连接的情况下，设置 Secure 标志来确保 cookie 只通过 HTTPS 连接传输。

```js
// 服务器端代码（Node.js示例）
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

app.get('/set-cookie', (req, res) => {
  // 在服务器端设置一个 HTTP Only 的 cookie
  res.cookie('myCookie', 'cookieValue', { httpOnly: true });
  res.send('HTTP Only cookie set.');
});
```
  
### 4. http和https的区别？证书认证过程？pki？

|          | http | https |
| -------- | ---- | ----- |
| 传输协议 | 明文 | 加密  |
| 默认端口 | 80   | 443   |
| 证书     | 无   | 有    |

HTTPS证书认证过程:

1. 服务器端证书生成:
服务器管理员生成一个证书请求（CSR），其中包含服务器的公钥。
证书请求被发送到受信任的证书颁发机构（CA）。

1. 证书颁发机构认证:
CA 验证证书请求的合法性，并验证服务器所有者的身份。
CA 签发包含服务器公钥的数字证书，并使用 CA 的私钥进行签名。

1. 服务器配置证书:
服务器收到 CA 签发的证书后，将其配置到服务器上。

1. 客户端验证:
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

> 在 Node.js 中，主进程和子进程之间不共享内存。主进程和子进程是独立的进程，它们拥有自己的独立内存空间。这是操作系统级别的分离。

当你在 Node.js 中创建子进程时，每个子进程都有自己的 JavaScript 执行环境和内存空间。这意味着主进程和子进程之间不能直接共享变量或数据，除非你明确地使用进程间通信（Inter-Process Communication，IPC）机制来实现数据传递，例如使用 `child_process` 模块的 `send()` 和 `on('message')` 方法。

### ZStack

[Node.js 事件循环机制](/backend/node/node/#%E2%AD%90%EF%B8%8F-%E2%AD%90%EF%B8%8F-7-node-js-%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6)