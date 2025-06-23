---
title: Node 常用框架相关
date: 2025-6-21
categories:
  - Backend
tags:
  - node
sidebar: "auto"
publish: true
---

## Node 常用框架简介

### Express

> 元老级框架，是Node.JS 诞生之初，用于 基于Node.js以及Chrome V8引擎，快速、极简的JS服务端开发

[Express](https://www.expressjs.com.cn/)

--- 

### Nest.js

> 有规范的框架,部分功能基于Express

> 完全支持TS并整合其他功能(GraphQl、WebSocket)

> 堪称node中的Spring，深度使用注解特性,配合TYPEORM可以在node下拥有不输SPRING的面向切面编程的体验～

[Nest.js](https://nestjs.com/)

### Nest 守卫、拦截器、中间件 的区别

| 特性                   | 中间件(Middleware)                             | 守卫(Guard)                               | 拦截器(Interceptor)                        |
| ---------------------- | ---------------------------------------------- | ----------------------------------------- | ------------------------------------------ |
| **主要用途**           | 请求预处理（日志、CORS、请求验证等）           | 权限控制和访问验证（角色验证、JWT验证等） | 响应转换、异常处理、额外业务逻辑           |
| **执行顺序**           | 最先执行                                       | 中间件之后，拦截器之前                    | 守卫之后，路由处理器前后                   |
| **访问上下文**         | 只能访问Request/Response对象                   | 可以获取ExecutionContext                  | 可以获取ExecutionContext                   |
| **修改请求**           | 可以                                           | 不可以                                    | 可以                                       |
| **修改响应**           | 可以                                           | 不可以                                    | 可以                                       |
| **终止请求**           | 可以（通过不调用next()）                       | 可以（返回false时）                       | 不可以                                     |
| **异步支持**           | 有限支持                                       | 完全支持（Promise/Observable）            | 完全支持（RxJS操作）                       |
| **典型应用场景**       | - 请求日志记录<br>- 设置HTTP头<br>- 请求体解析 | - 角色验证<br>- 权限检查<br>- 访问控制    | - 统一响应格式<br>- 异常映射<br>- 缓存处理 |
| **全局注册方式**       | `MiddlewareConsumer`的`configure`方法          | `APP_GUARD`提供者                         | `APP_INTERCEPTOR`提供者                    |
| **局部注册方式**       | 模块的`configure`方法中指定路由                | `@UseGuards()`装饰器                      | `@UseInterceptors()`装饰器                 |
| **能否获取处理器信息** | 否                                             | 是（通过ExecutionContext）                | 是（通过ExecutionContext）                 |
| **修改响应时机**       | 路由处理器执行前                               | 路由处理器执行前                          | 路由处理器执行前后均可                     |


### req/res 与 ExecutionContext 的核心区别

| 特性                | `req` / `res` 对象                          | `ExecutionContext` (执行上下文)               |
|---------------------|--------------------------------------------|---------------------------------------------|
| **来源**            | 底层框架（如 Express/Fastify）的原始对象      | NestJS 抽象层提供的上下文包装器                |
| **访问方式**        | 直接操作（如 `req.headers`）                 | 通过方法链获取（如 `context.switchToHttp().getRequest()`） |
| **功能范围**        | 仅限 HTTP 请求/响应的原始操作                | 包含路由、控制器、处理器等元信息               |
| **协议支持**        | 仅支持当前协议（如 HTTP）                   | 支持 HTTP/WebSocket/RPC 等多协议统一接口       |
| **元数据访问**      | 无法访问 NestJS 装饰器元数据                 | 可读取装饰器元数据（如 `@Roles()`）            |
| **控制器关联性**    | 无关联                                      | 可获取当前控制器类和方法（`getClass()`/`getHandler()`） |
| **依赖注入**        | 无法使用 DI 容器                            | 可通过 `getModuleRef()` 动态解析依赖           |
| **推荐使用场景**    | - 简单请求/响应操作<br>- 快速原型开发        | - 需要路由信息<br>- 多协议支持<br>- 权限控制等复杂逻辑 |


---

### Koa

> 相当轻量，用法类似Express，简单上手

> 需要自行去官方的 Middleware 寻找（koa-router,bodyParser,logger...），搭配千奇百怪，总有一款适合你

> koa常常与express一起比较，都是偏底层的无态度的Web框架

[Koa](https://koajs.com/)

---

### Egg.js

> 源于阿里,约定优于配置,整合了大量Koa的功能并封装

> 支持Ts，类似Koa的洋葱圈模型的开发方式，和AOP编程还是有点区别的

> 企业级规范很多，但各方面能力极强，定位是框架的框架

[Egg.js](https://eggjs.github.io/zh/)

--- 

### Midway.js 

> 源于阿里,感觉对标 Nest.js，深度使用注解特性

> Midway 基于 TypeScript 开发，结合了面向对象（OOP + Class + IoC）与函数式（FP + Function + Hooks）两种编程范式，并在此之上支持了 Web / 全栈 / 微服务 / RPC / Socket / Serverless 等多种场景，致力于为用户提供简单、易用、可靠的 Node.js 服务端研发体验。

> 虽然社区已经有 nest 这样的框架，但是这些产品的维护、协作、修改都会受到商业化产品的制约，也无法做到需求的快速迭代和安全性保障，整体的研发理念也和我们不同，为此，我们需要有一套自研的框架体系

[Midway.js](https://midwayjs.org/docs/intro)



