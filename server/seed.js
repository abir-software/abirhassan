// ========================================
// SEED — Populate DB with existing data
// ========================================
import bcrypt from 'bcryptjs';
import db from './db.js';

console.log('🌱 Seeding database...');

// ─── Admin User ──────────────────────────────────────────
const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get('abirhassan2');
if (!existingUser) {
    const hash = bcrypt.hashSync('8146', 10);
    db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('abirhassan2', hash, 'admin');
    console.log('✅ Admin user created: abirhassan2');
}

// ─── Hero ────────────────────────────────────────────────
const heroExists = db.prepare('SELECT id FROM hero WHERE id = 1').get();
if (!heroExists) {
    db.prepare(`INSERT INTO hero (id, name, role, company, summary, titles, stats, cta_primary, cta_secondary) VALUES (1,?,?,?,?,?,?,?,?)`).run(
        'Md Abir Hassan',
        'Jr. Software Engineer (SQA)',
        'Daffodil Software Ltd.',
        'Experienced professional with 4+ years of experience across Software Quality Assurance, Project Management, Corporate Administration, and Frontend Web Development. Successfully contributed to 50+ software projects including university ERP systems, corporate platforms, and international solutions.',
        JSON.stringify(['Software Engineer', 'QA Specialist', 'Project Manager', 'Frontend Developer']),
        JSON.stringify([
            { value: '4+', label: 'Years Experience' },
            { value: '50+', label: 'Projects' },
            { value: '15+', label: 'Clients' },
            { value: '100%', label: 'Quality' }
        ]),
        'View Projects',
        'Download CV'
    );
    console.log('✅ Hero data seeded');
}

// ─── Expertise ───────────────────────────────────────────
const expertCount = db.prepare('SELECT COUNT(*) as c FROM expertise').get();
if (expertCount.c === 0) {
    const insertExpert = db.prepare('INSERT INTO expertise (icon, title, desc, mode, sort_order) VALUES (?,?,?,?,?)');
    [
        ['🧪', 'Software Testing & QA', 'Functional, security, and performance testing across 50+ enterprise systems.', 'qa', 0],
        ['📊', 'Project Management', 'End-to-end project coordination, documentation, and stakeholder communication.', 'pm', 1],
        ['🌐', 'Web Development', 'Frontend development with HTML5, CSS3, JavaScript, and modern frameworks.', 'dev', 2],
        ['🏢', 'Corporate Administration', 'ISO compliance, audit management, and cross-department coordination.', 'pm', 3],
    ].forEach((r, i) => insertExpert.run(...r));
    console.log('✅ Expertise seeded');
}

// ─── Competencies ────────────────────────────────────────
const compCount = db.prepare('SELECT COUNT(*) as c FROM competencies').get();
if (compCount.c === 0) {
    const insertComp = db.prepare('INSERT INTO competencies (name, value, sort_order) VALUES (?,?,?)');
    [
        ['Software Testing & QA', 90, 0],
        ['Project Management & Documentation', 85, 1],
        ['Corporate Administration & Compliance', 95, 2],
        ['Web Development', 80, 3],
        ['AI Tools & Productivity', 75, 4],
        ['Business Operations Support', 70, 5],
    ].forEach(r => insertComp.run(...r));
    console.log('✅ Competencies seeded');
}

// ─── QA Expertise ────────────────────────────────────────
const qaCount = db.prepare('SELECT COUNT(*) as c FROM qa_expertise').get();
if (qaCount.c === 0) {
    const insertQA = db.prepare('INSERT INTO qa_expertise (icon, title, items) VALUES (?,?,?)');
    [
        ['🔍', 'Functional & Integration', JSON.stringify(['Unit Testing', 'Integration Testing', 'System Testing', 'Regression Testing'])],
        ['🔐', 'Security & Performance', JSON.stringify(['Penetration Testing', 'Load Testing', 'Stress Testing', 'Security Audits'])],
        ['🎯', 'End-to-End Testing', JSON.stringify(['User Flow Testing', 'Cross-browser Testing', 'Mobile Testing', 'API Testing'])],
        ['✅', 'UAT & Accessibility', JSON.stringify(['User Acceptance Testing', 'SEO Auditing', 'Accessibility Checks', 'Compliance Testing'])],
    ].forEach(r => insertQA.run(...r));
    console.log('✅ QA Expertise seeded');
}

