---
title: React 题目整理
date: 2023-10-24
categories:
  - frontend
tags:
  - react
  - interview
sidebar: 'auto'
publish: true
showSponsor: true
---

## 👋 React 题目整理

### 1. React 中, useMemo/ useCallback / useEffect 三者区别

[三者区别](/backend/node/node_interview/#_2-react-中-usememo-usecallback-useeffect-三者区别)

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
