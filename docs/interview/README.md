# Interview

## Js

### 预编译

> Q: f函数的输出？

``` js
function f(a, c) {
    console.log(a); // [Function: a]
    var a = 123;
    console.log(a); // 123
    console.log(c); // [Function: c]

    function a() { };

    if (false) {
        var d = 678;
    }

    console.log(d); // undefined
    console.log(b); // undefined
    var b = function b() { };
    console.log(b); // [Function: b]

    function c() { };
    console.log(c); // [Function: c]
}

f(1, 2);

```

> 执行顺序如下，前4步属于预编译范围

``` js
1. js创建AO对象  
2. 找形参和实参的声明，赋值为undefined  >> 发现 a c d b 四个对象，均为undefined
3. 实参和形参相统一 >> a = 1 , c = 2
4. 找函数声明，覆盖变量声明 >> a = function a() { }; c = function c() { };

------

5. 开始走函数中的正常流程
```