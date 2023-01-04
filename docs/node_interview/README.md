---
title: Node.js Backend Developer 面试记录
date: 2022-12-3
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

- 在 gRPC 中，方法存根（method stub）是客户端应用程序用来调用远程方法的抽象接口。它使用特定的语言绑定（例如，Java、Python、Go 等）提供，并且是通过使用 gRPC 提供的代码生成工具来生成的。

``` graphql
// The request and response types for the service's method.
message RequestType {
  // The fields for the request message go here.
}

message ResponseType {
  // The fields for the response message go here.
}

// The gRPC service definition.
service MyService {
  // The method that the client can call.
  rpc MyMethod(RequestType) returns (ResponseType) {};
}

// The method stub implementation.
class MyServiceClient {
  public async Task<ResponseType> MyMethod(RequestType request) {
    // Code for calling the remote method goes here.
  }
}
```

在这个示例中，MyMethod 是 gRPC 服务中的方法，它接受一个 RequestType 类型的请求并返回一个 ResponseType 类型的响应。在 MyServiceClient 类中，MyMethod 方法存根的实现负责调用远程服务实现的 MyMethod 方法。

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

### 查找4月份的日志，去重

```sql 
Log
id, name, actions, createdTime, modifiedTime
```
#### mongodb: 纯aggregate没法实现，需要二次处理

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