// ─── QA Tools ────────────────────────────────────────────
const qaToolCount = db.prepare('SELECT COUNT(*) as c FROM qa_tools').get();
if (qaToolCount.c === 0) {
    const insertTool = db.prepare('INSERT INTO qa_tools (name, sort_order) VALUES (?,?)');
    ['Selenium', 'Cypress', 'JMeter', 'LoadRunner', 'Jira', 'Bugzilla', 'Postman', 'GTmetrix', 'BrowserStack', 'Git']
        .forEach((t, i) => insertTool.run(t, i));
    console.log('✅ QA Tools seeded');
}

// ─── PM Responsibilities ─────────────────────────────────
const pmRCount = db.prepare('SELECT COUNT(*) as c FROM pm_responsibilities').get();
if (pmRCount.c === 0) {
    const ins = db.prepare('INSERT INTO pm_responsibilities (icon, title, desc, sort_order) VALUES (?,?,?,?)');
    [
        ['📋', 'Planning & Coordination', 'Sprint planning, task breakdown, and timeline management across multiple teams.', 0],
        ['🤝', 'Stakeholder Communication', 'Regular status updates, requirement gathering, and client relationship management.', 1],
        ['📦', 'Resource Allocation', 'Team capacity planning, workload distribution, and milestone tracking.', 2],
        ['⚠️', 'Risk & Issue Management', 'Proactive risk identification, mitigation strategies, and issue escalation.', 3],
    ].forEach(r => ins.run(...r));
    console.log('✅ PM Responsibilities seeded');
}

// ─── PM Docs ─────────────────────────────────────────────
const pmDCount = db.prepare('SELECT COUNT(*) as c FROM pm_docs').get();
if (pmDCount.c === 0) {
    const ins = db.prepare('INSERT INTO pm_docs (icon, name, sort_order) VALUES (?,?,?)');
    [
        ['📝', 'SRS (Software Requirement Specification)', 0],
        ['📊', 'BRS (Business Requirement Specification)', 1],
        ['🗂️', 'WBS (Work Breakdown Structure)', 2],
        ['📋', 'Project Charter', 3],
        ['🏢', 'ISO Documentation', 4],
        ['📖', 'SOPs & User Manuals', 5],
    ].forEach(r => ins.run(...r));
    console.log('✅ PM Docs seeded');
}

// ─── Projects ────────────────────────────────────────────
const projCount = db.prepare('SELECT COUNT(*) as c FROM projects').get();
if (projCount.c === 0) {
    const ins = db.prepare('INSERT INTO projects (title, org, category, desc, tags, featured, sort_order) VALUES (?,?,?,?,?,?,?)');
    [
        ['Comilla University System', 'University ERP', 'qa', 'Comprehensive university management and student portal system.', JSON.stringify(['ERP', 'Testing', 'Documentation']), 1, 0],
        ['BUTEX IUMS', 'University ERP', 'qa', 'Integrated university management system for BUTEX.', JSON.stringify(['ERP', 'QA', 'UAT']), 0, 1],
        ['Admission.ac ERP', 'SaaS Platform', 'qa', 'Multi-university admission management platform.', JSON.stringify(['SaaS', 'Testing', 'Security']), 1, 2],
        ['EDUvas', 'EdTech', 'qa', 'Education management and virtual learning platform.', JSON.stringify(['EdTech', 'QA', 'Frontend']), 0, 3],
        ['Minami City Dev Authority', 'International (Japan)', 'pm', 'City development authority portal for Japanese municipality.', JSON.stringify(['International', 'PM', 'Documentation']), 1, 4],
        ['Daffodil Software Ltd Website', 'Corporate', 'web', 'Official corporate website with modern design and interactivity.', JSON.stringify(['HTML', 'CSS', 'JavaScript']), 0, 5],
        ['UNO-RankBoard', 'Game Project', 'web', 'Interactive leaderboard and ranking system for UNO game.', JSON.stringify(['Web App', 'JavaScript', 'UI']), 0, 6],
        ['TaskWave', 'Productivity', 'web', 'Task management application with wave-based priority system.', JSON.stringify(['Web App', 'Frontend', 'UX']), 1, 7],
        ['Living-Memory', 'Personal', 'web', 'Digital memory preservation and journaling platform.', JSON.stringify(['Web App', 'CSS', 'Design']), 0, 8],
        ['RIBA', 'SaaS', 'web', 'AI-powered recruitment and HR management platform.', JSON.stringify(['SaaS', 'Frontend', 'AI']), 0, 9],
        ['LifeCostly', 'Finance', 'web', 'Expense tracking and budgeting application.', JSON.stringify(['Finance', 'Web App', 'UX']), 0, 10],
        ['Army IBA', 'Government', 'qa', 'Army Institute of Business Administration management system.', JSON.stringify(['Government', 'Testing', 'Security']), 0, 11],
        ['BSDI', 'Education', 'qa', 'Bangladesh Skills Development Institute platform.', JSON.stringify(['Education', 'QA', 'ERP']), 0, 12],
        ['Smart Edu Platform', 'Corporate', 'pm', 'Smart education management and analytics platform.', JSON.stringify(['EdTech', 'PM', 'Analytics']), 0, 13],
        ['5+ University ERP Systems', 'University Sector', 'qa', 'Tested and documented 5+ university management systems.', JSON.stringify(['ERP', 'QA', 'SRS']), 0, 14],
    ].forEach(r => ins.run(...r));
    console.log('✅ Projects seeded');
}

