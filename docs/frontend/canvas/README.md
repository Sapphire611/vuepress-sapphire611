---
title: Canvas 入门
date: 2026-02-25
categories:
  - Frontend
tags:
  - canvas
  - interview
sidebar: auto
publish: true
---

## 🎯 Canvas 入门（面试必备）

:::right
Canvas 是 HTML5 提供的通过 JavaScript 绘制 2D 图形的元素，是前端可视化技术的基础
:::

---

## 一、Canvas 核心概念速览

| 概念        | 说明                              | 常用方法                              |
| ----------- | --------------------------------- | ------------------------------------- |
| Canvas 元素 | HTML 绘图容器，提供像素级绘图能力 | `getContext('2d')`                    |
| Context     | 绘图上下文，包含所有绘图 API      | `ctx`                                 |
| Path        | 路径，由多个点组成的线条          | `beginPath()`, `moveTo()`, `lineTo()` |
| State       | 状态，包括颜色、线宽等            | `save()`, `restore()`                 |

---

## 二、基础问题 1：绘制矩形和圆形

> **题目**：请用 Canvas 在页面上画一个红色的矩形和蓝色的圆形。

```vue
<template>
  <canvas ref="myCanvas" width="400" height="300"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const myCanvas = ref(null);

onMounted(() => {
  // 1. 获取Canvas元素和绘图上下文
  const canvas = myCanvas.value;
  const ctx = canvas.getContext('2d');

  // 2. 画红色矩形
  ctx.fillStyle = 'red'; // 设置填充颜色
  ctx.fillRect(50, 50, 150, 100); // (x, y, width, height)

  // 3. 画蓝色圆形
  ctx.fillStyle = 'blue'; // 改为蓝色
  ctx.beginPath(); // 开始新路径
  ctx.arc(300, 150, 50, 0, 2 * Math.PI); // (x, y, 半径, 起始角度, 结束角度)
  ctx.fill(); // 填充圆形
});
</script>
```

::: tip 核心 API

- `getContext('2d')`：获取 2D 绘图上下文
- `fillStyle`：设置填充颜色
- `fillRect(x, y, w, h)`：填充矩形
- `arc(x, y, r, start, end)`：绘制圆形路径
  :::

---

## 三、基础问题 2：绘制线条

> **题目**：请用 Canvas 画一条从左上角到右下角的红色虚线。

```vue
<template>
  <canvas ref="myCanvas" width="400" height="300"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const myCanvas = ref(null);

onMounted(() => {
  const canvas = myCanvas.value;
  const ctx = canvas.getContext('2d');

  // 设置线条样式
  ctx.strokeStyle = 'red'; // 线条颜色
  ctx.lineWidth = 3; // 线条粗细
  ctx.setLineDash([5, 10]); // 虚线样式：[实线长度, 间隔长度]

  // 开始绘制路径
  ctx.beginPath();
  ctx.moveTo(0, 0); // 起点 (x, y)
  ctx.lineTo(400, 300); // 终点 (x, y)
  ctx.stroke(); // 画线
});
</script>
```

::: tip 关键点

- `strokeStyle`：线条颜色
- `lineWidth`：线条粗细
- `setLineDash([实线, 间隔])`：设置虚线
- `moveTo()`：移动画笔到起点
- `lineTo()`：画线到终点
- `stroke()`：描边（画线）
  :::

---

## 四、基础问题 3：绘制文字

> **题目**：请用 Canvas 在画布中央显示文字"军工装备"，字体 20px，红色。

```vue
<template>
  <canvas ref="myCanvas" width="400" height="300"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const myCanvas = ref(null);

onMounted(() => {
  const canvas = myCanvas.value;
  const ctx = canvas.getContext('2d');

  // 设置文字样式
  ctx.font = '20px Arial'; // 字体大小和字体
  ctx.fillStyle = 'red'; // 文字颜色
  ctx.textAlign = 'center'; // 水平居中
  ctx.textBaseline = 'middle'; // 垂直居中

  // 在画布中央绘制文字
  ctx.fillText('军工装备', canvas.width / 2, canvas.height / 2);
});
</script>
```

::: tip 关键点

- `font`：设置字体
- `textAlign`：水平对齐（left/center/right）
- `textBaseline`：垂直对齐（top/middle/bottom）
- `fillText(文字, x, y)`：绘制文字
  :::

---

## 五、基础问题 4：清除画布

> **题目**：如何在 Canvas 上清除整个画布？

```javascript
// 方法1：clearRect（推荐）
ctx.clearRect(0, 0, canvas.width, canvas.height);

// 方法2：重置Canvas宽高（会清空所有内容）
canvas.width = canvas.width;

// 方法3：绘制白色矩形覆盖
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

::: tip 常用场景
在动画每帧开始前清除上一帧的内容，使用 `requestAnimationFrame` 实现动画效果。
:::

---

## 六、基础问题 5：状态保存与恢复

> **题目**：为什么要用 `ctx.save()` 和 `ctx.restore()`？

```javascript
// ❌ 不保存状态的问题
ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 100, 100);

