// =========================================================
// DYNAMIC LOADER — Synchronize Backend CMS Data with Frontend
// =========================================================

(function () {
    const API_BASE = '/api';

    async function fetchAPI(endpoint) {
        try {
            const res = await fetch(`${API_BASE}${endpoint}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (err) {
            console.warn(`[CMS Sync] Could not fetch ${endpoint}, using static fallback.`, err);
            return null;
        }
    }

    // ─── 1. POPULATE HERO & ABOUT SUMMARY ─────────────────────
    async function loadHeroData() {
        const data = await fetchAPI('/hero');
        if (!data) return;

        // Hero Name
        const heroTextEl = document.querySelector('.hero .hero-text');
        if (heroTextEl && data.name) {
            const parts = data.name.split(' ');
            if (parts.length >= 2) {
                const firstName = parts.slice(0, parts.length - 1).join(' ');
                const lastName = parts[parts.length - 1];
                heroTextEl.innerHTML = `${escapeHTML(firstName)}<br>${escapeHTML(lastName)}`;
            } else {
                heroTextEl.textContent = data.name;
            }
        }

        // Subtitle (Role / Company)
        const subtitleEl = document.querySelector('.hero .subtitle');
        if (subtitleEl && data.role) {
            subtitleEl.textContent = data.company ? `${data.role} | ${data.company}` : data.role;
        }

        // Stats
        const statsEl = document.querySelector('.hero .stats');
        if (statsEl && Array.isArray(data.stats) && data.stats.length > 0) {
            statsEl.innerHTML = data.stats.map(s => `
                <div class="stat-item">
                    <h3>${escapeHTML(String(s.value || ''))}</h3>
                    <p>${escapeHTML(String(s.label || ''))}</p>
                </div>
            `).join('');
        }

        // Bio / About Summary
        const aboutContentEl = document.querySelector('.section.about .section-content');
        if (aboutContentEl && data.summary) {
            aboutContentEl.textContent = data.summary;
        }
    }

    // ─── 2. POPULATE SKILLS / EXPERTISE ──────────────────────
    async function loadSkillsData() {
        const data = await fetchAPI('/skills');
        if (!data) return;

        const skillsGridEl = document.querySelector('.section.skills .grid');
        if (!skillsGridEl) return;

        let items = [];
        if (Array.isArray(data.competencies) && data.competencies.length > 0) {
            items = data.competencies;
        } else if (Array.isArray(data.expertise) && data.expertise.length > 0) {
            items = data.expertise;
        }

        if (items.length > 0) {
            skillsGridEl.innerHTML = items.map(item => `
                <div class="card">
                    <div class="card-title">${escapeHTML(item.name || item.title || '')}</div>
                    <div class="card-text">${escapeHTML(item.desc || item.description || (item.value ? `Proficiency: ${item.value}%` : ''))}</div>
                </div>
            `).join('');
        }
    }

    // ─── 3. POPULATE EXPERIENCE ─────────────────────────────
    async function loadExperienceData() {
        const data = await fetchAPI('/experience');
        if (!data || !Array.isArray(data) || data.length === 0) return;

        const expGridEl = document.querySelector('.section.experience .grid');
        if (!expGridEl) return;

        expGridEl.innerHTML = data.map(item => `
            <div class="card">
                <div class="card-title">${escapeHTML(item.role || item.title || '')}</div>
                <div class="card-subtitle">${escapeHTML(item.company || '')} ${item.duration ? `| ${escapeHTML(item.duration)}` : ''}</div>
                <div class="card-text">${escapeHTML(item.desc || item.description || '')}</div>
            </div>
        `).join('');
    }

    // ─── 4. POPULATE FEATURED PROJECTS ──────────────────────
    async function loadProjectsData() {
        const data = await fetchAPI('/projects');
        if (!data || !Array.isArray(data) || data.length === 0) return;

        const projGridEl = document.querySelector('.section.projects .grid');
        if (!projGridEl) return;

        projGridEl.innerHTML = data.slice(0, 6).map(item => `
            <div class="card">
                <div class="card-title">${escapeHTML(item.title || '')}</div>
                <div class="card-subtitle">${escapeHTML(item.category ? item.category.toUpperCase() : (item.org || ''))}</div>
                <div class="card-text">${escapeHTML(item.desc || item.description || '')}</div>
            </div>
        `).join('');
    }

    // ─── 5. POPULATE SETTINGS (THEME / META) ─────────────────
    async function loadSettingsData() {
        const settings = await fetchAPI('/settings');
        if (!settings) return;

        if (settings.site_title && document.title) {
            document.title = settings.site_title;
        }

        const root = document.documentElement;
        if (settings.primary_color) root.style.setProperty('--primary-color', settings.primary_color);
        if (settings.secondary_color) root.style.setProperty('--secondary-color', settings.secondary_color);
        if (settings.accent_color) root.style.setProperty('--accent-color', settings.accent_color);
    }

    // Helper HTML escape
    function escapeHTML(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Initialize on DOM ready
    window.addEventListener('DOMContentLoaded', () => {
        loadHeroData();
        loadSkillsData();
        loadExperienceData();
        loadProjectsData();
        loadSettingsData();
    });
})();
