cc.Class({
    extends: cc.Component,

    properties: {
        scoreLabel: cc.Label,
        playerNameInput: cc.EditBox,
        leaderboardContent: cc.Node
    },

    onLoad() {
        this.currentScore = 0;
        this.playerId = this.generatePlayerId();
        
        // Load player data khi game start
        this.loadPlayerData();
    },

    generatePlayerId() {
        // Tạo ID đơn giản, trong thực tế có thể dùng UUID hoặc user authentication
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    loadPlayerData() {
        if (window.DatabaseManager) {
            window.DatabaseManager.getPlayerData(this.playerId, (error, data) => {
                if (error) {
                    console.log('Player not found, creating new player');
                    this.createNewPlayer();
                } else {
                    console.log('Player data loaded:', data);
                    this.currentScore = data.highScore || 0;
                    this.updateScoreDisplay();
                }
            });
        }
    },

    createNewPlayer() {
        const playerData = {
            name: 'Anonymous',
            highScore: 0,
            level: 1,
            coins: 0,
            createdAt: Date.now()
        };

        if (window.DatabaseManager) {
            window.DatabaseManager.updatePlayerData(this.playerId, playerData, (error, data) => {
                if (error) {
                    console.error('Failed to create player:', error);
                } else {
                    console.log('New player created:', data);
                }
            });
        }
    },

    addScore(points) {
        this.currentScore += points;
        this.updateScoreDisplay();
        
        // Auto save score mỗi khi có điểm mới
        this.saveScore();
    },

    saveScore() {
        if (window.DatabaseManager) {
            window.DatabaseManager.savePlayerScore(this.playerId, this.currentScore, (error, data) => {
                if (error) {
                    console.error('Failed to save score:', error);
                } else {
                    console.log('Score saved successfully:', data);
                }
            });
        }
    },

    updateScoreDisplay() {
        if (this.scoreLabel) {
            this.scoreLabel.string = 'Score: ' + this.currentScore;
        }
    },

    onLeaderboardButtonClick() {
        this.loadLeaderboard();
    },

    loadLeaderboard() {
        if (window.DatabaseManager) {
            window.DatabaseManager.getLeaderboard(10, (error, data) => {
                if (error) {
                    console.error('Failed to load leaderboard:', error);
                } else {
                    console.log('Leaderboard loaded:', data);
                    this.displayLeaderboard(data);
                }
            });
        }
    },

    displayLeaderboard(leaderboardData) {
        // Clear existing leaderboard
        this.leaderboardContent.removeAllChildren();
        
        // Display top players
        leaderboardData.forEach((player, index) => {
            const playerNode = new cc.Node();
            const label = playerNode.addComponent(cc.Label);
            label.string = `${index + 1}. ${player.name}: ${player.score}`;
            label.fontSize = 24;
            
            playerNode.parent = this.leaderboardContent;
            playerNode.y = -index * 30;
        });
    },

    onSavePlayerNameClick() {
        const playerName = this.playerNameInput.string;
        if (playerName.trim()) {
            const playerData = {
                name: playerName,
                highScore: this.currentScore,
                updatedAt: Date.now()
            };

            if (window.DatabaseManager) {
                window.DatabaseManager.updatePlayerData(this.playerId, playerData, (error, data) => {
                    if (error) {
                        console.error('Failed to update player name:', error);
                    } else {
                        console.log('Player name updated:', data);
                    }
                });
            }
        }
    }
});