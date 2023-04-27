---
title: 5分钟速通 RabbitMQ
date: 2022-9-29
categories:
  - backend
tags:
  - rabbitMQ
sidebar: "auto"
publish: true
showSponsor: true
---

## 👋  通过 docker 安装 rabbitMq 

```shell
docker run -d --restart=always -p 15672:15672 -p 5672:5672 -e RABBITMQ_DEFAULT_USER=guest -e RABBITMQ_DEFAULT_PASS=guest rabbitmq:management
```

### GUI

- [默认账户：guest/guest](http://127.0.0.1:15672/)

### Node代码实现简易收发消息

#### consumer.js

``` js
const amqp = require('amqplib');

(async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel(); // 这里叫channel，和topic概念一致
  const queue = 'test';

  await channel.assertQueue('test'); /
  // 监听 test 队列中的内容
  console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);

  // 接受消息
  channel.consume(
    queue,
    function(msg) {
      console.log(' [x] Received %s', msg.content.toString());
      channel.ack(msg);
    },
    {
      noAck: false
    }
  );

  // await channel.close();
  // await connection.close();
})().catch((err) => {
  console.log(err);
});

```

#### producer.js

```js
const amqp = require('amqplib');

(async () => {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'test';
  await channel.assertQueue(queue);
  channel.sendToQueue(
    queue,
    Buffer.from(
      moment()
        .unix()
        .toString()
    )
  );
})().catch((err) => {
  console.log(err);
});

```
::: right
来自 [Sapphire611](http://www.sapphire611.com)
:::

