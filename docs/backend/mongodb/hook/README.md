---
title: Mongodb hook
date: 2023-7-12
categories:
  - Backend
tags:
  - mongodb
sidebar: "auto"
publish: true
showSponsor: true
---

# MongoDB hook 应用

> MongoDB的Hook监听是一种在数据库操作前后执行自定义逻辑的功能, 例如在插入数据前对数据进行加工, 在删除数据后对数据进行清理等等

> 其中**preHook**代表在操作前执行, **postHook**代表在操作后执行

```js
const mongoose = require('mongoose');

// 连接MongoDB数据库
mongoose.connect('mongodb://localhost:27017/test', { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// 定义User模型  
const UserSchema = new mongoose.Schema({
    name: String,
    age: Number,
});

// 定义prehook  
UserSchema.pre('save', function (next) {
    // 在保存文档之前执行一些操作，例如生成唯一的ID或添加时间戳等  
    console.log('Pre-save hook called');
    next();
});

// 定义posthook  
UserSchema.post('save', function (doc) {
    // 在保存文档之后执行一些操作，例如发送邮件或记录日志等  
    console.log('Post-save hook called');
});

const User = mongoose.model('User', UserSchema);

// 创建一个新User并保存  
const newUser = new User({
    name: 'John Doe',
    age: 30,
});

newUser.save();
```

## 输出
```js
Pre-save hook called
Post-save hook called
```




