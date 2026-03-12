---
title: SQL 相关
date: 2026-3-12
categories:
  - archietcture
  - interview
sidebar: 'auto'
publish: true
---

## SQL 相关

## Tips

### 1. 使用聚合函数时非聚合列的规则

<font color="red">当使用聚合函数时，所有非聚合列都必须包含在 GROUP BY 中</font>

```sql
SELECT name, COUNT(*) time
FROM products
-- GROUP BY name
-- HAVING COUNT(*) > 1;

-- 上面需要 写 GROUP BY name
-- Error: column "products.name" must appear in the GROUP BY clause or be used in an aggregate function 中文
```

### 2. WHERE vs HAVING 的区别

```sql
-- ❌ 错误写法
SELECT name, COUNT(*) as time
FROM products
WHERE COUNT(*) > 1  -- WHERE不能用于聚合函数
GROUP BY name;

-- ✅ 正确写法
SELECT name, COUNT(*) as time
FROM products
GROUP BY name
HAVING COUNT(*) > 1;  -- HAVING专门用于过滤聚合结果
```

## UXN SQL 题目

### 表结构

```sql
-- 创建category表
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    _at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建products表
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category_id INTEGER REFERENCES category(id) ON DELETE SET NULL,
    price DECIMAL(10, 2) CHECK (price >= 0),
    _at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 题目 1： 搜索出重复的 products

```sql
SELECT name, COUNT(*) as重复次数
FROM products
GROUP BY name
HAVING COUNT(*) > 1;
```

### 题目 2：统计每个类别下的价格总和

```sql
-- 关联表
SELECT
    c.id AS category_id,
    c.name AS category_name,
    SUM(p.price) AS total_price,
    COUNT(p.id) AS product_count
FROM category c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.id, c.name
ORDER BY total_price DESC;

-- 不关联表
SELECT
    category_id,
    SUM(price) AS total_price
FROM products
GROUP BY category_id
ORDER BY total_price DESC;
```

### 题目 3：统计出每个类别下前 3 贵的商品

```sql
-- 方法1：使用窗口函数（推荐）
SELECT * FROM (
    SELECT
        p.*,
        c.name AS category_name,
        ROW_NUMBER() OVER (PARTITION BY p.category_id ORDER BY p.price DESC) AS price_rank
    FROM products p
    LEFT JOIN category c ON p.category_id = c.id
) ranked
WHERE price_rank <= 3
ORDER BY category_id, price_rank;

-- 方法2：使用相关子查询
SELECT p1.*, c.name AS category_name
FROM products p1
LEFT JOIN category c ON p1.category_id = c.id
WHERE (
    SELECT COUNT(DISTINCT p2.price)
    FROM products p2
    WHERE p2.category_id = p1.category_id
    AND p2.price > p1.price
) < 3
ORDER BY p1.category_id, p1.price DESC;
```

### 题目 4：统计没有商品的空类别？

> 找出没有商品的空类别（可能是题目表述不太清晰，这是最常见的理解）

```sql
-- 找出没有产品的类别
SELECT
    c.id,
    c.name,
    c._at AS created_at
FROM category c
LEFT JOIN products p ON c.id = p.category_id
WHERE p.id IS NULL;

-- 或者使用NOT EXISTS
SELECT
    c.id,
    c.name,
    c._at AS created_at
FROM category c
WHERE NOT EXISTS (
    SELECT 1
    FROM products p
    WHERE p.category_id = c.id
);
```

### 题目 5：查询某个时间范围段的产品，时间很慢，如何优化？

```sql
-- 原始慢查询示例
SELECT * FROM products
WHERE _at BETWEEN '2024-01-01' AND '2024-12-31';
```

```sql
-- 1.在时间字段上创建索引
CREATE INDEX idx_products_at ON products(_at);

-- 如果经常按类别+时间查询，可以创建复合索引
CREATE INDEX idx_category_at ON products(category_id, _at);

-- 2.只查询需要的字段，避免SELECT *
SELECT id, name, price, category_id, _at
FROM products
WHERE _at >= '2024-01-01' AND _at < '2025-01-01';

-- 如果只需要统计，使用COUNT(*)
SELECT COUNT(*)
FROM products
WHERE _at BETWEEN '2024-01-01' AND '2024-12-31';

