cc.Class({
    extends: cc.Component,

    properties: {
        // URL của backend API server
        apiBaseUrl: {
            default: "https://cocos-game-database.onrender.com/api",
            displayName: "API Base URL"
        }
    },

    onLoad() {
        // Singleton pattern
        if (!window.DatabaseManager) {
            window.DatabaseManager = this;
            cc.game.addPersistRootNode(this.node);
        } else {
            this.node.destroy();
            return;
        }
    },

    /**
     * Gửi request GET đến server
     * @param {string} endpoint - API endpoint
     * @param {function} callback - Callback function (error, data)
     */
    get(endpoint, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.apiBaseUrl + endpoint, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        callback(null, data);
                    } catch (e) {
                        callback(e, null);
                    }
                } else {
                    callback(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`), null);
                }
            }
        };
        
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
        xhr.open('POST', this.apiBaseUrl + endpoint, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 201) {
                    try {
                        const responseData = JSON.parse(xhr.responseText);
                        callback(null, responseData);
                    } catch (e) {
                        callback(e, null);
                    }
                } else {
                    callback(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`), null);
                }
            }
        };
        
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