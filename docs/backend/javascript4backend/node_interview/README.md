---
title: Node.js Backend Developer
date: 2023-5-29
categories:
  - Backend
tags:
  - node
  - interview
sidebar: "auto"
publish: true
---

## StoreHub

### 3-minutes self-introduction in English

### Graphql

[Introduction to GraphQL](https://graphql.org/learn)

- What’s the difference between queries and mutations? 
    - 查询用于获取数据。它们用于查询特定资源或资源列表，并以结构化的方式返回查询结果。查询是安全的，因为它们不会更改服务器端的数据。
    - 相比之下，变更用于更改数据。它们通常用于创建、更新或删除资源。变更需要被特别许可，因为它们会更改服务器端的数据。

``` graphql
// This is a query
query {
  user(id: 1) {
    name
    email
  }
}

// This is a mutation
mutation {
  createUser(name: "John Doe", email: "johndoe@example.com") {
    id
    name
    email
  }
}
```
- What’s the meaning of ID(uppercase) with exclamation mark in a graphQL schema?

- 在GraphQL模式中，ID（大写）后面的感叹号表示该字段是必需的。

- 例如，如果定义了一个名为User的对象类型，其中包含一个名为id的字段，并且在字段后面添加了感叹号，那么这个字段就是必需的：

``` graphql
type User {
  id: ID!
  name: String
  email: String
}
```
在这个例子中，id字段是必需的，而name和email字段是可选的。这意味着在查询User对象时，必须提供id字段的值，但可以选择性地提供name和email字段的值。

总之，在GraphQL模式中，ID（大写）后面的感叹号表示字段是必需的。
### GRPC

[Documentation](https://grpc.io/docs/)

- What does gRPC use for defining the data structures of its services and messages?    
    - gRPC使用Protocol Buffers来定义其服务和消息的数据结构。Protocol Buffers是一种结构化数据序列化技术，可以让您定义消息类型和服务接口，并使用这些定义来生成特定语言的代码。

- How can we define a field representing a date in gRPC messages?                                   
    - gRPC 使用 Protocol Buffers 来定义消息结构。在 Protocol Buffers 中，你可以使用 google.protobuf.Timestamp 类型来定义表示日期的字段。使用这种方法，你可以在定义你的 gRPC 服务时在消息中定义一个表示日期的字段。

```graphql
syntax = "proto3";

import "google/protobuf/timestamp.proto";

message Event {
  // The date and time when the event occurred.
  google.protobuf.Timestamp date_time = 1;

  // Other fields defining the event.
  // ...
}
```

- What is a method stub?

  - 在 gRPC 中，方法存根（method stub）是客户端库提供的一个抽象接口，它允许客户端应用程序调用远程服务器上的方法。存根对象包含了方法的名称、参数类型和返回类型的信息，并且可以用来向服务器发送请求并接收响应。

  - 在 gRPC 中，方法存根是通过 Protocol Buffers 生成的。对于每一个服务，都有一个特定的 .proto 文件，定义了服务的方法及其参数和返回类型。当客户端库与服务端库被构建时，Protocol Buffers 编译器会使用 .proto 文件来生成方法存根。

> 举个例子，假设你有一个叫做 "GreetingService" 的 gRPC 服务，其中包含一个名为 "Greet" 的方法，接受一个名为 "Greeting" 的请求并返回一个名为 "Response" 的响应。你的 .proto 文件可能长这样：

```protobuf
service GreetingService {
  rpc Greet(Greeting) returns (Response) {}
}

message Greeting {
  string first_name = 1;
  string last_name = 2;
}

message Response {
  string greeting = 1;
}
```

- 当 Protocol Buffers 编译器处理这个文件时，它会为 "GreetingService" 生成一个方法存根，其中包含 "Greet" 方法的信息。客户端应用程序可以使用这个存根来调用 "Greet" 方法

### 什么是微服务？使用微服务的优势/缺点有哪些？

> 微服务是一种软件架构风格，它将一个应用程序拆分成许多独立的服务，每个服务都是一个独立的进程，且与其他服务通信。这种架构风格的目的是让应用程序更容易开发、部署、维护和扩展。

- 使用微服务的优势包括：
    - 更容易开发和维护：将应用程序拆分为许多小型服务可以让开发人员更容易地理解和修改代码。
    - 更容易部署：因为每个服务都是独立的，所以可以独立部署。这使得可以更快地更新应用程序，并且可以轻松进行 A/B 测试。
    - 更容易扩展：微服务架构使得可以更轻松地扩展应用程序的某些部分，而不会影响到整个应用程序。
    - 更容易处理不同技术栈：在微服务架构中，每个服务可以使用不同的语言、框架和数据存储技术。

### SQL

- Mysql & MongoDB & Redis 介绍，分别在哪些场景下发挥优势？
MySQL、MongoDB 和 Redis 都是常用的数据库系统，它们在不同的应用场景下发挥优势。

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
SELECT name,action,createdTime,modifiedTime from Log WHERE createdTime BETWEEN '2022-04-01' and '2022-04-30' GROUP BY name,action,createdTime,modifiedTime;
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

[算法题：括号匹配 leetcode 20](/leetcode-js/#_20-有效的括号)

[算法题：搜索旋转排序数组 leetcode 33](http://localhost:8082/leetcode-js/#_33-搜索旋转排序数组)

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

### Node Stream 是什么？有哪些种类的Stream？

> 在Node.js中，Stream是一种用于**处理流数据的抽象接口**。它提供了一种处理大量数据的方式，以及对数据进行流式传输和处理的能力。Stream可以通过**读取、写入、转换、过滤**等方式来处理数据，而不需要一次性加载全部数据到内存中。这使得处理大文件或大量数据变得更加高效和可行。Node.js中的Stream有四种类型：

1. Readable Stream：用于读取数据的Stream，例如从文件、网络等源读取数据。

2. Writable Stream：用于写入数据的Stream，例如将数据写入文件、发送数据到网络等。

3. Duplex Stream：可同时读取和写入数据的Stream，例如网络套接字等。

4. Transform Stream：是一种特殊的Duplex Stream，用于处理和转换数据流。例如，可以使用Transform Stream将文件内容进行加密或解密，或将CSV数据转换为JSON格式。

### fs.readFile() 和 fs.readFileStream() 有什么区别？

| 区别     | fs.readFile()          | fs.createReadStream()                    |
| -------- | ---------------------- | ---------------------------------------- |
| 读取到   | 全部读取到内存         | 分成一系列小块（缓冲区），逐块读取和处理 |
| 适用于   | 较小的文件或数据       | 大型文件或数据集                         |
| callback | 作为回调函数的参数返回 | 通过监听完成读取操作                     |

---

# MiaoDian 

### node 语言的劣势

1. 单线程：Node.js采用**单线程**的事件驱动模型，这意味着它只能处理一个请求或事件的同时。这在处理计算密集型任务或长时间运行的操作时可能导致性能问题

::: warning
尽管Node.js通过异步非阻塞的方式来处理I/O操作，但如果应用程序需要进行大量的计算，会阻塞整个应用程序的执行。
::: 

2. 内存占用：Node.js在处理大规模并发请求时可能会**占用较多的内存**。每个请求都需要一定的内存分配，因此当同时处理大量请求时，Node.js应用程序的内存消耗会增加。这对于内存有限的服务器来说可能是一个问题。

3. 回调地狱：Node.js采用回调函数来处理异步操作，这可能导致嵌套的回调函数，也被称为"回调地狱"。当处理复杂的异步操作时，代码的可读性和可维护性可能会变差。为了解决这个问题，可以使用Promise、Async/Await等方式来处理异步操作。

4. 缺乏成熟的库和工具：相对于其他后端语言，Node.js的生态系统可能相对较年轻，一些领域的库和工具可能还不如其他语言丰富和成熟。尽管Node.js拥有许多优秀的库和框架，但在某些特定的应用场景中，你可能需要额外的努力来找到适合的解决方案。

::: tip
需要注意的是，尽管Node.js有这些劣势，它在处理**高并发**、**I/O密集型任务**和**构建实时应用**等方面仍然表现出色。选择使用Node.js还是其他后端语言，取决于具体的应用需求和团队的技术栈。
:::

### mongodb的劣势

1. 高存储空间需求：相比于传统的关系型数据库，MongoDB在存储数据时通常**需要更多的磁盘空间**。

> 这是因为MongoDB使用了一些额外的数据结构和索引来提供高效的查询和灵活的数据模型。

2. 缺乏事务支持：MongoDB在早期版本中缺乏原生的多文档事务支持，尽管在后续版本中引入了一些事务功能，但相对于传统的关系型数据库，它的事务支持还不够成熟和强大。这可能对某些需要严格事务处理的应用场景造成限制。

::: tip
Mongodb 4.0 之后支持事务
:::

3. 不适合复杂的关系型查询：MongoDB是一种文档数据库，其设计目标主要是为了支持灵活的数据模型和大规模的水平扩展。然而，对于需要执行复杂的关系型查询（例如多表连接、聚合等）的应用，MongoDB的查询能力相对较弱。在这种情况下，传统的关系型数据库可能更适合。

4. 较小的社区和生态系统：相对于一些传统的关系型数据库，MongoDB的社区和生态系统相对较小。这可能意味着在解决问题、找到支持和寻找第三方工具时，可能需要付出更多的努力。

### Mysql 查询学生三门科目总分最高的 前三名

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