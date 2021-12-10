---
title: Nginx 简易操作
date: '2021-12-10'
categories:
 - Backend
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






