# Hướng dẫn khắc phục sự cố Database

## Vấn đề: Đăng nhập và đăng ký bị lỗi

### Nguyên nhân có thể:
1. Backend server không chạy hoặc không thể truy cập
2. URL API không đúng
3. Vấn đề CORS
4. Lỗi kết nối mạng

### Cách khắc phục:

#### 1. Kiểm tra Backend Server

**Cách 1: Sử dụng server local**
```bash
cd backend
npm install
npm start
```
Server sẽ chạy tại: http://localhost:3000

**Cách 2: Deploy lên Render**
1. Chạy file `deploy-backend.bat`
2. Truy cập https://render.com
3. Tạo Web Service mới
4. Kết nối với GitHub repo
5. Thiết lập Root Directory: `backend`
6. Deploy

#### 2. Kiểm tra URL API

DatabaseManager sẽ tự động phát hiện môi trường:
- **Development** (localhost): `http://localhost:3000/api`
- **Production** (Netlify): `https://clientgo88sfun-backend.onrender.com/api`

#### 3. Test API Endpoints

Mở Developer Console (F12) và kiểm tra:

```javascript
// Test health check
fetch('https://clientgo88sfun-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log);

// Test create player
fetch('https://clientgo88sfun-backend.onrender.com/api/player/test123', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({name: 'Test Player'})
})
.then(r => r.json())
.then(console.log);
```

#### 4. Kiểm tra Console Logs

Mở Developer Console (F12) để xem logs:
- `API Base URL: ...` - Xác nhận URL đúng
- `Making GET/POST request to: ...` - Xem requests
- Lỗi network hoặc timeout

#### 5. Kiểm tra CORS

Nếu gặp lỗi CORS, đảm bảo backend có cấu hình đúng domain:

```javascript
// Trong backend/server.js
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://effortless-profiterole-33f8af.netlify.app', 'https://*.netlify.app']
        : ['http://localhost:7456', 'http://127.0.0.1:7456'],
    credentials: true
}));
```

### Các lệnh hữu ích:

**Chạy backend local:**
```bash
cd backend
npm run dev  # Development mode với auto-restart
# hoặc
npm start    # Production mode
```

**Build và deploy frontend:**
```bash
npm run build-web
```

**Kiểm tra git status:**
```bash
git status
git log --oneline -5
```

### Liên hệ hỗ trợ:

Nếu vẫn gặp vấn đề, cung cấp thông tin sau:
1. URL website hiện tại
2. Console logs (F12)
3. Network tab trong Developer Tools
4. Thông báo lỗi cụ thể

### Checklist khắc phục:

- [ ] Backend server đang chạy
- [ ] URL API đúng trong DatabaseManager
- [ ] Không có lỗi CORS
- [ ] Network requests thành công
- [ ] Database có dữ liệu
- [ ] Console không có lỗi JavaScript