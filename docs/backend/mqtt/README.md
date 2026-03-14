---
title: MQTT 相关
date: 2026-03-10
categories:
  - Backend
tags:
  - mqtt
sidebar: 'auto'
publish: true
---

## MQTT 面试知识点

### 1. MQTT 基础概念

**MQTT（Message Queuing Telemetry Transport）** 是一种轻量级的发布/订阅消息传输协议，专为低带宽、高延迟网络环境设计。

| 特性 | 说明 |
|------|------|
| **架构模式** | 发布/订阅（Pub/Sub） |
| **传输协议** | TCP/IP |
| **数据格式** | 二进制，头部仅 2 字节 |
| **设计目标** | 轻量、简单、易实现 |
| **适用场景** | IoT、车联网、移动应用 |

---

### 2. MQTT 核心组件

```
┌──────────┐                    ┌──────────┐
│ Publisher│ ──发布消息──→       │          │
│  (发布者) │                    │  Broker  │
└──────────┘                    │  (代理)  │
                                │          │
┌──────────┐                    │          │
│Subscriber│ ←──接收消息──      │          │
│ (订阅者) │                    └──────────┘
└──────────┘                         ↑  ↓
                                     │  │
                                   Topic (主题)
```

| 组件 | 说明 |
|------|------|
| **Broker** | 消息代理服务器，负责接收和转发消息（如 EMQX、Mosquitto） |
| **Publisher** | 消息发布者，向特定 Topic 发送消息 |
| **Subscriber** | 消息订阅者，订阅感兴趣的 Topic |
| **Topic** | 消息主题，支持层级结构（如 `home/livingroom/temperature`） |

---

### 3. QoS 质量等级（必考！）

MQTT 提供 3 种消息服务质量：

| QoS 等级 | 名称 | 说明 | 使用场景 |
|:--------:|------|------|----------|
| **0** | 最多一次 | 发送即忘，不确认 | 丢包影响不大的数据（如传感器温度） |
| **1** | 至少一次 | 确保消息送达，可能重复 | 需要确保送达但可容忍重复（如指令） |
| **2** | 恰好一次 | 确保消息只送达一次 | 不能重复的关键数据（如支付） |

**QoS 流程对比**：

```
【QoS 0 - At most once】
Publisher ────消息────→ Broker ────消息────→ Subscriber
  (无需确认)

【QoS 1 - At least once】
Publisher ────消息────→ Broker ←────PUBACK───
            ─────PUBACK──→ Broker ────消息────→ Subscriber ←────PUBACK───
  (确保送达，可能重复)

【QoS 2 - Exactly once】
Publisher ────消息────→ Broker ←────PUBREC───
            ─────PUBREL──→ Broker ←────PUBCOMP──
            ─────PUBCOMP──→ Broker ────消息────→ Subscriber (完整的 4 步握手)
  (确保只送达一次)
```

**面试话术**：
> "在实际项目中，我们车联网场景下：
> - 车辆位置数据用 QoS 0，实时性要求高，偶尔丢包没关系
> - 远程控制指令用 QoS 1，确保指令送达，重复执行影响不大
> - OTA 升级通知用 QoS 2，避免重复推送导致升级混乱"

---

### 4. Topic 主题与通配符

**Topic 层级结构**：

```
home                    # 一级主题
├── livingroom          # 二级主题
│   ├── temperature
│   └── humidity
└── bedroom
    ├── temperature
    └── light
```

**通配符类型**：

| 通配符 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `+` | 单级通配符 | 匹配单个层级 | `home/+/temperature` 匹配 `home/livingroom/temperature` |
| `#` | 多级通配符 | 匹配多个层级（只能用在末尾） | `home/#` 匹配 `home/livingroom/temperature` |

**订阅示例**：

```javascript
// 订阅所有房间的温度
client.subscribe('home/+/temperature')

// 订阅客厅的所有信息
client.subscribe('home/livingroom/#')

// 订阅所有家居数据
client.subscribe('home/#')
```

**注意事项**：
- 通配符只能在 **订阅时** 使用，发布时无效
- `#` 必须是 Topic 的最后一个字符
- 系统主题 `$SYS/#` 默认不允许订阅

---

### 5. Clean Session vs 持久会话

