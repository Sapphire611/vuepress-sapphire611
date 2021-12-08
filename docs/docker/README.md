# Docker 

## 安装相关
[Docker Desktop for Windows](https://hub.docker.com/editions/community/docker-ce-desktop-windows)

[【Windows】旧版 WSL 的手动安装步骤](https://docs.microsoft.com/zh-cn/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package)

## 常用后台服务挂载命令

### Redis

```
docker run -d --name redis -p 6379:6379 --restart always redis
```

### Rabbitmq

```
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 --restart always rabbitmq
```

### Zookeeper

```
docker run --name zookeeper -d -p 2181:2181 --restart always zookeeper
```

### Emqx

```
docker run -d --name emqx -p 1883:1883 -p 8081:8081 -p 8083:8083 -p 8883:8883 -p 8084:8084 -p 18083:18083 --restart always emqx/emqx:latest
```
### Mongodb

```
docker run --name mongo -d -p 27017:27017 -v /Users/[YourUsername]/db:/data/db --restart always mongo
```
