@echo off
echo.
echo ========================================
echo  EXAMBROWSER Admin - Quick Deploy
echo ========================================
echo.

cd exam-admin

echo [1/4] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not installed!
    echo Please install from: https://nodejs.org
    pause
    exit /b 1
)

echo [2/4] Installing dependencies...
call npm install

echo.
echo [3/4] Testing server locally...
echo Starting server on http://localhost:3000
echo.
echo Press Ctrl+C to stop and continue to deploy
echo.
start http://localhost:3000
node api/index.js

echo.
echo [4/4] Ready to deploy to Vercel!
echo.
echo Run these commands to deploy:
echo   npm i -g vercel
echo   vercel login
echo   vercel --prod
echo.
pause
