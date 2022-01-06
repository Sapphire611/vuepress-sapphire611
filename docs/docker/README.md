---
title: Docker 相关
date: 2021-12-10
categories:
  - Backend
tags:
  - docker
sidebar: "auto"
publish: true
---

## 安装相关

[Docker Desktop for Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows)

[【Windows】旧版 WSL 的手动安装步骤（不装 Docker Desktop 会启动失败）](https://docs.microsoft.com/zh-cn/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package)

## 常用后台服务挂载命令

### Redis

```shell
docker run -d --name redis -p 6379:6379 --restart always redis
```

[docker 安装 redis 并配置 redis.conf(默认没有)](https://blog.csdn.net/huanglu0314/article/details/112244022?spm=1001.2101.3001.6650.2&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-2.no_search_link&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-2.no_search_link&utm_relevant_index=5)

### Rabbitmq

```shell
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 --restart always rabbitmq
```

### Zookeeper

```shell
docker run --name zookeeper -d -p 2181:2181 --restart always zookeeper
```

### Emqx

```shell
docker run -d --name emqx -p 1883:1883 -p 8081:8081 -p 8083:8083 -p 8883:8883 -p 8084:8084 -p 18083:18083 --restart always emqx/emqx:latest
```

### Mongodb

```shell
docker run --name mongo -d -p 27017:27017 -v /Users/[YourUsername]/db:/data/db --restart always mongo
```
