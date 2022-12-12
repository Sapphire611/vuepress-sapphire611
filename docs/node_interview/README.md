---
title: Node.js Backend Developer
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

- What’s the meaning of ID(uppercase) with exclamation mark in a graphQL schema?

### GRPC

[Documentation](https://grpc.io/docs/)

- What does gRPC use for defining the data structures of its services and messages?    

- How can we define a field represening a date in gRPC messages?                                   

- What is a method stub?

### 什么是微服务？使用微服务的优势/缺点有哪些？

#### 微服务架构是一种架构风格
> 它将一个复杂的应用拆分成多个独立自治的服务，服务与服务间通过**松耦合**的形式交互

- 开发简单、开发效率提高，一个服务可能就是专一的只干一件事。

- 微服务能够被小团队单独开发，这个小团队是2到5人的开发人员组成。
  
- 微服务是松耦合的,能使用不同的语言,易于CI/CD （Jenkins...

- 每个微服务都有自己的存储能力，可以有自己的数据库，也可以有统一数据库。

> 单体式（Monolithic）式架构的缺点

- Adapter通常以API的形式互相访问，耦合紧密导致难以维护；

- 需要采用相同的技术栈，难以快速应用新技术；

- 对系统的任何修改都必须整个系统一起重新部署/升级，运维成本高；

- 在系统负载增加时，难以进行水平扩展；

- 当系统中一处出现问题，会影响整个系统；

### SQL

- Mysql & MongoDB & Redis 介绍，分别在哪些场景下发挥优势？

| 数据库  | 类型           | 特征                                               |
| ------- | -------------- | -------------------------------------------------- |
| Mysql   | 关系型数据库   | 体积小、速度快，不支持热备份，不支持自定义数据类型 |
| Mongodb | 非关系型数据库 | 偏向于大数据量存储                                 |
| Redis   | 非关系型数据库 | 顺序写入，偏向于热数据的存储                       |

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



