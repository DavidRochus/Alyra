#!/bin/sh

# Initialize Env
#heroku login
#git init

# Link project to remote repositories
#heroku git:remote -a alyra-defi3
#git remote add origin https://github.com/DavidRochus/alyra-defi3.git

# Create new contract and rebuild project
truffle migrate --reset
truffle test
npm install

# Deploy on Heroku
sed "s/\"homepage\": \"https:\/\/DavidRochus.github.io\/alyra-defi3\/\",/\"homepage\": \"\",/" package.json >package2.json;mv package2.json package.json
cd ..
git add .
git commit -am "Deploy heroku"
git subtree push --prefix client/ heroku master
cd -

# Deploy on gh-pages
sed "s/\"homepage\": \"\",/\"homepage\": \"https:\/\/DavidRochus.github.io\/alyra-defi3\/\",/" package.json >package2.json;mv package2.json package.json
git add .
git commit -am "Deploy gh-pages"
#git branch -M main
#git push -u origin main
npm run deploy



