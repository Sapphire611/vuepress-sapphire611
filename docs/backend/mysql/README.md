---
title: MYSQL相关
date: 2026-3-3
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