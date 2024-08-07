---
title: 软考-中级软件设计师-数据结构
date: 2024-7-22
categories:
  - Certificate
tags:
  - note
sidebar: 'auto'
publish: true
showSponsor: true
---
## 👋 软考中级系统架构师

> 备战 中级软件设计师

::: right
来自 [Sapphire611](http://sapphire611.github.io)
:::

---

## 数据结构

### 时间复杂度

- 算法时间复杂度以算法中基本操作重复执行的次数(简称为频度)作为算法的时间度量。

- 一般不必要精确计算出算法的时间复杂度,只要大致计算出相应的数量级即可,如`O(1)`,`O(log2n)`、`O(n)`或`O(n²)`等。

``` bash
O(1) < O(log₂n) < O(n) < O(nlog₂n) < O(n²) < 0(n³) < 0(2ⁿ) < O(n!) < O(nⁿ)
常数阶   对数阶    线性阶  线性对数阶  平方阶   立方阶   指数阶   阶乘阶   n次方阶
```
- 加法规则:多项相加，保留最高阶项，并将系数化为1
- 乘法规则:多项相乘都保留，并将系数化为1
- 加法乘法混合规则:小括号再乘法规则最后加法规则

### 递归式

![1721903110350](/img/1721903110350.png)

> P16 