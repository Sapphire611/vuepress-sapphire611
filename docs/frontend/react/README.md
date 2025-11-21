---
title: React 题目整理
date: 2025-11-21
categories:
  - Frontend
tags:
  - react
  - interview
sidebar: 'auto'
publish: true
---

## useState 和 useReducer 的区别

### 1. 基本概念对比

**useState - 简单状态管理**

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(prev => prev + 1)}>+1 (函数式)</button>
    </div>
  );
}
```

**useReducer - 复杂状态管理**

```tsx
import { useReducer } from 'react';

type State = { count: number };
type Action = { type: 'INCREMENT' } | { type: 'DECREMENT' } | { type: 'RESET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT': return { ...state, count: state.count + 1 };
    case 'DECREMENT': return { ...state, count: state.count - 1 };
    case 'RESET': return { ...state, count: 0 };
    default: return state;
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

### 2. 核心区别

| 特性 | useState | useReducer |
|------|----------|------------|
| 适用场景 | 简单状态、独立状态 | 复杂状态、关联状态、复杂逻辑 |
| 状态结构 | 单个状态值 | 多个相关联的状态对象 |
| 更新逻辑 | 直接设置或简单转换 | 通过 action 和 reducer 处理 |
| 可预测性 | 较低 | 较高（纯函数） |
| 测试性 | 较难测试 | 容易测试（reducer 是纯函数） |
| 代码组织 | 逻辑分散在组件中 | 逻辑集中在 reducer 中 |

### 3. 使用场景对比

**适合 useState 的场景：**

```tsx
// 简单的表单状态
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  return <div>...</div>;
}
```

**适合 useReducer 的场景：**

```tsx
// 复杂的数据流管理
type TodoState = {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  searchText: string;
};

type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: number }
  | { type: 'SET_FILTER'; payload: TodoState['filter'] };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, { id: Date.now(), text: action.payload, completed: false }] };
    case 'TOGGLE_TODO':
      return { ...state, todos: state.todos.map(todo => todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo) };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}
```

### 4. 深度依赖更新问题

**useState 的陷阱：**

```tsx
function UserProfile() {
  const [user, setUser] = useState({ 
    name: 'John', 
    profile: { age: 25, address: { city: 'Beijing' } } 
  });

  // 错误：直接修改嵌套对象
  const updateCity = (city: string) => {
    user.profile.address.city = city; // ❌ 直接修改
    setUser(user); // ❌ 不会触发重新渲染
  };

  // 正确：需要深度拷贝（代码冗长）
  const updateCityCorrectly = (city: string) => {
    setUser(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        address: { ...prev.profile.address, city: city }
      }
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
          address: { ...state.profile.address, city: action.payload }
        }
      };
    default:
      return state;
  }
}

// 使用：代码更清晰
const updateCity = (city: string) => dispatch({ type: 'UPDATE_CITY', payload: city });
```

### 5. 选择指南

**使用 useState 当：**
- ✅ 状态简单独立
- ✅ 状态更新逻辑简单
- ✅ 状态之间没有复杂依赖
- ✅ 组件逻辑不复杂

**使用 useReducer 当：**
- ✅ 多个相关联的状态需要一起更新
- ✅ 下一个状态依赖于前一个状态
- ✅ 有复杂的状态更新逻辑
- ✅ 需要更好的可测试性
- ✅ 状态结构复杂（深层嵌套）
- ✅ 需要与 useContext 配合管理全局状态

**实际开发建议：混合使用**

```tsx
function UserDashboard() {
  // 简单状态用 useState
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('profile');

  // 复杂数据流用 useReducer
  const [userData, dispatch] = useReducer(userReducer, initialUserData);

  return <div>...</div>;
}
```

**总结：** useState 适合简单场景，useReducer 适合复杂状态逻辑。选择哪个取决于状态的复杂度、关联性和更新逻辑的复杂性。

---

## useState 快照及累加问题

### useState 快照是什么？

在 React 中，状态变量在每次渲染时都是 **固定的快照**。设置状态会触发重新渲染，在新渲染中 React 会提供新的状态值。

### 不断进行累加会出现的问题：

```tsx
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
    setCount(prevCount => prevCount + 1);
    setCount(prevCount => prevCount + 1);
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
      setCount(prevCount => prevCount + 1);
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

### 总结 useState 最佳实践：

- 多次状态更新时使用函数形式：`setCount(prev => prev + 1)`
- 在异步操作中总是使用函数形式更新状态
- 在闭包中要特别注意状态的快照特性
- 复杂状态更新考虑使用 `useReducer`

---

## React 函数式组件中实现生命周期的方式

使用 React Hooks 来模拟类组件的生命周期：

```tsx
import { useState, useEffect, useRef } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);
  const isMounted = useRef(false);

  // componentDidMount + componentDidUpdate
  useEffect(() => {
    console.log('组件挂载或更新');
  });

  // componentDidMount
  useEffect(() => {
    console.log('组件挂载 - 只在首次渲染执行');
    
    // componentWillUnmount
    return () => {
      console.log('组件卸载');
    };
  }, []);

  // componentDidUpdate (特定状态)
  useEffect(() => {
    if (isMounted.current) {
      console.log('count 更新了:', count);
    } else {
      isMounted.current = true;
    }
  }, [count]);

  // 替代 getDerivedStateFromProps
  const [prevProps, setPrevProps] = useState({});
  useEffect(() => {
    // 比较 props 变化
    setPrevProps({ /* current props */ });
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  );
}
```

常用的生命周期对应关系：

- `componentDidMount` → `useEffect(() => {}, [])`
- `componentDidUpdate` → `useEffect(() => {})` 或带依赖的 `useEffect`
- `componentWillUnmount` → `useEffect(() => { return () => {} }, [])`
- `shouldComponentUpdate` → `React.memo` 或 `useMemo`

---

## 👋 React 题目整理

### React 中, useMemo/ useCallback / useEffect 三者区别

`useMemo`, `useCallback`, 和 `useEffect` 都是 **React** 中的钩子函数，用于处理不同方面的逻辑。它们的主要区别在于它们的用途和触发时机：

#### useEffect：

> useEffect 用于处理副作用，例如数据获取、订阅、手动 DOM 操作等。它模拟了生命周期方法，可以在组件渲染后执行特定的操作。

::: tip
👀useEffect 接受两个参数，第一个参数是一个函数，包含要执行的副作用逻辑；

第二个参数是一个依赖数组，用于指定什么情况下应该重新运行该副作用逻辑。

如果依赖数组为空，副作用将在每次渲染后都运行；如果没有提供依赖数组，副作用将只在组件首次渲染后运行。
:::

```javascript
useEffect(() => {
  // 执行副作用逻辑
  fetchData();
}, [dependency]);

