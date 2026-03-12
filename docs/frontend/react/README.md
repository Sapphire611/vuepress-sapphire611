---
title: React 题目整理
date: 2026-3-12
categories:
  - Frontend
tags:
  - react
  - interview
sidebar: 'auto'
publish: true
---

## 👋 React 题目整理

### React 生命周期

#### 类组件

**生命周期流程**：挂载时 `constructor` → `render` → `componentDidMount`；更新时 `render` → `componentDidUpdate`；卸载时 `componentWillUnmount`。

**触发重新渲染**：`setState`、`props` 变化或父组件渲染都会触发 `render`（父组件更新会导致所有子组件重新渲染，可用 `PureComponent` 或 `shouldComponentUpdate` 优化）。

```js
// 类组件
import React, { Component } from 'react';

class LifecycleDemo extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('Component is mounted.');
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('Component updated. Previous count: ' + prevState.count);
  }

  componentWillUnmount() {
    console.log('Component will unmount.');
  }

  render() {
    return (
      ...
    );
  }
}

export default LifecycleDemo;
```

#### 函数式组件

使用 React Hooks 来模拟类组件的生命周期：

```js
import { useState, useEffect, useRef } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);
  const isMounted = useRef(false);

  // componentDidMount
  useEffect(() => {
    console.log('组件挂载');
    isMounted.current = true;

    // componentWillUnmount
    return () => {
      console.log('组件卸载');
      isMounted.current = false;
    };
  }, []);

  // componentDidUpdate (特定状态 - count)
  useEffect(() => {
    if (isMounted.current) {
      console.log('count 更新了:', count);
    }
  }, [count]);

  // 通用的 componentDidUpdate
  useEffect(() => {
    if (isMounted.current) {
      console.log('组件更新了');
    }
  }); // 注意：没有依赖数组

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

### useState 快照及累加问题

#### useState 快照是什么？

在 React 中，状态变量在每次渲染时都是 **固定的快照**。设置状态会触发重新渲染，在新渲染中 React 会提供新的状态值。

```js
// 不断进行累加会出现的问题
function Counter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    // 问题：使用当前渲染的快照值
    setCount(count + 1); // count 是渲染时的快照
    setCount(count + 1); // 这里 count 还是同一个值！
    // 结果：只增加 1，而不是 2
  };

  // 正确的方式：使用函数更新
  const handleIncrementCorrectly = () => {
    setCount((prevCount) => prevCount + 1);
    setCount((prevCount) => prevCount + 1);
    // 结果：增加 2
  };

  // 在闭包中的问题
  const handleAsyncIncrement = () => {
    setTimeout(() => {
      setCount(count + 1); // 这里使用的是创建闭包时的 count 值
    }, 1000);
  };

  // 正确的异步更新
  const handleAsyncIncrementCorrectly = () => {
    setTimeout(() => {
      setCount((prevCount) => prevCount + 1);
    }, 1000);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>错误累加（只+1）</button>
      <button onClick={handleIncrementCorrectly}>正确累加（+2）</button>
      <button onClick={handleAsyncIncrement}>错误异步</button>
      <button onClick={handleAsyncIncrementCorrectly}>正确异步</button>
    </div>
  );
}
```

### useState 和 useReducer 的区别

#### 基本概念对比

**useState - 简单状态管理**

```js
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount((prev) => prev + 1)}>+1 (函数式)</button>
    </div>
  );
}
```

**useReducer - 复杂状态管理**

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'RESET':
      return { ...state, count: 0 };
    default:
      return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>重置</button>
    </div>
  );
}
```

| 特性     | useState           | useReducer                   |
| -------- | ------------------ | ---------------------------- |
| 适用场景 | 简单状态、独立状态 | 复杂状态、关联状态、复杂逻辑 |
| 状态结构 | 单个状态值         | 多个相关联的状态对象         |
| 更新逻辑 | 直接设置或简单转换 | 通过 action 和 reducer 处理  |
| 可预测性 | 较低               | 较高（纯函数）               |
| 测试性   | 较难测试           | 容易测试（reducer 是纯函数） |
| 代码组织 | 逻辑分散在组件中   | 逻辑集中在 reducer 中        |

#### useState/useReducer 深度嵌套更新问题

**useState 的陷阱：**

