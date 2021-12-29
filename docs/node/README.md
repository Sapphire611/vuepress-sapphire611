---
title: Node 库相关
date: 2021-12-10
categories:
  - Backend
tags:
  - node
sidebar: "auto"
publish: true
---

## Node-gyp

### Node-gyp 安装

[安装 node-gyp](https://zhuanlan.zhihu.com/p/164543031)

[CMake - 编译需要这个，否则出现乱码错误](https://cmake.org/)

::: tip

node-gyp，是由于 node 程序中需要调用一些其他语言编写的工具，甚至是 dll，需要先编译一下，否则就会有跨平台的问题。

例如在 windows 上运行的软件 copy 到 mac 上就不能用了，但是如果源码支持，编译一下，在 mac 上还是可以用的。

node-gyp 在较新的 Node 版本中都是自带的（平台相关），用来编译原生 C++模块。

:::

### Node-gyp 编译

[node-gyp 编译问题](https://www.cnblogs.com/fanqisoft/p/13171657.html)

> 需要安装 Python，Visual Studio 并安装对应包，并且指定 VS 版本

```shell
npm config set msvs_version 2019

npm config set msbuild_path "C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\MSBuild\Current\Bin\MSBuild.exe"
```

## Multer

[multer - npm（用于文件上传的库）](https://www.npmjs.com/package/multer)

### Multer 安装

```js
npm install --save multer
```

### Multer 使用方法

> 以中间件的形式放在路由中使用

```js
const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const app = express();

// 单个文件上传
app.post("/profile", upload.single("avatar"), function (req, res, next) {});

// 多个文件上传
app.post(
  "/photos/upload",
  upload.array("photos", 12),
  function (req, res, next) {}
);

// 多组文件上传
app.post(
  "/cool-profile",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "gallery", maxCount: 8 },
  ]),
  function (req, res, next) {}
);
```

## Sequlize

[Sequelize Docs 中文版](https://demopark.github.io/sequelize-docs-Zh-CN/)

::: tip
Sequelize 是一个基于 promise 的 Node.js ORM 工具, 目前支持 Postgres, MySQL, MariaDB, SQLite 以及 Microsoft SQL Server. 它具有强大的事务支持, 关联关系, 预读和延迟加载,读取复制等功能.

Sequelize 遵从 语义版本控制. 支持 Node v10 及更高版本以便使用 ES6 功能.

使用方法为 连接数据库，创建 Model，调用方法，文档里很详细啦
:::

### Sequlize demo

> 连接 SQL Server

```js
"use strict";

const Sequelize = require("sequelize");
const config = require("../configs");

const sequelize = new Sequelize(
  config.mssqlDatabase,
  config.mssqlUsername,
  config.mssqlPassword,
  {
    host: "123.45.67.89",
    port: 1433,
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: false, // 这个必须是false，只有Azure平台是true
        useUTC: false,
        dateFirst: 1,
      },
    },
  }
);

module.exports = sequelize;

// model
const V_Employee = sequelize.define(
  "V_Employee",
  {
    PersonID: {
      type: DataTypes.NUMBER(13),
      primaryKey: true, //主键
    },

    CeibsID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    SerialNumber: {
      type: DataTypes.STRING,
    },
  },
  {
    // 这是其他模型参数
    timestamps: false, // 取消 createdAt 和 UpdatedAt
    freezeTableName: true,
  }
);

module.exports = V_Employee;

// use
const result = V_Employee.findAll({
  where: {
    CeibsID: realQuery.CeibsID,
  },
  attributes: ["CeibsID", "SerialNumber"], // 自定义输出内容
});
```
