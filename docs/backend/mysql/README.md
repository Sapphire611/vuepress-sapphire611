---
title: MYSQL 相关
date: 2026-03-03
categories:
  - sql
  - interview
sidebar: 'auto'
publish: true
---

## MYSQL 相关

### 1. InnoDB 和 MyISAM 的区别？

| 特性 | InnoDB | MyISAM |
|------|--------|--------|
| **事务支持** | ✅ 支持 | ❌ 不支持 |
| **锁机制** | 行锁 | 表锁 |
| **外键** | ✅ 支持 | ❌ 不支持 |
| **崩溃恢复** | ✅ 自动恢复 | ❌ 需手动修复 |
| **读性能** | 较好 | 更好 |
| **写性能** | 较好 | 较差 |
| **适用场景** | 高并发、事务要求高 | 读多写少、无事务要求 |

> InnoDB 是 MySQL 5.5+ 的默认存储引擎

**代码示例：**

```sql
-- 1️⃣ 创建不同存储引擎的表
CREATE TABLE users_innodb (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  balance DECIMAL(10, 2)
) ENGINE=InnoDB;

CREATE TABLE users_myisam (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  balance DECIMAL(10, 2)
) ENGINE=MyISAM;

-- 2️⃣ 事务测试（只有 InnoDB 支持事务）
START TRANSACTION;

-- InnoDB：可以回滚
INSERT INTO users_innodb (name, balance) VALUES ('Alice', 1000);
ROLLBACK;  -- ✅ 数据被回滚

-- MyISAM：无法回滚
INSERT INTO users_myisam (name, balance) VALUES ('Bob', 1000);
ROLLBACK;  -- ❌ 数据已插入，回滚无效

-- 3️⃣ 外键测试（只有 InnoDB 支持外键）
CREATE TABLE orders_innodb (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  amount DECIMAL(10, 2),
  FOREIGN KEY (user_id) REFERENCES users_innodb(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;  -- ✅ 成功

CREATE TABLE orders_myisam (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  amount DECIMAL(10, 2),
  FOREIGN KEY (user_id) REFERENCES users_myisam(id)
) ENGINE=MyISAM;  -- ❌ 报错：外键约束需要 InnoDB

-- 4️⃣ 并发锁测试
-- InnoDB：行锁，只锁住修改的行
UPDATE users_innodb SET balance = 900 WHERE id = 1;
-- 其他事务可以修改 id != 1 的行 ✅

-- MyISAM：表锁，锁住整张表
UPDATE users_myisam SET balance = 900 WHERE id = 1;
-- 其他事务无法修改这张表的任何行 ❌

-- 5️⃣ 查看表的存储引擎
SHOW TABLE STATUS WHERE Name IN ('users_innodb', 'users_myisam');
```

---

### 2. 什么是索引？索引类型有哪些？

**索引是帮助 MySQL 高效获取数据的数据结构（类似书的目录）**

**索引类型：**

- **主键索引**：`PRIMARY KEY` - 唯一且不能为空，一张表只能有一个
- **唯一索引**：`UNIQUE KEY / UNIQUE INDEX` - 值唯一，但可以为空
- **普通索引**：`INDEX / KEY` - 最基本的索引，无限制
- **联合索引**：`INDEX (col1, col2, ...)` - 多个字段组成的索引，遵循最左前缀原则
- **全文索引**：`FULLTEXT INDEX` - 用于文本搜索（MATCH AGAINST）
- **空间索引**：`SPATIAL INDEX` - 用于地理空间数据

---

### 3. B+ 树索引的原理？为什么 MySQL 选择 B+ 树？

**B+ 树特点：**

- 所有数据存储在叶子节点
- 非叶子节点只存储键值，不存储数据
- 叶子节点之间通过指针连接，形成链表

**MySQL 选择 B+ 树的原因：**

1. **层级少**：相比 B 树更矮胖，减少磁盘 I/O 次数
2. **范围查询快**：叶子节点有链表，遍历范围数据效率高
3. **查询稳定**：所有查询都要走到叶子节点，性能稳定
4. **节点容量大**：非叶子节点不存数据，可以存更多索引项

::: right
———— B 树每个节点都存数据，导致节点容量小，树的高度更高
:::

---

### 4. 什么是事务？ACID 特性是什么？

**事务是逻辑上的一组操作，要么都成功，要么都失败**

**ACID 特性：**

| 特性 | 说明 | 示例 |
|------|------|------|
| **原子性 (A)** | 事务中的操作不可分割 | 转账：扣款和存款要么都成功，要么都失败 |
| **一致性 (C)** | 事务前后数据的完整性约束不变 | 转账前后总金额不变 |
| **隔离性 (I)** | 并发事务之间互不干扰 | 两个用户同时转账，不会互相影响 |
| **持久性 (D)** | 事务提交后永久保存 | 即使系统崩溃，提交的数据也不会丢失 |

