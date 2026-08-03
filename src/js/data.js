// ========================================
// DATA — API-driven content loader
// Replaces static exports with live API fetches
// Falls back to hardcoded data if server unreachable
// ========================================

const API_BASE = 'http://localhost:3000/api';

async function fetchAPI(path) {
    try {
        const res = await fetch(`${API_BASE}${path}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
    } catch (e) {
        console.warn(`API fetch failed for ${path}:`, e.message);
        return null;
    }
}

// ─── Public API exports (async) ──────────────────────────
export async function getHero() {
    const data = await fetchAPI('/hero');
    if (data) return data;
    // Fallback
    return {
        name: 'Md Abir Hassan',
        role: 'Jr. Software Engineer (SQA)',
        company: 'Daffodil Software Ltd.',
        titles: ['SQA Engineer', 'Project Coordinator', 'Admin Specialist', 'Frontend Developer'],
        summary: 'Experienced professional with 4+ years across Software Quality Assurance, Project Management, and Frontend Web Development.',
        stats: [
            { value: '4+', label: 'Years Experience' },
            { value: '50+', label: 'Projects' },
            { value: '15+', label: 'Clients' },
            { value: '100%', label: 'Quality' },
        ],
        cta_primary: 'View Projects',
        cta_secondary: 'Download CV',
    };
}

export async function getSkills() {
    const data = await fetchAPI('/skills');
    if (data) return data;
    return {
        competencies: [
            { name: 'Software Testing & QA', value: 90 },
            { name: 'Project Management & Documentation', value: 85 },
            { name: 'Corporate Administration & Compliance', value: 95 },
            { name: 'Web Development', value: 80 },
            { name: 'AI Tools & Productivity', value: 75 },
            { name: 'Business Operations Support', value: 70 },
        ],
        expertise: [
            { icon: '🧪', title: 'Software Testing & QA', desc: 'Functional, security, and performance testing across 50+ enterprise systems.', mode: 'qa' },
            { icon: '📊', title: 'Project Management', desc: 'End-to-end project coordination, documentation, and stakeholder communication.', mode: 'pm' },
            { icon: '🌐', title: 'Web Development', desc: 'Frontend development with HTML5, CSS3, JavaScript, and modern frameworks.', mode: 'dev' },
            { icon: '🏢', title: 'Corporate Administration', desc: 'ISO compliance, audit management, and cross-department coordination.', mode: 'pm' },
        ],
        qaExpertise: [
            { icon: '🔍', title: 'Functional & Integration', items: ['Unit Testing', 'Integration Testing', 'System Testing', 'Regression Testing'] },
            { icon: '🔐', title: 'Security & Performance', items: ['Penetration Testing', 'Load Testing', 'Stress Testing', 'Security Audits'] },
            { icon: '🎯', title: 'End-to-End Testing', items: ['User Flow Testing', 'Cross-browser Testing', 'Mobile Testing', 'API Testing'] },
            { icon: '✅', title: 'UAT & Accessibility', items: ['User Acceptance Testing', 'SEO Auditing', 'Accessibility Checks', 'Compliance Testing'] },
        ],
        qaTools: [
            { name: 'Selenium' }, { name: 'Cypress' }, { name: 'JMeter' }, { name: 'LoadRunner' }, { name: 'Jira' },
            { name: 'Bugzilla' }, { name: 'Postman' }, { name: 'GTmetrix' }, { name: 'BrowserStack' }, { name: 'Git' },
        ],
        pmResponsibilities: [
            { icon: '📋', title: 'Planning & Coordination', desc: 'Sprint planning, task breakdown, and timeline management across multiple teams.' },
            { icon: '🤝', title: 'Stakeholder Communication', desc: 'Regular status updates, requirement gathering, and client relationship management.' },
            { icon: '📦', title: 'Resource Allocation', desc: 'Team capacity planning, workload distribution, and milestone tracking.' },
            { icon: '⚠️', title: 'Risk & Issue Management', desc: 'Proactive risk identification, mitigation strategies, and issue escalation.' },
        ],
        pmDocs: [
            { icon: '📝', name: 'SRS (Software Requirement Specification)' },
            { icon: '📊', name: 'BRS (Business Requirement Specification)' },
            { icon: '🗂️', name: 'WBS (Work Breakdown Structure)' },
            { icon: '📋', name: 'Project Charter' },
            { icon: '🏢', name: 'ISO Documentation' },
            { icon: '📖', name: 'SOPs & User Manuals' },
        ],
        webSkills: [
            { name: 'HTML5' }, { name: 'CSS3' }, { name: 'JavaScript' }, { name: 'Tailwind CSS' },
            { name: 'Bootstrap' }, { name: 'React (Learning)' }, { name: 'Responsive Design' },
            { name: 'Git & GitHub' }, { name: 'Vite' }, { name: 'REST APIs' },
        ],
        workflowSteps: [
            { label: 'Requirement' }, { label: 'Design' }, { label: 'Development' },
            { label: 'Testing' }, { label: 'Deployment' }, { label: 'Documentation' },
        ],
    };
}

export async function getProjects(category = null) {
    const url = category && category !== 'all' ? `/projects?category=${category}` : '/projects';
    const data = await fetchAPI(url);
    if (data) return data;
    return [];
}

export async function getFeaturedProjects() {
    return getProjects().then(p => p.filter(x => x.featured));
}

export async function getBlogs(params = {}) {
    const qs = new URLSearchParams(params).toString();
    const data = await fetchAPI(`/blogs${qs ? '?' + qs : ''}`);
    return data?.data || [];
}

export async function getFeaturedBlogs() {
    return getBlogs({ featured: true, limit: 3 });
}

export async function getTopBlogs() {
    return getBlogs({ top_reading: true, limit: 3 });
}

export async function getEducation() {
    const data = await fetchAPI('/education');
    return data || { education: [], certifications: [] };
}

export async function getExperience() {
    const data = await fetchAPI('/experience');
    return data || [];
}

export async function getSettings() {
    const data = await fetchAPI('/settings');
    return data || {};
}

export async function getNavigation() {
    const data = await fetchAPI('/navigation');
    return data || [];
}

export async function getTestimonials() {
    const data = await fetchAPI('/testimonials');
    return data || [];
}

export async function trackVisitor() {
    return fetch(`${API_BASE}/settings/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: window.location.href }),
    }).catch(() => { });
}

