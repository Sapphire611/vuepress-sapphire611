npm run build
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# Check current branch name and push appropriately
branch_name=$(git branch --show-current)
if [ -z "$branch_name" ]; then
  # Handle detached HEAD state (first commit creates branch)
  git checkout -b master  # Force create master branch
fi

git push -f git@github.com:sapphire611/sapphire611.github.io.git ${branch_name:-master}:master