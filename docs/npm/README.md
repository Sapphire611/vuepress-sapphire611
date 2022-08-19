---
title: 如何在 npm 上发布自己的包
date: 2022-8-18
categories:
  - javascript
tags:
  - npm
  - yarn
sidebar: "auto"
publish: true
showSponsor: true
---

## 如何在 npm 上发布自己的包？

[编写自己的npm包](https://blog.csdn.net/vuhtyd76/article/details/123054113)

### 前置条件
1. 安装node.js (node & npm 都能正常使用)

> yarn是一个替代npm的工具，更好用

2. [注册 npm 帐号](https://www.npmjs.com/)

> 登录会用到一次性密码，网页上和命令行上都是

3. 创建自己的项目(npm init)

> 确保 package.json 配置正常

![img](https://shgbit-liuliyi.oss-cn-shanghai.aliyuncs.com/vuepress-pic/npm/sapphire611.png)

``` js
// package.json
{
  "name": "xxxx",
  "version": "0.0.1",
  "description": "test module for js",
  "main": "index.js",
  "scripts": {
    "test": "node xxx.js"
  },
  "keywords": [
    "xxx"
  ],
  "author": "[yourname]",
  "license": "MIT"
}
```
4. 命令行登录 npm (可以用 npm who am i 查看是否登录成功)

``` bash
> npm login

username: ...
password: ...
email(public): ...@qq.com
```

5. 发布

``` bash
npm publish
```

::: tip
yarn 可以用来发布包，和npm二者选其一即可

npm 上的内容和yarn上的内容是一样的，每次发布记得改package.json里的版本号 
::: 

::: warning 可能会遇到的问题
1. npm 需要更新
> sudo npm install -g npm //npm update

2. 设置 npm registry
> npm config set registry https://registry.npmjs.org //set https origin
:::