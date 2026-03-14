---
title: StoreHub Interview
sidebar: auto
date: 2026-03-09
categories:
  - Backend
tags:
  - interview
publish: true
---

## StoreHub

### TCP/IP 在 OSI 网络模型中的哪一层？

TCP/IP 模型通常分为四层，与 OSI 七层模型的对应关系如下：

| TCP/IP 模型 | OSI 模型 | 协议举例 |
|------------|---------|---------|
| 应用层 | 应用层、表示层、会话层 (5-7层) | HTTP、FTP、SMTP、DNS |
| 传输层 | 传输层 (4层) | TCP、UDP |
| 网络层 | 网络层 (3层) | IP、ICMP、ARP |
| 网络接口层 | 数据链路层、物理层 (1-2层) | Ethernet、WiFi |

**TCP 工作在传输层（第4层）**，负责提供可靠的端到端数据传输服务。

**IP 工作在网络层（第3层）**，负责寻址和路由数据包。

---

### 线程和进程的关系，一个修改了对另一个有影响吗？

#### 进程（Process）
- 资源分配的基本单位，拥有独立的地址空间
- 进程之间完全隔离，一个进程崩溃不会影响其他进程
- 进程间通信（IPC）需要通过特定机制：管道、消息队列、共享内存、Socket 等

#### 线程（Thread）
- CPU 调度的基本单位，是进程内的执行单元
- 同一进程内的线程共享进程的地址空间、堆内存、全局变量等资源
- 每个线程有独立的：栈、寄存器、程序计数器

#### 修改的影响

| 场景 | 是否互相影响 | 说明 |
|-----|------------|------|
| 进程 A 修改自己的变量 | 不影响进程 B | 进程隔离，各自独立 |
| 进程 A 修改共享内存 | 影响进程 B | 需要同步机制防止竞态条件 |
| 同一进程内的线程 A 修改全局变量 | **影响线程 B** | 共享内存空间 |
| 同一进程内的线程 A 修改局部变量 | 不影响线程 B | 栈空间独立 |
| 线程 A 修改堆上的对象 | **影响线程 B** | 堆是共享的 |

---

### 二叉树遍历的英文名称及实现

#### 三种遍历方式的英文

| 中文名称 | 英文名称 | 遍历顺序 |
|---------|---------|---------|
| 先序遍历 | **Pre-order Traversal** | 根 → 左 → 右 |
| 中序遍历 | **In-order Traversal** | 左 → 根 → 右 |
| 后序遍历 | **Post-order Traversal** | 左 → 右 → 根 |

#### 代码实现

```javascript
class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// 构建示例二叉树
//       1
//      / \
//     2   3
//    / \
//   4   5
const root = new TreeNode(1,
  new TreeNode(2,
    new TreeNode(4),
    new TreeNode(5)
  ),
  new TreeNode(3)
);

// 先序遍历 (Pre-order): 根 → 左 → 右
// 结果: [1, 2, 4, 5, 3]
function preOrder(node, result = []) {
  if (!node) return result;
  result.push(node.val);      // 访问根
  preOrder(node.left, result); // 遍历左子树
  preOrder(node.right, result); // 遍历右子树
  return result;
}

// 中序遍历 (In-order): 左 → 根 → 右
// 结果: [4, 2, 5, 1, 3]
function inOrder(node, result = []) {
  if (!node) return result;
  inOrder(node.left, result);  // 遍历左子树
  result.push(node.val);       // 访问根
  inOrder(node.right, result); // 遍历右子树
  return result;
}

// 后序遍历 (Post-order): 左 → 右 → 根
// 结果: [4, 5, 2, 3, 1]
function postOrder(node, result = []) {
  if (!node) return result;
  postOrder(node.left, result);  // 遍历左子树
  postOrder(node.right, result); // 遍历右子树
  result.push(node.val);         // 访问根
  return result;
}

console.log('Pre-order:', preOrder(root));   // [1, 2, 4, 5, 3]
console.log('In-order:', inOrder(root));     // [4, 2, 5, 1, 3]
console.log('Post-order:', postOrder(root)); // [4, 5, 2, 3, 1]
```

---

### JavaScript 执行顺序（事件循环 Event Loop）

#### 完整代码

```javascript
console.log('start');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(() => {
  console.log('Promise1');
}).then(() => {
  console.log('promise2');
});

setImmediate(() => {
  console.log('setImmediate');
});

process.nextTick(() => {
  console.log('process.nextTick');
});

console.log('end');
```

#### 执行结果

```
start
end
process.nextTick
Promise1
promise2
setTimeout
setImmediate
```

#### 执行顺序分析

**Node.js 事件循环阶段（按优先级）：**

```
┌───────────────────────────┐
│        同步代码            │  第1阶段：主线程同步代码
│    console.log('start')   │
│    console.log('end')     │
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│   process.nextTick 队列   │  第2阶段：nextTick 优先级最高
│   (微任务，优先级 > Promise)│
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│   Promise/MutationObserver │  第3阶段：其他微任务
│   (微任务队列)              │
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│   timers 阶段              │  第4阶段：setTimeout/setInterval
│   setTimeout               │
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│   poll 阶段                │  第5阶段：I/O 回调
└───────────────────────────┘
            ↓
┌───────────────────────────┐
│   check 阶段               │  第6阶段：setImmediate
│   setImmediate             │
└───────────────────────────┘
```

**关键点：**

1. **同步代码优先**：`start` → `end`
2. **微任务优先级**：`process.nextTick` > `Promise.then`
3. **宏任务阶段**：`timers`（setTimeout）在 `check`（setImmediate）之前执行
4. **浏览器 vs Node.js**：在浏览器中没有 `process.nextTick` 和 `setImmediate`

**浏览器环境下的执行顺序：**
```
start
end
Promise1
promise2
setTimeout
```

---

### 算法题

[1. 两数之和](/backend/node/leetcode-js/#_1-两数之和)