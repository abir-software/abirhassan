// ========================================
// ROUTE — Auth
// ========================================
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { generateToken } from '../auth.js';

const router = Router();

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken({ id: user.id, username: user.username, role: user.role });
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('login', `User ${username} logged in`);
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// POST /api/auth/change-password
router.post('/change-password', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    if (!user || !bcrypt.compareSync(oldPassword, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const hash = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password_hash = ? WHERE username = ?').run(hash, username);
    res.json({ success: true });
});

export default router;
