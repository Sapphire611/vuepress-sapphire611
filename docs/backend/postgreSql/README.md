---
title: POSTGRESQL 相关
date: 2026-3-3
categories:
  - postgres
  - database
sidebar: 'auto'
publish: true
---

## POSTGRESQL 相关

### 1. PostgreSQL 相比 MySQL 的优势？

**PostgreSQL 是世界上最先进的开源关系型数据库，被称为"开源界的 Oracle"**

| 特性 | PostgreSQL | MySQL |
|------|-----------|-------|
| **SQL 标准** | 完全支持 SQL 标准 | 部分支持 |
| **复杂查询** | 支持窗口函数、递归查询、CTE | 8.0+ 支持窗口函数 |
| **数据类型** | JSON/JSONB、数组、GIS 等 | JSON 支持，但功能较弱 |
| **并发控制** | MVCC（无锁读） | MVCC + 间隙锁 |
| **事务完整性** | 完全支持 ACID | InnoDB 支持 ACID |
| **存储过程** | 支持 PL/pgSQL、Python 等 | 支持，但功能有限 |
| **外键约束** | 完全支持 | InnoDB 支持 |
| **全文搜索** | 内置强大支持 | 5.6+ 支持，功能较弱 |
| **适用场景** | 复杂查询、数据分析、高并发 | 简单查询、Web 应用、读多写少 |

**PostgreSQL 核心优势：**

1. **更强大的数据类型**

   **① JSON/JSONB**：原生支持，查询性能优于 MySQL

   ```sql
   -- 创建表（JSONB 列）
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100),
     data JSONB
   );

   -- 插入 JSON 数据
   INSERT INTO users (name, data) VALUES
   ('Alice', '{"age": 25, "city": "Beijing", "hobbies": ["reading", "coding"]}'),
   ('Bob', '{"age": 30, "city": "Shanghai", "hobbies": ["gaming", "travel"]}');

   -- 查询 JSON 字段
   SELECT name, data->>'age' as age, data->>'city' as city
   FROM users
   WHERE (data->>'age')::int > 25;

   -- 查询 JSON 数组
   SELECT name, data->'hobbies'->0 as first_hobby
   FROM users;

   -- 检查 JSON 键是否存在
   SELECT name FROM users WHERE data ? 'city';

   -- JSONB 包含查询（GIN 索引加速）
   SELECT name FROM users WHERE data @> '{"age": 25}';

   -- 更新 JSON 字段
   UPDATE users SET data = jsonb_set(data, '{age}', '26') WHERE id = 1;

   -- 创建 GIN 索引（性能优于 MySQL）
   CREATE INDEX idx_users_data ON users USING GIN (data);
   ```

   **② 数组类型**：可以直接存储数组

   ```sql
   -- 创建表（数组列）
   CREATE TABLE products (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100),
     tags TEXT[],              -- 文本数组
     prices NUMERIC(10,2)[],   -- 价格数组
     stock INTEGER[]           -- 库存数组
   );

   -- 插入数组数据
   INSERT INTO products (name, tags, prices, stock) VALUES
   ('iPhone', '{"electronics", "apple", "phone"}', '{7999, 8999, 9999}', '{100, 50, 30}'),
   ('MacBook', '{"electronics", "apple", "laptop"}', '{12999, 14999}', '{20, 10}');

   -- 查询数组元素
   SELECT name, tags[1] as first_tag, prices[1] as current_price
   FROM products;

   -- 检查数组是否包含某个值
   SELECT name FROM products WHERE 'apple' = ANY(tags);

   -- 检查数组是否包含所有值
   SELECT name FROM products WHERE tags @> '{electronics, apple}';

   -- 数组展开查询（unnest）
   SELECT name, unnest(tags) as tag, unnest(prices) as price
   FROM products;

   -- 更新数组元素
   UPDATE products SET stock[1] = 80 WHERE id = 1;

   -- 向数组追加元素
   UPDATE products SET tags = array_append(tags, 'new') WHERE id = 1;

   -- 数组聚合
   SELECT array_agg(DISTINCT unnest(tags)) as all_tags FROM products;
   ```

   **③ GIS 地理信息**：PostGIS 扩展，全球最强 GIS 数据库

   ```sql
   -- 安装 PostGIS 扩展
   CREATE EXTENSION postgis;

   -- 创建表（地理坐标）
   CREATE TABLE places (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100),
     location GEOGRAPHY(POINT, 4326)  -- 经纬度坐标
   );

   -- 插入地点（经度, 纬度）
   INSERT INTO places (name, location) VALUES
   ('天安门', ST_MakePoint(116.397128, 39.916527)),
   ('故宫', ST_MakePoint(116.397477, 39.918058)),
   ('颐和园', ST_MakePoint(116.273000, 39.999000));

   -- 查询距离某个点 5km 内的地点
   SELECT name,
          ST_Distance(location, ST_MakePoint(116.397128, 39.916527)) / 1000 as distance_km
   FROM places
   WHERE ST_DWithin(location, ST_MakePoint(116.397128, 39.916527), 5000);  -- 5km

   -- 计算两点距离
   SELECT name,
          ST_Distance(
            (SELECT location FROM places WHERE name = '天安门'),
            location
          ) / 1000 as distance_from_tiananmen
   FROM places;

   -- 查询某个矩形区域内的地点
   SELECT name FROM places
   WHERE ST_Within(
     location,
     ST_MakeEnvelope(116.3, 39.9, 116.5, 40.0, 4326)
   );

   -- 创建地理空间索引（GiST）
   CREATE INDEX idx_places_location ON places USING GIST (location);

   -- 多边形查询（查询某个多边形内的地点）
   SELECT name FROM places
   WHERE ST_Contains(
     ST_GeomFromText('POLYGON((116.3 39.9, 116.5 39.9, 116.5 40.0, 116.3 40.0, 116.3 39.9))', 4326)::geography,
     location
   );
   ```

