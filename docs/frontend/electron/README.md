---
title: Electron 相关
date: 2026-03-13
categories:
  - Frontend
tags:
  - electron
  - interview
sidebar: auto
publish: true
---

## 🎯 Electron 相关

:::right
Electron 是基于 Chromium 和 Node.js 的跨平台桌面应用开发框架，适合快速构建桌面应用
:::

---

### 为什么 Electron 要设计成多进程架构？

1. **安全性**：渲染进程无法直接访问 Node.js，降低 XSS 攻击风险
2. **稳定性**：一个渲染进程崩溃不会影响其他窗口
3. **性能**：利用多核 CPU，提升应用整体性能

### 主进程 vs 渲染进程对比

| 维度 | 主进程 (Main Process)                 | 渲染进程 (Renderer Process)     |
| ---- | ------------------------------------- | ------------------------------- |
| 数量 | 整个应用只有一个                      | 每个窗口一个，可以有多个        |
| 职责 | 应用生命周期管理、菜单、IPC、系统交互 | 页面 UI 渲染、业务逻辑          |
| 权限 | 完整 Node.js 权限                     | 默认无 Node.js 权限（安全考虑） |
| 入口 | package.json 的 main 字段指定         | 每个窗口加载的 HTML 文件        |


### Preload 脚本的作用

```javascript
// preload.js - 桥梁
import { contextBridge, ipcRenderer } from 'electron';

// 安全地暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  getData: (args) => ipcRenderer.invoke('get-data', args),
  onUpdate: (callback) => {
    ipcRenderer.on('update', (_, data) => callback(data));
  },
});
```

::: tip 为什么需要 preload？
直接启用 `nodeIntegration` 会让渲染进程拥有 Node.js 权限，一旦页面被 XSS 攻击，攻击者就能直接执行系统命令。通过 preload 只暴露必要的 API，遵循**最小权限原则**。
:::

---

### IPC 通信示例

```javascript
// ========== 主进程 main.js ==========
import { ipcMain } from 'electron';

ipcMain.handle('get-data', async (event, args) => {
  // 处理渲染进程的请求
  const result = await db.query(args);
  return result;
});

// ========== 渲染进程 renderer.js ==========
// 通过预加载暴露的API调用
const data = await window.electronAPI.getData({ id: 1 });
```

### IPC 的核心功能模块

- 异步发送-监听模块 (send + on)：单向通知，需手动回复

```js
// 1. 异步发送-监听模块 (send + on)
function sendMessageToRenderer() {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.send('main:notification', '主进程主动发送的通知');
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  // 监听主进程主动推送的消息
  onMainNotification: (callback) => {
    ipcRenderer.on('main:notification', (event, message) => callback(message));
  },
});

ipcMain.on('notification:show', (event, message) => {
  console.log('收到通知:', message);
  // 手动回复
  event.reply('notification:reply', `主进程已收到: ${message}`);
});
```

- 请求-响应模块 (invoke + handle)：双向通信，基于 Promise，推荐使用

```js
// 2. 请求-响应模块 (invoke + handle) - 推荐使用
async function openFile() {
  try {
    const result = await window.electronAPI.openFileDialog({
      title: '选择文件',
    });
    console.log('用户选择的文件:', result);
  } catch (error) {
    console.error('打开文件失败:', error);
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  // 调用主进程的方法（返回 Promise）
  openFileDialog: (options) => ipcRenderer.invoke('dialog:openFile', options),
});

ipcMain.handle('dialog:openFile', async (event, options) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    ...options,
  });
  return result; // 自动返回给渲染进程
});
```

- 同步通信模块 (sendSync)：阻塞式，尽量避免使用

```js
// 3. 同步通信模块 (不推荐使用，仅作为示例)
// 主进程同步调用渲染进程（非常不推荐）
function syncCallRenderer() {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    // 这会阻塞主进程，极度不推荐
    const result = win.webContents.sendSync('sync:getTime', '请求数据');
    console.log('渲染进程同步返回:', result);
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  // 同步调用主进程（会阻塞渲染进程）
  getTimeSync: () => ipcRenderer.sendSync('sync:getTime'),
});

ipcMain.on('sync:getTime', (event) => {
  event.returnValue = Date.now(); // 同步返回
});
```

