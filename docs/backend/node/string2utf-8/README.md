---
title: JS 计算字符串在UTF-8编码格式下的占用字符数
date: 2023-11-13
categories:
  - Javascript
tags:
  - javascript
sidebar: 'auto'
publish: true
---

## 👋 UTF-8 字节数计算函数

> 在 JavaScript 中，字符串的长度和字节数之间的关系可能会因字符串中包含的字符而有所不同。由于 UTF-8 编码是一种变长编码，每个字符可能占用不同数量的字节。

- 以下是一个简单的 JavaScript 函数，可以用于计算一个字符串在 UTF-8 编码下所占的字节数：

```js
function utf8ByteLength(str) {
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);

    if (code <= 0x7f) {
      count += 1;
    } else if (code <= 0x7ff) {
      count += 2;
    } else if (code <= 0xffff) {
      count += 3;
    } else if (code <= 0x10ffff) {
      count += 4;
    }
  }

  return count;
}
```

---

::: right
来自 [Sapphire611](http://sapphire611.github.io)
::
