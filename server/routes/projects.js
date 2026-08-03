// ========================================
// ROUTE — Projects
// ========================================
import { Router } from 'express';
import db from '../db.js';
import { verifyToken } from '../auth.js';

const router = Router();

function parseProject(p) {
    if (!p) return null;
    p.tags = JSON.parse(p.tags || '[]');
    p.featured = !!p.featured;
    p.highlight = !!p.highlight;
    return p;
}

// GET /api/projects (public)
router.get('/', (req, res) => {
    const { category, featured } = req.query;
    let query = 'SELECT * FROM projects';
    const params = [];
    const conditions = [];
    if (category && category !== 'all') { conditions.push('category = ?'); params.push(category); }
    if (featured === 'true') { conditions.push('featured = 1'); }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY sort_order ASC';
    const rows = db.prepare(query).all(...params).map(parseProject);
    res.json(rows);
});

// GET /api/projects/:id (public)
router.get('/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(parseProject(row));
});

// POST /api/projects (protected)
router.post('/', verifyToken, (req, res) => {
    const { title, org, category, desc, tags, image, featured, highlight, sort_order } = req.body;
    const result = db.prepare(`INSERT INTO projects (title, org, category, desc, tags, image, featured, highlight, sort_order) VALUES (?,?,?,?,?,?,?,?,?)`)
        .run(title, org, category, desc, JSON.stringify(tags || []), image || null, featured ? 1 : 0, highlight ? 1 : 0, sort_order || 0);
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('create', `Project created: ${title}`);
    res.json({ id: result.lastInsertRowid, success: true });
});

// PUT /api/projects/:id (protected)
router.put('/:id', verifyToken, (req, res) => {
    const { title, org, category, desc, tags, image, featured, highlight, sort_order } = req.body;
    db.prepare(`UPDATE projects SET title=?,org=?,category=?,desc=?,tags=?,image=?,featured=?,highlight=?,sort_order=? WHERE id=?`)
        .run(title, org, category, desc, JSON.stringify(tags || []), image || null, featured ? 1 : 0, highlight ? 1 : 0, sort_order || 0, req.params.id);
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('update', `Project updated: ${title}`);
    res.json({ success: true });
});

// DELETE /api/projects/:id (protected)
router.delete('/:id', verifyToken, (req, res) => {
    const row = db.prepare('SELECT title FROM projects WHERE id = ?').get(req.params.id);
    db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('delete', `Project deleted: ${row?.title}`);
    res.json({ success: true });
});

export default router;
