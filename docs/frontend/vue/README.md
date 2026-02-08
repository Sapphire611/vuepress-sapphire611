---
title: VUE 题目整理
date: 2025-06-23
categories:
  - Frontend
tags:
  - vue
  - interview
sidebar: 'auto'
publish: true
 
---

## 👋 VUE 题目整理

:::right
VUE 是一套用于构建用户界面的**渐进式框架**,采用虚拟 DOM 渲染页面，区分编译时和运行时，组件化（高内聚、低耦合、单向数据流）
:::

## Vue2 && Vue3 生命周期

| Vue 2 生命周期钩子 | Vue 3 生命周期钩子 (Composition API) | 触发时机描述                        |
| ------------------ | ------------------------------------ | ----------------------------------- |
| `beforeCreate`     | `setup()`                            | 实例初始化后，数据观测/事件配置前   |
| `created`          | `setup()`                            | 实例创建完成，数据观测/事件配置完成 |
| `beforeMount`      | `onBeforeMount`                      | 挂载开始之前被调用                  |
| `mounted`          | `onMounted`                          | 实例挂载完成后调用                  |
| `beforeUpdate`     | `onBeforeUpdate`                     | 数据更新时，DOM 打补丁前            |
| `updated`          | `onUpdated`                          | 数据更改导致 DOM 重新渲染后         |
| `beforeDestroy`    | `onBeforeUnmount`                    | 实例销毁之前调用                    |
| `destroyed`        | `onUnmounted`                        | 实例销毁后调用                      |
| `errorCaptured`    | `onErrorCaptured`                    | 捕获子孙组件错误时                  |
| -                  | `onRenderTracked` (Dev Only)         | 响应式依赖被追踪时                  |
| -                  | `onRenderTriggered` (Dev Only)       | 响应式依赖触发重新渲染时            |
| `activated`        | `onActivated`                        | 被 keep-alive 缓存的组件激活时      |
| `deactivated`      | `onDeactivated`                      | 被 keep-alive 缓存的组件停用时      |

::: tip
Vue 3 的 setup() 函数替代了 Vue 2 的 beforeCreate 和 created 钩子

销毁相关钩子名称从 destroy 改为 unmount（更语义化）

Vue 3 新增了调试钩子 onRenderTracked 和 onRenderTriggered

如果使用 Options API，Vue 3 仍然支持 Vue 2 的大部分钩子名称（但 beforeDestroy 建议改为 beforeUnmount）
:::


## Composition API vs Options API 

| 对比维度          | Options API                          | Composition API                      | 选择建议                                                                 |
|-------------------|-------------------------------------|--------------------------------------|--------------------------------------------------------------------------|
| **代码组织**       | 按选项分组（data/methods/computed） | 按逻辑功能组织（自定义组合函数）       | 复杂逻辑推荐 Composition API，简单逻辑可用 Options API                     |
| **类型支持**       | TS 支持较弱                         | 完美的 TS 类型推断                    | TS 项目首选 Composition API                                               |
| **逻辑复用**       | Mixins（有命名冲突风险）            | 自定义组合函数（无命名冲突）           | 需要复用时无条件选择 Composition API                                      |
| **响应式控制**     | 全自动响应式                        | 可手动控制（ref/reactive）            | 需要精细控制响应式时选 Composition API                                    |
| **学习成本**       | 入门简单                            | 需要理解响应式 API                     | 新手可从 Options API 开始，逐步过渡                                        |
| **项目规模**       | 适合中小项目                        | 适合大型复杂应用                      | 新项目推荐 Composition API，老项目可共存                                   |
| **生命周期**       | 选项式钩子（created/mounted）       | 函数式钩子（onMounted/onUpdated）      | 两种写法效果相同，Composition API 更灵活                                   |
| **状态管理**       | 依赖 this 上下文                    | 无 this 上下文，更纯净                 | 需要解耦逻辑时选 Composition API                                          |
| **代码量**         | 简单场景代码更少                    | 复杂场景代码更集中                     | 简单功能可用 Options API，复杂功能 Composition API 更简洁                   |
| **维护性**         | 逻辑分散在不同选项                  | 相关逻辑集中在一起                     | 长期维护项目推荐 Composition API                                           |
| **典型场景**       | - 简单表单<br>- 快速原型开发         | - 复杂组件<br>- 逻辑复用需求<br>- TS 项目 | 根据具体场景灵活选择，Vue3 官方推荐新项目使用 Composition API               |

