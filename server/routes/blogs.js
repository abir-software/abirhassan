// ========================================
// ROUTE — Blogs
// ========================================
import { Router } from 'express';
import db from '../db.js';
import { verifyToken } from '../auth.js';

const router = Router();

// GET /api/blogs (public — only published unless admin)
router.get('/', (req, res) => {
    const { category, status, featured, top_reading, search, page = 1, limit = 10 } = req.query;
    let query = 'SELECT id, title, slug, excerpt, category, image, featured, top_reading, status, read_count, created_at FROM blogs';
    const params = [];
    const conditions = ['status = "published"'];

    if (category) { conditions.push('category = ?'); params.push(category); }
    if (featured === 'true') { conditions.push('featured = 1'); }
    if (top_reading === 'true') { conditions.push('top_reading = 1'); }
    if (search) { conditions.push('(title LIKE ? OR excerpt LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }

    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY created_at DESC';

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const countQuery = query.replace('SELECT id, title, slug, excerpt, category, image, featured, top_reading, status, read_count, created_at FROM blogs', 'SELECT COUNT(*) as total FROM blogs');
    const total = db.prepare(countQuery).get(...params)?.total || 0;
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const rows = db.prepare(query).all(...params);
    res.json({ data: rows, total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) });
});

// GET /api/blogs/all (protected — admin sees drafts too)
router.get('/all', verifyToken, (req, res) => {
    const rows = db.prepare('SELECT id, title, slug, excerpt, category, image, featured, top_reading, status, read_count, meta_title, meta_desc, created_at, updated_at FROM blogs ORDER BY created_at DESC').all();
    res.json(rows);
});

// GET /api/blogs/categories/list — MUST be before /:slugOrId
router.get('/categories/list', (req, res) => {
    const rows = db.prepare(`SELECT DISTINCT category FROM blogs WHERE status = 'published' AND category IS NOT NULL ORDER BY category`).all();
    res.json(rows.map(r => r.category));
});

// POST /api/blogs (protected)
router.post('/', verifyToken, (req, res) => {
    const { title, slug, excerpt, content, category, image, featured, top_reading, status, meta_title, meta_desc } = req.body;
    if (!title || !slug) return res.status(400).json({ error: 'Title and slug required' });
    try {
        const result = db.prepare(`INSERT INTO blogs (title, slug, excerpt, content, category, image, featured, top_reading, status, meta_title, meta_desc) VALUES (?,?,?,?,?,?,?,?,?,?,?)`)
            .run(title, slug, excerpt, content, category, image || null, featured ? 1 : 0, top_reading ? 1 : 0, status || 'draft', meta_title, meta_desc);
        db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('create', `Blog created: ${title}`);
        res.json({ id: result.lastInsertRowid, success: true });
    } catch (e) {
        res.status(400).json({ error: 'Slug already exists' });
    }
});

// GET /api/blogs/:slugOrId (public)
router.get('/:slugOrId', (req, res) => {
    const { slugOrId } = req.params;
    const isId = /^\d+$/.test(slugOrId);
    const row = isId
        ? db.prepare('SELECT * FROM blogs WHERE id = ?').get(parseInt(slugOrId))
        : db.prepare('SELECT * FROM blogs WHERE slug = ?').get(slugOrId);
    if (!row) return res.status(404).json({ error: 'Blog not found' });
    // Increment read count
    db.prepare('UPDATE blogs SET read_count = read_count + 1 WHERE id = ?').run(row.id);
    res.json(row);
});

// PUT /api/blogs/:id (protected)
router.put('/:id', verifyToken, (req, res) => {
    const { title, slug, excerpt, content, category, image, featured, top_reading, status, meta_title, meta_desc } = req.body;
    db.prepare(`UPDATE blogs SET title=?,slug=?,excerpt=?,content=?,category=?,image=?,featured=?,top_reading=?,status=?,meta_title=?,meta_desc=?,updated_at=datetime('now') WHERE id=?`)
        .run(title, slug, excerpt, content, category, image || null, featured ? 1 : 0, top_reading ? 1 : 0, status || 'draft', meta_title, meta_desc, req.params.id);
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('update', `Blog updated: ${title}`);
    res.json({ success: true });
});

// DELETE /api/blogs/:id (protected)
router.delete('/:id', verifyToken, (req, res) => {
    const row = db.prepare('SELECT title FROM blogs WHERE id = ?').get(req.params.id);
    db.prepare('DELETE FROM blogs WHERE id = ?').run(req.params.id);
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('delete', `Blog deleted: ${row?.title}`);
    res.json({ success: true });
});

export default router;
