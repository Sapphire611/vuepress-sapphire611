---
title: 前端面试题目整理
date: 2023-10-23
categories:
  - frontend
tags:
  - vue
  - interview
sidebar: "auto"
publish: true
showSponsor: true
---

## 👋 VUE 面试题目整理

:::right
来自 [Sapphire611](http://sapphire611.github.io)
:::

##  1.Http 301、302、307之间的区别

> 301 Moved Permanently (永久重定向):

- 当服务器返回状态码 **301** 时，它表示所请求的资源**已被永久移动到一个新的URL**,浏览器会将原始URL缓存，并在未来的请求中直接使用新的URL，不再请求旧的URL。

这通常用于在网站结构发生永久更改时，以确保搜索引擎和浏览器更新其索引和书签。

> 302 Found (临时重定向):

状态码 **302** 表示所请求的资源**已被临时移动到一个新的URL**，但这个变化可能是暂时的。

浏览器会请求新的URL，但会保留原始URL以备将来使用。这个状态码常用于短期维护或临时性更改。

> 307 Temporary Redirect (临时重定向):

- **307** 状态码与 **302** 类似，也表示所请求的资源已被临时移动到一个新的URL。

与 **302** 不同的是，浏览器会以与原始请求相同的方式请求新的URL，并保留原始请求的请求方法。

::: tip
这个状态码通常用于需要保持相同请求方法（GET、POST等）的情况。

**301** 表示永久重定向，浏览器会在未来的请求中直接使用新的URL

**302** 和 **307** 表示临时重定向，浏览器会请求新的URL，但可能在将来再次请求原始URL。

使用哪个状态码取决于重定向的性质，是永久的还是暂时的，以及是否需要保持相同的请求方法。
:::

### 2.301和302对于seo来说哪个更好

::: tip
如果你进行了永久性更改，希望搜索引擎更新其索引以指向新URL，并传递排名和权重，那么使用 301 是更好的选择。
但如果你只需要临时将流量重定向到另一个页面，而不希望影响搜索引擎索引，那么可以考虑使用 302 或 307。
:::


### 3.跨域是什么、如何解决

> 跨域（Cross-Origin）是指在Web安全模型下，一个网页的源（Origin）尝试请求来自另一个源的资源（例如，不同域名、协议或端口的资源）。浏览器会实施同源策略（Same-Origin Policy），阻止跨域请求，以防止潜在的安全风险，如跨站请求伪造（CSRF）和数据泄露。

#### 3.1 CORS（跨源资源共享）:

CORS是一种由浏览器实施的安全策略，允许服务器指定哪些域名可以访问其资源。

服务器在响应头中包含CORS相关的HTTP标头，例如`Access-Control-Allow-Origin`，以允许特定域名的跨域请求。

```js
'Access-Control-Allow-Origin'  : '*'
'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE'
'Access-Control-Allow-Headers' : 'Content-Type'
```

CORS提供了细粒度的控制，可以限制哪些HTTP方法和标头是允许的。


#### 3.2 JSONP（JSON with Padding）:

- JSONP是一种通过动态添加`<script>`标签从其他域获取JSON数据的方法。

```js
<body>
  <div id="result"></div>
</body>

<script> ... </script>
```

```js
const script = document.createElement('script');
// 指定要请求的JSONP URL，包括回调函数名
script.src = 'http://example.com/data?callback=' + callbackName;
document.getElementById('result').textContent = data.message;
```
::: warning 4.jsonp有什么缺点 
1. 安全问题，需要完全信任对方站点
2. 仅支持GET
3. 处理错误困难
:::

### 3.3 代理服务器:

> 在同一域名下设置一个代理服务器，允许从客户端访问该代理服务器，然后由代理服务器来请求其他域的资源。

- 这种方法需要在服务器端编写额外的代码，但可以有效解决跨域问题

### 5.图片base64和外链的应用场景，各有什么优缺点


方式 | 优点 | 缺点
---|---|---
Base64编码	| 减少HTTP请求	| 增加HTML文件大小
&nbsp; | 单个请求	| 浪费带宽,缓存问题
外链加载图片 | 较小的HTML文件 | 增加HTTP请求
&nbsp; | 浏览器缓存	| 潜在的并行请求限制
&nbsp; | 更好的可维护性	

### 6.HTTP 缓存 机制

[如何做HTTP缓存](/backend/node/node_interview/#_6-如何-做-http-缓存)

### 7. HTTPS 握手过程

[HTTPS 握手过程](https://www.jianshu.com/p/e30a8c4fa329)

![HTTPS 握手过程](https://upload-images.jianshu.io/upload_images/16749538-3ae48d5925636dc1.png?imageMogr2/auto-orient/strip|imageView2/2/w/1000/format/webp)

![客户端和服务端之间的加密机制](https://upload-images.jianshu.io/upload_images/16749538-a2fba1f52516cc42.png?imageMogr2/auto-orient/strip|imageView2/2/w/664/format/webp)


8.set/map的区别
9.hook的局限性
10.setState和hook的区别
11.decorator的作用，编译后是怎样的
12.symbol是什么，一般用来做什么
13.csrf 是什么如何防范
14.sql注入是什么，如何防范
15.react 调用setState之后发生了什么
17.pm2有哪些模式?
19.移动端一个元素拖动，如何实现和优化?
20.for in/for of的区别
21.描述链表的反转怎样实现，复杂度多少?
22.实现instanceOf
23实现一个对象被for of遍历
24.实现链表的添加、删除。复杂度多少