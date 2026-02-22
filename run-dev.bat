@echo off
echo Starting Raja Rajeshwara Devastanam - DEV (NO-AUTH Mode)
echo.
set REACT_APP_ENV=no-auth
cd /d "%~dp0"
call npm start