| 参数 | 说明 | 适用场景 |
|------|------|----------|
| **clean: true** | 客户端断开时清除会话状态 | 临时设备、在线状态重要 |
| **clean: false** | Broker 保留订阅和未送达消息（QoS 1/2） | 离线消息、移动应用 |

**面试话术**：
> "我们车联网项目中，T-Box 使用 clean:false，确保车辆离线时的指令在上线后能送达；而监控设备使用 clean:true，因为实时数据不需要离线缓存。"

---

### 6. 遗嘱消息（LWT - Last Will and Testament）

客户端在连接时设置遗嘱消息，当客户端**异常断开**时，Broker 会自动发送该消息。

```javascript
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  will: {
    topic: 'status/device001',
    payload: 'offline',
    qos: 1,
    retain: true
  }
});
```

**使用场景**：
- 设备离线通知
- 异常断开告警
- 状态监控

**正常断开 vs 异常断开**：

```javascript
// 正常断开：发送 DISCONNECT 数据包
client.end()

// 异常断开：网络故障、崩溃
// Broker 会检测到并发送遗嘱消息
```

---

### 7. 保留消息（Retain）

**Retain 标志**：Broker 保留最后一条消息，新订阅者会立即收到。

| Retain 值 | 说明 |
|-----------|------|
| `false` | 默认，Broker 不保留消息 |
| `true` | Broker 保留该 Topic 的最后一条消息 |

**使用场景**：

```javascript
// 发布传感器状态（保留消息）
client.publish('home/livingroom/temperature', '25', { retain: true })

// 新订阅者会立即收到最新的温度值
client.subscribe('home/livingroom/temperature')
// 立即收到: '25'
```

**典型应用**：
- 设备当前状态（温度、湿度等）
- 配置信息
- 仪表盘初始数据

---

### 8. 连接参数详解

```javascript
const client = mqtt.connect(url, {
  clientId: 'unique_client_id',  // 必须唯一，重复会互相踢下线
  clean: true,                    // 清除会话
  connectTimeout: 4000,           // 连接超时（毫秒）
  reconnectPeriod: 1000,          // 重连间隔（毫秒）
  keepalive: 60,                  // 心跳间隔（秒），默认 60
  username: 'user',               // 用户名（可选）
  password: 'pass',               // 密码（可选）
  will: {                         // 遗嘱消息（可选）
    topic: 'last/will',
    payload: 'client disconnected'
  }
});
```

**关键参数说明**：

| 参数 | 作用 | 注意事项 |
|------|------|----------|
| **clientId** | 客户端唯一标识 | 同一 clientId 的新连接会踢掉旧连接 |
| **keepalive** | 心跳检测 | 建议设置为 30-120 秒 |
| **reconnectPeriod** | 重连间隔 | 设为 0 禁用自动重连 |

---

### 9. MQTT vs HTTP vs WebSocket

| 对比项 | MQTT | HTTP | WebSocket |
|--------|------|------|-----------|
| **通信模式** | Pub/Sub | 请求/响应 | 全双工 |
| **连接开销** | 极小（2 字节头） | 大（HTTP 头） | 中等 |
| **推送能力** | 天然支持 | 需轮询/长轮询 | 天然支持 |
| **网络要求** | 低带宽、不稳定 | 稳定网络 | 稳定网络 |
| **适用场景** | IoT、车联网 | Web API | 实时通讯 |

---

### 10. 常见面试问题

#### Q1：MQTT 为什么适合物联网场景？

> "MQTT 专为 IoT 设计：
> 1. **轻量级**：头部仅 2 字节，节省带宽
> 2. **发布订阅**：解耦发布者和订阅者，支持多对多通讯
> 3. **QoS 机制**：适应不同网络质量
> 4. **异步通信**：支持设备离线消息
> 5. **低功耗**：适合电池供电设备"

#### Q2：QoS 1 和 QoS 2 的区别？

> "QoS 1 是'至少一次'，可能会重复；QoS 2 是'恰好一次'，通过 4 步握手确保不重复。
> 实际项目中，QoS 1 用于可重复的场景（如传感器数据），QoS 2 用于不能重复的场景（如远程控制指令）。"

#### Q3：如何保证消息不丢失？

> "多层保障：
> 1. 选择合适的 QoS（1 或 2）
> 2. 设置 clean: false 保留会话
> 3. 使用持久化存储（Redis、数据库）
> 4. 客户端 ACK 确认机制
> 5. 重连后重新订阅关键 Topic"

