---
title: React 题目整理
date: 2023-10-24
categories:
  - Frontend
tags:
  - react
  - interview
sidebar: 'auto'
publish: true
showSponsor: true
---

## 👋 React 题目整理

### 1. React 中, useMemo/ useCallback / useEffect 三者区别

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

### 2. React 生命周期

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

### 3. react 渲染顺序

#### 3.1 初始渲染（Initial Render）

> 当组件首次被挂载到DOM时，React会执行构造函数 `constructor` 和 `render` 方法。

> 然后，`componentDidMount` 方法会在组件挂载后立即调用。

#### 3.2 状态或属性更新导致重新渲染

当组件的状态或属性发生变化时，React将再次调用 `render` 方法来重新渲染组件。
如果有定义的话，`componentDidUpdate` 方法会在组件更新后被调用。

#### 3.3 强制渲染（Forced Render）

使用 `this.setState()` 来强制组件重新渲染，`componentDidUpdate` 方法也会在强制渲染后被调用。


#### 3.4 父组件的重新渲染（Rerender of Parent Component）：

如果一个父组件重新渲染，它的子组件也将重新渲染，即使子组件的状态和属性没有发生变化。

如果有定义的话，子组件的 render 方法和 componentDidUpdate 方法也会被调用。

#### 3.5 卸载组件（Unmounting）：

当组件从DOM中卸载时，React会调用 `componentWillUnmount` 方法，以进行清理和资源释放。

---


$facet
