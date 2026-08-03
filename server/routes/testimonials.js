import { Router } from 'express';
import db from '../db.js';
import { verifyToken } from '../auth.js';

const router = Router();

// GET /api/testimonials
router.get('/', (req, res) => {
    const rows = db.prepare('SELECT * FROM testimonials ORDER BY sort_order').all();
    res.json(rows);
});

// POST /api/testimonials (protected)
router.post('/', verifyToken, (req, res) => {
    const { name, role, company, content, avatar, sort_order } = req.body;
    const result = db.prepare('INSERT INTO testimonials (name, role, company, content, avatar, sort_order) VALUES (?, ?, ?, ?, ?, ?)')
        .run(name, role, company, content, avatar, sort_order || 0);
    res.json({ id: result.lastInsertRowid, success: true });
});

// PUT /api/testimonials/:id (protected)
router.put('/:id', verifyToken, (req, res) => {
    const { name, role, company, content, avatar, sort_order } = req.body;
    db.prepare('UPDATE testimonials SET name=?, role=?, company=?, content=?, avatar=?, sort_order=? WHERE id=?')
        .run(name, role, company, content, avatar, sort_order, req.params.id);
    res.json({ success: true });
});

// DELETE /api/testimonials/:id (protected)
router.delete('/:id', verifyToken, (req, res) => {
    db.prepare('DELETE FROM testimonials WHERE id=?').run(req.params.id);
    res.json({ success: true });
});

export default router;
