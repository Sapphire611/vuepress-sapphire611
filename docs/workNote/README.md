---
title: linux 部署实战
date: 2022-7-19
categories:
  - deploy
tags:
  - linux
  - nginx
sidebar: "auto"
publish: true
showSponsor: true
---

## nginx 部署记录

``` shell
apt install nginx
# nginx -v
# nginx version: nginx/1.18.0 (Ubuntu) 老版本
cd /etc/nginx/ # nginx目录在此
```

![img](/img/ls.png)

> 查看 主配置文件 nginx.conf

``` shell
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
        worker_connections 768;
        # multi_accept on;
}

http {
        # 省略...

        ##
        # Virtual Host Configs
        ##

        include /etc/nginx/conf.d/*.conf; # 这里有两个include目录,第一个是conf.d下的所有conf配置文件
        include /etc/nginx/sites-enabled/*; # 第二个是sites-enabled 下的所有文件
}
```

---

> 进入 conf.d 目录创建自定义配置文件

``` shell
cd conf.d/
touch default.conf # touch 是新建文件
vi default.conf
```

``` shell
# default.conf
server {
        listen 80;
        server_name  _;
        root /app/health;

        location / {
                proxy_pass http://127.0.0.1:19008/;
        }
    }
```

``` shell
nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
```

## space365 项目部署记录

1. 拉取项目，切换到对应分支

2. 运行打包命令，输出到/dist 目录下

```shell
yarn build
```

3. 配置 ecosystem.config.js ，pm2 可以配置文件与项目分离，并采用 cluster 模式部署

```js
module.exports = {
  apps: {
    name: "s365-health",
    script: "bundle.js",
    instances: 1,
    instance_var: "INSTANCE_ID",
    autorestart: true,
    max_restarts: 10,
    restartDelay: 3000,
    watch: false,
    ignore_watch: ["node_modules", "uploads", "logs"],
    max_memory_restart: "3G",
    env: {
      DEBUG: "app*",
      NODE_ENV: "production",
      NODE_CONFIG_DIR: "/etc/s365-health" // 配置文件需要部署/复制到这个目录
    }
  }
};
```

4. 回到项目目录,进入/dist目录

> space365总是运行webpack打包后的文件...

```
pm2 list

┌─────┬────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name           │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ index          │ default     │ 1.0.0   │ fork    │ 902      │ 24D    │ 0    │ online    │ 0%       │ 78.2mb   │ root     │ disabled │
│ 1   │ s365-health    │ default     │ 1.0.0   │ cluster │ 1750132  │ 47h    │ 30   │ online    │ 0%       │ 143.9mb  │ root     │ disabled │
└─────┴────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘

pm2 start/restart 1  // cluster 部署
pm2 start src/index.js // fork 部署
```


## docker 本地打包并推送到阿里云

### 1. 项目根目录下准备Dockerfile

``` dockerfile
# Dockerfile demo

FROM node:lts

ENV NODE_ENV=production \
    PORT=19008

WORKDIR /backend

COPY ./dist /backend

RUN npm install yarn --registry https://registry.npm.taobao.org/; \
    yarn --registry https://registry.npm.taobao.org/

EXPOSE $PORT
CMD [ "node", "./bundle.js" ]
```

### 2.  docker build

[Docker Buildx | Docker Documentation](https://docs.docker.com/buildx/working-with-buildx/)
``` shell
gulp build # 先自己把项目打包了

# 然后用 docker 打包成本地镜像
docker buildx build --platform linux/amd64 -t s365-bytedance-apps:x.x.x .
# docker buildx build --platform linux/amd64 -t registry.cn-shanghai.aliyuncs.com/space365/s365-bytedance-apps:x.x.x .

docker images # 打包好了，本地就能看到
```



### 3. 本地镜像 push 到云端

``` shell
docker login registry.cn-shanghai.aliyuncs.com --username xxxxx --password xxxxx

docker tag [imageId] registry.cn-shanghai.aliyuncs.com/xxx/xxx-xxx:x.x.x

docker push registry.cn-shanghai.aliyuncs.com/xxx/xxx-xxx:x.x.x

docker save -o  s365-xxx-backend.tar  s365-xxx-backend:x.x.x

```

[Linux scp命令](https://www.runoob.com/linux/linux-comm-scp.html)

> scp 是 secure copy 的缩写, scp 是 linux 系统下基于 ssh 登陆进行安全的远程文件拷贝命令。

``` shell
# scp [可选参数] file_source file_target 
scp -r docker-deploy root@[ip]:/home/xxx/
cd docker-deploy
docker-compose up -d

# k8s操作,注意缩进2个空格
kubectl apply -f xxx.yaml
kubectl -n space365-xxx get configmap

kubectl apply -f xxx.yaml
# 命名空间中创建仓库key，并在deployment.yaml中加入
imagePullSecrets:
        - name: xxx

kubectl -n xxx-xxx get pod
kubectl -n xxx-xxx describe pod backend-xxxxx-xxxx
kubectl delete -f deployment.yaml
kubectl -n xxx-xxx logs -f backend-xxxxx-xxxx
kubectl replace --force -f deployment.yaml
```


## docker 部署实战

> 2022/7/18 Work Note From Cwj

::: right
Goto his blog >> [CanMusic](https://github.com/CanMusic/me/issues)
:::

::: tip
前置条件：本地已docker build，docker login后推送到云端
:::
#### 1. 进入到 docker-compose.yaml的目录下

``` shell
root@space-node2:/home/xxxxxx/space365 ls
app.conf  conf/  docker-compose.yaml  log/  nginx.conf

root@space-node2:/home/xxxxxx/space365 vi docker-compose.yaml 
```

#### 2. 停止原有容器
``` shell
root@space-node2:/home/xxxxxx/space365 docker compose stop health

[+] Running 1/1
 ⠿ Container health2  Stopped                                                                                                                                                                        0.4s

root@space-node2:/home/xxxxxx/space365 docker compose stop health1

[+] Running 1/1
 ⠿ Container health3  Stopped                                                                                                                                                                        0.3s

root@space-node2:/home/xxxxxx/space365 docker compose rm -f health

Going to remove health2
[+] Running 1/0
 ⠿ Container health2  Removed                                                                                                                                                                        0.0s

root@space-node2:/home/xxxxxx/space365 docker compose rm -f health1
Going to remove health3
[+] Running 1/0
 ⠿ Container health3  Removed                                                                                                                                                                        0.0s
```

#### 3. 更新容器

``` shell
root@space-node2:/home/shgbit/space365# docker compose up health -d

[+] Running 13/13
 ⠿ health           complete                                                                                                                                                                     14.1s

[+] Running 1/1
 ⠿ Container health2  Started                                                                                                                                                                        0.9s
 
root@space-node2:/home/shgbit/space365# docker compose up health1 -d
[+] Running 1/1
 ⠿ Container health3  Started                                                                                                                                                                        0.4s
root@space-node2:/home/shgbit/space365# docker ps 

```