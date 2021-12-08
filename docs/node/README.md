# Node 相关

## Node-gyp

[安装node-gyp](https://zhuanlan.zhihu.com/p/164543031)

> node-gyp，是由于node程序中需要调用一些其他语言编写的工具 甚至是dll，需要先编译一下，否则就会有跨平台的问题，例如在windows上运行的软件copy到mac上就不能用了，但是如果源码支持，编译一下，在mac上还是可以用的。node-gyp在较新的Node版本中都是自带的（平台相关），用来编译原生C++模块。

[node-gyp编译问题](https://www.cnblogs.com/fanqisoft/p/13171657.html)

> 需要安装Python，Visual Studio 并安装对应包，并且指定VS版本

```
npm config set msvs_version 2019

yarn config set msvs_version 2019

npm config set msbuild_path "C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\MSBuild\Current\Bin\MSBuild.exe"

yarn config set msbuild_path "C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\MSBuild\Current\Bin\MSBuild.exe"
```

[CMake - 编译需要这个，否则出现乱码错误](https://cmake.org/)