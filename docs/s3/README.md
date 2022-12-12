---
title: S3 调研
date: 2022-11-18
categories:
  - research
tags:
  - s3
sidebar: "auto"
publish: true
---

## 定义

> S3: Simple Storage Service 简单存储服务

> Amazon S3: 是一种面向 Internet 的存储服务,可以随时在 Web 上的任何位置存储和检索的任意大小的数据

> Minio： 可私有化部署的分布式文件存储空间， 包含与 Amazon S3 云存储服务兼容的 API 

---

## AmazonS3 Sdk 

[Amazon S3 Node.js 示例](https://docs.aws.amazon.com/zh_cn/sdk-for-javascript/v2/developer-guide/s3-node-examples.html)

[AWS S3(对象存储)基本操作](https://andyli.blog.csdn.net/article/details/80697920?spm=1001.2101.3001.6661.1&utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-1-80697920-blog-109810364.pc_relevant_vip_default&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-1-80697920-blog-109810364.pc_relevant_vip_default&utm_relevant_index=1)

### Code Demo 

```js
const AWS = require('aws-sdk');
AWS.config.update({ region: 'ap-northeast-1' });

const s3 = new AWS.S3({
    apiVersion: '2006-03-01', accessKeyId: 'AxxxxxxxxxxxxU',
    secretAccessKey: 'Bxxxxxxxxxxxn',
    endpoint: 'https://s3.ap-northeast-1.amazonaws.com'
});


const run = async () => {
    try {
        const results = await s3.listBuckets().promise();
        console.log(...results.Buckets);

        for (const each of results?.Buckets) {
            const response = await s3.listObjects({ Bucket: each.Name }).promise();
            console.log(response.Contents);
        }

    } catch (err) {
        console.error(err);
    }
};

run();
```
---

### Minio

> 理想状态是前端通过普通http上传下载到minio

[MiniO](http://docs.minio.org.cn/docs/)

``` bash
brew install minio/stable/minio
minio server /data
```

### 可兼容 aws-sdk 方式

``` js
const s3 = new AWS.S3({
    apiVersion: '2006-03-01', accessKeyId: 'Zjxxxxxxhrw', // 独立 accessKeyId
    secretAccessKey: 'XRHYgLxxxxxxSLHZC39MWW7',// 独立 secretAccessKey
    endpoint: 'http://127.0.0.1:9000', // 改成本地
    // endpoint: 'https://s3.ap-northeast-1.amazonaws.com'    
    s3ForcePathStyle: true, // append
    signatureVersion: 'v4' // append
});
```

### 通过 Minio HTTP 接口 上传文件

1. 抓包得到登录接口和上传接口，登录得到token，用token调用上传接口
   - [POST] form-data [filesize]:[file]

2. 通过SDK生成对应bucket和fileName的下载链接

> 能上传成功，但做不了其他的任何限制（文件类型/大小等...)

> 需要通过后端Server去做校验和限制，验证通过后调用上传接口