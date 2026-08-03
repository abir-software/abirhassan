// ========================================
// ROUTE — Experience
// ========================================
import { Router } from 'express';
import db from '../db.js';
import { verifyToken } from '../auth.js';

const router = Router();

function parseExp(e) {
    if (!e) return null;
    e.responsibilities = JSON.parse(e.responsibilities || '[]');
    e.skills = JSON.parse(e.skills || '[]');
    e.is_current = !!e.is_current;
    return e;
}

// GET /api/experience (public)
router.get('/', (req, res) => {
    const rows = db.prepare('SELECT * FROM experience ORDER BY sort_order ASC').all().map(parseExp);
    res.json(rows);
});

// GET /api/experience/:id
router.get('/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM experience WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(parseExp(row));
});

// POST /api/experience (protected)
router.post('/', verifyToken, (req, res) => {
    const { role, company, duration, responsibilities, skills, is_current, sort_order } = req.body;
    const result = db.prepare(`INSERT INTO experience (role, company, duration, responsibilities, skills, is_current, sort_order) VALUES (?,?,?,?,?,?,?)`)
        .run(role, company, duration, JSON.stringify(responsibilities || []), JSON.stringify(skills || []), is_current ? 1 : 0, sort_order || 0);
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('create', `Experience added: ${role} at ${company}`);
    res.json({ id: result.lastInsertRowid, success: true });
});

// PUT /api/experience/:id (protected)
router.put('/:id', verifyToken, (req, res) => {
    const { role, company, duration, responsibilities, skills, is_current, sort_order } = req.body;
    db.prepare(`UPDATE experience SET role=?,company=?,duration=?,responsibilities=?,skills=?,is_current=?,sort_order=? WHERE id=?`)
        .run(role, company, duration, JSON.stringify(responsibilities || []), JSON.stringify(skills || []), is_current ? 1 : 0, sort_order || 0, req.params.id);
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('update', `Experience updated: ${role}`);
    res.json({ success: true });
});

// DELETE /api/experience/:id (protected)
router.delete('/:id', verifyToken, (req, res) => {
    db.prepare('DELETE FROM experience WHERE id = ?').run(req.params.id);
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('delete', `Experience entry deleted`);
    res.json({ success: true });
});

export default router;
