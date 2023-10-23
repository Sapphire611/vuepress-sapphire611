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
来自 [Sapphire611](http://sapphire611.github.io)
:::


---
### Demo

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

---

### 支持传参Demo

```js
// xxxService.js
const EventEmitter = require('events');

class MyService extends EventEmitter {
  emit(event, ...query) { 
		return super.emit(event, query);
	}
}

const myEmitter = new MyService();
myEmitter.on('event', callback);
module.exports = myEmitter;


myEmitter.emit('event',[1,2,3,4,5]); // emit event
```