## Vuex 和 Pinia 的核心区别

| 对比维度       | Vuex                          | Pinia                          |
|---------------|-------------------------------|--------------------------------|
| **设计理念**   | 严格单向数据流 (Flux 架构)     | 灵活响应式 (Composition API 风格) |
| **核心概念**   | State → Getters → Mutations → Actions | State → Getters → Actions (无 Mutations) |
| **TypeScript** | 需要额外配置                   | 原生完美支持                    |
| **模块系统**   | 嵌套模块 + 命名空间            | 扁平化独立 Store                |
| **API 风格**   | Options API 风格               | Composition API 风格            |
| **修改 State** | 必须通过 Mutations             | 可直接修改 (也支持 Actions)      |
| **体积**       | ~10KB (gzipped)               | ~5KB (gzipped)                 |
| **Vue 版本**   | Vue 2/3 (兼容)                | 专为 Vue 3 设计                |
| **官方状态**   | 维护模式                      | 推荐首选                        |
| **典型代码**   | ```javascript                 | ```javascript                  |
|               | // Vuex 示例                  | // Pinia 示例                  |
|               | mutations: {                  | actions: {                     |
|               |   increment(state) {          |   increment() {                |
|               |     state.count++             |     this.count++               |
|               |   }                           |   }                            |
|               | }                             | }                              |
|               | ```                           | ```                            |

## ref() && reactive()

> 这两个都是创建响应式数据的API，有一些区别

| **对比项**      | `ref()`                     | `reactive()`                      |
| --------------- | --------------------------- | --------------------------------- |
| **数据类型**    | 基本类型 + 引用类型         | 仅引用类型（Object/Array/Map等）  |
| **访问值**      | 需要通过 `.value` 访问      | 直接访问属性                      |
| **响应式原理**  | 内部用 `reactive` 包裹对象  | 直接基于 Proxy                    |
| **TS 类型推断** | `Ref<T>`                    | 原生对象类型                      |
| **解构响应性**  | 保持响应性（需用 `toRefs`） | 直接解构会丢失响应性              |
| **模板中使用**  | 自动解包（无需 `.value`）   | 直接使用属性                      |
| **典型场景**    | 单值、模板引用、函数返回值  | 复杂对象或嵌套数据                |
| **示例代码**    | `const num = ref(0);`       | `const obj = reactive({ a: 1 });` |

```js
// 互相转换
const refObj = ref({ a: 1 }); // 等价于 reactive({ a: 1 })
const reactiveVal = reactive({ val: ref(0) }); // 自动解包 ref
```

> 为什么需要 .value？
答：ref 返回的是一个包装对象，通过 .value 访问内部值，确保基本类型的响应式。

> reactive 的局限性？
答：对解构不友好（会丢失响应性），适合整体操作对象；ref 更灵活。

## 计算属性 (computed) 和侦听器 (watch/watchEffect) 对比

> 在 Vue 3 中，计算属性和侦听器都是响应式编程的重要工具，但它们有不同的使用场景和特点。

```js
import { ref, computed } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

// watch 示例
watch(count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`)
})

