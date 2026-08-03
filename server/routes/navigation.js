import { Router } from 'express';
import db from '../db.js';
import { verifyToken } from '../auth.js';

const router = Router();

// GET /api/navigation
router.get('/', (req, res) => {
    const rows = db.prepare('SELECT * FROM navigation ORDER BY location, sort_order').all();
    res.json(rows);
});

// POST /api/navigation (protected)
router.post('/', verifyToken, (req, res) => {
    const { label, url, location, sort_order } = req.body;
    const result = db.prepare('INSERT INTO navigation (label, url, location, sort_order) VALUES (?, ?, ?, ?)')
        .run(label, url, location || 'header', sort_order || 0);
    res.json({ id: result.lastInsertRowid, success: true });
});

// PUT /api/navigation/:id (protected)
router.put('/:id', verifyToken, (req, res) => {
    const { label, url, location, sort_order } = req.body;
    db.prepare('UPDATE navigation SET label=?, url=?, location=?, sort_order=? WHERE id=?')
        .run(label, url, location, sort_order, req.params.id);
    res.json({ success: true });
});

// DELETE /api/navigation/:id (protected)
router.delete('/:id', verifyToken, (req, res) => {
    db.prepare('DELETE FROM navigation WHERE id=?').run(req.params.id);
    res.json({ success: true });
});

export default router;
