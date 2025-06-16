# 🚀 Hướng dẫn Deploy Game Cocos Creator

## Tổng quan
Chúng ta sẽ deploy:
- **Backend**: Render.com (miễn phí)
- **Frontend**: Netlify (miễn phí)
- **Database**: SQLite (tự động tạo trên server)

## 📋 Chuẩn bị

### 1. Tạo tài khoản
- [GitHub](https://github.com) - để lưu code
- [Render.com](https://render.com) - deploy backend
- [Netlify](https://netlify.com) - deploy frontend

### 2. Upload code lên GitHub
```bash
# Tại thư mục dự án
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/your-repo-name.git
git push -u origin main
```

## 🔧 Deploy Backend (Render.com)

### Bước 1: Tạo Web Service
1. Đăng nhập Render.com
2. Click "New" → "Web Service"
3. Connect GitHub repository
4. Chọn repository của bạn

### Bước 2: Cấu hình
```
Name: cocos-game-backend
Environment: Node
Region: Singapore (gần Việt Nam nhất)
Branch: main
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

### Bước 3: Environment Variables
Thêm các biến môi trường:
```
NODE_ENV = production
PORT = 10000
```

### Bước 4: Deploy
- Click "Create Web Service"
- Đợi deploy hoàn thành (5-10 phút)
- Lưu lại URL (ví dụ: `https://your-app-name.onrender.com`)

## 🎮 Deploy Frontend (Netlify)

### Bước 1: Build game trong Cocos Creator
1. Mở Cocos Creator
2. Mở project của bạn
3. Menu "Project" → "Build"
4. Chọn platform: "Web Mobile"
5. Click "Build"

### Bước 2: Cập nhật API URL
Trong file `DatabaseManager.js`, thay đổi:
```javascript
apiBaseUrl: {
    default: "https://your-backend-url.onrender.com/api",
    displayName: "API Base URL"
}
```

### Bước 3: Deploy lên Netlify
**Cách 1: Drag & Drop**
1. Đăng nhập Netlify
2. Kéo thả thư mục `build/web-mobile` vào Netlify
3. Lưu lại URL

**Cách 2: GitHub Integration**
1. Netlify → "New site from Git"
2. Chọn GitHub repository
3. Cấu hình:
   ```
   Build command: node build-web.js
   Publish directory: clientgo88sfun/build/web-mobile
   ```

## 🔒 Cấu hình CORS

Cập nhật `backend/server.js`:
```javascript
app.use(cors({
    origin: [
        'https://your-netlify-url.netlify.app',
        'https://your-custom-domain.com',
        'http://localhost:7456' // Development
    ],
    credentials: true
}));
```

## 📱 Phương án 2: Deploy với Heroku + GitHub Pages

### Backend trên Heroku
1. Tạo file `Procfile` trong thư mục backend:
```
web: node server.js
```

2. Deploy:
```bash
cd backend
heroku create your-app-name
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Frontend trên GitHub Pages
1. Build game trong Cocos Creator
2. Copy nội dung `build/web-mobile` vào branch `gh-pages`
3. Enable GitHub Pages trong repository settings

## 🖥️ Phương án 3: VPS/Cloud Server

### Chuẩn bị VPS
```bash
# Cài đặt Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Cài đặt PM2
sudo npm install -g pm2

# Cài đặt Nginx
sudo apt update
sudo apt install nginx
```

### Deploy Backend
```bash
# Clone repository
git clone https://github.com/username/your-repo.git
cd your-repo/backend

# Cài đặt dependencies
npm install

# Chạy với PM2
pm2 start server.js --name "game-backend"
pm2 startup
pm2 save
```

### Cấu hình Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/your/game/build/web-mobile;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL với Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 📊 Monitoring & Analytics

### 1. Server Monitoring
```javascript
// Thêm vào server.js
app.get('/api/stats', (req, res) => {
    const stats = {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: Date.now()
    };
    res.json(stats);
});
```

### 2. Error Logging
```bash
# Cài đặt Winston
npm install winston

# Trong server.js
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});
```

## 🔧 Troubleshooting

### 1. CORS Errors
```javascript
// Thêm middleware debug CORS
app.use((req, res, next) => {
    console.log('Origin:', req.headers.origin);
    next();
});
```

### 2. Database Issues
```bash
# Kiểm tra file database
ls -la *.db

# Backup database
cp game.db game.db.backup
```

### 3. Build Errors
```bash
# Clear Cocos Creator cache
rm -rf library/
rm -rf temp/

# Rebuild
```

## 📈 Performance Optimization

### 1. Gzip Compression
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Static File Caching
```javascript
app.use(express.static('public', {
    maxAge: '1d',
    etag: false
}));
```

### 3. Database Optimization
```javascript
// Connection pooling cho production database
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production'
});
```

## 🔐 Security Best Practices

### 1. Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 2. Input Validation
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/scores', [
    body('score').isInt({ min: 0, max: 999999 }),
    body('playerId').isLength({ min: 1, max: 50 }).escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Process request...
});
```

### 3. Environment Variables
```bash
# .env file
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
API_KEY=your_api_key
```

## 📱 Mobile App Deployment

### 1. Cocos Creator Native Build
```javascript
// Build cho Android/iOS
// Trong Cocos Creator: Project → Build
// Platform: Android/iOS
// Update API URLs cho production
```

### 2. App Store Deployment
- iOS: Xcode → Archive → Upload to App Store
- Android: Generate APK → Upload to Google Play

## 🎯 Final Checklist

- [ ] Backend deployed và accessible
- [ ] Frontend deployed và loading
- [ ] Database tạo tables thành công
- [ ] API endpoints hoạt động
- [ ] CORS configured đúng
- [ ] SSL certificate (cho production)
- [ ] Domain name configured
- [ ] Monitoring setup
- [ ] Backup strategy
- [ ] Error logging

## 📞 Support URLs

Sau khi deploy thành công:
- **Game URL**: `https://your-game.netlify.app`
- **API URL**: `https://your-backend.onrender.com/api`
- **Health Check**: `https://your-backend.onrender.com/api/health`

## 🚀 Quick Deploy Commands

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Deploy backend (Render auto-deploys from GitHub)
# 3. Deploy frontend (Netlify auto-deploys from GitHub)

# 4. Test
curl https://your-backend.onrender.com/api/health
```

Chúc bạn deploy thành công! 🎉