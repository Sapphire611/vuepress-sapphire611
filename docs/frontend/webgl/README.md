---
title: WebGL 极速入门
date: 2026-02-25
categories:
  - Frontend
tags:
  - webgl
  - threejs
  - interview
sidebar: auto
publish: true
---

## 🎯 WebGL 极速入门（面试应急版）

:::right
WebGL 就是让你在浏览器里调用 **GPU（显卡）** 来画图的一种方式
:::

---

## 一、WebGL vs Canvas 2D

| 技术 | 谁在画图 | 适合场景 | 性能 |
|-----|---------|---------|------|
| Canvas 2D | CPU（中央处理器） | 简单图形、少量元素 | 几千个元素就卡 |
| WebGL | GPU（图形处理器） | 复杂3D、海量元素 | 数万个元素流畅 |

::: tip 核心区别
Canvas 2D 用 CPU 画图，适合简单图形，几千个元素就卡。WebGL 用 GPU 画图，适合复杂3D和海量元素，可以轻松处理��万个点。
:::

---

## 二、WebGL 应用场景（军工场景举例）

| 场景 | 说明 | 为什么用WebGL |
|-----|------|--------------|
| 三维地形 | 战场地形、飞行航线 | 需要实时旋转、缩放 |
| 雷达扫描 | 3D立体扫描效果 | 需要光照、透明度效果 |
| 海量目标 | 同时显示上千个飞机/舰船 | Canvas会卡死 |
| 装备模型 | 坦克/导弹的3D模型展示 | 需要真实感渲染 |

---

## 三、WebGL 的"三座大山"（了解即可）

原生 WebGL 非常难，因为你要自己写着色器语言（GLSL），告诉 GPU 怎么画每个像素。

```glsl
// 顶点着色器：告诉GPU每个点在哪儿
attribute vec3 position;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// 片段着色器：告诉GPU每个像素什么颜色
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // 红色
}
```

::: warning
90% 的前端工程师用 Three.js 而不是原生 WebGL。Three.js 把复杂的 WebGL 操作封装成了简单的 JavaScript 对象。
:::

---

## 四、Three.js 核心概念

### Three.js 基础示例（面试常考）

```javascript
import * as THREE from 'three'

// 1. 创建场景
const scene = new THREE.Scene()

// 2. 创建相机（相当于眼睛）
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// 3. 创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 4. 创建物体
const geometry = new THREE.BoxGeometry()  // 立方体
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })  // 绿色材质
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

camera.position.z = 5

// 5. 动画循环
function animate() {
  requestAnimationFrame(animate)

  // 让立方体旋转
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  renderer.render(scene, camera)
}
animate()
```

### 核心概念对照表

| Three.js 概念 | 通俗解释 |
|--------------|---------|
| Scene | 整个3D世界，放所有东西的地方 |
| Camera | 你看世界的眼睛，决定看到什么 |
| Renderer | 负责把3D世界画到屏幕上 |
| Mesh | 物体 = 几何形状(Geometry) + 材质(Material) |
| Light | 光照，没有光就看不见颜色 |

---

## 五、面试常见问题（应急包）

### Q1：WebGL 和 Canvas 2D 有什么区别？

Canvas 2D 用 CPU 画图，适合简单图形，几千个元素就卡。WebGL 用 GPU 画图，适合复杂3D和海量元素，可以轻松处理上万个点。

### Q2：你用过 Three.js 吗？能做什么？

我了解 Three.js 的基本用法，比如创建场景、相机、物体、添加光照。在军工场景中，可以用它来展示三维地形、雷达扫描效果或装备模型。

### Q3：WebGL 性能优化有哪些方法？

- **减少绘制调用**：合并网格
- **使用 LOD（细节层次）**：远处用低模
- **限制帧率**：60fps 足够
- **离屏渲染 + 缓存**

---

## 六、如果被问到"你没做过3D怎么证明你能学"

::: tip 参考回答
虽然我之前项目以2D可视化为主，但我对Three.js有基本了解，知道它的核心概念和工作原理。而且WebGL本质是图形学在浏览器的实现，我有扎实的Canvas基础，对坐标系、矩阵变换、动画循环都很熟悉，相信能快速上手3D开发。
:::
