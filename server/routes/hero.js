// ========================================
// ROUTE — Hero
// ========================================
import { Router } from 'express';
import db from '../db.js';
import { verifyToken } from '../auth.js';

const router = Router();

// GET /api/hero (public)
router.get('/', (req, res) => {
    const hero = db.prepare('SELECT * FROM hero WHERE id = 1').get();
    if (!hero) return res.status(404).json({ error: 'Hero data not found' });
    hero.titles = JSON.parse(hero.titles || '[]');
    hero.stats = JSON.parse(hero.stats || '[]');
    res.json(hero);
});

// PUT /api/hero (protected)
router.put('/', verifyToken, (req, res) => {
    const { name, role, company, summary, profile_image, titles, stats, cta_primary, cta_secondary } = req.body;
    const existing = db.prepare('SELECT id FROM hero WHERE id = 1').get();
    const titlesStr = JSON.stringify(titles || []);
    const statsStr = JSON.stringify(stats || []);
    if (existing) {
        db.prepare(`UPDATE hero SET name=?,role=?,company=?,summary=?,profile_image=?,titles=?,stats=?,cta_primary=?,cta_secondary=?,updated_at=datetime('now') WHERE id=1`)
            .run(name, role, company, summary, profile_image, titlesStr, statsStr, cta_primary, cta_secondary);
    } else {
        db.prepare(`INSERT INTO hero (id,name,role,company,summary,profile_image,titles,stats,cta_primary,cta_secondary) VALUES (1,?,?,?,?,?,?,?,?,?)`)
            .run(name, role, company, summary, profile_image, titlesStr, statsStr, cta_primary, cta_secondary);
    }
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('update', 'Hero section updated');
    res.json({ success: true });
});

export default router;
