@echo off
echo Starting Raja Rajeshwara Devastanam - UAT (With Auth)
echo.
set REACT_APP_ENV=uat
cd /d "%~dp0"
call npm start
