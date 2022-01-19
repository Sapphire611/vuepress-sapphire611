---
title: LeetCode (JS)
date: 2022-1-19
categories:
  - Interview
tags:
  - leetcode
  - algorithm
sidebar: "auto"
publish: true
showSponsor: true
---

## Leetcode 做题记录

### 1. 两数之和

```js
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1]。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/two-sum
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处
```

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
const twoSum = (nums, target) => {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    if (map.has(target - nums[i])) return [map.get(target - nums[i]), i];

    map.set(nums[i], i);
  }
};

// console.log(twoSum([2, 7, 11, 15], 9));
```

---

### 2. 两数相加

```js
给你两个非空的链表，表示两个非负的整数。它们每位数字都是按照逆序的方式存储的，并且每个节点只能存储一位数字。

请你将两个数相加，并以相同形式返回一个表示和的链表。

你可以假设除了数字 0 之外，这两个数都不会以 0 开头。


输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807.

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/add-two-numbers
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
```

```js
const addTwoNumbers = (l1, l2) => {
  let list = new ListNode("0");
  const ans = list;
  let carry = 0;

  while (carry || l1 || l2) {
    let v1 = l1?.val ?? 0;
    let v2 = l2?.val ?? 0;
    let sum = v1 + v2 + carry;

    carry = Math.floor(sum / 10);
    list.next = new ListNode(sum % 10);
    list = list.next;

    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }

  return ans.next;
};
```

---

### 3. 无重复字符的最长子串

```js
给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。

示例 1:

输入: s = "abcabcbb"
输出: 3
解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
```

```js
const lengthOfLongestSubstring = (s) => {
  const window = [];
  let ans = 0;

  for (let i = 0; i < s.length; i++) {
    const find = window.indexOf(s[i]);

    if (find === -1) {
      window.push(s[i]);
      ans = window.length > ans ? window.length : ans; // 输出window达到过的最大长度
    } else {
      window.splice(0, find + 1); // 找到重复字母后，find之前的内容全部作废
      window.push(s[i]);
    }
  }

  return ans;
};
```

---

### 4. 两个正序数组的中位数

```js
给定两个大小分别为 m 和 n 的正序（从小到大）数组 nums1 和 nums2。请你找出并返回这两个正序数组的 中位数 。

算法的时间复杂度应该为 O(log (m+n)) 。

示例 1：

输入：nums1 = [1,3], nums2 = [2]
输出：2.00000
解释：合并数组 = [1,2,3] ，中位数 2

示例 2：
输入：nums1 = [1,2], nums2 = [3,4]
输出：2.50000
解释：合并数组 = [1,2,3,4] ，中位数 (2 + 3) / 2 = 2.5
```

```js
// 直接合并数组后输出，达不到O(log (m+n))的要求，二分个毛啊二分，快速解决问题才是真
const findMedianSortedArrays = (nums1, nums2) => {
  // const arr = [...nums1, ...nums2].sort((a, b) => { return a - b });
  const arr = nums1.concat(nums2).sort((a, b) => {
    return a - b;
  });

  const len = arr.length;
  return len % 2
    ? arr[Math.floor(len / 2)]
    : (arr[len / 2] + arr[len / 2 - 1]) / 2;
};
```

---

### 5. 最长回文子串

```js
给你一个字符串 s，找到 s 中最长的回文子串。

示例 1：
输入：s = "babad"
输出："bab"
解释："aba" 同样是符合题意的答案。

示例 2：
输入：s = "cbbd"
输出："bb"
```

```js
const longestPalindrome = (s) => {
  let res = "";

  // 变量提升后提升效率
  for (var i = 0; i < s.length; i++) {
    let l = (r = i); // 左右指针定位至i

    while (s[l] === s[r + 1]) r++; // 重复字母也算是回文：bb,bbbb,abbbba...

    i = r; // 提升效率，前面重复的字母不用比啦

    // 边界判断 + 回文判断
    while (l >= 0 && r < s.length - 1 && s[l - 1] === s[r + 1]) {
      l--;
      r++;
    }

    // res = r - l + 1 > res.length ? s.substring(l, r + 1) : res;
    if (r - l + 1 > res.length) res = s.substring(l, r + 1);
  }

  return res;
};

// console.log(longestPalindrome("abbbbc"))
```

---

### 6. Z 字形变换

```js
将一个给定字符串 s 根据给定的行数 numRows ，以从上往下、从左到右进行 Z 字形排列。

比如输入字符串为 "PAYPALISHIRING" 行数为 3 时，排列如下：

P   A   H   N
A P L S I I G
Y   I   R
之后，你的输出需要从左往右逐行读取，产生出一个新的字符串，比如："PAHNAPLSIIGYIR"。

请你实现这个将字符串进行指定行数变换的函数：

string convert(string s, int numRows);


示例 1:
输入：s = "PAYPALISHIRING", numRows = 3
输出："PAHNAPLSIIGYIR"

