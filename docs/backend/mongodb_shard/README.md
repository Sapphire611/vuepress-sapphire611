---
title: MongoDB Shard Demo
date: 2025-6-24
categories:
  - mongodb
  - shard
sidebar: 'auto'
publish: true
showSponsor: true
---

## MongoDB Shard Demo

::: right
测试环境：Mac
已安装Docker相关环境
请确保 27017 ～ 27020 端口没有被占用
来自 [Sapphire611](http://sapphire611.github.io)
:::

### 1. docker-compose.yml

> 在目录下，创建docker-compose.yml文件

> --bind_ip_all 添加后，本地才能访问到

```yml
services:
  # 配置服务器 (Config Server)
  configsvr:
    image: mongo:5.0
    command: mongod --configsvr --replSet configrs --bind_ip_all --port 27017
    ports:
      - "27019:27017"
    volumes:
      - configsvr_data:/data/configdb
    networks:
      - mongodb-network

  # 分片服务器1 (Shard 1)
  shard1:
    image: mongo:5.0
    command: mongod --shardsvr --replSet shard1rs --bind_ip_all --port 27017
    ports:
      - "27018:27017"
    volumes:
      - shard1_data:/data/db
    networks:
      - mongodb-network

  # 分片服务器2 (Shard 2) 
  shard2:
    image: mongo:5.0
    command: mongod --shardsvr --replSet shard2rs --bind_ip_all --port 27017
    ports:
      - "27020:27017"
    volumes:
      - shard2_data:/data/db
    networks:
      - mongodb-network

  # 路由服务器 (Mongos)
  mongos:
    image: mongo:5.0
    command: mongos --configdb configrs/configsvr:27017 --bind_ip_all --port 27017
    ports:
      - "27017:27017"
    depends_on:
      - configsvr
      - shard1
      - shard2
    networks:
      - mongodb-network

volumes:
  configsvr_data:
  shard1_data:
  shard2_data:

networks:
  mongodb-network:
    driver: bridge
```


---

### 2. 启用容器

```bash
docker-compose up -d
```

---

### 3. 创建初始化命令文件

```bash
#!/bin/bash
# init.sh
# 完整分片集群初始化脚本

echo "=== 开始初始化MongoDB分片集群 ==="

# 1. 初始化配置服务器副本集
echo -n "正在初始化配置服务器副本集..."
docker-compose exec -T configsvr mongosh --eval '
rs.initiate({
  _id: "configrs",
  configsvr: true,
  members: [{ _id: 0, host: "configsvr:27017" }]
});
' > /dev/null && echo "完成"

# 2. 初始化分片副本集
echo -n "正在初始化分片1副本集..."
docker-compose exec -T shard1 mongosh --eval '
rs.initiate({
  _id: "shard1rs",
  members: [{ _id: 0, host: "shard1:27017" }]
});
' > /dev/null && echo "完成"

echo -n "正在初始化分片2副本集..."
docker-compose exec -T shard2 mongosh --eval '
rs.initiate({
  _id: "shard2rs",
  members: [{ _id: 0, host: "shard2:27017" }]
});
' > /dev/null && echo "完成"

# 3. 等待副本集初始化完成
echo -n "等待集群初始化(15秒)..."
for i in {1..15}; do
  sleep 1
  echo -n "."
done
echo "就绪"

# 4. 在mongos上执行分片配置
echo "正在配置分片集群..."
docker-compose exec -T mongos mongosh --eval '
// 添加分片到集群
print("添加分片到集群...");
sh.addShard("shard1rs/shard1:27017");
sh.addShard("shard2rs/shard2:27017");

// 对数据库启用分片
print("\n启用数据库分片...");
sh.enableSharding("sharded_db");

// 创建哈希分片键索引
print("\n创建分片键索引...");
db.getSiblingDB("sharded_db").orders.createIndex({ order_id: "hashed" });

// 对集合启用分片
print("\n启用集合分片...");
sh.shardCollection("sharded_db.orders", { order_id: "hashed" });

// 插入测试数据
print("\n插入测试数据(200条)...");
for (let i = 1; i <= 200; i++) {
  db.getSiblingDB("sharded_db").orders.insertOne({
    order_id: i,
    customer: "user_" + Math.floor(Math.random() * 50),
    amount: Math.random() * 500,
    created_at: new Date()
  });
  if (i % 50 == 0) print("已插入 " + i + " 条");
}

// 强制刷新分片分布统计
print("\n刷新分片分布统计...");
db.adminCommand({ flushRouterConfig: 1 });

// 获取分片分布详情
print("\n=== 详细分片分布 ===");
printjson(db.getSiblingDB("sharded_db").orders.getShardDistribution());

print("\n✅ 分片集群初始化完成");
'

echo "=== 初始化脚本执行完成 ==="
```
---

### 4. 给文件增加执行权限后执行

```
chmod +x init.sh
./init.sh
```

---

## Demo输出

```bash
liuliyi@liuliyideMacBook-Pro docker-compose % docker-compose up -d
[+] Running 8/8
 ✔ Network docker-compose_mongodb-network  Created                         0.0s
 ✔ Volume "docker-compose_shard1_data"     Created                         0.0s
 ✔ Volume "docker-compose_shard2_data"     Created                         0.0s
 ✔ Volume "docker-compose_configsvr_data"  Created                         0.0s
 ✔ Container docker-compose-configsvr-1    Started                         0.4s
 ✔ Container docker-compose-shard2-1       Started                         0.3s
 ✔ Container docker-compose-shard1-1       Started                         0.3s
 ✔ Container docker-compose-mongos-1       Started                         0.4s
liuliyi@liuliyideMacBook-Pro docker-compose % ./init.sh
=== 开始初始化MongoDB分片集群 ===
正在初始化配置服务器副本集...完成
正在初始化分片1副本集...完成
正在初始化分片2副本集...完成
等待集群初始化(15秒)..................就绪
正在配置分片集群...
添加分片到集群...

启用数据库分片...

创建分片键索引...

启用集合分片...

插入测试数据(200条)...
已插入 50 条
已插入 100 条
已插入 150 条
已插入 200 条

刷新分片分布统计...

=== 详细分片分布 ===
Shard shard1rs at shard1rs/shard1:27017
{
  data: '8KiB',
  docs: 92,
  chunks: 2,
  'estimated data per chunk': '4KiB',
  'estimated docs per chunk': 46
}
---
Shard shard2rs at shard2rs/shard2:27017
{
  data: '9KiB',
  docs: 108,
  chunks: 2,
  'estimated data per chunk': '4KiB',
  'estimated docs per chunk': 54
}
---
Totals
{
  data: '18KiB',
  docs: 200,
  chunks: 4,
  'Shard shard1rs': [
    '46.01 % data',
    '46 % docs in cluster',
    '93B avg obj size on shard'
  ],
  'Shard shard2rs': [
    '53.98 % data',
    '54 % docs in cluster',
    '93B avg obj size on shard'
  ]
}

✅ 分片集群初始化完成
=== 初始化脚本执行完成 ===
```