### IPC 通信的两种方式

```javascript
// ========== 1. 异步（推荐）==========
ipcMain.handle('async-task', async () => {
  // 返回 Promise，不阻塞渲染进程
  return await doSomething();
});

// ========== 2. 同步（谨慎使用）==========
ipcMain.on('sync-task', (event, args) => {
  event.returnValue = '同步结果'; // 会阻塞渲染进程
});
```

::: warning 同步 IPC 的使用场景
我很少用同步 IPC，因为它会阻塞渲染进程。只有在极少数必须等待结果才能继续的场景才会用，比如应用启动时读取配置文件。大多数情况都用异步 IPC + Promise。
:::

### IPC 管理的工程化方案

**方案 1：按模块拆分 IPC 处理器**

```javascript
// 目录结构
// ipc-handlers/
//   ├── device-handler.js
//   ├── file-handler.js
//   └── user-handler.js

// main.js
import './ipc-handlers/device-handler';
import './ipc-handlers/file-handler';

// device-handler.js
import { ipcMain } from 'electron';

ipcMain.handle('device:list', handleDeviceList);
ipcMain.handle('device:control', handleDeviceControl);
```

**方案 2：统一的 IPC 注册器**

```javascript
class IpcManager {
  constructor() {
    this.handlers = new Map();
  }

  register(channel, handler) {
    this.handlers.set(channel, handler);
    ipcMain.handle(channel, (_, ...args) => handler(...args));
  }

  // 开发环境下可以记录所有IPC调用日志
  logIpc() {
    for (let [channel] of this.handlers) {
      console.log(`Registered: ${channel}`);
    }
  }
}

// 使用
const ipcManager = new IpcManager();
ipcManager.register('user:login', handleLogin);
ipcManager.register('user:logout', handleLogout);
ipcManager.logIpc(); // 开发环境查看所有注册的 IPC
```

::: tip 命名规范建议
使用 `模块:动作` 的命名格式，如 `device:list`、`device:control`、`user:login`，便于管理和调试。
:::

---

### 核心安全配置

```javascript
// main.js - 安全配置模板
const win = new BrowserWindow({
  webPreferences: {
    // ❌ 永远不要设置
    nodeIntegration: false,
    enableRemoteModule: false,

    // ✅ 必须设置
    contextIsolation: true, // 隔离上下文

    // ✅ preload脚本
    preload: path.join(__dirname, 'preload.js'),

    // ✅ 其他安全选项
    sandbox: true, // 沙箱模式
    webSecurity: true, // Web安全
    allowRunningInsecureContent: false, // 禁止混合内容
  },
});

// 禁用打开devtools（生产环境）
if (app.isPackaged) {
  win.webContents.on('devtools-opened', () => {
    win.webContents.closeDevTools();
  });
}
```

#### 生产环境加固

```javascript
// 1. 启用沙箱
app.enableSandbox();

// 2. 限制协议
app.setAsDefaultProtocolClient('myapp', process.execPath, ['--']);

// 3. 安全检查中间件（CSP）
win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': ["default-src 'self'; script-src 'self';"],
    },
  });
});
```

---

### 如何优化应用启动速度

1. **延迟加载**：非首屏需要的模块延迟加载
2. **代码分割**：使用 Webpack 分割代码
3. **优化预加载脚本**：减少 preload.js 的体积
4. **优化窗口创建**：使用 `show: false` 延迟显示窗口

```javascript
const win = new BrowserWindow({
  show: false, // 先不显示，等加载完成后再显示
  webPreferences: {
    // 配置...
  },
});

// 等待加载完成后再显示，避免白屏
win.once('ready-to-show', () => {
  win.show();
});
```

### 如何实现自动更新

