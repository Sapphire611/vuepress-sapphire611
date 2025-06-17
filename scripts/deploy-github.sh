npm run build
cd docs/.vuepress/dist
git init
git checkout -b master
git add -A
git commit -m 'deploy'
git remote add origin git@github.com:Sapphire611/sapphire611.github.io.git
git push --set-upstream origin master --force