// watchEffect 示例
watchEffect(() => {
  console.log(`count is now ${count.value}`)
})
```
| 特性                | computed          | watch             | watchEffect       |
|---------------------|-------------------|-------------------|-------------------|
| **返回值**          | 返回计算值        | 无返回值          | 无返回值          |
| **缓存**            | ✅ 有缓存         | ❌ 无缓存         | ❌ 无缓存         |
| **执行时机**        | 依赖变化时        | 依赖变化时        | 立即执行+依赖变化 |
| **依赖收集方式**    | 显式声明          | 显式声明          | 自动收集          |
| **适合场景**        | 派生数据          | 副作用/异步操作   | 副作用/同步操作   |
| **获取旧值**        | ❌ 不支持         | ✅ 支持           | ❌ 不支持         |
| **立即执行**        | ❌ 不适用         | 可配置(`immediate`)| ✅ 默认立即       |
| **代码示例**        | `const val = computed(() => a.value + b.value)` | `watch(a, (newVal, oldVal) => {...})` | `watchEffect(() => { console.log(a.value) })` |

> watch 和 watchEffect 如何选择？
答：需要明确侦听特定数据用 watch；依赖动态或复杂时用 watchEffect。

---

## 谈谈你对 `VUE` 的理解

#### `MVVM` VS `MVC`

> `MVVM` = `Model(数据模型)-View(UI)-ViewModel`,是一种设计思想

- Model 和 ViewModel 之间的交互是双向的， 因此 View 数据的变化会同步到 Model 中，而 Model 数据的变化也会立即反应到 View 上，双向数据绑定完全是自动的

- 因此开发者只需关注业务逻辑，不需要手动操作 DOM，不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。

::: warning
VUE 不能完全被称为 MVVM，但借鉴了其中的思想
:::

#### 虚拟 `DOM` 和 `diff` 算法

> 虚拟 dom 就是一个`普通的js对象`。是一个用来描述真实 dom 结构的 js 对象

[15 张图，20 分钟吃透 Diff 算法核心原理，我说的！！！](https://juejin.cn/post/6994959998283907102)

```js
<ul id="list">
  <li class="item">哈哈</li>
  <li class="item">呵呵</li>
  <li class="item">嘿嘿</li>
</ul>
```

```js
// 上面元素对应的虚拟DOM
let oldVDOM = {
  // 旧虚拟DOM
  tagName: 'ul', // 标签名
  props: {
    // 标签属性
    id: 'list',
  },
  children: [
    // 标签子节点
    {
      tagName: 'li',
      props: { class: 'item' },
      children: ['哈哈'],
    },
    {
      tagName: 'li',
      props: { class: 'item' },
      children: ['呵呵'],
    },
    {
      tagName: 'li',
      props: { class: 'item' },
      children: ['嘿嘿'],
    },
  ],
};
```

> 新旧虚拟 DOM 对比的时候，Diff 算法比较只会在同层级进行, 不会跨层级比较。

> 所以 Diff 算法是:深度优先算法（DFS）。 时间复杂度: `O(n)`

---

## 谈谈你对 SPA 的理解

- SPA (single-page application) 单页应用，默认情况下我们编写 Vue、React 都只有一个 html 页面，并且提供一个挂载点，最终打包后会再此页面中引入对应的资源。 (页面的渲染全部是由 JS 动态进行渲染的)。切换页面时通过监听路由变化，渲染对应的页面

**Client Side Rendering，客户端渲染 CSR**

- MPA (Multi-page application) 多页应用，多个 html 页面。每个页面必须重复加载，js，css 等相关资源。(服务端返回完整的 html，同时数据也可以再后端进行获取一并返回“模板引擎”)。多页应用跳转需要整页资源刷新。

**Server side Rendering，服务器端渲染 SSR**

#### 优缺点

| &nbsp;           | 单页面应用(SPA)      | 多页面应用(MPA)                  |
| ---------------- | -------------------- | -------------------------------- |
| 组成             | 一个主页面和页面组件 | 多个完整的页面                   |
| 刷新方式         | 局部刷新             | 整页刷新                         |
| SEO 搜索引擎优化 | 无法实现             | 容易实现                         |
| 页面切换         | 速度快，用户体验良好 | 切换加载资源，速度慢，用户体验差 |
| 维护成本         | 相对容易             | 相对复杂                         |

- 用户体验好、快，内容的改变不需要重新加载整个页面，服务端压力小。

- SPA 应用不利于搜索引擎的抓取。

- 首次渲染速度相对较慢 (第一次返回空的 html，需要再次请求首屏数据) 白屏时间长

#### 解决方案

- 静态页面预渲染(Static Site Generatioh)SSG，在构建时生成完整的 html 页面。(就是在打包的时候先将页面放到浏览器中运行一下，将 HTML 保存起来)，仅适合静态页面网站。变化率不高的

- 网站 SSR+CSR 的方式，首屏采用服务端渲染的方式，后续交互采用客户端渲染方式。`eg. NuxtJS`

### `v-clock` 的作用是什么？

::: tip

Vue.js 中的 `v-clock` 指令是用来解决**初次加载页面**时，由于 Vue 实例尚未完全初始化而导致页面显示原始模板代码的问题的一种技术性指令。

它的作用是在页面加载的过程中隐藏 Vue 模板，直到 Vue 实例完全准备好并可以进行渲染，然后再显示已渲染的内容。

`v-clock` 指令仅仅是一个样式的技巧，它不会影响 Vue 实例的生命周期或数据绑定。
:::

```js
<div v-clock>
  <!-- 这里是需要隐藏的内容 -->
