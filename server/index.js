// ========================================
// SERVER — Express App Entry Point
// ========================================
import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

// Routes
import authRouter from './routes/auth.js';
import heroRouter from './routes/hero.js';
import projectsRouter from './routes/projects.js';
import blogsRouter from './routes/blogs.js';
import skillsRouter from './routes/skills.js';
import experienceRouter from './routes/experience.js';
import educationRouter from './routes/education.js';
import mediaRouter from './routes/media.js';
import contactRouter from './routes/contact.js';
import settingsRouter from './routes/settings.js';
import analyticsRouter from './routes/analytics.js';
import navigationRouter from './routes/navigation.js';
import testimonialsRouter from './routes/testimonials.js';

// Seed DB on first run
import './seed.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// ─── Ensure uploads dir exists ───────────────────────────
const uploadsDir = join(__dirname, 'uploads');
if (!existsSync(uploadsDir)) mkdirSync(uploadsDir, { recursive: true });

// ─── Middleware ──────────────────────────────────────────
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ─── Serve uploaded files ────────────────────────────────
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// ─── API Routes ──────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/hero', heroRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/education', educationRouter);
app.use('/api/media', mediaRouter);
app.use('/api/contact', contactRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/navigation', navigationRouter);
app.use('/api/testimonials', testimonialsRouter);

// ─── Serve Admin Panel ───────────────────────────────────
app.use('/admin', express.static(join(__dirname, '..', 'admin')));
<<<<<<< HEAD
app.get('/admin/*splat', (req, res) => {
=======
app.get(/^\/admin\/.*/, (req, res) => {
>>>>>>> 97f4252ba0c4d47601da500065e003c85928117a
    res.sendFile(join(__dirname, '..', 'admin', 'index.html'));
});

// ─── Serve Frontend (dist or root) ───────────────────────
const distDir = join(__dirname, '..', 'dist');
const publicDir = join(__dirname, '..', 'public');
if (existsSync(distDir)) {
    app.use(express.static(distDir));
<<<<<<< HEAD
    app.get('{*splat}', (req, res) => {
=======
    app.get(/^.*$/, (req, res) => {
>>>>>>> 97f4252ba0c4d47601da500065e003c85928117a
        if (!req.path.startsWith('/api') && !req.path.startsWith('/admin')) {
            res.sendFile(join(distDir, 'index.html'));
        }
    });
} else {
    // Dev mode: serve public + root static
    app.use(express.static(join(__dirname, '..')));
}

// ─── Error Handler ───────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('❌', err.message);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// ─── Start ───────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 Portfolio CMS Server running on http://localhost:${PORT}`);
    console.log(`   Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`   API Base:    http://localhost:${PORT}/api\n`);
});
