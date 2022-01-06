---
title: Redis 学习笔记
date: 2021-12-14
categories:
 - Backend
tags:
 - redis
sidebar: 'auto'
publish: true
--- 

## Redis 概念

[【尚硅谷】Redis 6 入门到精通 超详细 教程](https://www.bilibili.com/video/BV1Rv41177Af)

> Redis(Remote DIctinary Server)是用C语言开发的一个开源的高性能键值对(key-value)数据库, **单线程 + 多路IO复用**

## Docker & Redis-Cli

``` shell
docker run -d --name redis -p 6379:6379 --restart always redis # Aha，顺便设置自启动
docker exec -it redis redis-cli

```

### Redis-Cli-Test

``` shell
127.0.0.1:6379> ping
PONG # 看到这个就代表成功了
```

::: warning Redis 五大数据类型

- String (90%+) ， 二进制安全
- List ，双向链表
- Set ，自动去重 ，字典 
- Hash ，类似HashMap，存储键值对
- Zset ，有序集合，score（从小到大排列）

:::

## Redis 基本操作

### Key 常用命令

``` shell
keys *

exists key # 判断key是否存在

del key # 同步删除
unlink key # 异步删除

expire key 10 # 给key设置过期时间，单位是秒
ttl key # time-to-live,查看key还有多久过期，-1永不过期，-2已过期

select # 切换数据库

dbsize # 查看当前数据库keys的数量

flushdb # 清空当前数据库
flushall # 清空所有数据库
```

### String 常用命令

``` shell
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

``` shell
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

``` shell
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

``` shell
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

``` shell

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