---

### 5. 事务隔离级别有哪些？

| 隔离级别 | 脏读 | 不可重复读 | 幻读 | 说明 |
|----------|------|------------|------|------|
| **读未提交** | ✅ | ✅ | ✅ | 可能读取到未提交的数据 |
| **读已提交** | ❌ | ✅ | ✅ | 只能读取已提交的数据（Oracle 默认） |
| **可重复读** | ❌ | ❌ | ✅ | 同一事务多次读取结果一致（MySQL 默认） |
| **串行化** | ❌ | ❌ | ❌ | 完全串行执行，性能最差 |

**常见问题：**
- **脏读**：读取到其他事务未提交的数据
- **不可重复读**：同一事务两次读取同一条数据结果不同
- **幻读**：同一事务两次查询数据量不一致（其他事务插入/删除了数据）

---

### 6. 什么是 MVCC？

**MVCC（多版本并发控制）是一种乐观锁机制，通过保存数据的多个版本实现读写不加锁**

**核心原理：**

1. **版本链**：每行记录隐藏字段（trx_id、roll_ptr），通过 undo log 形成版本链
2. **Read View**：读时生成快照，根据事务 ID 判断可见性
3. **写时复制**：更新时复制到新版本，旧版本保留在 undo log

**优势：**
- 读不阻塞写，写不阻塞读
- 实现了可重复读隔离级别
- 避免了锁竞争，提高并发性能

---

### 7. MySQL 慢查询如何优化？

**定位慢查询：**
```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log = ON;
SET GLOBAL long_query_time = 1;  -- 超过 1 秒记录

-- 查看慢查询
SHOW VARIABLES LIKE 'slow_query%';
```

**优化方法：**

1. **使用 EXPLAIN 分析执行计划**
   ```sql
   EXPLAIN SELECT * FROM users WHERE age > 20;
   ```

2. **索引优化**
   - 在 WHERE、ORDER BY、JOIN 的字段上建立索引
   - 避免索引失效（使用函数、OR、LIKE %开头）

3. **SQL 语句优化**
   - 避免 `SELECT *`，只查询需要的字段
   - 避免在 WHERE 中对字段进行函数操作
   - 合理使用 LIMIT，避免全表扫描

4. **分页优化**
   ```sql
   -- 传统分页（越往后越慢）
   SELECT * FROM users LIMIT 1000000, 10;

   -- 优化方案（先查 ID，再关联）
   SELECT * FROM users u
   INNER JOIN (SELECT id FROM users LIMIT 1000000, 10) t
   ON u.id = t.id;
   ```

5. **其他优化**
   - 垂直分表：字段多时拆分表
   - 水平分表：数据量大时按规则拆分
   - 读写分离：主库写，从库读
   - 使用缓存：Redis 缓存热点数据


### 8. MySQL 分布式事务是如何实现的？

**分布式事务**：多个独立的数据库实例参与同一个全局事务，保证所有操作要么全部成功，要么全部失败。

MySQL 通过 **XA 协议** 实现分布式事务，采用 **2PC（两阶段提交）** 算法。

**核心组件：**

| 组件 | 英文 | 职责 |
|------|------|------|
| 应用程序 | AP（Application） | 发起全局事务 |
| 事务管理器 | TM（Transaction Manager） | 协调各资源管理器 |
| 资源管理器 | RM（Resource Manager） | 实际执行事务的数据库实例 |

**两阶段提交流程：**

```
┌─────────────┐
│  第一阶段   │  Prepare（准备阶段）
│  投票阶段   │  → TM 向所有 RM 发送 Prepare 指令
└─────────────┘  → RM 执行操作但不提交，锁定资源
                  → RM 向 TM 返回 Ready/Abort

┌─────────────┐
│  第二阶段   │  Commit/Rollback（执行阶段）
│  执行阶段   │  → 全部 Ready：发送 Commit 指令
└─────────────┘  → 任一 Abort：发送 Rollback 指令
```

**XA 事务代码示例：**

```sql
-- ========== 数据库 A（RM1） ==========
XA START 'transaction_A';              -- 开启 XA 事务
UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
XA END 'transaction_A';                -- 结束 XA 事务
XA PREPARE 'transaction_A';            -- 进入准备状态

-- ========== 数据库 B（RM2） ==========
XA START 'transaction_B';              -- 开启 XA 事务
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;
XA END 'transaction_B';                -- 结束 XA 事务
XA PREPARE 'transaction_B';            -- 进入准备状态

-- ========== 全局提交（应用层协调） ==========
-- 如果所有分支都 Prepare 成功
XA COMMIT 'transaction_A';
XA COMMIT 'transaction_B';

-- ========== 全局回滚（任一分支失败） ==========
-- 如果任何一个分支 Prepare 失败
XA ROLLBACK 'transaction_A';
XA ROLLBACK 'transaction_B';
```

