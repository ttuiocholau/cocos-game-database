@echo off
echo Deploying backend to Render...

echo.
echo 1. Checking git status...
git status

echo.
echo 2. Adding changes...
git add .

echo.
echo 3. Committing changes...
git commit -m "Update DatabaseManager with better error handling and auto-detect environment"

echo.
echo 4. Pushing to GitHub...
git push origin main

echo.
echo 5. Backend deployment complete!
echo.
echo Next steps:
echo 1. Go to https://render.com
echo 2. Create new Web Service
echo 3. Connect your GitHub repo: https://github.com/ttuiocholau/cocos-game-database.git
echo 4. Set Root Directory to: backend
echo 5. Use existing render.yaml configuration
echo 6. Deploy!
echo.
echo Your new backend URL will be: https://clientgo88sfun-backend.onrender.com
echo.
pause