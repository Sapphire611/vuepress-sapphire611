---
title: MongoDB 相关
date: 2026-03-08
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

| 类型             | 代码关键字                                            | 说明                                     |
| ---------------- | ----------------------------------------------------- | ---------------------------------------- |
| **单字段索引**   | `createIndex({field: 1})`                             | 在单个字段上建立索引，1 升序，-1 降序    |
| **复合索引**     | `createIndex({field1: 1, field2: -1})`                | 多个字段组合，支持多字段查询优化         |
| **多键索引**     | 自动为数组创建                                        | 数组字段自动创建，每个数组元素一个索引项 |
| **全文索引**     | `createIndex({field: "text"})`                        | 支持文本搜索，中文需要额外配置           |
| **地理空间索引** | `createIndex({field: "2dsphere"})`                    | 支持地理位置查询，如附近的人             |
| **哈希索引**     | `createIndex({field: "hashed"})`                      | 索引字段哈希值，适合分片场景             |
| **TTL 索引**     | `createIndex({field: 1}, {expireAfterSeconds: 3600})` | 自动过期删除，适合会话、日志             |

**代码示例：**

```javascript
// 单字段索引
db.users.createIndex({ username: 1 });

// 复合索引（遵循 ESR 规则：Equality、Sort、Range）
db.users.createIndex({ age: 1, createdAt: -1 });

// 全文索引
db.articles.createIndex({ content: 'text' });

// 地理空间索引
db.places.createIndex({ location: '2dsphere' });

// TTL 索引 - 1 小时后自动删除
db.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 });

// 查看索引
db.users.getIndexes();

// 删除索引
db.users.dropIndex('username_1');
```

---

### 3. MongoDB 的聚合管道是什么？

**聚合管道（Aggregation Pipeline）是将数据处理操作串联起来，实现复杂的数据转换和查询**

**常用阶段：**

| 阶段       | 说明       | 示例                                                                                          |
| ---------- | ---------- | --------------------------------------------------------------------------------------------- |
| `$match`   | 过滤数据   | `{ $match: { status: "active" } }`                                                            |
| `$group`   | 分组统计   | `{ $group: { _id: "$category", count: { $sum: 1 } } }`                                        |
| `$project` | 投影字段   | `{ $project: { name: 1, age: 1, _id: 0 } }`                                                   |
| `$sort`    | 排序       | `{ $sort: { createdAt: -1 } }`                                                                |
| `$limit`   | 限制数量   | `{ $limit: 10 }`                                                                              |
| `$skip`    | 跳过数量   | `{ $skip: 10 }`                                                                               |
| `$lookup`  | 左连接     | `{ $lookup: { from: "orders", localField: "userId", foreignField: "userId", as: "orders" } }` |
| `$unwind`  | 展开数组   | `{ $unwind: "$tags" }`                                                                        |
| `$facet`   | 多管道并行 | 在同一阶段执行多个聚合管道，返回多个结果集                                                    |

**代码示例：**