```javascript
import { autoUpdater } from 'electron-updater';

// 主进程
autoUpdater.setFeedURL({
  provider: 'generic',
  url: 'https://your-server.com/updates',
});

autoUpdater.on('update-available', () => {
  // 通知用户有新版本
});

autoUpdater.on('update-downloaded', () => {
  // 提示用户安装更新
  autoUpdater.quitAndInstall();
});

// 渲染进程通过 IPC 触发检查更新
ipcMain.on('check-for-updates', () => {
  autoUpdater.checkForUpdates();
});
```

::: tip 推荐使用 electron-updater
不要用已废弃的 electron-auto-updater，推荐使用 `electron-updater`，功能更强大且维护活跃。
:::

### 如何设置只开启单窗口

Electron 默认是允许多个实例的，如果你希望只允许一个实例，可以通过 `app.requestSingleInstanceLock()` 来实现。

```js
// 请求单例锁：
const gotTheLock = app.requestSingleInstanceLock();

// 如果没获取到锁就退出：
if (!gotTheLock) {
  app.quit();
}

// 第二个实例启动时的处理
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// 工作原理：
//   - 当应用启动时，通过 app.requestSingleInstanceLock() 尝试获取单例锁
//   - 如果获取失败（说明已经有实例在运行），直接调用 app.quit() 退出当前实例
//   - 如果获取成功，正常启动应用
//   - 当用户再次尝试打开应用时，会触发 second-instance 事件，此时会将焦点转移到已存在的窗口（如果最小化则恢复）
//   这是 Electron 官方推荐的单实例应用实现方式。
```

### 多窗口之间如何通信

Electron 中多窗口通信主要有以下几种方案：

#### 方案一：通过主进程转发（推荐）

这是最常用的方式，通过主进程作为中介实现窗口间通信。

```javascript
// ========== main.js 主进程 ==========
import { app, BrowserWindow, ipcMain } from 'electron';

let mainWindow = null;
let subWindow = null;

function createWindows() {
  // 创建主窗口
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // 创建子窗口
  subWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  mainWindow.loadFile('main.html');
  subWindow.loadFile('sub.html');

  // 监听主窗口的消息，转发给子窗口
  ipcMain.handle('window:send-to-sub', async (event, data) => {
    if (subWindow && !subWindow.isDestroyed()) {
      subWindow.webContents.send('from-main-window', data);
      return { success: true };
    }
    return { success: false, error: '子窗口不存在' };
  });

  // 监听子窗口的消息，转发给主窗口
  ipcMain.handle('window:send-to-main', async (event, data) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('from-sub-window', data);
      return { success: true };
    }
    return { success: false, error: '主窗口不存在' };
  });
}

// ========== preload.js ==========
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // 主窗口发送消息到子窗口
  sendToSubWindow: (data) => ipcRenderer.invoke('window:send-to-sub', data),
  // 子窗口发送消息到主窗口
  sendToMainWindow: (data) => ipcRenderer.invoke('window:send-to-main', data),
  // 监听来自其他窗口的消息
  onMessage: (callback) => {
    ipcRenderer.on('from-main-window', (_, data) => callback(data));
    ipcRenderer.on('from-sub-window', (_, data) => callback(data));
  },
});

// ========== 主窗口 renderer.js ==========
// 发送消息到子窗口
async function sendMessageToSub() {
  const result = await window.electronAPI.sendToSubWindow({
    type: 'update',
    data: { count: 42 }
  });
  console.log(result);
}

// 监听子窗口的消息
window.electronAPI.onMessage((data) => {
  console.log('收到子窗口消息:', data);
});

// ========== 子窗口 renderer.js ==========
// 监听主窗口的消息
window.electronAPI.onMessage((data) => {
  console.log('收到主窗口消息:', data);
  // 更新UI...
});

// 发送消息到主窗口
async function sendMessageToMain() {
  await window.electronAPI.sendToMainWindow({ action: 'close' });
}
```

#### 方案二：使用 BroadcastChannel API

