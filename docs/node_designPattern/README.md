---
title: Node 设计模式（第二版） - 冯康
date: 2022-11-29
categories:
  - Backend
tags:
  - node
sidebar: "auto"
publish: true
---

# Node 设计模式（第二版）

::: right
来自 [Sapphire611](http://www.sapphire611.com)
:::

## 第1章　欢迎来到Node.js平台

### 箭头函数

- 箭头函数是绑定到它们的词法作用域内的,这意味着在一个箭头函数中this的值和父块中的值是相同的

### 类语法

- 经典的基于原型的方式定义一个Person方法:

```js
function Person (name, surname, age){
    this.name = name;
    this.surname = surname;
    this.age = age;
}

Person.prototype.getFullName = function(){
    return this.name + ' ' + this.surname;
};

Person.older = function (personl, person2){
    return (person1 .age >= person2.age) ? person1 : person2;
};
```

- 类语法更具可读性，简单易懂,我们为这个类显式声明了构造函数，并定义了older函数作为静态方法

```js
class Person {
    constructor (name, surname, age){
        this.name = name;
        this.surname = surname;
        this.age = age;
    }
    getFullName () {
        return this.name + ' ' + this.surname;
    }

    static older (person1, person2) {
        return (personl.age >= person2.age) ? personl : person2 ; 
    }
}
```

### Map和Set集合

```js
const profiles = new Map();

profiles.set('twitter', '@adalovelace');
profiles.set('facebook', 'adalovelace');
profiles.set('googleplus', 'ada');
profiles.size;//3

profiles.has('twitter');//true
profiles.get('twitter');//"@adalovelace"

profiles.has('youtube');//false

profiles.delete('facebook');
profiles.has('facebook');//false
```

WeakMap和WeakSet集合


模板字面量


其他ES2015特性


Reactor模式


I/O是缓慢的


阻塞I/O


非阻塞I/O


事件多路分解器


Reactor模式简介


Node.js-libuv的非阻塞I/O引擎


Node.js的秘诀

## 第2章　Node.js基础设计模式


回调模式

“CPS（Continuation Passing Style）


同步或异步


Node.js回调约定


模块系统及其模式


揭示模块模式


Node.js模块解释


模块定义模式


观察者模式


EventEmitter类


创建和使用EventEmitter


传播错误


使任何对象可观察


同步和异步事件


EventEmitter与回调


组合回调和EventEmitter


## 第3章　异步控制流模式之回调函数

异步编程的困难

回调地狱


使用纯JavaScript


回调规则


应用回调规则


顺序执行


并行执行


有限制的并行执行


async库


顺序执行


并行执行


有限制的并行执行

## 第4章　异步控制流模式之ES2015+


promise


什么是promise


Promises/A+实现


Node.js风格函数的promise化


顺序执行


并行执行


有限制的并行执行


在公共API中暴露callback和promise


generator


generator基础


generator的异步控制流


顺序执行


并行执行


有限制的并行执行


使用Babel的async await


安装和运行Babel


比较


总结


## 第5章　流编程


流的重要性


缓冲和流


空间效率


时间效率


组合性


开始学习流

流的分类


可读流


可写流


双向流(Duplex stream)


变换流


使用管道拼接流


使用流处理异步流程


顺序执行


无序并行执行


无序有限制的并行执行


管道模式


组合流


复制流


合并流


复用和分解


总结


## 第6章　设计模式


工厂模式


创建对象的通用接口


一种封装的机制


构建一个简单的代码分析器


可组合的工厂函数


扩展


揭示构造函数


只读事件触发器


扩展


代理模式


实现代理模式的方法


不同方法的比较


创建日志记录的写入流


“生态系统中的代理模式——函数钩子与面向行为编程(AOP)


ES2015中的Proxy对象


扩展


装饰者模式(Decorator)


实现装饰者模式的方法


装饰一个LevelUP数据库


扩展


适配器模式(Adapter)

“通过文件系统API来使用LevelUP数据库


扩展


策略模式(Strategy)


支持多种格式的配置对象


扩展


状态模式


实现一个基本的自动防故障套接字


模板模式(Template)


配置管理器模板


扩展


中间件(Middleware)


Express中的中间件


设计模式中的中间件


为ØMQ创建中间件框架


在Koa中使用生成器的中间件


命令模式(Command)


灵活的设计模式


总结


## 第7章　连接模块


模块和依赖


Node.js中最常见的依赖


内聚和耦合


有状态的模块


连接模块模式


硬编码依赖


依赖注入


服务定位器


依赖注入容器


连接插件


插件“作为包


扩展点


插件控制与应用程序控制的扩展


实现注销插件


总结


## 第8章　通用JavaScript的Web应用程序


与浏览器端共享代码


共享模块


Webpack简介

“Webpack的魔力


Webpack的优点


使用ES2015和Webpack


跨平台开发基础


运行时代码分支


构建时代码分支


模块交换


用于跨平台开发的设计模式


React介绍


第一个React组件


JSX是什么


配置Webpack以实现JSX转换


在浏览器中渲染


React路由库


创建通用JavaScript应用程序


创建可用的组件


服务端渲染


通用渲染和路由


通用数据检索

总结


## 第9章　高级异步编程技巧


需要异步初始化的模块


规范解决方案


预初始化队列


题外话


异步批处理和缓存


实现没有缓存或批处理的服务器


异步请求批处理


异步请求缓存


使用promise进行批处理和缓存


运行CPU绑定的任务


解决子集和问题


交叉使用setImmediate


使用多进程


总结


## 第10章　扩展与架构模式


应用程序扩展介绍


扩展Node.js应用程序

“可扩展性的三个维度


克隆和负载均衡


集群模块


处理有状态通信


使用反向代理进行扩展


使用服务注册表


对等负载均衡


分解复杂的应用程序


单体式架构


微服务架构


微服务架构中的集成模式


总结


第11章　消息传递与集成模式


消息系统的基础


单向和请求/应答模式


消息类型


异步消息和队列


对等或基于代理的消息


发布/订阅模式


构建简约的实时聊天应用程序


使用Redis作为消息代理


使用ØMQ对等发布/订阅


持久订阅者


管道和任务分配模式


ØMQ扇出/扇入模式


使用AMQP实现管道和竞争消费者模式


请求/应答模式“关联标识符


返回地址

总结