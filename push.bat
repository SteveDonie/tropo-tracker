@echo off
if .%1.==.. echo Please give a commit message in quotes. && goto :EOF
echo ----- git status
call git status
echo ----- git add
call git add .
echo ----- git commit
call git commit -m%1
echo ----- git push
call git push heroku master
