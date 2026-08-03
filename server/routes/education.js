// ========================================
// ROUTE — Education & Certifications
// ========================================
import { Router } from 'express';
import db from '../db.js';
import { verifyToken } from '../auth.js';

const router = Router();

// GET /api/education (public)
router.get('/', (req, res) => {
    const education = db.prepare('SELECT * FROM education ORDER BY sort_order').all();
    const certifications = db.prepare('SELECT * FROM certifications ORDER BY sort_order').all();
    res.json({ education, certifications });
});

// POST /api/education/degree (protected)
router.post('/degree', verifyToken, (req, res) => {
    const { icon, degree, school, date, detail, sort_order } = req.body;
    const result = db.prepare('INSERT INTO education (icon, degree, school, date, detail, sort_order) VALUES (?,?,?,?,?,?)').run(icon, degree, school, date, detail, sort_order || 0);
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('create', `Education added: ${degree}`);
    res.json({ id: result.lastInsertRowid, success: true });
});

// PUT /api/education/degree/:id (protected)
router.put('/degree/:id', verifyToken, (req, res) => {
    const { icon, degree, school, date, detail, sort_order } = req.body;
    db.prepare('UPDATE education SET icon=?,degree=?,school=?,date=?,detail=?,sort_order=? WHERE id=?').run(icon, degree, school, date, detail, sort_order || 0, req.params.id);
    res.json({ success: true });
});

// DELETE /api/education/degree/:id (protected)
router.delete('/degree/:id', verifyToken, (req, res) => {
    db.prepare('DELETE FROM education WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

// POST /api/education/cert (protected)
router.post('/cert', verifyToken, (req, res) => {
    const { icon, name, issuer, sort_order } = req.body;
    const result = db.prepare('INSERT INTO certifications (icon, name, issuer, sort_order) VALUES (?,?,?,?)').run(icon, name, issuer, sort_order || 0);
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('create', `Certification added: ${name}`);
    res.json({ id: result.lastInsertRowid, success: true });
});

// PUT /api/education/cert/:id (protected)
router.put('/cert/:id', verifyToken, (req, res) => {
    const { icon, name, issuer, sort_order } = req.body;
    db.prepare('UPDATE certifications SET icon=?,name=?,issuer=?,sort_order=? WHERE id=?').run(icon, name, issuer, sort_order || 0, req.params.id);
    res.json({ success: true });
});

// DELETE /api/education/cert/:id (protected)
router.delete('/cert/:id', verifyToken, (req, res) => {
    db.prepare('DELETE FROM certifications WHERE id = ?').run(req.params.id);
    res.json({ success: true });
});

export default router;
