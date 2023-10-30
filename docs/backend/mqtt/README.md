---
title: 5分钟速通 MQTT
date: 2022-9-29
categories:
  - Backend
tags:
  - rabbitmq
sidebar: "auto"
publish: true
showSponsor: true
---

## 👋  通过 docker 安装 mqtt  

[开始使用MQTT](https://mqttx.app/zh/docs/get-started)

> 本地部署 MQTT Broker

``` shell
docker run -d --name emqx -p 1883:1883 -p 8083:8083 -p 8883:8883 -p 8084:8084 -p 18083:18083 emqx/emqx
```

### mqtt 公有服务器地址

> 如果您不需要本地部署的 MQTT Broker，那么可以使用 EMQX 的线上公开版进行快速测试；

``` js
Broker 地址: broker.emqx.io
Broker TCP 端口: 1883
Broker SSL 端口: 8883
```

## 安装GUI - MQTTX

[安装GUI](https://mqttx.app/zh#download)


### 使用 MQTTX GUI

> 一、建立 mqtt 连接

![mqttx 1](https://mqttx.app/images/mqttx-brokerinfo.png)

> 二、新建一个topic
> 三、基于topic发送消息，注意在红框中选择topic

![mqttx 2](https://mqttx.app/images/mqttx-message.png)

---

### Node 代码实现简易收发消息

``` js
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
  reconnectPeriod: 1000
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

