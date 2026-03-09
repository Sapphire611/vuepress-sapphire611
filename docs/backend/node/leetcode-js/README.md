---
title: LeetCode (JS)
date: 2026-3-9
categories:
  - Algorithm
tags:
  - leetcode
  - algorithm
  - javascript
sidebar: 'auto'
publish: true
---

## Leetcode 做题记录

## 1. 两数之和

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
  let list = new ListNode('0');
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

## 3. 无重复字符的最长子串

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
  return len % 2 ? arr[Math.floor(len / 2)] : (arr[len / 2] + arr[len / 2 - 1]) / 2;
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
  let res = '';

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

  let arr = new Array(numRows).fill('');
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

  return arr.join('');
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
  const res = parseInt(Math.abs(x).toString().split('').reverse().join(''));

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
// 用魔法打败魔法!
```

---

## 11. 盛最多水的容器

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
  let L = 0,
    R = height.length - 1;
  let res = 0;

  while (L < R) {
    const sum = Math.min(height[L], height[R]) * (R - L);
    res = Math.max(res, sum);
    height[L] > height[R] ? R-- : L++;
  }
  return res;
};

// console.log(maxArea([1,8,6,2,5,4,8,3,7]));
```

### 12. 整数转罗马数字

```js
罗马数字包含以下七种字符： I， V， X， L，C，D 和 M。

字符          数值
I             1
V             5
X             10
L             50
C             100
D             500
M             1000

例如， 罗马数字 2 写做 II ，即为两个并列的 1。12 写做 XII ，即为 X + II 。 27 写做  XXVII, 即为 XX + V + II 。

通常情况下，罗马数字中小的数字在大的数字的右边。
但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，所表示的数等于大数 5 减小数 1 得到的数值 4 。
同样地，数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：

I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。
X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。
C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。
给你一个整数，将其转为罗马数字。
```

```js
const intToRoman = (num) => {
  const map = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };

  let res = '';

  const keys = Object.keys(map);

  for (const key of keys) {
    while (num >= map[key]) {
      res += key;
      num -= map[key];
    }
  }

  return res;
};

// console.log(intToRoman(1994));
```

### 13. 罗马数字转整数

```js
罗马数字包含以下七种字符: I， V， X， L，C，D 和 M。

...参考12题的题目😄
```

> 方法一 : 高端截取

```js
/**
 * @param {string} s
 * @return {number}
 */
const romanToInt = (s) => {
  const map = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };

  let sum = 0;

  for (let i = 0; i < s.length; i++) {
    // sum += cur 后面的 比 cur 罗马值大 ？ 后 - cur , i+1 : cur (cur = 当前值)
    sum += map[s[i]] < map[s[i + 1]] ? map[s[i + 1]] - map[s[i++]] : map[s[i]];
  }

  return sum;
};

// console.log(romanToInt("MCMXCIV"))
```

> 方案二 : 暴力截取

```js
/**
 * @param {string} s
 * @return {number}
 */
const romanToInt = (s) => {
  const map = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };

  let sum = 0;

  const keys = Object.keys(map);

  for (const key of keys) {
    if (s.leftsWith(key)) {
      sum += map[key];
      s = s.slice(key.length);
    }
  }

  return sum;
};
```

---

### 14. 最长公共前缀

```js
编写一个函数来查找字符串数组中的最长公共前缀。

如果不存在公共前缀，返回空字符串 ""。

示例 1：
输入：strs = ["flower","flow","flight"]
输出："fl"

示例 2：
输入：strs = ["dog","racecar","car"]
输出：""
解释：输入不存在公共前缀。
```

```js
/**
 * @param {string[]} strs
 * @return {string}
 */
const longestCommonPrefix = (strs) => {
  if (strs.length < 1) return strs[0];

  strs.sort();

  for (var i = 0; i < strs[0].length; i++) {
    if (strs[0].charAt(i) !== strs[strs.length - 1].charAt(i)) break;
  }

  if (i < 1) return '';

  return strs[0].substring(0, i);
};
```

### 15. 三数之和

```js
给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。

示例 1：
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]

示例 2：
输入：nums = []
输出：[]

示例 3：
输入：nums = [0]
输出：[]
```

