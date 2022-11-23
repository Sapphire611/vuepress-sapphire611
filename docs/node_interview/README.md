---
title: Node_Interview_Note
date: 2022-11-27
categories:
  - Backend
tags:
  - node
  - interview
sidebar: "auto"
publish: false
---

# StoreHub

## 3-minutes self-introduction in English

## Graphql

[Introduction to GraphQL](https://graphql.org/learn)

- What’s the difference between queries and mutations? 

- What’s the meaning of ID(uppercase) with exclamation mark in a graphQL schema?

## GRPC

[Documentation](https://grpc.io/docs/)

- What does gRPC use for defining the data structures of its services and messages?    

- How can we define a field represening a date in gRPC messages?                                   

- What is a method stub?

## 什么是微服务？使用微服务的优势/缺点有哪些？

## SQL

- Mysql & MongoDB & Redis 介绍，分别在哪些场景下发挥优势？

``` 
Log
id, name, actions, createdTime, modifiedTime
```
用sql/nosql查找4月份的日志，去重

- mongodb中索引有哪些类型？分别怎么使用？

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
}
```

算法题：括号匹配 leetcode 20 
算法题：搜索旋转排序数组 leetcode 33


