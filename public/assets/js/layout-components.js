// =========================================================
// LAYOUT COMPONENTS — Universal Top Transparent Navbar & End Page Footer
// =========================================================

(function () {
    const DEFAULT_NAV = [
        { label: 'HOME', url: 'index.html' },
        { label: 'ABOUT', url: 'about.html' },
        { label: 'EXPERIENCE', url: 'experience.html' },
        { label: 'QA & TESTING', url: 'qa-testing.html' },
        { label: 'PM DETAILS', url: 'pm-details.html' },
        { label: 'PROJECTS', url: 'projects.html' },
        { label: 'WEB DEV', url: 'web-dev.html' },
        { label: 'BLOG', url: 'blog.html' },
        { label: 'CONTACT', url: 'contact.html' },
    ];

    const PAGE_BADGES = {
        'index.html': 'PORTFOLIO',
        '': 'PORTFOLIO',
        '/': 'PORTFOLIO',
        'about.html': 'ABOUT',
        'experience.html': 'EXPERIENCE',
        'qa-testing.html': 'QA & TESTING',
        'pm-details.html': 'PM DETAILS',
        'projects.html': 'PROJECTS',
        'web-dev.html': 'WEB DEV',
        'blog.html': 'BLOG',
        'blog-detail.html': 'BLOG DETAIL',
        'contact.html': 'CONTACT',
    };

    function getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop();
        return page || 'index.html';
    }

    async function fetchNavFromAPI() {
        try {
            const res = await fetch('/api/navigation');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            return (Array.isArray(data) && data.length > 0) ? data : DEFAULT_NAV;
        } catch (e) {
            return DEFAULT_NAV;
        }
    }

    async function renderUniversalLayout() {
        const fixedContainer = document.getElementById('fixed-ui');
        const scrollContainer = document.getElementById('scroll-content') || document.body;

        const currentPage = getCurrentPage();
        const navItems = await fetchNavFromAPI();
        const badgeText = PAGE_BADGES[currentPage] || 'PORTFOLIO';

        function isLinkActive(url) {
            if (!url) return false;
            const cleanUrl = url.split('/').pop().split('?')[0];
            if (cleanUrl === currentPage) return true;
            if ((currentPage === '' || currentPage === 'index.html') && cleanUrl === 'index.html') return true;
            return false;
        }

        const navLinksHtml = navItems.map(item => {
            const activeClass = isLinkActive(item.url) ? ' class="active"' : '';
            return `<a href="${item.url}"${activeClass}>${escapeHTML(item.label)}</a>`;
        }).join('\n                    ');

        // 1. Render Header in #fixed-ui
        if (fixedContainer) {
            fixedContainer.innerHTML = `
            <header class="top-navbar interactive">
                <div class="nav-brand">
                    <a href="index.html" class="logo">A<span class="logo-x">H</span></a>
                </div>

                <nav class="top-nav-links">
                    ${navLinksHtml}
                </nav>

                <div class="nav-right">
                    <div class="yesex-logo">${escapeHTML(badgeText)}</div>
                </div>
            </header>
            `;
        }

        // 2. Remove old footer if exists, then append new footer to end of #scroll-content
        const existingFooter = document.querySelector('.transparent-footer');
        if (existingFooter) existingFooter.remove();

        const footerEl = document.createElement('footer');
        footerEl.className = 'transparent-footer interactive';
        footerEl.innerHTML = `
            <div class="footer-col brand-col">
                <a href="index.html" class="footer-logo">A<span class="logo-x">H</span></a>
                <p class="footer-desc">Jr. Software Engineer (SQA) & Project Manager bridging technical excellence with operational efficiency.</p>
                <div class="footer-copy">© 2026 Md Abir Hassan. All rights reserved.</div>
            </div>

            <div class="footer-col info-col">
                <div class="footer-heading">CONTACT & LOCATION</div>
                <div class="footer-info-item">📍 Dhaka, Bangladesh</div>
                <div class="footer-info-item">📧 mdabirhassan2@gmail.com</div>
                <div class="footer-info-item">🏢 Daffodil Software Ltd.</div>
            </div>

            <div class="footer-col links-col">
                <div class="footer-heading">QUICK LINKS</div>
                <div class="footer-links-grid">
                    <a href="index.html">Home</a>
                    <a href="about.html">About</a>
                    <a href="experience.html">Experience</a>
                    <a href="projects.html">Projects</a>
                    <a href="blog.html">Blog</a>
                    <a href="contact.html">Contact</a>
                </div>
                <div class="footer-socials">
                    <a href="https://linkedin.com/in/abirhassan" target="_blank" rel="noopener">LinkedIn ↗</a>
                    <a href="https://github.com/abir-software" target="_blank" rel="noopener">GitHub ↗</a>
                </div>
            </div>
        `;

        scrollContainer.appendChild(footerEl);
    }

    function escapeHTML(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderUniversalLayout);
    } else {
        renderUniversalLayout();
    }
})();