```js
const threeSum = (nums) => {
  const res = [];
  const len = nums.length;

  if (nums == null || len < 3) return res; // 优化1
  nums.sort((a, b) => a - b);

  for (let i = 0; i < len; i++) {
    if (nums[i] > 0) break; // 优化2
    if (i > 0 && nums[i] == nums[i - 1]) continue; //去重1

    let L = i + 1;
    let R = len - 1;
    while (L < R) {
      const sum = nums[i] + nums[L] + nums[R];
      if (sum === 0) {
        res.push([nums[i], nums[L], nums[R]]);
        while (L < R && nums[L] == nums[L + 1]) L++; //去重2
        while (L < R && nums[R] == nums[R - 1]) R--; //去重3
        L++; // 获得一个和为0的结果后，一定是两个数字一起变化的...
        R--;
      }
      if (sum < 0) L++;
      if (sum > 0) R--;
    }
  }
  return res;
};

// console.log(threeSum([-1, 0, 1, 2, -1, -4]));
```

### 16. 最接近的三数之和

```js
给你一个长度为 n 的整数数组 nums 和 一个目标值 target。请你从 nums 中选出三个整数，使它们的和与 target 最接近。

返回这三个数的和。

假定每组输入只存在恰好一个解。

示例 1：

输入：nums = [-1,2,1,-4], target = 1
输出：2
解释：与 target 最接近的和是 2 (-1 + 2 + 1 = 2) 。

示例 2：
输入：nums = [0,0,0], target = 1
输出：0
```

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
const threeSumClosest = (nums, target) => {
  let res = nums[0] + nums[1] + nums[2];
  nums = nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length - 2; i++) {
    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      let sum = nums[i] + nums[left] + nums[right];
      if (Math.abs(sum - target) < Math.abs(res - target)) {
        res = sum;
      }
      if (sum > target) right--;
      if (sum < target) left++;
      if (sum == target) return target;
    }
  }
  return res;
};
```

### 17. 电话号码的字母组合

```js
给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。

给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。
```

```js
//输入：digits = "23"
//输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
const letterCombinations = (digits) => {
  if (digits.length == 0) return [];
  const res = [];
  const map = {
    //建立电话号码和字母的映射关系
    2: 'abc',
    3: 'def',
    4: 'ghi',
    5: 'jkl',
    6: 'mno',
    7: 'pqrs',
    8: 'tuv',
    9: 'wxyz',
  };

  const dfs = (curStr, i) => {
    //curStr是递归每一层的字符串，i是扫描的指针
    if (i > digits.length - 1) {
      //边界条件，递归的出口
      res.push(curStr); //其中一个分支的解推入res
      return; //结束递归分支，进入另一个分支
    }
    const letters = map[digits[i]]; //取出数字对应的字母
    for (const l of letters) {
      //进入不同字母的分支
      dfs(curStr + l, i + 1); //参数传入新的字符串，i右移，继续递归
    }
  };
  dfs('', 0); // 递归入口，传入空字符串，i初始为0的位置
  return res;
};
```

---

### 18. 四数之和

```js
给你一个由 n 个整数组成的数组 nums ，和一个目标值 target
请你找出并返回满足下述全部条件且不重复的四元组 [nums[a], nums[b], nums[c], nums[d]]
（若两个四元组元素一一对应，则认为两个四元组重复）：

0 <= a, b, c, d < n
a、b、c 和 d 互不相同
nums[a] + nums[b] + nums[c] + nums[d] == target
你可以按 任意顺序 返回答案 。


示例 1：

输入：nums = [1,0,-1,0,-2,2], target = 0
输出：[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]
示例 2：

输入：nums = [2,2,2,2,2], target = 8
输出：[[2,2,2,2]]
```

```js
const fourSum = (nums, target) => {
  const len = nums.length;

  if (len < 4) return [];

  nums.sort((a, b) => a - b); // sort

  let res = [];

  for (let i = 0; i < len - 3; i++) {
    // 定第一位数字
    if (i > 0 && nums[i] === nums[i - 1]) continue; // 去重1
    if (nums[i] + nums[i + 1] + nums[i + 2] + nums[i + 3] > target) break; // 不可能1
    if (nums[i] + nums[len - 1] + nums[len - 2] + nums[len - 3] < target) continue; // 跳过1

    for (let j = i + 1; j < len - 2; j++) {
      // 定第二位数字
      if (j > i + 1 && nums[j] === nums[j - 1]) continue; // 去重2
      if (nums[i] + nums[j] + nums[j + 1] + nums[j + 2] > target) break; // 不可能2
      if (nums[i] + nums[j] + nums[len - 1] + nums[len - 2] < target) continue; // 跳过2

      let L = j + 1,
        R = len - 1; // 定三、四位
      while (L < R) {
        let sum = nums[i] + nums[j] + nums[L] + nums[R]; // 四位全部确定，开始计算结果
        if (sum === target) {
          res.push([nums[i], nums[j], nums[L], nums[R]]); // correct
          while (L < R && nums[L] === nums[L + 1]) L++; // 左去重3
          while (L < R && nums[R] === nums[R - 1]) R--; // 右去重4
          L++;
          R--; // 双指针向中间推进，寻找剩下的结果
        }

        if (sum > target) {
          // sum大了，右指针推进
          while (L < R) if (nums[R] !== nums[--R]) break;
        }

        if (sum < target) {
          // sum大了，左指针推进
          while (L < R) if (nums[L] !== nums[++L]) break;
        }
      }
    }
  }

  return res;
};
// console.log(fourSum([1, 0, -1, 0, -2, 2], 0));
```

## 20. 有效的括号

```ts
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
每个右括号都有一个对应的相同类型的左括号。


