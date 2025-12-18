#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 构建
npm run build

# 检查是否存在 dist 文件夹
if [ ! -d "dist" ]; then
  echo "Error: dist folder not found"
  exit 1
fi

# 先提交当前的改动
# git add -A
# git commit -m 'deploy'
# git push -u origin

# 拷贝 dist 文件夹内容到分支目录
cp -r dist/* ~/vue-gh-pages/

# cd 到分支目录下
cd ~/vue-gh-pages/

# 切换到 gh-pages 分支
#git checkout gh-pages



# 部署到自定义域域名
# echo 'www.example.com' > CNAME

#git init
#git remote add origin git@github.com:xuzepei/VuePractice.git
git add -A
git commit -m 'deploy'

# 部署到 https://<USERNAME>.github.io
#git push -f git@github.com:xuzepei/xuzepei.github.io.git master

# 部署到 https://<USERNAME>.github.io/<REPO>
git pull origin gh-pages
git push -u origin gh-pages

