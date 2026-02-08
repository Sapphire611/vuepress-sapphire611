---
title: HuaJun Interview Notes
sidebar: auto
date: 2026-2-9
categories:
  - Frontend
tags:
  - interview
publish: true
---

# 上海华君智能科技有限公司

## 一、工作经历介绍

我的第一段经历是在 **[公司A]**，负责 **智能会议室解决方案** 的全栈开发。这是一个典型的设备接入与实时管控项目。通过 **MQTT/WebSocket** 协议与会议室中的各种硬件（如灯光、投影、门禁）进行通信，实现了设备状态的实时监控与集中操控。

随后，在 **[公司B]** 的 **OTA（汽车远程升级）平台** 项目中，我的工作重心从设备管控转向了海量数据处理与高可靠交互。我负责使用 **Vue 3 + TypeScript + Vite** 重构并维护升级包管理模块的核心流程，包括升级包的上传、差分、校验、任务下发与进度跟踪。

最近一段经历是在 **[公司C]**，我参与开发了一个基于 **Electron** 的 **PCB电路板故障检测** 的桌面端应用。这让我接触到了工业级视觉检测场景。我负责缺陷复判工作台的前端开发，需要将 AI 算法筛选出的海量疑似缺陷图片（通常一个批次上万张）进行高效、清晰的展示，并提供给质检员便捷的交互操作（如放大、旋转、标注、分类）。

## 二、大量数据页面的前端界面设计

### 后端优化
- 分页 + 筛选 + 排序 + 增加数据库索引

### 前端优化
- 接口防抖 (`debounce`)
- 对复杂状态进行缓存 (`computed`)
- 异步组件 + 组件懒加载：
  ```javascript
  import { defineAsyncComponent } from 'vue'
  const AsyncComp = defineAsyncComponent(() => import('./components/MyComponent.vue'))
  ```
- 虚拟列表（管理已渲染的 DOM 元素）
- `<Teleport>`
- 依赖按需导入（Tree-Shaking）

### Vite 生产构建优化
```javascript
// vite.config.js - 生产配置
export default defineConfig({
  build: {
    minify: 'terser', // 代码压缩
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console
        drop_debugger: true
      }
    },
    reportCompressedSize: true, // 显示压缩后大小
    chunkSizeWarningLimit: 1000 // chunk 大小警告阈值 (KB)
  }
})
```

## 三、Composition API VS Options API

1. 允许通过 **逻辑功能组织代码**（解决 Options API 中 `data`、`method`、`watch` 等分离的痛点）  
2. 逻辑复用，可以封装成 Hook 像导入函数一样使用（Options API 使用 Mixins）  
3. 和 TypeScript 支持好，Composition API 基于普通的变量和函数，可以直接配合 TypeScript 可以获得更好的类型提示。

## 四、Vue 3 中实时数据连接的设计与实现

- **WebSocket**：适合双向、高频、低延迟的交互场景，如设备实时控制、多端状态同步。  
- **SSE**：适合服务器向客户端单向推送的场景，如告警通知、数据日志流，实现更简单，自带断线重连。  
- 全局单例模式，用状态管理库（如 Pinia）来集中管理连接和数据：

```vue
<script setup>
import { useRealtimeStore } from '@/stores/realtime'

const realtimeStore = useRealtimeStore()
// 在应用启动时连接
onMounted(() => {
  realtimeStore.connect('wss://iot-platform.example.com/ws')
})
</script>
```

```vue
<!-- DeviceMonitor.vue -->
<script setup>
import { useRealtimeStore } from '@/stores/realtime'
import { computed } from 'vue'

const props = defineProps<{ deviceId: string }>()
const realtimeStore = useRealtimeStore()

// 通过计算属性获取特定设备数据，自动响应更新
const currentDeviceData = computed(() => {
  return realtimeStore.deviceData.get(props.deviceId)
})

// 发送控制指令
const handleControl = () => {
  realtimeStore.sendCommand({
    deviceId: props.deviceId,
    command: 'reboot'
  })
}
</script>
```

## 五、前端测试策略设计

### 三层测试策略

#### 1. 单元测试（Unit Testing）
- **测试目标**：纯函数、工具函数、业务逻辑钩子
- **技术选型**：Vitest + @vue/test-utils
- **优势**：速度快，反馈及时，确保最小代码单元行为正确

```javascript
// 测试一个数据转换函数
import { parseSensorData } from '@/utils/sensorParser'

describe('parseSensorData', () => {
  it('应正确解析温度传感器数据', () => {
    const raw = { deviceId: 'temp-01', value: 25.3, unit: 'C' }
    const result = parseSensorData(raw)
    expect(result.displayValue).toBe('25.3°C')
    expect(result.isWarning).toBe(false)
  })
})
```

#### 2. 组件测试（Component Testing）
- **测试目标**：Vue组件的渲染、交互和状态
- **适用场景**：
  - UI组件：按钮、输入框、模态框等基础组件
  - 业务组件：设备卡片、实时数据图表、报警列表
  - 异步逻辑：API调用或WebSocket数据更新响应
- **关键技术**：Vitest + @vue/test-utils + Mock外部依赖

```javascript
import { mount } from '@vue/test-utils'
import DeviceCard from '@/components/DeviceCard.vue'
import { useDeviceStore } from '@/stores/device'

// 模拟Pinia Store
vi.mock('@/stores/device')

describe('DeviceCard.vue', () => {
  it('点击控制按钮应调用Store的对应方法', async () => {
    const mockControl = vi.fn()
    useDeviceStore.mockReturnValue({ sendControlCommand: mockControl })
    
    const wrapper = mount(DeviceCard, {
      props: { device: { id: '1', name: 'Test Device', status: 'online' } }
    })
    
    await wrapper.find('.control-btn').trigger('click')
    expect(mockControl).toHaveBeenCalledWith('1', 'toggle')
  })
})
```

#### 3. 端到端测试（E2E Testing）
- **测试目标**：完整的用户流程和业务场景
- **适用场景**：
  - 关键业务流程：登录 → 设备选择 → 数据查看 → 控制指令
  - 跨页面跳转和复杂交互
  - 与WebSocket实时数据、地图集成等功能
- **技术选型**：Cypress 或 Playwright
- **特点**：编写成本高但信心度最高，用于核心业务流程验证

## 六、困难的问题及解决方法

> 生产环境下 Mongodb数据库写入了但读取不到

- 查询了数据库的部署架构和应用的连接配置。发现问题核心在于：我们的MongoDB部署了主从复制集（一主二从），但应用的读写配置是分离的——写入操作指向主库（Primary），而读操作默认指向了从库（Secondary）。由于网络传输和副本应用需要时间，主从之间存在复制延迟。在写入后的极短时间内查询从库，数据尚未同步过去，导致“读不到”。

- 我采用了 writeConcern 策略来确保写操作的一致性级别。我修改了写入数据时的代码，在关键的创建、状态更新操作中，设置了 { w: “majority” }。这意味着写入操作必须等待数据被复制到“大多数”（超过一半）的节点（包括主库和至少一个从库）并确认后，才向客户端返回成功。