```tsx
function UserProfile() {
  const [user, setUser] = useState({
    name: 'John',
    profile: { age: 25, address: { city: 'Beijing' } },
  });

  // 错误：直接修改嵌套对象
  const updateCity = (city: string) => {
    user.profile.address.city = city; // ❌ 直接修改
    setUser(user); // ❌ 不会触发重新渲染
  };

  // 正确：需要深度拷贝（代码冗长）
  const updateCityCorrectly = (city: string) => {
    setUser((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        address: { ...prev.profile.address, city: city },
      },
    }));
  };
}
```

**useReducer 的解决方案：**

```tsx
type UserAction = { type: 'UPDATE_CITY'; payload: string } | { type: 'UPDATE_AGE'; payload: number };

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'UPDATE_CITY':
      return {
        ...state,
        profile: {
          ...state.profile,
          address: { ...state.profile.address, city: action.payload },
        },
      };
    default:
      return state;
  }
}

// 使用：代码更清晰
const updateCity = (city: string) => dispatch({ type: 'UPDATE_CITY', payload: city });
```

### useMemo / useCallback / useEffect 三者区别

这三个 Hook 解决的问题完全不同，可以用一句话区分：

| Hook | 解决什么问题 | 执行时机 | 一句话概括 |
|:---:|:---|:---|:---|
| **useEffect** | 副作用处理 | **渲染后** | "渲染完做某事"（请求数据、修改 DOM） |
| **useCallback** | 函数引用稳定 | **渲染时** | "保持函数身份不变"（避免子组件重渲染）|
| **useMemo** | 计算结果缓存 | **渲染时** | "记住计算结果"（避免重复计算） |

---

#### 1️⃣ useEffect - 处理副作用

**作用**：在组件渲染**之后**执行副作用操作（API 请求、订阅、手动 DOM 操作）

```js
// 每次 count 变化后，打印日志
useEffect(() => {
  console.log('count 变化了:', count);
}, [count]);

// 组件挂载时请求数据
useEffect(() => {
  fetchData();
}, []); // 空数组 = 只执行一次
```

**关键点**：
- 在渲染**之后**异步执行
- 可以返回清理函数（用于取消订阅等）
- 不阻塞渲染

---

#### 2️⃣ useCallback - 缓存函数引用

**作用**：保持函数引用稳定，防止因函数重建导致子组件不必要的重渲染

```js
// ❌ 每次渲染都创建新函数，ChildComponent 会重渲染
const handleClick = () => {
  setValue(value + 1);
};

// ✅ 函数引用不变，ChildComponent 不会重渲染（假设用了 React.memo）
const handleClick = useCallback(() => {
  setValue(value + 1);
}, [value]); // value 不变，函数引用就不变
```

**使用场景**：传递给经过 `React.memo` 优化的子组件

```js
function Parent() {
  const [count, setCount] = useState(0);

  // 不用 useCallback：Child 每次都重渲染
  // 用 useCallback：只在 count 变化时重渲染
  const handleClick = useCallback(() => {
    console.log('点击了，当前值:', count);
  }, [count]);

  return <Child onClick={handleClick} />;
}
```

---

#### 3️⃣ useMemo - 缓存计算结果

**作用**：缓存昂贵的计算结果，避免每次渲染都重新计算

```js
// ❌ 每次渲染都重新计算（即使 list 没变）
const filteredData = dataList.filter(item => item.price > 100);

// ✅ 只在 dataList 变化时重新计算
const filteredData = useMemo(() => {
  console.log('执行过滤...');
  return dataList.filter(item => item.price > 100);
}, [dataList]);
```

**使用场景**：
- 昂贵的计算（排序、过滤、复杂运算）
- 保持引用稳定（避免子组件重渲染）

```js
// 场景：避免因对象引用变化导致子组件重渲染
const style = useMemo(() => ({
  fontSize: '16px',
  color: theme.color
}), [theme.color]); // theme.color 不变，style 对象引用就不变
```

---

#### 快速记忆

```js
// 渲染后做事（异步）
useEffect(() => { document.title = count }, [count]);

// 渲染时用（同步）
useCallback(() => {}, [deps]);  // 缓存函数
useMemo(() => value, [deps]);   // 缓存值
```

**本质区别**：
- `useEffect` = **副作用**（与渲染无关）
- `useCallback` = **useMemo(fn, deps) 的语法糖**（缓存函数）
- `useMemo` = **计算缓存**（性能优化）

---

### Virtual DOM 和 Diff 算法

#### 什么是 Virtual DOM？

Virtual DOM 是真实 DOM 的 JavaScript 对象表示，React 用它来提高渲染性能。

```js
// 真实 DOM
<div class="container">
  <h1>Hello</h1>
</div>

// Virtual DOM（JavaScript 对象）
{
  type: 'div',
  props: {
    className: 'container',
    children: {
      type: 'h1',
      props: {
        children: 'Hello'
      }
    }
  }
}
```