利用现代浏览器的 BroadcastChannel API，无需经过主进程。

```javascript
// ========== 两个窗口的渲染进程都可以使用 ==========

// 发送端
const channel = new BroadcastChannel('window-communication');
channel.postMessage({
  type: 'data-sync',
  payload: { user: 'Alice', score: 100 }
});

// 接收端
const channel = new BroadcastChannel('window-communication');
channel.onmessage = (event) => {
  console.log('收到其他窗口的消息:', event.data);
};

// 清理
channel.close();
```

#### 方案三：直接引用窗口对象（谨慎使用）

在主进程中直接持有窗口引用，通过 `webContents.send` 发送消息。

```javascript
// main.js
const windows = new Map();

// 注册窗口
function registerWindow(id, win) {
  windows.set(id, win);
  win.on('closed', () => windows.delete(id));
}

// 广播消息到所有窗口
function broadcastToAll(channel, data) {
  for (const [id, win] of windows) {
    if (!win.isDestroyed()) {
      win.webContents.send(channel, data);
    }
  }
}

// 发送到特定窗口
function sendToWindow(windowId, channel, data) {
  const win = windows.get(windowId);
  if (win && !win.isDestroyed()) {
    win.webContents.send(channel, data);
  }
}

// 使用示例
ipcMain.on('broadcast', (event, data) => {
  broadcastToAll('app:update', data);
});
```

#### 方案四：使用 localStorage/sessionStorage 事件

利用同源策略下存储触发的 `storage` 事件。

```javascript
// 窗口 A - 写入数据
localStorage.setItem('shared-data', JSON.stringify({
  timestamp: Date.now(),
  message: 'Hello from Window A'
}));

// 窗口 B - 监听变化
window.addEventListener('storage', (event) => {
  if (event.key === 'shared-data') {
    const data = JSON.parse(event.newValue);
    console.log('收到其他窗口的更新:', data);
  }
});
```

::: warning Storage 事件的局限
`storage` 事件**只在同源的其他窗口触发**，当前窗口修改 storage 不会触发自己的事件。适合简单的数据同步场景。
:::

#### 方案五：使用 SharedWorker

利用 Web Worker 的共享版本进行通信。

```javascript
// shared-worker.js
const connections = [];

self.onconnect = (event) => {
  const port = event.ports[0];
  connections.push(port);

  port.onmessage = (e) => {
    // 广播给所有连接的窗口
    connections.forEach((conn) => {
      conn.postMessage(e.data);
    });
  };

  port.start();
};

// 窗口中使用
const worker = new SharedWorker('shared-worker.js');
worker.port.start();

// 发送消息
worker.port.postMessage({ type: 'sync', data: { value: 42 } });

// 接收消息
worker.port.onmessage = (event) => {
  console.log('收到消息:', event.data);
};
```

#### 方案对比

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| **主进程转发** | 可靠、可控、安全 | 需要经过主进程 | 复杂业务逻辑、需要权限控制 |
| **BroadcastChannel** | 简单直接、无需主进程 | 仅同源窗口间 | 同一应用内的简单通信 |
| **窗口引用** | 灵活、可直接操作 | 需要管理窗口生命周期 | 需要精确控制目标窗口 |
| **Storage 事件** | 实现简单、持久化 | 仅限同源、有延迟 | 简单状态同步 |
| **SharedWorker** | 支持多窗口、复杂逻辑 | 兼容性问题 | 需要共享状态的复杂场景 |

#### 实际应用场景

