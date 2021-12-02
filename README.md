# VuePress-Sapphire611

### linux安装nodeJs

```
wget https://nodejs.org/dist/v16.13.1/node-v16.13.1-linux-x64.tar.xz
tar -xvf node-v16.13.1-linux-x64.tar.xz
sudo mv ./node-v16.13.1-linux-x64 /usr/local/node
sudo ln -s /usr/local/node/bin/node /usr/bin/node
sudo ln -s /usr/local/node/bin/npm /usr/bin/npm
```

### 运行

```
npm run start 11
nohup npm run start >> ./run.log & exit

# sudo lsof -i:(port)
# sudo kill -9 (pid)
# sudo kill -9 $(lsof -i tcp:80 -t)
kill `netstat -nlp | grep :8080 | awk '{print $7}' | awk -F"/" '{ print $1 }'`
```
