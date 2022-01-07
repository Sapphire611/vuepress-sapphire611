---
title: Redis 学习笔记
date: 2022-1-7
categories:
  - Backend
tags:
  - redis
sidebar: "auto"
publish: true
---

## Redis 概念

[【尚硅谷】Redis 6 入门到精通 超详细 教程](https://www.bilibili.com/video/BV1Rv41177Af)

> Redis(Remote Dictinary Server),C 语言开发,高性能(key-value)数据库, **单线程 + 多路 IO 复用**

## Docker & Redis-Cli

```shell
docker run -d --name redis -p 6379:6379 --restart always redis # Aha，顺便设置自启动
docker exec -it redis redis-cli
```

### Redis-Cli-Test

```shell
127.0.0.1:6379> ping
PONG # 看到这个就代表成功了
```

::: warning Redis 五大数据类型

- String (90%+) ， 二进制安全
- List ，双向链表
- Set ，自动去重 ，字典
- Hash ，类似 HashMap，存储键值对
- Zset ，有序集合，score（从小到大排列）

:::

### Medis

[Medis For Redis GUI](https://getmedis.com/)

## Redis 基本操作

### Key 常用命令

```shell
keys *

exists key # 判断key是否存在

del key # 同步删除
unlink key # 异步删除

expire key 10 # 给key设置过期时间，单位是秒
ttl key # time-to-live,查看key还有多久过期，-1永不过期，-2已过期

select 1 # 切换数据库

dbsize # 查看当前数据库keys的数量

flushdb # 清空当前数据库
flushall # 清空所有数据库
```

### String 常用命令

```shell
set k1 111
get k1

mset k1 v1 k2 v2 ...
msetnx k1 v1 k2 v2 ... # 原子性
mget k1 k2 ...

strlen k1 # 获得k1的长度

setnx k1 111 #setnx 只有key不存在时才能成功

getrange k1 1 2 # (java) = k1.substring(1,2)
setrange k1 1 2 value

setex k1 600 v1 # 同时设置过期时间
getset k1 v2 # 读 & 设置新值

# 以下命令是原子性操作（不会被线程调度机制打断）
incr k1  # +1
decr k1  # -1

incrby k1 10 # +10
decrby k1 10 # -10
```

### list 常用命令

```shell
lpush / rpush k1 v1 k2 v2 ...
lpop / rpop k1 # 东西弹光了key就消失了

rpoplpush k1 k2 # 右弹 + 左插

lrange k1 0 -1 # <start> <stop> , 其中 0 -1 代表取所有值

lindex k1 1

llen k1

linsert k2 before/after k1 "value"

lrem k1 2 "value1" # 从k1左边删除2个value1

lset k1 1 "value2" # 将k1中下标为1的值替换成“value2”
```

### Set 常用命令

```shell
sadd set1 v1 v2 v3

smember set1
sismember set1 v1 # 判断set1中有无v1这个值

scard set1 # 返回set1中元素个数

srem set1 v1 v2 ... # 删除集合中的元素

spop set1 # 随机从该集合中吐出一个值

srandmember set1 3 # 随机从set1中取出3个值，但不会删除它们

smove k1 k2 v3 # 把v3从k1移到k2中

sinter k1 k2 # 交集

sunion k1 k2 # 并集

sdiff k1 k2 # 差集
```

### Hash 常用命令

```shell
hset user id 611
hset user name liuliyi

hmset user id 1 name liuliyi611 age 24 # 批量设置

HEXISTS user name # user.name 是否存在

HKEYS user # 查询user的所有key
HVALS user # 查询user的所有value
HGETALL user # 一次性查询user的所有内容

HINCRBY user age 10 # user.age += 10

HSETNX user wife sara # 只有没有此属性，才能设置成功
```

### ZSet 常用命令

```shell

zadd top 100 user1 90 user2 80 user3  # 从小到大排列

zrange top 0 -1
zrange top 0 -1 withscores # withscores 会带上分数一起显示

zrangebyscore top 90 100 # 显示 top 中 90～100 分的
zrangebyscore top 90 100 withscores

ZREVRANGEBYSCORE top 100 80 # 从大到小排列
ZREVRANGEBYSCORE top 100 80 withscores

ZINCRBY top 50 user1 # 给top中的user1加50

ZREM top user

ZCOUNT top 70 100

ZRANK top user2
```

## Redis 配置文件 && 发布+订阅

[Redis6 篇 （二）配置文件的介绍 + 发布和订阅](https://blog.csdn.net/qq_45408390/article/details/119730969)

## Redis 新数据类型

[Redis6篇 （三）Redis新数据类型](https://blog.csdn.net/qq_45408390/article/details/119731008)
### BitMaps

> 利用二进制扩展成字符串的方式存储数据,可用于查找用户是否访问过某文章

> "abc" = "01100001" + "01100010" + "01100011" = "011000010110001001100011"

```shell
SETBIT bitmap1 1 1
GETBIT bitmap1 1  # 1
GETBIT bitmap1 2  # 0

BITCOUNT bitmap1 # 计算bitmap1.count(下标=1)
BITCOUNT bitmap1 [start] [end] # 可以自定义count范围,其中-1代表倒数第一位,-2是倒数第二位，以此类推
```

::: warning
对于亿级用户来说，使用 Bitmaps 能节省很多的内存空间，但数量很少的情况下适得其反
:::

### HyperLogLog

> 是用来做基数统计(去重后的元素个数)的算法

> HyperLogLog 的优点是，在输入元素的数量或者体积非常非常大时，计算基数所需的空间总是固定的、并且是很小的。

```shell
pfadd HLL1 "test1" "test2" "test3" "test1"

pfcount HLL1 # 3

pfadd HLL2 "test2" "test3" "test4"

pfcount HLL2 # 3

pfmerge HLL3 HLL1 HLL2 # 把HLL1和HLL2合并成HLL3

pfcount HLL3 # 4
```

::: warning
HyperLogLog 只会根据输入元素来计算基数，而不会储存输入元素本身，所以 HyperLogLog 不能像集合那样，返回输入的各个元素。
:::

### Geospatial

> Redis 3.2 中增加了对GEO类型的支持。GEO，Geographic，地理信息的缩写,在地图上就是经纬度。

> redis基于该类型，提供了经纬度设置，查询，范围查询，距离查询，经纬度Hash等常见操作。

``` shell
127.0.0.1:6379> geoadd city 121.47 31.23 shanghai
(integer) 1
127.0.0.1:6379> geoadd city 106.50 29.53 chongqing
(integer) 1
127.0.0.1:6379> GEOPOS city shanghai
1) 1) "121.47000163793563843"
   2) "31.22999903975783553"
127.0.0.1:6379> GEOPOS city chongqing
1) 1) "106.49999767541885376"
   2) "29.52999957900659211"
127.0.0.1:6379> GEODIST city shanghai chongqing
"1447673.6920"
127.0.0.1:6379> GEORADIUS city 110 30 1000 km
1) "chongqing"
```