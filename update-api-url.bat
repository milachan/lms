@echo off
echo.
echo ========================================
echo  UPDATE API URL - After Vercel Deploy
echo ========================================
echo.

set /p VERCEL_URL="Enter your Vercel URL (e.g., exam-admin-xyz.vercel.app): "

if "%VERCEL_URL%"=="" (
    echo ERROR: URL cannot be empty!
    pause
    exit /b 1
)

echo.
echo Updating login.html with API URL: https://%VERCEL_URL%/api
echo.

cd exam-admin\public

powershell -Command "(Get-Content login.html) -replace 'https://YOUR-VERCEL-URL.vercel.app/api', 'https://%VERCEL_URL%/api' | Set-Content login.html"

echo.
echo SUCCESS! API URL updated in login.html
echo.
echo Next steps:
echo 1. Deploy again: vercel --prod
echo 2. Test: https://%VERCEL_URL%/login.html
echo.
pause