**2PC 的优缺点：**

| 优点 | 缺点 |
|------|------|
| ✅ 强一致性，保证原子性 | ❌ 同步阻塞，性能较差 |
| ✅ 原理简单，易于理解 | ❌ 单点故障（TM 挂了怎么办？） |
| ✅ MySQL 原生支持 XA 协议 | ❌ 数据隔离问题（中间状态可见） |

::: tip 其他方案
- **TCC（Try-Confirm-Cancel）**：应用层补偿机制
- **本地消息表**：基于消息的最终一致性
- **Saga**：长事务拆分为多个本地事务
:::

---

### 9. MySQL vs PostgreSQL 分布式事务对比

| 对比项 | MySQL XA | PostgreSQL 2PC |
|--------|----------|----------------|
| **协议标准** | XA 协议（X/Open CAE） | 两阶段提交（PREPARE TRANSACTION） |
| **准备语法** | `XA PREPARE 'id'` | `PREPARE TRANSACTION 'id'` |
| **提交语法** | `XA COMMIT 'id'` | `COMMIT PREPARED 'id'` |
| **回滚语法** | `XA ROLLBACK 'id'` | `ROLLBACK PREPARED 'id'` |
| **崩溃恢复** | 需手动恢复（`XA RECOVER`） | ✅ 自动恢复 |
| **查看方式** | `XA RECOVER` | `pg_prepared_xacts` 视图 |
| **性能开销** | 较高（锁定资源时间长） | 较高（类似 MySQL） |

::: tip PostgreSQL 优势
PostgreSQL 的 2PC 实现更简洁，且支持崩溃后自动恢复，不需要人工介入。
:::

::: warning 生产环境建议
2PC/XA 事务在生产环境中使用需要谨慎：
- **性能问题**：锁资源时间长，并发性能差
- **可用性问题**：单点故障可能导致长时间锁定
- **推荐方案**：优先考虑最终一致性方案（TCC、Saga、消息队列）
:::

---

### 10. 分布式事务的其他实现方案

**基于消息的最终一致性（推荐）：**

```sql
-- 本地事务 + 消息队列
BEGIN;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  INSERT INTO outbox (event_type, payload) VALUES ('TRANSFER', '{"to": 2, "amount": 100}');
COMMIT;

-- 消息消费者处理
-- 消费消息后更新另一个数据库
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
```

| 方案 | 一致性 | 性能 | 复杂度 | 适用场景 |
|------|--------|------|--------|----------|
| **2PC/XA** | 强一致性 | ⭐⭐ | ⭐ | 金融核心系统 |
| **TCC** | 最终一致性 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 高并发电商 |
| **Saga** | 最终一致性 | ⭐⭐⭐⭐ | ⭐⭐⭐ | 长流程业务 |
| **消息队列** | 最终一致性 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | 异步解耦场景 |

---

### 11. MySQL 与 MongoDB 地理索引对比

> **场景**：需要存储和查询地理位置数据（附近的人、距离计算、区域查询等）

#### MySQL 地理空间索引

MySQL 5.7+ 支持地理空间数据类型和空间索引，但功能相对有限。

**支持的几何类型：**

| 类型 | 说明 | 示例 |
|------|------|------|
| `GEOMETRY` | 任意几何类型 | 通用类型 |
| `POINT` | 点（经纬度） | 位置标记 |
| `LINESTRING` | 线串 | 路径、路线 |
| `POLYGON` | 多边形 | 区域范围 |
| `MULTIPOINT` | 多个点 | 多个位置 |

**基本使用示例：**

```sql
-- ========== 创建带地理坐标的表 ==========
CREATE TABLE places (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  location POINT NOT NULL,  -- 存储 POINT 类型
  SPATIAL INDEX idx_location (location)  -- 创建空间索引
) ENGINE=InnoDB;

-- ========== 插入地理坐标（经度, 纬度） ==========
INSERT INTO places (name, location) VALUES
('天安门', ST_GeomFromText('POINT(116.397128 39.916527)')),
('故宫', ST_GeomFromText('POINT(116.397477 39.918058)')),
('颐和园', ST_GeomFromText('POINT(116.273000 39.999000)'));

-- ========== 查询距离某个点一定范围内的地点 ==========
-- 查询距离天安门 5km 内的地点（使用矩形边界近似）
SELECT name,
       ST_Distance_Sphere(
         location,
         ST_GeomFromText('POINT(116.397128 39.916527)')
       ) / 1000 as distance_km
FROM places
WHERE ST_Distance_Sphere(
        location,
        ST_GeomFromText('POINT(116.397128 39.916527)')
      ) <= 5000  -- 5公里
ORDER BY distance_km;

-- ========== 计算两点之间的距离 ==========
SELECT ST_Distance_Sphere(
  (SELECT location FROM places WHERE name = '天安门'),
  (SELECT location FROM places WHERE name = '故宫')
) / 1000 as distance_km;

-- ========== 查询矩形区域内的地点 ==========
SELECT name
FROM places
WHERE MBRContains(
  ST_GeomFromText('LINESTRING(116.3 39.9, 116.5 40.0)'),
  location
);
```

