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

    // ─── 3. POPULATE EXPERIENCE TIMELINE ────────────────────
    async function loadExperienceData() {
        const data = await fetchAPI('/experience');
        if (!data || !Array.isArray(data) || data.length === 0) return;

        const expSection = document.querySelector('.section.experience');
        if (!expSection) return;

        const gridEl = expSection.querySelector('.grid');
        const timelineHtml = `
            <div class="career-timeline">
                ${data.map((item, idx) => {
                    const badge = idx === 0 ? 'PRESENT ROLE' : (item.duration || 'MILESTONE');
                    const isDaffodil = item.company && item.company.includes('Daffodil');
                    const logoHtml = isDaffodil ? `<img src="/assets/images/daffodilgroup.jpg" alt="${escapeHTML(item.company)}" class="company-logo-img">` : '';
                    
                    let responsibilitiesHtml = '';
                    const respSource = item.responsibilities || item.highlights;
                    if (respSource) {
                        try {
                            const arr = typeof respSource === 'string' ? JSON.parse(respSource) : respSource;
                            if (Array.isArray(arr) && arr.length > 0) {
                                responsibilitiesHtml = `
                                    <div class="timeline-highlights">
                                        ${arr.map(h => `<div class="timeline-highlight-item">${escapeHTML(h)}</div>`).join('')}
                                    </div>
                                `;
                            }
                        } catch (e) {
                            if (typeof respSource === 'string') {
                                responsibilitiesHtml = `
                                    <div class="timeline-highlights">
                                        <div class="timeline-highlight-item">${escapeHTML(respSource)}</div>
                                    </div>
                                `;
                            }
                        }
                    }

                    let tagsHtml = '';
                    if (item.skills) {
                        const tags = typeof item.skills === 'string' ? item.skills.split(',').map(s => s.trim()) : item.skills;
                        if (Array.isArray(tags) && tags.length > 0) {
                            tagsHtml = `
                                <div class="tags" style="margin-top: 15px;">
                                    ${tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
                                </div>
                            `;
                        }
                    }

                    const locationText = isDaffodil ? '📍 Daffodil Tower, 102/1, Shukrabad, Mirpur Road, Dhaka-1207, Bangladesh · On-site' : '';

                    return `
                        <div class="timeline-item">
                            <div class="timeline-node"></div>
                            <div class="timeline-card">
                                <div class="timeline-header">
                                    <div style="display: flex; align-items: center; gap: 15px;">
                                        ${logoHtml}
                                        <div>
                                            <h3 class="timeline-title">${escapeHTML(item.role || item.title || '')}</h3>
                                            <div class="timeline-company" style="margin-bottom: 0; margin-top: 4px;">
                                                <span>🏢 ${escapeHTML(item.company || '')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span class="timeline-badge">${escapeHTML(badge)}</span>
                                </div>
                                <div class="timeline-company" style="margin-top: 10px;">
                                    ${item.duration ? `<span class="duration">📅 ${escapeHTML(item.duration)}</span>` : ''}
                                    ${locationText ? `<span class="duration" style="background: rgba(255,255,255,0.04); font-size: 11px;">${escapeHTML(locationText)}</span>` : ''}
                                </div>
                                ${item.desc ? `<div class="timeline-desc">${escapeHTML(item.desc)}</div>` : ''}
                                ${responsibilitiesHtml}
                                ${tagsHtml}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        if (gridEl) {
            gridEl.outerHTML = timelineHtml;
        } else {
            const wrapper = expSection.querySelector('.content-wrapper');
            if (wrapper) wrapper.insertAdjacentHTML('beforeend', timelineHtml);
        }
    }
            if (wrapper) wrapper.insertAdjacentHTML('beforeend', timelineHtml);
        }
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
