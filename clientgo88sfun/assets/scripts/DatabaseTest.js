cc.Class({
    extends: cc.Component,

    properties: {
        testButton: cc.Button,
        resultLabel: cc.Label
    },

    onLoad() {
        if (this.testButton) {
            this.testButton.node.on('click', this.runDatabaseTest, this);
        }
    },

    runDatabaseTest() {
        this.updateResult("Đang kiểm tra kết nối database...");
        
        // Test 1: Health check
        this.testHealthCheck(() => {
            // Test 2: Create test player
            this.testCreatePlayer(() => {
                // Test 3: Get player data
                this.testGetPlayer(() => {
                    // Test 4: Save score
                    this.testSaveScore(() => {
                        // Test 5: Get leaderboard
                        this.testLeaderboard(() => {
                            this.updateResult("✅ Tất cả tests đều thành công! Database hoạt động bình thường.");
                        });
                    });
                });
            });
        });
    },

    testHealthCheck(callback) {
        this.updateResult("🔍 Test 1: Kiểm tra server health...");
        
        if (!window.DatabaseManager) {
            this.updateResult("❌ DatabaseManager không tồn tại!");
            return;
        }

        window.DatabaseManager.get('/health', (error, data) => {
            if (error) {
                this.updateResult(`❌ Health check failed: ${error.message}`);
                return;
            }
            
            this.updateResult("✅ Test 1: Server health OK");
            callback();
        });
    },

    testCreatePlayer(callback) {
        this.updateResult("🔍 Test 2: Tạo test player...");
        
        const testPlayerId = 'test_' + Date.now();
        const playerData = {
            name: 'Test Player',
            highScore: 100,
            level: 1,
            coins: 50
        };

        window.DatabaseManager.updatePlayerData(testPlayerId, playerData, (error, data) => {
            if (error) {
                this.updateResult(`❌ Create player failed: ${error.message}`);
                return;
            }
            
            this.testPlayerId = testPlayerId;
            this.updateResult("✅ Test 2: Tạo player thành công");
            callback();
        });
    },

    testGetPlayer(callback) {
        this.updateResult("🔍 Test 3: Lấy thông tin player...");
        
        window.DatabaseManager.getPlayerData(this.testPlayerId, (error, data) => {
            if (error) {
                this.updateResult(`❌ Get player failed: ${error.message}`);
                return;
            }
            
            this.updateResult("✅ Test 3: Lấy thông tin player thành công");
            callback();
        });
    },

    testSaveScore(callback) {
        this.updateResult("🔍 Test 4: Lưu điểm số...");
        
        window.DatabaseManager.savePlayerScore(this.testPlayerId, 150, (error, data) => {
            if (error) {
                this.updateResult(`❌ Save score failed: ${error.message}`);
                return;
            }
            
            this.updateResult("✅ Test 4: Lưu điểm số thành công");
            callback();
        });
    },

    testLeaderboard(callback) {
        this.updateResult("🔍 Test 5: Lấy bảng xếp hạng...");
        
        window.DatabaseManager.getLeaderboard(5, (error, data) => {
            if (error) {
                this.updateResult(`❌ Get leaderboard failed: ${error.message}`);
                return;
            }
            
            this.updateResult("✅ Test 5: Lấy bảng xếp hạng thành công");
            callback();
        });
    },

    updateResult(message) {
        console.log(message);
        if (this.resultLabel) {
            this.resultLabel.string = message;
        }
    }
});