2. **更复杂的查询能力**

### 什么是窗口函数？

   > 窗口函数可以在**不合并行**的情况下，对每一行数据进行"窗口范围内的计算"

   **通俗理解：**
   - **GROUP BY（聚合函数）**：把多行聚合成一行，只能看到"数学平均分"
   - **窗口函数**：保留每个同学的记录，但能看到"我比班上多少人高"、"我的排名"、"我的分数和平均分的差距"

   **核心示例：**

   ```sql
   -- 假设有员工表
   CREATE TABLE employees (
     id INT,
     name VARCHAR(50),
     department VARCHAR(50),
     salary INT
   );

   INSERT INTO employees VALUES
   (1, '张三', '技术部', 10000),
   (2, '李四', '技术部', 15000),
   (3, '王五', '技术部', 12000),
   (4, '赵六', '销售部', 8000),
   (5, '钱七', '销售部', 9000);

   -- ① 排名（不合并行）
   SELECT name, salary,
          RANK() OVER (ORDER BY salary DESC) as salary_rank
   FROM employees;
   -- 结果：5 行数据，每行都有排名
   -- | 李四 | 15000 | 1 |
   -- | 王五 | 12000 | 2 |
   -- | 张三 | 10000 | 3 |

   -- ② 部门内排名
   SELECT name, department, salary,
          RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank
   FROM employees;
   -- 技术部和销售部分别排名

   -- ③ 和部门平均工资对比
   SELECT name, salary,
          AVG(salary) OVER (PARTITION BY department) as dept_avg,
          salary - AVG(salary) OVER (PARTITION BY department) as diff
   FROM employees;
   -- 每个人都能看到自己工资和部门平均的差距

   -- ④ 累计求和
   SELECT month, sales,
          SUM(sales) OVER (ORDER BY month) as cumulative
   FROM sales_data;
   -- 1月: 1000 | 2月: 3000 (1000+2000) | 3月: 4500 (1000+2000+1500)

   -- ⑤ 同比/环比增长
   SELECT month, sales,
          LAG(sales) OVER (ORDER BY month) as last_month,  -- 上月数据
          sales - LAG(sales) OVER (ORDER BY month) as growth  -- 增长额
   FROM sales_data;
   ```

   **常用窗口函数：**

   | 函数 | 作用 | 示例 |
   |------|------|------|
   | `ROW_NUMBER()` | 连续排名（1,2,3,4） | 无并列 |
   | `RANK()` | 跳跃排名（1,2,2,4） | 有并列会跳号 |
   | `DENSE_RANK()` | 密集排名（1,2,2,3） | 有并列不跳号 |
   | `SUM() OVER` | 累计和 | 计算累计销售额 |
   | `AVG() OVER` | 移动平均 | 计算平均值 |
   | `LAG()` | 取前一行的值 | 同比增长 |
   | `LEAD()` | 取后一行的值 | 环比增长 |

   **窗口函数语法：**

   ```sql
   函数名 OVER (
     PARTITION BY ...  -- 分组（可选）
     ORDER BY ...      -- 排序（可选）
     窗口框架          -- 范围（可选，如 ROWS BETWEEN）
   )
   ```

   **递归查询（树形结构）：**

   ```sql
   -- 查询组织架构中的所有下属
   WITH RECURSIVE subordinates AS (
     -- 初始查询：找到某个员工
     SELECT * FROM employees WHERE id = 1
     UNION ALL
     -- 递归查询：找到所有下属
     SELECT e.* FROM employees e
     INNER JOIN subordinates s ON e.manager_id = s.id
   )
   SELECT * FROM subordinates;
   ```