</div>
```

---

## Vue的响应式原理是如何实现的？请描述Object.defineProperty和Proxy的区别及其优缺点

### 1. Vue2的响应式原理：Object.defineProperty

实现方式：
Vue2 通过递归遍历数据对象，使用 Object.defineProperty 为每个属性添加 getter 和 setter，在属性被访问或修改时触发依赖收集和更新。

```javascript
let data = { name: 'Vue2' };
Object.defineProperty(data, 'name', {
  get() {
    console.log('触发getter，收集依赖');
    return val;
  },
  set(newVal) {
    console.log('触发setter，通知更新');
    val = newVal;
  }
});
```

缺点：

无法监听新增/删除属性：必须通过 Vue.set/Vue.delete 手动处理。

数组监听受限：需重写数组方法（如 push, pop）来触发更新。

性能问题：递归遍历整个对象，初始化时性能较差。

### 2. Vue3的响应式原理：Proxy

实现方式：
Vue3 使用 ES6 的 Proxy 代理整个对象，通过拦截操作（如 get, set, deleteProperty）实现响应式。

```javascript
let data = { name: 'Vue3' };
let proxy = new Proxy(data, {
  get(target, key) {
    console.log('触发getter，收集依赖');
    return target[key];
  },
  set(target, key, newVal) {
    console.log('触发setter，通知更新');
    target[key] = newVal;
    return true;
  }
});

```
优点：

全面监听：支持对象/数组的新增、删除操作。

性能优化：惰性依赖收集，避免递归遍历。

更简洁的API：无需额外方法（如 Vue.set）。

缺点：

兼容性问题：不支持 IE11（但Vue3已放弃IE支持）。

| 特性     | Object.defineProperty      | Proxy                   |
| -------- | -------------------------- | ----------------------- |
| 监听范围 | 只能监听已有属性           | 整个对象，包括新增/删除 |
| 数组支持 | 需重写数组方法             | 直接监听数组变化        |
| 性能     | 初始化时递归遍历，性能较差 | 惰性监听，性能更优      |
| 兼容性   | 支持IE9+                   | 不支持IE                |

> Vue 2：使用 Object.defineProperty 进行数据劫持

> Vue 3：使用 Proxy 重写了响应式系统，性能更好且能检测更多变化类型

---

## 什么是 Slot？

Slot（插槽）是 Vue 提供的一种内容分发机制，允许组件模板的一部分内容由父组件提供。简单说，它是在组件中预留的"占位符"，父组件可以向这些占位符中插入任意内容。

### Slot 的核心作用

组件内容定制化：让组件可以接收并渲染外部传入的内容

提高组件复用性：相同结构的组件可以展示不同的内容

解耦父组件和子组件：父组件控制显示内容，子组件控制布局结构

### 具名插槽（Named Slots）

```vue
<!-- 子组件 Layout.vue -->
<template>
  <div class="container">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot> <!-- 默认插槽 -->
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<!-- 父组件使用 -->
<Layout>
  <template v-slot:header>
    <h1>页面标题</h1>
  </template>
  
  <p>这里是主要内容</p> <!-- 会显示在默认插槽 -->
  
  <template v-slot:footer>
    <p>版权信息</p>
  </template>
</Layout>
```

### 作用域插槽（Scoped Slots）

使用场景：子组件需要向插槽内容传递数据时

```vue
<!-- 子组件 TodoList.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item"></slot> <!-- 向插槽传递item数据 -->
    </li>
  </ul>
</template>

<!-- 父组件使用 -->
<TodoList :items="todos">
  <template v-slot:default="slotProps">
    <span :class="{ completed: slotProps.item.completed }">
      {{ slotProps.item.text }}
    </span>
  </template>
