#!/bin/bash

echo "========================================"
echo "   COCOS CREATOR GAME DEPLOYMENT SETUP"
echo "========================================"
echo

echo "[1/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please download and install Node.js from: https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js is installed ($(node --version))"

echo
echo "[2/5] Installing backend dependencies..."
cd backend
if [ ! -f package.json ]; then
    echo "ERROR: package.json not found in backend directory!"
    exit 1
fi
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies!"
    exit 1
fi
echo "✓ Backend dependencies installed"

echo
echo "[3/5] Testing backend server..."
npm start &
SERVER_PID=$!
sleep 5
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo "✓ Backend server is working"
else
    echo "WARNING: Backend server test failed. Please check manually."
fi
kill $SERVER_PID 2>/dev/null

echo
echo "[4/5] Checking Git repository..."
cd ..
if ! git status &> /dev/null; then
    echo "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
    echo "✓ Git repository initialized"
else
    echo "✓ Git repository already exists"
fi

echo
echo "[5/5] Creating deployment checklist..."
echo
echo "========================================"
echo "        DEPLOYMENT CHECKLIST"
echo "========================================"
echo
echo "□ 1. Create GitHub repository and push code"
echo "□ 2. Sign up for Render.com account"
echo "□ 3. Sign up for Netlify account"
echo "□ 4. Deploy backend to Render"
echo "□ 5. Build game in Cocos Creator"
echo "□ 6. Update API URL in DatabaseManager.js"
echo "□ 7. Deploy frontend to Netlify"
echo "□ 8. Test the deployed game"
echo
echo "========================================"
echo
echo "Next steps:"
echo "1. Read DEPLOYMENT_GUIDE.md for detailed instructions"
echo "2. Push your code to GitHub:"
echo "   git remote add origin https://github.com/username/repo-name.git"
echo "   git push -u origin main"
echo "3. Follow the deployment guide step by step"
echo
echo "To start local backend server: cd backend && npm start"
echo "API health check: http://localhost:3000/api/health"
echo