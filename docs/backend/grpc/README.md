---
title: node grpc 最小实现 
date: 2023-1-4
categories:
  - backend
tags:
  - node
  - grpc
sidebar: "auto"
publish: true
showSponsor: true
---

## node grpc 最小实现 

[给大家演示下使用Node.js实现grpc服务端和客户端的](https://www.bilibili.com/video/BV17K4y1t753/?spm_id_from=333.337.search-card.all.click)

::: right
来自 [Sapphire611](http://www.sapphire611.com)
:::

### hello.proto

```protobuf
syntax = "proto3";

package helloworld;

service Hello {
    rpc sayHello (HelloReq) returns (HelloResp) {};
}

message HelloReq {
    string name = 1;
    int32 age = 2;
}

message HelloResp {
    string message = 1;
    int32 code = 2;
}
```
### server.js

```js
const grpc = require('grpc')

const protoLoader = require('@grpc/proto-loader')

const packageDefinition = protoLoader.loadSync('hello.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

// grpc 加载包（package helloworld）
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld

// 创建 server
const server = new grpc.Server()

// 添加服务，我们的服务名在 hello.proto 文件中定义的 service Hello
server.addService(hello_proto.Hello.service, {
    // 实现 sayHello 方法（是不是有点接口 interface 实现的味道）
    sayHello (call, cb) {
        try {
             /* call可以用来获取请求信息 */
                let { name, age } = call.request
             /* callback 可以用来向返回客户端信息，按照 proto「message HelloResp」中的约定返回 */
             cb && cb(null, {
                message: `用户名：${name}，年龄是：${age}`,
                code: 200
             })              
        } catch (err) {
            console.log('服务器出错', err)        
        }                                                      
    }
})

// 启动服务，设置端口
server.bind('127.0.0.1:12345', grpc.ServerCredentials.createInsecure())
server.start()
console.log('server start 127.0.0.1:12345...')
```


### client.js

```js
const grpc = require('grpc')

const protoLoader = require('@grpc/proto-loader')

const packageDefinition = protoLoader.loadSync('hello.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})

// grpc 加载包
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld

// ---------
console.log('init client')

// 创建客户端，连接 Hello 服务
const client = new hello_proto.Hello('127.0.0.1:12345', grpc.credentials.createInsecure())

// 调用 sayHello 方法
client.sayHello({
    // 按照 proto「message HelloReq」中的约定传参
    name: 'Sapphire611', age: 25
}, (err, response) => {
    if (err) return console.log(err)
    // 按照 proto「message HelloResp」中的约定返回
    const { message, code } = response
    // 服务端的返回信息
    console.log(`message = ${message}, code = ${code}`)
})
```

