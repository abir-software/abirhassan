// ========================================
// ROUTE — Contact
// ========================================
import { Router } from 'express';
import db from '../db.js';
import { verifyToken } from '../auth.js';

const router = Router();

// POST /api/contact (public — from frontend form)
router.post('/', (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'name, email and message required' });
    db.prepare('INSERT INTO contact_submissions (name, email, subject, message) VALUES (?,?,?,?)').run(name, email, subject || '', message);
    res.json({ success: true, message: 'Message received!' });
});

// GET /api/contact (protected — admin)
router.get('/', verifyToken, (req, res) => {
    const { status } = req.query;
    const rows = status
        ? db.prepare('SELECT * FROM contact_submissions WHERE status = ? ORDER BY created_at DESC').all(status)
        : db.prepare('SELECT * FROM contact_submissions ORDER BY created_at DESC').all();
    res.json(rows);
});

// PUT /api/contact/:id/status (protected)
router.put('/:id/status', verifyToken, (req, res) => {
    const { status } = req.body;
    db.prepare('UPDATE contact_submissions SET status = ? WHERE id = ?').run(status, req.params.id);
    res.json({ success: true });
});

// DELETE /api/contact/:id (protected)
router.delete('/:id', verifyToken, (req, res) => {
    db.prepare('DELETE FROM contact_submissions WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

export default router;
