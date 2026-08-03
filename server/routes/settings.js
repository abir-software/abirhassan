// ========================================
// ROUTE — Settings
// ========================================
import { Router } from 'express';
import db from '../db.js';
import { verifyToken } from '../auth.js';

const router = Router();

// GET /api/settings (public — for frontend theme)
router.get('/', (req, res) => {
    const rows = db.prepare('SELECT key, value FROM settings').all();
    const settings = {};
    rows.forEach(r => { settings[r.key] = r.value; });
    res.json(settings);
});

// PUT /api/settings (protected — update multiple)
router.put('/', verifyToken, (req, res) => {
    const ins = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?,?)');
    const update = db.transaction((data) => {
        Object.entries(data).forEach(([key, value]) => ins.run(key, String(value)));
    });
    update(req.body);
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('update', 'Settings updated');
    res.json({ success: true });
});

// PUT /api/settings/:key (protected — single key)
router.put('/:key', verifyToken, (req, res) => {
    const { value } = req.body;
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?,?)').run(req.params.key, String(value));
    res.json({ success: true });
});

// GET /api/settings/backup (protected)
router.get('/export-all', verifyToken, (req, res) => {
    const tables = ['users', 'hero', 'expertise', 'competencies', 'qa_expertise', 'qa_tools', 'pm_responsibilities', 'pm_docs', 'projects', 'experience', 'web_skills', 'workflow_steps', 'education', 'certifications', 'blogs', 'media', 'contact_submissions', 'settings', 'navigation', 'testimonials'];
    const backup = {};
    tables.forEach(table => {
        backup[table] = db.prepare(`SELECT * FROM ${table}`).all();
    });
    res.json(backup);
});

// POST /api/settings/import-all (protected)
router.post('/import-all', verifyToken, (req, res) => {
    const data = req.body;
    const update = db.transaction((payload) => {
        Object.entries(payload).forEach(([table, rows]) => {
            db.prepare(`DELETE FROM ${table}`).run();
            if (rows.length > 0) {
                const columns = Object.keys(rows[0]).join(',');
                const placeholders = Object.keys(rows[0]).map(() => '?').join(',');
                const ins = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);
                rows.forEach(row => ins.run(...Object.values(row)));
            }
        });
    });
    update(data);
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('import', 'Full database restore from backup');
    res.json({ success: true });
});

// POST /api/settings/track (public)
router.post('/track', (req, res) => {
    const { url } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ua = req.headers['user-agent'];
    db.prepare('INSERT INTO visitors (ip_hash, user_agent, page_url) VALUES (?, ?, ?)')
        .run(ip, ua, url);
    res.json({ success: true });
});

export default router;
