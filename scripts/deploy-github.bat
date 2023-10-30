@echo off

cd ./docs/.vuepress/dist

echo git Init...
git init

echo git add ...
git add .

echo git commit...
git commit -m "deploy"

echo git push...
git push -f git@github.com:sapphire611/sapphire611.github.io.git master

echo Done