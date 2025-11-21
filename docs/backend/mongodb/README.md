---
title: MongoDB相关
date: 2025-6-15
categories:
  - mongodb
  - interview
sidebar: 'auto'
publish: true
---

## MongoDB 相关

### mongodb 中索引有哪些类型？分别怎么使用？

| 类型             | 说明         | 作用                                                |
| ---------------- | ------------ | --------------------------------------------------- |
| Single Filed     | 单字段索引   | 在普通字段、子文挡以及子文档的某个 字段上建立的索引 |
| Compound Index   | 复合索引     | 同时在多个字段上建立的索引                          |
| Multikey Index   | 多键索引     | 对数组建立的索引                                    |
| Geospatial Index | 地理空间索引 | 对地理位置型数据建立的索引（支持球面和平面）        |
| Textlndex        | 全文索引     | 对每一个词建立索引，支持全文搜索                    |
| Hashed Index     | 哈希索引     | 索引中存储的是被索引键的哈希值                      |