```javascript
// 统计每个分类的文章数量
db.articles.aggregate([
  { $match: { status: 'published' } }, // 只统计已发布
  {
    $group: {
      // 按分类分组
      _id: '$category',
      count: { $sum: 1 }, // 统计数量
      avgViews: { $avg: '$views' }, // 平均浏览量
    },
  },
  { $sort: { count: -1 } }, // 按数量降序
  { $limit: 10 }, // 只看前 10
]);

// 连接查询（类似 SQL JOIN）
db.users.aggregate([
  { $match: { age: { $gte: 18 } } },
  {
    $lookup: {
      from: 'orders', // 关联的表
      localField: '_id', // 当前表的字段
      foreignField: 'userId', // 关联表的字段
      as: 'userOrders', // 输出的字段名
    },
  },
  {
    $project: {
      // 只输出需要的字段
      username: 1,
      email: 1,
      orderCount: { $size: '$userOrders' },
    },
  },
]);

// $facet - 多管道并行（一次查询返回多个统计结果）
db.products.aggregate([
  { $match: { category: 'electronics' } },
  {
    $facet: {
      // 管道1：统计各品牌数量
      byBrand: [{ $group: { _id: '$brand', count: { $sum: 1 } } }, { $sort: { count: -1 } }],
      // 管道2：价格分布
      priceStats: [
        {
          $group: {
            _id: null,
            avg: { $avg: '$price' },
            min: { $min: '$price' },
            max: { $max: '$price' },
          },
        },
      ],
      // 管道3：最热销商品
      topSelling: [{ $sort: { sales: -1 } }, { $limit: 5 }],
    },
  },
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

| 特性         | MongoDB               | MySQL                  |
| ------------ | --------------------- | ---------------------- |
| **数据模型** | 文档型（BSON）        | 关系型（表）           |
| **Schema**   | 灵活，无需预定义      | 严格，需预先定义表结构 |
| **查询语言** | MQL（类似 JSON）      | SQL                    |
| **事务支持** | 4.0+ 支持多文档事务   | 完整支持 ACID          |
| **关联查询** | `$lookup`（性能较差） | JOIN（性能好）         |
| **扩展方式** | 水平扩展（分片）      | 垂直扩展为主           |
| **适用场景** | 非结构化、高并发写入  | 结构化、复杂事务       |

---

### 5. MongoDB 千万级数据如何导出，并在实际业务中操作？

> **场景**：处理千万级数据的查询、聚合和导出，保证性能和用户体验。

#### 方案对比总览

| 方案                   | 实时性 | 查询速度 | 开发复杂度 | 适用场景           |
| ---------------------- | ------ | -------- | ---------- | ------------------ |
| **预聚合（物化视图）** | 分钟级 | ⚡⚡⚡   | 低         | 固定报表、趋势分析 |
| **索引优化聚合**       | 实时   | ⚡⚡     | 中         | 动态查询、临时分析 |
| **增量视图 + CDC**     | 秒级   | ⚡⚡⚡   | 高         | 实时监控、大屏     |
| **流式处理**           | 实时   | ⚡       | 低         | 数据导出、批量处理 |

---

#### 方案一：预聚合（物化视图）⭐ 推荐

**核心思想**：后台定期运行聚合任务，将原始数据计算成汇总结果存入新集合，业务层直接查询结果集。

```javascript
// ========== 后端定时任务（如每小时执行） ==========
async function preAggregateDailyStats() {
  const pipeline = [
    // 1️⃣ 只处理当天数据，利用索引
    { $match: { timestamp: { $gte: startOfDay, $lt: endOfDay } } },

    // 2️⃣ 按维度分组聚合
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          category: '$category',
          region: '$region',
        },
        orderCount: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        avgAmount: { $avg: '$amount' },
      },
    },

    // 3️⃣ 存储到预聚合集合
    { $merge: { into: 'daily_sales_summary', whenMatched: 'replace' } },
  ];

  await db.orders.aggregate(pipeline).toArray();
}

// ========== 业务查询（毫秒级响应） ==========
app.get('/api/report/sales', async (req, res) => {
  const { date, category } = req.query;
  const result = await db.daily_sales_summary
    .find({
      '_id.date': date,
      '_id.category': category,
    })
    .toArray();
  res.json(result);
});
```

**优势：**

- ✅ 查询速度从分钟级降至毫秒级
- ✅ 对原始库几乎没有压力
- ✅ 支持复杂的多维统计

**适用场景：** 日报、周报、月报、固定维度的 KPI 看板

---

#### 方案二：聚合框架 + 索引优化

**核心思想：** 直接对原始数据执行聚合查询，通过精心设计的索引和管道顺序保证性能。

**索引设计黄金法则（ESR 原则）：**

| 字段             | 说明                 | 示例                       |
| ---------------- | -------------------- | -------------------------- |
| **E** (Equality) | 等值查询字段放最前面 | `status: "completed"`      |
| **S** (Sort)     | 排序字段其次         | `amount: -1`               |
| **R** (Range)    | 范围查询字段最后     | `timestamp: { $gte: ... }` |

```javascript
// ========== 创建复合索引（ESR 顺序） ==========
await db.orders.createIndex({
  status: 1, // E: 等值查询
  region: 1, // E: 等值查询
  amount: -1, // S: 排序字段
  timestamp: 1, // R: 范围查询
});

// ========== 聚合管道优化要点 ==========
const pipeline = [
  // 第1步：尽早过滤，使用索引
  {
    $match: {
      status: 'completed',
      timestamp: { $gte: startDate, $lt: endDate },
    },
  },

  // 第2步：尽早投影，减少数据传输
  {
    $project: {
      region: 1,
      amount: 1,
      category: 1,
    },
  },

  // 第3步：分组统计
  {
    $group: {
      _id: '$region',
      totalAmount: { $sum: '$amount' },
      avgAmount: { $avg: '$amount' },
      count: { $sum: 1 },
    },
  },

  // 第4步：排序（确保排序字段有索引）
  { $sort: { totalAmount: -1 } },

  // 第5步：分页
  { $limit: 50 },
];

