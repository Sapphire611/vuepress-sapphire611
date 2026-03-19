---
title: Python 相关
date: 2026-03-16
categories:
  - backend
tags:
  - python
sidebar: 'auto'
publish: true
---

## Python 相关

### List、Tuple、Dictionary 的区别

#### 1. 基本概念

```python
# List - 可变序列
my_list = [1, 2, 3, "hello", [4, 5]]
my_list[0] = 100          # ✓ 可以修改
my_list.append(4)         # ✓ 可以添加
my_list.remove(2)         # ✓ 可以删除

# Tuple - 不可变序列
my_tuple = (1, 2, 3, "hello", [4, 5])
# my_tuple[0] = 100      # ✗ 不可以修改元素
# my_tuple.append(4)     # ✗ 不可以添加元素
new_tuple = my_tuple + (4,)  # ✓ 创建新元组

# Dictionary - 键值对集合
my_dict = {"name": "Alice", "age": 25, "scores": [90, 85, 95]}
my_dict["age"] = 26           # ✓ 可以修改值
my_dict["city"] = "Beijing"   # ✓ 可以添加键值对
del my_dict["scores"]         # ✓ 可以删除键值对
```
