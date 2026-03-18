---
title: Typescript 面试题目整理
date: 2026-03-13
categories:
  - Frontend
tags:
  - typescript
  - interview
sidebar: auto
publish: true
---

## 🎯 Typescript 面试题目整理

### 1. 什么是泛型？

泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。

**核心优势：**

- **代码复用**：同一套逻辑可用于多种类型
- **类型安全**：编译时进行类型检查
- **灵活性**：保持类型约束的同时提供灵活性

**常见应用场景：**

```typescript
// 1. 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(123); // 显式指定
const str = identity('hello'); // 类型推断

// 2. 泛型接口
interface Box<T> {
  value: T;
}

const box: Box<string> = { value: 'test' };

// 3. 泛型类
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

// 4. 泛型约束
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// 5. 常用工具泛型
// Partial<T> - 所有属性变为可选
// Required<T> - 所有属性变为必需
// Readonly<T> - 所有属性变为只读
// Pick<T, K> - 选取部分属性
// Omit<T, K> - 排除部分属性
```

---

### 2. type 和 interface 的区别

| 特性         | interface              | type                                     |
| ------------ | ---------------------- | ---------------------------------------- |
| **定义方式** | `interface Person { }` | `type Person = { }`                      |
| **扩展方式** | `extends` 关键字       | 交叉类型 `&`                             |
| **合并行为** | 支持声明合并           | 不支持                                   |
| **适用范围** | 只能定义对象结构       | 可定义任何类型（联合、元组、基本类型等） |

**关键区别详解：**

```typescript
// 1. 声明合并（interface 独有）
interface User {
  name: string;
}

interface User {
  age: number;
}
// 合并为：{ name: string; age: number; }

// type 会报重复定义错误
type Animal = { species: string };
// type Animal = { legs: number };  // ❌ Error

// 2. 扩展语法不同
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// 使用 type 实现类似效果
type Person = { name: string };
type Employee = Person & { role: string }; // 交叉类型

// 3. type 能定义更丰富的类型
type StringOrNumber = string | number; // 联合类型
type Pair = [string, number]; // 元组类型
type Direction = 'up' | 'down' | 'left'; // 字面量类型
type GetName = () => string; // 函数类型

// interface 只能定义对象形状
// interface GetName = () => string;  // ❌ Error
```

**使用建议：**

- 定义对象结构、需要声明合并 → 用 `interface`
- 定义联合类型、元组、函数类型等复杂类型 → 用 `type`
- 很多场景下两者可以互换，保持代码库一致性更重要

---

### 3. any、unknown、never 的区别

这三个类型代表了 TypeScript 中类型安全的三个极端：

#### **any** - 类型系统中的"后门"

```typescript
let anything: any = 42;
anything = 'hello'; // ✅ 可以赋任何值
anything.foo.bar; // ✅ 任意属性访问
anything(); // ✅ 任意调用
anything[0][1]; // ✅ 任意索引访问
```

- **特点**：完全放弃类型检查，可以赋值给任何类型
- **用途**：逐步迁移 JS 项目、处理动态数据
- **风险**：破坏类型安全，应尽量避免使用

---

#### **unknown** - 类型安全的 any

```typescript
let value: unknown = 42;

value = 'hello'; // ✅ 可以赋任何值

// value.foo.bar;          // ❌ Error: 必须先收窄类型
// value();                // ❌ Error: 必须先收窄类型

// 使用前必须进行类型检查
if (typeof value === 'string') {
  console.log(value.toUpperCase()); // ✅ TypeScript 知道这里是 string
}

// 类型断言/收窄
const str = value as string; // ⚠️ 需要自己保证正确
```

- **特点**：可以接受任何值，但使用前必须确定类型
- **用途**：处理不确定类型的数据、API 返回值
- **优势**：强制开发者做类型检查，比 any 更安全

---

#### **never** - 不可能存在的类型

```typescript
// 1. 永不返回的函数
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}

// 2. 类型收窄的终点
function getArea(shape: Shape) {
  switch (shape.type) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.side ** 2;
    default:
      const _exhaustiveCheck: never = shape; // ✅ 确保处理所有情况
      return _exhaustiveCheck;
  }
}

// 3. 空数组类型推断
const emptyArray = []; // 类型为 never[]
emptyArray.push(1); // ✅ 推断为 number[]
```

- **特点**：表示永远不存在的值类型
- **用途**：抛异常函数、死循环、穷尽类型检查
- **特性**：never 是所有类型的子类型，可以赋值给任何类型

---

#### **三者关系图**

```
类型范围:
┌─────────────────────────────────────┐
│           any (最宽泛)               │
│  ┌───────────────────────────────┐  │
│  │    unknown (安全的最宽泛)       │  │
│  │   ┌─────────────────────────┐  │  │
│  │   │   具体类型 (string, etc) │  │  │
│  │   │   ┌───────────────────┐  │  │  │
│  │   │   │   never (最窄)     │  │  │  │
│  │   │   └───────────────────┘  │  │  │
│  │   └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘

赋值关系:
any      ← never ✅  (never 可赋值给任何类型)
unknown  ← never ✅
string   ← never ✅

any ← unknown ❌  (unknown 不能赋值给 any 以外的类型)
any ← string  ❌
```

**最佳实践：**

```typescript
// ❌ 避免 any
function processData(data: any) {}

// ✅ 优先 unknown
function processData(data: unknown) {
  if (isValidData(data)) {
    // 使用 data
  }
}

// ✅ never 用于穷尽检查
type Shape = Circle | Square;
function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}
```

### 4. 什么是类型断言

> 类型断言就是"我比你更懂这个值的类型，听我的"

```ts
// 方法1：as 写法（推荐）
let value = 'hello' as string;

// 方法2：尖括号写法
let value = <string>'hello';

// 什么时候用
// DOM 元素操作、处理 API 返回数据、处理联合类型、非空断言、const 断言（类型变成：readonly）

// 1. DOM 操作
document.getElementById('id') as HTMLDivElement;

// 2. 接口数据
fetch(url).then((res) => res.json() as User)

// 3. 确定非空
// 可能为空的变量!

// 4. 精确类型
['a', 'b'] as const
```

### 5. 用 ts 实现多态，父类 animal，子类 cat 和 dog，包含 name 属性，实现 say 方法

```ts
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  say(): void {
    console.log('Animal says...');
  }
}

class Cat extends Animal {
  say(): void {
    console.log('Meow!');
  }
}

class Dog extends Animal {
  say(): void {
    console.log('Woof!');
  }
}

// 多态性的应用
const animals: Animal[] = [new Cat('Tom'), new Dog('Max'), new Cat('Kitty')];

animals.forEach((animal) => {
  console.log(`Name: ${animal.name}`);
  animal.say();
  console.log('------------------');
});

// yarn add global ts-node typescript
// npx ts-node test.ts
```