---
title: 通过Map让Fibonacci递归不会栈溢出
date: 2022-9-28
categories:
  - algorithm
tags:
  - algorithm
sidebar: "auto"
publish: true
showSponsor: true
---
## 👋 原始版本

``` js
const fibonacci = (n) => {
  if (n === 1 || n === 2) return 1;
  return fibonacci(n - 2) + fibonacci(n - 1);
};

console.log(fibonacci(50)); // 出不了结果
```
---

## 👋 修改后版本

``` js
const map = new Map(); // 这个map得是全局的
map.set(1, 1);
map.set(2, 1);

const fibonacci = (n) => {
  if (map.has(n)) return map.get(n);

  let result = fibonacci(n - 1) + fibonacci(n - 2);
  map.set(n, result);

  return result;
};

console.log(fibonacci(50)); // 没问题了
```

::: right
来自 [Sapphire611](http://www.sapphire611.com)
::

