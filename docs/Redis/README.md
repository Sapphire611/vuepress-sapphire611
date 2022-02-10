---
title: Redis 学习笔记
date: 2022-1-21
categories:
  - Backend
tags:
  - redis
sidebar: "auto"
publish: true
---

## Redis 概念

[【尚硅谷】Redis 6 入门到精通 超详细 教程](https://www.bilibili.com/video/BV1Rv41177Af)

[cV展示的学习园 (这人笔记写的很好)](https://blog.csdn.net/qq_45408390/category_11225849.html)

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

## Redis 配置文件

[Redis6 篇 （二）配置文件的介绍](https://blog.csdn.net/qq_45408390/article/details/119730969)

## Redis 发布 & 订阅

```shell
subscribe channel1 # Terminal 1
publish channel1 hello #Terminal 2
```

## Redis 新数据类型

[Redis6 篇 （三）Redis 新数据类型](https://blog.csdn.net/qq_45408390/article/details/119731008)

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

> Redis 3.2 中增加了对 GEO 类型的支持。GEO，Geographic，地理信息的缩写,在地图上就是经纬度。

> redis 基于该类型，提供了经纬度设置，查询，范围查询，距离查询，经纬度 Hash 等常见操作。

```shell
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

## Redis 事务操作

[Redis6 篇 （五）Redis 事务操作 + Redis 事务-秒杀案例](https://blog.csdn.net/qq_45408390/article/details/119731054)

### 事务的概述

- Redis 事务是一个单独的隔离操作：事务中的所有命令都会序列化、按顺序地执行。
- 事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。

### Multi、Exec、discard

- 从输入 Multi 命令开始，输入的命令都会依次进入命令队列中，但不会执行
- 直到输入 Exec 后，Redis 会将之前的命令队列中的命令依次执行
- 组队的过程中可以通过 discard

---

![img](https://img-blog.csdnimg.cn/7af10e13b126438f8333e90c11e3e56b.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ1NDA4Mzkw,size_16,color_FFFFFF,t_70#pic_center)

---

```shell
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> flushdb
QUEUED
127.0.0.1:6379(TX)> set k1 v1
QUEUED
127.0.0.1:6379(TX)> set k2 v2
QUEUED
127.0.0.1:6379(TX)> SET k3 v3
QUEUED
127.0.0.1:6379(TX)> exec
1) OK
2) OK
3) OK
4) OK
```

```shell
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> del k1
QUEUED
127.0.0.1:6379(TX)> del k2
QUEUED
127.0.0.1:6379(TX)> del k3
QUEUED
127.0.0.1:6379(TX)> discard # discard后上述命令全部失效
OK
127.0.0.1:6379> keys *
1) "k3"
2) "k2"
3) "k1"
```

### 事务的错误处理

- 组队中某个命令出现了报告错误，执行时整个的所有队列都会被取消
- 如果执行阶段某个命令报出了错误，则只有报错的命令不会被执行，而其他的命令都会执行，不会回滚。

```shell
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> del k1 # 这句执行了
QUEUED
127.0.0.1:6379(TX)> del k2 # 这句执行了
QUEUED
127.0.0.1:6379(TX)> incr k3 # 这句没执行
QUEUED
127.0.0.1:6379(TX)> exec
1) (integer) 1
2) (integer) 1
3) (error) ERR value is not an integer or out of range
127.0.0.1:6379> keys *
1) "k3"
```

### 乐观锁 & 悲观锁

::: tip

- 乐观锁(Optimistic Lock), 顾名思义，就是很乐观，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据，可以使用版本号等机制。乐观锁适用于多读的应用类型，这样可以提高吞吐量。Redis 就是利用这种 check-and-set 机制实现事务的。
  :::

::: warning

- 悲观锁(Pessimistic Lock), 顾名思义，就是很悲观，每次去拿数据的时候都认为别人会修改，所以每次在拿数据的时候都会上锁，这样别人想拿这个数据就会 block 直到它拿到锁。传统的关系型数据库里边就用到了很多这种锁机制，比如行锁，表锁等，读锁，写锁等，都是在做操作之前先上锁。
  :::

### WATCH 

- 在执行 multi 之前，先执行 watch key1 [key2],可以监视一个(或多个) key
- 如果在事务执行之前这个(或这些) key 被其他命令所改动，那么事务将被打断。

```shell
127.0.0.1:6379> get k1
"120"
127.0.0.1:6379> watch k1 # 监视 k1
OK
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> incrby k1 123
QUEUED

######### 另一个终端窗口
127.0.0.1:6379> set k1 111 # 修改了 k1
OK
######### 

