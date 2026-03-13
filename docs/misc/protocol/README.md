---
title: Http、Tcp、Udp、Mqtt、Websocket 相关
date: 2026-3-13
categories:
  - Backend
tags:
  - node
  - grpc
sidebar: 'auto'
publish: true
---

### TCP 三次握手 四次挥手

::: right
TCP 是面向连接的可靠传输协议，三次握手建立连接，四次挥手断开连接
:::

::: tip 面试重点

1. **三次握手的原因**：防止失效连接、同步序列号、确认双方收发能力
2. **四次挥手的原因**：TCP 全双工，双方都要确认关闭
3. **TIME_WAIT 的作用**：确保 ACK 到达、让旧报文消失
4. **SYN Flood 攻击**：大量半连接耗尽资源，防御用 SYN Cookies
   :::

#### 一、TCP 三次握手

三次握手是指在**建立 TCP 连接**时，客户端和服务器总共发送 3 个包。

##### 过程图示

```
客户端                                          服务器

  1. SYN=1, seq=x  ─────────────────────▶  (监听)
        SYN_SENT                                   LISTEN

  2. SYN=1, ACK=1, seq=y, ack=x+1  ◀────────────────────
        SYN_RCVD                                      SYN_RCVD

  3. ACK=1, seq=x+1, ack=y+1  ─────────────────────▶
        ESTABLISHED                                   ESTABLISHED

  连接建立成功 ✅
```

##### 详细步骤

**第一次握手（SYN）**

- 客户端发送 SYN 包（seq=x），请求建立连接
- 客户端进入 `SYN_SENT` 状态
- **目的**：告诉服务器"我想和你建立连接"

**第二次握手（SYN+ACK）**

- 服务器收到 SYN 包，确认客户的 SYN（ack=x+1）
- 同时发送自己的 SYN 包（seq=y）
- 服务器进入 `SYN_RCVD` 状态
- **目的**：告诉客户端"我收到你的请求，我也想和你建立连接"

**第三次握手（ACK）**

- 客户端收到 SYN+ACK 包，确认服务器的 SYN（ack=y+1）
- 客户端进入 `ESTABLISHED` 状态
- 服务器收到 ACK 后也进入 `ESTABLISHED` 状态
- **目的**：告诉服务器"我收到你的确认，连接建立成功"

##### 为什么需要三次握手？

**1. 防止已失效的连接请求报文段突然又传送到了服务端**

```
场景：客户端发送的第一个连接请求在网络中滞留
客户端超时重发了第二个连接请求，建立连接并通信后关闭
这时第一个滞留的请求到达服务器

如果两次握手：
  - 服务器误以为是新的连接请求，建立连接
  - 客户端忽略服务器的数据，造成资源浪费

三次握手：
  - 服务器返回 SYN+ACK，客户端发现这不是当前请求
  - 客户端发送 RST（复位）拒绝连接
```

**2. 同步双方的初始序列号（ISN）**

```
双方都需要知道对方的初始序列号，才能可靠传输

第一次握手：客户端告诉服务器自己的 ISN（seq=x）
第二次握手：服务器告诉客户端自己的 ISN（seq=y）和确认（ack=x+1）
第三次握手：客户端确认服务器的 ISN（ack=y+1）
```

**3. 确认双方的收发能力都正常**

```
第一次：客户端发送正常，服务器接收正常 ✅
第二次：服务器发送正常，客户端接收正常 ✅
第三次：客户端发送正常，服务器接收正常 ✅
```

##### 抓包示例

```bash
# 使用 tcpdump 抓包
$ tcpdump -i any 'tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack != 0'

# 输出示例
IP 192.168.1.100.54321 > 192.168.1.1.80: Flags [S], seq 123456789
IP 192.168.1.1.80 > 192.168.1.100.54321: Flags [S.], seq 987654321, ack 123456790
IP 192.168.1.100.54321 > 192.168.1.1.80: Flags [.], ack 987654322
```

---

#### 二、TCP 四次挥手

四次挥手是指在断开 TCP 连接时，客户端和服务器总共发送 4 个包。

##### 过程图示

```
客户端                                          服务器

  1. FIN=1, seq=u  ─────────────────────▶  ESTABLISHED
        FIN_WAIT_1                                   ESTABLISHED

  2. ACK=1, seq=v, ack=u+1  ◀────────────────────
        FIN_WAIT_2                                    CLOSE_WAIT

  3. FIN=1, ACK=1, seq=w, ack=u+1  ◀────────────────────
        TIME_WAIT                                       LAST_ACK

  4. ACK=1, seq=u+1, ack=w+1  ─────────────────────▶
        CLOSED                                         CLOSED

  连接关闭成功 ✅
```

##### 详细步骤

