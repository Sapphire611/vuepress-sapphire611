---
title: PM2相关
date: 2023-10-24
categories:
 - Deploy
tags:
 - pm2
sidebar: 'auto'
publish: true
--- 

## PM2相关

> PM2主要有两种运行模式，Cluster和Fork，这两种模式的区别在于进程管理方式。

1. `Cluster` 模式

在Cluster模式下，PM2会创建多个子进程（Worker），每个子进程都可以处理请求。这是一种用于多核CPU的负载均衡模式。
PM2会自动复制你的应用程序来启动多个子进程，以实现并行处理请求。这种模式适用于Web服务器等需要并发处理请求的应用程序。

```bash
pm2 start app.js -i max
```
Fork 模式：Fork模式是默认模式，它创建一个主进程（Master）和多个子进程（Worker）。
每个子进程都独立运行应用程序，主进程负责监控和管理这些子进程。这是一种适用于一般应用程序的模式。

使用Fork模式启动应用：

```js
pm2 start app.js
```