-- 3.查看查询执行计划
EXPLAIN SELECT * FROM products
WHERE _at BETWEEN '2024-01-01' AND '2024-12-31';

-- 4. 其他优化策略

-- 分区表：按时间范围对表进行分区

-- 汇总表：预计算每天的统计数据

-- 缓存：对频繁查询的时间范围使用Redis等缓存

-- 归档：将历史数据迁移到归档表

```

---

## 其他题目

### Mysql & MongoDB & Redis 介绍，分别在哪些场景下发挥优势？

> MySQL、MongoDB 和 Redis 都是常用的数据库系统，它们在不同的应用场景下发挥优势。

- MySQL 是一种关系型数据库管理系统，具有高度可移植性、稳定性和安全性。它在处理复杂的关系型数据时表现优越，例如在订单管理、用户管理等应用中。

- MongoDB 是一种文档型数据库系统，它提供了高性能、高可扩展性和高可用性。它能够轻松处理大量非结构化数据，例如在日志管理、用户行为分析等应用中。

- Redis 是一种内存型数据库系统，它支持快速读写，具有高吞吐量和低延迟。它适用于缓存、消息队列和其他对实时性要求较高的应用，例如在实时推荐、游戏状态管理等应用中。

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

### MySQL 和 MongoDB 的索引数据结构

> MySQL 的默认索引结构是 B+树，这是大多数存储引擎（如 InnoDB）使用的数据结构。MongoDB 默认使用的索引数据结构是 B 树（具体来说是 B-树的一种变体）。

| 特性             | MySQL                     | MongoDB                                              |
| ---------------- | ------------------------- | ---------------------------------------------------- |
| **默认索引结构** | B+树                      | B 树                                                 |
| **主键索引**     | PRIMARY KEY（唯一且非空） | \_id 字段（自动创建唯一索引）                        |
| **唯一索引**     | UNIQUE KEY                | 唯一索引（unique: true）                             |
| **组合索引**     | 支持（多列联合索引）      | 支持（复合索引）                                     |
| **全文索引**     | FULLTEXT（仅限文本类型）  | 文本索引（text index）                               |
| **空间索引**     | SPATIAL（GIS 地理数据）   | 2dsphere/2d（地理空间索引）                          |
| **特殊索引**     | 前缀索引（部分字符）      | 多键索引（数组字段）、哈希索引、TTL 索引（自动过期） |
| **稀疏索引**     | 不支持                    | 支持（仅索引包含字段的文档）                         |
| **索引覆盖查询** | 支持（Using index）       | 支持（covered query）                                |
| **索引限制**     | 每表最多 64 个二级索引    | 无硬性限制                                           |
| **索引创建方式** | CREATE INDEX              | createIndex()                                        |

## 其他知识点

### B Tree

### B 树、B-树与 B+树 的区别

一种平衡的多路搜索树，用于磁盘等直接存取设备

> 实际上"B-"中的"-"是连字符而非减号，B-树就是 B 树

B 树：所有节点都存储数据

B+树：B 树的变种，在数据库系统中更为常用

只有叶子节点存储数据，非叶子节点只存储键值作为索引

---

| 特性          | B 树(B-树)                       | B+树                             |
| ------------- | -------------------------------- | -------------------------------- |
| 数据存储位置  | 所有节点都存储数据               | 只有叶子节点存储数据             |
| 叶子节点链接  | 叶子节点不互相链接               | 叶子节点通过指针互相链接形成链表 |
| 查询性能      | 可能在非叶子节点命中，查询不稳定 | 必须到叶子节点，查询更稳定       |
| 范围查询      | 效率较低                         | 效率高(通过叶子节点链表)         |
| 非叶子节点    | 存储键值和数据                   | 只存储键值作为索引               |
| 空间利用率    | 相对较低                         | 更高                             |
| 适用场景      | 文件系统、少量数据               | 数据库索引、海量数据             |
| 相同键值存储  | 可能分散在不同层级节点           | 相同键值只出现在叶子节点         |
| 插入/删除成本 | 较高（可能涉及多层节点调整）     | 较低（调整通常局限在叶子节点）   |
| 全表扫描效率  | 需要遍历整棵树                   | 只需遍历叶子节点链表             |

#### 补充说明（可直接复制）：

B-树就是 B 树，名称中的"-"是连字符而非减号

B+树优势：

更适合磁盘存储（减少 I/O 次数）

范围查询性能提升 10 倍以上（实测）

非叶子节点可缓存更多键值（典型配置：B+树单个节点可存 500-1000 个键）

经典应用：

MySQL 的 InnoDB 引擎：B+树

MongoDB 默认索引：B 树

Linux 文件系统（如 ext4）：B 树

### B 树/ B+树 数据结构对比

| 对比项           | B+树（MySQL）                | B 树（MongoDB）          |
| ---------------- | ---------------------------- | ------------------------ |
| **数据存储位置** | 仅叶子节点存储数据           | 所有节点都可能存储数据   |
| **查询稳定性**   | 所有查询路径长度相同         | 查询路径长度可能不同     |
| **范围查询**     | 更高效（叶子节点链表连接）   | 需要更多磁盘 I/O         |
| **写入性能**     | 可能需要更多分裂操作         | 相对更高效的写入         |
| **内存利用率**   | 非叶子节点只存键，利用率更高 | 节点存储数据，利用率较低 |

### SQL 中 JOIN、LEFT JOIN、RIGHT JOIN 的区别

#### 1. INNER JOIN（内连接，默认 JOIN）

只返回两个表中匹配的记录。

```sql
SELECT * FROM TableA
INNER JOIN TableB ON TableA.id = TableB.id;
```

**特点：**

- 只返回两表中关联字段相等的记录
- 不匹配的记录不显示
- JOIN 默认就是 INNER JOIN

---

#### 2. LEFT JOIN（左连接）

返回左表所有记录 + 右表匹配的记录。

```sql
SELECT * FROM TableA
LEFT JOIN TableB ON TableA.id = TableB.id;
```

**特点：**

- 左表全部保留，右表只返回匹配的记录
- 右表无匹配时，显示 NULL
- 常用于：主表数据必须全部显示的场景

---

#### 3. RIGHT JOIN（右连接）

返回右表所有记录 + 左表匹配的记录。

```sql
SELECT * FROM TableA
RIGHT JOIN TableB ON TableA.id = TableB.id;
```

**特点：**

- 右表全部保留，左表只返回匹配的记录
- 左表无匹配时，显示 NULL
- RIGHT JOIN 可以用 LEFT JOIN 替代（调换表顺序）

#### 实用建议

- ✅ **实际开发中 LEFT JOIN 最常用** - 主表数据必须全部显示
- ⚠️ **RIGHT JOIN 较少使用** - 可以通过调换表顺序用 LEFT JOIN 实现
- 🔍 **多表关联时注意连接条件** - 避免产生笛卡尔积导致性能问题

### SQL 有哪些聚合函数？

| 函数分类        | 函数名称                                               | 功能描述                            | 示例场景                                   |
| :-------------- | :----------------------------------------------------- | :---------------------------------- | :----------------------------------------- |
| **数值计算**    | **SUM**                                                | 返回某列的总和                      | 计算所有产品的总销售额                     |
|                 | **AVG**                                                | 返回某列的平均值                    | 计算产品的平均价格                         |
|                 | **MAX**                                                | 返回某列的最大值                    | 查看最高产品价格                           |
|                 | **MIN**                                                | 返回某列的最小值                    | 查看最低产品价格                           |
| **基础统计**    | **COUNT**                                              | 返回某列的行数                      | 统计产品总数                               |
|                 | **COUNT(DISTINCT)**                                    | 返回某列去重后的非空值个数          | 统计有多少种不同的产品类别                 |
|                 | **STDDEV / STDDEV_POP**                                | 返回总体标准差 (数据的离散程度)     | 分析产品价格的波动性                       |
|                 | **STDDEV_SAMP**                                        | 返回样本标准差                      | 通过抽样数据估算整体价格的波动             |
|                 | **VAR_POP**                                            | 返回总体方差                        | 分析产品价格的离散程度                     |
|                 | **VAR_SAMP**                                           | 返回样本方差                        | 通过抽样数据估算整体价格的离散程度         |
| **数组/字符串** | **STRING_AGG (PostgreSQL)** / **GROUP_CONCAT (MySQL)** | 将分组后的字符串连接成一个字符串    | 列出每个类别下的所有产品名称               |
|                 | **ARRAY_AGG (PostgreSQL)**                             | 将分组后的值聚合为一个数组          | 将每个类别的产品 ID 聚合成一个数组         |
| **统计分布**    | **PERCENTILE_CONT**                                    | 返回连续百分位数 (会进行插值)       | 计算产品价格的中位数 (第 50 百分位数)      |
|                 | **PERCENTILE_DISC**                                    | 返回离散百分位数 (返回实际存在的值) | 找到产品价格中处于第 50 百分位的具体价格点 |
|                 | **MODE (PostgreSQL)**                                  | 返回众数 (出现频率最高的值)         | 找出最常见的产品价格                       |
| **逻辑判断**    | **BOOL_AND**                                           | 如果分组内所有值都为真，返回真      | 判断某个类别的所有产品价格是否都大于 100   |
|                 | **BOOL_OR**                                            | 如果分组内至少一个值为真，返回真    | 判断某个类别是否存在价格大于 1000 的产品   |

### 什么是窗口函数？

```sql
窗口函数 OVER (
    [PARTITION BY 列名]  -- 可选，不写就是整个表作为一个分区
    [ORDER BY 列名]      -- 可选，但ROW_NUMBER通常需要
)
```

```sql