// ─── Experience ──────────────────────────────────────────
const expCount = db.prepare('SELECT COUNT(*) as c FROM experience').get();
if (expCount.c === 0) {
    const ins = db.prepare('INSERT INTO experience (role, company, duration, responsibilities, skills, is_current, sort_order) VALUES (?,?,?,?,?,?,?)');
    [
        [
            'Jr. Software Engineer (SQA)',
            'Daffodil Software Ltd.',
            '2022 – Present',
            JSON.stringify(['Conducting functional, security, and performance testing on 50+ enterprise systems', 'Writing and executing test cases for ERP systems, SaaS platforms', 'Coordinating UAT sessions with clients and stakeholders', 'Managing QA documentation including test plans and bug reports', 'Participating in sprint planning and Agile ceremonies']),
            JSON.stringify(['Selenium', 'Cypress', 'JMeter', 'Jira', 'Postman', 'BrowserStack']),
            1, 0
        ],
        [
            'Project Manager & Documentation Specialist',
            'Daffodil Software Ltd.',
            '2021 – 2022',
            JSON.stringify(['Managing software project lifecycles end-to-end', 'Creating SRS, BRS, WBS, and project charter documents', 'Stakeholder communication and requirement gathering', 'ISO compliance documentation and internal audits']),
            JSON.stringify(['Project Planning', 'MS Project', 'Agile', 'JIRA', 'Confluence']),
            0, 1
        ],
        [
            'Corporate Administrator',
            'Daffodil International Group',
            '2019 – 2021',
            JSON.stringify(['Running day-to-day administrative operations', 'ISO documentation management and compliance auditing', 'Cross-department coordination and HR support', 'Event management and corporate reporting']),
            JSON.stringify(['ISO Standards', 'MS Office 365', 'Administration', 'Compliance']),
            0, 2
        ],
    ].forEach(r => ins.run(...r));
    console.log('✅ Experience seeded');
}

// ─── Web Skills ──────────────────────────────────────────
const wsCount = db.prepare('SELECT COUNT(*) as c FROM web_skills').get();
if (wsCount.c === 0) {
    const ins = db.prepare('INSERT INTO web_skills (name, sort_order) VALUES (?,?)');
    ['HTML5', 'CSS3', 'JavaScript', 'Tailwind CSS', 'Bootstrap', 'React (Learning)', 'Responsive Design', 'Git & GitHub', 'Vite', 'REST APIs']
        .forEach((n, i) => ins.run(n, i));
    console.log('✅ Web Skills seeded');
}

// ─── Workflow Steps ──────────────────────────────────────
const wfCount = db.prepare('SELECT COUNT(*) as c FROM workflow_steps').get();
if (wfCount.c === 0) {
    const ins = db.prepare('INSERT INTO workflow_steps (label, sort_order) VALUES (?,?)');
    ['Requirement', 'Design', 'Development', 'Testing', 'Deployment', 'Documentation']
        .forEach((l, i) => ins.run(l, i));
    console.log('✅ Workflow steps seeded');
}

// ─── Education ───────────────────────────────────────────
const eduCount = db.prepare('SELECT COUNT(*) as c FROM education').get();
if (eduCount.c === 0) {
    const ins = db.prepare('INSERT INTO education (icon, degree, school, date, detail, sort_order) VALUES (?,?,?,?,?,?)');
    [
        ['🎓', 'MBA (MIS)', 'Daffodil International University', 'Running', 'Management Information Systems', 0],
        ['💻', 'BSc in CSE', 'Daffodil International University', '2018 – 2021', 'Computer Science & Engineering', 1],
        ['📚', 'HSC (Science)', 'Higher Secondary', 'CGPA 3.92', 'Science Stream', 2],
    ].forEach(r => ins.run(...r));
    console.log('✅ Education seeded');
}

