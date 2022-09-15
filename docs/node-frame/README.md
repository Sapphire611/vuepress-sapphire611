---
title: Node 常用框架简介
date: 2022-9-15
categories:
  - Backend
tags:
  - node
  - frame
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

> 源于阿里,感觉对标Nest.js，深度使用注解特性

> Midway 基于 TypeScript 开发，结合了面向对象（OOP + Class + IoC）与函数式（FP + Function + Hooks）两种编程范式，并在此之上支持了 Web / 全栈 / 微服务 / RPC / Socket / Serverless 等多种场景，致力于为用户提供简单、易用、可靠的 Node.js 服务端研发体验。

> 虽然社区已经有 nest 这样的框架，但是这些产品的维护、协作、修改都会受到商业化产品的制约，也无法做到需求的快速迭代和安全性保障，整体的研发理念也和我们不同，为此，我们需要有一套自研的框架体系

[Midway.js](https://midwayjs.org/docs/intro)