-- ROW_NUMBER(): 给数据增加序号，分组+排序（最常见）
ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC)

-- RANK()：相同值并列，会跳过序号
RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)
-- 结果：10000->1, 9000->2, 9000->2, 8000->4

-- DENSE_RANK()：相同值并列，不跳过序号
DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC)
-- 结果：10000->1, 9000->2, 9000->2, 8000->3

-- SUM()：累计求和
SUM(salary) OVER (PARTITION BY dept_id ORDER BY hire_date)
```

---

### 窗口函数分类及用途

| 函数分类 | 函数名称 | 用途说明 | 示例场景 |
|---------|---------|---------|---------|
| **排名函数** | `ROW_NUMBER()` | 为每一行生成唯一的连续序号（1,2,3...） | 获取每个分类下价格排名第1的商品 |
| | `RANK()` | 排名，相同值并列且跳过后续序号（1,1,3,4...） | 学生成绩排名，并列第1名后直接第3名 |
| | `DENSE_RANK()` | 排名，相同值并列但不跳过序号（1,1,2,3...） | 比赛排名，并列第1名后是第2名 |
| | `PERCENT_RANK()` | 计算百分比排名（0到1之间的值） | 查看工资超过百分之多少的员工 |
| | `CUME_DIST()` | 计算累积分布值 | 分析数据分布情况 |
| | `NTILE(n)` | 将数据分成n组，返回组号 | 将客户按消费金额分成5等份 |
| **值函数** | `LAG(列, n)` | 获取前n行的值 | 计算与上个月销售额的差值 |
| | `LEAD(列, n)` | 获取后n行的值 | 计算与下个月销售额的差值 |
| | `FIRST_VALUE(列)` | 获取窗口内第一行的值 | 查看每个部门工资最高的员工工资 |
| | `LAST_VALUE(列)` | 获取窗口内最后一行的值 | 查看每个部门工资最低的员工工资 |
| | `NTH_VALUE(列, n)` | 获取窗口内第n行的值 | 获取每个部门工资排名第3的员工 |
| **聚合函数** | `SUM(列)` | 计算累计和 | 计算截止到当前日期的累计销售额 |
| | `AVG(列)` | 计算移动平均值 | 计算3个月的移动平均销售额 |
| | `COUNT(列)` | 计算累计计数 | 统计截止到当前月的累计订单数 |
| | `MAX(列)` | 获取窗口内的最大值 | 查看截止当前的最大销售额 |
| | `MIN(列)` | 获取窗口内的最小值 | 查看截止当前的最小销售额 |

### 快速对比示例

假设有成绩表：分数 [100, 90, 90, 80]

| 函数 | 结果 | 特点 |
|-----|------|------|
| ROW_NUMBER | 1,2,3,4 | 不重复，严格连续 |
| RANK | 1,2,2,4 | 并列占用序号，会跳过 |
| DENSE_RANK | 1,2,2,3 | 并列不占用序号，不跳过 |

### 使用场景示例

```sql
-- 排名函数：获取每个部门工资最高的员工
ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC)

-- 值函数：查看每个员工和上个月的工资对比
LAG(salary, 1) OVER (PARTITION BY emp_id ORDER BY month)

-- 聚合函数：计算累计销售额
SUM(sales) OVER (PARTITION BY product_id ORDER BY date)
