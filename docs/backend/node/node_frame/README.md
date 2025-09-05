---
title: Node 常用框架相关
date: 2025-9-5
categories:
  - Backend
tags:
  - node
sidebar: 'auto'
publish: true
---

## Node 常用框架简介

### Nest.js

> 有规范的框架,部分功能基于 Express

> 完全支持 TS 并整合其他功能(GraphQl、WebSocket)

> 堪称 node 中的 Spring，深度使用注解特性,配合 TYPEORM 可以在 node 下拥有不输 SPRING 的面向切面编程的体验～

[Nest.js](https://nestjs.com/)

### Nest 守卫、拦截器、中间件 的区别

| 特性                   | 中间件(Middleware)                               | 守卫(Guard)                                | 拦截器(Interceptor)                        |
| ---------------------- | ------------------------------------------------ | ------------------------------------------ | ------------------------------------------ |
| **主要用途**           | 请求预处理（日志、CORS、请求验证等）             | 权限控制和访问验证（角色验证、JWT 验证等） | 响应转换、异常处理、额外业务逻辑           |
| **执行顺序**           | 最先执行                                         | 中间件之后，拦截器之前                     | 守卫之后，路由处理器前后                   |
| **访问上下文**         | 只能访问 Request/Response 对象                   | 可以获取 ExecutionContext                  | 可以获取 ExecutionContext                  |
| **修改请求**           | 可以                                             | 不可以                                     | 可以                                       |
| **修改响应**           | 可以                                             | 不可以                                     | 可以                                       |
| **终止请求**           | 可以（通过不调用 next()）                        | 可以（返回 false 时）                      | 不可以                                     |
| **异步支持**           | 有限支持                                         | 完全支持（Promise/Observable）             | 完全支持（RxJS 操作）                      |
| **典型应用场景**       | - 请求日志记录<br>- 设置 HTTP 头<br>- 请求体解析 | - 角色验证<br>- 权限检查<br>- 访问控制     | - 统一响应格式<br>- 异常映射<br>- 缓存处理 |
| **全局注册方式**       | `MiddlewareConsumer`的`configure`方法            | `APP_GUARD`提供者                          | `APP_INTERCEPTOR`提供者                    |
| **局部注册方式**       | 模块的`configure`方法中指定路由                  | `@UseGuards()`装饰器                       | `@UseInterceptors()`装饰器                 |
| **能否获取处理器信息** | 否                                               | 是（通过 ExecutionContext）                | 是（通过 ExecutionContext）                |
| **修改响应时机**       | 路由处理器执行前                                 | 路由处理器执行前                           | 路由处理器执行前后均可                     |

### req/res 与 ExecutionContext 的核心区别

| 特性             | `req` / `res` 对象                       | `ExecutionContext` (执行上下文)                            |
| ---------------- | ---------------------------------------- | ---------------------------------------------------------- |
| **来源**         | 底层框架（如 Express/Fastify）的原始对象 | NestJS 抽象层提供的上下文包装器                            |
| **访问方式**     | 直接操作（如 `req.headers`）             | 通过方法链获取（如 `context.switchToHttp().getRequest()`） |
| **功能范围**     | 仅限 HTTP 请求/响应的原始操作            | 包含路由、控制器、处理器等元信息                           |
| **协议支持**     | 仅支持当前协议（如 HTTP）                | 支持 HTTP/WebSocket/RPC 等多协议统一接口                   |
| **元数据访问**   | 无法访问 NestJS 装饰器元数据             | 可读取装饰器元数据（如 `@Roles()`）                        |
| **控制器关联性** | 无关联                                   | 可获取当前控制器类和方法（`getClass()`/`getHandler()`）    |
| **依赖注入**     | 无法使用 DI 容器                         | 可通过 `getModuleRef()` 动态解析依赖                       |
| **推荐使用场景** | - 简单请求/响应操作<br>- 快速原型开发    | - 需要路由信息<br>- 多协议支持<br>- 权限控制等复杂逻辑     |

### Nestjs ORM 的选型

| ORM       | 类型       | 语言/风格     | 数据模型定义方式   | 迁移支持 | 事务支持 | 关联关系 | 原生 SQL 支持 | 活跃度 | 特色功能                     |
| --------- | ---------- | ------------- | ------------------ | -------- | -------- | -------- | ------------- | ------ | ---------------------------- |
| TypeORM   | 传统 ORM   | TypeScript/JS | 装饰器 + 类        | ✅       | ✅       | ✅       | ✅            | 高     | 支持 ActiveRecord/DataMapper |
| Prisma    | 查询构建器 | TypeScript    | Prisma Schema 文件 | ✅       | ✅       | ✅       | ❌            | 高     | 类型安全、自动生成客户端     |
| Sequelize | 传统 ORM   | JavaScript    | 类/配置对象        | ✅       | ✅       | ✅       | ✅            | 中     | 多数据库支持、Promise 基础   |

### Nestjs 数据初始化的时机

> 在 Nest.js 中，数据初始化通常应该在应用程序启动的早期阶段进行

```ts
// 在 AppModule 或特定模块中使用 OnApplicationBootstrap 生命周期钩子：
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class DataInitializerService implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    await this.initializeData();
  }

  private async initializeData() {
    // 这里执行数据初始化逻辑
    console.log('Initializing application data...');
    // 检查并创建初始数据
  }
}
```

> 然后在模块中注册：

```ts
import { Module } from '@nestjs/common';

@Module({
  providers: [DataInitializerService],
})
export class AppModule {}
```

### Nestjs 全链路追踪方案

- 1. 核心文件结构

```text
src/
  └── common/
      ├── tracing.middleware.ts    # 追踪中间件
      ├── logger.service.ts        # 日志服务
      └── tracing.interceptor.ts   # 追踪拦截器
```

- 2. 追踪中间件 - 生成追踪 ID

```ts
// tracing.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TracingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // 生成或获取追踪ID
    const traceId = req.headers['x-trace-id']?.toString() || uuidv4();
    const spanId = uuidv4().substring(0, 8);

    // 存储到请求对象中
    req['traceId'] = traceId;
    req['spanId'] = spanId;

    // 设置响应头
    res.setHeader('x-trace-id', traceId);

    console.log(`[${traceId}] Request started: ${req.method} ${req.url}`);
    next();
  }
}
```

- 3. 日志服务 - 统一日志格式

```ts
// logger.service.ts
import { Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class LoggerService extends ConsoleLogger {
  private traceId: string = 'unknown';
  private spanId: string = 'unknown';

  setTraceContext(traceId: string, spanId: string) {
    this.traceId = traceId;
    this.spanId = spanId;
  }

  log(message: string, context?: string) {
    super.log(`[${this.traceId}] ${message}`, context);
  }

  error(message: string, trace?: string, context?: string) {
    super.error(`[${this.traceId}] ${message}`, trace, context);
  }
}
```

- 4. 追踪拦截器 - 记录请求耗时

```ts
// tracing.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // 设置追踪上下文
    if (request['traceId'] && request['spanId']) {
      this.logger.setTraceContext(request['traceId'], request['spanId']);
    }

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(`Request completed in ${duration}ms`);
      })
    );
  }
}
```

5. 模块配置

```ts
// app.module.ts
import { Module, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TracingMiddleware } from './common/tracing.middleware';
import { TracingInterceptor } from './common/tracing.interceptor';
import { LoggerService } from './common/logger.service';

@Module({
  providers: [
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TracingInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TracingMiddleware).forRoutes('*'); // 应用到所有路由
  }
}
```

> 使用 demo

```ts
// app.controller.ts
import { Controller, Get, Inject } from '@nestjs/common';
import { LoggerService } from './common/logger.service';

@Controller()
export class AppController {
  constructor(@Inject(LoggerService) private readonly logger: LoggerService) {}

  @Get()
  getHello(): string {
    this.logger.log('处理请求中...');
    // 业务逻辑
    this.logger.log('请求处理完成');
    return 'Hello World!';
  }
}
```

---

### Express

> 元老级框架，是 Node.JS 诞生之初，用于 基于 Node.js 以及 Chrome V8 引擎，快速、极简的 JS 服务端开发

[Express](https://www.expressjs.com.cn/)

---

### Koa

> 相当轻量，用法类似 Express，简单上手

> 需要自行去官方的 Middleware 寻找（koa-router,bodyParser,logger...），搭配千奇百怪，总有一款适合你

> koa 常常与 express 一起比较，都是偏底层的无态度的 Web 框架

[Koa](https://koajs.com/)

---

### Egg.js

> 源于阿里,约定优于配置,整合了大量 Koa 的功能并封装

> 支持 Ts，类似 Koa 的洋葱圈模型的开发方式，和 AOP 编程还是有点区别的

> 企业级规范很多，但各方面能力极强，定位是框架的框架

[Egg.js](https://eggjs.github.io/zh/)

---

### Midway.js

> 源于阿里,感觉对标 Nest.js，深度使用注解特性

> Midway 基于 TypeScript 开发，结合了面向对象（OOP + Class + IoC）与函数式（FP + Function + Hooks）两种编程范式，并在此之上支持了 Web / 全栈 / 微服务 / RPC / Socket / Serverless 等多种场景，致力于为用户提供简单、易用、可靠的 Node.js 服务端研发体验。

> 虽然社区已经有 nest 这样的框架，但是这些产品的维护、协作、修改都会受到商业化产品的制约，也无法做到需求的快速迭代和安全性保障，整体的研发理念也和我们不同，为此，我们需要有一套自研的框架体系

[Midway.js](https://midwayjs.org/docs/intro)