</TodoList>
```

---
## 访问一个网站，到加载网页完毕，都经历了哪些过程？

访问一个网站到加载网页完毕的过程涉及多个技术环节，以下是详细的步骤分解：

#### 1. DNS 解析（域名 → IP）

输入URL：用户输入网址（如 www.example.com）。

DNS查询：

浏览器检查本地缓存（如最近访问过的域名）。

若未命中，查询操作系统缓存 → 本地Hosts文件。

若仍无结果，向递归DNS服务器（如ISP提供的DNS）发起请求。

返回IP：浏览器获得目标服务器的IP（如 93.184.216.34）。

2. TCP/IP 连接（三次握手）
TCP三次握手：

SYN：客户端发送同步报文到服务器。

SYN-ACK：服务器确认并回复同步应答。

ACK：客户端确认，连接建立。

HTTPS额外步骤：若为HTTPS，会在此后进行TLS握手（交换密钥、验证证书等）。

3. HTTP 请求与响应
发送HTTP请求：浏览器构造HTTP请求（如 GET / HTTP/1.1），包含请求头（User-Agent、Accept等）。

服务器处理：

服务器解析请求，可能涉及后端逻辑（如数据库查询）。

生成响应（HTML文件、状态码如 200 OK）。

接收响应：服务器返回响应头和响应体（HTML内容）。


1. 动态内容与框架（如React/Vue）
前端框架：

若页面使用框架（如React/Vue），JS会初始化虚拟DOM，绑定事件等。

可能通过API（Ajax/Fetch）加载动态数据，触发重新渲染。

单页应用（SPA）：仅首次加载完整HTML，后续通过JS更新内容。

6. 资源加载与优化
静态资源：图片、字体等按需加载，可能触发懒加载（Lazy Load）。

缓存机制：

浏览器缓存：根据HTTP头（Cache-Control/ETag）决定是否复用本地资源。

CDN加速：静态资源通过CDN边缘节点分发。

7. 连接终止（TCP四次挥手）
页面加载完成后，若无需保持连接（HTTP/1.1默认为持久连接），客户端和服务器通过四次挥手释放TCP连接。

## 列举Vue项目中常见的性能优化手段

### 合理使用 v-for 的 key

为 v-for 提供唯一的 key，帮助 Vue 高效更新虚拟 DOM


#### 组件/路由 懒加载
```javascript
const LazyComponent = () => import('./LazyComponent.vue')
使用动态导入拆分代码，减少初始加载体积
```

#### 函数式组件

无状态、无实例的组件，渲染开销小

```javascript
Vue.component('functional-component', {
  functional: true,
  render(h, context) {
    // 函数式组件实现
  }
})
```

### 计算属性缓存

使用 computed 替代 methods 中重复计算的函数

#### v-show 与 v-if 的选择

频繁切换用 v-show，运行时条件变化用 v-if

#### 避免不必要的响应式数据

对于不会变化的数据，可以不在 data 中声明


## 如何实现Vue路由守卫（如权限控制）？Vuex的action和mutation有什么区别？

> 全局前置守卫 (beforeEach)，是在路由跳转前执行的全局守卫，对所有路由都有效。

```javascript
router.beforeEach((to, from, next) => {
  // 1. 检查目标路由是否需要认证
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 2. 检查用户是否已登录（根据实际项目获取登录状态）
    if (!store.state.user.isAuthenticated) {
      // 3. 未登录则跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 登录后可以重定向回来
      })
    } else {
      // 4. 已登录则继续
      next()
    }
  } else {
    // 不需要认证的路由直接放行
    next()
  }
})
```


> 路由独享守卫 (beforeEnter),只对特定路由生效。

```javascript
const routes = [
  {
    path: '/admin',
    component: AdminPanel,
    beforeEnter: (to, from, next) => {
      if (store.state.user.role !== 'admin') {
        next('/unauthorized')
      } else {
        next()
      }
    }
  }
]
```

> 全局解析守卫 beforeResolve 是在导航被确认之前，所有组件内守卫和异步路由组件被解析之后调用。

> 全局后置钩子 router.afterEach 在导航被确认之后调用。

### Vuex的action和mutation有什么区别？

| 区别点   | Mutation            | Action                              |
| -------- | ------------------- | ----------------------------------- |
| 用途     | 修改state的唯一途径 | 可以包含任意异步操作                |
| 调用方式 | 通过`commit`调用    | 通过`dispatch`调用                  |
| 同步性   | 必须是同步的        | 可以包含异步操作                    |
| 执行顺序 | 直接修改state       | 先处理异步逻辑，再`commit` mutation |
| 调试     | 在devtools中可追踪  | 在devtools中不可直接追踪            |


```javascript
// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    user: null
  },
  
  // Mutations - 必须是同步的
  mutations: {
    increment(state, payload) {
      state.count += payload.amount
    },
    setUser(state, user) {
      state.user = user
    }
  },
  
  // Actions - 可以包含异步操作
  actions: {
    incrementAsync({ commit }, payload) {
      setTimeout(() => {
        commit('increment', payload)
      }, 1000)
    },
    login({ commit }, credentials) {
      return new Promise((resolve, reject) => {
        // 模拟API调用
        setTimeout(() => {
          if (credentials.username === 'admin' && credentials.password === '123456') {
            const user = { name: 'Admin', role: 'admin' }
            commit('setUser', user) // 调用mutation
            resolve(user)
          } else {
            reject(new Error('Invalid credentials'))
          }
        }, 1500)
      })
    }
  }
})

