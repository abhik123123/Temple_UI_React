@echo off
echo Starting Raja Rajeshwara Devastanam - DEV (With Auth)
echo.
set REACT_APP_ENV=dev
cd /d "%~dp0"
call npm start