3. **更可靠的并发控制**
   - MVCC 实现更优，读写不阻塞
   - 不需要间隙锁，死锁更少

4. **更好的扩展性**
   - 支持表分区、表继承
   - 丰富的扩展生态系统（PostGIS、pgcrypto、hstore 等）

---

### 2. 什么是 MVCC？PostgreSQL 如何实现？

**MVCC（多版本并发控制）是一种乐观锁机制，通过保存数据的多个版本实现读写不加锁**

#### PostgreSQL 的 MVCC 实现原理

**核心机制：通过元组（tuple）中的隐藏字段实现版本控制**

每个数据行（元组）包含两个隐藏字段：
- **xmin**：插入该行的事务 ID
- **xmax**：删除或更新该行的事务 ID

```
示例：UPDATE users SET balance = 900 WHERE id = 1;

1. 原始数据（xmin=100, xmax=0）
   | id | name  | balance | xmin | xmax |
   |----|-------|---------|------|------|
   | 1  | Alice | 1000    | 100  | 0    |

2. 更新操作（事务 200）
   - 旧行标记为失效（xmax=200）
   - 插入新行（xmin=200, xmax=0）

   旧行（xmax=200，表示被事务 200 删除）：
   | id | name  | balance | xmin | xmax |
   |----|-------|---------|------|------|
   | 1  | Alice | 1000    | 100  | 200  |

   新行（xmin=200）：
   | id | name  | balance | xmin | xmax |
   |----|-------|---------|------|------|
   | 1  | Alice | 900     | 200  | 0    |

3. 可见性判断
   - 读取事务根据自身的事务 ID 判断
   - 只能看到 xmin <= 当前事务 AND (xmax = 0 OR xmax > 当前事务) 的行
```

**PostgreSQL vs MySQL MVCC 对比：**

| 特性 | PostgreSQL | MySQL (InnoDB) |
|------|-----------|----------------|
| **版本存储** | 元组本身（旧版在堆中） | Undo Log（回滚段） |
| **更新机制** | 插入新行，标记旧行无效 | 覆盖原记录，旧版本移到 undo log |
| **空间回收** | VACUUM 进程清理死元组 | purge 线程清理 undo log |
| **长事务影响** | 导致表膨胀（需要频繁 VACUUM） | 导致 undo log 增大 |
| **读取性能** | 快（直接读堆） | 较慢（需构建读视图） |

