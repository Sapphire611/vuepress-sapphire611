---
title: 面试真题记录
date: 2026-03-13
categories:
  - Backend
tags:
  - node
  - interview
  - personal
sidebar: 'auto'
publish: true
sticky: 2
---

## STICKY

[什么是 nodejs?(事件驱动、非阻塞 I/O)](/backend/node/node/#_0-什么是-nodejs)

[nodejs 事件循环机制(timers >> I/O callback >> idle,prepare >> poll >> check >> close callback)](/backend/node/node/#_7-node-js-事件循环机制)

[浏览器和 Node 中 事件循环区别 (浏览器:每次循环处理一个宏任务后清空微任务队列](/backend/node/node/#_3-浏览器和-node-中-事件循环有什么区别)

[防抖和节流函数(return function(...args),fn.apply(this,args))](/frontend/vue/#防抖-debounce-和-节流-throttle-函数)

[手写装饰器(className, methodName, originalMethod,return function (...args) )](/frontend/interview/#手写装饰器)

## Soloent

[Electron GitLab CI (缓存 node_modules、自动化测试、交叉编译)](/frontend/electron/#ci-自动化测试)

[Electron 多平台处理(配置文件分离、特定的应用行为(mac)、菜单和快捷键、渲染进程识别平台等)](/frontend/electron/#多平台处理差异)

[Electron 如何实现遥测(监听用户的特定行为、收集错误信息、指标信息、用于改进产品)](/frontend/electron/#如何实现遥测)

[大模型如何拥有记忆(并没有，只是通过维护上下文，将系统提示词+会话摘要+最近 N 轮对话+当前用户对话 合并发送)](/misc/AI/#大模型如何拥有记忆-如何记住之前的信息)

[CLAUDE.md 是什么？实现原理是？(持久化记忆文件 用户级记忆+项目级记忆+模块化规则+自动记忆)](/misc/AI/#claude-md-是什么-实现原理)

## AltenChina(HP)

#### Electron

[IPC 的核心功能模块 (send+on、invoke+handle、sendSync)](/frontend/electron/#ipc-的核心功能模块)

[如何设置只开启单窗口（app.requestSingleInstanceLock() 请求单例锁，没拿到应用程序退出）](/frontend/electron/#如何设置只开启单窗口)

[多窗口之间如何通信(通过主进程转发、使用 BroadcastChannel API)](/frontend/electron/#多窗口之间如何通信)

[如何实现窗口透明背景(BrowserWindow transparent: true,frame: false, html-body-background: transparent;)](/frontend/electron/#如何实现窗口透明背景)

[发生内存泄漏如何排查(Chromium DevTools-Memory-记录两个 Snapshot-选择 HeapSnapshot-comparison)](/frontend/electron/#发生内存泄漏如何排查)

#### 其他

[Redux 核心概念（单一数据源、State 只读、通过 Reducer 进行修改）](/frontend/react/#redux-mobx-的核心概念)

- VueX 单一数据源、State只读、通过 Mutation 修改，通过 dispatch 触发

[Typescript 什么是类型断言(就是 as 而已)](/frontend/typescript/#_4-什么是类型断言)

[JS 怎么实现深拷贝 （JSON.parse(JSON.stringify(obj)) / structuredClone(obj)）](#)

[观察者模式(Nodejs = EventEmitter，js = addEventListener(或者自己封装 EventEmitter，js))](/backend/node/node/#_8-node-中的-eventemitter-是什么)

[箭头函数和普通函数的区别（this 指向不同、不能作为构造函数、没有 arguments、call、apply、bind、prototype）](#)

[自己封装 Ajax](/frontend/interview/#ajax-是什么-如何手动封装一个-ajax)

[CSS flex 实现表格(flex-table 设置 max-width，table-row 设置 display:flex,table-cell 设置 flex: 1 均分宽度)](/frontend/html/#flex-实现表格布局)

```html
<div class="flex-table">
  <!-- 表头行 -->
  <div class="table-row table-header">
    <div class="table-cell">ID</div>
    <div class="table-cell">姓名</div>
    <div class="table-cell">年龄</div>
    <div class="table-cell">城市</div>
  </div>
</div>
```

## UXN

[22. 括号生成](/backend/node/leetcode-js/#_22-括号生成)

[2700. 两个对象之间的差异](/backend/node/leetcode-js/#_2700-两个对象之间的差异)

[SQL 题目](/backend/sql/#uxn-sql-题目)

## FUXUN

[MySQL 分布式事务是如何实现的？(mysql=XA+2PC,XA_START、END、PREPARE、COMMIT、ROLLBACK)](/backend/mysql/#_8-mysql-分布式事务是如何实现的)

[MongoDB 千万级数据如何导出，并在实际业务中操作？（后台 CRON 预聚合/实时需要优化聚合+索引）](/backend/mongodb/#_5-mongodb-千万级数据如何导出-并在实际业务中操作)

[Docker Compose 如何指定网络 IP？(networks: 容器: ipv4_address)](/deploy/docker/#docker-compose-如何指定网络-ip)

[Redis List 常用命令 (lrange k1 0 -1)](/backend/redis/#list-常用命令)

[Redis Hash 常用命令 (hkeys k1)](/backend/redis/#hash-常用命令)

[MongoDB ABC 联合索引，AB AC 是否生效？(最左前缀原则，AB 完全生效、AC 部分生效)](/backend/mongodb/#_6-mongodb-设置了-abc-联合索引-那-ab-ac-之类的生效吗)

[MySQL 与 MongoDB 地理索引对比（POINT, LINESTRING, POLYGON SPATIAL 索引 vs GeoJson 2d 索引,mongodb 原生支持 WGS84）](/backend/mysql/#_11-mysql-与-mongodb-地理索引对比)

[Node GC 新生代如何转变为老生代？(通过晋升、经历 GC 次数、To 区内存不足、大对象直接分配)](/backend/node/node/#_17-node-gc-新生代如何转变为老生代)

[js 原生数组头部插入删除 (unshift,shift)](#)

[js 参数传递是值传递还是引用传递 (基本类型传值、引用类型传递引用)](#)

- 基本类型: String Number Boolean Symbol null undefined
- 引用类型: Object Array Function

---

## HUAWANG

[计算属性 (computed) 和侦听器 (watch/watchEffect) 对比（前者有缓存值和返回，watch 能获取旧值，watchEffect 优先级高+自动收集）](/frontend/vue/#计算属性-computed-和侦听器-watch-watcheffect-对比)

[Vue2/3 的响应式原理 (Object.defineProperty vs Proxy)](/frontend/vue/#vue的响应式原理是如何实现的-请描述object-defineproperty和proxy的区别及其优缺点)

[toRef 什么时候使用 (reactive > ref 可以. value)](/frontend/vue/#toref-什么时候使用)

[type 和 interface 的区别 &/extends，interface 支持声明合并且只能定义 object](/frontend/typescript/#_2-type-和-interface-的区别)

[any、unknown、never 的区别（any=放弃检查，unknown=类型安全的 any，never=不可能）](/frontend/typescript/#_3-any、unknown、never-的区别)

[> CommonJS 是运行时引入,ESM 是编译时静态分析 + 运行时执行](#)

## CPIC

[css-矩形旋转(transform: rotate(45deg))](/frontend/interview/#css-矩形旋转)

[防抖和节流函数](/frontend/vue/#防抖-debounce-和-节流-throttle-函数)

[Promise.all Vs Promise.allSettled(all 只要有一个 Promise 拒绝就结束，只能返回第一个发生的错误，allSettled 一定会返回所有的结果)](/frontend/interview/#promise-all-vs-promise-allsettled)

[Vue 路由传参(this.$router.push/query/params)](/frontend/vue/#vue-路由传参)

## CTrip

[NestJS 数据初始化的时机(OnApplicationBootstrap)](/backend/node/node_frame/#nestjs-数据初始化的时机)

[Nestjs 全链路追踪方案(middleware 生成追踪 id，LoggerService 封装，interceptor 记录请求耗时 return next.handle().pipe(()=>{}))](/backend/node/node_frame/#nestjs-全链路追踪方案)

## DEEPSIGHT

[浏览器的事件循环](/backend/node/node/#_3-浏览器和-node-中-事件循环有什么区别)

[VUE2/3 响应式原理](/frontend/vue/#vue的响应式原理是如何实现的-请描述object-defineproperty和proxy的区别及其优缺点)

---

[70. 爬楼梯](/backend/node/leetcode-js/#_70-爬楼梯)

[867. 转置矩阵](/backend/node/leetcode-js/#_867-转置矩阵)

## YIKA

[redis 计划任务时间大于轮询时间时怎么处理(双重缓存/缓存续期)](/backend/redis/#计划任务时间大于轮询时间时怎么处理)

[prisma 和 typeorm 区别](/backend/node/node_frame/#orm-的选型)

[NestJS 解决循环依赖的问题(forwardRef)](/backend/node/node_frame/#nestjs-如何解决模块之间循环依赖的问题)

[Nest 守卫、拦截器、中间件 的区别](/backend/node/node_frame/#nest-守卫、拦截器、中间件-的区别)

[手写装饰器(className, methodName, originalMethod,return function (...args) )](/frontend/interview/#手写装饰器)

## SHANGHAI LONGYI

[express 和 koa 中间件的区别(线性 / 洋葱圈)](/backend/node/node/#_1-koa-和-express-有哪些不同)

[MySQL 和 MongoDB 的索引数据结构(B+ Tree vs B Tree)](/backend/sql/#mysql-和-mongodb-的索引数据结构)

[B 树(B-) 和 B+树(B 树所有节点都存储数据，B+树只有叶子节点存储数据，相互链接，查询更稳定，效率更高)](/backend/sql/#b-tree)

[Docker 常用的网络模式有哪些?(默认 bridge、host 直接用主机、none 无网络)](/deploy/docker/#docker-常用的网络模式有哪些)

[Nest 守卫、拦截器、中间件 的区别](/backend/node/node_frame/#nest-守卫、拦截器、中间件-的区别)

---

[665. 非递减数列](/backend/node/leetcode-js/#_665-非递减数列)

[简答题:微信登陆数据流向](/architecture/#微信扫码登录全流程-前后端数据流向)

## StoreHub

[什么是微服务？使用微服务的优势/缺点有哪些？](/architecture/#%E4%BB%80%E4%B9%88%E6%98%AF%E5%BE%AE%E6%9C%8D%E5%8A%A1-%E4%BD%BF%E7%94%A8%E5%BE%AE%E6%9C%8D%E5%8A%A1%E7%9A%84%E4%BC%98%E5%8A%BF-%E7%BC%BA%E7%82%B9%E6%9C%89%E5%93%AA%E4%BA%9B)

[Mysql & MongoDB & Redis 介绍，分别在哪些场景下发挥优势?](/backend/SQL/#mysql-mongodb-redis-介绍-分别在哪些场景下发挥优势)

[查找 4 月份的日志，基于 name 去重](/backend/SQL/#查找-4-月份的日志-基于-name-去重)

[mongodb 中索引有哪些类型？分别怎么使用？](/backend/mongodb/#mongodb-中索引有哪些类型-分别怎么使用)

[把 callback 改写成 Promise](/frontend/interview/#_16-把-callback-改写成-promise)

### 算法题：括号匹配 leetcode 20

[算法题：括号匹配 leetcode 20](/backend/node/leetcode-js/#_20-有效的括号)

[算法题：搜索旋转排序数组 leetcode 33](/backend/node/leetcode-js/#_33-搜索旋转排序数组)

## NGA

[什么是 控制反转 && 依赖注入?](/architecture/#什么是-控制反转-依赖注入)

[多实例情况下，怎么通过 redis 防止定时任务多次执行](/backend/sql/#多实例情况下-怎么通过-redis-防止定时任务多次执行)

---

## ShuRui

[Node Stream 是什么？有哪些种类的 Stream？](/backend/node/node/#_10-node-stream-是什么-有哪些种类的-stream)

---

## MiaoDian

[Mysql 查询学生三门科目总分最高的 前三名](/backend/sql/#mysql-查询学生三门科目总分最高的-前三名)

## XINYUE

[fs.readFile() 和 fs.createReadStream() 有什么区别？](/backend/node/node/#_2-fs-readfile-和-fs-createreadstream-有什么区别)

[如何使用 nodejs 读取一个本地文件](/backend/node/node/#_18-如何使用-nodejs-读取一个本地文件)

[如何做到创建 nodejs 集群并做到不中断重启](/backend/node/node/#_19-如何做到创建-nodejs-集群并做到不中断重启)

[mongo 扣减库存时如何保证原子一致性](/backend/mongodb/#_7-mongo-扣减库存时如何保证原子一致性)

[请写出符合下列要求的 mongodb 查询语句](/backend/mongodb/#_8-请写出符合下列要求的-mongodb-查询语句)

[如何使用 redis 实现简单的消息队列](/backend/redis/#如何使用-redis-实现简单的消息队列)

[用 redis 实现一个分数排行榜，并从中查找前十名的数据(zadd board 100 Player1, zrevrange board 0 9 WITHSCORES)](/backend/redis/#用-redis-实现一个分数排行榜-并从中查找前十名的数据)

[列举 js 中数组遍历相关的方法](/backend/node/es6/#列举-js-中数组遍历相关的方法)

[列举几个 es6 以后的新特性](/backend/node/es6/#列举几个-es6-以后的新特性)

[用 ts 实现多态，父类 animal，子类 cat 和 dog，包含 name 属性，实现 say 方法](/frontend/typescript/#_5-用-ts-实现多态-父类-animal-子类-cat-和-dog-包含-name-属性-实现-say-方法)

---

## CAROTA

[node 如何设置使用内存大小](/backend/node/node/#_20-node-如何设置使用内存大小)

[Node 主进程和子进程是否共享内存](/backend/node/node/#_21-node-主进程和子进程是否共享内存)


[如何预防 XSS 攻击](/frontend/interview/#如何预防-xss-攻击)

[http 和 https 的区别？证书认证过程？pki？](/frontend/interview/#http-和-https-的区别-证书认证过程-pki)

## ZStack

[Node.js 事件循环机制](/backend/node/node/#_7-node-js-%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF%E6%9C%BA%E5%88%B6)

[useMemo / useCallback / useEffect 三者区别](/frontend/react/#_1-react-中-usememo-usecallback-useeffect-三者区别)

[什么是 $facet](/backend/mongodb/#_9-什么是-facet)

## DAOYOUYUN

[什么是 nodejs?(事件驱动、非阻塞 I/O)](/backend/node/node/#_0-什么是-nodejs)

[nodejs 事件循环机制(timers >> I/O callback >> idle,prepare >> poll >> check >> close callback)](/backend/node/node/#_7-node-js-事件循环机制)

[浏览器和 Node 中 事件循环区别 (浏览器:每次循环处理一个宏任务后清空微任务队列](/backend/node/node/#_3-浏览器和-node-中-事件循环有什么区别)

[什么是泛型?](/frontend/typescript/#_1-什么是泛型)

[防抖和节流函数(return function(...args),fn.apply(this,args))](/frontend/vue/#防抖-debounce-和-节流-throttle-函数)

[如何 做 http 缓存](/frontend/interview/#如何-做-http-缓存)

[TCP / UDP](/frontend/interview/#tcp-udp)

[算法题目](/frontend/interview/#算法题目)