#### Q4：Topic 设计有什么最佳实践？

> "1. 使用层级结构，按 `/` 分隔
> 2. 命名清晰，如 `device/{id}/status`
> 3. 避免过深的层级（不超过 3 层）
> 4. 设备 ID 放在层级中而非 clientId
> 5. 生产环境避免使用 `#` 通配符"

#### Q5：MQTT 的安全机制有哪些？

> "1. **传输层**：使用 TLS/SSL（端口 8883）
> 2. **认证层**：用户名/密码、Client Certificate
> 3. **授权层**：ACL 访问控制列表（限制 Topic 读写权限）
> 4. **应用层**：消息加密、签名验证"

#### Q6：如何处理 MQTT 的离线消息？

> "1. 设置 clean: false
> 2. Broker 开启持久化（如 EMQX 的消息存储）
> 3. 订阅时使用 QoS 1 或 2
> 4. 客户端重连后重新订阅
> 5. 注意离线消息的存储限制和过期时间"

---

### 11. 实战技巧

#### 批量订阅

```javascript
// 一次订阅多个 Topic
client.subscribe(['sensor/temp', 'sensor/humidity', 'device/status'], {
  qos: 1
})
```

#### 消息去重（QoS 1 场景）

```javascript
const messageIds = new Set()

client.on('message', (topic, payload) => {
  const msg = JSON.parse(payload)

  // 检查是否重复
  if (messageIds.has(msg.id)) {
    console.log('Duplicate message, ignored')
    return
  }

  messageIds.add(msg.id)

  // 处理消息...
})
```

#### 心跳保活优化

```javascript
const client = mqtt.connect(url, {
  keepalive: 30,        // 30 秒心跳
  reconnectPeriod: 5000 // 5 秒重连
})

client.on('offline', () => {
  console.log('Client offline, will reconnect...')
})

client.on('reconnect', () => {
  console.log('Reconnecting...')
})
```

---

### 12. 常用 Broker 对比

| Broker | 特点 | 适用场景 |
|--------|------|----------|
| **EMQX** | 功能强大、高性能、支持集群 | 企业级、大规模 IoT |
| **Mosquitto** | 轻量、易部署 | 嵌入式设备、测试环境 |
| **HiveMQ** | 商业产品、企业级 | 大规模生产环境 |
| **VerneMQ** | 高并发、分布式 | 高吞吐场景 |

---

## 👋 通过 docker 安装 mqtt

[开始使用 MQTT](https://mqttx.app/zh/docs/get-started)

> 本地部署 MQTT Broker

```shell
docker run -d --name emqx -p 1883:1883 -p 8083:8083 -p 8883:8883 -p 8084:8084 -p 18083:18083 emqx/emqx
```

### mqtt 公有服务器地址

> 如果您不需要本地部署的 MQTT Broker，那么可以使用 EMQX 的线上公开版进行快速测试；

```js
Broker 地址: broker.emqx.io
Broker TCP 端口: 1883
Broker SSL 端口: 8883
```

## 安装 GUI - MQTTX

[安装 GUI](https://mqttx.app/zh#download)

### 使用 MQTTX GUI

> 一、建立 mqtt 连接

![mqttx 1](https://mqttx.app/images/mqttx-brokerinfo.png)

> 二、新建一个 topic
> 三、基于 topic 发送消息，注意在红框中选择 topic

![mqttx 2](https://mqttx.app/images/mqttx-message.png)

---

### Node 代码实现简易收发消息

```js
const mqtt = require('mqtt');
const host = '127.0.0.1';
const port = '1883';
const clientId = `mqtt_${Math.random() // 随机clientId
  .toString(16)
  .slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  // username: 'emqx',
  // password: 'public',
  reconnectPeriod: 1000,
});

const topic = 'sapphire611';

client.on('connect', () => {
  console.log('Connected');
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });

  // client.publish( // 打开这个就会发送消息
  //   topic,
  //   'nodejs mqtt test',
  //   { qos: 0, retain: false },
  //   (error) => {
  //     if (error) {
  //       console.error(error);
  //     }
  //   }
  // );
});

client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString());
});
```

::: right
来自 [Sapphire611](http://sapphire611.github.io)
:::
