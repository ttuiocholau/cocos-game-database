const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://ttuiocholau.netlify.app', 'https://ttuiocholau.github.io', 'https://*.netlify.app']
        : ['http://localhost:7456', 'http://127.0.0.1:7456'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const dbPath = path.join(__dirname, 'game.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
    // Players table
    db.run(`CREATE TABLE IF NOT EXISTS players (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL DEFAULT 'Anonymous',
        highScore INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        coins INTEGER DEFAULT 0,
        createdAt INTEGER,
        updatedAt INTEGER
    )`);

    // Scores table
    db.run(`CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playerId TEXT,
        score INTEGER,
        timestamp INTEGER,
        FOREIGN KEY(playerId) REFERENCES players(id)
    )`);
});

// API Routes

// Get player data
app.get('/api/player/:playerId', (req, res) => {
    const playerId = req.params.playerId;
    
    db.get('SELECT * FROM players WHERE id = ?', [playerId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Player not found' });
        }
    });
});

// Create or update player data
app.post('/api/player/:playerId', (req, res) => {
    const playerId = req.params.playerId;
    const { name, highScore, level, coins } = req.body;
    const updatedAt = Date.now();
    
    // Check if player exists
    db.get('SELECT * FROM players WHERE id = ?', [playerId], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (row) {
            // Update existing player
            db.run(`UPDATE players SET 
                name = COALESCE(?, name),
                highScore = COALESCE(?, highScore),
                level = COALESCE(?, level),
                coins = COALESCE(?, coins),
                updatedAt = ?
                WHERE id = ?`,
                [name, highScore, level, coins, updatedAt, playerId],
                function(err) {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    res.json({ message: 'Player updated successfully', playerId: playerId });
                }
            );
        } else {
            // Create new player
            const createdAt = Date.now();
            db.run(`INSERT INTO players (id, name, highScore, level, coins, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [playerId, name || 'Anonymous', highScore || 0, level || 1, coins || 0, createdAt, updatedAt],
                function(err) {
                    if (err) {
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    res.json({ message: 'Player created successfully', playerId: playerId });
                }
            );
        }
    });
});

// Save player score
app.post('/api/scores', (req, res) => {
    const { playerId, score, timestamp } = req.body;
    
    if (!playerId || score === undefined) {
        res.status(400).json({ error: 'playerId and score are required' });
        return;
    }
    
    const scoreTimestamp = timestamp || Date.now();
    
    db.run('INSERT INTO scores (playerId, score, timestamp) VALUES (?, ?, ?)',
        [playerId, score, scoreTimestamp],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Update player's high score if this score is higher
            db.run(`UPDATE players SET highScore = ?, updatedAt = ? 
                WHERE id = ? AND (highScore < ? OR highScore IS NULL)`,
                [score, scoreTimestamp, playerId, score],
                function(updateErr) {
                    if (updateErr) {
                        console.error('Failed to update high score:', updateErr);
                    }
                }
            );
            
            res.json({ 
                message: 'Score saved successfully', 
                scoreId: this.lastID,
                playerId: playerId,
                score: score
            });
        }
    );
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    
    db.all(`SELECT p.id, p.name, p.highScore as score, p.updatedAt
        FROM players p 
        WHERE p.highScore > 0
        ORDER BY p.highScore DESC 
        LIMIT ?`, [limit], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get player's score history
app.get('/api/player/:playerId/scores', (req, res) => {
    const playerId = req.params.playerId;
    const limit = parseInt(req.query.limit) || 20;
    
    db.all('SELECT * FROM scores WHERE playerId = ? ORDER BY timestamp DESC LIMIT ?',
        [playerId, limit], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: Date.now() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Database path: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});