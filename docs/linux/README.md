---
title: Linux 相关
date: '2022-1-25'
categories:
 - Deploy
tags:
 - linux
sidebar: 'auto'
publish: true
--- 

## linux 命令

### ssh / sftp

```shell
ssh [username]@[ip address]  # Password：

sftp [username]@[ip address] # Password:
sftp> put Desktop/demo.zip /root # (mac) 把桌面上的demo.zip 发送到服务器 /root 中
```

### tar / zip 

```shell
# 将文件 abc 进行压缩时，排除1.txt，压缩后的文件名为 abc.tar
tar --exclude=abc/1.txt -zcvf abc.tgz abc
tar -zxvf demo.tgz

# 将 /home/html/ 这个目录下所有文件和文件夹打包为当前目录下的 html.zip：
zip -q -r html.zip /home/html
unzip demo.zip
```

