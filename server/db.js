// ========================================
// DB — SQLite setup & schema
// ========================================
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'portfolio.db');

const db = new DatabaseSync(DB_PATH);

// Compatibility helpers for better-sqlite3 interface
db.pragma = (str) => {
  try { db.exec(`PRAGMA ${str}`); } catch (e) {}
};
db.transaction = (fn) => (...args) => {
  db.exec('BEGIN IMMEDIATE');
  try {
    const result = fn(...args);
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
};

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Schema ─────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS hero (
    id INTEGER PRIMARY KEY DEFAULT 1,
    name TEXT,
    role TEXT,
    company TEXT,
    summary TEXT,
    profile_image TEXT,
    titles TEXT,
    stats TEXT,
    cta_primary TEXT,
    cta_secondary TEXT,
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS expertise (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT,
    title TEXT,
    desc TEXT,
    mode TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS competencies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    value INTEGER,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS qa_expertise (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT,
    title TEXT,
    items TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS qa_tools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS pm_responsibilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT,
    title TEXT,
    desc TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS pm_docs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT,
    name TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    org TEXT,
    category TEXT,
    desc TEXT,
    tags TEXT,
    image TEXT,
    featured INTEGER DEFAULT 0,
    highlight INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS experience (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT,
    company TEXT,
    duration TEXT,
    responsibilities TEXT,
    skills TEXT,
    is_current INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS web_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS workflow_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS education (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT,
    degree TEXT,
    school TEXT,
    date TEXT,
    detail TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    icon TEXT,
    name TEXT,
    issuer TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    category TEXT,
    image TEXT,
    featured INTEGER DEFAULT 0,
    top_reading INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft',
    read_count INTEGER DEFAULT 0,
    meta_title TEXT,
    meta_desc TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    original_name TEXT,
    folder TEXT DEFAULT 'general',
    size INTEGER,
    mimetype TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    status TEXT DEFAULT 'unread',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS activity_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT,
    details TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS navigation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    location TEXT DEFAULT 'header', -- 'header' or 'footer'
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    content TEXT NOT NULL,
    avatar TEXT,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS visitors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_hash TEXT,
    user_agent TEXT,
    page_url TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export default db;