#### Virtual DOM 的工作流程

1. **创建**：React 创建 Virtual DOM 树
2. **对比**：状态变化时，React 创建新的 Virtual DOM 树并与旧树对比（Diff 算法）
3. **更新**：计算出最小的差异，只更新需要变化的部分到真实 DOM

#### React Diff 算法的三个策略

**1. 只对同层级节点比较**

```js
// ❌ 不会跨层级比较
// 旧树
<div>
  <A />
</div>

// 新树
<div>
  <B />
  <A />
</div>
// React 会销毁 A，创建 B，再创建 A（不会复用 A）

// ✅ 正确做法：使用 key 标识节点
```

**2. 不同类型元素直接替换**

```js
// 旧
<div>Hello</div>

// 新
<span>Hello</span>
// React 会销毁 div 及其子节点，创建新的 span
```

**3. 通过 key 识别节点**

```js
// ❌ 没有 key，React 按索引比较
// 旧：[A, B, C]
// 新：[A, C, B]
// React 会保留 A，更新 B→C，更新 C→B（浪费性能）

// ✅ 使用 key
<ul>
  {items.map(item => <li key={item.id}>{item.name}</li>)}
</ul>
// React 通过 key 精确找到对应节点，只移动位置
```

#### 为什么 Virtual DOM 更快？

- **减少 DOM 操作**：批量更新，避免频繁操作真实 DOM
- **跨浏览器兼容**：抽象了浏览器差异
- **性能优化**：只更新变化的部分

---

### React 中 key 的作用

#### key 是什么？

`key` 是 React 用来识别列表项的唯一标识符。

```js
// ❌ 使用索引（不推荐）
{items.map((item, index) => (
  <li key={index}>{item.name}</li>
))}

// ✅ 使用唯一 ID（推荐）
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
```

#### key 的作用原理

React 使用 key 来：
1. **识别节点**：判断节点是新增、移动还是删除
2. **复用节点**：避免不必要的销毁和重建
3. **保持状态**：确保组件状态正确关联

```js
// 示例：key 对组件状态的影响
function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: '学习 React', checked: false },
    { id: 2, text: '写代码', checked: true }
  ]);

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
```

#### 常见错误

**1. 使用索引作为 key**

```js
// ❌ 问题：列表顺序变化时，状态会错乱
{items.map((item, index) => (
  <TodoItem key={index} item={item} />
))}

// 场景：删除第一项，第二项的 key 从 1 变成 0
// React 会复用第一个组件，状态混乱
```

**2. key 重复**

```js
// ❌ 错误：key 必须唯一
{items.map(item => (
  <div key={item.type}>{item.name}</div>
  // 如果多个 item 的 type 相同，key 就重复了
))}
```

**3. 随机生成 key**

```js
// ❌ 错误：每次渲染都变化
{items.map(item => (
  <div key={Math.random()}>{item.name}</div>
  // 每次都创建新节点，失去 key 的意义
))}
```

#### 正确使用

```js
// ✅ 推荐：使用稳定的唯一 ID
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}

// ✅ 组合 key（没有唯一 ID 时）
{items.map((item, index) => (
  <div key={`${item.type}-${index}`}>
    {item.name}
  </div>
))}
```

---

### React 性能优化方法

#### 1. 使用 React.memo 避免不必要的重渲染

```js
// ❌ 每次父组件渲染，子组件都渲染
function Child({ name }) {
  console.log('Child 渲染');
  return <div>{name}</div>;
}

// ✅ 使用 React.memo 进行浅比较
const Child = React.memo(({ name }) => {
  console.log('Child 渲染');
  return <div>{name}</div>;
});

// 自定义比较函数
const Child = React.memo(
  ({ name }) => {
    console.log('Child 渲染');
    return <div>{name}</div>;
  },
  (prevProps, nextProps) => {
    // 返回 true 表示不需要重渲染
    return prevProps.name === nextProps.name;
  }
);
```

#### 2. 使用 useMemo 缓存计算结果

```js
function ProductList({ products, filter }) {
  // ❌ 每次渲染都重新计算
  const filtered = products.filter(p => p.category === filter);

  // ✅ 只在 products 或 filter 变化时计算
  const filtered = useMemo(() => {
    return products.filter(p => p.category === filter);
  }, [products, filter]);

  return <div>{filtered.map(/* ... */)}</div>;
}
```

#### 3. 使用 useCallback 缓存函数