// ─── Certifications ──────────────────────────────────────
const certCount = db.prepare('SELECT COUNT(*) as c FROM certifications').get();
if (certCount.c === 0) {
    const ins = db.prepare('INSERT INTO certifications (icon, name, issuer, sort_order) VALUES (?,?,?,?)');
    [
        ['📋', 'PMP Certification', 'Project Management Institute', 0],
        ['🧪', 'Software Testing & QA', 'Professional Certification', 1],
        ['🔄', 'Agile & Project Management', 'Agile Alliance', 2],
        ['📊', 'Google Analytics', 'Google', 3],
        ['💼', 'Microsoft 365 Administration', 'Microsoft', 4],
        ['🏆', 'Leadership & Administration', 'Professional Development', 5],
    ].forEach(r => ins.run(...r));
    console.log('✅ Certifications seeded');
}

// ─── Blogs ───────────────────────────────────────────────
const blogCount = db.prepare('SELECT COUNT(*) as c FROM blogs').get();
if (blogCount.c === 0) {
    const ins = db.prepare(`INSERT INTO blogs (title, slug, excerpt, content, category, featured, top_reading, status, read_count) VALUES (?,?,?,?,?,?,?,?,?)`);
    [
        ['Modern QA Methodologies for ERP Systems', 'modern-qa-methodologies-erp', 'Exploring how modern testing frameworks and methodologies can improve ERP quality.', '<p>Modern ERP systems demand rigorous quality assurance processes. In this article, we explore the most effective methodologies...</p>', 'QA', 1, 1, 'published', 142],
        ['Documentation Best Practices in Agile Teams', 'documentation-best-practices-agile', 'How to maintain comprehensive documentation while staying agile.', '<p>Balancing documentation with agility is one of the core challenges in modern software teams...</p>', 'Project Management', 0, 1, 'published', 98],
        ['From Corporate Administration to Software Engineering', 'corporate-admin-to-software-engineering', 'My journey transitioning from compliance to software quality assurance.', '<p>My career path has been anything but conventional. Starting in corporate administration...</p>', 'Career', 1, 0, 'published', 203],
    ].forEach(r => ins.run(...r));
    console.log('✅ Blogs seeded');
}

// ─── Settings ────────────────────────────────────────────
const settingsCount = db.prepare('SELECT COUNT(*) as c FROM settings').get();
if (settingsCount.c === 0) {
    const ins = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?,?)');
    [
        ['primary_color', '#6c63ff'],
        ['secondary_color', '#f50057'],
        ['accent_color', '#00f5ff'],
        ['font_family', 'Inter'],
        ['dark_mode', 'true'],
        ['site_title', 'Md Abir Hassan — Portfolio'],
        ['site_tagline', 'SQA Engineer | Project Manager | Web Developer'],
        ['email', 'abirhassan@example.com'],
        ['phone', '+880 1XXX-XXXXXX'],
        ['location', 'Dhaka, Bangladesh'],
        ['linkedin', 'https://linkedin.com/in/abirhassan'],
        ['github', 'https://github.com/abirhassan'],
        ['twitter', ''],
        ['facebook', ''],
        ['cv_url', ''],
        ['footer_text', '© 2024 Md Abir Hassan. All rights reserved.'],
    ].forEach(r => ins.run(...r));
    console.log('✅ Settings seeded');
}

// ─── Navigation ──────────────────────────────────────────
const navCount = db.prepare('SELECT COUNT(*) as c FROM navigation').get();
if (navCount.c === 0) {
    const ins = db.prepare('INSERT INTO navigation (label, url, location, sort_order) VALUES (?,?,?,?)');
    [
        ['HOME', 'index.html', 'footer_left', 0],
        ['ABOUT', 'about.html', 'footer_left', 1],
        ['EXPERIENCE', 'experience.html', 'footer_left', 2],
        ['QA & TESTING', 'qa-testing.html', 'footer_left', 3],
        ['PM DETAILS', 'pm-details.html', 'footer_left', 4],
        ['PROJECTS', 'projects.html', 'footer_left', 5],
        ['WEB DEV', 'web-dev.html', 'footer_left', 6],
        ['BLOG', 'blog.html', 'footer_left', 7],
        ['CONTACT', 'contact.html', 'footer_right', 8],
    ].forEach(r => ins.run(...r));
    console.log('✅ Navigation seeded');
}

console.log('\n🎉 Database seeded successfully!');