// ─── Apply theme settings dynamically ────────────────────
export async function applyThemeSettings() {
    const settings = await getSettings();
    if (!settings) return;
    const root = document.documentElement;
    if (settings.primary_color) root.style.setProperty('--color-primary', settings.primary_color);
    if (settings.secondary_color) root.style.setProperty('--color-secondary', settings.secondary_color);
    if (settings.accent_color) root.style.setProperty('--color-accent', settings.accent_color);
    if (settings.font_family) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${settings.font_family}:wght@300;400;500;600;700;800&display=swap`;
        document.head.appendChild(link);
        root.style.setProperty('--font-primary', `'${settings.font_family}', sans-serif`);
    }
    if (settings.site_title) document.title = settings.site_title;
}

// ─── Legacy named exports for backward compat ────────────
// These are synchronous fallbacks — renderers that already run
// will still get data through the async functions above
export const personalInfo = {
    name: 'Md Abir Hassan',
    titles: ['SQA Engineer', 'Project Coordinator', 'Admin Specialist', 'Frontend Developer'],
    role: 'Jr. Software Engineer (SQA)',
    company: 'Daffodil Software Ltd.',
    summary: 'Experienced professional with 4+ years of experience across Software Quality Assurance, Project Management, Corporate Administration, and Frontend Web Development.',
};

export const expertise = [];
export const competencies = [];
export const qaExpertise = [];
export const qaTools = [];
export const pmResponsibilities = [];
export const pmDocs = [];
export const projects = [];
export const webDevSkills = [];
export const workflowSteps = [];
export const education = [];
export const certifications = [];
export const blogArticles = [];
export async function getContactChannels() {
    const s = await getSettings();
    const channels = [];
    if (s.email) channels.push({ icon: '📧', title: 'Email', value: s.email, link: `mailto:${s.email}` });
    if (s.phone) channels.push({ icon: '📞', title: 'Phone', value: s.phone, link: `tel:${s.phone}` });
    if (s.location) channels.push({ icon: '📍', title: 'Location', value: s.location });
    if (s.whatsapp) channels.push({ icon: '💬', title: 'WhatsApp', value: s.whatsapp });

    // Fallback defaults if none found
    if (channels.length === 0) {
        return [
            { icon: '📧', title: 'Email', value: 'abirhassan@example.com' },
            { icon: '💼', title: 'LinkedIn', value: 'linkedin.com/in/abirhassan' },
        ];
    }
    return channels;
}
