# Enterprise Portfolio & CMS Codebase Architecture

This repository is organized following industry-standard web engineering practices for a **Full-Stack Multi-Page Web Portfolio & Headless CMS System** powered by Node.js, Express, SQLite (`node:sqlite`), HTML5, CSS3, JavaScript, and Vite.

---

## 📁 Active & Standardized Directory Structure

```text
abirhassan/
├── public/                 # Canonical Static Asset Directory (Served by Vite & Express)
│   └── assets/
│       ├── frames/         # 300 sequential animation frames (ezgif-frame-001.jpg .. 300.jpg)
│       ├── images/         # Static images (daffodilgroup.jpg, dsl.png)
│       ├── css/            # Central design system stylesheet (portfolio.css)
│       └── js/             # Shared animation script (canvas-animation.js)
│
├── server/                 # Express CMS Backend API & Database
│   ├── index.js            # Express server entry point (Port 3000)
│   ├── db.js               # SQLite database interface (node:sqlite DatabaseSync)
│   ├── seed.js             # Initial database seeder script
│   ├── portfolio.db        # SQLite database storage
│   ├── routes/             # RESTful API Endpoints (/api/*)
│   │   ├── auth.js, hero.js, projects.js, blogs.js, skills.js
│   │   ├── experience.js, education.js, media.js, contact.js
│   │   ├── settings.js, analytics.js, navigation.js, testimonials.js
│   └── uploads/            # Media upload storage directory
│
├── admin/                  # CMS Admin Control Panel (/admin)
│   ├── index.html          # Admin Dashboard SPA interface
│   ├── admin.js            # Admin panel API client logic
│   └── admin.css           # Admin styling & dashboard layout
│
├── scripts/                # Active Utility Scripts
│   └── generate_frames.js  # Frame asset generator
│
├── [HTML Frontend Entry Points]  # Modular Multi-Page App (MPA) Pages
│   ├── index.html          # Homepage
│   ├── about.html          # Bio & Impact Summary
│   ├── experience.html     # Career Journey
│   ├── qa-testing.html     # QA Engineering & Tool Stack
│   ├── pm-details.html     # Project Management & Agile Leadership
│   ├── projects.html       # Enterprise, Govt, EdTech & Web App Projects
│   ├── web-dev.html        # Web Engineering & Technologies
│   ├── blog.html           # Articles Listing with Search & Filters
│   ├── blog-detail.html    # Single Article Reader
│   └── contact.html        # Interactive Contact Form
│
├── vite.config.js          # Vite Multi-Page Rollup Input Configuration
├── package.json            # npm scripts & dependencies
└── PROJECT_STRUCTURE.md    # Architecture & Directory documentation
```

---

## 🛠️ Key Standards

1. **Zero Unnecessary/Duplicate Code**: Completely removed legacy duplicate files (`src/legacy`, `scripts/archive`, duplicate frames in `public/sequence` & `src/image`).
2. **Canonical Assets**: All static assets (300 frames, images, styles, JS) are housed exclusively under `/public/assets/`.
3. **Modular MPA Pages**: 10 clean HTML entry points linking to central `portfolio.css` and `canvas-animation.js`.
4. **Headless CMS Backend**: Express server with native `node:sqlite` database bindings serving REST APIs on port 3000 and an admin dashboard under `/admin`.
