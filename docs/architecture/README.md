---
title: 架构风格相关
date: 2025-6-22
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
