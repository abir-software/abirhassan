// =========================================================
// LAYOUT COMPONENTS — Universal Top Transparent Navbar, Mobile Drawer & Footer
// =========================================================

(function () {
    const DEFAULT_NAV = [
        { label: 'HOME', url: 'index.html', icon: '🏠' },
        { label: 'ABOUT', url: 'about.html', icon: '👤' },
        { label: 'EXPERIENCE', url: 'experience.html', icon: '💼' },
        { label: 'QA & TESTING', url: 'qa-testing.html', icon: '🧪' },
        { label: 'PM', url: 'pm-details.html', icon: '📋' },
        { label: 'WEB DEV', url: 'web-dev.html', icon: '💻' },
        { label: 'PROJECTS', url: 'projects.html', icon: '🚀' },
        { label: 'BLOG', url: 'blog.html', icon: '📝' },
        { label: 'CONTACT', url: 'contact.html', icon: '✉️' },
    ];

    const PAGE_BADGES = {
        'index.html': 'PORTFOLIO',
        '': 'PORTFOLIO',
        '/': 'PORTFOLIO',
        'about.html': 'ABOUT',
        'experience.html': 'EXPERIENCE',
        'qa-testing.html': 'QA & TESTING',
        'pm-details.html': 'PM',
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

    function isLinkActive(url, currentPage) {
        if (!url) return false;
        const cleanUrl = url.split('/').pop().split('?')[0];
        if (cleanUrl === currentPage) return true;
        if ((currentPage === '' || currentPage === 'index.html') && cleanUrl === 'index.html') return true;
        return false;
    }

    function buildDesktopNavHtml(navItems, currentPage) {
        return navItems.map(item => {
            const activeClass = isLinkActive(item.url, currentPage) ? ' class="active"' : '';
            return `<a href="${item.url}"${activeClass}>${escapeHTML(item.label)}</a>`;
        }).join('\n                    ');
    }

    function buildMobileOverlayLinksHtml(navItems, currentPage) {
        return navItems.map(item => {
            const activeClass = isLinkActive(item.url, currentPage) ? ' class="active"' : '';
            const icon = item.icon || '✦';
            return `<a href="${item.url}"${activeClass}><span class="nav-icon">${icon}</span> <span class="nav-label">${escapeHTML(item.label)}</span></a>`;
        }).join('\n                ');
    }

    function renderImmediateLayout(navItems) {
        const fixedContainer = document.getElementById('fixed-ui');
        const scrollContainer = document.getElementById('scroll-content') || document.body;

        const currentPage = getCurrentPage();
        const badgeText = PAGE_BADGES[currentPage] || 'PORTFOLIO';
        const desktopNavHtml = buildDesktopNavHtml(navItems, currentPage);
        const mobileNavHtml = buildMobileOverlayLinksHtml(navItems, currentPage);

        // 1. Render Header & Mobile Drawer in #fixed-ui
        if (fixedContainer) {
            fixedContainer.innerHTML = `
            <header class="top-navbar interactive">
                <div class="nav-brand">
                    <a href="index.html" class="logo">A<span class="logo-x">H</span></a>
                </div>

                <nav class="top-nav-links desktop-nav">
                    ${desktopNavHtml}
                </nav>

                <div class="nav-right">
                    <div class="yesex-logo">${escapeHTML(badgeText)}</div>
                    <button class="mobile-toggle-btn" id="mobile-toggle-btn" aria-label="Open Navigation Menu">
                        <span class="bar"></span>
                        <span class="bar"></span>
                        <span class="bar"></span>
                    </button>
                </div>
            </header>

            <!-- Compact Sub-Nav Strip for Mobile Swipe -->
            <div class="mobile-strip-bar interactive">
                <nav class="mobile-nav-scroll">
                    ${desktopNavHtml}
                </nav>
            </div>

            <!-- Fullscreen Glass Overlay Drawer for Mobile -->
            <div class="mobile-glass-overlay" id="mobile-glass-overlay">
                <div class="overlay-header">
                    <a href="index.html" class="logo">A<span class="logo-x">H</span></a>
                    <button class="overlay-close-btn" id="overlay-close-btn" aria-label="Close Navigation Menu">&times;</button>
                </div>

                <div class="overlay-nav-grid">
                    ${mobileNavHtml}
                </div>

                <div class="overlay-footer">
                    <div class="social-pills">
                        <a href="https://linkedin.com/in/abirhassan" target="_blank" rel="noopener">LinkedIn ↗</a>
                        <a href="https://github.com/abir-software" target="_blank" rel="noopener">GitHub ↗</a>
                    </div>
                </div>
            </div>
            `;

            // Bind toggle & overlay events
            bindMobileMenuEvents();
        }

        // 2. Render Footer at end of #scroll-content
        if (scrollContainer) {
            let footerEl = document.querySelector('.transparent-footer');
            if (!footerEl) {
                footerEl = document.createElement('footer');
                footerEl.className = 'transparent-footer interactive';
                scrollContainer.appendChild(footerEl);
            }

            footerEl.innerHTML = `
                <div class="footer-col brand-col">
                    <a href="index.html" class="footer-logo">A<span class="logo-x">H</span></a>
                    <p class="footer-desc">Software Engineer & Project Manager bridging technical excellence with operational efficiency.</p>
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
        }
    }

    function bindMobileMenuEvents() {
        const toggleBtn = document.getElementById('mobile-toggle-btn');
        const closeBtn = document.getElementById('overlay-close-btn');
        const overlay = document.getElementById('mobile-glass-overlay');

        if (!toggleBtn || !overlay) return;

        function openOverlay() {
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeOverlay() {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        toggleBtn.addEventListener('click', openOverlay);
        if (closeBtn) closeBtn.addEventListener('click', closeOverlay);

        // Close on escape key
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && overlay.classList.contains('open')) {
                closeOverlay();
            }
        });
    }

    async function syncNavFromAPI() {
        try {
            const res = await fetch('/api/navigation');
            if (!res.ok) return;
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
                // Merge icons
                const merged = data.map(item => {
                    const found = DEFAULT_NAV.find(d => d.url === item.url);
                    return { ...item, icon: found ? found.icon : '✦' };
                });
                renderImmediateLayout(merged);
            }
        } catch (e) {
            // Ignore API errors
        }
    }

    function escapeHTML(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function init() {
        renderImmediateLayout(DEFAULT_NAV);
        syncNavFromAPI();
    }

    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
