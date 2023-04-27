---
title: Nginx 相关
date: '2021-12-10'
categories:
 - Deploy
tags:
 - nginx
sidebar: 'auto'
publish: true
--- 

## 安装 & 启动

[Linux下安装Nginx](https://www.jianshu.com/p/9f2c162ac77c)

[Linux安装Nginx详细教程](https://zhuanlan.zhihu.com/p/109257078)

> 进入 /usr/local/nginx/sbin，执行：

```
./nginx
```

## 简易反向代理配置

> 修改主配置文件 /usr/local/nginx/conf/nginx.conf 中的 server{} 中的内容

```
# 内部转发到3000端口
location / {
     proxy_pass http://127.0.0.1:3000/; 
}
```
::: tip
记得要回到/usr/local/nginx/sbin中重启：

[linux如何重启nginx？](https://www.php.cn/nginx/423144.html#:~:text=linux%E9%87%8D%E5%90%AFnginx%E7%9A%84%E6%96%B9%E6%B3%95%EF%BC%9A%E8%BF%9B%E5%85%A5nginx%E5%8F%AF%E6%89%A7%E8%A1%8C%E7%9B%AE%E5%BD%95bin%E4%B8%8B%EF%BC%8C%E8%BE%93%E5%85%A5%E5%91%BD%E4%BB%A4.%2Fnginx%20-s,reload%E5%8D%B3%E5%8F%AF%E3%80%822%E3%80%81%E6%9F%A5%E6%89%BE%E5%BD%93%E5%89%8Dnginx%E8%BF%9B%E7%A8%8B%E5%8F%B7%EF%BC%8C%E7%84%B6%E5%90%8E%E8%BE%93%E5%85%A5%E5%91%BD%E4%BB%A4kill%20-HUP%20%E8%BF%9B%E7%A8%8B%E5%8F%B7%EF%BC%8C%E5%AE%9E%E7%8E%B0%E9%87%8D%E5%90%AFnginx%E6%9C%8D%E5%8A%A1%E3%80%82)

:::

```
./nginx -s reload
```

## 部署HTTPS访问 (Nginx)

> 前置工作：购买域名，完成基本HTTP访问，申请免费的DV证书并通过验证（具体参考各云服务商教程）

1. 下载证书，上传到你的服务器（你能找到就可以）
   
2. Nginx 重新装载SSL模块

[Nginx解决配置SSL证书报错](https://www.jianshu.com/p/00b0f41274f9)

``` shell
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
make
```

3. 进入nginx目录配置nginx.conf (找不到可以 whereis nginx)

``` shell
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

4. 重启nginx~