**VACUUM 机制：**

PostgreSQL 需要定期执行 VACUUM 来清理死元组：

```sql
-- 手动清理
VACUUM users;

-- 分析表并更新统计信息
VACUUM ANALYZE users;

-- 自动清理（推荐启用）
-- 配置参数：
autovacuum = on
autovacuum_vacuum_scale_factor = 0.2  -- 20% 的数据死亡时触发
```

::: right
———— PostgreSQL 不会像 MySQL 那样出现 undo log 无限增长的问题，但需要定期 VACUUM
:::

---

### 3. PostgreSQL 索引类型有哪些？

PostgreSQL 提供了多种索引类型，针对不同场景优化：

| 索引类型 | 使用场景 | 示例 |
|---------|---------|------|
| **B-tree** | 默认索引，支持等值和范围查询 | `CREATE INDEX idx_name ON users (name);` |
| **GIN** | 数组、JSONB、全文搜索 | `CREATE INDEX idx_gin ON articles USING GIN (tags);` |
| **Hash** | 等值查询（=, IN） | `CREATE INDEX idx_hash ON users USING HASH (email);` |
| **GiST** | 几何数据、全文搜索 | `CREATE INDEX idx_gist ON places USING GIST (location);` |
| **SP-GiST** | 分区数据（电话、树形结构） | `CREATE INDEX idx_spgist ON phone USING SPGIST (number);` |
| **BRIN** | 大表（按块存储元数据） | `CREATE INDEX idx_brin ON logs USING BRIN (created_at);` |

**常用索引示例：**

```sql
-- 1. B-tree 索引（默认）
CREATE INDEX idx_users_email ON users (email);

-- 2. 复合索引（遵循最左前缀）
CREATE INDEX idx_users_age_balance ON users (age, balance);

-- 3. 唯一索引
CREATE UNIQUE INDEX idx_users_username ON users (username);

-- 4. 部分索引（只索引符合条件的行）
CREATE INDEX idx_active_users ON users (id) WHERE status = 'active';

-- 5. 表达式索引
CREATE INDEX idx_users_lower_name ON users (LOWER(name));

-- 6. JSONB 索引（GIN）
CREATE INDEX idx_users_data ON users USING GIN (data);

-- 查询 JSONB 字段
SELECT * FROM users WHERE data @> '{"key": "value"}';

-- 7. 全文搜索索引
CREATE INDEX idx_articles_content ON articles USING GIN (to_tsvector('english', content));

-- 全文搜索
SELECT * FROM articles
WHERE to_tsvector('english', content) @@ to_tsquery('english', 'PostgreSQL');

-- 8. BRIN 索引（适合日志、时序数据）
CREATE INDEX idx_logs_created ON logs USING BRIN (created_at);
```

**索引选择建议：**

- **B-tree**：90% 的场景，默认选择
- **GIN**：数组、JSONB、全文搜索
- **Hash**：仅等值查询，比 B-tree 更小更快
- **GiST**：地理数据、范围数据
- **BRIN**：超大表（日志、时序），索引极小但性能一般

---

### 4. PostgreSQL vs MySQL 索引对比

| 特性 | PostgreSQL | MySQL (InnoDB) |
|------|-----------|----------------|
| **默认索引** | B-tree | B-tree |
| **全文索引** | 内置（GIN） | FULLTEXT 索引 |
| **地理索引** | PostGIS（GiST） | 不支持 |
| **JSON 索引** | GIN（强大） | 虚拟列 + 索引（弱） |
| **部分索引** | ✅ 支持 | ❌ 不支持 |
| **表达式索引** | ✅ 支持 | MySQL 8.0+ 支持 |
| **并发索引创建** | ✅ CREATE INDEX CONCURRENTLY | ❌ 需要锁表