---
title: LeetCode (JS)
date: 2022-1-19
categories:
  - Interview
tags:
  - leetcode
  - algorithm
sidebar: "auto"
publish: false
showSponsor: true
---

### 306. 累加数

```js
累加数 是一个字符串，组成它的数字可以形成累加序列。

一个有效的 累加序列 必须 至少 包含 3 个数。除了最开始的两个数以外，字符串中的其他数都等于它之前两个数相加的和。

给你一个只包含数字 '0'-'9' 的字符串，编写一个算法来判断给定输入是否是 累加数 。如果是，返回 true ；否则，返回 false 。

说明：累加序列里的数，除数字 0 之外，不会 以 0 开头，所以不会出现 1, 2, 03 或者 1, 02, 3 的情况。


示例 1：

输入："112358"
输出：true
解释：累加序列为: 1, 1, 2, 3, 5, 8 。1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, 3 + 5 = 8
示例 2：

输入："199100199"
输出：true
解释：累加序列为: 1, 99, 100, 199。1 + 99 = 100, 99 + 100 = 199


提示：

1 <= num.length <= 35
num 仅由数字（0 - 9）组成

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/additive-number
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
```

---

```js
/**
 * @param {string} num
 * @return {boolean}
 */

const isAdditiveNumber = (num) => {
  if (num.length === 0) return true;

  //   for (let i = 1; i <= num.length - 1; i++) { 累加数，前一个数不可能比后一个数大..
  for (let i = 1; i <= num.length / 2; i++) {
    if (num[0] === "0" && i > 1) return false; // “0235813” = false

    for (let j = i + 1; j < num.length; j++) {
      // j - i 长度有限制，不可能超数组一半
      if ((num[i] === "0" && j - i > 1) || j - i > num.length / 2) break;
      s;

      let num1 = Number(num.substring(0, i));
      let num2 = Number(num.substring(i, j));

      if (recursionJudge(num.substring(j), num1, num2)) return true;
    }
  }

  return false;
};

// 规范 : 数组变量得放在普通数字前
const recursionJudge = (remain, num1, num2) => {
  if (remain.length === 0) return true;

  // 1.remain开头是不是累加后的和，2.剩下的内容递归重复
  return (
    remain.startsWith(num1 + num2) &&
    recursionJudge(
      remain.substring((num1 + num2 + "").length),
      num2,
      num1 + num2
    )
  );
};

// console.log(isAdditiveNumber("000"));
```

::: right
来自 [Sapphire611](http://www.sapphire611.com)
:::