```javascript
// 场景1：主窗口控制设置窗口
// main.js
ipcMain.on('open-settings', () => {
  if (!settingsWindow || settingsWindow.isDestroyed()) {
    settingsWindow = new BrowserWindow({
      width: 600,
      height: 400,
      parent: mainWindow, // 设置为子窗口
    });
    settingsWindow.loadFile('settings.html');
  }
  settingsWindow.focus();
});

// 场景2：数据同步
// 当一个窗口修改数据后，通知其他窗口刷新
ipcMain.on('data:updated', (event, data) => {
  const senderWindow = BrowserWindow.fromWebContents(event.sender);

  allWindows.forEach(win => {
    // 跳过发送者
    if (win !== senderWindow && !win.isDestroyed()) {
      win.webContents.send('data:sync', data);
    }
  });
});

// 场景3：窗口生命周期联动
// 主窗口关闭时，关闭所有子窗口
mainWindow.on('closed', () => {
  childWindows.forEach(win => {
    if (!win.isDestroyed()) {
      win.close();
    }
  });
});
```

::: tip 推荐实践
1. **简单通信**：使用 BroadcastChannel
2. **业务通信**：使用主进程转发 + IPC
3. **状态同步**：使用 localStorage 事件或主进程广播
4. **避免循环通信**：设计好消息流向，防止 A→B→A 的死循环
:::

### 如何实现窗口透明背景

Electron 实现透明窗口需要同时配置 BrowserWindow 和 CSS 样式：

#### 1. BrowserWindow 配置

```javascript
const win = new BrowserWindow({
  transparent: true,  // 启用透明窗口
  frame: false,       // 无边框窗口（可选，常配合透明使用）
  backgroundColor: '#00FFFFFF',  // 完全透明的背景色（ARGB格式）
  webPreferences: {
    // ...
  }
});
```

#### 2. CSS 样式设置

```css
/* 页面根元素需要设置透明背景 */
body {
  background: transparent;
  /* 或者使用 RGBA */
  background: rgba(0, 0, 0, 0.5);
}

/* 局部透明元素 */
.transparent-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);  /* 毛玻璃效果 */
}
```

#### 3. 关键配置说明

| 配置项 | 作用 | 注意事项 |
|--------|------|----------|
| `transparent: true` | 启用窗口透明 | Windows 下不能和 `directWrite` 冲突 |
| `frame: false` | 移除窗口边框 | 自定义标题栏时常用 |
| `backgroundColor` | 设置窗口背景色 | 使用 ARGB 格式：`#AARRGGBB` |
| `vibrancy` | macOS 毛玻璃效果 | 仅 macOS 支持 |

#### 4. 平台兼容性

```javascript
const platform = process.platform;

const winConfig = {
  // 通用配置
  transparent: true,
  frame: false,
};

// macOS 特有配置
if (platform === 'darwin') {
  winConfig.vibrancy = 'under-window'; // 或 'ultra-dark', 'titlebar' 等
  winConfig.visualEffectState = 'active'; // 或 'inactive', 'follows-window'
}

// Windows 注意事项
if (platform === 'win32') {
  // Windows 10 1809+ 才支持透明窗口
  // 需要检查系统版本
}

const win = new BrowserWindow(winConfig);
```

#### 5. 实际应用示例（毛玻璃效果）

```javascript
// main.js
const { BrowserWindow } = require('electron');

function createTransparentWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    transparent: true,
    frame: false,
    backgroundColor: '#00000000',  // 完全透明
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile('index.html');
  return win;
}
```

```html
<!-- index.html -->
<style>
  * {
    margin: 0;
    padding: 0;
  }

  body {
    background: transparent;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 20px;
    margin: 20px;
    color: white;
  }
</style>

<div class="glass-card">
  <h1>透明窗口示例</h1>
  <p>这是一个毛玻璃效果的卡片</p>
</div>
```

::: tip 透明窗口的最佳实践
1. **性能考虑**：透明窗口会消耗更多 GPU 资源，避免过度使用
2. **可拖动区域**：无边框窗口需要 `-webkit-app-region: drag` 实现拖动
3. **阴影效果**：使用 `win.setHasShadow(true)` 添加窗口阴影
4. **点击穿透**：设置 `win.setIgnoreMouseEvents(true)` 实现鼠标穿透
:::

#### 6. 可拖动区域实现

```css
/* 标题栏区域可拖动 */
.title-bar {
  -webkit-app-region: drag;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
}

/* 按钮区域不可拖动 */
button {
  -webkit-app-region: no-drag;
}
```

