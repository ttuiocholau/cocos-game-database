@echo off
echo Testing database connection...
echo.

echo 1. Testing local backend server...
curl -s http://localhost:3000/api/health
if %errorlevel% equ 0 (
    echo ✅ Local server is running
) else (
    echo ❌ Local server is not running
    echo Starting local server...
    start cmd /k "cd backend && npm start"
)

echo.
echo 2. Testing production backend server...
curl -s https://clientgo88sfun-backend.onrender.com/api/health
if %errorlevel% equ 0 (
    echo ✅ Production server is running
) else (
    echo ❌ Production server is not accessible
)

echo.
echo 3. Testing old backend server...
curl -s https://cocos-game-database.onrender.com/api/health
if %errorlevel% equ 0 (
    echo ✅ Old server is still running
) else (
    echo ❌ Old server is not accessible
)

echo.
echo Test completed!
pause