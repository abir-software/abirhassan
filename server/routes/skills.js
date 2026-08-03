// ========================================
// ROUTE — Skills (competencies, expertise, QA, web)
// ========================================
import { Router } from 'express';
import db from '../db.js';
import { verifyToken } from '../auth.js';

const router = Router();

// GET /api/skills (public)
router.get('/', (req, res) => {
    const competencies = db.prepare('SELECT * FROM competencies ORDER BY sort_order').all();
    const expertise = db.prepare('SELECT * FROM expertise ORDER BY sort_order').all();
    const qaExpertise = db.prepare('SELECT * FROM qa_expertise ORDER BY sort_order').all().map(r => ({ ...r, items: JSON.parse(r.items || '[]') }));
    const qaTools = db.prepare('SELECT * FROM qa_tools ORDER BY sort_order').all();
    const pmResponsibilities = db.prepare('SELECT * FROM pm_responsibilities ORDER BY sort_order').all();
    const pmDocs = db.prepare('SELECT * FROM pm_docs ORDER BY sort_order').all();
    const webSkills = db.prepare('SELECT * FROM web_skills ORDER BY sort_order').all();
    const workflowSteps = db.prepare('SELECT * FROM workflow_steps ORDER BY sort_order').all();
    res.json({ competencies, expertise, qaExpertise, qaTools, pmResponsibilities, pmDocs, webSkills, workflowSteps });
});

// PUT /api/skills/competencies (protected)
router.put('/competencies', verifyToken, (req, res) => {
    const { items } = req.body;
    db.prepare('DELETE FROM competencies').run();
    const ins = db.prepare('INSERT INTO competencies (name, value, sort_order) VALUES (?,?,?)');
    (items || []).forEach((item, i) => ins.run(item.name, item.value, i));
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('update', 'Competencies updated');
    res.json({ success: true });
});

// PUT /api/skills/expertise (protected)
router.put('/expertise', verifyToken, (req, res) => {
    const { items } = req.body;
    db.prepare('DELETE FROM expertise').run();
    const ins = db.prepare('INSERT INTO expertise (icon, title, desc, mode, sort_order) VALUES (?,?,?,?,?)');
    (items || []).forEach((item, i) => ins.run(item.icon, item.title, item.desc, item.mode, i));
    db.prepare(`INSERT INTO activity_log (action, details) VALUES (?,?)`).run('update', 'Expertise updated');
    res.json({ success: true });
});

// PUT /api/skills/qa-expertise (protected)
router.put('/qa-expertise', verifyToken, (req, res) => {
    const { items } = req.body;
    db.prepare('DELETE FROM qa_expertise').run();
    const ins = db.prepare('INSERT INTO qa_expertise (icon, title, items, sort_order) VALUES (?,?,?,?)');
    (items || []).forEach((item, i) => ins.run(item.icon, item.title, JSON.stringify(item.items || []), i));
    res.json({ success: true });
});

// PUT /api/skills/qa-tools (protected)
router.put('/qa-tools', verifyToken, (req, res) => {
    const { items } = req.body;
    db.prepare('DELETE FROM qa_tools').run();
    const ins = db.prepare('INSERT INTO qa_tools (name, sort_order) VALUES (?,?)');
    (items || []).forEach((item, i) => ins.run(item.name || item, i));
    res.json({ success: true });
});

// PUT /api/skills/pm-responsibilities (protected)
router.put('/pm-responsibilities', verifyToken, (req, res) => {
    const { items } = req.body;
    db.prepare('DELETE FROM pm_responsibilities').run();
    const ins = db.prepare('INSERT INTO pm_responsibilities (icon, title, desc, sort_order) VALUES (?,?,?,?)');
    (items || []).forEach((item, i) => ins.run(item.icon, item.title, item.desc, i));
    res.json({ success: true });
});

// PUT /api/skills/pm-docs (protected)
router.put('/pm-docs', verifyToken, (req, res) => {
    const { items } = req.body;
    db.prepare('DELETE FROM pm_docs').run();
    const ins = db.prepare('INSERT INTO pm_docs (icon, name, sort_order) VALUES (?,?,?)');
    (items || []).forEach((item, i) => ins.run(item.icon, item.name, i));
    res.json({ success: true });
});

// PUT /api/skills/web-skills (protected)
router.put('/web-skills', verifyToken, (req, res) => {
    const { items } = req.body;
    db.prepare('DELETE FROM web_skills').run();
    const ins = db.prepare('INSERT INTO web_skills (name, sort_order) VALUES (?,?)');
    (items || []).forEach((item, i) => ins.run(item.name || item, i));
    res.json({ success: true });
});

// PUT /api/skills/workflow (protected)
router.put('/workflow', verifyToken, (req, res) => {
    const { items } = req.body;
    db.prepare('DELETE FROM workflow_steps').run();
    const ins = db.prepare('INSERT INTO workflow_steps (label, sort_order) VALUES (?,?)');
    (items || []).forEach((item, i) => ins.run(item.label || item, i));
    res.json({ success: true });
});

export default router;
