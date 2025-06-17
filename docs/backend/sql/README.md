---
title: SQL相关
date: 2025-6-15
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