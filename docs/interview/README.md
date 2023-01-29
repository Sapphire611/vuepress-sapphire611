---
title: Interview_Question
date: 2023-1-29
categories:
  - Backend
tags:
  - datebase
  - interview
sidebar: "auto"
publish: true
---

## 面试题积累

> Answered By :ChatGPT 

### 2023.1.29 

1. Redis是一个开源的内存数据库，它的特点在于速度快、支持数据持久化。那么问题来了，在Redis中如何实现数据持久化？

- Redis支持两种数据持久化方式：RDB和AOF。

- RDB（Redis DataBase）是一种快照方式，它会在一定时间间隔或者一定操作次数后将当前的数据集快照到磁盘上。这种方式的优点是速度快，缺点是可能会丢失一些最近的数据。

- AOF（Append Only File）是一种记录日志的方式，它会将每一次写操作记录下来，保证数据的完整性。这种方式的优点是数据完整性高，缺点是速度慢。

> 通常情况下，我们会使用两种方式同时进行数据持久化，既保证了数据的完整性又保证了速度。

---

2. MySQL是一种开源的关系型数据库管理系统，那么问题来了，在MySQL中如何查询一个表中某一列值出现次数最多的记录？

```sql
SELECT column_name, COUNT(column_name) 
FROM table_name 
GROUP BY column_name 
ORDER BY COUNT(column_name) DESC 
LIMIT 1;
```

> 在这里需要注意的是，如果该列中有重复的值，那么查询结果就会给出重复的值。

---

3. 在 MySQL 中，COUNT(*) 和 COUNT(1) 有什么区别呢？

- 在 MySQL 中，COUNT(*) 和 COUNT(1) 在查询结果上是没有区别的，它们都会返回表中的总行数。

- 不过在性能上有区别， COUNT(*) 需要遍历整个表中的每一行，而 COUNT(1) 仅需要读取索引中的值就能得到结果，速度要快一些。

- COUNT(*)会扫描所有行，然后统计总行数。而COUNT(1)会使用主键或者唯一键索引来统计行数，因此速度会更快。

> 在大多数情况下我们都可以使用COUNT(1)来代替COUNT(*)，来提升查询的性能。

---

4. 请介绍一下 Java 中的 HashMap 吧？

- HashMap是一种常用的基于哈希表的集合类型。它通过将键映射到数组上的某个索引来存储值。这个映射过程称为哈希化。

HashMap的实现主要包含以下几个部分：

- 数组：用于存储键值对。
- 哈希函数：用于将键映射到数组上的索引。
- 冲突解决机制：当出现两个键对应相同索引的情况时，解决冲突的方式。

在put的时候，会先通过hash函数将key映射到数组上的某个索引，如果该索引上已经存在值，会根据冲突解决机制进行处理。

在get的时候，也是先通过hash函数将key映射到数组上的某个索引，然后返回该索引上的值。

- HashMap在 Java 中采用了扩容机制来避免哈希冲突，当HashMap中的元素数量达到阈值（默认为0.75）时，就会将数组长度翻倍，并重新计算哈希值。

> 总之，HashMap是一种高效的映射表，其底层实现基于哈希表和数组，通过哈希函数和冲突解决机制实现高效的键值映射。

---

5. HashMap在 Java 中默认的容量和扩容阈值是什么?
  
> 在 Java 中，HashMap默认的初始容量为16，扩容阈值为0.75。

- 初始容量：HashMap在创建时会预先分配一定的空间来存储元素。默认情况下，HashMap的初始容量为16，也就是说，在创建HashMap对象时会预先分配16个空间来存储元素。

- 扩容阈值：当HashMap中的元素数量达到阈值（默认为0.75）时，就会将数组长度翻倍，并重新计算哈希值。这样可以避免哈希冲突，提高HashMap的查询效率。

你也可以在创建HashMap对象时，指定初始容量和扩容阈值。如：

```java
HashMap<String,String> map = new HashMap<String,String>(32, 0.9f);
```
> 这里的32表示初始容量为32，0.9表示扩容阈值为0.9。

注意，如果初始容量过小，会导致频繁的扩容操作，降低性能；如果初始容量过大，会浪费空间。

---

6. 什么是敏捷开发？

> 敏捷开发是一种软件开发方法，它强调通过小步快跑、高度协作、持续交付和持续反馈来开发高质量的软件。

敏捷开发的核心思想是：

- 可持续交付：通过迭代、小步快跑的方式不断交付可用的软件，提高客户满意度。
- 可持续改进：通过持续的反馈和改进来提高软件质量。
- 高度协作：通过极限编程、敏捷会议等方式来增强团队协作能力。

---

7. MongoDB 数据库中如何查询某一字段的最大值和最小值？

```sql
db.collection.aggregate([
    {
        $group: {
            _id: null,
            maxValue: { $max: "$fieldName" },
            minValue: { $min: "$fieldName" }
        }
    }
])
```
> 另外，Mongodb还有一个$addToSet 操作符 用于添加不重复的元素到一个集合中。

示例代码如下：

```sql
db.collection.aggregate([
    {
        $group: {
            _id: null,
            uniqueValues: { $addToSet: "$fieldName" }
        }
    }
])
```

---

8. 请问mongodb中分别有哪些索引，分别怎么使用呢？

#### 普通索引 (Index): 使用 **db.collection.createIndex()** 方法来创建。

#### 唯一索引 (Unique Index): 可以保证索引字段的值具有唯一性。

- 使用 **db.collection.createIndex({ field: 1 }, { unique: true })** 方法来创建。

#### 复合索引 (Compound Index): 在一个索引中同时包含多个字段。

- 使用 **db.collection.createIndex({ field1: 1, field2: -1 })** 方法来创建。

#### 全文索引 (Text Index): 用于全文搜索。

- 使用 **db.collection.createIndex({ field: "text" })** 方法来创建。

#### 地理空间索引 (Geospatial Index): 用于地理数据查询。

- 使用 **db.collection.createIndex({ field: "2dsphere" })** 

- 或 **db.collection.createIndex({ field: "2d" })** 方法来创建。

---

> 在mongoose定义Schema中使用demo:

```js
const schema = new mongoose.Schema({
    name: { type: String, index: 1 } // 升序索引
});


const schema = new mongoose.Schema({
    name: String,
    age: Number
});

schema.index({ name: 1, age: -1 }); // 复合索引

const schema = new mongoose.Schema({
    name: { type: String, index: { unique: true } }, // 唯一索引
    age: Number
});

const schema = new mongoose.Schema({
    name: String,
    age: { type: Number, index: { sparse: true } } // 稀疏索引，只索引非空字段
});

```