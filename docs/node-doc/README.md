---
title: Node 文档学习
date: 2022-2-14
categories:
  - Backend
tags:
  - node
  - doc
sidebar: "auto"
publish: false
---

[Node.js v16.14.0 文档 - ZH](http://nodejs.cn/api/)

## Assert

```js
const assert = require('assert/strict'); // 严格断言模式

assert.deepEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]); // 会输出两者不同的地方（+/-，颜色标识）
```

### new assert.CallTracker()

> 可判断函数使用次数

```js
function func() {}
const tracker = new assert.CallTracker();

// callfunc() 必须在 tracker.verify() 之前恰好被调用 1 次。
const callsfunc = tracker.calls(func, 1);
callsfunc();

// 返回包含 callfunc() 信息的数组(),没有异常则为[]
tracker.report(); 

// 调用 tracker.verify() 并验证是否所有 tracker.calls() 函数都已被准确调用。
process.on('exit', () => {
  tracker.verify();
});
```

### assert.deepStrictEqual(actual, expected[, message])

> 测试 actual 和 expected 参数之间的深度相等。 

> "深度"相等意味着子对象的可枚举"自有"属性也按照以下规则递归地评估。


::: tip assert.deepStrictEqual 比较规则
- 使用 Object.is() 比较原始值。
- 对象的类型标签应该是一样的。
- 对象的 [[Prototype]] 使用 === 运算符进行比较。
- 仅考虑自有属性。
- Error 名称和消息总是被比较，即使它们不是可枚举的属性。
- 也比较了可枚举的自有 Symbol 属性。
- 对象封装器作为对象和未封装的值进行比较。
- Object 属性是无序比较的。
- Map 键和 Set 项是无序比较的。
- 当双方不同或双方遇到循环引用时，则递归停止。
- WeakMap 和 WeakSet 的比较不依赖于它们的值。 
:::

```js
const assert = require('assert/strict');

// 不通过，因为 1 !== '1'。
assert.deepStrictEqual({ a: 1 }, { a: '1' });

// 对象没有自有的属性,通过检查

const object = {};

const fakeDate = {};
const date = new Date();
Object.setPrototypeOf(fakeDate, Date.prototype);

// 不通过，因为原型不同：
assert.deepStrictEqual(object, fakeDate);

// 不通过，因为类型不同：
assert.deepStrictEqual(date, fakeDate);

// OK，因为 Object.is(NaN, NaN) 为 true
assert.deepStrictEqual(NaN, NaN);

// 不通过，解封装后确实不同
assert.deepStrictEqual(new Number(1), new Number(2));

// OK，因为对象和字符串在解封装时是相同的
assert.deepStrictEqual(new String('foo'), Object('foo'));

// OK
assert.deepStrictEqual(-0, -0);

// 不通过，符号不一样
assert.deepStrictEqual(0, -0);


```


