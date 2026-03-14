---
title: Next.js 相关
date: 2026-03-14
categories:
  - Frontend
tags:
  - nextjs
  - interview
sidebar: auto
publish: true
---

## 🎯 Next.js 相关

### Next.js 和 React 的区别

| 对比项     | React                     | Next.js                      |
| ---------- | ------------------------- | ---------------------------- |
| **定位**   | UI 库                     | 全栈框架                     |
| **渲染**   | 默认 CSR                  | SSR/SSG/ISR/CSR 全支持       |
| **路由**   | 需配 React Router         | 基于文件系统的自动路由       |
| **API**    | 需要单独后端              | 内置 API Routes              |
| **优化**   | 手动配置                  | 自动代码分割、图片优化       |
| **SEO**    | 需要额外配置              | 原生支持                     |

---

### App Router VS Pages Router

| 对比项         | Pages Router (pages 目录) | App Router (app 目录) |
| -------------- | ------------------------- | --------------------- |
| **布局**       | 每页独立                  | 嵌套 Layout           |
| **数据获取**   | getServerSideProps        | async/await           |
| **Loading**    | 需手动实现                | `loading.tsx` 自动    |
| **Error**      | _error.tsx                | `error.tsx` 自动      |
| **Server Comp**| 不支持                    | 原生支持              |

```js
// Pages Router
export async function getServerSideProps() {
  const data = await fetchData();
  return { props: { data } };
}

// App Router
async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

---

### SSR、SSG、ISR 和 CSR的区别及适用场景

| 模式 | 全称           | 渲染时机         | 适用场景                     |
| ---- | -------------- | ---------------- | ---------------------------- |
| **SSR** | Server-Side Rendering  | 每次用户请求时，服务器实时渲染返回 HTML | 动态内容、SEO 需求高         |
| **SSG** | Static Site Generation | 构建时（`npm run build`）预渲染成静态 HTML 文件 | 静态内容、博客、文档         |
| **ISR** | Incremental Static Regeneration | 构建时预渲染 + 后台按设定时间（如 10s）定时更新缓存 | 内容变化不频繁、需性能       |
| **CSR** | Client-Side Rendering  | 浏览器加载 JS 后，客户端动态渲染（首次返回空壳页面） | 后台管理、无需 SEO           |


#### Pages Router 写法

```js
// SSR - 每次请求渲染
export async function getServerSideProps() {
  return { props: { date: new Date() } };
}

// SSG - 构建时渲染
export async function getStaticProps() {
  return { props: { date: new Date() } };
}

// ISR - 每 10 秒更新
export async function getStaticProps() {
  return {
    props: { date: new Date() },
    revalidate: 10,
  };
}
```


#### App Router 写法

```tsx
// SSR - 每次请求渲染（默认行为）
async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store', // 禁用缓存，每次都请求
  });
  return <div>{data.date}</div>;
}

// SSG - 构建时渲染
async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'force-cache', // 强制缓存，只在构建时请求一次
  });
  return <div>{data.date}</div>;
}

// ISR - 每 10 秒更新
async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 10 }, // 每 10 秒重新验证
  });
  return <div>{data.date}</div>;
}

// 或者使用路由配置（更推荐）
export const revalidate = 10; // 整页 ISR

async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data.date}</div>;
}
```

</details>

---

### 什么是 Hydration（水合）

**Hydration（水合）** 是将服务端渲染的静态 HTML"激活"为可交互的 React 应用的过程。

:::tip 为什么需要 Hydration？

服务端渲染的 HTML 是**静态的**，没有事件处理、没有状态管理，用户无法交互。Hydration 让 React"认领"这段 HTML，为其注入交互能力。
:::

#### Hydration 流程

```
1️⃣ 服务端生成 HTML → 2️⃣ 浏览器显示静态页面 → 3️⃣ 加载 React JS → 4️⃣ Hydration → 5️⃣ 可交互
   (首屏快速展示)      (用户先看到内容)            (绑定事件、状态)
```

#### 具体过程

```tsx
// 1️⃣ 服务端渲染（生成静态 HTML）
// 服务端返回
<div id="root">
  <h1>计数器: 0</h1>
  <button>增加</button>
</div>

// 2️⃣ 客户端加载 React 并执行 Hydration
import { hydrateRoot } from 'react-dom/client';

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>计数器: {count}</h1>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}

// React 复用现有 HTML，只为 button 绑定点击事件
hydrateRoot(document.getElementById('root')!, <App />);
```

#### 关键点

- **复用 DOM**：React 不会重建 DOM，直接复用服务端的 HTML（性能优化）
- **绑定事件**：为静态元素添加事件监听器
- **状态同步**：建立响应式状态管理系统
- **一致性检查**：React 会对比服务端和客户端的 DOM 结构

#### 常见 Hydration 错误

**1. 服务端与客户端渲染不一致**

```tsx
// ❌ 错误：服务端和客户端渲染不同内容
function App() {
  return <div>{typeof window === 'undefined' ? '服务端' : '客户端'}</div>;
  // 警告：Text content does not match server-rendered HTML
}

// ✅ 正确：使用 useEffect（只在客户端执行）
function App() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return <div>{isClient ? '客户端' : '服务端'}</div>;
}
```

**2. 随机值导致不匹配**

```tsx
// ❌ 错误：每次渲染随机值不同
function App() {
  return <div>{Math.random()}</div>;
}

// ✅ 正确：使用状态锁定初始值
function App() {
  const [value] = useState(Math.random());
  return <div>{value}</div>;
}
```

**3. 时间戳不匹配**

```tsx
// ❌ 错误：服务端和客户端时间不同
function App() {
  return <div>{new Date().toString()}</div>;
}

// ✅ 正确：客户端加载后再显示
function App() {
  const [time, setTime] = useState('');
  useEffect(() => setTime(new Date().toString()), []);
  return <div>{time || '加载中...'}</div>;
}
```

#### 性能优化

```tsx
// 使用 suppressHydrationWarning 抑制警告（确定可忽略时）
function App() {
  return (
    <div suppressHydrationWarning>
      {new Date().toISOString()} {/* 时间差异可接受 */}
    </div>
  );
}
```

---

### 中间件（Middleware）代码demo，有什么作用

**作用**：在请求完成前拦截，用于鉴权、重定向、A/B 测试等。

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. 鉴权
  const token = request.cookies.get('token');
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. 添加响应头
  const response = NextResponse.next();
  response.headers.set('X-Custom-Header', 'value');
  return response;
}

// 匹配路径
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```