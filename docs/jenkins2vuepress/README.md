---
title: 使用Jenkins自动化部署Vuepress项目
date: 2021-12-10
categories:
 - Deploy
tags:
 - jenkins2vuepress 
sidebar: 'auto'
publish: true
--- 

> Jenkins自动化部署中踩的坑

## Jenkins 安装 

[【Linux】yum安装Jenkins与卸载（简单方便）](https://blog.csdn.net/Ginny97/article/details/103984312)

[【linux】安装java步骤](https://www.cnblogs.com/wjup/p/11041274.html)

::: warning
前提要安装Java，版本至少8，推荐11
:::

## Jenkins 实操

[实战笔记：Jenkins打造强大的前端自动化工作流](https://juejin.cn/post/6844903591417757710)

> 安装 Generic Webhook Trigger Plugin插件,WEB Hook URL :

``` shell
http://<User ID>:<API Token>@<Jenkins IP地址>:端口/generic-webhook-trigger/invoke
```

> 安装 Publish Over SSH 插件，系统管理-系统设置里找到Publish over SSH这一项：

::: tip
Passphrase：密码（key的密码，没设置就是空）

Path to key：key文件（私钥）的路径

Key：将私钥复制到这个框中(path to key和key写一个即可)

SSH Servers的配置：

SSH Server Name：标识的名字（随便你取什么）

Hostname：需要连接ssh的主机名或ip地址（建议ip）

Username：用户名

Remote Directory：远程目录（上面第二步建的testjenkins文件夹的路径）
:::

## SSH 密钥登录

[SSH 密钥登录(用于git中免用户名密码的认证)](https://wangdoc.com/ssh/key.html#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95)

[windows 10 git配置.ssh秘钥](https://blog.csdn.net/aachangs/article/details/80869833)

::: danger
目前Gtihub已弃用用户名&密码的认证方式
:::

::: tip
首先 cd ~/.ssh 查看是否有密钥

概括 ：ssh-keygen 后一路回车，带pub结尾的是公钥，不带的是私钥
:::

## Jenkins Tips

::: tip

[jenkins忘记密码怎么操作](https://blog.csdn.net/weixin_44049466/article/details/102023452?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-1.no_search_link&spm=1001.2101.3001.4242.2)

[Jenkins系列_插件安装及报错处理（缺少插件可以手动安装）](https://blog.csdn.net/ziwuzhulin/article/details/79820020)

[SSH connection Error(手动再次输入用户名密码)](https://blog.csdn.net/weixin_41824658/article/details/88965634)

[jenkins 指定gitlab上的源码时，提示无权限](https://blog.csdn.net/u010947098/article/details/60965469)

[Jenkins jenkins添加sudo的执行权限](https://blog.csdn.net/weixin_40123451/article/details/113203225)

:::

::: warning
最后这条比较重要，因为Jenkins用户没有sudo权限
::: 
## linux安装nodeJs

> 一般对root用户有效，jenkins用户需额外设置

``` shell
wget https://nodejs.org/dist/v16.13.1/node-v16.13.1-linux-x64.tar.xz
tar -xvf node-v16.13.1-linux-x64.tar.xz
sudo mv ./node-v16.13.1-linux-x64 /usr/local/node
sudo ln -s /usr/local/node/bin/node /usr/bin/node
sudo ln -s /usr/local/node/bin/npm /usr/bin/npm
```
[使用 NVM 管理不同的 Node.js 版本(对Jenkins用户无效)](https://www.cnblogs.com/Kennytian/p/6391481.html)

[Jenkins---jenkins中安装nodejs(利用插件)](https://www.jianshu.com/p/0a865a321d78)

## serve 部署相关 

[【Windows】PowerShell：因为在此系统上禁止运行脚本，解决方法](https://www.jianshu.com/p/4eaad2163567)

[Serve - Npm](https://www.npmjs.com/package/serve)

[linux系统安装yarn](https://blog.csdn.net/weixin_28993311/article/details/116964001)

[jenkins Process leaked file descriptors(Jenkins会默认杀掉所有衍生进程)](https://blog.csdn.net/weixin_36816337/article/details/82055217)

::: tip
以下Shell命令仅供参考：
:::

``` shell
git stash
git pull origin master

yarn 

yarn build 

cd docs/.vuepress/dist

BUILD_ID=dontKillMe # Jenkins默认会杀掉所有衍生进程，需要标识

nohup /usr/local/bin/serve >run.out & # Jenkins走的绝对路径，否则会报错的

exit
```

::: danger
Jenkins默认会杀掉所有衍生进程，需要标识
:::