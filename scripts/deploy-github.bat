@echo off

cd ./docs/.vuepress/dist

echo git Init...
git init

git checkout -b master

echo git add ...
git add -A

echo git commit...
git commit -m "deploy"

echo git push...
git remote add origin git@github.com:Sapphire611/sapphire611.github.io.git
git push --set-upstream origin master --force

echo Done