127.0.0.1:6379(TX)> exec
(nil) # 在开启事务的时候，在执行前先修改一下信息，就会执行失败，这是watch key的作用
```

### UNWATCH

- 取消 WATCH 命令对所有 key 的监视。
- 如果在执行 WATCH 命令之后，EXEC 命令或DISCARD 命令先被执行了的话，那么就不需要再执行UNWATCH了

## Redis 持久化

[Redis6 篇 （六）Redis持久化](https://blog.csdn.net/qq_45408390/article/details/119731077)

> RDB = Redis Database = 在指定的时间间隔内将内存中的数据集快照snapshot写入到磁盘中

> AOF = Append Only File = 以日志形式记录每一个写操作（只许追加不可改写）
  
![img](https://img-blog.csdnimg.cn/6a123386c00041e78ac56f4f3f55af86.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ1NDA4Mzkw,size_16,color_FFFFFF,t_70#pic_center)

![img](https://img-blog.csdnimg.cn/1f1dde2ddf914e7b89f1571076ef9ed9.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ1NDA4Mzkw,size_16,color_FFFFFF,t_70#pic_center)

### AOF和RDB的选择
> 官方推荐两个都启用。

- 如果对数据不敏感，可以选单独用RDB。

- 不建议单独用 AOF，因为可能会出现Bug。

- 如果只是做纯内存缓存，可以都不用。

::: tip 

- RDB持久化方式能够在指定的时间间隔能对你的数据进行快照存储

- AOF持久化方式记录每次对服务器写的操作,当服务器重启的时候会重新执行这些命令来恢复原始的数据,AOF命令以redis协议追加保存每次写的操作到文件末尾.

- Redis还能对AOF文件进行后台重写,使得AOF文件的体积不至于过大

- 如果你只希望你的数据在服务器运行的时候存在,你也可以不使用任何持久化方式.

:::

### 性能建议

```shell
因为RDB文件只用作后备用途，建议只在Slave上持久化RDB文件，而且只要15分钟备份一次就够了，只保留save 900 1这条规则。

如果使用AOF，好处是在最恶劣情况下也只会丢失不超过两秒数据，启动脚本较简单只load自己的AOF文件就可以了。

代价,一是带来了持续的IO，二是AOF rewrite的最后将rewrite过程中产生的新数据写到新文件造成的阻塞几乎是不可避免的。

只要硬盘许可，应该尽量减少AOF rewrite的频率，AOF重写的基础大小默认值64M太小了，可以设到5G以上。

默认超过原大小100%大小时重写可以改到适当的数值。

————————————————
版权声明：本文为CSDN博主「cv展示」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/qq_45408390/article/details/119731077
```
## Redis 主从复制 + Redis集群

[Redis6篇 （七）Redis主从复制 + Redis集群](https://blog.csdn.net/qq_45408390/article/details/119731094)

[Redis.conf 原文件 + 配置详解](https://blog.csdn.net/super1223/article/details/119060113)

![img](https://img-blog.csdnimg.cn/652465d11add436ea377bfe71c983b44.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ1NDA4Mzkw,size_16,color_FFFFFF,t_70#pic_center)

### 搭建主从复制

[Error: No such file or directory @ rb_sysopen (缺少某库的解决方法)](https://blog.csdn.net/wq57885/article/details/121392104)

```
brew install ca-certificates # 看报错，少什么brew
```

[mac brew安装redis (mac本地安装redis，便于操作)](https://www.cnblogs.com/qianmaoliugou/p/15006539.html)

```
brew install redis
```

---


<img style="border:2;" src="/img/redis-test.jpg">

---

```shell
###################### redis6379.conf #######################
include myredis/redis.conf # 测试中没使用绝对路径，否则前面增加‘/’
pidfile /var/run/redis_6379.pid
port 6379
dbfilename dump6379.rdb

###################### redis6380.conf #######################
include myredis/redis.conf
pidfile /var/run/redis_6380.pid
port 6380
dbfilename dump6380.rdb

###################### redis6381.conf #######################
include myredis/redis.conf
pidfile /var/run/redis_6381.pid
port 6381
dbfilename dump6381.rdb
```
```shell
liuliyi@liuliyideMacBook-Pro redis-test % redis-server redis6379.conf
liuliyi@liuliyideMacBook-Pro redis-test % redis-server redis6380.conf
liuliyi@liuliyideMacBook-Pro redis-test % redis-server redis6381.conf

