---
title: MongoDB相关
date: 2026-3-3
categories:
  - mongodb
  - interview
sidebar: 'auto'
publish: true
---

## MongoDB 相关

### 1. 什么是 MongoDB？适合什么场景？

**MongoDB 是一个基于文档的 NoSQL 数据库，使用 BSON 格式存储数据**

**适用场景：**

- **非结构化数据**：数据模型经常变化，不需要固定的表结构
- **日志存储**：大量的日志记录，写入频繁
- **内容管理**：文章、评论、社交动态等
- **实时分析**：用户行为分析、数据统计
- **物联网**：设备数据采集和存储

**不适用场景：**

- 要复杂事务的场景
- 多表关联查询复杂的场景
- 对数据一致性要求极高的场景

---

### 2. MongoDB 索引类型有哪些？如何使用？

| 类型 | 代码关键字 | 说明 |
|------|-----------|------|
| **单字段索引** | `createIndex({field: 1})` | 在单个字段上建立索引，1 升序，-1 降序 |
| **复合索引** | `createIndex({field1: 1, field2: -1})` | 多个字段组合，支持多字段查询优化 |
| **多键索引** | 自动为数组创建 | 数组字段自动创建，每个数组元素一个索引项 |
| **全文索引** | `createIndex({field: "text"})` | 支持文本搜索，中文需要额外配置 |
| **地理空间索引** | `createIndex({field: "2dsphere"})` | 支持地理位置查询，如附近的人 |
| **哈希索引** | `createIndex({field: "hashed"})` | 索引字段哈希值，适合分片场景 |
| **TTL 索引** | `createIndex({field: 1}, {expireAfterSeconds: 3600})` | 自动过期删除，适合会话、日志 |

**代码示例：**

```javascript
// 单字段索引
db.users.createIndex({ username: 1 });

// 复合索引（遵循 ESR 规则：Equality、Sort、Range）
db.users.createIndex({ age: 1, createdAt: -1 });

// 全文索引
db.articles.createIndex({ content: "text" });

// 地理空间索引
db.places.createIndex({ location: "2dsphere" });

// TTL 索引 - 1 小时后自动删除
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

// 查看索引
db.users.getIndexes();

// 删除索引
db.users.dropIndex("username_1");
```

---

### 3. MongoDB 的聚合管道是什么？

**聚合管道（Aggregation Pipeline）是将数据处理操作串联起来，实现复杂的数据转换和查询**

**常用阶段：**

| 阶段 | 说明 | 示例 |
|------|------|------|
| `$match` | 过滤数据 | `{ $match: { status: "active" } }` |
| `$group` | 分组统计 | `{ $group: { _id: "$category", count: { $sum: 1 } } }` |
| `$project` | 投影字段 | `{ $project: { name: 1, age: 1, _id: 0 } }` |
| `$sort` | 排序 | `{ $sort: { createdAt: -1 } }` |
| `$limit` | 限制数量 | `{ $limit: 10 }` |
| `$skip` | 跳过数量 | `{ $skip: 10 }` |
| `$lookup` | 左连接 | `{ $lookup: { from: "orders", localField: "userId", foreignField: "userId", as: "orders" } }` |
| `$unwind` | 展开数组 | `{ $unwind: "$tags" }` |
| `$facet` | 多管道并行 | 在同一阶段执行多个聚合管道，返回多个结果集 |

**代码示例：**

```javascript
// 统计每个分类的文章数量
db.articles.aggregate([
  { $match: { status: "published" } },  // 只统计已发布
  { $group: {                           // 按分类分组
    _id: "$category",
    count: { $sum: 1 },                 // 统计数量
    avgViews: { $avg: "$views" }        // 平均浏览量
  }},
  { $sort: { count: -1 } },             // 按数量降序
  { $limit: 10 }                        // 只看前 10
]);

// 连接查询（类似 SQL JOIN）
db.users.aggregate([
  { $match: { age: { $gte: 18 } } },
  { $lookup: {
    from: "orders",                     // 关联的表
    localField: "_id",                  // 当前表的字段
    foreignField: "userId",             // 关联表的字段
    as: "userOrders"                    // 输出的字段名
  }},
  { $project: {                         // 只输出需要的字段
    username: 1,
    email: 1,
    orderCount: { $size: "$userOrders" }
  }}
]);

// $facet - 多管道并行（一次查询返回多个统计结果）
db.products.aggregate([
  { $match: { category: "electronics" } },
  { $facet: {
    // 管道1：统计各品牌数量
    byBrand: [
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ],
    // 管道2：价格分布
    priceStats: [
      { $group: {
        _id: null,
        avg: { $avg: "$price" },
        min: { $min: "$price" },
        max: { $max: "$price" }
      }}
    ],
    // 管道3：最热销商品
    topSelling: [
      { $sort: { sales: -1 } },
      { $limit: 5 }
    ]
  }}
]);
// 返回结果：
// {
//   byBrand: [{ _id: "Apple", count: 50 }, ...],
//   priceStats: [{ _id: null, avg: 999, min: 100, max: 5000 }],
//   topSelling: [{ name: "iPhone", sales: 1000 }, ...]
// }
```

---

### 4. MongoDB 和 MySQL 的区别？

| 特性 | MongoDB | MySQL |
|------|---------|-------|
| **数据模型** | 文档型（BSON） | 关系型（表） |
| **Schema** | 灵活，无需预定义 | 严格，需预先定义表结构 |
| **查询语言** | MQL（类似 JSON） | SQL |
| **事务支持** | 4.0+ 支持多文档事务 | 完整支持 ACID |
| **关联查询** | `$lookup`（性能较差） | JOIN（性能好） |
| **扩展方式** | 水平扩展（分片） | 垂直扩展为主 |
| **适用场景** | 非结构化、高并发写入 | 结构化、复杂事务 |
