---
title: FuXun And Zhuoshe Interview Notes
sidebar: auto
date: 2026-3-3
categories:
  - Backend
tags:
  - interview
publish: true
---

## FuXun And Zhuoshe

## Sticky

[什么是 nodejs?(事件驱动、非阻塞 I/O)](/backend/node/node/#_0-什么是-nodejs)

[nodejs 事件循环机制(timers >> I/O callback >> idle,prepare >> poll >> check >> close callback)](/backend/node/node/#_7-node-js-事件循环机制)

[浏览器和 Node 中 事件循环区别 (浏览器:每次循环处理一个宏任务后清空微任务队列)](/backend/node/node/#_3-浏览器和-node-中-事件循环有什么区别)

## Nodejs 后端

#### Events

[Node 中的 EventEmitter 是什么(观察者模式)](/backend/node/node/#_8-node-中的-eventemmiter-是什么)

- prependListener 头部添加(unshift)，on、once、addListener 尾部添加(push)

[实现一个 EventEmitter(创建一个类，并维护一个obj[arr])](/backend/node/node/#实现一个-eventemitter)

---

#### Stream

[说说对 Node 中 Stream 的理解？(source、dest、pipe、单位是Buffer)](/backend/node/node/#_9-说说对-node-中-stream-的理解)

[Node Stream 是什么？有哪些种类的 Stream？（读、写、双工 Duplex、转换 Transform = zlib）](/backend/node/node/#_10-node-stream-是什么-有哪些种类的-stream)

### pipe 相比与 data 监听的好处

- 自动背压处理：当读取流比写入流还快时，自动暂停读取，避免内存爆炸

- 代码简洁：不用手动写 `on('data')` 和 `on('drain')`

- 错误处理：默认 pipe 返回目标流，可以链式调用

[什么是背压？highWaterMark有什么作用？](/backend/node/node/#_13-什么是背压-highwatermark有什么作用)

---

#### Net

[net 模块的作用是什么？(TCP/IP,Socket)](/backend/node/node/#_12-net-模块的作用是什么)

---

### Buffer

[什么是Buffer？为什么需要它？(继承自Uint8Array,用于二进制数据处理，创建后大小不可变)](/backend/node/node/#_14-什么是buffer-为什么需要它)

---

## Nest.js 框架

[Nestjs 数据初始化的时机 (OnApplicationBootstrap)](/backend/node/node_frame/#nestjs-数据初始化的时机)


[req/res 与 ExecutionContext 的核心区别(上下文可以获取Controller、路由、装饰器的元数据)](/backend/node/node_frame/#req-res-与-executioncontext-的核心区别)

[Nest 守卫、拦截器、中间件 的区别](/backend/node/node_frame/#nest-守卫、拦截器、中间件-的区别)

- 顺序：中间件 > 守卫 > 拦截器

- 中间件无法获取上下文，可以修改，用于数据预处理，通过 AppModule.config 注册
  
- 守卫器可以获取上下文，不可以修改，用于角色、权限的验证，@UseGuards 使用

- 拦截器可以获取上下文，可以修改，用于统一格式响应、异常映射、缓存处理，@UseInterceptors

---


### 数据库相关 Mongodb / Redis / Mysql / PostGreSql

#### MongoDB

[什么是 MongoDB？适合什么场景？(文档型数据库，适合非结构化数据、日志、内容管理)](/backend/mongodb/#_1-什么是-mongodb-适合什么场景)

[MongoDB 索引类型有哪些？(单字段、复合、多键、文本、地理空间、哈希索引)](/backend/mongodb/#_2-mongodb-索引类型有哪些-如何使用)

[MongoDB 的聚合管道是什么？($match、$group、$project 等阶段处理数据)](/backend/mongodb/#_3-mongodb-的聚合管道是什么)

---

#### Redis

[Redis 为什么快？(纯内存存储、单线程模型、IO 多路复用)](/backend/redis/#_1-redis-为什么快)

[Redis 数据类型有哪些？(String、Hash、List、Set、ZSet、Stream、Bitmap 等)](/backend/redis/#_2-redis-数据类型有哪些)

[什么是缓存穿透/击穿/雪崩？如何解决？](/backend/redis/#_3-什么是缓存穿透-击穿-雪崩-如何解决)

- 缓存穿透：查询不存在的数据 >> 布隆过滤器、缓存空值
- 缓存击穿：热点 key 过期 >> 互斥锁、热点数据永不过期
- 缓存雪崩：大量 key 同时过期 >> 过期时间加随机值、熔断降级

[Redis 持久化机制有哪些？(RDB 快照、AOF 日志、混合持久化)](/backend/redis/#_4-redis-持久化机制有哪些)

[Redis 的过期策略和内存淘汰算法？(定时删除、惰性删除 + LFU/LRU)](/backend/redis/#_5-redis-的过期策略和内存淘汰算法)

---

#### MySQL

[InnoDB 和 MyISAM 的区别？](/backend/mysql/#_1-innodb-和-myisam-的区别)

- InnoDB：支持事务、行锁、外键、崩溃恢复
- MyISAM：表锁、不支持事务、读性能好

[什么是索引？索引类型有哪些？(主键、唯一、普通、联合、全文索引)](/backend/mysql/#_2-什么是索引-索引类型有哪些)

[B+ 树索引的原理？为什么 MySQL 选 B+ 树？(层高低、范围查询快、磁盘 IO 少)](/backend/mysql/#_3-b-树索引的原理-为什么-mysql-选择-b-树)

[什么是事务？ACID 特性是什么？](/backend/mysql/#_4-什么是事务-acid-特性是什么)

- 原子性、一致性、隔离性、持久性

[事务隔离级别有哪些？(读未提交、读已提交、可重复读、串行化)](/backend/mysql/#_5-事务隔离级别有哪些)

[什么是 MVCC？(多版本并发控制，通过 undo log 实现读不加锁)](/backend/mysql/#_6-什么是-mvcc)

[MySQL 慢查询如何优化？(explain 分析、索引优化、避免 select *、分页优化)](/backend/mysql/#_7-mysql-慢查询如何优化)

---

#### PostgreSQL

[PostgreSQL 相比 MySQL 的优势？(更好的并发控制、支持 JSON和数组)](/backend/postgreSql/#_1-postgresql-相比-mysql-的优势)

[什么是 MVCC？PostgreSQL 如何实现？(通过元组中的 xmin/xmax 实现)](/backend/postgreSql/#_2-什么是-mvcc-postgresql-如何实现)

[PostgreSQL 索引类型有哪些？(B-tree、Hash、GiST、GIN、SP-GiST)](/backend/postgreSql/#_3-postgresql-索引类型有哪些)

---

## Graphql 基础

[GraphQL 核心概念（gql、Query Resolver、Mutation Resolver）](/graphql/#核心概念)

[GraphQL 和 REST 有什么区别(允许前端自由选择字段，避免over-fetch)](/graphql/#常见面试题)

### 其他

[什么是微服务？使用微服务的优势/缺点有哪些？](/architecture/#架构风格-数据交互-相关)

[k8s 基本概念、命令](https://k8s.easydoc.net/docs/dRiQjyTY/28366845/6GiNOzyZ/puf7fjYr)