**MySQL 地理索引限制：**

| 限制项 | 说明 |
|--------|------|
| **球形距离计算** | 5.7+ 支持 `ST_Distance_Sphere`，早期版本只支持平面距离 |
| **空间关系查询** | 功能较弱，不支持复杂的空间关系判断 |
| **地理坐标系** | 对 WGS84 (GPS 坐标系) 支持不如 PostgreSQL |
| **性能** | 大规模地理数据查询性能一般 |

---

#### MongoDB 地理空间索引

MongoDB 原生支持地理空间查询，功能强大且易用。

**支持的地理数据类型：**

| 类型 | 说明 | 坐标系 |
|------|------|--------|
| `2d` | 平面坐标索引 | 笛卡尔坐标 |
| `2dsphere` | 球面坐标索引（推荐） | GeoJSON / WGS84 |

**基本使用示例：**

```javascript
// ========== 创建集合并添加地理索引 ==========
db.places.createIndex({ location: "2dsphere" });

// ========== 插入地理坐标数据 ==========
db.places.insertMany([
  {
    name: "天安门",
    location: {
      type: "Point",
      coordinates: [116.397128, 39.916527]  // [经度, 纬度]
    }
  },
  {
    name: "故宫",
    location: {
      type: "Point",
      coordinates: [116.397477, 39.918058]
    }
  },
  {
    name: "颐和园",
    location: {
      type: "Point",
      coordinates: [116.273000, 39.999000]
    }
  }
]);

// ========== 查询附近地点（near 查询） ==========
db.places.find({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [116.397128, 39.916527]  // 天安门坐标
      },
      $maxDistance: 5000  // 5公里内
    }
  }
});

// ========== 使用 aggregate 计算距离 ==========
db.places.aggregate([
  {
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [116.397128, 39.916527]
      },
      distanceField: "distance",  // 距离字段
      maxDistance: 5000,           // 最大距离 5km
      spherical: true              // 使用球形计算
    }
  },
  {
    $project: {
      name: 1,
      distance: 1,
      distance_km: { $divide: ["$distance", 1000] }
    }
  }
]);

// ========== 查询圆形区域内的地点 ==========
db.places.find({
  location: {
    $geoWithin: {
      $centerSphere: [
        [116.397128, 39.916527],  // 中心点
        5 / 6378.1               // 半径（5km / 地球半径km）
      ]
    }
  }
});

// ========== 查询多边形区域内的地点 ==========
db.places.find({
  location: {
    $geoWithin: {
      $polygon: [
        [116.3, 39.9],  // 多边形顶点
        [116.5, 39.9],
        [116.5, 40.0],
        [116.3, 40.0]
      ]
    }
  }
});
```

---

#### MySQL vs MongoDB 地理索引对比

| 对比项 | MySQL | MongoDB |
|--------|-------|---------|
| **数据类型** | POINT, LINESTRING, POLYGON 等 | GeoJSON 格式 |
| **索引类型** | SPATIAL 索引 | 2dsphere / 2d 索引 |
| **坐标系** | 支持但不完善 | 原生支持 WGS84 |
| **距离计算** | `ST_Distance_Sphere` | `$geoNear`, `$near` |
| **查询语法** | SQL 函数 | GeoJSON 查询操作符 |
| **性能** | 中等 | 优秀 |
| **复杂查询** | 较弱 | 强大（多边形、圆形等） |
| **易用性** | 需要了解 GIS 函数 | JSON 格式，更直观 |

**使用建议：**

| 场景 | 推荐方案 | 原因 |
|------|----------|------|
| **简单位置查询** | MySQL | 已有 MySQL 基础设施 |
| **LBS 社交应用** | MongoDB | 性能好，查询灵活 |
| **地图应用** | PostgreSQL + PostGIS | 功能最强大 |
| **附近的人** | MongoDB | 2dsphere 索引性能优秀 |
| **复杂地理分析** | PostgreSQL + PostGIS | 专业 GIS 功能 |

::: tip MongoDB 地理索引优势
MongoDB 的 2dsphere 索针对 LBS（基于位置的服务）场景特别友好：
- 性能优秀，支持大规模地理数据
- 查询语法简洁，使用 GeoJSON 标准格式
- 支持多种地理形状（点、线、多边形）
- 距离计算精度高，支持球形距离
:::