// ========== 执行时分析执行计划 ==========
const explain = await db.orders.aggregate(pipeline, { explain: true }).next();
console.log('是否使用索引：', !explain.stages[0].$cursor?.queryPlanner?.winningPlan?.stage?.includes('COLLSCAN'));
```

**关键监控指标：**

- `totalDocsExamined / nReturned` 比值越小越好
- 避免 COLLSCAN（全表扫描）
- 关注 `allowDiskUse` 触发频率（内存不足的标志）

---

#### 方案三：增量物化视图 + CDC

**核心思想：** 利用变更数据捕获（CDC）技术，在原始数据变更时实时更新预计算结果。

```javascript
// ========== 监听变更并实时更新汇总表 ==========
const changeStream = db.orders.watch();

changeStream.on('change', (change) => {
  if (change.operationType === 'insert') {
    const doc = change.fullDocument;

    // 实时更新汇总表
    db.daily_sales_summary.updateOne(
      {
        '_id.date': dayFormat(doc.timestamp),
        '_id.category': doc.category,
      },
      {
        $inc: {
          orderCount: 1,
          totalAmount: doc.amount,
        },
        $set: { lastUpdated: new Date() },
      },
      { upsert: true }
    );
  }
});
```

**适用场景：**

- 实时大屏、监控看板
- 需要秒级数据更新的业务决策系统
- 客户 360 视图等实时画像系统

---

#### 方案四：分页 + 流式处理

**核心思想：** 避免一次性加载全部数据，采用游标或分页分批处理。

```javascript
// ========== 使用游标流式处理（适合导出） ==========
async function streamLargeReport(res) {
  const cursor = db.orders
    .find({
      timestamp: { $gte: startDate, $lt: endDate },
    })
    .batchSize(1000); // 控制每批大小

  res.setHeader('Content-Type', 'application/json');

  let count = 0;
  for await (const doc of cursor) {
    // 逐条处理或批量写入响应
    res.write(JSON.stringify(processRow(doc)) + '\n');
    count++;

    // 每处理1000条释放一次事件循环
    if (count % 1000 === 0) {
      await new Promise((resolve) => setImmediate(resolve));
    }
  }
  res.end();
}

// ========== 基于_id的范围分页（避免skip性能问题） ==========
async function paginatedQuery(lastId = null, limit = 1000) {
  const query = lastId ? { _id: { $gt: lastId }, status: 'completed' } : { status: 'completed' };

  const docs = await db.orders.find(query).sort({ _id: 1 }).limit(limit).toArray();

  const nextId = docs.length === limit ? docs[docs.length - 1]._id : null;
  return { docs, nextId };
}
```

---

#### 后端开发实战要点

**1️⃣ 连接池配置**

```javascript
const client = new MongoClient(uri, {
  maxPoolSize: 50, // 根据并发调整
  minPoolSize: 10,
  maxIdleTimeMS: 30000,
  waitQueueTimeoutMS: 5000,
});
```

**2️⃣ 超时与重试策略**

```javascript
// 为长时间聚合设置超时
const result = await db.orders
  .aggregate(pipeline, {
    maxTimeMS: 30000, // 30秒超时
    allowDiskUse: true, // 大数据量聚合允许使用磁盘
  })
  .toArray();
```

**3️⃣ 缓存策略**

```javascript
// 结合 Redis 缓存热点查询
const cacheKey = `report:${JSON.stringify(queryParams)}`;
let result = await redis.get(cacheKey);

