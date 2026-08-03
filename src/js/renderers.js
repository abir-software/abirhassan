// ========================================
// RENDERERS — API-driven content rendering
// ========================================
import {
  getSkills, getProjects, getEducation, getFeaturedBlogs,
  getContactChannels, getNavigation, getTestimonials, getSettings
} from './data.js';

// ─── Helper: render to a DOM element ─────────────────────
function el(id) { return document.getElementById(id); }

// ─── EXPERTISE CARDS ─────────────────────────────────────
export async function renderExpertise() {
  const grid = el('expertise-grid');
  if (!grid) return;
  const { expertise } = await getSkills();
  grid.innerHTML = (expertise || []).map(item => `
    <div class="expertise-card glass-card" data-mode="${item.mode}">
      <span class="expertise-card__icon">${item.icon}</span>
      <h3 class="expertise-card__title">${item.title}</h3>
      <p class="expertise-card__desc">${item.desc}</p>
    </div>
  `).join('');
}

// ─── COMPETENCY BARS ─────────────────────────────────────
export async function renderCompetencies() {
  const grid = el('competencies-grid');
  if (!grid) return;
  const { competencies } = await getSkills();
  grid.innerHTML = (competencies || []).map(item => `
    <div class="competency-item glass-card">
      <div class="competency-item__header">
        <span class="competency-item__name">${item.name}</span>
        <span class="competency-item__value">${item.value}%</span>
      </div>
      <div class="competency-bar">
        <div class="competency-bar__fill" data-value="${item.value}"></div>
      </div>
    </div>
  `).join('');
}

