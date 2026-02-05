@echo off
REM Quick Setup Script for Fortnite Backend v3.0
REM This script will install dependencies and set up the environment

echo ========================================
echo Fortnite Backend v3.0 - Quick Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed!
    echo.
    pause
    exit /b 1
)

echo [OK] npm is installed
npm --version
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo Are you in the correct directory?
    echo.
    pause
    exit /b 1
)

echo [OK] package.json found
echo.

REM Install dependencies
echo ========================================
echo Installing Dependencies...
echo This may take 2-5 minutes...
echo ========================================
echo.

npm install

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Installation failed!
    echo.
    echo Try running as Administrator or check your internet connection.
    echo See TROUBLESHOOTING.md for help.
    echo.
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Dependencies installed!
echo.

REM Check if .env exists
if not exist ".env" (
    if exist ".env.example" (
        echo Creating .env file from template...
        copy .env.example .env >nul
        echo [SUCCESS] .env file created!
        echo.
        echo IMPORTANT: Edit .env with your settings!
        echo - MongoDB connection string
        echo - JWT secret
        echo - Discord bot token (if using)
        echo - Server ports
        echo.
    ) else (
        echo [WARNING] .env.example not found
        echo You'll need to create .env manually
        echo.
    )
) else (
    echo [OK] .env file already exists
    echo.
)

REM Check if MongoDB is running (optional check)
echo ========================================
echo Checking MongoDB...
echo ========================================
echo.

REM Try to connect to MongoDB (this is optional)
node -e "console.log('MongoDB check skipped - will check when server starts')"
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Edit .env file with your configuration:
echo    - MongoDB URI
echo    - JWT secret
echo    - Discord token (if using)
echo.
echo 2. Make sure MongoDB is running:
echo    - Local: "net start MongoDB"
echo    - Or use MongoDB Atlas cloud
echo.
echo 3. Start the backend:
echo    npm start
echo.
echo 4. (Optional) Start Discord bot:
echo    npm run bot
echo.
echo ========================================
echo For help, see:
echo - INSTALLATION.md
echo - TROUBLESHOOTING.md
echo - README.md
echo ========================================
echo.
pause
