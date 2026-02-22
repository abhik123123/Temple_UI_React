@echo off
echo Starting Raja Rajeshwara Devastanam - UAT (AUTH Mode)
echo.
set REACT_APP_ENV=auth
cd /d "%~dp0"
call npm start
