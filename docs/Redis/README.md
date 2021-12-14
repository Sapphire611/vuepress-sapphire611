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

## Docker挂载Redis && 进入Redis-Cli

``` shell
docker run -d --name redis -p 6379:6379 --restart always redis # Aha，顺便设置自启动
docker exec -it redis redis-cli
```

## Redis-Cli-Test

``` shell
127.0.0.1:6379> ping
PONG # 看到这个就代表成功了
```

::: warning Redis 五大数据类型

- String (90%+),二进制安全
- List
- Set
- Hash
- Zset

:::

## Key 相关命令

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

### String 相关命令

```
set k1 111
get k1

mset k1 v1 k2 v2 ...
msetnx k1 v1 k2 v2 ... # 原子性
mget k1 k2 ...

strlen k1 # 获得k1的长度 

setnx k1 111 #setnx 只有key不存在时才能成功

getrange k1 1 2 # (java) = k1.substring(1,2)
setrange k1 1 2 value

setex k1 600 vi # 同时设置过期时间
getset k1 v2 # 读 & 设置新值

# 以下命令是原子性操作（不会被线程调度机制打断）
incr k1  # +1
decr k1  # -1

incrby k1 10 # +10
decrby k1 10 # -10
```