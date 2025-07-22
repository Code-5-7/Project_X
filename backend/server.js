const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Kamau004', // Update with your MySQL password
    database: 'finance_tracker'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected');
});

const FLAGGED_CATEGORIES = ['gambling', 'casino', 'lottery'];

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
            if (err) return res.status(400).json({ error: err.message });
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });
        res.json({ userId: user.id, message: 'Login successful' });
    });
});

app.post('/api/transactions', (req, res) => {
    const { user_id, goal_id, amount, category, date, description } = req.body;
    const isFlagged = FLAGGED_CATEGORIES.includes(category.toLowerCase());
    const flagMessage = isFlagged ? 'Warning: This transaction is in a flagged category (e.g., gambling).' : null;

    db.query(
        'INSERT INTO transactions (user_id, goal_id, amount, category, date, description, is_flagged) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user_id, goal_id || null, amount, category, date, description, isFlagged],
        (err, result) => {
            if (err) return res.status(400).json({ error: err.message });
            if (goal_id && amount > 0) {
                db.query(
                    'UPDATE goals SET current_amount = current_amount + ? WHERE id = ? AND user_id = ?',
                    [amount, goal_id, user_id],
                    (err) => {
                        if (err) return res.status(400).json({ error: err.message });
                        res.status(201).json({ message: 'Transaction added successfully', flagMessage });
                    }
                );
            } else {
                res.status(201).json({ message: 'Transaction added successfully', flagMessage });
            }
        }
    );
});

app.put('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    const { user_id, goal_id, amount, category, date, description } = req.body;
    const isFlagged = FLAGGED_CATEGORIES.includes(category.toLowerCase());

    // Fetch original transaction to check previous goal_id and amount
    db.query('SELECT goal_id, amount FROM transactions WHERE id = ? AND user_id = ?', [id, user_id], (err, results) => {
        if (err) return res.status(400).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Transaction not found' });
        const { goal_id: oldGoalId, amount: oldAmount } = results[0];

        // Update transaction
        db.query(
            'UPDATE transactions SET goal_id = ?, amount = ?, category = ?, date = ?, description = ?, is_flagged = ? WHERE id = ? AND user_id = ?',
            [goal_id || null, amount, category, date, description, isFlagged, id, user_id],
            (err) => {
                if (err) return res.status(400).json({ error: err.message });

                // Adjust goal current_amount if necessary
                if (oldGoalId && oldAmount > 0) {
                    db.query('UPDATE goals SET current_amount = current_amount - ? WHERE id = ?', [oldAmount, oldGoalId]);
                }
                if (goal_id && amount > 0) {
                    db.query('UPDATE goals SET current_amount = current_amount + ? WHERE id = ? AND user_id = ?', [amount, goal_id, user_id]);
                }
                res.json({ message: 'Transaction updated successfully' });
            }
        );
    });
});

app.delete('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT user_id, goal_id, amount FROM transactions WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(400).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Transaction not found' });
        const { user_id, goal_id, amount } = results[0];

        db.query('DELETE FROM transactions WHERE id = ?', [id], (err) => {
            if (err) return res.status(400).json({ error: err.message });
            if (goal_id && amount > 0) {
                db.query('UPDATE goals SET current_amount = current_amount - ? WHERE id = ? AND user_id = ?', [amount, goal_id, user_id]);
            }
            res.json({ message: 'Transaction deleted successfully' });
        });
    });
});

app.get('/api/transactions/:userId', (req, res) => {
    const { userId } = req.params;
    db.query(
        'SELECT t.id, t.amount, t.category, t.date, t.description, t.is_flagged, t.goal_id, g.description AS goal_description ' +
        'FROM transactions t LEFT JOIN goals g ON t.goal_id = g.id WHERE t.user_id = ?',
        [userId],
        (err, results) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json(results);
        }
    );
});

app.get('/api/summary/:userId', (req, res) => {
    const { userId } = req.params;
    db.query(
        'SELECT SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as income, SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) as expenses FROM transactions WHERE user_id = ?',
        [userId],
        (err, results) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json(results[0]);
        }
    );
});

app.post('/api/goals', (req, res) => {
    const { user_id, target_amount, description } = req.body;
    db.query(
        'INSERT INTO goals (user_id, target_amount, description, current_amount) VALUES (?, ?, ?, 0)',
        [user_id, target_amount, description],
        (err) => {
            if (err) return res.status(400).json({ error: err.message });
            res.status(201).json({ message: 'Goal added successfully' });
        }
    );
});

app.get('/api/goals/:userId', (req, res) => {
    const { userId } = req.params;
    db.query('SELECT id, target_amount, current_amount, description FROM goals WHERE user_id = ?', [userId], (err, results) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(results);
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));