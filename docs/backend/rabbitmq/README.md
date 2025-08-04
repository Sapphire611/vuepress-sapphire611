---
title: 5分钟速通 RabbitMQ
date: 2025-8-4
categories:
  - Backend
tags:
  - rabbitmq
sidebar: 'auto'
publish: true
showSponsor: true
---

::: right
来自 [Sapphire611](http://sapphire611.github.io)
:::

## 👋 通过 docker 安装 rabbitMq

```shell
docker run -d --name rabbitmq --restart=always -p 15672:15672 -p 5672:5672 -e RABBITMQ_DEFAULT_USER=guest -e RABBITMQ_DEFAULT_PASS=guest --name rabbitmq:management
```

### GUI

- [默认账户：guest/guest](http://127.0.0.1:15672/)

### Node Demo

#### producer.js

> 生产者配置（带死信队列）

```js
const amqp = require('amqplib');

async function setupProducer() {
  try {
    // 1. 建立连接
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createConfirmChannel(); // 开启确认模式

    // 2. 声明死信交换机
    await channel.assertExchange('dlx.exchange', 'direct', {
      durable: true,
    });

    // 3. 声明死信队列
    await channel.assertQueue('dlx.queue', {
      durable: true,
    });

    // 4. 绑定死信队列
    await channel.bindQueue('dlx.queue', 'dlx.exchange', 'dlx.routing.key');

    // 5. 声明主队列（绑定死信配置）
    await channel.assertQueue('main.queue', {
      durable: true,
      // 死信配置
      deadLetterExchange: 'dlx.exchange',
      deadLetterRoutingKey: 'dlx.routing.key',
      // 可选：队列消息TTL（毫秒）
      messageTtl: 60000, // 1分钟过期
      // 可选：队列最大长度
      maxLength: 100,
    });

    // 6. 发送消息（带TTL示例）
    const message = {
      id: Date.now(),
      content: 'Important message',
    };

    channel.sendToQueue('main.queue', Buffer.from(JSON.stringify(message)), {
      persistent: true,
      // 消息级TTL（优先级高于队列TTL）
      // expiration: '30000' // 30秒过期
    });

    console.log(` [x] Sent message: ${JSON.stringify(message)}`);

    // 7. 关闭连接
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error('Producer error:', error);
  }
}

setupProducer();
```

#### consumer.js

> 消费者配置（带死信队列）

```js
const amqp = require('amqplib');

async function setupConsumer() {
  try {
    // 1. 建立连接
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    // 2. 声明死信交换机（应与生产者一致）
    await channel.assertExchange('dlx.exchange', 'direct', {
      durable: true,
    });

    // 3. 声明死信队列（应与生产者一致）
    await channel.assertQueue('dlx.queue', {
      durable: true,
    });

    // 4. 绑定死信队列
    await channel.bindQueue('dlx.queue', 'dlx.exchange', 'dlx.routing.key');

    // 5. 声明主队列（配置应与生产者一致）
    await channel.assertQueue('main.queue', {
      durable: true,
      deadLetterExchange: 'dlx.exchange',
      deadLetterRoutingKey: 'dlx.routing.key',
      // 可选：队列消息TTL（毫秒）
      messageTtl: 60000, // 1分钟过期
      // 可选：队列最大长度
      maxLength: 100,
    });

    // 6. 设置每次只处理一条消息（公平分发）
    channel.prefetch(1);

    console.log(' [*] Waiting for messages. To exit press CTRL+C');

    // 7. 主队列消费者
    channel.consume(
      'main.queue',
      async (msg) => {
        try {
          const message = JSON.parse(msg.content.toString());
          console.log(' [x] Received:', message);

          // 模拟业务处理
          await processMessage(message);

          // 处理成功，确认消息
          channel.ack(msg);
          console.log(' [√] Message processed successfully');
        } catch (error) {
          console.error(' [!] Processing failed:', error.message);

          // 处理失败，拒绝消息（不重新入队，转到死信队列）
          channel.nack(msg, false, false);
          console.log(' [→] Message sent to DLQ');
        }
      },
      { noAck: false }
    );

    // 8. 死信队列消费者
    channel.consume(
      'dlx.queue',
      (msg) => {
        const deadMessage = JSON.parse(msg.content.toString());
        console.error(' [DLQ] Received dead letter:', deadMessage);

        // 这里可以添加死信处理逻辑：
        // 1. 记录到数据库
        // 2. 发送报警通知
        // 3. 人工干预接口

        channel.ack(msg);
      },
      { noAck: false }
    );
  } catch (error) {
    console.error('Consumer error:', error);
  }
}

// 模拟业务处理函数
async function processMessage(message) {
  // 随机失败（模拟业务异常）
  if (Math.random() > 0.7) {
    throw new Error('Random processing error');
  }
  // 模拟处理耗时
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

setupConsumer();
```

### 死信

- 死信（Dead Letter）是指 RabbitMQ 中无法被正常消费的消息。这些消息通常会被重新路由到一个特殊的队列中，这个队列就称为死信队列（DLQ, Dead Letter Queue）。

### 延迟队列实现

> 通过 TTL+死信队列的组合可以实现延迟队列功能（RabbitMQ 本身没有直接提供延迟队列功能）。

- 创建带 TTL 和 DLX 的队列

- 消息过期后自动转入死信队列

- 消费者监听死信队列

## 面试题

### 如何保证 RabbitMQ 消息的可靠投递？

```js
// 1. 生产者确认模式 (Publisher Confirm)
const channel = await connection.createConfirmChannel(); // 开启确认模式

// 2. 消息持久化
await channel.assertQueue(queue, { durable: true }); // 队列持久化
channel.sendToQueue(queue, content, { persistent: true });// 消息持久化

// 3. 消费者手动ACK
channel.consume(queue, (msg) => {
  try {
    process(msg);
    channel.ack(msg); // 处理成功才确认
  } catch (err) {
    channel.nack(msg); // 处理失败拒绝
  }
}, { noAck: false }); // 必须关闭自动ACK

// 4. 备份交换机
await channel.assertExchange('main.exchange', 'direct', {
  durable: true,
  alternateExchange: 'ae.exchange' // 指定备份交换机
});
```

### RabbitMQ 如何实现延迟队列？有哪些方案？

- 方案1：TTL+死信队列（最常用）

```js
// 延迟队列设置
await channel.assertQueue('delay.queue', {
  deadLetterExchange: 'target.exchange',
  messageTtl: 60000 // 60秒后成为死信
});

// 消费者监听目标队列
await channel.assertQueue('target.queue');
channel.consume('target.queue', processMessage);
```

- 方案2：rabbitmq_delayed_message_exchange 插件

- 方案3：外部存储+定时任务

### 如何处理 RabbitMQ 消息积压问题？

- 扩容消费者

```javascript
// 启动多个消费者实例
for (let i = 0; i < 10; i++) {
  cluster.fork(); // 使用集群模式
}
```

- 批量消费模式

```javascript
channel.prefetch(100); // 提高预取数量
channel.consume(queue, (msg) => {
  batch.push(msg);
  if (batch.length >= 50) {
    bulkProcess(batch).then(() => batch.forEach(m => channel.ack(m)));
  }
});
```

- 临时消息转储

```javascript
// 将积压消息转移到临时队列
channel.consume('overload.queue', (msg) => {
  saveToRedis(msg).then(() => channel.ack(msg));
});
```

- 监控预警
```bash
# 监控队列积压情况
rabbitmqctl list_queues name messages_ready
```

- 动态伸缩

```javascript
// 根据队列长度自动扩展消费者
if (queueLength > 1000) {
  scaleUpConsumers();
}
```