useEffect(() => {
  try {
    userStore.getUserInfo();
  } catch {}
}, [userStore]);
```

#### useCallback：

> useCallback 用于**缓存回调函数**，通常用于将回调函数传递给子组件，以确保子组件不会在每次渲染时都重新创建相同的函数。

::: tip
👀 useCallback 接受两个参数，第一个参数是回调函数，第二个参数是一个依赖数组。
当依赖数组中的值发生变化时，才会重新创建回调函数。这个缓存的回调函数可以用作 props 传递给子组件。
:::

```js
const memoizedCallback = useCallback(() => {
  doSomethingWith(a, b);
}, [a, b]);
```

#### useMemo：

> useMemo 用于在渲染过程中计算并缓存计算结果。它可以帮助你避免不必要的重复计算，特别是在组件渲染时依赖某些值的计算较为昂贵时。

::: tip
👀 useMemo 接受两个参数，第一个参数是一个函数，用于计算结果；
第二个参数是一个依赖数组，只有在依赖数组中的值发生变化时，才会重新计算结果。这个结果会在组件渲染过程中被缓存，并在需要时返回。
:::

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

#### 总结

`useMemo` 用于缓存计算结果。
`useCallback` 用于缓存回调函数。
`useEffect` 用于处理副作用。

这些钩子函数的选择取决于你的具体需求和性能优化要求。使用它们可以帮助你更好地管理组件的状态和副作用。

---

### React 生命周期

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

```js
// 函数式 组件
// 相当于componentDidMount和componentDidUpdate
function FunctionalComponentDemo() {
  const [count, setCount] = useState(0);

  // 相当于componentDidMount和componentDidUpdate
  useEffect(() => {
    console.log('Component is mounted or updated. Current count: ' + count);

    // 返回一个清理函数，相当于componentWillUnmount
    return () => {
      console.log('Component will unmount.');
    };
  }, [count]);
}
```

### 类组件 react 渲染顺序

#### 初始渲染（Initial Render）

> 当组件首次被挂载到 DOM 时，React 会执行构造函数 `constructor` 和 `render` 方法。

> 然后，`componentDidMount` 方法会在组件挂载后立即调用。

#### 状态或属性更新导致重新渲染

当组件的状态或属性发生变化时，React 将再次调用 `render` 方法来重新渲染组件。
如果有定义的话，`componentDidUpdate` 方法会在组件更新后被调用。

#### 强制渲染（Forced Render）

使用 `this.setState()` 来强制组件重新渲染，`componentDidUpdate` 方法也会在强制渲染后被调用。

#### 父组件的重新渲染（Rerender of Parent Component）：

如果一个父组件重新渲染，它的子组件也将重新渲染，即使子组件的状态和属性没有发生变化。

如果有定义的话，子组件的 render 方法和 componentDidUpdate 方法也会被调用。

#### 卸载组件（Unmounting）：

当组件从 DOM 中卸载时，React 会调用 `componentWillUnmount` 方法，以进行清理和资源释放。

---
