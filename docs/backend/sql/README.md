---
title: SQL相关
date: 2025-6-19
categories:
  - archietcture
  - interview
sidebar: 'auto'
publish: true
showSponsor: true
---

## SQL相关

### Mysql & MongoDB & Redis 介绍，分别在哪些场景下发挥优势？

> MySQL、MongoDB 和 Redis 都是常用的数据库系统，它们在不同的应用场景下发挥优势。

- MySQL 是一种关系型数据库管理系统，具有高度可移植性、稳定性和安全性。它在处理复杂的关系型数据时表现优越，例如在订单管理、用户管理等应用中。

- MongoDB 是一种文档型数据库系统，它提供了高性能、高可扩展性和高可用性。它能够轻松处理大量非结构化数据，例如在日志管理、用户行为分析等应用中。

- Redis 是一种内存型数据库系统，它支持快速读写，具有高吞吐量和低延迟。它适用于缓存、消息队列和其他对实时性要求较高的应用，例如在实时推荐、游戏状态管理等应用中。

### 查找 4 月份的日志，基于 name 去重

```sql
Log
id, name, actions, createdTime, modifiedTime
```

#### mongodb:

```js
db.logs.aggregate([
  {
    $match: {
      createdTime: {
        $gte: ISODate('2023-04-01T00:00:00.000Z'), // 这里取决于时间戳的格式 ISO/unix
        $lt: ISODate('2023-05-01T00:00:00.000Z'),
      },
    },
  },
  {
    $group: {
      _id: '$name', // 基于name字段去重
      original: {
        $first: '$$ROOT', // 在original中保留$group第一个结果，用于显示。
        // （$push会保留重复的结果）
      },
    },
  },
  {
    $replaceRoot: {
      newRoot: '$original', // 让original变成根节点
    },
  },
]);
```

#### mysql:

```sql
SELECT name,action,createdTime,modifiedTime
FROM Log
WHERE createdTime BETWEEN '2022-04-01' and '2022-04-30'
GROUP BY name,action,createdTime,modifiedTime;
```

### 多实例情况下，怎么通过 redis 防止定时任务多次执行？

> 在多实例情况下，可以使用 Redis 分布式锁来防止定时任务多次执行。

1.在执行定时任务之前，使用 Redis 的 SETNX 命令尝试获取锁。如果获取成功，说明该实例获得了锁，可以执行定时任务。

2.在执行完定时任务之后，使用 Redis 的 DEL 命令释放锁。

3.如果获取锁失败，说明其他实例已经获得了锁，该实例应该等待其他实例释放锁。

代码示例：

```js
const Redis = require('ioredis');
const redis = new Redis();

const taskName = 'myTask';
const lockTTL = 60; // lock expires in 60 seconds

async function runTask() {
  // try to acquire lock
  const lockAcquired = await redis.setnx(taskName, 1);
  if (!lockAcquired) {
    console.log('Task already running, exiting...');
    return;
  }

  // set lock expiration
  await redis.expire(taskName, lockTTL);

  try {
    // perform task
    console.log('Running task...');
    // ...
  } finally {
    // release lock
    await redis.del(taskName);
  }
}
```

> 这样可以确保一次只有一个实例在执行定时任务，避免了多次执行的问题。

> 需要注意的是使用 Redis 分布式锁时，要尽量避免死锁的情况，如果锁被占用过长可以在超时时间后自动释放锁或者人工释放。

---

### Mysql 查询学生三门科目总分最高的 前三名

学生和成绩分表

```sql
CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(50)
);

CREATE TABLE scores (
  student_id INT,
  subject VARCHAR(50),
  score INT
);
```

```sql
select name,sum(score) as total
from students
join scores on scores.student_id = students.id
GROUP BY name
ORDER BY total desc
limit 3
```

---

学生和成绩合表

```sql
CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  subject1_score INT,
  subject2_score INT,
  subject3_score INT
);
```

```sql
select name,(subject1_score + subject2_score + subject3_score) as total
from student
ORDER BY total desc
limit 3
```