**第一次挥手（FIN）**

- 客户端发送 FIN 包（seq=u），请求关闭连接
- 客户端进入 `FIN_WAIT_1` 状态
- **含义**："我没有数据要发了，但还能收"

**第二次挥手（ACK）**

- 服务器收到 FIN 包，发送 ACK（ack=u+1）
- 服务器进入 `CLOSE_WAIT` 状态
- 客户端收到 ACK 后进入 `FIN_WAIT_2` 状态
- **含义**："我收到你的关闭请求，但我还有数据要传"

**第三次挥手（FIN）**

- 服务器发送 FIN 包（seq=w），请求关闭连接
- 服务器进入 `LAST_ACK` 状态
- **含义**："我的数据传完了，可以关闭了"

**第四次挥手（ACK）**

- 客户端收到 FIN 包，发送 ACK（ack=w+1）
- 客户端进入 `TIME_WAIT` 状态，等待 2MSL 后关闭
- 服务器收到 ACK 后进入 `CLOSED` 状态
- **含义**："我收到你的关闭请求，连接关闭"

##### 为什么需要四次挥手？

**因为 TCP 是全双工协议**

```
全双工：双方可以同时发送和接收数据

关闭连接时：
  1. 客户端说"我不发了"（FIN）
  2. 服务器说"好的，知道了"（ACK）
     但服务器可能还有数据要传给客户端
  3. 服务器传完数据后说"我也不发了"（FIN）
  4. 客户端说"好的，知道了"（ACK）

所以需要四次，而不是三次
```

##### 为什么 TIME_WAIT 状态要等待 2MSL？

**MSL（Maximum Segment Lifetime）**：最大报文生存时间，通常是 30 秒或 1 分钟

**2MSL 的作用：**

```
1. 确保最后一个 ACK 能到达服务器
   - 如果 ACK 丢失，服务器会重传 FIN
   - 客户端在 2MSL 内收到重传的 FIN，可以重发 ACK

2. 确保当前连接的所有报文都从网络中消失
   - 防止旧连接的报文干扰新连接
   - 让网络中的"迷路"报文自然失效
```

**TIME_WAIT 的危害：**

```js
// 服务器场景
const net = require('net');

const server = net.createServer((socket) => {
  socket.on('end', () => {
    console.log('客户端关闭连接');
    socket.end();
  });
});

server.listen(3000, () => {
  console.log('服务器监听 3000 端口');
});

// 问题：
// - 频繁建立和关闭连接会导致大量 TIME_WAIT 状态
// - 占用端口和内存资源
// - 可能导致"地址已在使用"错误

// 解决方案：
// 1. 调整内核参数
//    net.ipv4.tcp_tw_reuse = 1  (允许重用 TIME_WAIT 端口)
//    net.ipv4.tcp_tw_recycle = 0 (关闭快速回收，可能导致 NAT 问题)
//
// 2. 客户端使用连接池
// 3. 服务器主动关闭连接（减少 TIME_WAIT）
```

---

#### 三、TCP 状态机

##### 客户端状态转换

```
CLOSED
  │
  │ (主动打开)
  ▼
SYN_SENT ──────────┐
  │                │ (收到 SYN+ACK)
  │ (收到 SYN+ACK)  ▼
  ▼            ESTABLISHED
ESTABLISHED         │
  │                │ (被动关闭)
  │ (主动关闭)      │
  ▼                │
FIN_WAIT_1         │
  │                │
  │ (收到 ACK)     │
  ▼                │
FIN_WAIT_2 ────────┤
  │                │
  │ (收到 FIN)     │
  ▼                ▼
TIME_WAIT        CLOSE_WAIT
  │                │
  │ (等待 2MSL)    │ (发送 FIN)
  ▼                ▼
CLOSED          LAST_ACK
                   │
                   │ (收到 ACK)
                   ▼
                 CLOSED
```

##### 服务器状态转换

```
CLOSED
  │
  │ (被动打开)
  ▼
LISTEN
  │
  │ (收到 SYN)
  ▼
SYN_RCVD
  │
  │ (收到 ACK)
  ▼
ESTABLISHED
  │
  │ (收到 FIN)
  ▼
CLOSE_WAIT
  │
  │ (应用层关闭)
  ▼
LAST_ACK
  │
  │ (收到 ACK)
  ▼
CLOSED
```

---

#### 四、常见问题

##### 1. 如果第三次握手丢失了会怎样？

```
客户端发送第三次握手的 ACK 后进入 ESTABLISHED 状态
服务器未收到 ACK，保持在 SYN_RCVD 状态

服务器会重传第二次握手（SYN+ACK），通常重试 5 次
如果仍然未收到，服务器关闭连接

客户端正常通信，但服务器未建立连接
导致状态不一致，但不会造成严重问题
```

