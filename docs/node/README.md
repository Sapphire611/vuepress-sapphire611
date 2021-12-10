# Node 库相关

## Node-gyp

### Node-gyp 安装

[安装node-gyp](https://zhuanlan.zhihu.com/p/164543031)

[CMake - 编译需要这个，否则出现乱码错误](https://cmake.org/)

::: tip

node-gyp，是由于node程序中需要调用一些其他语言编写的工具，甚至是dll，需要先编译一下，否则就会有跨平台的问题。

例如在windows上运行的软件copy到mac上就不能用了，但是如果源码支持，编译一下，在mac上还是可以用的。

node-gyp在较新的Node版本中都是自带的（平台相关），用来编译原生C++模块。

:::

### Node-gyp 编译

[node-gyp编译问题](https://www.cnblogs.com/fanqisoft/p/13171657.html)

> 需要安装Python，Visual Studio 并安装对应包，并且指定VS版本

``` shell
npm config set msvs_version 2019

npm config set msbuild_path "C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\MSBuild\Current\Bin\MSBuild.exe"
```
## Multer

[multer - npm（用于文件上传的库）](https://www.npmjs.com/package/multer)

### Multer 安装
``` js
npm install --save multer
```

### Multer 使用方法

> 以中间件的形式放在路由中使用

``` js
const express = require('express')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express()

// 单个文件上传
app.post('/profile', upload.single('avatar'), function (req, res, next) {})

// 多个文件上传
app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {})

// 多组文件上传
app.post('/cool-profile', upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]), function (req, res, next) {})
```