```js
function Parent() {
  const [count, setCount] = useState(0);

  // ✅ 函数引用不变，Child 不会因父组件渲染而重渲染
  const handleClick = useCallback(() => {
    console.log('点击了');
  }, []); // 空依赖，函数永远不变

  return <Child onClick={handleClick} />;
}

const Child = React.memo(({ onClick }) => {
  console.log('Child 渲染');
  return <button onClick={onClick}>点击</button>;
});
```

#### 4. 列表渲染使用 key

```js
// ✅ 必须使用稳定的 key
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}
```

#### 5. 避免不必要的状态

```js
// ❌ 冗余状态：可以从 props 派生
function User({ user }) {
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(`${user.firstName} ${user.lastName}`);
  }, [user]);

  return <div>{fullName}</div>;
}

// ✅ 直接计算
function User({ user }) {
  const fullName = `${user.firstName} ${user.lastName}`;
  return <div>{fullName}</div>;
}
```

#### 6. 懒加载组件

```js
import { lazy, Suspense } from 'react';

// ✅ 路由级别的代码分割
const Home = lazy(() => import('./Home'));
const About = lazy(() => import('./About'));

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
}
```

#### 7. 虚拟滚动（长列表优化）

```js
// 使用 react-window 或 react-virtualized
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{items[index].name}</div>
      )}
    </FixedSizeList>
  );
}
```

#### 性能优化总结

| 优化方法 | 使用场景 | 注意事项 |
|:---|:---|:---|
| **React.memo** | 组件渲染昂贵，props 很少变化 | 只做浅比较，对象 props 要注意 |
| **useMemo** | 昂贵计算、保持引用稳定 | 不要过度使用，计算本身也有成本 |
| **useCallback** | 传递给优化过的子组件 | 配合 React.memo 使用 |
| **懒加载** | 路由、大组件 | 首屏加载性能提升明显 |
| **虚拟滚动** | 长列表（100+ 项） | 简单列表没必要 |

---

### 受控组件 vs 非受控组件

#### 核心区别

| 特性 | 受控组件 | 非受控组件 |
|:---|:---|:---|
| **数据源** | React state | DOM |
| **值更新** | 通过 setState | 直接操作 DOM |
| **实时验证** | ✅ 支持 | ❌ 困难 |
| **使用场景** | 表单验证、动态表单 | 简单表单、集成第三方库 |

#### 受控组件

表单元素的值由 React state 控制。

```js
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // 直接使用 state
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}  // ✅ 受控：值来自 state
        onChange={handleChange}
      />
      <input
        name="email"
        value={formData.email}  // ✅ 受控
        onChange={handleChange}
      />
      <textarea
        name="message"
        value={formData.message}  // ✅ 受控
        onChange={handleChange}
      />
      <button type="submit">提交</button>
    </form>
  );
}
```

**优点**：
- ✅ 即时验证
- ✅ 条件禁用/启用输入
- ✅ 强制输入格式

```js
// 实时验证示例
function PasswordInput() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // 实时验证
    if (value.length < 8) {
      setError('密码至少8位');
    } else {
      setError('');
    }
  };

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={handleChange}
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

#### 非受控组件

表单元素的值由 DOM 自己管理，通过 ref 获取。

```js
function ContactForm() {
  const nameRef = useRef();
  const emailRef = useRef();
  const messageRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 通过 ref 获取值
    console.log({
      name: nameRef.current.value,
      email: emailRef.current.value,
      message: messageRef.current.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={nameRef}  // ✅ 非受控：通过 ref 操作
        defaultValue="默认值"  // 注意：用 defaultValue
      />
      <input
        ref={emailRef}
        type="email"
      />
      <textarea
        ref={messageRef}
        defaultValue=""
      />
      <button type="submit">提交</button>
    </form>
  );
}
```

**优点**：
- ✅ 代码更简洁
- ✅ 更少的 state
- ✅ 集成第三方库（如日期选择器）

```js
// 集成第三方库
function DatePicker() {
  const dateRef = useRef();

  const handleSubmit = () => {
    // 直接使用第三方库的 API
    const date = dateRef.current.getDate();
    console.log(date);
  };

  return (
    <div>
      <SomeThirdPartyDatePicker ref={dateRef} />
      <button onClick={handleSubmit}>提交</button>
    </div>
  );
}
```

#### 如何选择？

```js
// ✅ 使用受控组件的场景
- 需要实时验证
- 动态表单（字段数量变化）
- 需要条件禁用/启用
- 表单提交前需要所有数据

// ✅ 使用非受控组件的场景
- 简单表单（如登录框）
- 集成第三方库
- 不需要实时验证
- 性能敏感场景（大量表单项）
```

---

### React Context 的使用场景和原理

#### 什么是 Context？

Context 提供了一种在组件树中跨层级传递数据的方式，避免了 props 逐层传递（props drilling）。

```js
// ❌ Props Drilling：逐层传递
function App() {
  const user = { name: 'John' };
  return <Header user={user} />;
}

function Header({ user }) {
  return <Navbar user={user} />;
}

function Navbar({ user }) {
  return <UserMenu user={user} />;
}

function UserMenu({ user }) {
  return <span>{user.name}</span>;  // 终于用到了
}

// ✅ 使用 Context
const UserContext = createContext();

function App() {
  const user = { name: 'John' };
  return (
    <UserContext.Provider value={user}>
      <Header />
    </UserContext.Provider>
  );
}

function UserMenu() {
  const user = useContext(UserContext);
  return <span>{user.name}</span>;  // 直接获取
}
```

#### Context 的基本使用

**1. 创建 Context**

```js
import { createContext, useContext } from 'react';

// 创建 Context
const ThemeContext = createContext();

export default ThemeContext;
```

**2. 提供 Context**

```js
import ThemeContext from './ThemeContext';

function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
      <Main />
      <Footer />
    </ThemeContext.Provider>
  );
}
```

**3. 消费 Context**

```js
import { useContext } from 'react';
import ThemeContext from './ThemeContext';

