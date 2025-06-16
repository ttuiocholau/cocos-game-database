cc.Class({
    extends: cc.Component,

    properties: {
        // URL của backend API server
        apiBaseUrl: {
            default: "https://clientgo88sfun-backend.onrender.com/api",
            displayName: "API Base URL"
        }
    },

    onLoad() {
        // Singleton pattern
        if (!window.DatabaseManager) {
            window.DatabaseManager = this;
            cc.game.addPersistRootNode(this.node);
            
            // Auto-detect environment and set appropriate API URL
            this.detectEnvironment();
        } else {
            this.node.destroy();
            return;
        }
    },

    /**
     * Tự động phát hiện môi trường và thiết lập URL API phù hợp
     */
    detectEnvironment() {
        const currentUrl = window.location.href;
        
        if (currentUrl.includes('localhost') || currentUrl.includes('127.0.0.1')) {
            // Development environment - use local server
            this.apiBaseUrl = "http://localhost:3000/api";
            console.log("Development mode: Using local server");
        } else if (currentUrl.includes('netlify.app')) {
            // Production on Netlify - use deployed backend
            this.apiBaseUrl = "https://clientgo88sfun-backend.onrender.com/api";
            console.log("Production mode: Using Render backend");
        } else {
            // Default fallback
            console.log("Using default API URL:", this.apiBaseUrl);
        }
        
        console.log("API Base URL:", this.apiBaseUrl);
    },

    /**
     * Gửi request GET đến server
     * @param {string} endpoint - API endpoint
     * @param {function} callback - Callback function (error, data)
     */
    get(endpoint, callback) {
        const xhr = new XMLHttpRequest();
        const fullUrl = this.apiBaseUrl + endpoint;
        
        xhr.open('GET', fullUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.timeout = 10000; // 10 seconds timeout
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        console.log(`GET ${endpoint} success:`, data);
                        callback(null, data);
                    } catch (e) {
                        console.error(`GET ${endpoint} JSON parse error:`, e);
                        callback(e, null);
                    }
                } else {
                    console.error(`GET ${endpoint} failed: ${xhr.status} ${xhr.statusText}`);
                    callback(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`), null);
                }
            }
        };
        
        xhr.ontimeout = function() {
            console.error(`GET ${endpoint} timeout`);
            callback(new Error('Request timeout'), null);
        };
        
        xhr.onerror = function() {
            console.error(`GET ${endpoint} network error`);
            callback(new Error('Network error - Kiểm tra kết nối internet và server backend'), null);
        };
        
        console.log(`Making GET request to: ${fullUrl}`);
        xhr.send();
    },

    /**
     * Gửi request POST đến server
     * @param {string} endpoint - API endpoint
     * @param {object} data - Dữ liệu gửi đi
     * @param {function} callback - Callback function (error, data)
     */
    post(endpoint, data, callback) {
        const xhr = new XMLHttpRequest();
        const fullUrl = this.apiBaseUrl + endpoint;
        
        xhr.open('POST', fullUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.timeout = 10000; // 10 seconds timeout
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 201) {
                    try {
                        const responseData = JSON.parse(xhr.responseText);
                        console.log(`POST ${endpoint} success:`, responseData);
                        callback(null, responseData);
                    } catch (e) {
                        console.error(`POST ${endpoint} JSON parse error:`, e);
                        callback(e, null);
                    }
                } else {
                    console.error(`POST ${endpoint} failed: ${xhr.status} ${xhr.statusText}`);
                    callback(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`), null);
                }
            }
        };
        
        xhr.ontimeout = function() {
            console.error(`POST ${endpoint} timeout`);
            callback(new Error('Request timeout'), null);
        };
        
        xhr.onerror = function() {
            console.error(`POST ${endpoint} network error`);
            callback(new Error('Network error - Kiểm tra kết nối internet và server backend'), null);
        };
        
        console.log(`Making POST request to: ${fullUrl}`, data);
        xhr.send(JSON.stringify(data));
    },

    /**
     * Lưu điểm số người chơi
     * @param {string} playerId - ID người chơi
     * @param {number} score - Điểm số
     * @param {function} callback - Callback function
     */
    savePlayerScore(playerId, score, callback) {
        const data = {
            playerId: playerId,
            score: score,
            timestamp: Date.now()
        };
        
        this.post('/scores', data, callback);
    },

    /**
     * Lấy bảng xếp hạng
     * @param {number} limit - Số lượng record
     * @param {function} callback - Callback function
     */
    getLeaderboard(limit = 10, callback) {
        this.get(`/leaderboard?limit=${limit}`, callback);
    },

    /**
     * Lấy thông tin người chơi
     * @param {string} playerId - ID người chơi
     * @param {function} callback - Callback function
     */
    getPlayerData(playerId, callback) {
        this.get(`/player/${playerId}`, callback);
    },

    /**
     * Cập nhật thông tin người chơi
     * @param {string} playerId - ID người chơi
     * @param {object} playerData - Dữ liệu người chơi
     * @param {function} callback - Callback function
     */
    updatePlayerData(playerId, playerData, callback) {
        this.post(`/player/${playerId}`, playerData, callback);
    }
});