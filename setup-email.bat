@echo off
REM Email Notification Setup Script for Windows

echo ========================================
echo Temple Email Notification Setup
echo ========================================
echo.

echo [1/4] Installing nodemailer...
cd backend
call npm install nodemailer
if errorlevel 1 (
    echo ERROR: Failed to install nodemailer
    pause
    exit /b 1
)
echo ✓ nodemailer installed successfully
echo.

echo [2/4] Checking .env file...
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo ✓ Created .env file
    echo.
    echo ⚠ IMPORTANT: Please edit backend\.env and update:
    echo   - DB_PASSWORD (your PostgreSQL password^)
    echo   - JWT_SECRET (a random secure string^)
    echo.
) else (
    echo ✓ .env file already exists
    echo.
    echo Adding email configuration...
    echo # Email Configuration >> .env
    echo EMAIL_SERVICE=ethereal >> .env
    echo EMAIL_FROM="Raja Rajeshwara Temple <noreply@temple.com>" >> .env
    echo FRONTEND_URL=http://localhost:3000 >> .env
    echo ✓ Email configuration added
    echo.
)

echo [3/4] Configuration Summary:
echo --------------------------------
echo Email Service: Ethereal (Testing Mode^)
echo Status: Ready to use - No setup required!
echo Preview: Email preview URLs shown in console
echo.
echo To switch to production email service later:
echo   - Gmail: Edit EMAIL_SERVICE=gmail in backend\.env
echo   - SendGrid: Edit EMAIL_SERVICE=sendgrid in backend\.env
echo   - AWS SES: Edit EMAIL_SERVICE=aws-ses in backend\.env
echo.
echo See EMAIL_SETUP_GUIDE.md for detailed instructions.
echo.

echo [4/4] Next Steps:
echo --------------------------------
echo 1. Start backend server:
echo    cd backend
echo    npm run dev
echo.
echo 2. Test email configuration:
echo    POST http://localhost:8080/api/notifications/test-email
echo    Body: {"to":"test@example.com"}
echo.
echo 3. Check console for preview URL like:
echo    📧 Preview URL: https://ethereal.email/message/xxxxx
echo.
echo 4. Click preview URL to view the email!
echo.

echo ========================================
echo ✓ Email Notification Setup Complete!
echo ========================================
echo.
echo 📖 Documentation:
echo   - Quick Start: EMAIL_QUICK_START.md
echo   - Full Guide: EMAIL_SETUP_GUIDE.md
echo   - Summary: EMAIL_NOTIFICATION_SUMMARY.md
echo.

pause