示例 1：
输入：s = "()"
输出：true

示例 2：
输入：s = "()[]{}"
输出：true

示例 3：
输入：s = "(]"
输出：false

提示：
1 <= s.length <= 104
s 仅由括号 '()[]{}' 组成
```

```ts
const isValid = (s: string) => {
  const map: Map<string, string> = new Map();
  map.set('}', '{');
  map.set(')', '(');
  map.set(']', '[');

  let res: Array<string> = [];
  for (let i = 0; i < s.length; i++) {
    if (['(', '[', '{'].includes(s[i])) {
      res.push(s[i]);
    } else {
      if (!res.length) return false;
      if (res[res.length - 1] !== map.get(s[i])) return false;
      res.pop();
    }
  }

  return res.length === 0;
};

console.log(isValid('([)'));
```

## 33. 搜索旋转排序数组

```js
整数数组 nums 按升序排列，数组中的值 互不相同 。

在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。例如， [0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2] 。

给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。

你必须设计一个时间复杂度为 O(log n) 的算法解决此问题。



示例 1：
输入：nums = [4,5,6,7,0,1,2], target = 0
输出：4

示例 2：
输入：nums = [4,5,6,7,0,1,2], target = 3
输出：-1

示例 3：
输入：nums = [1], target = 0
输出：-1


提示：

1 <= nums.length <= 5000
-104 <= nums[i] <= 104
nums 中的每个值都 独一无二
题目数据保证 nums 在预先未知的某个下标上进行了旋转
-104 <= target <= 104
```

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
const search = (nums, target) => {
  // return nums.indexOf(target);
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    let mid = (left + right) >> 1; // /2

    if (nums[mid] === target) return mid; // goal

    // 中位数小于右指针数，右边是有序的
    if (nums[mid] < nums[right]) {
      // 判断target是否在(mid, right]之间
      if (nums[mid] < target && target <= nums[right]) left = mid + 1; // 如果在,则中间数右移,即left增大
      else right = mid - 1; // 如果不在,则中间数左移,即right减小
    } else {
      // 否则,左半边是有序的
      // 判断target是否在[left, mid)之间
      if (nums[left] <= target && target < nums[mid]) right = mid - 1; // 如果在，则中间数左移,即right减小
      else left = mid + 1; // 如果不在，则中间数右移即left增大
    }
  }

  return -1;
};
```

---
## 63. 不同路径 II

```js
给定一个 m x n 的整数数组 grid。一个机器人初始位于 左上角（即 grid[0][0]）。机器人尝试移动到 右下角（即 grid[m - 1][n - 1]）。机器人每次只能向下或者向右移动一步。

网格中的障碍物和空位置分别用 1 和 0 来表示。机器人的移动路径中不能包含 任何 有障碍物的方格。

返回机器人能够到达右下角的不同路径数量。

示例 1：

输入：obstacleGrid = [[0,0,0],[0,1,0],[0,0,0]]
输出：2
解释：3x3 网格的正中间有一个障碍物。
从左上角到右下角一共有 2 条不同的路径：
1. 向右 -> 向右 -> 向下 -> 向下
2. 向下 -> 向下 -> 向右 -> 向右

示例 2：

输入：obstacleGrid = [[0,1],[0,0]]
输出：1
```

```js
/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */

// 解题思路：
//   - 使用二维 DP 数组，dp[i][j] 表示到达位置 (i,j) 的不同路径数量
//   - 如果当前格子是障碍物（值为1），则路径数为0
//   - 如果当前格子无障碍物，则路径数 = 上方格子路径数 + 左方格子路径数

var uniquePathsWithObstacles = function (obstacleGrid) {
  const m = obstacleGrid.length;
  const n = obstacleGrid[0].length;
  const dp = Array(m)
    .fill()
    .map(() => Array(n).fill(0));

  // 初始位置有障碍物，则无法到达
  dp[0][0] = obstacleGrid[0][0] === 0 ? 1 : 0;

  // 初始化第一列
  for (let i = 1; i < m; i++) {
    dp[i][0] = obstacleGrid[i][0] === 0 ? dp[i - 1][0] : 0;
  }

  // 初始化第一行
  for (let j = 1; j < n; j++) {
    dp[0][j] = obstacleGrid[0][j] === 0 ? dp[0][j - 1] : 0;
  }

  // 动态规划递推
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      if (obstacleGrid[i][j] === 0) {
        // 当前位置无障碍物，路径数 = 上方路径数 + 左方路径数
        dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
      }
      // 有障碍物的位置 dp[i][j] 保持为 0
    }
  }

  return dp[m - 1][n - 1];
};

// console.log(uniquePathsWithObstacles([[0, 0, 0], [0, 1, 0], [0, 0, 0]]));
```

