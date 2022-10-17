---
title: Node EventEmitter
date: 2022-10-17
categories:
  - Backend
tags:
  - node
  - eventLoop
sidebar: "auto"
publish: true
---

## Node EventEmitter

> 观察者模式的体现

::: right
来自 [Sapphire611](http://www.sapphire611.com)
:::


---

``` js
// xxxService.js
const EventEmitter = require('events');

class MyService extends EventEmitter {
  // ...
}

const myEmitter = new MyService();
myEmitter.on('event', callback);
module.exports = myEmitter;

// 别的地方引用,先require
myEmitter.emit('event'); // emit event
```