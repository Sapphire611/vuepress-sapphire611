---
title: 前端面试题目相关
date: 2026-03-14
categories:
  - Frontend
tags:
  - interview
  - javascript
sidebar: 'auto'
publish: true
---

## 👋 前端面试题目整理

:::right
来自 [Sapphire611](http://sapphire611.github.io)
:::

## Ajax 是什么？如何手动封装一个 Ajax

Ajax 是 `Asynchronous JavaScript and XML`（异步 JavaScript 和 XML）的缩写，它不是一种新技术，而是一种前端开发技术组合，核心是通过 `XMLHttpRequest（XHR）`对象（现代也常用 fetch）在不刷新整个页面的情况下，与服务器异步交换数据，实现页面局部更新。

```js
/**
 * 封装 Ajax 请求函数
 * @param {Object} options - 请求配置项
 * @param {String} options.url - 请求地址
 * @param {String} [options.method='GET'] - 请求方法（GET/POST）
 * @param {Object} [options.data={}] - 请求参数
 * @param {Number} [options.timeout=5000] - 超时时间（毫秒）
 * @param {String} [options.contentType='application/x-www-form-urlencoded'] - 请求头Content-Type
 * @param {Function} options.success - 请求成功回调
 * @param {Function} options.error - 请求失败回调
 */
function ajax(options) {
  // 初始化默认配置
  const config = {
    url: '',
    method: 'GET',
    data: {},
    timeout: 5000,
    contentType: 'application/x-www-form-urlencoded',
    success: () => {},
    error: () => {},
  };

  // 合并用户配置与默认配置
  Object.assign(config, options);

  // 处理 GET 请求参数（拼接到 URL 后）
  function handleGetParams(url, data) {
    if (Object.keys(data).length === 0) return url;
    const params = new URLSearchParams(data).toString();
    return url.includes('?') ? `${url}&${params}` : `${url}?${params}`;
  }

  // 处理 POST 请求参数（根据 Content-Type 格式化）
  function handlePostData(data, contentType) {
    if (contentType === 'application/json') {
      return JSON.stringify(data);
    } else {
      return new URLSearchParams(data).toString();
    }
  }

  // 创建 XHR 对象
  const xhr = new XMLHttpRequest();

  // 处理请求方法和 URL
  const method = config.method.toUpperCase();
  let url = config.url;
  if (method === 'GET') {
    url = handleGetParams(url, config.data);
  }

  // 初始化请求
  xhr.open(method, url, true); // 第三个参数为 true 表示异步

  // 设置请求头
  if (method === 'POST') {
    xhr.setRequestHeader('Content-Type', config.contentType);
  }

  // 设置超时时间
  xhr.timeout = config.timeout;

  // 监听响应状态变化
  xhr.onreadystatechange = function () {
    // readyState 为 4 表示请求完成
    if (xhr.readyState === 4) {
      // 状态码 200-299 表示请求成功
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          // 尝试解析 JSON 响应（前端常用）
          const response = JSON.parse(xhr.responseText);
          config.success(response);
        } catch (e) {
          // 解析失败则返回原始文本
          config.success(xhr.responseText);
        }
      } else {
        // 状态码异常触发错误回调
        config.error({
          status: xhr.status,
          message: '请求失败，状态码异常',
        });
      }
    }
  };

  // 监听超时事件
  xhr.ontimeout = function () {
    config.error({
      status: 408,
      message: `请求超时（${config.timeout}ms）`,
    });
    xhr.abort(); // 终止请求
  };

  // 监听网络错误
  xhr.onerror = function () {
    config.error({
      status: 0,
      message: '网络错误，请求失败',
    });
  };

  // 发送请求
  if (method === 'POST') {
    const postData = handlePostData(config.data, config.contentType);
    xhr.send(postData);
  } else {
    xhr.send(null); // GET 请求无请求体，传 null
  }

  // 返回 xhr 对象，支持手动终止请求等操作
  return xhr;
}

// ---------------------- 使用示例 ----------------------
// 1. GET 请求示例
ajax({
  url: '/api/user/list',
  method: 'GET',
  data: { page: 1, size: 10 },
  success: (res) => {
    console.log('GET 请求成功：', res);
  },
  error: (err) => {
    console.error('GET 请求失败：', err);
  },
});

// 2. POST 请求（JSON 格式）示例
ajax({
  url: '/api/user/add',
  method: 'POST',
  data: { name: '张三', age: 25 },
  contentType: 'application/json',
  success: (res) => {
    console.log('POST 请求成功：', res);
  },
  error: (err) => {
    console.error('POST 请求失败：', err);
  },
});
```

### 封装思路讲解（面试时可口述）

1. 配置默认值：避免用户不传配置导致报错，提升函数健壮性；

2. 参数处理：GET 参数拼接到 URL，POST 参数根据 Content-Type 格式化（支持表单格式和 JSON 格式）；

3. 异常处理：覆盖状态码异常、超时、网络错误等场景，让错误回调更实用；

4. 异步特性：基于 XHR 原生异步机制，不阻塞主线程；

5. 扩展性：返回 XHR 对象，支持手动终止请求（xhr.abort()）等扩展操作

---

## Promise.all Vs Promise.allSettled

> Promise.all 和 Promise.allSettled 都是用于处理多个 Promise 的并发方法，但它们在错误处理上有显著差异。

### Promise.all

短路效应：只要有一个 Promise 被拒绝（rejected），整个 Promise.all 会立即拒绝

结果格式：所有 Promise 都成功时，返回一个包含所有成功结果的数组

错误处理：只能捕获到第一个发生的错误

```javascript
const promises = [
  Promise.resolve(1),
  Promise.reject(new Error('失败1')),
  Promise.resolve(3),
  Promise.reject(new Error('失败2')), // 这个错误不会被捕获到
];

Promise.all(promises)
  .then((results) => {
    console.log('成功:', results); // 不会执行
  })
  .catch((error) => {
    console.log('捕获到错误:', error.message); // 输出: "失败1"
  });
```

### Promise.allSettled

不会短路：等待所有 Promise 完成（无论成功或失败）

结果格式：返回一个对象数组，每个对象包含状态和值/原因

错误处理：可以获取所有 Promise 的最终状态

示例：

```javascript
const promises = [Promise.resolve(1), Promise.reject(new Error('失败1')), Promise.resolve(3), Promise.reject(new Error('失败2'))];

Promise.allSettled(promises).then((results) => {
  console.log('所有结果:');
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`Promise ${index}: 成功 -`, result.value);
    } else {
      console.log(`Promise ${index}: 失败 -`, result.reason.message);
    }
  });
});
```

### Http 301、302、307 之间的区别

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

### 301 和 302 对于 seo 来说哪个更好

::: tip
如果你进行了永久性更改，希望搜索引擎更新其索引以指向新 URL，并传递排名和权重，那么使用 301 是更好的选择。
但如果你只需要临时将流量重定向到另一个页面，而不希望影响搜索引擎索引，那么可以考虑使用 302 或 307。
:::

### 跨域是什么、如何解决

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

### HTTPS 握手过程

[HTTPS 握手过程](https://www.jianshu.com/p/e30a8c4fa329)

---

### Decorator 的作用，编译后是怎样的

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

### Symbol 是什么，一般用来做什么

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

### csrf 是什么?如何防范

> CSRF（Cross-Site Request Forgery），跨站点请求伪造，是一种网络攻击，它利用受害者已经在另一个网站上进行了身份验证的事实，伪造受害者的请求并发送给目标网站。攻击者通过 CSRF 攻击可以以受害者的身份执行未经授权的操作，例如更改密码、发送消息、或执行其他可能对用户数据和隐私产生影响的操作。

#### 同源策略（Same-Origin Policy）：

> 同源策略是浏览器的一项安全机制，它防止一个网页中的 JavaScript 代码发送跨域请求。确保不在同一域的网站无法访问对方的数据，从而减少 CSRF 攻击的风险。

#### CSRF Token：

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

### 描述链表的反转怎样实现，复杂度多少?

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

LinkedList.prototype.addToHead = function (data) {
  const newNode = new Node(data);
  newNode.next = this.head;
  this.head = newNode;
};

LinkedList.prototype.addToTail = function (data) {
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

LinkedList.prototype.deleteNode = function (data) {
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

### 把 callback 改写成 Promise

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
```

### 手写装饰器

| 装饰器类型   | 语法示例                          | 主要参数                       | 用途说明                |
| ------------ | --------------------------------- | ------------------------------ | ----------------------- |
| 类装饰器     | `@decorator class MyClass {}`     | `constructor`                  | 修改或替换类定义        |
| 方法装饰器   | `@decorator myMethod() {}`        | `target, name, descriptor`     | 拦截/修改方法行为       |
| 属性装饰器   | `@decorator myProperty;`          | `target, name`                 | 修改属性描述符          |
| 访问器装饰器 | `@decorator get myProp() {}`      | `target, name, descriptor`     | 修改 getter/setter 行为 |
| 参数装饰器   | `myMethod(@decorator param) {}`   | `target, name, parameterIndex` | 标记或修改参数          |
| 装饰器工厂   | `@decoratorFactory(arg) class {}` | 自定义参数                     | 创建可配置的装饰器      |

```js
function createLoggedMethod(className, methodName, originalMethod) {
  return function (...args) {
    console.log(`调用方法 ${methodName},参数 ${args}`);
    const result = originalMethod.apply(this, args);
    console.log(`方法 ${methodName} 返回值 ${result}`);
    return result;
  };
}
```

```js
class Calculator {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }
}

// 直接替换方法
Calculator.prototype.add = createLoggedMethod('Calculator', 'add', Calculator.prototype.add);
Calculator.prototype.multiply = createLoggedMethod('Calculator', 'multiply', Calculator.prototype.multiply);

const calc = new Calculator();
calc.add(2, 3); // 会有输出
calc.multiply(2, 3); // 会有输出
```

### 如何预防 XSS 攻击？

> 👀 预防跨站脚本攻击（XSS）是构建安全 web 应用程序的重要一环。XSS 攻击的目标是向网页注入恶意脚本，以便攻击者可以窃取用户的信息或执行恶意操作。以下是一些防止 XSS 攻击的最佳实践：

1. 输入验证和过滤：

对于所有用户输入的数据，包括表单输入、URL 参数和 cookie，都要进行验证和过滤。只允许预期的、合法的字符和数据通过。

2. 转义输出
   在将用户输入显示在网页上之前，确保对其进行适当的转义。这可以通过编程语言的内置函数或模板引擎来完成，以确保任何用户输入都不会被解释为代码。使用安全的 HTML、CSS 和 JavaScript 输出编码方法，

```js
如 htmlspecialchars()、encodeURIComponent(),md5() 等。
```

3. 内容安全策略 (CSP)：
   配置 CSP 头，限制浏览器加载和执行的内容。CSP 可以阻止内联脚本和其他不受信任的内容，减少 XSS 攻击的风险。
   在 HTTP 头中包含 Content-Security-Policy 来启用 CSP。

```js
Content-Security-Policy: same-origin // 只允许加载同源的资源
Content-Security-Policy: default-src 'self' www.example.com // 只允许加载同源的资源和 www.example.com 域名下的资源
Content-Security-Policy: script-src 'none'
```

### http 和 https 的区别？证书认证过程？pki？

|          | http | https |
| -------- | ---- | ----- |
| 传输协议 | 明文 | 加密  |
| 默认端口 | 80   | 443   |
| 证书     | 无   | 有    |

HTTPS 证书认证过程:

1. 服务器端证书生成:
   服务器管理员生成一个证书请求（CSR），其中包含服务器的公钥。
   证书请求被发送到受信任的证书颁发机构（CA）。

2. 证书颁发机构认证:
   CA 验证证书请求的合法性，并验证服务器所有者的身份。
   CA 签发包含服务器公钥的数字证书，并使用 CA 的私钥进行签名。

3. 服务器配置证书:
   服务器收到 CA 签发的证书后，将其配置到服务器上。

4. 客户端验证:
   当客户端连接到服务器时，服务器会返回证书。
   客户端的浏览器会验证证书的有效性，包括检查 CA 的签名和证书是否在有效期内。
   如果证书有效，客户端会生成一个随机的对称密钥，然后使用服务器的公钥加密它，并将其发送回服务器。
   建立安全通信:

::: tip
服务器使用其私钥解密客户端发送的随机密钥。
从此刻起，客户端和服务器之间的通信都使用这个共享的对称密钥进行加密和解密。
:::

#### 公钥基础设施（PKI）:

- PKI 是一种广泛用于加密和认证的体系结构。它包括证书颁发机构（CA）和数字证书，用于确保安全通信。PKI 的基本原理是使用非对称加密，其中每个实体（如服务器或用户）都有一对公钥和私钥。私钥是保密的，而公钥可以公开使用。CA 颁发数字证书，用于验证公钥的真实性和身份。

- 在 HTTPS 中，PKI 用于确保服务器的身份，并协助在客户端和服务器之间建立加密通信。通过 CA 颁发的数字证书，客户端可以验证服务器的身份，从而确保它正在与预期的安全服务器通信。

> 总之，HTTP 是一种不安全的协议，而 HTTPS 使用加密和数字证书来保护通信的安全性和真实性。 PKI 是 HTTPS 的基础，用于验证和加密通信。

### 如何 做 http 缓存

> HTTP 缓存是一种用于提高网站性能和减少服务器负载的技术。通过将资源（如网页、图像、样式表和脚本）缓存在客户端浏览器或中间代理服务器上，可以减少重复的请求，从而加快页面加载速度。以下是实施 HTTP 缓存的一般步骤：

1. 设置 HTTP 头部：
   在 HTTP 响应头部中设置缓存相关的 HTTP 头部是实施 HTTP 缓存的第一步。以下是常用的 HTTP 头部：

```bash
Cache-Control：这个头部用于指定缓存策略。常见的指令包括：
  max-age=<seconds>：定义资源在客户端缓存中的最大存活时间（秒）。
  s-maxage=<seconds>：与max-age类似，但仅适用于共享缓存（例如代理服务器）。
  public：指示响应可以被任何缓存存储。
  private：指示响应只能被单个用户的私有缓存存储。
  no-store：禁止缓存，每次请求都必须从服务器获取最新资源。
  no-cache：缓存资源需要经过重新验证，即需要与服务器确认资源是否过期。
Expires：定义资源的过期日期，是一个HTTP日期时间格式。
ETag：给每个资源分配一个唯一的标识符，服务器可以使用它来验证资源是否发生了变化。
Last-Modified：资源的最后修改日期，也用于验证资源是否发生了变化。
```

### TCP / UDP

|        | TCP                        | UDP            |
| ------ | -------------------------- | -------------- |
| 安全性 | 可靠性                     | 不可靠         |
| 连接   | 有，双向，流控制和拥塞控制 | 无连接，低开销 |
| 适用于 | 可靠性要求高               | 实时应用       |

### 算法题目

1. 求 x 的 n 次方, 不能用 Math.pow(x,n)

```js
const pow = (x, n) => {
  if (n === 0) return 1;

  return x * pow(x, n - 1);
};
```

2. 手写 arr.flat() ,

```js
const arr = [
  [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ],
  [
    [11, 12, 13],
    [14, 15, 16],
    [17, 18, 19],
  ],
  [
    [21, 22, 23],
    [24, 25, 26],
    [27, 28, 29],
  ],
];

const myflat = (arr) => {
  let result = [];
  for (const each of arr) {
    if (Array.isArray(each)) result = result.concat(myflat(each));
    else result.push(each);
  }
  return result;
};

const flattenedArr = myflat(arr);
console.log(flattenedArr);
```