::: warning 平台限制
- **Windows**：透明窗口在某些 Windows 版本上可能显示异常，需要做好降级处理
- **Linux**：部分桌面环境不支持透明窗口
- **macOS**：效果最好，支持 `vibrancy` 系统原生毛玻璃效果
:::

### 发生内存泄漏如何排查

:::right
内存泄漏是指程序中已动态分配的堆内存由于某种原因未释放或无法释放，导致系统内存的浪费，进而影响程序运行速度甚至导致系统崩溃
:::

Electron 应用的内存泄漏排查需要结合 Chromium DevTools 和 Node.js 调试工具。

#### 一、内存泄漏的常见原因

| 类型 | 场景 | 示例 |
|------|------|------|
| **事件监听未移除** | DOM 事件、IPC 监听器 | `window.addEventListener` 未 `removeEventListener` |
| **定时器未清理** | setInterval、setTimeout | 组件销毁后定时器仍在运行 |
| **闭包引用** | 函数内部引用外部变量 | 闭包持有大型对象或 DOM 节点 |
| **全局变量** | 挂载到 window/global | 意外创建全局变量导致无法回收 |
| **IPC 通道泄漏** | ipcMain/ipcRenderer 监听器 | 重复注册监听器导致内存累积 |
| **缓存未清理** | Map、Set 缓存 | 缓存无限增长无清理机制 |

#### 二、排查工具和方法

##### 1. 使用 Chrome DevTools 内存分析

```javascript
// main.js - 启动时打开 DevTools
const win = new BrowserWindow({
  webPreferences: {
    devTools: true, // 确保开启
  },
});

// 开发环境自动打开 DevTools
if (!app.isPackaged) {
  win.webContents.openDevTools();
  // 跳转到 Memory 面板
  win.webContents.executeJavaScript('DevToolsAPI.showPanel("memory")');
}
```

**内存快照对比法：**

```
操作步骤：
1. 打开 DevTools → Memory 面板
2. 点击 "Take snapshot" 拍摄初始快照
3. 执行可能泄漏的操作（如打开/关闭窗口多次）
4. 再次点击 "Take snapshot" 拍摄对比快照
5. 选择第二个快照，切换到 "Comparison" 视图
6. 查看对象数量增长的部分
```

**堆内存时间线法：**

```
操作步骤：
1. 打开 DevTools → Memory 面板
2. 在左侧选择模式：
   - ○ Allocation sampling（分配采样）- 性能开销小，推荐
   - ○ Allocation instrumentation on timeline（时间线插桩）- 详细但影响性能
3. 点击 "Start" 开始记录
4. 执行测试操作
5. 点击 "Stop" 停止记录
6. 查看内存分配的函数调用栈

Memory 面板的三种模式：
┌─────────────────────────────────────────────┐
│ ◉ Heap snapshot                    [📷 Take snapshot] │
��� ○ Allocation sampling               [▶ Start] │
│ ○ Allocation instrumentation on timeline [▶ Start] │
└─────────────────────────────────────────────┘
```

##### 2. 使用 Chrome 的 memory-leak-detector

```javascript
// main.js
const { app, BrowserWindow } = require('electron');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow();

  // 定期检查内存使用情况
  setInterval(() => {
    const metrics = app.getAppMetrics();
    console.log('内存使用情况:', metrics);

    // 检测主进程内存
    const memUsage = process.memoryUsage();
    console.log('主进程内存:', {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
    });
  }, 30000);
});
```

##### 3. 使用 leaky-node 检测 Node.js 内存泄漏

```bash
# 安装 leaky-node
npm install -g leaky-node

# 运行应用并检测
leaky-node electron .
```

#### 三、常见内存泄漏场景及修复

##### 场景1：事件监听器未移除

