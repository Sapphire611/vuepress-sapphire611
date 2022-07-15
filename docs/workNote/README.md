---
title: linux服务器下 nginx && pm2 部署记录
date: 2022-7-15
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

### nginx 部署记录

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

```shell
nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
```

### space365 项目部署记录

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