// ========================================
// ROUTE — Analytics
// ========================================
import { Router } from 'express';
import db from '../db.js';
import { verifyToken } from '../auth.js';

const router = Router();

// GET /api/analytics/dashboard (protected)
router.get('/dashboard', verifyToken, (req, res) => {
    const totalProjects = db.prepare('SELECT COUNT(*) as c FROM projects').get().c;
    const totalBlogs = db.prepare('SELECT COUNT(*) as c FROM blogs').get().c;
    const publishedBlogs = db.prepare(`SELECT COUNT(*) as c FROM blogs WHERE status = 'published'`).get().c;
    const totalViews = db.prepare('SELECT SUM(read_count) as c FROM blogs').get().c || 0;
    const unreadMessages = db.prepare(`SELECT COUNT(*) as c FROM contact_submissions WHERE status = 'unread'`).get().c;
    const totalMessages = db.prepare('SELECT COUNT(*) as c FROM contact_submissions').get().c;
    const topBlogs = db.prepare(`SELECT id, title, slug, category, read_count FROM blogs WHERE status = 'published' ORDER BY read_count DESC LIMIT 5`).all();
    const recentBlogs = db.prepare(`SELECT id, title, slug, category, created_at FROM blogs ORDER BY created_at DESC LIMIT 5`).all();
    const recentMessages = db.prepare('SELECT id, name, email, subject, status, created_at FROM contact_submissions ORDER BY created_at DESC LIMIT 5').all();
    const totalMedia = db.prepare('SELECT COUNT(*) as c FROM media').get().c;
    const experience = db.prepare('SELECT COUNT(*) as c FROM experience').get().c;

    res.json({
        stats: { totalProjects, totalBlogs, publishedBlogs, totalViews, unreadMessages, totalMessages, totalMedia, experience },
        topBlogs,
        recentBlogs,
        recentMessages,
    });
});

// GET /api/analytics/activity (protected)
router.get('/activity', verifyToken, (req, res) => {
    const rows = db.prepare('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT 50').all();
    res.json(rows);
});

export default router;
