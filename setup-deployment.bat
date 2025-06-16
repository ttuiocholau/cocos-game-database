@echo off
echo ========================================
echo    COCOS CREATOR GAME DEPLOYMENT SETUP
echo ========================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo [2/5] Installing backend dependencies...
cd backend
if not exist package.json (
    echo ERROR: package.json not found in backend directory!
    pause
    exit /b 1
)
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies!
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed

echo.
echo [3/5] Testing backend server...
start /b npm start
timeout /t 5 /nobreak >nul
curl -s http://localhost:3000/api/health >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Backend server test failed. Please check manually.
) else (
    echo ✓ Backend server is working
)

echo.
echo [4/5] Checking Git repository...
cd ..
git status >nul 2>&1
if %errorlevel% neq 0 (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit for deployment"
    echo ✓ Git repository initialized
) else (
    echo ✓ Git repository already exists
)

echo.
echo [5/5] Creating deployment checklist...
echo.
echo ========================================
echo         DEPLOYMENT CHECKLIST
echo ========================================
echo.
echo □ 1. Create GitHub repository and push code
echo □ 2. Sign up for Render.com account
echo □ 3. Sign up for Netlify account
echo □ 4. Deploy backend to Render
echo □ 5. Build game in Cocos Creator
echo □ 6. Update API URL in DatabaseManager.js
echo □ 7. Deploy frontend to Netlify
echo □ 8. Test the deployed game
echo.
echo ========================================
echo.
echo Next steps:
echo 1. Read DEPLOYMENT_GUIDE.md for detailed instructions
echo 2. Push your code to GitHub
echo 3. Follow the deployment guide step by step
echo.
echo Your local backend is running at: http://localhost:3000
echo API health check: http://localhost:3000/api/health
echo.
pause