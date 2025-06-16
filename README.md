# 🎮 Cocos Creator Game với Database

Dự án game được xây dựng bằng Cocos Creator với hệ thống backend để lưu trữ điểm số và quản lý người chơi.

## 🏗️ Kiến trúc

```
📁 Project Structure
├── 📁 clientgo88sfun/          # Cocos Creator game project
│   ├── 📁 assets/
│   │   └── 📁 scripts/
│   │       ├── DatabaseManager.js    # API connection manager
│   │       └── GameController.js     # Game logic example
│   ├── 📁 build/               # Built game files
│   └── project.json
├── 📁 backend/                 # Node.js backend server
│   ├── server.js              # Express API server
│   ├── package.json           # Dependencies
│   └── game.db               # SQLite database (auto-created)
├── DEPLOYMENT_GUIDE.md        # Chi tiết hướng dẫn deploy
└── DATABASE_SETUP.md          # Hướng dẫn setup database
```

## 🚀 Quick Start

### 1. Chạy Backend Local
```bash
cd backend
npm install
npm start
```
Server chạy tại: http://localhost:3000

### 2. Mở Game trong Cocos Creator
1. Mở Cocos Creator
2. Open Project → chọn thư mục `clientgo88sfun`
3. Chạy game để test

### 3. Deploy Online
```bash
# Chạy script setup tự động
setup-deployment.bat    # Windows
# hoặc
./setup-deployment.sh   # Linux/Mac
```

## 📋 Tính năng

- ✅ **Player Management**: Tạo và quản lý thông tin người chơi
- ✅ **Score System**: Lưu và theo dõi điểm số
- ✅ **Leaderboard**: Bảng xếp hạng top players
- ✅ **Real-time API**: Kết nối real-time với database
- ✅ **Cross-platform**: Web, Mobile, Desktop
- ✅ **Cloud Ready**: Sẵn sàng deploy lên cloud

## 🌐 Deployment Options

### 🆓 Miễn phí
- **Backend**: Render.com
- **Frontend**: Netlify
- **Database**: SQLite

### 💰 Trả phí
- **Backend**: Heroku, AWS, DigitalOcean
- **Frontend**: Vercel, AWS S3
- **Database**: PostgreSQL, MySQL

## 📊 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/health` | Kiểm tra server status |
| GET | `/api/player/:id` | Lấy thông tin player |
| POST | `/api/player/:id` | Tạo/cập nhật player |
| POST | `/api/scores` | Lưu điểm số |
| GET | `/api/leaderboard` | Bảng xếp hạng |

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev    # Auto-restart khi có thay đổi
```

### Frontend Development
1. Mở Cocos Creator
2. Edit scripts trong `assets/scripts/`
3. Test trong Preview mode

## 📱 Platform Support

- ✅ **Web Browser** (Chrome, Firefox, Safari)
- ✅ **Mobile Web** (iOS Safari, Android Chrome)
- ✅ **Android App** (via Cocos Creator build)
- ✅ **iOS App** (via Cocos Creator build)
- ✅ **Desktop** (Windows, Mac, Linux)

## 🔐 Security Features

- CORS protection
- Input validation
- Rate limiting
- SQL injection prevention
- XSS protection

## 📈 Monitoring

- Server health check endpoint
- Error logging
- Performance metrics
- Database backup

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

- 📖 **Documentation**: Đọc `DEPLOYMENT_GUIDE.md`
- 🐛 **Issues**: Tạo GitHub issue
- 💬 **Discussion**: GitHub Discussions

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.

---

## 🎯 Next Steps

1. **Setup Local**: Chạy `setup-deployment.bat`
2. **Read Guide**: Đọc `DEPLOYMENT_GUIDE.md`
3. **Deploy**: Follow deployment instructions
4. **Customize**: Modify game logic theo nhu cầu
5. **Scale**: Add more features và optimize

**Happy Gaming! 🎮**