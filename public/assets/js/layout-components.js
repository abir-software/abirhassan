// =========================================================
// LAYOUT COMPONENTS — Universal Top Fixed Navbar & Footer
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
        const container = document.getElementById('fixed-ui');
        if (!container) return;

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

        container.innerHTML = `
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

        <footer class="interactive">
            <div class="footer-left">
                <span>© 2026 Md Abir Hassan. All rights reserved.</span>
            </div>
            <div class="footer-right">
                <a href="https://linkedin.com/in/abirhassan" target="_blank" rel="noopener">LinkedIn</a>
                <a href="https://github.com/abir-software" target="_blank" rel="noopener">GitHub</a>
                <a href="contact.html">Contact</a>
            </div>
        </footer>
        `;
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