---

## 70. 爬楼梯

```js
假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？



示例 1：

输入：n = 2
输出：2
解释：有两种方法可以爬到楼顶。
1. 1 阶 + 1 阶
2. 2 阶
示例 2：

输入：n = 3
输出：3
解释：有三种方法可以爬到楼顶。
1. 1 阶 + 1 阶 + 1 阶
2. 1 阶 + 2 阶
3. 2 阶 + 1 阶
```

```js
// const f = (n) => {
//     if (n == 0) return 1;
//     if (n == 1) return 1;
//     if (n == 2) return 2;
//     return f(n - 1) + f(n - 2)
// }

// console.log(f(2))

/**
 * @param {number} n
 * @return {number}
 */

const map = new Map();
map.set(0, 1);
map.set(1, 1);
map.set(2, 2);

var climbStairs = function (n) {
  const result = map.get(n);
  if (!result) {
    // recursion answer
    const newValue = climbStairs(n - 1) + climbStairs(n - 2);
    // set result in map to save times
    map.set(n, newValue);
    // callback
    return newValue;
  } else {
    // got result
    return result;
  }
};
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
    if (num[0] === '0' && i > 1) return false; // “0235813” = false

    for (let j = i + 1; j < num.length; j++) {
      // j - i 长度有限制，不可能超数组一半
      if ((num[i] === '0' && j - i > 1) || j - i > num.length / 2) break;
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
  return remain.leftsWith(num1 + num2) && recursionJudge(remain.substring((num1 + num2 + '').length), num2, num1 + num2);
};

// console.log(isAdditiveNumber("000"));
```

---

## 665. 非递减数列

给你一个长度为 n 的整数数组 nums ，请你判断在 最多 改变 1 个元素的情况下，该数组能否变成一个非递减数列。

我们是这样定义一个非递减数列的： 对于数组中任意的 i (0 <= i <= n-2)，总满足 nums[i] <= nums[i + 1]。

#### 示例 1:

```
输入: nums = [4,2,3]
输出: true
解释: 你可以通过把第一个 4 变成 1 来使得它成为一个非递减数列。
```

#### 示例 2:

```
输入: nums = [4,2,1]
输出: false
解释: 你不能在只改变一个元素的情况下将其变为非递减数列。
```

---

```js
var checkPossibility = function (nums) {
  const length = nums.length;
  let count = 0;
  for (let i = 0; i < length; i++) {
    if (nums[i] > nums[i + 1]) {
      count++;
      if (count > 1) return false;
      if (i > 0 && nums[i - 1] > nums[i + 1]) {
        // 特殊例子：// 3,[4], 2, 3落在4的位置时，nums[i-1] > nums[i+1],

        nums[i + 1] = nums[i]; // 尝试将i+1位置的数变成i位置的数
      }
    }
  }

  return true;
};
```

---

### 867. 转置矩阵

```js
给你一个二维整数数组 matrix， 返回 matrix 的 转置矩阵 。

矩阵的 转置 是指将矩阵的主对角线翻转，交换矩阵的行索引与列索引。

示例 1：

输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[[1,4,7],[2,5,8],[3,6,9]]
示例 2：

输入：matrix = [[1,2,3],[4,5,6]]
输出：[[1,4],[2,5],[3,6]]


提示：

m == matrix.length
n == matrix[i].length
1 <= m, n <= 1000
1 <= m * n <= 105
-109 <= matrix[i][j] <= 109
```

```js
/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var transpose = function (matrix) {
  const arr = matrix;
  const row = arr.length; // 3
  const col = arr[0].length; // 4
  // console.log({row,col})

  const result = [];
  for (let i = 0; i < col; i++) {
    let temp = [];
    for (let j = 0; j < row; j++) {
      // console.log(arr[j][i])
      temp.push(arr[j][i]);
    }
    // console.log(temp)
    result.push(temp);
  }
  // console.log(result);
  return result;
};
```