```javascript
// ❌ 错误：组件销毁后监听器仍存在
class MyComponent {
  constructor() {
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  handleResize() {
    // 处理窗口大小变化
  }
}

// ✅ 正确：销毁时移除监听器
class MyComponent {
  constructor() {
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);
  }
}

// 使用
const component = new MyComponent();
// 组件销毁时
component.destroy();
```

##### 场景2：IPC 监听器泄漏

```javascript
// ❌ 错误：每次注册都添加新的监听器
function setupIpc() {
  ipcRenderer.on('update-data', (event, data) => {
    updateUI(data);
  });
}
// 每次调用 setupIpc() 都会新增一个监听器

// ✅ 正确：先移除再添加，或使用 once
function setupIpc() {
  // 方式1：先移除
  ipcRenderer.removeListener('update-data', handleUpdate);
  ipcRenderer.on('update-data', handleUpdate);

  // 方式2：使用 once（一次性监听器）
  ipcRenderer.once('update-data', (event, data) => {
    updateUI(data);
  });
}

// ✅ 更好的方式：在 preload 中统一管理
// preload.js
contextBridge.exposeInMainWorld('electronAPI', {
  onUpdateData: (callback) => {
    // 返回取消监听的函数
    const listener = (_, data) => callback(data);
    ipcRenderer.on('update-data', listener);
    return () => ipcRenderer.removeListener('update-data', listener);
  },
});

// renderer.js
const unsubscribe = window.electronAPI.onUpdateData((data) => {
  updateUI(data);
});

// 组件销毁时
unsubscribe();
```

##### 场景3：定时器未清理

```javascript
// ❌ 错误：组件销毁后定时器仍在运行
class DataPoller {
  constructor() {
    this.startPolling();
  }

  startPolling() {
    setInterval(() => {
      this.fetchData();
    }, 5000);
  }

  fetchData() {
    // 获取数据...
  }
}

// ✅ 正确：清理定时器
class DataPoller {
  constructor() {
    this.timers = [];
    this.startPolling();
  }

  startPolling() {
    const timerId = setInterval(() => {
      this.fetchData();
    }, 5000);
    this.timers.push(timerId);
  }

  destroy() {
    this.timers.forEach(clearInterval);
    this.timers = [];
  }
}

// 使用
const poller = new DataPoller();
// 销毁时
poller.destroy();
```

##### 场景4：闭包持有大对象

```javascript
// ❌ 错误：闭包持有大型数据
function createHandler(largeData) {
  return function() {
    // 即使 largeData 只用一次，也会一直被持有
    console.log(largeData.id);
  };
}

// ✅ 正确：只保留需要的数据
function createHandler(largeData) {
  const id = largeData.id; // 只提取需要的字段
  return function() {
    console.log(id);
  };
}

// ✅ 或者使用 WeakMap
const handlers = new WeakMap();

function attachHandler(element, largeData) {
  const handler = () => console.log(largeData.id);
  element.addEventListener('click', handler);
  handlers.set(element, { handler, largeData });
}

function detachHandler(element) {
  const data = handlers.get(element);
  if (data) {
    element.removeEventListener('click', data.handler);
    handlers.delete(element);
  }
}
```

##### 场景5：BrowserWindow 未销毁

```javascript
// ❌ 错误：只隐藏窗口，未销毁
function openWindow() {
  const win = new BrowserWindow({ width: 800, height: 600 });
  win.on('close', () => {
    // 只隐藏，未销毁
    win.hide();
  });
}

// ✅ 正确：彻底销毁窗口
function openWindow() {
  const win = new BrowserWindow({ width: 800, height: 600 });

  // 清理资源
  win.on('closed', () => {
    // closed 事件触发时，窗口已被销毁
    console.log('窗口已销毁');
  });

  return win;
}

// 主动销毁
function closeWindow(win) {
  if (win && !win.isDestroyed()) {
    // 先关闭窗口
    win.close();
    // 如果还未销毁，强制销毁
    if (!win.isDestroyed()) {
      win.destroy();
    }
  }
}
```

#### 四、内存泄漏排查实战案例

**案例：检测窗口关闭后的内存泄漏**