示例 2:
输入：s = "PAYPALISHIRING", numRows = 4
输出："PINALSIGYAHRPI"
解释：
P     I    N
A   L S  I G
Y A   H R
P     I
```

---

```js
const convert = (s, numRows) => {
  if (s.length < numRows || numRows == 1) {
    return s;
  }

  let arr = new Array(numRows).fill("");
  let index = 0; // 当前添加内容位置
  let plus = true; // 控制index的加减

  for (let i = 0; i < s.length; i++) {
    arr[index] += s[i];
    if (plus === true) {
      index += 1;
    } else {
      index -= 1;
    }

    if (index === 0) {
      plus = true;
    }
    if (index === numRows - 1) {
      plus = false;
    }
  }

  return arr.join("");
};

// console.log(convert("PAHNAPLSIIGYIR", 3));
```

---

### 7. 整数反转

```js
给你一个 32 位的有符号整数 x ，返回将 x 中的数字部分反转后的结果。

如果反转后整数超过 32 位的有符号整数的范围 [−231,  231 − 1] ，就返回 0。

假设环境不允许存储 64 位整数（有符号或无符号）。


示例 1:
输入：x = 123
输出：321

示例 2:
输入：x = -123
输出：-321

示例 3:
输入：x = 120
输出：21

示例 4:
输入：x = 0
输出：0
```

```js
const reverse = (x) => {
  const res = parseInt(
    Math.abs(x)
      .toString()
      .split("")
      .reverse()
      .join("")
  );

  // if (res > Math.pow(2,31) || res < Math.pow(-2,31) -1 ) return 0;
  if (res > 2147483648 || res < -2147483647) return 0;

  return x > 0 ? res : -res;
};
```

---

### 8. 字符串转换整数

```js
请你来实现一个 myAtoi(string s) 函数，使其能将字符串转换成一个 32 位有符号整数（类似 C/C++ 中的 atoi 函数）。

函数 myAtoi(string s) 的算法如下：

读入字符串并丢弃无用的前导空格
检查下一个字符（假设还未到字符末尾）为正还是负号，读取该字符（如果有）。
确定最终结果是负数还是正数。 如果两者都不存在，则假定结果为正。
读入下一个字符，直到到达下一个非数字字符或到达输入的结尾。字符串的其余部分将被忽略。
将前面步骤读入的这些数字转换为整数（即，"123" -> 123， "0032" -> 32）。
如果没有读入数字，则整数为 0 。必要时更改符号（从步骤 2 开始）。
如果整数数超过 32 位有符号整数范围 [−231,  231 − 1] ，需要截断这个整数，使其保持在这个范围内。
具体来说，小于 −231 的整数应该被固定为 −231 ，大于 231 − 1 的整数应该被固定为 231 − 1 。
返回整数作为最终结果。

注意：
本题中的空白字符只包括空格字符 ' ' 。
除前导空格或数字后的其余字符串外，请勿忽略 任何其他字符。

示例 1：

输入：s = "42"
输出：42
解释：加粗的字符串为已经读入的字符，插入符号是当前读取的字符。
第 1 步："42"（当前没有读入字符，因为没有前导空格）
         ^
第 2 步："42"（当前没有读入字符，因为这里不存在 '-' 或者 '+'）
         ^
第 3 步："42"（读入 "42"）
           ^
解析得到整数 42 。
由于 "42" 在范围 [-231, 231 - 1] 内，最终结果为 42 。
```

```js
// 又臭又长的弱智题目
const myAtoi = (str) => {
  const max = 2147483648; // 2 ^ 31

  let res = parseInt(str);

  if (isNaN(res)) return 0;
  if (res > max - 1) return max - 1;
  if (res < -max) return -max;

  return res;
};
```
---

### 9. 回文数

```js
给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。

回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。
例如，121 是回文，而 123 不是。
```

```js
const isPalindrome = (x) => {  
  return Number(`${Math.abs(x)}`.split('').reverse().join('')) === x;
};
```
### 10. 正则表达式匹配

```js
给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 '.' 和 '*' 的正则表达式匹配。

'.' 匹配任意单个字符
'*' 匹配零个或多个前面的那一个元素
所谓匹配，是要涵盖 整个 字符串 s的，而不是部分字符串。
```

```js

/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
const isMatch = (s, p) => {
  return new RegExp('^' + p + '$').test(s);
};
//用魔法打败魔法

```
---

### 11. 盛最多水的容器

```js
给你 n 个非负整数 a1，a2，...，an，每个数代表坐标中的一个点 (i, ai) 。在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, ai) 和 (i, 0) 。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

说明：你不能倾斜容器。

示例 1：
输入：[1,8,6,2,5,4,8,3,7]
输出：49 
解释：在此情况下，容器能够容纳水（表示为蓝色部分）的最大值为 49。
```
---

![img](https://aliyun-lc-upload.oss-cn-hangzhou.aliyuncs.com/aliyun-lc-upload/uploads/2018/07/25/question_11.jpg)

---

```js
// 双指针核心思路：min(L,R) * (R-L)
const maxArea = (height) => {
  let L = 0, R = height.length - 1;
  let res = 0;

  while (L < R) {
    const sum = Math.min(height[L], height[R]) * (R - L);
    res = Math.max(res, sum);
    height[L] > height[R] ? R-- : L++;
  }
  return res;
}

// console.log(maxArea([1,8,6,2,5,4,8,3,7]));
```