---
title: Interview For Javascript
date: 2021-12-10
categories:
 - Interview
tags:
 - interview javascript
sidebar: 'auto'
publish: true
--- 

## Javascript

### js 中什么类型是引用传递, 什么类型是值传递? 如何将值类型的变量以引用的方式传递?

> 简单点说, 对象是引用传递, 基础类型是值传递, 通过将基础类型包装 (boxing) 可以以引用的方式传递.

``` js
console.log(undefined == null) // true
console.log(undefined === null) // false
console.log([1] == [1]) // false
```

### var & let & const

123 ｜ 456 ｜ 789     ｜ 789
### eg1.Pre-compiled (预编译)

> Question: what is Output？

``` js
function f(a, c) {
    console.log(a); // [Function: a]
    var a = 123;
    console.log(a); // 123
    console.log(c); // [Function: c]

    function a() { };

    if (false) {
        var d = 678;
    }

    console.log(d); // undefined
    console.log(b); // undefined  这个是函数体，不是函数声明
    var b = function b() { };
    console.log(b); // [Function: b]

    function c() { };
    console.log(c); // [Function: c]
}

f(1, 2);

```

::: tip

执行顺序如下，前4步属于预编译范围:

1. js创建AO对象  
2. 找形参和实参的声明，赋值为undefined  >> 发现 a c d b 四个对象，均为undefined
3. 实参和形参相统一 >> a = 1 , c = 2
4. 找函数声明，覆盖变量声明 >> a = function a() { }; c = function c() { };
---

5. 开始走函数中的正常流程

:::


::: warning 函数作用域预编译
1. 创建ao对象A0{}
2. 找形参和变量声明，将变量和形参名当做A0对象的属性名，值为undefined
3. 实参形参相统一
4. 在函数体里面找函数声明值赋予函数体
:::

::: warning 全局作用域的预编译 
1. 创建GO对象
2. 找变量声明，将变量名作为GO对象的属性名，值是undefined
3. 找函数声明值赋予函数体
:::



### eg2.This & Arrow Function

> Question : what is Output?

> 这道面试题根据运行的环境不同，答案会有差异，因为js的顶层对象是window，而nodeJs中是global

``` js
// 根据运行环境的不同，答案有差异！
var name = 222;
var a = {
    name: 111,
    say: function () {
        console.log(this.name);
    }
}

var fun = a.say;

fun(); // 函数的直接使用 = fun.call(window/global) = 222/undefined

a.say(); // a.say.call(a) = 111

var b = {
    name: 333,
    say: function (fun) {
        fun(); // = fun.call(window/global) = 222/undefined
    }
}

b.say(a.say); // 相当于把a中的say()拷贝到b的say()了
b.say = a.say;
b.say(); // = b.say.call(b) = 333
```

> 箭头函数中的this在定义时绑定，不是在执行时绑定。

> 箭头函数压根没有this，所谓的this是外部代码块的this，因此不能用作构造函数。

### Scope (作用域)

> 作用域说明：一般理解指一个变量的作用范围

::: tip 全局作用域
1. 全局作用域在页面打开时被创建，页面关闭时被销毁
2. 编写在script标签中的变量和函数，作用域为全局，在页面的任意位置都可以访问到
3. 在全局作用域中有全局对象window,代表一个浏览器窗口，由浏览器创建，可以直接调用
4. 全局作用域中声明的变量和函数会作为window对象的属性和方法保存
:::

::: tip 函数作用域
1. 调用函数时，函数作用域被创建，函数执行完毕，函数忤用域被销毁
2. 每调用一次函数就会创建一个新的函数作用域,他们之间是相互独立的
3. 在函数作用域中可以访问到全局作用域的变量,在函数外无法访问到函数作用域内的变量
4. 在函数作用域中访问变量、函数时，会先在自身作用域中寻找，若没有找到，则会到函数的上一级作用域中寻找，一直到全局作用域
:::

::: warning 作用域的深层次理解 
- 当函数代码执行的前期会创建一个执行期上下文的内部对象A0 （作用域）
- 这个内部的对象是预编译的时候创建出来的，因为当函数被调用的时候，会先进行预编译
- 在全局代码执行的前期会创建一个执行期的上下文的对象GO
::: 

[2021前端面试秋招/前端面试春招/前端就业/前端自学必刷](https://www.bilibili.com/video/BV1sN411974w?p=3)
