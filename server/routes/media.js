// ========================================
// ROUTE — Media Library
// ========================================
import { Router } from 'express';
import multer from 'multer';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';
import { unlink } from 'fs/promises';
import db from '../db.js';
import { verifyToken } from '../auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${unique}${extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        const allowed = ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg', '.pdf'];
        if (allowed.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    },
});

const router = Router();

// GET /api/media (protected)
router.get('/', verifyToken, (req, res) => {
    const { folder } = req.query;
    const rows = folder
        ? db.prepare('SELECT * FROM media WHERE folder = ? ORDER BY created_at DESC').all(folder)
        : db.prepare('SELECT * FROM media ORDER BY created_at DESC').all();
    res.json(rows);
});

// GET /api/media/folders (protected)
router.get('/folders', verifyToken, (req, res) => {
    const rows = db.prepare('SELECT DISTINCT folder FROM media ORDER BY folder').all();
    res.json(rows.map(r => r.folder));
});

// POST /api/media/upload (protected, single file)
router.post('/upload', verifyToken, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const folder = req.body.folder || 'general';
    const result = db.prepare('INSERT INTO media (filename, original_name, folder, size, mimetype) VALUES (?,?,?,?,?)')
        .run(req.file.filename, req.file.originalname, folder, req.file.size, req.file.mimetype);
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('upload', `Media uploaded: ${req.file.originalname}`);
    res.json({
        id: result.lastInsertRowid,
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        original_name: req.file.originalname,
        size: req.file.size,
    });
});

// POST /api/media/upload-multiple (protected)
router.post('/upload-multiple', verifyToken, upload.array('files', 20), (req, res) => {
    const folder = req.body.folder || 'general';
    const uploaded = (req.files || []).map(file => {
        const result = db.prepare('INSERT INTO media (filename, original_name, folder, size, mimetype) VALUES (?,?,?,?,?)')
            .run(file.filename, file.originalname, folder, file.size, file.mimetype);
        return { id: result.lastInsertRowid, filename: file.filename, url: `/uploads/${file.filename}` };
    });
    res.json(uploaded);
});

// DELETE /api/media/:id (protected)
router.delete('/:id', verifyToken, async (req, res) => {
    const row = db.prepare('SELECT filename FROM media WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Not found' });
    try {
        await unlink(join(UPLOAD_DIR, row.filename));
    } catch { /* file may already be missing */ }
    db.prepare('DELETE FROM media WHERE id = ?').run(req.params.id);
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('delete', `Media deleted: ${row.filename}`);
    res.json({ success: true });
});

export default router;