## MySQL 和 MongoDB 的索引数据结构

> MySQL 的默认索引结构是 B+树，这是大多数存储引擎（如 InnoDB）使用的数据结构。MongoDB 默认使用的索引数据结构是 B树（具体来说是 B-树的一种变体）。


| 特性                | MySQL                          | MongoDB                        |
|---------------------|--------------------------------|--------------------------------|
| **默认索引结构**     | B+树                           | B树                            |
| **主键索引**         | PRIMARY KEY（唯一且非空）      | _id 字段（自动创建唯一索引）    |
| **唯一索引**         | UNIQUE KEY                     | 唯一索引（unique: true）        |
| **组合索引**         | 支持（多列联合索引）           | 支持（复合索引）               |
| **全文索引**         | FULLTEXT（仅限文本类型）       | 文本索引（text index）         |
| **空间索引**         | SPATIAL（GIS地理数据）         | 2dsphere/2d（地理空间索引）    |
| **特殊索引**         | 前缀索引（部分字符）           | 多键索引（数组字段）、哈希索引、TTL索引（自动过期） |
| **稀疏索引**         | 不支持                         | 支持（仅索引包含字段的文档）   |
| **索引覆盖查询**     | 支持（Using index）            | 支持（covered query）          |
| **索引限制**         | 每表最多64个二级索引           | 无硬性限制                     |
| **索引创建方式**     | CREATE INDEX                   | createIndex()                  |

### 数据结构对比
| 对比项          | B+树（MySQL）                  | B树（MongoDB）                 |
|----------------|-------------------------------|-------------------------------|
| **数据存储位置** | 仅叶子节点存储数据             | 所有节点都可能存储数据         |
| **查询稳定性**   | 所有查询路径长度相同           | 查询路径长度可能不同           |
| **范围查询**     | 更高效（叶子节点链表连接）     | 需要更多磁盘I/O               |
| **写入性能**     | 可能需要更多分裂操作           | 相对更高效的写入               |
| **内存利用率**   | 非叶子节点只存键，利用率更高   | 节点存储数据，利用率较低       |


## B Tree

### B树、B-树与B+树的区别

一种平衡的多路搜索树，用于磁盘等直接存取设备

> 实际上"B-"中的"-"是连字符而非减号，B-树就是B树


B树：所有节点都存储数据

B+树：B树的变种，在数据库系统中更为常用

只有叶子节点存储数据，非叶子节点只存储键值作为索引

---

| 特性        | B树(B-树)                  | B+树                      |
|-----------|---------------------------|--------------------------|
| 数据存储位置  | 所有节点都存储数据             | 只有叶子节点存储数据          |
| 叶子节点链接  | 叶子节点不互相链接              | 叶子节点通过指针互相链接形成链表  |
| 查询性能     | 可能在非叶子节点命中，查询不稳定    | 必须到叶子节点，查询更稳定      |
| 范围查询     | 效率较低                     | 效率高(通过叶子节点链表)       |
| 非叶子节点   | 存储键值和数据                 | 只存储键值作为索引            |
| 空间利用率   | 相对较低                     | 更高                     |
| 适用场景     | 文件系统、少量数据              | 数据库索引、海量数据           |
| 相同键值存储  | 可能分散在不同层级节点            | 相同键值只出现在叶子节点        |
| 插入/删除成本 | 较高（可能涉及多层节点调整）        | 较低（调整通常局限在叶子节点）    |
| 全表扫描效率  | 需要遍历整棵树                  | 只需遍历叶子节点链表           |

#### 补充说明（可直接复制）：

B-树就是B树，名称中的"-"是连字符而非减号

B+树优势：

更适合磁盘存储（减少I/O次数）

范围查询性能提升10倍以上（实测）

非叶子节点可缓存更多键值（典型配置：B+树单个节点可存500-1000个键）

经典应用：

MySQL的InnoDB引擎：B+树

MongoDB默认索引：B树

Linux文件系统（如ext4）：B树