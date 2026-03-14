---
title: 使用githubPages部署Vuepress项目
date: 2022-01-19
categories:
 - Deploy
tags:
 - githubPages
 - vuepress 
sidebar: 'auto'
publish: true
--- 

## 前言

> 自购 服务器 & 域名 & 证书 & 部署 & jenkins 费钱又费力

> 用githubPage部署，一分钱不花，域名 & HTTPS 带回家

### 0. 电脑已配置好.ssh密钥 

> 在 Github.Settings.SSH and GPG keys中添加

[SSH 密钥登录(用于git中免用户名密码的认证)](https://wangdoc.com/ssh/key.html#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95)

[windows 10 github 配置.ssh秘钥](https://blog.csdn.net/aachangs/article/details/80869833)

### 1. 自行创建Repository: [username].github.io

> 无图，一般来说，权限为public，不需要README.md

### 2. package.json 中添加部署命令

```shell
"scripts": {
    "start": "vuepress dev docs --temp .temp", # temp 用于热部署
    "build": "vuepress build docs", # 我的打包命令叫build
    "dev": "vuepress dev docs",
    "deploy-github": "GH=1 yarn build && bash scripts/deploy-github.sh", # 这个是部署命令!!
    "test" : "node test/test.js"
  },
```

### 3. 创建部署脚本文件

> 根据步骤2的命令，我需要在项目目录下创建scripts文件夹，新建 deploy-github.sh

```shell
#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 运行打包命令，生成静态文件，步骤2中打包命令为build
npm run build

# 进入打包目录
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
git push -f git@github.com:[yourUsername]/[yourUsername].github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -
```

### 4. 运行部署命令

```shell
yarn deploy-github  # 二选一
npm run deploy-github
```

### 5. 等几分钟后访问 https://[username].github.io/

结束啦，很简单吧😄