```javascript
// main.js
const windows = new Set();

function createTestWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  windows.add(win);

  win.loadFile('test.html');

  // 监听窗口关闭
  win.on('closed', () => {
    windows.delete(win);
    console.log(`窗口已关闭，当前窗口数: ${windows.size}`);
  });

  return win;
}

// 测试脚本：创建并销毁窗口 100 次
async function testMemoryLeak() {
  for (let i = 0; i < 100; i++) {
    const win = createTestWindow();
    await new Promise(resolve => setTimeout(resolve, 100));
    win.close();
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // 检查内存使用
  console.log('测试完成，请检查内存是否增长');
}

// IPC 暴露测试接口
ipcMain.handle('test:memory-leak', testMemoryLeak);
```

```javascript
// renderer.js - DevTools Console 中执行
// 使用 Performance API 检测内存使用

// 记录初始内存
const initialMemory = performance.memory?.usedJSHeapSize;

// 执行操作
await window.electronAPI.testMemoryLeak();

// 检查最终内存
setTimeout(() => {
  const finalMemory = performance.memory?.usedJSHeapSize;
  const diff = finalMemory - initialMemory;
  console.log(`内存增长: ${Math.round(diff / 1024 / 1024)}MB`);
}, 5000);
```

#### 五、预防内存泄漏的最佳实践

```javascript
// 1. 使用 WeakMap/WeakSet 存储对象引用
const cache = new WeakMap(); // 对象被回收时自动移除

// 2. 统一的生命周期管理
class ResourceManager {
  constructor() {
    this.resources = [];
  }

  register(cleanupFn) {
    this.resources.push(cleanupFn);
  }

  cleanup() {
    this.resources.forEach(fn => fn());
    this.resources = [];
  }
}

// 使用
const manager = new ResourceManager();

manager.register(() => {
  window.removeEventListener('resize', handleResize);
});

manager.register(() => {
  clearInterval(timerId);
});

// 统一清理
manager.cleanup();

// 3. 使用 AbortController 管理事件监听
const controller = new AbortController();

fetch('/api/data', { signal: controller.signal });

element.addEventListener('click', handler, {
  signal: controller.signal,
});

// 统一取消
controller.abort();

// 4. 定期内存检查（开发环境）
if (process.env.NODE_ENV === 'development') {
  setInterval(() => {
    const usage = process.memoryUsage();
    const heapUsedMB = usage.heapUsed / 1024 / 1024;

    if (heapUsedMB > 500) {
      console.warn(`⚠️ 内存使用过高: ${heapUsedMB.toFixed(2)}MB`);
    }
  }, 60000);
}
```

#### 六、Electron 特定的内存优化

```javascript
// 1. 启用 V8 垃圾回收优化
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096');

// 2. 限制渲染进程内存
const win = new BrowserWindow({
  webPreferences: {
    // 启用 JavaScript 的内存限制
    enableRemoteModule: false,
    nodeIntegration: false,
  },
});

// 3. 定期清理缓存
function clearCache() {
  const defaultSession = session.defaultSession;
  defaultSession.clearCache();
  defaultSession.clearStorageData({
    storages: ['appcache', 'cookies', 'filesystem', 'indexdb', 'localstorage', 'shadercache', 'websql', 'serviceworkers', 'cachestorage'],
  });
}

// 应用空闲时清理
setInterval(clearCache, 30 * 60 * 1000); // 每30分钟

// 4. 监控渲染进程崩溃
app.on('render-process-gone', (event, webContents, details) => {
  console.log('渲染进程崩溃:', details);
  // 记录日志并重启
});
```

::: tip 内存泄漏排查流程
1. **发现问题**：通过任务管理器/活动监控观察内存持续增长
2. **定位泄漏**：使用 DevTools 内存快照对比
3. **分析原因**：查看对象引用链，找到未释放的引用
4. **修复验证**：修复后重复测试，确认内存不再增长
5. **回归测试**：添加自动化测试防止再次发生
:::