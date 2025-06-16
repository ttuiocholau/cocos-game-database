# Hướng dẫn kết nối Database với Cocos Creator

## Tổng quan
Hệ thống này sử dụng kiến trúc Client-Server với:
- **Frontend**: Cocos Creator game
- **Backend**: Node.js + Express + SQLite
- **Communication**: HTTP/HTTPS API

## Cài đặt Backend

### 1. Cài đặt Node.js
Tải và cài đặt Node.js từ: https://nodejs.org/

### 2. Cài đặt dependencies
```bash
cd backend
npm install
```

### 3. Chạy server
```bash
# Development mode (auto-restart khi có thay đổi)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại: http://localhost:3000

## Cấu hình Cocos Creator

### 1. Thêm scripts vào project
- Copy `DatabaseManager.js` vào thư mục `assets/scripts/`
- Copy `GameController.js` vào thư mục `assets/scripts/`

### 2. Setup trong Scene
1. Tạo một Empty Node và attach `DatabaseManager` component
2. Tạo Game Controller node và attach `GameController` component
3. Kết nối các UI elements (Labels, Buttons, EditBox) với GameController

### 3. Cấu hình API URL
Trong DatabaseManager component, set `apiBaseUrl` thành URL của backend server:
- Development: `http://localhost:3000/api`
- Production: `https://yourdomain.com/api`

## API Endpoints

### Player Management
- `GET /api/player/:playerId` - Lấy thông tin player
- `POST /api/player/:playerId` - Tạo/cập nhật player

### Scores
- `POST /api/scores` - Lưu điểm số
- `GET /api/leaderboard?limit=10` - Lấy bảng xếp hạng
- `GET /api/player/:playerId/scores` - Lấy lịch sử điểm của player

### Health Check
- `GET /api/health` - Kiểm tra server status

## Cách sử dụng trong Game

### 1. Lưu điểm số
```javascript
// Trong game script
this.addScore(100); // Tự động lưu vào database
```

### 2. Hiển thị bảng xếp hạng
```javascript
// Gọi khi player click vào leaderboard button
this.onLeaderboardButtonClick();
```

### 3. Cập nhật tên player
```javascript
// Khi player nhập tên và click save
this.onSavePlayerNameClick();
```

## Database Schema

### Players Table
```sql
CREATE TABLE players (
    id TEXT PRIMARY KEY,           -- Unique player ID
    name TEXT DEFAULT 'Anonymous', -- Player name
    highScore INTEGER DEFAULT 0,   -- Highest score
    level INTEGER DEFAULT 1,       -- Player level
    coins INTEGER DEFAULT 0,       -- In-game currency
    createdAt INTEGER,             -- Creation timestamp
    updatedAt INTEGER              -- Last update timestamp
);
```

### Scores Table
```sql
CREATE TABLE scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playerId TEXT,                 -- Reference to players.id
    score INTEGER,                 -- Score value
    timestamp INTEGER,             -- When score was achieved
    FOREIGN KEY(playerId) REFERENCES players(id)
);
```

## Deployment

### Backend Deployment
1. **Heroku**: 
   - Tạo Heroku app
   - Deploy code lên Heroku
   - Cấu hình environment variables

2. **VPS/Cloud Server**:
   - Upload code lên server
   - Cài đặt Node.js và dependencies
   - Sử dụng PM2 để manage process
   - Setup reverse proxy với Nginx

### Database Options
1. **SQLite** (mặc định): Đơn giản, phù hợp cho prototype
2. **PostgreSQL**: Cho production, scalable
3. **MySQL**: Alternative cho production
4. **MongoDB**: NoSQL option

## Bảo mật

### 1. Authentication
Thêm JWT token authentication:
```javascript
// Trong DatabaseManager
setAuthToken(token) {
    this.authToken = token;
}

// Thêm header Authorization vào requests
xhr.setRequestHeader('Authorization', 'Bearer ' + this.authToken);
```

### 2. Rate Limiting
Thêm rate limiting để tránh spam:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Input Validation
Validate tất cả input từ client:
```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/scores', [
    body('score').isInt({ min: 0 }),
    body('playerId').isLength({ min: 1 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Process request...
});
```

## Troubleshooting

### 1. CORS Issues
Nếu gặp lỗi CORS, đảm bảo backend có cấu hình cors đúng:
```javascript
app.use(cors({
    origin: ['http://localhost:7456', 'https://yourgame.com'],
    credentials: true
}));
```

### 2. Network Errors
- Kiểm tra server có đang chạy không
- Kiểm tra firewall settings
- Test API endpoints bằng Postman

### 3. Database Errors
- Kiểm tra file permissions cho SQLite
- Xem logs để debug SQL queries
- Backup database thường xuyên

## Mở rộng

### 1. Real-time Features
Sử dụng WebSocket cho real-time updates:
```javascript
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    socket.on('score_update', (data) => {
        // Broadcast to all clients
        socket.broadcast.emit('leaderboard_update', data);
    });
});
```

### 2. Caching
Thêm Redis cache cho performance:
```javascript
const redis = require('redis');
const client = redis.createClient();

// Cache leaderboard
app.get('/api/leaderboard', async (req, res) => {
    const cached = await client.get('leaderboard');
    if (cached) {
        return res.json(JSON.parse(cached));
    }
    
    // Fetch from database and cache
    // ...
});
```

### 3. Analytics
Track player behavior:
```javascript
// Log player actions
app.post('/api/analytics', (req, res) => {
    const { playerId, action, data } = req.body;
    // Store analytics data
    // ...
});
```