function Header() {
  // 方式1：使用 useContext Hook
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <header className={theme}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
    </header>
  );
}

// 方式2：使用 Consumer（类组件）
class Footer extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({ theme }) => <footer className={theme}>Footer</footer>}
      </ThemeContext.Consumer>
    );
  }
}
```

#### Context 的常见使用场景

**1. 主题切换**

```js
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

function Button() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <button
      onClick={toggleTheme}
      style={{ background: theme === 'light' ? '#fff' : '#333' }}
    >
      切换主题
    </button>
  );
}
```

**2. 用户信息**

```js
const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {user ? <Dashboard /> : <Login />}
    </AuthContext.Provider>
  );
}

function Login() {
  const { setUser } = useContext(AuthContext);
  return <button onClick={() => setUser({ name: 'John' })}>登录</button>;
}
```

**3. 国际化（i18n）**

```js
const I18nContext = createContext();

const translations = {
  en: { welcome: 'Welcome' },
  zh: { welcome: '欢迎' }
};

function App() {
  const [lang, setLang] = useState('zh');

  return (
    <I18nContext.Provider value={{ lang, translations }}>
      <Page />
    </I18nContext.Provider>
  );
}
```

#### Context 的注意事项

**1. Context 更新会导致所有消费者重渲染**

```js
// ❌ 问题：频繁更新导致性能问题
function App() {
  const [data, setData] = useState({});
  const [count, setCount] = useState(0);

  return (
    <DataContext.Provider value={{ data, setData }}>
      <CountContext.Provider value={{ count, setCount }}>
        <Child />
      </CountContext.Provider>
    </DataContext.Provider>
  );
}

// ✅ 解决：拆分 Context，按需更新
const DataContext = createContext();
const CountContext = createContext();
```

**2. 默认值只在没有 Provider 时生效**

```js
const ThemeContext = createContext('light');  // 默认值

function App() {
  // 没有 Provider，使用默认值
  return <Header />;
}

function Header() {
  const theme = useContext(ThemeContext);  // 'light'
  return <div className={theme}>Header</div>;
}
```

**3. 性能优化**

```js
// ❌ 每次都创建新对象，导致消费者重渲染
<ThemeContext.Provider value={{ theme, setTheme }}>

// ✅ 使用 useMemo 稳定引用
const value = useMemo(() => ({ theme, setTheme }), [theme]);
<ThemeContext.Provider value={value}>
```

#### Context vs Redux

| 特性 | Context | Redux |
|:---|:---|:---|
| **复杂度** | 简单 | 较复杂 |
| **学习曲线** | 低 | 高 |
| **状态管理** | 基础 | 强大（中间件、时间旅行） |
| **性能** | 可能重渲染较多 | 细粒度控制 |
| **适用场景** | 小型应用、主题、用户信息 | 大型应用、复杂状态逻辑 |

**选择建议**：
- 🎯 简单的全局配置（主题、语言） → **Context**
- 🎯 复杂的状态管理（多个状态、异步逻辑） → **Redux / Zustand**