// 后面想画蓝色，但忘记改颜色了
ctx.fillRect(120, 10, 100, 100); // 还是红色！

// ✅ 正确做法：保存和恢复
ctx.save(); // 保存当前状态（默认黑色）
ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 100, 100);
ctx.restore(); // 恢复之前的状态（黑色）

ctx.fillRect(120, 10, 100, 100); // 现在是黑色了
```

::: tip 核心作用
避免样式污染，每个图形独立设置样式。`save()` 和 `restore()` 成对出现，类似栈的操作。
:::

---

## 七、基础问题 6：点击事件检测

> **题目**：如何在 Canvas 上判断用户点击了哪个图形？

```vue
<template>
  <canvas ref="myCanvas" @click="handleClick" width="400" height="300"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const myCanvas = ref(null);

// 定义两个图形的位置
const rect = { x: 50, y: 50, width: 100, height: 100 };
const circle = { x: 250, y: 150, radius: 50 };

function draw() {
  const ctx = myCanvas.value.getContext('2d');

  // 画矩形
  ctx.fillStyle = 'red';
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

  // 画圆形
  ctx.fillStyle = 'blue';
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  ctx.fill();
}

function handleClick(event) {
  const canvas = myCanvas.value;
  const rect = canvas.getBoundingClientRect(); // 获取一个元素在网页上的位置和大小

  //   {
  //   x: 30,      // 元素左侧距离浏览器左边框的距离
  //   y: 50,      // 元素顶部距离浏览器上边框的距离
  //   width: 400, // 元素的宽度
  //   height: 300, // 元素的高度
  //   top: 50,    // 同 y
  //   left: 30,   // 同 x
  //   right: 430, // 元素右侧距离浏览器左边框的距离 (left + width)
  //   bottom: 350 // 元素底部距离浏览器上边框的距离 (top + height)
  // }

  // 计算鼠标在Canvas上的坐标
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // 判断是否点击到矩形
  if (mouseX >= 50 && mouseX <= 150 && mouseY >= 50 && mouseY <= 150) {
    alert('点击了红色矩形！');
    return;
  }

  // 判断是否点击到圆形（计算距离）
  const dx = mouseX - 250;
  const dy = mouseY - 150;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance <= 50) {
    alert('点击了蓝色圆形！');
    return;
  }

  alert('点击了空白区域');
}

onMounted(() => {
  draw();
});
</script>
```

::: tip 关键点

- **矩形检测**：判断坐标是否在范围内
- **圆形检测**：计算鼠标到圆心的距离，是否小于半径
- **坐标转换**：`event.clientX - canvas.getBoundingClientRect().left`
  :::

---

## 八、知识点总结

这 6 个问题覆盖了 Canvas 80% 的基础知识：

| 问题         | 核心知识点                                     |
| ------------ | ---------------------------------------------- |
| 画矩形和圆形 | `fillRect`, `arc`, `fillStyle`                 |
| 画线         | `strokeStyle`, `lineWidth`, `moveTo`, `lineTo` |
| 画文字       | `font`, `fillText`, `textAlign`                |
| 清除画布     | `clearRect`                                    |
| 状态保存     | `save`, `restore`                              |
| 点击事件     | 坐标计算 + 几何判断                            |

---

## 九、面试常见问题

### Q1：Canvas 和 SVG 有什么区别？

| 对比项   | Canvas                     | SVG                               |
| -------- | -------------------------- | --------------------------------- |
| 绘图方式 | 基于像素（光栅）           | 基于矢量（XML）                   |
| 事件处理 | 无法直接绑定事件到图形     | 每个图形都是 DOM 元素，可绑定事件 |
| 性能     | 适合大量图形（如粒子系统） | 适合少量复杂图形                  |
| 缩放     | 放大会失真                 | 无限缩放不失真                    |
| 文本支持 | 文本是图形，不可选中       | 文本是真实文本，可搜索选中        |

### Q2：Canvas 动画如何实现？

```javascript
function animate() {
  // 1. 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2. 更新状态
  x += vx;
  y += vy;

  // 3. 绘制图形
  draw();

  // 4. 请求下一帧
  requestAnimationFrame(animate);
}

// 启动动画
animate();
```

### Q3：Canvas 性能优化有哪些方法？

- **使用离屏 Canvas**：预渲染复杂图形
- **减少绘制次数**：合并绘制操作
- **使用 requestAnimationFrame**：浏览器优化动画时机
- **只重绘变化区域**：使用 `clearRect` 清除特定区域
- **降低分辨率**：对于不需要高清的场景

::: warning
注意：Canvas 不支持直接绑定事件，需要手动计算坐标来判断点击了哪个图形。这也是为什么复杂交互推荐使用 SVG 的原因。
:::
