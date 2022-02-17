---
title: 2022-2-17 Work Note
date: 2022-2-17
categories:
  - deploy
tags:
  - linux
  - nginx
sidebar: "auto"
publish: true
showSponsor: true
---

## 2/17 Work Note

今天被 cwj 秀了一脸，特此记录

::: right
Goto his blog >> [CanMusic](https://github.com/CanMusic/me/issues)
:::
---

## Ubantu 部署实战

```shell
apt install nginx
# nginx -v
# nginx version: nginx/1.18.0 (Ubuntu) 老版本
cd /etc/nginx/ # nginx目录在此
```

![img](/img/ls.png)

> 查看 主配置文件 nginx.conf

```shell
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

```shell
cd conf.d/
touch default.conf # touch 是新建文件
vi default.conf
```

```shell
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

// 230