##### 2. 如果已经建立连接，但客户端突然故障了会怎样？

```
TCP 设有保活计时器（Keepalive）

服务器每 2 小时发送一次探测报文
如果连续 10 次探测无响应，则认为客户端故障
关闭连接，释放资源

可以通过设置调整：
const net = require('net');
const socket = net.createConnection({
  host: 'example.com',
  port: 80,
  keepAlive: true,           // 启用 keepalive
  keepAliveInitialDelay: 0   // 立即开始探测
});
```

##### 3. SYN Flood 攻击是什么？

```
攻击原理：
- 攻击者发送大量 SYN 包，但不完成三次握手
- 服务器分配大量资源等待连接，资源耗尽

防御措施：
1. SYN Cookies：不分配资源，使用加密技术验证连接
2. 限制半连接数量
3. 缩短超时时间
4. 使用防火墙过滤

// Linux 配置
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 8192
net.ipv4.tcp_synack_retries = 2
```

##### 4. 为什么建立连接是三次，关闭连接是四次？

```
建立连接时：
  - 第二次握手 SYN+ACK 可以一起发送
  - 因为此时服务器没有数据要传

关闭连接时：
  - 服务器收到 FIN 后可能还有数据要传
  - 先发送 ACK 确认，等数据传完再发送 FIN
  - 所以 ACK 和 FIN 分开发送，多了一次
```

---

#### 五、实际应用

##### Node.js 中的 TCP 服务器

```js
const net = require('net');

// 创建 TCP 服务器
const server = net.createServer((socket) => {
  console.log('客户端连接:', socket.remoteAddress, socket.remotePort);

  // 监听数据
  socket.on('data', (data) => {
    console.log('收到数据:', data.toString());
    socket.write('服务器回复: ' + data);
  });

  // 监听连接关闭
  socket.on('end', () => {
    console.log('客户端关闭连接');
  });

  // 监听错误
  socket.on('error', (err) => {
    console.error('Socket 错误:', err);
  });

  // 主动关闭连接
  // socket.end(); // 发送 FIN
});

server.on('connection', (socket) => {
  // 获取 TCP 连接信息
  console.log('本地地址:', socket.localAddress, socket.localPort);
  console.log('远程地址:', socket.remoteAddress, socket.remotePort);

  // 设置 Keepalive
  socket.setKeepAlive(true, 10000); // 启用，10秒探测间隔
});

server.listen(3000, () => {
  console.log('TCP 服务器监听 3000 端口');
});

// 查看 TCP 连接状态
// Linux: netstat -antp | grep 3000
//       ss -antp | grep 3000
```

##### 使用 Wireshark 抓包分析

```bash
# 过滤 TCP 握手和挥手
tcp.flags.syn == 1 and tcp.flags.ack == 0  # 第一次握手
tcp.flags.syn == 1 and tcp.flags.ack == 1  # 第二次握手
tcp.flags.fin == 1                          # 挥手包

# 完整流程过滤
tcp.flags.syn == 1 || tcp.flags.fin == 1

# 显示详细信息
tcpdump -i any -n 'tcp[tcpflags] & (tcp-syn|tcp-fin) != 0'
```


### 👋 HTTP、TCP、UDP、MQTT 和 WebSocket

> HTTP、TCP、UDP、MQTT 和 WebSocket 是五种不同的通信协议，用于不同的目的。

#### HTTP（超文本传输协议）

是一种在互联网上发送和接收数据的协议。它用于在网页服务器和网页浏览器之间传输数据，是万维网的基础。

#### TCP（传输控制协议）

是一种传输层协议，在两台计算机之间提供可靠的流式连接。它用于建立和维护设备之间的连接，并确保数据按正确的顺序无误地传送。

#### UDP（用户数据报协议）

是另一种传输层协议，类似于 TCP。但是，与 TCP 不同的是，UDP 是无连接的，不保证数据的可靠传送。这使得 UDP 比 TCP 快，但也不太可靠。

#### MQTT（Message Queuing Telemetry Transport，消息队列遥测传输）

是一种轻量级的消息协议，适用于资源受限的环境（如物联网设备）中的通信。

它具有低带宽和低网络流量的特点，并且能够在不连接到互联网的情况下进行通信。

#### WebSocket

是一种协议，使客户端和服务器能够通过单个、持久连接进行双向通信。它用于实时应用程序，如在线游戏和聊天应用程序。

- 总的来说，HTTP 用于在互联网上传输数据，而 TCP、UDP 和 MQTT 用于建立和维护设备之间的连接。WebSocket 用于客户端和服务器之间的实时通信。

#### WebSocket Node.js 最小实现

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
