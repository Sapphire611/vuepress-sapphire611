---
title: 5分钟速通 Kafka
date: 2025-8-5
categories:
  - Backend
tags:
  - kafka
sidebar: 'auto'
publish: true
---

::: right
来自 [Sapphire611](http://sapphire611.github.io)
:::

## 👋 通过 docker-compose 安装 Kafka

> 使用 KRAFT 模式（不需要 Zookeeper）

```yaml
version: '3'
services:
  kafka:
    image: bitnami/kafka:latest
    ports:
      - '9092:9092'
    environment:
      - KAFKA_ENABLE_KRAFT=yes
      - KAFKA_CFG_PROCESS_ROLES=broker,controller
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092
      - KAFKA_CFG_NODE_ID=1
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=1@kafka:9093
      - ALLOW_PLAINTEXT_LISTENER=yes
```

### GUI

- [Releases · Bronya0/Kafka-King](https://github.com/Bronya0/Kafka-King/releases)

### Node Demo

#### producer.js

```js
const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
});
const admin = kafka.admin();

async function createTopic() {
  await admin.connect();
  try {
    await admin.createTopics({
      topics: [
        {
          topic: 'test-topic',
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    });
    console.log('Topic created successfully');
  } catch (error) {
    console.error('Error creating topic:', error);
  } finally {
    await admin.disconnect();
  }
}

async function sendMessage() {
  try {
    await producer.connect();
    await producer.send({
      topic: 'test-topic',
      messages: [
        {
          key: 'message2',
          value: 'Hello KafkaJS!',
          headers: {
            'correlation-id': '123456',
          },
        },
      ],
    });
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    if (error.type === 'UNKNOWN_TOPIC_OR_PARTITION') {
      console.log('Attempting to create topic...');
      await createTopic();
      await sendMessage(); // Retry sending the message
    }
  } finally {
    await producer.disconnect();
  }
}

sendMessage().catch(console.error);
```

#### consumer.js

```js
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'test-group' });
const admin = kafka.admin();

async function createTopic() {
  await admin.connect();
  try {
    await admin.createTopics({
      topics: [
        {
          topic: 'test-topic',
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    });
    console.log('Topic created successfully');
  } catch (error) {
    console.error('Error creating topic:', error);
  } finally {
    await admin.disconnect();
  }
}

async function consumeMessages() {
  try {
    // 先创建 topic
    await createTopic();

    // 然后连接 consumer 并订阅 topic
    await consumer.connect();
    await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          key: message.key.toString(),
          value: message.value.toString(),
          headers: message.headers,
        });
      },
    });
  } catch (error) {
    console.error('Error in consumer:', error);
  }
}

consumeMessages().catch(console.error);
```

## 面试题

### 为什么 Kafka 吞吐量远高于 RabbitMQ？

#### Kafka：

- 顺序磁盘 I/O（日志追加写入）

- 零拷贝（Zero-Copy）技术

- 批量发送/压缩

- 消费者主动拉取（减少 Broker 压力）

#### RabbitMQ：

- 基于内存操作（默认非持久化）

- 单条 ACK 机制

- Broker 主动推送（高并发时压力大）

### Kafka 能替代 RabbitMQ 吗？

> 不能完全替代：

- Kafka 不适合需要低延迟（如<1ms）或复杂路由规则的场景

- RabbitMQ 缺乏消息重放、流处理能力

| 对比项   | Kafka                                 | RabbitMQ                   |
| -------- | ------------------------------------- | -------------------------- |
| 吞吐量   | 高（百万级/秒）                       | 中（万级/秒）              |
| 延迟     | 较高（ms~s）                          | 极低（μs~ms）              |
| 消息顺序 | 分区有序                              | 队列有序                   |
| 适用场景 | 日志/流处理                           | 业务消息/任务队列          |
| 配置核心 | Topic + Partition + Producer/Consumer | Channel + Exchange + Queue |