export default store
```

#### 2. 在组件中使用
> 调用 Mutation (使用 commit)

```javascript
// Component.vue
export default {
  methods: {
    incrementCount() {
      // 直接提交mutation
      this.$store.commit('increment', { amount: 5 })
      
      // 或者使用对象风格
      this.$store.commit({
        type: 'increment',
        amount: 5
      })
    }
  }
}
```

> 调用 Action (使用 dispatch)

```javascript
// Component.vue
export default {
  methods: {
    incrementCountAsync() {
      // 分发action
      this.$store.dispatch('incrementAsync', { amount: 3 })
        .then(() => {
          console.log('Count incremented after 1 second')
        })
    },
    
    handleLogin() {
      const credentials = { username: 'admin', password: '123456' }
      
      // 分发login action并处理Promise
      this.$store.dispatch('login', credentials)
        .then(user => {
          console.log('Login successful', user)
          this.$router.push('/dashboard')
        })
        .catch(error => {
          console.error('Login failed', error)
        })
    }
  }
}
```

> 3. 在组合式API中使用

```javascript
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    
    const increment = () => {
      store.commit('increment', { amount: 1 })
    }
    
    const login = () => {
      store.dispatch('login', { username: 'user', password: 'pass' })
        .then(() => {
          console.log('Logged in')
        })
    }
    
    return { increment, login }
  }
}
```

#### 关键区别总结

Mutation

使用 commit 调用
必须是同步的
直接修改 state

Action

使用 dispatch 调用
可以包含异步操作
通常用于处理业务逻辑，然后提交 mutation 来修改 state


## 三栏布局

三栏布局实现方案

### Flexbox 方案

```html
<div class="container">
  <div class="left">Left (200px)</div>
  <div class="center">Center (自适应)</div>
  <div class="right">Right (200px)</div>
</div>
```

```css
.container {
  display: flex;
  height: 100vh;
}

.left, .right {
  flex: 0 0 200px; /* 不放大，不缩小，固定200px */
  background: #f0f0f0;
}

.center {
  flex: 1; /* 占据剩余空间 */
  background: #e0e0e0;
}
```

#### 水平垂直居中 Flexbox

```css
.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  height: 100vh;           /* 需要明确高度 */
}
```

## 防抖(debounce) 和 节流(throttle)函数

### 防抖(debounce)函数实现
防抖函数的作用是在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。

```javascript
function debounce(fn) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, 1000);
  };
}

```
### 节流(throttle)函数实现
节流函数的作用是在规定的时间内，函数只会被执行一次。

```javascript
function throttle(fn) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= 1000) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}
```

应用场景
防抖(debounce)应用场景：
搜索框输入联想（等待用户停止输入后再发送请求）
窗口大小调整（等待调整结束后再计算布局）
表单验证（用户输入完成后才验证）

节流(throttle)应用场景：
滚动加载更多（每隔一段时间检查位置）
按钮点击防止重复提交
鼠标移动事件（如拖拽）