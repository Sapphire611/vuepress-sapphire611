---
title: ECMAScript6 学习笔记
date: 2022-02-14
categories:
  - Backend
  - Frontend
tags:
  - javascript
sidebar: 'auto'
publish: true
---

## ECMAScript6 学习笔记

[ES6 入门教程 - 阮一峰 (yyds)](https://es6.ruanyifeng.com/#README)

[ES6 学习笔记 - 看这个也行](https://www.aliyundrive.com/s/exVukKetCKw)

[ES7 到 ES12 常用新语法 - 掘金](https://juejin.cn/post/7007393969994891301)

## var && let && const

| ...    | var      | let  | const    |
| ------ | -------- | ---- | -------- |
| 作用域 | 全局     | 块级 | 块级     |
| 可修改 | ✔️       | ✔️   | ✖️       |
| tips   | 变量提升 | TDZ  | 对象指针 |

### 变量提升

```js
function person(status) {
  if (status) {
    var value = 'sb';
  }
}

function person(status) {
  var value; // var所携带语句默认提升到顶端，上面的函数会被解析为下面
  if (status) {
    value = 'sb';
  }
}
```

### 暂时死区 (TDZ)

> TDZ = temporal dead zone

```js
console.log(typeof value); // OK , "undefined"
if (true) {
  let value = 'sb'; // value不在同一作用域内
}
```

```js
console.log(typeof value); // 报错，访问同一作用域下死区内变量
let value = 'sb';
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

- 浏览器里面，顶层对象是 window，但 Node 和 Web Worker 没有 window。

- 浏览器和 Web Worker 里面，self 也指向顶层对象，但是 Node 没有 self。

- Node 里面，顶层对象是 global，但其他环境都不支持。

ES2020 在语言标准的层面，引入**globalThis**作为顶层对象。也就是说，任何环境下，**globalThis**都是存在的，都可以从它拿到顶层对象，指向全局环境下的 this。

## Destructuring

> ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

```js
let [a, b, c] = [1, 2, 3];

let [head, ...tail] = [1, 2, 3, 4];
head; // 1
tail; // [2, 3, 4]

let [x, y, ...z] = ['a'];
x; // "a"
y; // undefined
z; // []
```

### 列举 js 中数组遍历相关的方法

1. for 循环

```javascript
const array = [1, 2, 3, 4, 5];
for (let i = 0; i < array.length; i++) {
  console.log(array[i]);
}
```

2. for...of 循环：用于遍历可迭代对象，例如数组、字符串等。

```javascript
const array = [1, 2, 3, 4, 5];
for (const item of array) {
  console.log(item);
}
```

3. forEach 方法：

```javascript
const array = [1, 2, 3, 4, 5];
array.forEach((item) => {
  console.log(item);
});
```

4. map 方法：返回一个新的数组，其中包含对原始数组每个元素进行处理后的结果。

```javascript
const array = [1, 2, 3, 4, 5];
const newArray1 = array.map((item) => item * 2);
console.log(newArray);
```

5. filter 方法：返回一个新的数组，其中包含满足特定条件的原始数组元素。

```javascript
const array = [1, 2, 3, 4, 5];
const newArray2 = array.filter((item) => item > 2);
console.log(newArray);
```

6. reduce 方法：通过对原始数组的累积计算，返回一个单一的值。

> 回调函数（callback function）：这是一个用于处理数组元素的函数，它接受四个参数：累加器（accumulator）、当前值（current value）、当前索引（current index）和原始数组（array）。回调函数在每个数组元素上被调用，可以执行任意操作并返回一个值，该值将作为下一次迭代的累加器的值

> 初始累加器的值（initial accumulator value）：这是可选的参数，指定初始的累加器的值。如果未提供该参数，则将使用数组的第一个元素作为初始累加器的值，并从数组的第二个元素开始迭代。

```javascript
const array = [1, 2, 3, 4, 5];
const sum = array.reduce((accumulator, currentValue) => accumulator + currentValue);
console.log(sum);
```

### 列举几个 es6 以后的新特性

1. 块级作用域（Block Scope）：通过使用 let 和 const 关键字，引入了块级作用域，使得变量和常量的作用域仅限于定义它们的块内部。

2. 箭头函数（Arrow Functions）：使用 => 语法定义函数，可以更简洁地编写函数表达式，并自动绑定函数体内的 this 值。

3. 解构赋值（Destructuring Assignment）：可以从数组或对象中快速提取值，并将它们分配给变量，以便进行更方便的赋值操作。

4. 默认参数（Default Parameters）：在函数定义中，可以为参数设置默认值，当调用函数时没有提供该参数时，将使用默认值。

5. 模板字面量（Template Literals）：使用反引号 包围的字符串，可以包含变量、表达式和换行符，并使用 ${} 语法进行插值。

6. 扩展运算符（Spread Operator）：通过使用 ... 语法，可以将数组或对象在函数调用、数组字面量或对象字面量中展开，使其元素或属性被拆分成独立的项。

7. 类和模块（Classes and Modules）：引入了类和模块的概念，可以更简洁地定义和组织对象的行为和结构。

8. async/await（Promises）：引入了 Promise 对象，用于处理异步操作，使得异步代码更易于编写和管理。

9. for...of 循环（For...of Loop）：提供了一种简单的遍历数组、字符串和其他可迭代对象的方式。

10 模块化导入和导出（Module Import and Export）：通过 import 和 export 关键字，支持模块化的文件导入和导出，方便代码的组织和复用。