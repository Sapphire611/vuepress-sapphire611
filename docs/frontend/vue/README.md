---
title: VUE 题目整理
date: 2023-10-27
categories:
  - frontend
tags:
  - vue
  - interview
sidebar: 'auto'
publish: true
showSponsor: true
---

## 👋 VUE 题目整理

:::right
VUE 是一套用于构建用户界面的**渐进式框架**,采用虚拟 DOM 渲染页面，区分编译时和运行时，组件化（高内聚、低耦合、单向数据流）
:::

## 1. 谈谈你对 `VUE`的理解

#### 1.1 `MVVM` VS `MVC`

> `MVVM` = `Model(数据模型)-View(UI)-ViewModel`,是一种设计思想

- Model 和 ViewModel 之间的交互是双向的， 因此 View 数据的变化会同步到 Model 中，而 Model 数据的变化也会立即反应到 View 上，双向数据绑定完全是自动的

- 因此开发者只需关注业务逻辑，不需要手动操作 DOM，不需要关注数据状态的同步问题，复杂的数据状态维护完全由 MVVM 来统一管理。

::: warning
VUE 不能完全被称为 MVVM，但借鉴了其中的思想
:::

#### 1.2 虚拟 `DOM` 和 `diff` 算法

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

### 2. 谈谈你对 SPA 的理解

- SPA (single-page application) 单页应用，默认情况下我们编写 Vue、React 都只有一个 html 页面，并且提供一个挂载点，最终打包后会再此页面中引入对应的资源。 (页面的渲染全部是由 JS 动态进行渲染的)。切换页面时通过监听路由变化，渲染对应的页面

**Client Side Rendering，客户端渲染 CSR**

- MPA (Multi-page application) 多页应用，多个 html 页面。每个页面必须重复加载，js，css 等相关资源。(服务端返回完整的 html，同时数据也可以再后端进行获取一并返回“模板引擎”)。多页应用跳转需要整页资源刷新。

**Server side Rendering，服务器端渲染 SSR**

### 2.2 优缺点

| &nbsp; | 单页面应用(SPA) | 多页面应用(MPA) |
| ------ | --------------- | --------------- |
| 组成 | 一个主页面和页面组件 | 多个完整的页面 |
| 刷新方式 | 局部刷新 | 整页刷新 |
| SEO 搜索引擎优化 | 无法实现 | 容易实现 |
| 页面切换 | 速度快，用户体验良好 | 切换加载资源，速度慢，用户体验差
| 维护成本 | 相对容易 | 相对复杂

- 用户体验好、快，内容的改变不需要重新加载整个页面，服务端压力小。

- SPA应用不利于搜索引擎的抓取。

- 首次渲染速度相对较慢 (第一次返回空的 html，需要再次请求首屏数据) 白屏时间长

### 2.3 解决方案

- 静态页面预渲染(Static Site Generatioh)SSG，在构建时生成完整的 html 页面。(就是在打包的时候先将页面放到浏览器中运行一下，将 HTML 保存起来)，仅适合静态页面网站。变化率不高的

- 网站 SSR+CSR 的方式，首屏采用服务端渲染的方式，后续交互采用客户端渲染方式。`eg. NuxtJS`
