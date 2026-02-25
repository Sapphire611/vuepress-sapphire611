---
title: Electron 面试题目整理
date: 2026-02-25
categories:
  - Frontend
tags:
  - electron
  - interview
sidebar: auto
publish: true
---

## 🎯 Electron 面试题目整理

:::right
Electron 是基于 Chromium 和 Node.js 的跨平台桌面应用开发框架，适合快速构建桌面应用
:::

---

## 一、基础架构（必问）

### Q1：请简述 Electron 的主进程和渲染进程的区别，以及它们之间如何通信？

#### 主进程 vs 渲染进程对比

| 维度 | 主进程 (Main Process) | 渲染进程 (Renderer Process) |
|-----|----------------------|----------------------------|
| 数量 | 整个应用只有一个 | 每个窗口一个，可以有多个 |
| 职责 | 应用生命周期管理、菜单、IPC、系统交互 | 页面UI渲染、业务逻辑 |
| 权限 | 完整 Node.js 权限 | 默认无 Node.js 权限（安全考虑） |
| 入口 | package.json 的 main 字段指定 | 每个窗口加载的 HTML 文件 |

#### IPC 通信示例

```javascript
// ========== 主进程 main.js ==========
import { ipcMain } from 'electron'

ipcMain.handle('get-data', async (event, args) => {
  // 处理渲染进程的请求
  const result = await db.query(args)
  return result
})

// ========== 渲染进程 renderer.js ==========
// 通过预加载暴露的API调用
const data = await window.electronAPI.getData({ id: 1 })
```

#### Preload 脚本的作用

```javascript
// preload.js - 桥梁
import { contextBridge, ipcRenderer } from 'electron'

// 安全地暴露API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  getData: (args) => ipcRenderer.invoke('get-data', args),
  onUpdate: (callback) => {
    ipcRenderer.on('update', (_, data) => callback(data))
  }
})
```

::: tip 为什么需要 preload？
直接启用 `nodeIntegration` 会让渲染进程拥有 Node.js 权限，一旦页面被 XSS 攻击，攻击者就能直接执行系统命令。通过 preload 只暴露必要的 API，遵循**最小权限原则**。
:::

#### 追问：为什么 Electron 要设计成多进程架构？

1. **安全性**：渲染进程无法直接访问 Node.js，降低 XSS 攻击风险
2. **稳定性**：一个渲染进程崩溃不会影响其他窗口
3. **性能**：利用多核 CPU，提升应用整体性能

---

## 二、IPC 通信管理与工程化

### Q2：你在项目中是如何处理 IPC 通信的？大规模应用时如何管理越来越多的 IPC 事件？

#### IPC 通信的两种方式

```javascript
// ========== 1. 异步（推荐）==========
ipcMain.handle('async-task', async () => {
  // 返回 Promise，不阻塞渲染进程
  return await doSomething()
})

// ========== 2. 同步（谨慎使用）==========
ipcMain.on('sync-task', (event, args) => {
  event.returnValue = '同步结果' // 会阻塞渲染进程
})
```

::: warning 同步 IPC 的使用场景
我很少用同步 IPC，因为它会阻塞渲染进程。只有在极少数必须等待结果才能继续的场景才会用，比如应用启动时读取配置文件。大多数情况都用异步 IPC + Promise。
:::

#### 大规模 IPC 管理的工程化方案

**方案 1：按模块拆分 IPC 处理器**

```javascript
// 目录结构
// ipc-handlers/
//   ├── device-handler.js
//   ├── file-handler.js
//   └── user-handler.js

// main.js
import './ipc-handlers/device-handler'
import './ipc-handlers/file-handler'

// device-handler.js
import { ipcMain } from 'electron'

ipcMain.handle('device:list', handleDeviceList)
ipcMain.handle('device:control', handleDeviceControl)
```

**方案 2：统一的 IPC 注册器**

```javascript
class IpcManager {
  constructor() {
    this.handlers = new Map()
  }

  register(channel, handler) {
    this.handlers.set(channel, handler)
    ipcMain.handle(channel, (_, ...args) => handler(...args))
  }

  // 开发环境下可以记录所有IPC调用日志
  logIpc() {
    for (let [channel] of this.handlers) {
      console.log(`Registered: ${channel}`)
    }
  }
}

// 使用
const ipcManager = new IpcManager()
ipcManager.register('user:login', handleLogin)
ipcManager.register('user:logout', handleLogout)
ipcManager.logIpc() // 开发环境查看所有注册的 IPC
```

::: tip 命名规范建议
使用 `模块:动作` 的命名格式，如 `device:list`、`device:control`、`user:login`，便于管理和调试。
:::

---

## 三、安全与防护（军工必问）

### Q3：军工项目对安全性要求极高。请谈谈 Electron 应用常见的安全风险，以及你是如何防范的？

#### 核心安全配置（必须设置）

