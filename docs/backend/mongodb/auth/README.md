---
title: Mongodb 备份 & 恢复 & 增加密码
date: 2022-11-8
categories:
  - Backend
tags:
  - mongodb
sidebar: "auto"
publish: true
showSponsor: true
---

## Mongodb 不能裸奔

> 某次工作途中测试服务器的mongodb没有上密码，直接被人清库了两次，特此记录

### 基于 docker 给 mongodb 增加密码

```
docker run --name mongo -d -p 27017:27017 --restart always mongo --auth # 利用docker挂载mongo，顺便设置自启动
docker ps
docker exec -it [container_id] mongo admin
```

```
MongoDB shell version v5.0.6
connecting to: mongodb://127.0.0.1:27017/admin?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("a9721af9-51b8-4771-ba38-20396ca807a9") }
MongoDB server version: 5.0.6
================
Warning: the "mongo" shell has been superseded by "mongosh",
which delivers improved usability and compatibility.The "mongo" shell has been deprecated and will be removed in
an upcoming release.
For installation instructions, see
https://docs.mongodb.com/mongodb-shell/install/
================

> db.createUser({ user: 'root', pwd: 'root', roles: [ { role: "userAdminAnyDatabase", db: "admin" } ] });

Successfully added user: {
	"user" : "root",
	"roles" : [
		{
			"role" : "userAdminAnyDatabase",
			"db" : "admin"
		}
	]
}

> exit
bye
```
::: tip
其实到这一步，就可以了，不一定要针对单数据库创建特定的管理员，用一个就行
:::

--- 
``` js
// 更新权限
db.updateUser(
 "root",
        {
            roles : 
            [
                  {"role" : "userAdminAnyDatabase","db" : "admin"},
                  {"role" : "dbOwner","db" : "admin"},
                  {"role" : "clusterAdmin", "db": "admin"}
             ]
        }
) 

// 授予备份，恢复数据权限
db.grantRolesToUser("root",[{role:”backup”,db:"admin"}])
db.grantRolesToUser("root",[{role:"restore",db:"admin"}])
```

---

```
# mongodb链接url

db: mongodb://[username]:[password]@[ip]:[port]/[dbName]?readPreference=primary&directConnection=true&ssl=false&authMechanism=DEFAULT&authSource=admin

# authSource=admin 一定要加
```

--- 

### Mongodump & Mongorestore

[如何使用mongodump](https://juejin.cn/post/7036272188915187742)

::: tip
mongodb将主体与插件进行了分离，需要额外下载插件包MongoDB Database Tools 下载地址: [下载地址](https://www.mongodb.com/try/download/database-tools)
:::

``` shell
tar -zxvf mongodb.tools.xxxxxxx.tgz # 解压
```

``` shell
cd /bin # 解压后进入 /bin 目录
./mongodump
./mongodump --forceTableScan -d [database_name] # 因mongodb版本不一致导致的导出失败解决方案:
./mongorestore
```

### 对应mongo库打包成gz

#### mongodump

``` shell
mongodump -h 127.0.0.1:27017 -d [database_name] --gzip --archive=xxx.gz # 无密码
mongodump -h 127.0.0.1:27017 -u [username] -p [password] --authenticationDatabase admin -d [database_name] --gzip --archive=xxx.gz #有密码
```

#### mongorestore
``` shell
mongorestore -h 127.0.0.1:27017 -d [database_name] --gzip --archive=xxx.gz # 无密码
mongorestore -h 127.0.0.1:27017 -u [username] -p [password] --authenticationDatabase admin -d [database_name] --gzip --archive=xxx.gz #有密码
```


