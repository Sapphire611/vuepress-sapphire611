---
title: Docker 相关
date: 2021-12-10
categories:
  - Deploy
tags:
  - docker
sidebar: "auto"
publish: true
---

## 安装相关

[Docker Desktop for Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows)

[史上最全（全平台）docker安装方法](https://zhuanlan.zhihu.com/p/54147784#:~:text=windows%E7%89%88docker%E9%9C%80%E8%A6%81Microsoft%20Hyper-V%E7%9A%84%E6%94%AF%E6%8C%81%EF%BC%8C%E5%8D%B3windows%E5%86%85%E7%BD%AE%E7%9A%84%E8%99%9A%E6%8B%9F%E6%9C%BA%E5%BC%95%E6%93%8E%EF%BC%8C%E4%BB%8Ewin10%E5%BC%80%E5%A7%8B%E6%94%AF%E6%8C%81%EF%BC%8Cdocker%E5%9C%A8%E5%AE%89%E8%A3%85%E7%9A%84%E6%97%B6%E5%80%99%E4%BC%9A%E8%87%AA%E5%8A%A8%E5%BC%80%E5%90%AF%EF%BC%8C%E9%9C%80%E8%A6%81%E9%87%8D%E5%90%AF%E7%94%B5%E8%84%91%E3%80%82%20%E5%8F%8C%E5%87%BB%20Docker,for%20Windows%20Installer.exe%20%E7%84%B6%E5%90%8E%E4%B8%80%E8%B7%AF%E4%B8%8B%E4%B8%80%E6%AD%A5%EF%BC%8C%E5%AE%89%E8%A3%85%E5%AE%8C%E6%88%90%EF%BC%81%20%E5%AE%89%E8%A3%85%E5%AE%8C%E6%88%90%E5%90%8Edocker%E4%B8%8D%E4%BC%9A%E8%87%AA%E5%8A%A8%E8%BF%90%E8%A1%8C%EF%BC%8C%E6%90%9C%E7%B4%A2docker%E7%82%B9%E5%87%BB%E8%BF%90%E8%A1%8C%E3%80%82)

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
docker run -d --restart=always --name rabbitmq_management -p 15672:15672 -p 5672:5672 -e RABBITMQ_DEFAULT_USER=guest -e RABBITMQ_DEFAULT_PASS=guest rabbitmq:management # 这个可以进ui界面
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

## Docker 基本命令

[Docker基础篇 - （二）Docker的常用命令](https://blog.csdn.net/qq_45408390/article/details/120264264)

[docker | Docker Documentation](https://docs.docker.com/engine/reference/commandline/docker/)

```shell
docker version    # 显示docker的版本信息。
docker info       # 显示docker的系统信息，包括镜像和容器的数量
docker [命令] --help # 帮助命令

docker images # 查看所有镜像
docker search [镜像名称] # 搜索镜像
docker pull [镜像名称] # 下载镜像
docker rmi [镜像名称] # 删除镜像
```

```shell
##### 以下是容器运行（基于镜像）命令，先有镜像才有容器
docker run [可选参数] image

###### 参数说明
--name = "Name"    容器名字  tomcat01，tomcat02,用来区分容器
-d                 后台方式运行
-it                使用交互方式运行，进入容器查看区分
-p                 指定容器的端口 -p 8080：8080
    -p ip:主机端口：容器端口
    -p 主机端口：容器端口(常用)
    -p 容器端口
    容器端口
-P                 随机指定端口
######

docker ps # 列出所有容器

```