```javascript
// main.js - 安全配置模板
const win = new BrowserWindow({
  webPreferences: {
    // ❌ 永远不要设置
    nodeIntegration: false,
    enableRemoteModule: false,

    // ✅ 必须设置
    contextIsolation: true,  // 隔离上下文

    // ✅ preload脚本
    preload: path.join(__dirname, 'preload.js'),

    // ✅ 其他安全选项
    sandbox: true, // 沙箱模式
    webSecurity: true, // Web安全
    allowRunningInsecureContent: false // 禁止混合内容
  }
})

// 禁用打开devtools（生产环境）
if (app.isPackaged) {
  win.webContents.on('devtools-opened', () => {
    win.webContents.closeDevTools()
  })
}
```

#### XSS 如何演变成 RCE（高危场景）

```javascript
// ❌ 危险！千万不要这样写
// preload.js - 错误示范
contextBridge.exposeInMainWorld('dangerousAPI', {
  execCommand: (cmd) => require('child_process').execSync(cmd)
})

// 如果渲染进程被XSS攻击，攻击者可以：
window.dangerousAPI.execCommand('rm -rf /') // 灾难！
```

#### 防范措施清单

| 风险点 | 防范措施 |
|-------|---------|
| XSS → RCE | 启用 contextIsolation，只暴露安全 API |
| 任意文件访问 | 所有文件操作放在主进程，校验路径 |
| 协议劫持 | 使用 shell.openExternal 时限制协议（只允许 http/https） |
| 渲染进程权限过大 | 设置 sandbox: true |
| 第三方依赖漏洞 | 定期 npm audit，及时更新 |

#### 文件上传安全处理

```javascript
// 安全的文件处理示例
ipcMain.handle('save-file', async (event, { filename, content }) => {
  // 1. 校验路径防止目录遍历攻击
  const safePath = path.join(app.getPath('userData'), path.basename(filename))

  // 2. 文件类型白名单
  const allowedExt = ['.txt', '.json', '.log']
  if (!allowedExt.includes(path.extname(filename))) {
    throw new Error('文件类型不允许')
  }

  // 3. 写入文件
  await fs.writeFile(safePath, content)

  // 4. 记录审计日志
  auditLog('file-saved', { filename: safePath })
})
```

#### 生产环境加固

```javascript
// 1. 启用沙箱
app.enableSandbox()

// 2. 限制协议
app.setAsDefaultProtocolClient('myapp', process.execPath, ['--'])

// 3. 安全检查中间件（CSP）
win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': [
        "default-src 'self'; script-src 'self';"
      ]
    }
  })
})
```

---

## 四、面试关键词总结

| 问题 | 必须提到的关键词 |
|-----|----------------|
| Q1：主进程 vs 渲染进程 | contextIsolation, preload, 最小权限原则, 多进程架构优势 |
| Q2：IPC 通信管理 | IPC 工程化, 异步优先, 模块化, 命名规范 |
| Q3：安全防护 | nodeIntegration: false, XSS → RCE, 路径校验, 白名单, sandbox |

---

## 五、补充：常见面试问题

### Q4：Electron 和 NW.js（原 node-webkit）有什么区别？

| 对比项 | Electron | NW.js |
|-------|----------|-------|
| 架构 | 多进程（主进程 + 渲染进程分离） | 混合架构（Node 和浏览器混合） |
| 入口 | JavaScript | HTML 或 JavaScript |
| 构建工具 | electron-builder | nw-builder |
| 社区活跃度 | 更活跃（VS Code 使用） | 相对较低 |

### Q5：如何优化 Electron 应用启动速度？

1. **延迟加载**：非首屏需要的模块延迟加载
2. **代码分割**：使用 Webpack 分割代码
3. **优化预加载脚本**：减少 preload.js 的体积
4. **使用 V8 缓存**：生成 `.blob` 文件加速启动
5. **优化窗口创建**：使用 `show: false` 延迟显示窗口

```javascript
const win = new BrowserWindow({
  show: false, // 先不显示，等加载完成后再显示
  webPreferences: {
    // 配置...
  }
})

// 等待加载完成后再显示，避免白屏
win.once('ready-to-show', () => {
  win.show()
})
```

### Q6：Electron 如何实现自动更新？

```javascript
import { autoUpdater } from 'electron-updater'

// 主进程
autoUpdater.setFeedURL({
  provider: 'generic',
  url: 'https://your-server.com/updates'
})

autoUpdater.on('update-available', () => {
  // 通知用户有新版本
})

autoUpdater.on('update-downloaded', () => {
  // 提示用户安装更新
  autoUpdater.quitAndInstall()
})

// 渲染进程通过 IPC 触发检查更新
ipcMain.on('check-for-updates', () => {
  autoUpdater.checkForUpdates()
})
```

::: tip 推荐使用 electron-updater
不要用已废弃的 electron-auto-updater，推荐使用 `electron-updater`，功能更强大且维护活跃。
:::
