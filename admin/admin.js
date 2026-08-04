// =========================================================
// ADMIN.JS — Full SPA Logic
// =========================================================

const API = window.location.hostname === 'localhost' && window.location.port === '5173' ? 'http://localhost:3000/api' : '/api';
let TOKEN = localStorage.getItem('cms_token') || '';
let QUILL = null;
let currentProjectFilter = 'all';

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
async function req(method, path, body, isFormData = false) {
    const opts = {
        method,
        headers: { Authorization: `Bearer ${TOKEN}` },
    };
    if (body && !isFormData) {
        opts.headers['Content-Type'] = 'application/json';
        opts.body = JSON.stringify(body);
    } else if (body && isFormData) {
        opts.body = body;
    }
    const res = await fetch(`${API}${path}`, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
}

function toast(msg, type = 'success') {
    const el = document.getElementById('toast');
    el.textContent = (type === 'success' ? '✅ ' : '❌ ') + msg;
    el.className = `toast ${type} show`;
    setTimeout(() => el.classList.remove('show'), 3500);
}

function openModal(id) {
    document.getElementById(id).classList.add('active');
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

function formatDate(str) {
    if (!str) return '—';
    return new Date(str).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1048576).toFixed(1)}MB`;
}

// ─────────────────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────────────────
async function doLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    try {
        const data = await req('POST', '/auth/login', { username, password });
        TOKEN = data.token;
        localStorage.setItem('cms_token', TOKEN);
        document.getElementById('user-display').textContent = data.user.username;
        document.getElementById('user-avatar').textContent = data.user.username[0].toUpperCase();
        showApp();
    } catch {
        document.getElementById('login-error').style.display = 'block';
    }
}

function doLogout() {
    TOKEN = '';
    localStorage.removeItem('cms_token');
    document.getElementById('app').style.display = 'none';
    document.getElementById('login-screen').style.display = 'flex';
}

function showApp() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    initQuill();
    showPanel('dashboard');
    loadDashboard();
    loadUnreadBadge();
}

// Check existing token on load
window.addEventListener('DOMContentLoaded', () => {
    if (TOKEN) {
        // Verify token still valid
        req('GET', '/analytics/dashboard').then(() => {
            showApp();
        }).catch(() => {
            TOKEN = '';
            localStorage.removeItem('cms_token');
        });
    }

    // Login on Enter key
    document.getElementById('login-password').addEventListener('keydown', e => {
        if (e.key === 'Enter') doLogin();
    });

    // Nav click handlers
    document.querySelectorAll('.nav-item[data-panel]').forEach(el => {
        el.addEventListener('click', () => showPanel(el.dataset.panel));
    });

    // Upload drop zone
    const dropZone = document.getElementById('upload-drop');
    if (dropZone) {
        dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
        dropZone.addEventListener('drop', e => {
            e.preventDefault(); dropZone.classList.remove('drag-over');
            uploadFiles(e.dataTransfer.files);
        });
    }

    // Color pickers sync
    ['primary', 'secondary', 'accent'].forEach(c => {
        const picker = document.getElementById(`s-${c}-color`);
        const hex = document.getElementById(`s-${c}-hex`);
        if (!picker || !hex) return;
        picker.addEventListener('input', () => hex.value = picker.value);
        hex.addEventListener('input', () => { if (/^#[0-9a-f]{6}$/i.test(hex.value)) picker.value = hex.value; });
    });
});

// ─────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────
const PANEL_TITLES = {
    dashboard: 'Dashboard', hero: 'Hero Section', projects: 'Projects',
    blog: 'Blog Posts', experience: 'Experience', skills: 'Skills',
    education: 'Education & Certifications', media: 'Media Library',
    contact: 'Contact Submissions', settings: 'Settings', activity: 'Activity Log',
    navigation: 'Site Navigation', testimonials: 'Testimonials', backup: 'Backup & Restore',
};
const PANEL_LOADERS = {
    dashboard: loadDashboard,
    hero: loadHero,
    projects: loadProjects,
    blog: loadBlogs,
    experience: loadExperience,
    skills: loadSkills,
    education: loadEducation,
    media: loadMedia,
    contact: loadContact,
    settings: loadSettings,
    activity: loadActivity,
    navigation: loadNavigation,
    testimonials: loadTestimonials,
    backup: () => { }, // No specific loader needed for static backup panel
};

function showPanel(name) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(`panel-${name}`)?.classList.add('active');
    document.querySelector(`[data-panel="${name}"]`)?.classList.add('active');
    document.getElementById('topbar-title').textContent = PANEL_TITLES[name] || name;
    PANEL_LOADERS[name]?.();
}

// ─────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────
async function loadDashboard() {
    try {
        const d = await req('GET', '/analytics/dashboard');
        const { stats, topBlogs, recentBlogs, recentMessages } = d;

        document.getElementById('dash-stats').innerHTML = [
            { icon: '🚀', value: stats.totalProjects, label: 'Projects' },
            { icon: '📝', value: stats.totalBlogs, label: 'Blog Posts' },
            { icon: '👀', value: stats.totalViews, label: 'Total Reads' },
            { icon: '📩', value: stats.totalMessages, label: 'Messages' },
            { icon: '🔔', value: stats.unreadMessages, label: 'Unread' },
            { icon: '🖼️', value: stats.totalMedia, label: 'Media Files' },
            { icon: '💼', value: stats.experience, label: 'Experience' },
            { icon: '✅', value: stats.publishedBlogs, label: 'Published' },
        ].map(s => `<div class="stat-card"><div class="stat-icon">${s.icon}</div><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`).join('');

        document.getElementById('dash-top-blogs').innerHTML = topBlogs.length ? topBlogs.map(b =>
            `<div class="activity-item"><div class="activity-dot" style="background:var(--accent-3)"></div><div class="activity-details"><div class="activity-action">${b.title}</div><div class="activity-time">${b.category} • ${b.read_count} reads</div></div></div>`
        ).join('') : '<p class="text-muted text-sm">No published blogs yet</p>';

        document.getElementById('dash-recent-msgs').innerHTML = recentMessages.length ? recentMessages.map(m =>
            `<div class="activity-item"><div class="activity-dot" style="background:${m.status === 'unread' ? 'var(--danger)' : 'var(--text-muted)'}"></div><div class="activity-details"><div class="activity-action">${m.name} <span class="text-muted text-sm">— ${m.email}</span></div><div class="activity-time">${m.subject || '(no subject)'} • ${formatDate(m.created_at)}</div></div></div>`
        ).join('') : '<p class="text-muted text-sm">No messages yet</p>';

        const activity = await req('GET', '/analytics/activity');
        document.getElementById('dash-activity').innerHTML = activity.slice(0, 10).map(a =>
            `<div class="activity-item"><div class="activity-dot"></div><div class="activity-details"><div class="activity-action">${a.details}</div><div class="activity-time">${formatDate(a.created_at)}</div></div></div>`
        ).join('');
    } catch (e) { console.error(e); }
}

// ─────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────
async function loadHero() {
    try {
        const h = await req('GET', '/hero');
        document.getElementById('hero-name').value = h.name || '';
        document.getElementById('hero-role').value = h.role || '';
        document.getElementById('hero-company').value = h.company || '';
        document.getElementById('hero-summary').value = h.summary || '';
        document.getElementById('hero-image').value = h.profile_image || '';
        document.getElementById('hero-cta1').value = h.cta_primary || '';
        document.getElementById('hero-cta2').value = h.cta_secondary || '';
        document.getElementById('hero-titles').value = (h.titles || []).join(', ');
        renderHeroStats(h.stats || []);
    } catch (e) { toast('Failed to load hero: ' + e.message, 'error'); }
}

let heroStats = [];
function renderHeroStats(stats) {
    heroStats = stats;
    document.getElementById('hero-stats-list').innerHTML = heroStats.map((s, i) =>
        `<div class="form-row" style="margin-bottom:.5rem">
      <div class="field"><input type="text" value="${s.value}" onchange="heroStats[${i}].value=this.value" placeholder="4+"></div>
      <div class="field"><input type="text" value="${s.label}" onchange="heroStats[${i}].label=this.value" placeholder="Years Experience"></div>
      <button class="btn btn-ghost btn-sm btn-icon" onclick="heroStats.splice(${i},1);renderHeroStats(heroStats)">🗑</button>
    </div>`
    ).join('');
}
function addHeroStat() { renderHeroStats([...heroStats, { value: '', label: '' }]); }

async function saveHero() {
    try {
        await req('PUT', '/hero', {
            name: document.getElementById('hero-name').value,
            role: document.getElementById('hero-role').value,
            company: document.getElementById('hero-company').value,
            summary: document.getElementById('hero-summary').value,
            profile_image: document.getElementById('hero-image').value,
            titles: document.getElementById('hero-titles').value.split(',').map(s => s.trim()).filter(Boolean),
            stats: heroStats,
            cta_primary: document.getElementById('hero-cta1').value,
            cta_secondary: document.getElementById('hero-cta2').value,
        });
        toast('Hero section saved!');
    } catch (e) { toast('Error: ' + e.message, 'error'); }
}

// ─────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────
async function loadProjects() {
    try {
        const rows = await req('GET', '/projects' + (currentProjectFilter !== 'all' ? `?category=${currentProjectFilter}` : ''));
        document.getElementById('projects-table').innerHTML = rows.map(p => `
      <tr>
        <td><strong>${p.title}</strong></td>
        <td class="text-muted">${p.org || '—'}</td>
        <td><span class="badge badge-accent">${p.category}</span></td>
        <td><div class="tags-list">${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}</div></td>
        <td>${p.featured ? '<span class="badge badge-success">✓</span>' : '<span class="badge badge-muted">—</span>'}</td>
        <td><div style="display:flex;gap:.3rem">
          <button class="btn btn-ghost btn-sm btn-icon" onclick="editProject(${p.id})">✏️</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteProject(${p.id},'${p.title.replace(/'/g, "\\'")}')">🗑</button>
        </div></td>
      </tr>`).join('') || '<tr><td colspan="6" class="text-muted" style="text-align:center;padding:2rem">No projects found</td></tr>';
    } catch (e) { toast('Error loading projects', 'error'); }
}

function filterProjects(cat) { currentProjectFilter = cat; loadProjects(); }

function openProjectModal(data = null) {
    document.getElementById('project-modal-title').textContent = data ? 'Edit Project' : 'New Project';
    document.getElementById('pm-id').value = data?.id || '';
    document.getElementById('pm-title').value = data?.title || '';
    document.getElementById('pm-org').value = data?.org || '';
    document.getElementById('pm-category').value = data?.category || 'qa';
    document.getElementById('pm-desc').value = data?.desc || '';
    document.getElementById('pm-tags').value = (data?.tags || []).join(', ');
    document.getElementById('pm-image').value = data?.image || '';
    document.getElementById('pm-featured').checked = !!data?.featured;
    document.getElementById('pm-highlight').checked = !!data?.highlight;
    openModal('project-modal');
}

async function editProject(id) {
    try {
        const p = await req('GET', `/projects/${id}`);
        openProjectModal(p);
    } catch (e) { toast('Error: ' + e.message, 'error'); }
}

async function saveProject() {
    const id = document.getElementById('pm-id').value;
    const body = {
        title: document.getElementById('pm-title').value,
        org: document.getElementById('pm-org').value,
        category: document.getElementById('pm-category').value,
        desc: document.getElementById('pm-desc').value,
        tags: document.getElementById('pm-tags').value.split(',').map(s => s.trim()).filter(Boolean),
        image: document.getElementById('pm-image').value,
        featured: document.getElementById('pm-featured').checked,
        highlight: document.getElementById('pm-highlight').checked,
    };
    try {
        if (id) await req('PUT', `/projects/${id}`, body);
        else await req('POST', '/projects', body);
        toast(id ? 'Project updated!' : 'Project created!');
        closeModal('project-modal');
        loadProjects();
    } catch (e) { toast('Error: ' + e.message, 'error'); }
}

async function deleteProject(id, title) {
    if (!confirm(`Delete project "${title}"?`)) return;
    try { await req('DELETE', `/projects/${id}`); toast('Project deleted'); loadProjects(); }
    catch (e) { toast('Error: ' + e.message, 'error'); }
}

// ─────────────────────────────────────────────────────────
// BLOGS
// ─────────────────────────────────────────────────────────
function initQuill() {
    if (QUILL) return;
    QUILL = new Quill('#quill-editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                [{ color: [] }, { background: [] }],
                ['clean'],
            ]
        },
    });
}

async function loadBlogs() {
    try {
        const rows = await req('GET', '/blogs/all');
        document.getElementById('blogs-table').innerHTML = rows.map(b => `
      <tr>
        <td><strong>${b.title}</strong><br><span class="text-muted text-sm">/blog/${b.slug}</span></td>
        <td><span class="badge badge-accent">${b.category || '—'}</span></td>
        <td><span class="badge ${b.status === 'published' ? 'badge-success' : 'badge-warning'}">${b.status}</span></td>
        <td>${b.read_count}</td>
        <td>${b.featured ? '⭐' : '—'}</td>
        <td>${b.top_reading ? '🔥' : '—'}</td>
        <td class="text-muted">${formatDate(b.created_at)}</td>
        <td><div style="display:flex;gap:.3rem">
          <button class="btn btn-ghost btn-sm btn-icon" onclick="editBlog(${b.id})">✏️</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteBlog(${b.id},'${b.title.replace(/'/g, "\\'")}')">🗑</button>
        </div></td>
      </tr>`).join('') || '<tr><td colspan="8" class="text-muted" style="text-align:center;padding:2rem">No blog posts yet</td></tr>';
    } catch (e) { toast('Error loading blogs', 'error'); }
}

function openBlogModal(data = null) {
    document.getElementById('blog-modal-title').textContent = data ? 'Edit Blog Post' : 'New Blog Post';
    document.getElementById('bm-id').value = data?.id || '';
    document.getElementById('bm-title').value = data?.title || '';
    document.getElementById('bm-slug').value = data?.slug || '';
    document.getElementById('bm-category').value = data?.category || '';
    document.getElementById('bm-status').value = data?.status || 'draft';
    document.getElementById('bm-image').value = data?.image || '';
    document.getElementById('bm-excerpt').value = data?.excerpt || '';
    document.getElementById('bm-meta-title').value = data?.meta_title || '';
    document.getElementById('bm-meta-desc').value = data?.meta_desc || '';
    document.getElementById('bm-featured').checked = !!data?.featured;
    document.getElementById('bm-top').checked = !!data?.top_reading;
    if (QUILL) QUILL.root.innerHTML = data?.content || '';
    openModal('blog-modal');
}

async function editBlog(id) {
    try { const b = await req('GET', `/blogs/${id}`); openBlogModal(b); }
    catch (e) { toast('Error: ' + e.message, 'error'); }
}

function autoSlug() {
    const title = document.getElementById('bm-title').value;
    const slug = title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
    document.getElementById('bm-slug').value = slug;
}

async function saveBlog(forceStatus = null) {
    const id = document.getElementById('bm-id').value;
    const body = {
        title: document.getElementById('bm-title').value,
        slug: document.getElementById('bm-slug').value,
        category: document.getElementById('bm-category').value,
        status: forceStatus || document.getElementById('bm-status').value,
        image: document.getElementById('bm-image').value,
        excerpt: document.getElementById('bm-excerpt').value,
        content: QUILL ? QUILL.root.innerHTML : '',
        meta_title: document.getElementById('bm-meta-title').value,
        meta_desc: document.getElementById('bm-meta-desc').value,
        featured: document.getElementById('bm-featured').checked,
        top_reading: document.getElementById('bm-top').checked,
    };
    try {
        if (id) await req('PUT', `/blogs/${id}`, body);
        else await req('POST', '/blogs', body);
        toast(id ? 'Blog updated!' : 'Blog post created!');
        closeModal('blog-modal');
        loadBlogs();
    } catch (e) { toast('Error: ' + e.message, 'error'); }
}

async function deleteBlog(id, title) {
    if (!confirm(`Delete blog post "${title}"?`)) return;
    try { await req('DELETE', `/blogs/${id}`); toast('Blog deleted'); loadBlogs(); }
    catch (e) { toast('Error: ' + e.message, 'error'); }
}

// ─────────────────────────────────────────────────────────
// EXPERIENCE
// ─────────────────────────────────────────────────────────
async function loadExperience() {
    try {
        const rows = await req('GET', '/experience');
        document.getElementById('experience-list').innerHTML = rows.map(e => `
      <div class="card mb-2" style="border-left:3px solid ${e.is_current ? 'var(--accent)' : 'var(--border)'}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:.5rem">
          <div>
            <div style="font-weight:700;font-size:1rem">${e.role} ${e.is_current ? '<span class="badge badge-success">Current</span>' : ''}</div>
            <div class="text-muted">${e.company} • ${e.duration}</div>
          </div>
          <div style="display:flex;gap:.3rem">
            <button class="btn btn-ghost btn-sm" onclick="editExp(${e.id})">✏️ Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteExp(${e.id},'${e.role.replace(/'/g, "\\'")}')">🗑</button>
          </div>
        </div>
        <div class="tags-list mt-1">${(e.skills || []).map(s => `<span class="tag">${s}</span>`).join('')}</div>
      </div>`).join('') || '<p class="text-muted text-sm">No experience entries</p>';
    } catch (e) { toast('Error loading experience', 'error'); }
}

function openExpModal(data = null) {
    document.getElementById('exp-modal-title').textContent = data ? 'Edit Experience' : 'Add Experience';
    document.getElementById('em-id').value = data?.id || '';
    document.getElementById('em-role').value = data?.role || '';
    document.getElementById('em-company').value = data?.company || '';
    document.getElementById('em-duration').value = data?.duration || '';
    document.getElementById('em-current').checked = !!data?.is_current;
    document.getElementById('em-responsibilities').value = (data?.responsibilities || []).join('\n');
    document.getElementById('em-skills').value = (data?.skills || []).join(', ');
    openModal('exp-modal');
}

async function editExp(id) {
    try { const e = await req('GET', `/experience/${id}`); openExpModal(e); }
    catch (e) { toast('Error: ' + e.message, 'error'); }
}

async function saveExperience() {
    const id = document.getElementById('em-id').value;
    const body = {
        role: document.getElementById('em-role').value,
        company: document.getElementById('em-company').value,
        duration: document.getElementById('em-duration').value,
        responsibilities: document.getElementById('em-responsibilities').value.split('\n').filter(Boolean),
        skills: document.getElementById('em-skills').value.split(',').map(s => s.trim()).filter(Boolean),
        is_current: document.getElementById('em-current').checked,
    };
    try {
        if (id) await req('PUT', `/experience/${id}`, body);
        else await req('POST', '/experience', body);
        toast('Experience saved!');
        closeModal('exp-modal');
        loadExperience();
    } catch (e) { toast('Error: ' + e.message, 'error'); }
}

async function deleteExp(id, role) {
    if (!confirm(`Delete "${role}"?`)) return;
    try { await req('DELETE', `/experience/${id}`); toast('Deleted'); loadExperience(); }
    catch (e) { toast('Error: ' + e.message, 'error'); }
}

// ─────────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────────
let skillsData = {};

async function loadSkills() {
    try {
        skillsData = await req('GET', '/skills');
        renderCompetencies(skillsData.competencies || []);
    } catch (e) { toast('Error loading skills', 'error'); }
}

function showSkillTab(tab) {
    const tabs = ['competencies', 'expertise', 'qa', 'web', 'workflow'];
    tabs.forEach(t => {
        const el = document.getElementById(`skills-${t}-panel`);
        if (el) el.style.display = (t === tab) ? 'block' : 'none';
    });
    if (tab === 'expertise') renderExpertise(skillsData.expertise || []);
    if (tab === 'qa') renderQATools(skillsData.qaTools || []);
    if (tab === 'web') renderWebSkills(skillsData.webSkills || []);
    if (tab === 'workflow') renderWorkflow(skillsData.workflowSteps || []);
}

// Competencies
function renderCompetencies(items) {
    skillsData.competencies = items;
    document.getElementById('competencies-list').innerHTML = items.map((c, i) =>
        `<div class="form-row" style="margin-bottom:.5rem;align-items:center">
      <div class="field" style="flex:2"><input type="text" value="${c.name}" placeholder="Skill name" onchange="skillsData.competencies[${i}].name=this.value"></div>
      <div class="field" style="flex:1"><input type="number" min="0" max="100" value="${c.value}" placeholder="%" onchange="skillsData.competencies[${i}].value=parseInt(this.value)"></div>
      <button class="btn btn-ghost btn-sm btn-icon" onclick="skillsData.competencies.splice(${i},1);renderCompetencies(skillsData.competencies)">🗑</button>
    </div>`
    ).join('');
}
function addCompetency() { renderCompetencies([...(skillsData.competencies || []), { name: '', value: 80 }]); }
async function saveCompetencies() {
    try { await req('PUT', '/skills/competencies', { items: skillsData.competencies }); toast('Competencies saved!'); }
    catch (e) { toast('Error: ' + e.message, 'error'); }
}

// Expertise cards
function renderExpertise(items) {
    skillsData.expertise = items;
    document.getElementById('expertise-list').innerHTML = items.map((e, i) =>
        `<div class="form-row" style="margin-bottom:.5rem">
      <div class="field" style="flex:0 0 60px"><input type="text" value="${e.icon}" placeholder="🧪" onchange="skillsData.expertise[${i}].icon=this.value"></div>
      <div class="field"><input type="text" value="${e.title}" placeholder="Title" onchange="skillsData.expertise[${i}].title=this.value"></div>
      <div class="field"><input type="text" value="${e.desc}" placeholder="Description" onchange="skillsData.expertise[${i}].desc=this.value"></div>
      <div class="field" style="flex:0 0 80px">
        <select onchange="skillsData.expertise[${i}].mode=this.value">
          <option ${e.mode === 'qa' ? 'selected' : ''}>qa</option>
          <option ${e.mode === 'pm' ? 'selected' : ''}>pm</option>
          <option ${e.mode === 'dev' ? 'selected' : ''}>dev</option>
        </select>
      </div>
      <button class="btn btn-ghost btn-sm btn-icon" onclick="skillsData.expertise.splice(${i},1);renderExpertise(skillsData.expertise)">🗑</button>
    </div>`
    ).join('');
}
function addExpertise() { renderExpertise([...(skillsData.expertise || []), { icon: '⭐', title: '', desc: '', mode: 'qa' }]); }
async function saveExpertise() {
    try { await req('PUT', '/skills/expertise', { items: skillsData.expertise }); toast('Expertise saved!'); }
    catch (e) { toast('Error: ' + e.message, 'error'); }
}

// QA Tools
function renderQATools(items) {
    skillsData.qaTools = items;
    document.getElementById('qa-tools-list').innerHTML = items.map((t, i) =>
        `<div style="display:flex;gap:.5rem;align-items:center;margin-bottom:.4rem">
      <input type="text" class="field" style="flex:1" value="${t.name || t}" placeholder="Tool name" onchange="skillsData.qaTools[${i}]={name:this.value,sort_order:${i}}">
      <button class="btn btn-ghost btn-sm btn-icon" onclick="skillsData.qaTools.splice(${i},1);renderQATools(skillsData.qaTools)">🗑</button>
    </div>`
    ).join('');
}
function addQATool() { renderQATools([...(skillsData.qaTools || []), { name: '', sort_order: 0 }]); }
async function saveQATools() {
    try { await req('PUT', '/skills/qa-tools', { items: skillsData.qaTools }); toast('QA Tools saved!'); }
    catch (e) { toast('Error: ' + e.message, 'error'); }
}

// Web Skills
function renderWebSkills(items) {
    skillsData.webSkills = items;
    document.getElementById('web-skills-list').innerHTML = items.map((s, i) =>
        `<div style="display:flex;gap:.5rem;align-items:center;margin-bottom:.4rem">
      <input type="text" style="flex:1;padding:.5rem .75rem;background:var(--bg-secondary);border:1px solid var(--border);border-radius:8px;color:var(--text-primary);" value="${s.name || s}" onchange="skillsData.webSkills[${i}]={name:this.value}">
      <button class="btn btn-ghost btn-sm btn-icon" onclick="skillsData.webSkills.splice(${i},1);renderWebSkills(skillsData.webSkills)">🗑</button>
    </div>`
    ).join('');
}
function addWebSkill() { renderWebSkills([...(skillsData.webSkills || []), '']); }
async function saveWebSkills() {
    try { await req('PUT', '/skills/web-skills', { items: skillsData.webSkills }); toast('Web skills saved!'); }
    catch (e) { toast('Error: ' + e.message, 'error'); }
}

// Workflow
function renderWorkflow(items) {
    skillsData.workflowSteps = items;
    document.getElementById('workflow-list').innerHTML = items.map((s, i) =>
        `<div style="display:flex;gap:.5rem;align-items:center;margin-bottom:.4rem">
      <span style="color:var(--text-muted);width:24px;text-align:center;font-weight:700">${i + 1}</span>
      <input type="text" style="flex:1;padding:.5rem .75rem;background:var(--bg-secondary);border:1px solid var(--border);border-radius:8px;color:var(--text-primary);" value="${s.label || s}" onchange="skillsData.workflowSteps[${i}]={label:this.value}">
      <button class="btn btn-ghost btn-sm btn-icon" onclick="skillsData.workflowSteps.splice(${i},1);renderWorkflow(skillsData.workflowSteps)">🗑</button>
    </div>`
    ).join('');
}
function addWorkflowStep() { renderWorkflow([...(skillsData.workflowSteps || []), '']); }
async function saveWorkflow() {
    try { await req('PUT', '/skills/workflow', { items: skillsData.workflowSteps }); toast('Workflow saved!'); }
    catch (e) { toast('Error: ' + e.message, 'error'); }
}

// ─────────────────────────────────────────────────────────
// EDUCATION
// ─────────────────────────────────────────────────────────
async function loadEducation() {
    try {
        const d = await req('GET', '/education');
        document.getElementById('edu-degrees-list').innerHTML = d.education.map(e =>
            `<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid var(--border)">
        <div><span style="font-size:1.25rem;margin-right:.5rem">${e.icon}</span><strong>${e.degree}</strong><div class="text-muted text-sm">${e.school} • ${e.date}</div></div>
        <div style="display:flex;gap:.3rem">
          <button class="btn btn-ghost btn-sm btn-icon" onclick="editEdu('degree',${JSON.stringify(e).replace(/'/g, "&apos;")})">✏️</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteEdu('degree',${e.id})">🗑</button>
        </div>
      </div>`
        ).join('') || '<p class="text-muted text-sm">No degrees added</p>';

        document.getElementById('edu-certs-list').innerHTML = d.certifications.map(c =>
            `<div style="display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;border-bottom:1px solid var(--border)">
        <div><span style="font-size:1.25rem;margin-right:.5rem">${c.icon}</span><strong>${c.name}</strong><div class="text-muted text-sm">${c.issuer}</div></div>
        <div style="display:flex;gap:.3rem">
          <button class="btn btn-ghost btn-sm btn-icon" onclick="editEdu('cert',${JSON.stringify(c).replace(/'/g, "&apos;")})">✏️</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteEdu('cert',${c.id})">🗑</button>
        </div>
      </div>`
        ).join('') || '<p class="text-muted text-sm">No certifications added</p>';
    } catch (e) { toast('Error loading education', 'error'); }
}

function openEduModal(type, data = null) {
    document.getElementById('edm-type').value = type;
    document.getElementById('edm-id').value = data?.id || '';
    document.getElementById('edm-icon').value = data?.icon || '';
    document.getElementById('edu-modal-title').textContent = (data ? 'Edit ' : 'Add ') + (type === 'degree' ? 'Degree' : 'Certification');
    document.getElementById('edm-degree').value = data?.degree || '';
    document.getElementById('edm-name').value = data?.name || '';
    document.getElementById('edm-school').value = data?.school || data?.issuer || '';
    document.getElementById('edm-date').value = data?.date || '';
    document.getElementById('edm-detail').value = data?.detail || '';
    document.getElementById('edm-degree-field').style.display = type === 'degree' ? 'block' : 'none';
    document.getElementById('edm-name-field').style.display = type === 'cert' ? 'block' : 'none';
    document.getElementById('edm-date-field').style.display = type === 'degree' ? 'block' : 'none';
    document.getElementById('edm-detail-field').style.display = type === 'degree' ? 'block' : 'none';
    openModal('edu-modal');
}

function editEdu(type, data) {
    if (typeof data === 'string') data = JSON.parse(data);
    openEduModal(type, data);
}

async function saveEdu() {
    const type = document.getElementById('edm-type').value;
    const id = document.getElementById('edm-id').value;
    const body = type === 'degree' ? {
        icon: document.getElementById('edm-icon').value,
        degree: document.getElementById('edm-degree').value,
        school: document.getElementById('edm-school').value,
        date: document.getElementById('edm-date').value,
        detail: document.getElementById('edm-detail').value,
    } : {
        icon: document.getElementById('edm-icon').value,
        name: document.getElementById('edm-name').value,
        issuer: document.getElementById('edm-school').value,
    };
    try {
        const path = type === 'degree' ? '/education/degree' : '/education/cert';
        if (id) await req('PUT', `${path}/${id}`, body);
        else await req('POST', path, body);
        toast('Saved!');
        closeModal('edu-modal');
        loadEducation();
    } catch (e) { toast('Error: ' + e.message, 'error'); }
}

async function deleteEdu(type, id) {
    if (!confirm('Delete this entry?')) return;
    const path = type === 'degree' ? `/education/degree/${id}` : `/education/cert/${id}`;
    try { await req('DELETE', path); toast('Deleted'); loadEducation(); }
    catch (e) { toast('Error: ' + e.message, 'error'); }
}

// ─────────────────────────────────────────────────────────
// MEDIA
// ─────────────────────────────────────────────────────────
async function loadMedia() {
    try {
        const items = await req('GET', '/media');
        const grid = document.getElementById('media-grid');
        if (!items.length) { grid.innerHTML = '<p class="text-muted text-sm">No media uploaded yet</p>'; return; }
        grid.innerHTML = items.map(m => `
      <div class="media-item" title="${m.original_name}">
        <img class="media-img" src="/uploads/${m.filename}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%231a1a30%22 width=%22100%22 height=%22100%22/><text y=%2265%22 x=%2250%22 text-anchor=%22middle%22 font-size=%2240%22>📄</text></svg>'">
        <div class="media-name">${m.original_name}</div>
        <div class="media-actions">
          <button class="btn btn-ghost btn-sm btn-icon" onclick="copyUrl('/uploads/${m.filename}')" title="Copy URL">📋</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteMedia(${m.id})" title="Delete">🗑</button>
        </div>
      </div>`
        ).join('');
    } catch (e) { toast('Error loading media', 'error'); }
}

function copyUrl(url) {
    navigator.clipboard.writeText(url);
    toast('URL copied to clipboard!');
}

async function uploadFiles(files) {
    const folder = document.getElementById('media-folder-select').value;
    let uploaded = 0;
    for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', folder);
        try {
            await req('POST', '/media/upload', fd, true);
            uploaded++;
        } catch (e) { toast(`Failed: ${file.name}`, 'error'); }
    }
    if (uploaded) { toast(`${uploaded} file(s) uploaded!`); loadMedia(); }
}

async function deleteMedia(id) {
    if (!confirm('Delete this file?')) return;
    try { await req('DELETE', `/media/${id}`); toast('Deleted'); loadMedia(); }
    catch (e) { toast('Error: ' + e.message, 'error'); }
}

// ─────────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────────
async function loadContact(status) {
    try {
        const url = status ? `/contact?status=${status}` : '/contact';
        const rows = await req('GET', url);
        document.getElementById('contact-table').innerHTML = rows.map(m => `
      <tr>
        <td><strong>${m.name}</strong></td>
        <td class="text-muted">${m.email}</td>
        <td>${m.subject || '—'}</td>
        <td class="text-muted">${formatDate(m.created_at)}</td>
        <td><span class="badge ${m.status === 'unread' ? 'badge-danger' : 'badge-muted'}">${m.status}</span></td>
        <td><div style="display:flex;gap:.3rem">
          <button class="btn btn-ghost btn-sm" onclick="viewContact(${m.id})">👁 View</button>
          <button class="btn btn-ghost btn-sm" onclick="markContact(${m.id},'${m.status === 'read' ? 'unread' : 'read'}')">${m.status === 'read' ? '📬' : '✅'}</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteContact(${m.id})">🗑</button>
        </div></td>
      </tr>`).join('') || '<tr><td colspan="6" class="text-muted" style="text-align:center;padding:2rem">No messages</td></tr>';
    } catch (e) { toast('Error loading contact', 'error'); }
}

async function viewContact(id) {
    const rows = await req('GET', '/contact');
    const m = rows.find(r => r.id === id);
    if (!m) return;
    document.getElementById('contact-modal-body').innerHTML = `
    <div style="margin-bottom:1rem"><strong>${m.name}</strong> &lt;${m.email}&gt;</div>
    <div class="text-muted text-sm" style="margin-bottom:.75rem">${formatDate(m.created_at)}</div>
    <div style="font-weight:700;margin-bottom:.5rem">${m.subject || '(No Subject)'}</div>
    <div style="white-space:pre-wrap;line-height:1.6">${m.message}</div>`;
    openModal('contact-modal');
    if (m.status === 'unread') await markContact(id, 'read').then(() => loadContact());
}

async function markContact(id, status) {
    try { await req('PUT', `/contact/${id}/status`, { status }); loadContact(); loadUnreadBadge(); }
    catch (e) { toast('Error', 'error'); }
}

async function deleteContact(id) {
    if (!confirm('Delete this message?')) return;
    try { await req('DELETE', `/contact/${id}`); toast('Deleted'); loadContact(); loadUnreadBadge(); }
    catch (e) { toast('Error', 'error'); }
}

async function loadUnreadBadge() {
    try {
        const d = await req('GET', '/analytics/dashboard');
        const badge = document.getElementById('unread-badge');
        if (d.stats.unreadMessages > 0) {
            badge.textContent = d.stats.unreadMessages;
            badge.style.display = 'inline-block';
        } else {
            badge.style.display = 'none';
        }
    } catch { }
}

// ─────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────
async function loadSettings() {
    try {
        const s = await req('GET', '/settings');
        document.getElementById('s-primary-color').value = s.primary_color || '#6c63ff';
        document.getElementById('s-primary-hex').value = s.primary_color || '#6c63ff';
        document.getElementById('s-secondary-color').value = s.secondary_color || '#f50057';
        document.getElementById('s-secondary-hex').value = s.secondary_color || '#f50057';
        document.getElementById('s-accent-color').value = s.accent_color || '#00f5ff';
        document.getElementById('s-accent-hex').value = s.accent_color || '#00f5ff';
        document.getElementById('s-font').value = s.font_family || 'Inter';
        document.getElementById('s-title').value = s.site_title || '';
        document.getElementById('s-tagline').value = s.site_tagline || '';
        document.getElementById('s-email').value = s.email || '';
        document.getElementById('s-phone').value = s.phone || '';
        document.getElementById('s-location').value = s.location || '';
        document.getElementById('s-linkedin').value = s.linkedin || '';
        document.getElementById('s-github').value = s.github || '';
        document.getElementById('s-twitter').value = s.twitter || '';
        document.getElementById('s-facebook').value = s.facebook || '';
        document.getElementById('s-cv-url').value = s.cv_url || '';
    } catch (e) { toast('Error loading settings', 'error'); }
}

async function saveSettings() {
    const body = {
        primary_color: document.getElementById('s-primary-hex').value || document.getElementById('s-primary-color').value,
        secondary_color: document.getElementById('s-secondary-hex').value || document.getElementById('s-secondary-color').value,
        accent_color: document.getElementById('s-accent-hex').value || document.getElementById('s-accent-color').value,
        font_family: document.getElementById('s-font').value,
        site_title: document.getElementById('s-title').value,
        site_tagline: document.getElementById('s-tagline').value,
        email: document.getElementById('s-email').value,
        phone: document.getElementById('s-phone').value,
        location: document.getElementById('s-location').value,
        linkedin: document.getElementById('s-linkedin').value,
        github: document.getElementById('s-github').value,
        twitter: document.getElementById('s-twitter').value,
        facebook: document.getElementById('s-facebook').value,
        cv_url: document.getElementById('s-cv-url').value,
    };
    try { await req('PUT', '/settings', body); toast('Settings saved!'); }
    catch (e) { toast('Error: ' + e.message, 'error'); }
}

async function changePassword() {
    const oldPwd = document.getElementById('s-old-password').value;
    const newPwd = document.getElementById('s-new-password').value;
    if (!oldPwd || !newPwd) { toast('Both fields required', 'error'); return; }
    const stored = localStorage.getItem('cms_token');
    // Decode username from JWT
    const payload = JSON.parse(atob(stored.split('.')[1]));
    try {
        await req('POST', '/auth/change-password', { username: payload.username, oldPassword: oldPwd, newPassword: newPwd });
        toast('Password changed!');
        document.getElementById('s-old-password').value = '';
        document.getElementById('s-new-password').value = '';
    } catch (e) { toast('Error: ' + e.message, 'error'); }
}

async function loadActivity() {
    try {
        const rows = await req('GET', '/analytics/activity');
        document.getElementById('activity-log-list').innerHTML = rows.map(a =>
            `<div class="activity-item">
        <div class="activity-dot" style="background:${a.action === 'delete' ? 'var(--danger)' : a.action === 'create' ? 'var(--success)' : a.action === 'upload' ? 'var(--accent-3)' : 'var(--accent)'}"></div>
        <div class="activity-details">
          <div class="activity-action">${a.details}</div>
          <div class="activity-time">${formatDate(a.created_at)} • ${a.action.toUpperCase()}</div>
        </div>
      </div>`
        ).join('') || '<p class="text-muted text-sm">No activity yet</p>';
    } catch (e) { toast('Error loading activity', 'error'); }
}

// ─────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────
async function loadNavigation() {
    try {
        const rows = await req('GET', '/navigation');
        const header = rows.filter(r => r.location === 'header');
        const footer = rows.filter(r => r.location === 'footer');

        const render = (list) => list.map(n => `
            <div class="list-item" style="display:flex; justify-content:space-between; align-items:center; padding:.75rem; background:var(--bg-secondary); border-radius:8px; margin-bottom:.5rem;">
                <div><strong>${n.label}</strong> <code class="text-sm" style="color:var(--accent)">${n.url}</code></div>
                <div class="flex gap-1">
                    <button class="btn btn-ghost btn-sm" onclick="openNavModal(${JSON.stringify(n).replace(/"/g, '&quot;')})">Edit</button>
                    <button class="btn btn-ghost btn-sm text-danger" onclick="deleteNav(${n.id})">Delete</button>
                </div>
            </div>
        `).join('') || '<p class="text-muted text-sm">No links added</p>';

        document.getElementById('nav-header-list').innerHTML = render(header);
        document.getElementById('nav-footer-list').innerHTML = render(footer);
    } catch (e) { toast('Error loading navigation', 'error'); }
}

function openNavModal(data = null) {
    document.getElementById('nm-id').value = data ? data.id : '';
    document.getElementById('nm-label').value = data ? data.label : '';
    document.getElementById('nm-url').value = data ? data.url : '';
    document.getElementById('nm-location').value = data ? data.location : 'header';
    document.getElementById('nm-order').value = data ? data.sort_order : '0';
    document.getElementById('nav-modal-title').innerText = data ? 'Edit Link' : 'New Link';
    document.getElementById('nav-modal').classList.add('active');
}

async function saveNav() {
    const id = document.getElementById('nm-id').value;
    const body = {
        label: document.getElementById('nm-label').value,
        url: document.getElementById('nm-url').value,
        location: document.getElementById('nm-location').value,
        sort_order: parseInt(document.getElementById('nm-order').value) || 0
    };
    if (!body.label || !body.url) return toast('Label and URL required', 'error');
    try {
        await req(id ? 'PUT' : 'POST', id ? `/navigation/${id}` : '/navigation', body);
        closeModal('nav-modal');
        loadNavigation();
        toast('Link saved!');
    } catch (e) { toast('Error: ' + e.message, 'error'); }
}

async function deleteNav(id) {
    if (!confirm('Delete this link?')) return;
    try {
        await req('DELETE', `/navigation/${id}`);
        loadNavigation();
        toast('Link deleted');
    } catch (e) { toast('Error: ' + e.message, 'error'); }
}

// ─────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────
async function loadTestimonials() {
    try {
        const rows = await req('GET', '/testimonials');
        document.getElementById('testimonials-list').innerHTML = rows.map(t => `
            <div class="card mb-1">
                <div class="flex-center gap-1" style="justify-content:space-between">
                    <div class="flex-center gap-1">
                        ${t.avatar ? `<img src="${t.avatar}" style="width:40px;height:40px;border-radius:50%;object-fit:cover;">` : '<div class="user-avatar">👤</div>'}
                        <div>
                            <strong>${t.name}</strong><br>
                            <small class="text-muted">${t.role} @ ${t.company}</small>
                        </div>
                    </div>
                    <div class="flex gap-1">
                        <button class="btn btn-ghost btn-sm" onclick="openTestimonialModal(${JSON.stringify(t).replace(/"/g, '&quot;')})">Edit</button>
                        <button class="btn btn-ghost btn-sm text-danger" onclick="deleteTestimonial(${t.id})">Delete</button>
                    </div>
                </div>
                <p class="text-sm mt-1" style="font-style:italic">"${t.content}"</p>
            </div>
        `).join('') || '<p class="text-muted text-sm">No testimonials yet</p>';
    } catch (e) { toast('Error loading testimonials', 'error'); }
}

function openTestimonialModal(data = null) {
    document.getElementById('tm-id').value = data ? data.id : '';
    document.getElementById('tm-name').value = data ? data.name : '';
    document.getElementById('tm-avatar').value = data ? data.avatar : '';
    document.getElementById('tm-role').value = data ? data.role : '';
    document.getElementById('tm-company').value = data ? data.company : '';
    document.getElementById('tm-content').value = data ? data.content : '';
    document.getElementById('tm-order').value = data ? data.sort_order : '0';
    document.getElementById('test-modal-title').innerText = data ? 'Edit Testimonial' : 'New Testimonial';
    document.getElementById('testimonial-modal').classList.add('active');
}

async function saveTestimonial() {
    const id = document.getElementById('tm-id').value;
    const body = {
        name: document.getElementById('tm-name').value,
        avatar: document.getElementById('tm-avatar').value,
        role: document.getElementById('tm-role').value,
        company: document.getElementById('tm-company').value,
        content: document.getElementById('tm-content').value,
        sort_order: parseInt(document.getElementById('tm-order').value) || 0
    };
    if (!body.name || !body.content) return toast('Name and Content required', 'error');
    try {
        await req(id ? 'PUT' : 'POST', id ? `/testimonials/${id}` : '/testimonials', body);
        closeModal('testimonial-modal');
        loadTestimonials();
        toast('Testimonial saved!');
    } catch (e) { toast('Error: ' + e.message, 'error'); }
}

async function deleteTestimonial(id) {
    if (!confirm('Delete this testimonial?')) return;
    try {
        await req('DELETE', `/testimonials/${id}`);
        loadTestimonials();
        toast('Testimonial deleted');
    } catch (e) { toast('Error: ' + e.message, 'error'); }
}

// ─────────────────────────────────────────────────────────
// BACKUP & RESTORE
// ─────────────────────────────────────────────────────────
async function exportData() {
    try {
        const data = await req('GET', '/settings/export-all');
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        toast('Backup started!');
    } catch (e) { toast('Export failed: ' + e.message, 'error'); }
}

async function importData(file) {
    if (!file) return;
    if (!confirm('CRITICAL: This will overwrite ALL data. Are you sure?')) return;
    try {
        const text = await file.text();
        const data = JSON.parse(text);
        await req('POST', '/settings/import-all', data);
        toast('Database restored! Refreshing...', 'success');
        setTimeout(() => location.reload(), 2000);
    } catch (e) { toast('Import failed: ' + e.message, 'error'); }
}
