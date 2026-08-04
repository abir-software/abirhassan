// ========================================
// ROUTE — Experience
// ========================================
import { Router } from 'express';
import db from '../db.js';
import { verifyToken } from '../auth.js';

const router = Router();

function parseExp(e) {
    if (!e) return null;
    try {
        e.responsibilities = typeof e.responsibilities === 'string' ? JSON.parse(e.responsibilities || '[]') : (e.responsibilities || []);
    } catch (err) {
        e.responsibilities = e.responsibilities ? [e.responsibilities] : [];
    }
    try {
        e.skills = typeof e.skills === 'string' ? JSON.parse(e.skills || '[]') : (e.skills || []);
    } catch (err) {
        e.skills = e.skills ? [e.skills] : [];
    }
    e.is_current = !!e.is_current;
    return e;
}

// GET /api/experience (public)
router.get('/', (req, res) => {
    const rows = db.prepare('SELECT * FROM experience ORDER BY sort_order ASC, id ASC').all().map(parseExp);
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
    const { role, company, location, duration, badge, logo, description, responsibilities, skills, is_current, sort_order } = req.body;
    const respJSON = JSON.stringify(Array.isArray(responsibilities) ? responsibilities : (responsibilities ? String(responsibilities).split('\n').filter(Boolean) : []));
    const skillsJSON = JSON.stringify(Array.isArray(skills) ? skills : (skills ? String(skills).split(',').map(s => s.trim()).filter(Boolean) : []));

    const result = db.prepare(`
        INSERT INTO experience (role, company, location, duration, badge, logo, description, responsibilities, skills, is_current, sort_order)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
    `).run(role, company, location || '', duration || '', badge || '', logo || '', description || '', respJSON, skillsJSON, is_current ? 1 : 0, sort_order || 0);

    try { db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('create', `Experience added: ${role} at ${company}`); } catch(e){}
    res.json({ id: result.lastInsertRowid, success: true });
});

// PUT /api/experience/:id (protected)
router.put('/:id', verifyToken, (req, res) => {
    const { role, company, location, duration, badge, logo, description, responsibilities, skills, is_current, sort_order } = req.body;
    const respJSON = JSON.stringify(Array.isArray(responsibilities) ? responsibilities : (responsibilities ? String(responsibilities).split('\n').filter(Boolean) : []));
    const skillsJSON = JSON.stringify(Array.isArray(skills) ? skills : (skills ? String(skills).split(',').map(s => s.trim()).filter(Boolean) : []));

    db.prepare(`
        UPDATE experience SET role=?, company=?, location=?, duration=?, badge=?, logo=?, description=?, responsibilities=?, skills=?, is_current=?, sort_order=?
        WHERE id=?
    `).run(role, company, location || '', duration || '', badge || '', logo || '', description || '', respJSON, skillsJSON, is_current ? 1 : 0, sort_order || 0, req.params.id);

    try { db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('update', `Experience updated: ${role}`); } catch(e){}
    res.json({ success: true });
});

// DELETE /api/experience/:id (protected)
router.delete('/:id', verifyToken, (req, res) => {
    db.prepare('DELETE FROM experience WHERE id = ?').run(req.params.id);
    try { db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('delete', `Experience entry deleted`); } catch(e){}
    res.json({ success: true });
});

export default router;
