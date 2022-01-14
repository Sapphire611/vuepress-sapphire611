---
title: LeetCode (JS)
date: 2022-1-14
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

### 4. 寻找两个正序数组的中位数

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
    let l = r = i; // 左右指针定位至i

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

# 6.Z
```js
var convert = function (s, numRows) {

  if (s.length < numRows || numRows == 1) {
    return s;
  }
  let arr = new Array(numRows).fill('');
  let num = 0;
  let plus = true;
  for (let i = 0; i < s.length; i++) {

    arr[num] += s[i];
    if (plus == true) {
      num += 1;
    } else {
      num -= 1;
    }

    if (num == 0) {
      plus = true;
    }
    if (num == numRows - 1) {
      plus = false;
    }
  }

  return arr.join('')
};

console.log(convert("PAHNAPLSIIGYIR", 3));
```

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
示例 2：

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
