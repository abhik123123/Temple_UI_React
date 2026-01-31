@echo off
echo Starting Raja Rajeshwara Devastanam - LOCAL (No Auth)
echo.
set REACT_APP_ENV=local
cd /d "%~dp0"
call npm start
