---
title: Leveldb 学习笔记
date: 2025-7-5
categories:
  - Backend
tags:
  - leveldb
sidebar: "auto"
publish: true
showSponsor: true
---

## Leveldb 学习笔记

> leveldb是一个写性能十分优秀的存储引擎，是典型的LSM树(Log Structured-Merge Tree)实现。LSM树的核心思想就是放弃部分读的性能，换取最大的写入能力

[基本概念 — leveldb-handbook 文档](https://leveldb-handbook.readthedocs.io/zh/latest/basic.html)

### Demo

```js
const level = require('level');
const dbPath = './mydb';

// Initialize database correctly
const db = new level.Level(dbPath);

// Using promise-based API (recommended)
async function main() {
  try {

    // await db.put('key1', 'value1');
    // await db.put('key2', 'value2');
    // console.log('Key1 stored successfully.');
    
    const res = await db.get('key1');
    console.log('Key1 retrieved successfully:', res);

    const res2 = await db.get('key2');
    console.log('Key2 retrieved successfully:', res2);

    // Read stream
    for await (const [key, value] of db.iterator()) {
      console.log(`Key: ${key}, Value: ${value}`);
    }

    console.log('Finished reading all entries.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await db.close();
  }
}

main();
```