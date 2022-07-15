---
title: Linux 相关
date: '2022-7-15'
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

### Vi操作 & 快捷键

[Vi操作和使用方法详解](https://blog.csdn.net/xie_xiansheng/article/details/78413306)

> vi可以分为三种状态，分别是命令模式（command mode）、插入模式（Insert mode）和底行模式（last line mode）

#### 光标相关快捷键
　　
> vi可以直接用键盘上的光标来上下左右移动，但正规的vi是用小写英文字母「h」、「j」、「k」、「l」，分别控制光标左、下、上、右移一格。

``` shell　　
# 移动
「ctrl」+「b」：屏幕往"后"移动一页。
「ctrl」+「f」：屏幕往"前"移动一页。
「ctrl」+「u」：屏幕往"后"移动半页。
「ctrl」+「d」：屏幕往"前"移动半页。
「0」：移到文章的开头。
「G」：移动到文章的最后。
「$」：移动到光标所在行的"行尾"。
「^」：移动到光标所在行的"行首"
「w」：光标跳到下个字的开头
「e」：光标跳到下个字的字尾
「b」：光标回到上个字的开头
「#l」：光标移到该行的第#个位置，如：5l,56l。
```

``` shell
# 删除
「x」：每按一次，删除光标所在位置的"后面"一个字符。
「#x」：例如，「6x」表示删除光标所在位置的"后面"6个字符。
「X」：大写的X，每按一次，删除光标所在位置的"前面"一个字符。
「#X」：例如，「20X」表示删除光标所在位置的"前面"20个字符。
「dd」：删除光标所在行。
「#dd」：从光标所在行开始删除#行
```
``` shell
「yw」：将光标所在之处到字尾的字符复制到缓冲区中。
「#yw」：复制#个字到缓冲区
「yy」：复制光标所在行到缓冲区。
「#yy」：例如，「6yy」表示拷贝从光标所在的该行"往下数"6行文字。
「p」：将缓冲区内的字符贴到光标所在位置。注意：所有与"y"有关的复制命令都必须与"p"配合才能完成复制与粘贴功能。
「r」：替换光标所在处的字符。
「R」：替换光标所到之处的字符，直到按下「ESC」键为止。
「u」：如果您误执行一个命令，可以马上按下「u」，回到上一个操作。按多次"u"可以执行多次回复。
```
 
#### 退出vi及保存文件
- 在「命令行模式（command mode）」下，按一下「：」冒号键进入「Last line mode」，例如：
    - w filename （输入 「w filename」将文章以指定的文件名filename保存）
    - wq (输入「wq」，存盘并退出vi)
    - q! (输入q!， 不存盘强制退出vi)