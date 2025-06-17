---
title: 前端面试题目整理
date: 2025-06-15
categories:
  - Frontend
tags:
  - vue
  - interview
sidebar: 'auto'
publish: true
showSponsor: true
---

## 👋 VUE 面试题目整理

:::right
来自 [Sapphire611](http://sapphire611.github.io)
:::

## 1.Http 301、302、307 之间的区别

> 301 Moved Permanently (永久重定向):

- 当服务器返回状态码 **301** 时，它表示所请求的资源**已被永久移动到一个新的 URL**,浏览器会将原始 URL 缓存，并在未来的请求中直接使用新的 URL，不再请求旧的 URL。

这通常用于在网站结构发生永久更改时，以确保搜索引擎和浏览器更新其索引和书签。

> 302 Found (临时重定向):

状态码 **302** 表示所请求的资源**已被临时移动到一个新的 URL**，但这个变化可能是暂时的。

浏览器会请求新的 URL，但会保留原始 URL 以备将来使用。这个状态码常用于短期维护或临时性更改。

> 307 Temporary Redirect (临时重定向):

- **307** 状态码与 **302** 类似，也表示所请求的资源已被临时移动到一个新的 URL。

与 **302** 不同的是，浏览器会以与原始请求相同的方式请求新的 URL，并保留原始请求的请求方法。

::: tip
这个状态码通常用于需要保持相同请求方法（GET、POST 等）的情况。

**301** 表示永久重定向，浏览器会在未来的请求中直接使用新的 URL

**302** 和 **307** 表示临时重定向，浏览器会请求新的 URL，但可能在将来再次请求原始 URL。

使用哪个状态码取决于重定向的性质，是永久的还是暂时的，以及是否需要保持相同的请求方法。
:::

### 2. 301 和 302 对于 seo 来说哪个更好

::: tip
如果你进行了永久性更改，希望搜索引擎更新其索引以指向新 URL，并传递排名和权重，那么使用 301 是更好的选择。
但如果你只需要临时将流量重定向到另一个页面，而不希望影响搜索引擎索引，那么可以考虑使用 302 或 307。
:::

### 3.跨域是什么、如何解决

> 跨域（Cross-Origin）是指在 Web 安全模型下，一个网页的源（Origin）尝试请求来自另一个源的资源（例如，不同域名、协议或端口的资源）。浏览器会实施同源策略（Same-Origin Policy），阻止跨域请求，以防止潜在的安全风险，如跨站请求伪造（CSRF）和数据泄露。

#### 3.1 CORS（跨源资源共享）:

CORS 是一种由浏览器实施的安全策略，允许服务器指定哪些域名可以访问其资源。

服务器在响应头中包含 CORS 相关的 HTTP 标头，例如`Access-Control-Allow-Origin`，以允许特定域名的跨域请求。

```js
'Access-Control-Allow-Origin'  : '*'
'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE'
'Access-Control-Allow-Headers' : 'Content-Type'
```

CORS 提供了细粒度的控制，可以限制哪些 HTTP 方法和标头是允许的。

#### 3.2 JSONP（JSON with Padding）:

- JSONP 是一种通过动态添加`<script>`标签从其他域获取 JSON 数据的方法。

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

::: warning 4.jsonp 有什么缺点

1. 安全问题，需要完全信任对方站点
2. 仅支持 GET
3. 处理错误困难
   :::

### 3.3 代理服务器:

> 在同一域名下设置一个代理服务器，允许从客户端访问该代理服务器，然后由代理服务器来请求其他域的资源。

- 这种方法需要在服务器端编写额外的代码，但可以有效解决跨域问题

### 5.图片 base64 和外链的应用场景，各有什么优缺点

| 方式         | 优点             | 缺点               |
| ------------ | ---------------- | ------------------ |
| Base64 编码  | 减少 HTTP 请求   | 增加 HTML 文件大小 |
| &nbsp;       | 单个请求         | 浪费带宽,缓存问题  |
| 外链加载图片 | 较小的 HTML 文件 | 增加 HTTP 请求     |
| &nbsp;       | 浏览器缓存       | 潜在的并行请求限制 |
| &nbsp;       | 更好的可维护性   |

### 6.HTTP 缓存 机制

[如何做 HTTP 缓存](/backend/node/node_interview/#_6-如何-做-http-缓存)

### 7. HTTPS 握手过程

[HTTPS 握手过程](https://www.jianshu.com/p/e30a8c4fa329)

---

### 8.Decorator 的作用，编译后是怎样的

> JavaScript 装饰器（Decorators）是一种用于修改类、方法或属性行为的语法糖，它们通常用于增强代码的**可维护性**和**可读性**。

> 装饰器本身是函数，它接受一个目标（target）对象（通常是类的构造函数、类的方法、或类的属性）作为参数，然后返回一个新的目标对象，或者修改原始目标对象的行为。

> 装饰器在 JavaScript 中通常与类和类成员一起使用。

```js
// 装饰器函数
function log(target, key, descriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args) {
    console.log(`Calling ${key} with arguments ${args}`);
    const result = originalMethod.apply(this, args);
    console.log(`${key} returned ${result}`);
    return result;
  };

  return descriptor;
}
```

```js
// 编译前
class Calculator {
  @log
  add(a, b) {
    return a + b;
  }
}
```

```js
// 编译后
var Calculator = (function () {
  function Calculator() {
    _classCallCheck(this, Calculator);
  }

  _createClass(Calculator, [
    {
      key: 'add',
      value: function add(a, b) {
        return a + b;
      },
    },
  ]);

  return Calculator;
})();
```

### 9. Symbol 是什么，一般用来做什么

> Symbol 是 ECMAScript 6（ES6）引入的一种新的原始数据类型。它是 JavaScript 中的一种特殊值，具有以下特点：

- 唯一性：每个 Symbol 值都是唯一的，即使它们具有相同的描述（描述是 Symbol 的可选参数）。这使得 Symbol 可用于创建不会意外冲突的属性名。

- 不可变性：Symbol 值是不可变的，不能被修改或更改。

#### 属性名的保护

> 由于 Symbol 值的唯一性，它们可以用作对象的属性名，以确保属性不会被意外覆盖或冲突。这在创建类似于枚举的功能时很有用。

```js
const RED = Symbol('red');
const BLUE = Symbol('blue');

const colors = {
  [RED]: '#FF0000',
  [BLUE]: '#0000FF',
};

console.log(colors[RED]); // 输出: #FF0000
```

### 10.csrf 是什么如何防范

> CSRF（Cross-Site Request Forgery），跨站点请求伪造，是一种网络攻击，它利用受害者已经在另一个网站上进行了身份验证的事实，伪造受害者的请求并发送给目标网站。攻击者通过 CSRF 攻击可以以受害者的身份执行未经授权的操作，例如更改密码、发送消息、或执行其他可能对用户数据和隐私产生影响的操作。

#### 10.1 同源策略（Same-Origin Policy）：

> 同源策略是浏览器的一项安全机制，它防止一个网页中的 JavaScript 代码发送跨域请求。确保不在同一域的网站无法访问对方的数据，从而减少 CSRF 攻击的风险。

#### 10.2 CSRF Token：

> 使用 CSRF Token 是防范 CSRF 攻击的一种常见方法。每个用户会话都生成一个唯一的 CSRF Token，该 Token 在用户提交请求时需要包含在请求中。

> 服务器在接收请求时验证 CSRF Token 的有效性，如果不匹配，则拒绝请求。这样即使攻击者试图伪造请求，他们无法获得合法用户的 CSRF Token。

### 10.3 SameSite Cookie 属性：

> 使用 SameSite Cookie 属性可以减少 CSRF 攻击的风险。通过将 Cookie 设置为`SameSite=Strict`或`SameSite=Lax`

> 可以限制 Cookie 仅在同站点请求时发送，从而降低 CSRF 攻击的可能性。

```js
// csurf 是一个Node.js中间件，用于防范CSRF（Cross-Site Request Forgery）攻击。它的英文全称是"Cross-Site Request Forgery"，与其作用相符。这个中间件可以用于Express和Connect等Node.js web框架，以帮助保护应用程序免受CSRF攻击。

const csurf = require('csurf');
const csrfProtection = csurf({ cookie: true });
app.use(csrfProtection);
```

### 11.描述链表的反转怎样实现，复杂度多少?

```js
class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

function reverseLinkedList(head) {
  // 辅助函数，用于递归反转链表
  function reverse(current, prev) {
    if (!current) {
      return prev;
    }
    const next = current.next;
    current.next = prev;
    return reverse(next, current);
  }

  // 调用辅助函数，传入头节点和初始的前一个节点（null）
  return reverse(head, null);
}

// 创建一个示例链表: 1 -> 2 -> 3 -> 4 -> 5
const head = new ListNode(1);
let current = head;
for (let i = 2; i <= 5; i++) {
  current.next = new ListNode(i);
  current = current.next;
}

// 反转链表
const reversedHead = reverseLinkedList(head);

// 打印反转后的链表
let result = [];
let currentNode = reversedHead;
while (currentNode) {
  result.push(currentNode.val);
  currentNode = currentNode.next;
}
console.log(result); // 输出: [5, 4, 3, 2, 1]
```

### 12.实现 instanceOf

```js
function customInstanceOf(obj, constructor) {
  // 检查是否是对象
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  // 获取对象的原型
  let proto = Object.getPrototypeOf(obj);
  // console.log('proto1 = ' + JSON.stringify(proto));

  // 递归向上查找原型链，直到找到构造函数的原型
  while (proto !== null) {
    if (proto === constructor.prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
    // console.log('proto2 = ' + JSON.stringify(proto))
  }
a
  return false;
}

// 示例类
function Person(name) {
  this.name = name;
}

const person = new Person('Alice');

console.log(customInstanceOf(person, Person)); // 输出: true
console.log(customInstanceOf(person, Object)); // 输出: true
console.log(customInstanceOf(person, Array)); // 输出: false
```

### 13.实现链表的添加、删除。 复杂度多少

```js
class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
}

LinkedList.prototype.addToHead = function(data) {
  const newNode = new Node(data);
  newNode.next = this.head;
  this.head = newNode;
};

LinkedList.prototype.addToTail = function(data) {
  const newNode = new Node(data);
  if (!this.head) {
    this.head = newNode;
  } else {
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = newNode;
  }
};

LinkedList.prototype.deleteNode = function(data) {
  if (!this.head) {
    return;
  }
  if (this.head.data === data) {
    this.head = this.head.next;
    return;
  }
  let current = this.head;
  while (current.next) {
    if (current.next.data === data) {
      current.next = current.next.next;
      return;
    }
    current = current.next;
  }
};

```

时间复杂度分析：

在链表头部插入节点的时间复杂度为 O(1)，因为无论链表的大小如何，插入操作都是常数时间。

在链表尾部追加节点的时间复杂度为 O(n)，其中 n 是链表的长度，因为需要遍历链表以找到尾节点。

删除特定节点的时间复杂度为 O(n)，因为需要遍历链表以找到要删除的节点。
---


### 14.react hook 的局限性

> 1. 函数组件无法使用 class 组件的 state 属性。

> 2. 函数组件无法使用生命周期方法。

> 3. 函数组件无法使用 ref 属性。


### 15.react 调用 setState 之后发生了什么
1. React 调用 setState 之后，React 会将新的 state 和 props 传递给组件的 render 方法，然后 React 会生成新的 DOM 元素。
2. React 会将新的 DOM 元素渲染到 DOM 中。
3. React 会将新的 DOM 元素与旧的 DOM 元素进行比较，并生成一个更新计划。
4. React 会将更新计划应用到旧的 DOM 元素上，从而实现更新。

### 16. 把 callback 改写成 Promise

```js
function test(arg, callback) {
  // …
  if (err) {
    callback(err);
  } else {
    callback(null, arg);
  }
}

function testAsync(arg) {
  //… Write here
}

const main = async function () {
  try {
    const a = await testAsync(arg);
  } catch (error) {
    console.error(error);
  }
};
main();
```

---

```js
/**
 *  @Author     :   ruanchuhao
 *  @Date       :   2022/11/30
 *  @Name       :   test.js
 *  @Content    :   ruanchuhao@shgbit.com
 *  @Desc       :
 */

'use strict';

// ### 把 callback 改写成 Promise

function test(arg, callback) {
  const err = undefined;
  // …
  if (err) {
    callback(err);
  } else {
    callback(null, arg);
  }
}

function testAsync(arg) {
  return new Promise((resolve, reject) => {
    test(arg, (err, arg) => {
      if (err) {
        reject(err);
      } else {
        resolve(arg);
      }
    });
  });
}

const main = async function () {
  try {
    const arg = {};
    const a = await testAsync(arg);
    console.log(a);
  } catch (error) {
    console.error(error);
  }
};

main();