liuliyi@liuliyideMacBook-Pro redis-test % ps -ef | grep redis
  501  8617     1   0  3:23下午 ??         0:00.63 /opt/homebrew/opt/redis/bin/redis-server 127.0.0.1:6379
  501  8685     1   0  3:30下午 ??         0:00.51 redis-server 127.0.0.1:6380
  501  8687     1   0  3:30下午 ??         0:00.50 redis-server 127.0.0.1:6381
  501  8841  3363   0  3:32下午 ttys001    0:00.00 grep redis

liuliyi@liuliyideMacBook-Pro redis-test % redis-cli -p 6379 # 进入指定端口的redis服务
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:0 # 现在没有附属机
master_failover_state:no-failover
master_replid:e44ac240b5de658e4541aa0bddf6645325214997
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:0
second_repl_offset:-1
repl_backlog_active:0
repl_backlog_size:1048576
repl_backlog_first_byte_offset:0
repl_backlog_histlen:0

liuliyi@liuliyideMacBook-Pro redis-test % redis-cli -p 6380
127.0.0.1:6380> slaveof 127.0.0.1 6379 # 设置主人为6379
OK

liuliyi@liuliyideMacBook-Pro redis-test % redis-cli -p 6381
127.0.0.1:6381> slaveof 127.0.0.1 6379
OK

liuliyi@liuliyideMacBook-Pro redis-test % redis-cli -p 6379
127.0.0.1:6379> info replication
# Replication
role:master
connected_slaves:2 # 有两台从机了
slave0:ip=127.0.0.1,port=6380,state=online,offset=28,lag=0
slave1:ip=127.0.0.1,port=6381,state=online,offset=28,lag=1
master_failover_state:no-failover
master_replid:0146ab97e819f0c04303677fc70f451a3f1aa244
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:28
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:28
```
::: warning Q & A
- 从机会【全量】复制主机的内容
- 在主机上写，在从机上可以读取数据，在从机上写数据报错
- 主机挂掉，重启就行，一切如初，从机重启需重设：slaveof 127.0.0.1 6379
- 主机shutdown后，从机原地待命，等待主机重新启动，一切回复正常
:::

::: tip 复制原理
- Slave启动成功连接到master后会发送一个sync命令
- Master接到命令启动后台的存盘进程，同时收集所有接收到的用于修改数据集命令， 在后台进程执行完毕之后，master将传送整个数据文件到slave,以完成一次完全同步
- 全量复制：而slave服务在接收到数据库文件数据后，将其存盘并加载到内存中。
- 增量复制：Master继续将新的所有收集到的修改命令依次传给slave,完成同步
- 但是只要是重新连接master,一次完全同步（全量复制)将被自动执行
:::

### 反客为主

> 从机也可以有从机，还可以在主机挂掉的时候反客为主

``` shell
slaveof no one # 反客为主
```

### 哨兵模式

> 反客为主的自动版，能够后台监控主机是否故障，如果故障了根据投票数自动将从库转换为主库

> 先搭建一主二从的环境，自定义的/myredis目录下新建sentinel.conf文件

```shell
###################### sentinel.conf #######################
# 其中mymaster为监控对象起的服务器名称， 1 为至少有多少个哨兵同意迁移的数量。
sentinel monitor mymaster 127.0.0.1 6379 1
```

![img](https://img-blog.csdnimg.cn/06d6391b367d46309376900f9962e3cc.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ1NDA4Mzkw,size_16,color_FFFFFF,t_70#pic_center)

## Redis集群

::: warning 集群之前遇到的问题
1. 容量不够，redis如何进行扩容？
2. 并发写操作， redis如何分摊？
3. 主从模式，薪火相传模式，主机宕机，导致ip地址发生变化，应用程序中配置需要修改对应的主机地址、端口等信息。

redis3.0中提供了解决方案。就是无中心化集群配置。
:::

### 集群概述

- Redis 集群实现了对Redis的水平扩容
- 即启动N个redis节点，将整个数据库分布存储在这N个节点中，每个节点存储总数据的1/N。

- Redis 集群通过分区（partition）来提供一定程度的可用性（availability）
- 即使集群中有一部分节点失效或者无法进行通讯， 集群也可以继续处理命令请求。
  
![img](https://img-blog.csdnimg.cn/a119e8e84725496b9cc8022f62f98260.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ1NDA4Mzkw,size_16,color_FFFFFF,t_70#pic_center)

::: danger 总结：Redis部署的四种模式
1. 单机模式 💻
2. 主从模式 💻 - 💻 - 💻
3. 哨兵模式 🪖 - ?>> 💻
4. 集群模式 💻💻💻💻💻💻 !>> 💻
:::

[具体命令点击查看，没往下写了](https://blog.csdn.net/qq_45408390/article/details/119731094)