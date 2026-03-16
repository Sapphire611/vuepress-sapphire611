---
title: Nginx 相关
date: 2026-03-16
categories:
  - Deploy
tags:
  - nginx
sidebar: 'auto'
publish: true
---

## 安装 & 启动

[Linux 下安装 Nginx](https://www.jianshu.com/p/9f2c162ac77c)

[Linux 安装 Nginx 详细教程](https://zhuanlan.zhihu.com/p/109257078)

> 进入 /usr/local/nginx/sbin，执行：

```
./nginx
```

## 什么是反向代理，如何配置？

proxy_pass 是 Nginx 实现反向代理的核心指令，它定义了 Nginx 在接收到客户端请求后，应该将这个请求转发给哪个内部服务器进行处理

> 修改主配置文件 /usr/local/nginx/conf/nginx.conf 中的 server{} 中的内容

```conf
# 内部转发到3000端口
server {
    listen 80;
    server_name example.com;

    location /api/ {
        # 将所有访问 http://example.com/api/ 的请求转发给本地的3000端口服务
        proxy_pass http://127.0.0.1:3000/;
    }
}
```

```conf
# 定义一个名为 backend 的服务器组
upstream backend {
    server 10.0.0.1:8080 weight=1;
    server 10.0.0.2:8080 weight=2; # weight 参数可以设置权重，值越高被分配的请求越多
}

server {
    listen 80;
    server_name example.com;

    location / {
        # 将请求转发到 backend 服务器组
        proxy_pass http://backend;
    }
}
```

## 什么是灰度发布 蓝绿部署？

> 灰度发布：强调的是流量的渐进式转移；蓝绿部署：强调的是环境的切换（蓝的指 UAT，绿的指生产环境）

#### 在绿环境上部署新版本，并进行充分的内部测试,测试通过后，在路由层（如负载均衡器 Nginx/Gateway）一键将流量从蓝色环境切换到绿色环境

#### 每次部署完成后，蓝和绿的角色会互换，这样才能循环利用两套环境。

```conf
events {
    worker_connections 1024;
}

http {
    # 定义两个后端环境
    upstream blue {
        server 192.168.1.10:8080;  # 老版本
    }

    upstream green {
        server 192.168.1.11:8080;  # 新版本
    }

    # 根据Cookie决定转发到哪
    server {
        listen 80;
        server_name localhost;

        location / {
            # 如果cookie里有version=gray，就去green环境
            if ($http_cookie ~* "version=gray") {
                set $backend "green";
            }

            # 默认去blue环境
            if ($backend = "") {
                set $backend "blue";
            }

            proxy_pass http://$backend;

            # 添加响应头，方便看当前是哪个环境
            add_header X-Upstream $backend;
        }
    }
}
```

### 如何重启 linux 命令

```bash
# /usr/local/nginx/sbin
./nginx -s reload

# 或者
kill -HUP 进程号
```

## 部署 HTTPS 访问 (Nginx)

> 前置工作：购买域名，完成基本 HTTP 访问，申请免费的 DV 证书并通过验证（具体参考各云服务商教程）

1. 下载证书，上传到你的服务器（你能找到就可以）
2. Nginx 重新装载 SSL 模块

[Nginx 解决配置 SSL 证书报错](https://www.jianshu.com/p/00b0f41274f9)

```shell
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
make
```

3. 进入 nginx 目录配置 nginx.conf (找不到可以 whereis nginx)

```shell
# HTTPS server
#

server {
       	listen       443 ssl;
       	server_name  yourDomain.com;

       	ssl_certificate      /root/server.pem; #你找的到就可以，注意这是绝对路径
       	ssl_certificate_key  /root/server.key;

       	ssl_session_cache    shared:SSL:1m; # 下面配置这些抄过去就可以
      	ssl_session_timeout  5m;

      	ssl_ciphers  ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
       	ssl_prefer_server_ciphers  on;
       	ssl_protocols TLSv1 TLSv1.1 TLSv1.2;

       	location / {
            	root   html;
            	index  index.html index.htm;
		        proxy_pass http://127.0.0.1:3000/; # 这一条是内部转发3000端口用的
       	}
    }

# HTTP server
# 配置 HTTPS重定向~
server{
     listen 80;
     server_name yourDomain.com;
     rewrite ^(.*)$ https://yourDomain.com;
}
```

4. 重启 nginx~
