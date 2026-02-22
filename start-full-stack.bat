@echo off
echo.
echo ======================================
echo  Temple Backend + Frontend Startup
echo ======================================
echo.

REM Check if backend node_modules exists
if not exist "backend\node_modules\" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo.
)

REM Check if frontend node_modules exists
if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
    echo.
)

echo Starting Backend Server on port 8080...
start "Temple Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server on port 3000...
start "Temple Frontend" cmd /k "npm start"

echo.
echo ======================================
echo  Both servers are starting...
echo  Backend:  http://localhost:8080
echo  Frontend: http://localhost:3000
echo ======================================
echo.
echo Press any key to stop all servers...
pause > nul

REM Kill servers
taskkill /FI "WindowTitle eq Temple Backend*" /T /F
taskkill /FI "WindowTitle eq Temple Frontend*" /T /F

echo.
echo All servers stopped.