// ─── QA EXPERTISE ────────────────────────────────────────
export async function renderQAExpertise() {
  const grid = el('qa-expertise-grid');
  if (!grid) return;
  const { qaExpertise } = await getSkills();
  grid.innerHTML = (qaExpertise || []).map(item => `
    <div class="qa-card glass-card">
      <span class="qa-card__icon">${item.icon}</span>
      <h3 class="qa-card__title">${item.title}</h3>
      <ul class="qa-card__items">
        ${(item.items || []).map(i => `<li>${i}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

// ─── QA TOOLS ────────────────────────────────────────────
export async function renderQATools() {
  const grid = el('qa-tools-grid');
  if (!grid) return;
  const { qaTools } = await getSkills();
  grid.innerHTML = (qaTools || []).map(t => `
    <div class="tool-item">${t.name || t}</div>
  `).join('');
}

// ─── PM RESPONSIBILITIES ─────────────────────────────────
export async function renderPMResponsibilities() {
  const list = el('pm-resp-list');
  if (!list) return;
  const { pmResponsibilities } = await getSkills();
  list.innerHTML = (pmResponsibilities || []).map(item => `
    <div class="pm-resp-item glass-card">
      <span class="pm-resp-item__icon">${item.icon}</span>
      <div class="pm-resp-item__text">
        <strong>${item.title}</strong> ${item.desc}
      </div>
    </div>
  `).join('');
}

// ─── PM DOCS ─────────────────────────────────────────────
export async function renderPMDocs() {
  const grid = el('pm-docs-grid');
  if (!grid) return;
  const { pmDocs } = await getSkills();
  grid.innerHTML = (pmDocs || []).map(item => `
    <div class="pm-doc-item glass-card">
      <span class="pm-doc-item__icon">${item.icon}</span>
      <span class="pm-doc-item__name">${item.name}</span>
    </div>
  `).join('');
}

// ─── PROJECTS ────────────────────────────────────────────
export async function renderProjects() {
  const grid = el('projects-grid');
  if (!grid) return;
  const projects = await getProjects();
  grid.innerHTML = (projects || []).map(p => `
    <div class="project-card glass-card" data-category="${p.category}" data-visible="true">
      ${p.highlight ? '<span class="project-card__badge">🔥 Featured</span>' : ''}
      <span class="project-card__category">${p.category.toUpperCase()}</span>
      <h3 class="project-card__title">${p.title}</h3>
      <p class="project-card__org">${p.org}</p>
      <p class="project-card__desc">${p.desc}</p>
      <div class="project-card__tags">
        ${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// ─── WEB DEV SKILLS ──────────────────────────────────────
export async function renderWebDevSkills() {
  const container = el('webdev-skills-tags');
  if (!container) return;
  const { webSkills } = await getSkills();
  container.innerHTML = (webSkills || []).map(s => `
    <span class="skill-tag">${s.name || s}</span>
  `).join('');
}

// ─── WORKFLOW ────────────────────────────────────────────
export async function renderWorkflow() {
  const track = el('workflow-track');
  if (!track) return;
  const { workflowSteps } = await getSkills();
  const steps = workflowSteps || [];
  track.innerHTML = steps.map((step, i) => `
    <div class="workflow-step">
      <div class="workflow-step__number">${i + 1}</div>
      <div class="workflow-step__label">${step.label || step}</div>
      ${i < steps.length - 1 ? '<span class="workflow-step__arrow">→</span>' : ''}
    </div>
  `).join('');
}

// ─── WEB PROJECTS ────────────────────────────────────────
export async function renderWebProjects() {
  const grid = el('web-projects-grid');
  if (!grid) return;
  const projects = await getProjects('web');
  grid.innerHTML = (projects || []).map(p => `
    <div class="project-card glass-card">
      <h3 class="project-card__title">${p.title}</h3>
      <p class="project-card__org">${p.org}</p>
      <p class="project-card__desc">${p.desc}</p>
      <div class="project-card__tags">
        ${(p.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// ─── EDUCATION ───────────────────────────────────────────
export async function renderEducation() {
  const grid = el('education-grid');
  if (!grid) return;
  const { education } = await getEducation();
  grid.innerHTML = (education || []).map(e => `
    <div class="edu-card glass-card">
      <span class="edu-card__icon">${e.icon}</span>
      <h3 class="edu-card__degree">${e.degree}</h3>
      <p class="edu-card__school">${e.school}</p>
      <span class="edu-card__date">${e.date}</span>
      <p class="edu-card__detail">${e.detail}</p>
    </div>
  `).join('');
}

// ─── CERTIFICATIONS ──────────────────────────────────────
export async function renderCertifications() {
  const grid = el('certs-grid');
  if (!grid) return;
  const { certifications } = await getEducation();
  grid.innerHTML = (certifications || []).map(c => `
    <div class="cert-card glass-card">
      <span class="cert-card__icon">${c.icon}</span>
      <div class="cert-card__info">
        <h4 class="cert-card__name">${c.name}</h4>
        <p class="cert-card__issuer">${c.issuer}</p>
      </div>
    </div>
  `).join('');
}

// ─── BLOG ────────────────────────────────────────────────
export async function renderBlog() {
  const grid = el('blog-grid');
  if (!grid) return;
  const articles = await getFeaturedBlogs();
  if (!articles.length) {
    grid.innerHTML = '<p style="color:var(--color-text-secondary);text-align:center;padding:2rem">No blog posts yet</p>';
    return;
  }
  grid.innerHTML = articles.map(a => `
    <div class="blog-card glass-card">
      <div class="blog-card__header">
        <span class="blog-card__category">${a.category}</span>
        <h3 class="blog-card__title">${a.title}</h3>
      </div>
      <div class="blog-card__body">
        <p class="blog-card__excerpt">${a.excerpt || ''}</p>
      </div>
      <div class="blog-card__footer">
        <a href="blog-detail.html?slug=${a.slug}" class="blog-card__read-more">Read More →</a>
        <span class="blog-card__date">${a.read_count || 0} reads</span>
      </div>
    </div>
  `).join('');
}

// ─── CONTACT CHANNELS ────────────────────────────────────
export async function renderContactChannels() {
  const container = el('contact-channels');
  if (!container) return;
  const channels = await getContactChannels();
  container.innerHTML = channels.map(c => `
    <div class="contact-channel glass-card">
      <span class="contact-channel__icon">${c.icon}</span>
      <div class="contact-channel__info">
        <h4>${c.title}</h4>
        ${c.link ? `<a href="${c.link}">${c.value}</a>` : `<p>${c.value}</p>`}
      </div>
    </div>
  `).join('');
}

// ─── NAVIGATION ──────────────────────────────────────────
export async function renderNavigation() {
  const headerNav = el('nav-links');
  const footerNav = el('footer-nav'); // Assuming there's a footer-nav ID
  const navItems = await getNavigation();

  if (headerNav) {
    const headerItems = navItems.filter(n => n.location === 'header');
    if (headerItems.length > 0) {
      headerNav.innerHTML = headerItems.map(n => `
                <a href="${n.url}" class="nav__link">${n.label}</a>
            `).join('');
    }
  }

  // Re-init smooth scroll for dynamic links
  const { initAnchorScroll } = await import('./interactions.js');
  initAnchorScroll();

  if (footerNav) {
    const footerItems = navItems.filter(n => n.location === 'footer');
    if (footerItems.length > 0) {
      footerNav.innerHTML = footerItems.map(n => `
                <a href="${n.url}" class="footer__link">${n.label}</a>
            `).join('');
    }
  }
}

// ─── TESTIMONIALS ────────────────────────────────────────
export async function renderTestimonials() {
  const grid = el('testimonials-grid'); // Assuming there's a testimonials-grid ID
  if (!grid) return;
  const testimonials = await getTestimonials();
  if (!testimonials.length) return;

  grid.innerHTML = testimonials.map(t => `
        <div class="testimonial-card glass-card">
            <div class="testimonial-card__header">
                ${t.avatar ? `<img src="${t.avatar}" alt="${t.name}" class="testimonial-avatar">` : '<div class="testimonial-avatar-placeholder">👤</div>'}
                <div class="testimonial-info">
                    <h4>${t.name}</h4>
                    <p>${t.role} ${t.company ? `@ ${t.company}` : ''}</p>
                </div>
            </div>
            <p class="testimonial-content">"${t.content}"</p>
        </div>
    `).join('');
}

// ─── GLOBAL CONTENT (HEADINGS/CTA) ──────────────────────
export async function renderGlobalContent() {
  const settings = await getSettings();

  // Download CV Links
  const cvButtons = document.querySelectorAll('a[href*="Download CV"], .btn-cv');
  if (settings.cv_url) {
    cvButtons.forEach(btn => {
      btn.href = settings.cv_url;
      btn.target = '_blank';
    });
  }

  // Social Links in Footer
  const socialContainer = document.querySelector('.footer__socials');
  if (socialContainer && settings) {
    const socials = [];
    if (settings.linkedin) socials.push({ icon: 'LinkedIn', url: settings.linkedin });
    if (settings.github) socials.push({ icon: 'GitHub', url: settings.github });
    if (settings.twitter) socials.push({ icon: 'Twitter', url: settings.twitter });

    socialContainer.innerHTML = socials.map(s => `
            <a href="${s.url}" target="_blank" class="social-icon" title="${s.icon}">${s.icon}</a>
        `).join('');
  }
}