if (!result) {
  result = await computeReport(queryParams);
  await redis.setex(cacheKey, 300, JSON.stringify(result)); // 缓存5分钟
}
```

**4️⃣ 监控与告警**

- **慢查询日志**：`db.setProfilingLevel(1, { slowms: 100 })`
- **关键指标监控**：QPS、延迟、连接数
- **设置 P95 延迟告警阈值**

---

#### 总结

::: tip 最佳实践建议
对于千万级数据的后端报表处理：

1. **优先考虑预聚合方案**，从根本上解决性能问题
2. **如果需要实时动态查询**，必须严格遵守索引优化原则（ESR 原则）
3. **在代码中做好保护机制**：分页、超时、缓存、监控
   :::

### 6. MongoDB 设置了 ABC 联合索引，那 AB AC 之类的生效吗？

> **场景**：创建了复合索引 `{ A: 1, B: 1, C: 1 }`，查询条件不同时索引是否生效？

#### 索引生效情况

| 查询条件      | 是否生效    | 效率   | 说明                  |
| ------------- | ----------- | ------ | --------------------- |
| `{ A }`       | ✅ 完全生效 | ⚡⚡⚡ | 索引前缀              |
| `{ A, B }`    | ✅ 完全生效 | ⚡⚡⚡ | 索引前缀              |
| `{ A, B, C }` | ✅ 完全生效 | ⚡⚡⚡ | 完全匹配索引          |
| `{ A, C }`    | ⚠️ 部分生效 | ⚡⚡   | 跳过 B 字段，效率降低 |
| `{ B }`       | ❌ 不生效   | -      | 不满足最左前缀        |
| `{ B, C }`    | ❌ 不生效   | -      | 不满足最左前缀        |
| `{ C }`       | ❌ 不生效   | -      | 不满足最左前缀        |

#### 最左前缀原则

MongoDB 的复合索引遵循**最左前缀原则**：索引可以被用于查询其字段的任意前缀子集。

对于索引 `{ A: 1, B: 1, C: 1 }`，其有效前缀为：

```
{ A: 1 }
{ A: 1, B: 1 }
{ A: 1, B: 1, C: 1 }
```

**查询示例：**

```javascript
// 创建复合索引
db.users.createIndex({ age: 1, city: 1, name: 1 });

// ✅ 完全生效 - 索引前缀
db.users.find({ age: 25 });
db.users.find({ age: 25, city: 'Beijing' });
db.users.find({ age: 25, city: 'Beijing', name: 'Tom' });

// ⚠️ 部分生效 - 跳过了 city 字段
db.users.find({ age: 25, name: 'Tom' });

// ❌ 不生效 - 不满足最左前缀
db.users.find({ city: 'Beijing' });
db.users.find({ name: 'Tom' });
db.users.find({ city: 'Beijing', name: 'Tom' });
```

#### 为什么 `{ A, C }` 效率降低？

当查询 `{ A, C }` 时：

1. MongoDB 可以使用索引快速定位到 A 的值
2. 但对于每个 A 值，需要扫描所有 B 值来找到匹配的 C
3. 这比专门的 `{ A, C }` 索引效率低

::: tip 最佳实践

- **高频查询优先**：为常见的查询条件创建专门的复合索引
- **字段顺序很重要**：将区分度高的字段放在前面
- **避免跳过字段**：如经常查询 `{ A, C }`，应创建 `{ A: 1, C: 1 }` 索引
  :::

### 7. mongo 扣减库存时如何保证原子一致性？

> 使用事务，提交这里使用 mongoose 的版本

```js
const session = await mongoose.startSession();
session.startTransaction();

try {
  // 在 session 中执行操作
  await InventoryModel.updateOne({ _id: productId, quantity: { $gte: quantity } }, { $inc: { quantity: -quantity } }, { session });

  await RecordModel.create(
    {
      productId: productId,
      quantity: -quantity,
      timestamp: new Date(),
    },
    { session }
  );

  await session.commitTransaction();
  session.endSession();
} catch (error) {
  await session.abortTransaction();
  session.endSession();
  throw error;
}
```

### 8. 请写出符合下列要求的 mongodb 查询语句

> 查询表 user 中，name 是 abc，且 age 大于 30 岁或小于等于 10 岁的数据，跳过 100 条数据之后的 50 条数据，按年龄逆序排列，并仅返回 name 和 age 两个字段

```js
const query = await User.find({
  name: 'abc',
  $or: [{ age: { $gt: 30 } }, { age: { $lte: 10 } }],
})
  .skip(100)
  .limit(50)
  .sort({ age: -1 })
  .select('name age');
```

```js
const oprs = [
  {
    $match: {
      name: 'abc',
      $or: [{ age: { $gt: 30 } }, { age: { $lte: 10 } }],
    },
  },
  { $sort: { age: -1 } },
  { $skip: 100 },
  { $limit: 50 },
  { $project: { name: 1, age: 1 } },
];

await User.aggregate(oprs);
```
