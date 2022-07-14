---
title: ECMAScript6 学习笔记
date: 2022-2-14
categories:
  - Backend
  - FrontEnd
tags:
  - javascript
  - ecmascript
sidebar: "auto"
publish: true
showSponsor: true
---

## ECMAScript6 学习笔记

[ES6 入门教程 - 阮一峰 (yyds)](https://es6.ruanyifeng.com/#README)

[ES6学习笔记 - 看这个也行](https://www.aliyundrive.com/s/exVukKetCKw)

[ES7 到 ES12 常用新语法 - 掘金](https://juejin.cn/post/7007393969994891301)
## var && let && const 


... |var|let|const
---|---|---|---
作用域 | 全局 | 块级 | 块级
可修改  | ✔️ | ✔️  |  ✖️
tips | 变量提升 | TDZ | 对象指针

### 变量提升

```js
function person(status) {   
    if (status) {
        var value = "sb";
    } 
}

function person(status) {
    var value; // var所携带语句默认提升到顶端，上面的函数会被解析为下面
    if (status) {
        value = "sb" 
    } 
}
```

### 暂时死区 (TDZ)

> TDZ = temporal dead zone

```js
console.log(typeof value);  // OK , "undefined"
if (true) {
    let value = "sb"; // value不在同一作用域内
}
```

```js
console.log(typeof value) // 报错，访问同一作用域下死区内变量
let value = "sb"; 
```

```js
var value = "sb"
let value = "sb" // 重复声明，报错，const同理

const age; // 报错 常量未初始化

const person = {
    name: "Sapphire611",
    age: 24
}
person.age = 18 // OK
person = {} // 报错,不能修改对象指针

const foo = Object.freeze({}); // 冻结！严格模式时，该行会报错
```

::: danger var & let & const 最大的区别
- var 在全局作用域声明的变量会挂载在 window 对象上，它会创建一个新的全局变量。
- 作为全局对象的属性，这种行为说不定会覆盖到 window 对象上的某个属性...
- 而 let const 声明的变量则不会有这一行为。
:::

### globalThis

> JavaScript 语言存在一个顶层对象，它提供全局环境（即全局作用域），所有代码都是在这个环境中运行。但是，顶层对象在各种实现里面是不统一的。

- 浏览器里面，顶层对象是window，但 Node 和 Web Worker 没有window。

- 浏览器和 Web Worker 里面，self也指向顶层对象，但是 Node 没有self。

- Node 里面，顶层对象是global，但其他环境都不支持。

ES2020 在语言标准的层面，引入**globalThis**作为顶层对象。也就是说，任何环境下，**globalThis**都是存在的，都可以从它拿到顶层对象，指向全局环境下的this。

## Destructuring

> ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

```js
let [a, b, c] = [1, 2, 3];

let [head, ...tail] = [1, 2, 3, 4];
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a'];
x // "a"
y // undefined
z // []
```