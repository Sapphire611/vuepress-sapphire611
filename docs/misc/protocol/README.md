---
title: Http、Tcp、Udp、Mqtt、Websocket
date: 2023-1-9
categories:
  - Backend
tags:
  - node
  - grpc
sidebar: 'auto'
publish: true
---

## 👋 HTTP、TCP、UDP、MQTT 和 WebSocket

> HTTP、TCP、UDP、MQTT 和 WebSocket 是五种不同的通信协议，用于不同的目的。

### HTTP（超文本传输协议）

是一种在互联网上发送和接收数据的协议。它用于在网页服务器和网页浏览器之间传输数据，是万维网的基础。

### TCP（传输控制协议）

是一种传输层协议，在两台计算机之间提供可靠的流式连接。它用于建立和维护设备之间的连接，并确保数据按正确的顺序无误地传送。

### UDP（用户数据报协议）

是另一种传输层协议，类似于 TCP。但是，与 TCP 不同的是，UDP 是无连接的，不保证数据的可靠传送。这使得 UDP 比 TCP 快，但也不太可靠。

### MQTT（Message Queuing Telemetry Transport，消息队列遥测传输）

是一种轻量级的消息协议，适用于资源受限的环境（如物联网设备）中的通信。

它具有低带宽和低网络流量的特点，并且能够在不连接到互联网的情况下进行通信。

### WebSocket

是一种协议，使客户端和服务器能够通过单个、持久连接进行双向通信。它用于实时应用程序，如在线游戏和聊天应用程序。

- 总的来说，HTTP 用于在互联网上传输数据，而 TCP、UDP 和 MQTT 用于建立和维护设备之间的连接。WebSocket 用于客户端和服务器之间的实时通信。

### WebSocket Node.js 最小实现

> server.js

```js
'use strict';

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send(`server received ${message}`);
  });

  ws.send('Init message from server');
});
```

---

> client.js

[Websocket 测试工具，在线调试 - 在线工具](http://tools.fun/websocket.html)

```js
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = function () {
  ws.send('hello server');
};

ws.onmessage = function (event) {
  console.log('received:', event.data);
};
```
