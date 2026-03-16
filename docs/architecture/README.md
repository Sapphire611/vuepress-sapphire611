---
title: 架构风格 && 数据交互 相关
date: 2026-03-16
categories:
  - archietcture
sidebar: 'auto'
publish: true
---

## 架构风格 && 数据交互 相关

### 什么是微服务？使用微服务的优势/缺点有哪些？

> 微服务是一种软件架构风格，它将一个应用程序拆分成许多独立的服务，每个服务都是一个独立的进程，且与其他服务通信。这种架构风格的目的是让应用程序更容易开发、部署、维护和扩展。

- 使用微服务的优势包括：
  - 更容易开发和维护：将应用程序拆分为许多小型服务可以让开发人员更容易地理解和修改代码。
  - 更容易部署：因为每个服务都是独立的，所以可以独立部署。这使得可以更快地更新应用程序，并且可以轻松进行 A/B 测试。
  - 更容易扩展：微服务架构使得可以更轻松地扩展应用程序的某些部分，而不会影响到整个应用程序。
  - 更容易处理不同技术栈：在微服务架构中，每个服务可以使用不同的语言、框架和数据存储技术。

### 什么是 控制反转 && 依赖注入？

依赖注入 (Dependency Injection) 和控制反转 (Inversion of Control, IoC) 是相关的设计模式，但它们有一些重要的区别。

控制反转是一种设计思想，它强调由一个中央控制器（通常是一个 IoC 容器）来管理对象之间的依赖关系，而不是由对象自己来管理这些关系。这样可以使得代码更加松耦合，并使得系统更易于扩展和维护。

依赖注入是一种设计模式，它允许一个对象在运行时获得所需的依赖对象。这样可以更加灵活地管理对象之间的关系，并使得代码更易于测试和维护。

```js
class Engine {}

class Car {
  constructor(engine) {
    this.engine = engine;
  }
}

const engine = new Engine();
const car = new Car(engine);
```

> 所以可以说依赖注入是一种具体的实现方式，而控制反转是一种设计思想，控制反转被用来实现依赖注入。

> 实现方式：构造函数注入，属性注入，setter 注入

```js
class Engine {}

class Car {
  constructor() {
    this.engine = null;
  }
}

const container = new Map(); // IOC容器注入
container.set('Engine', Engine);
container.set('Car', Car);

const car = container.get('Car');
car.engine = container.get('Engine');
```

### 如何实现 JWT 鉴权机制？

#### JWT 是什么

JWT（JSON Web Token）分成了三部分，头部（Header）、载荷（Payload）、签名（Signature），并以.进行拼接。其中头部和载荷都是以 JSON 格式存放数据，只是进行了编码

1. header
   每个 JWT 都会带有头部信息，这里主要声明使用的算法。声明算法的字段名为 alg，同时还有一个 typ 的字段，默认 JWT 即可。以下示例中算法为 HS256

```js
{  "alg": "HS256",  "typ": "JWT" }
```

- 因为 JWT 是字符串，所以我们还需要对以上内容进行 Base64 编码，编码后字符串如下：

```js
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9;
```

2. payload

载荷即消息体，这里会存放实际的内容，也就是 Token 的数据声明，例如用户的 id 和 name，默认情况下也会携带令牌的签发时间 iat，通过还可以设置过期时间，如下：

```js
{
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}
```

- 同样进行 Base64 编码后，字符串如下：

```js
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ;
```

3. Signature

签名是对头部和载荷内容进行签名，一般情况，设置一个 secretKey，对前两个的结果进行 HMACSHA25 算法，公式如下：

> Signature = HMACSHA256(base64Url(header)+.+base64Url(payload),secretKey)

一旦前面两部分数据被篡改，只要服务器加密用的密钥没有泄露，得到的签名肯定和之前的签名不一致

#### 如何实现 JWT

```js
Token的使用分成了两部分：

生成token：登录成功的时候，颁发token
验证token：访问某些资源或者接口时，验证token
生成 token
借助第三方库jsonwebtoken，通过jsonwebtoken 的 sign 方法生成一个 token：

第一个参数指的是 Payload

第二个是秘钥，服务端特有

第三个参数是 option，可以定义 token 过期时间
```

```js
const moment = require('moment');
const jwt = require('jsonwebtoken');

jwt.sign(payload, secret, options, callback);
// option :{ expiresIn: moment().add(1, 'days').valueOf() }
```

- 在前端接收到 token 后，一般情况会通过 localStorage 进行缓存，然后将 token 放到 HTTP 请求头 Authorization 中，关于 Authorization 的设置，前面要加上 Bearer ，注意后面带有空格

### 校验 token

```js
const jwt = require('jsonwebtoken');
return jwt.decode(token);
```

### 优缺点

优点：

- json 具有通用性，所以可以跨语言

- 组成简单，字节占用小，便于传输

- 服务端无需保存会话信息，很容易进行水平扩展

- 一处生成，多处使用，可以在分布式系统中，解决单点登录问题

- 可防护 CSRF 攻击

缺点：

- payload 部分仅仅是进行简单编码，所以只能用于存储逻辑必需的非敏感信息

- 需要保护好加密密钥，一旦泄露后果不堪设想

- 为避免 token 被劫持，最好使用 https 协议

## 微信扫码登录全流程（前后端数据流向）

### 1. 流程步骤与接口调用

| 步骤 | 参与方          | 动作                      | 数据流向                                                                |
| ---- | --------------- | ------------------------- | ----------------------------------------------------------------------- |
| 1    | 前端 → 后端     | 请求生成二维码            | `GET /api/wxlogin/qrcode`                                               |
| 2    | 后端 → 微信     | 调用微信接口获取二维码    | `POST https://api.weixin.qq.com/sns/qrconnect?appid=XX&redirect_uri=XX` |
| 3    | 微信 → 后端     | 返回二维码参数            | `{"ticket":"XX", "expire_seconds":1800}`                                |
| 4    | 后端 → 前端     | 返回二维码 URL            | `{"qrcode_url":"https://mp.weixin...", "state":"RANDOM_STR"}`           |
| 5    | 前端 → 后端     | 轮询检查扫码状态          | `GET /api/wxlogin/check?state=RANDOM_STR`                               |
| 6    | 用户 → 微信 App | 扫码并确认登录            | -                                                                       |
| 7    | 微信 → 后端     | 携带 code 回调后端        | `GET /wxcallback?code=AUTH_CODE&state=RANDOM_STR`                       |
| 8    | 后端 → 微信     | 用 code 换取 access_token | `POST https://api.weixin.qq.com/sns/oauth2/access_token?code=XX`        |
| 9    | 微信 → 后端     | 返回用户凭证              | `{"access_token":"XX","openid":"XX"}`                                   |
| 10   | 后端 → 前端     | 返回登录结果              | `{"status":"success","token":"JWT_TOKEN"}`                              |
