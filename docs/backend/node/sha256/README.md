---
title: Node.js SHA-256 加密方式
date: 2024-4-23
categories:
  - backend
tags:
  - encryption
sidebar: "auto"
publish: true
---

## 👋 Node.js SHA-256 加密方式

::: right
来自 [Sapphire611](http://sapphire611.github.io)
:::
---

### 前端加密

```js
var file = $("#file_upload...")[0].files[0]; // 上传的文件
if(!file) return;

// 计算文件的SHA-256
const arrayBuffer = await file.arrayBuffer() // 二进制数据,与字符编码关系不大
const digestBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)// 计算摘要buffer
const digestArray = Array.from(new Uint8Array(digestBuffer))

// 转换为16进制字符串
const digestHex = digestArray.map((b) => b.toString(16).padStart(2, '0')).join('')
```

### 后端加密

```js
const sha256 = crypto.createHash('sha256').update(binaryStr,'utf-8').digest('hex') 
// const sha256 = crypto.createHash('sha256').update(binaryStr,'ASCII').digest('hex') 
```

::: tip
在计算文件的SHA-256哈希时，使用 `crypto.subtle.digest()` 方法，这通常涉及处理二进制数据。
既然是二进制数据，默认编码通常与字符编码关系不大，因为二进制数据直接处理字节而不是字符。在这个上下文中，编码主要与将数据转换为字符串有关，例如为了显示或保存哈希值。

当你提到字符编码时，可能是指将二进制哈希值转为字符串时的默认处理方式。
通常在计算完SHA-256后，需要以特定的编码格式呈现结果，例如转换为十六进制（Hex）或Base64。
:::