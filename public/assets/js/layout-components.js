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

        // 1. Render Single Header & Mobile Drawer in #fixed-ui
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
                    <div class="social-pills" style="flex-wrap: wrap;">
                        <a href="https://www.linkedin.com/in/abirhassan2/" target="_blank" rel="noopener">LinkedIn ↗</a>
                        <a href="https://github.com/abir-software" target="_blank" rel="noopener">GitHub ↗</a>
                        <a href="https://wa.me/8801700000000" target="_blank" rel="noopener">WhatsApp ↗</a>
                        <a href="https://facebook.com/abirhassan" target="_blank" rel="noopener">Facebook ↗</a>
                        <a href="https://x.com/abirhassan" target="_blank" rel="noopener">X ↗</a>
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
                    <div class="footer-copy">© 2026 Md Abir Hassan. All rights reserved. <br><span style="color: var(--accent); font-weight: 600;">Developed by Md Abir Hassan</span></div>
                </div>

                <div class="footer-col info-col">
                    <div class="footer-heading">CONTACT & LOCATION</div>
                    <div class="footer-info-item">📍 Dhaka, Bangladesh</div>
                    <div class="footer-info-item">📧 mdabirhassan2@gmail.com</div>
                    <div class="footer-info-item">🏢 Daffodil Software Ltd.</div>
                </div>

                <div class="footer-col links-col">
                    <div class="footer-heading">QUICK LINKS & SOCIALS</div>
                    <div class="footer-links-grid">
                        <a href="index.html">Home</a>
                        <a href="about.html">About</a>
                        <a href="experience.html">Experience</a>
                        <a href="projects.html">Projects</a>
                        <a href="blog.html">Blog</a>
                        <a href="contact.html">Contact</a>
                    </div>
                    <div class="footer-socials" style="flex-wrap: wrap; gap: 8px;">
                        <a href="https://www.linkedin.com/in/abirhassan2/" target="_blank" rel="noopener">LinkedIn ↗</a>
                        <a href="https://github.com/abir-software" target="_blank" rel="noopener">GitHub ↗</a>
                        <a href="https://wa.me/8801700000000" target="_blank" rel="noopener">WhatsApp ↗</a>
                        <a href="https://facebook.com/abirhassan" target="_blank" rel="noopener">Facebook ↗</a>
                        <a href="https://x.com/abirhassan" target="_blank" rel="noopener">X ↗</a>
                    </div>
                </div>
            `;
        }

        // 3. Initialize Back to Top Button & Custom 3D Rainbow Glass Cursor
        initBackToTop();
        initCustomGlassCursor();
    }

    function initCustomGlassCursor() {
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth <= 768) {
            return;
        }

        let cursorEl = document.getElementById('custom-glass-cursor');
        if (!cursorEl) {
            cursorEl = document.createElement('div');
            cursorEl.id = 'custom-glass-cursor';
            cursorEl.className = 'custom-glass-cursor';
            cursorEl.innerHTML = `
                <div class="cursor-glow-ring"></div>
                <div class="cursor-shadow-pod"></div>
                <div class="cursor-pointer-wrap">
                    <svg class="cursor-arrow-svg" viewBox="0 0 36 36" width="36" height="36">
                        <defs>
                            <linearGradient id="rainbow-iridescent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#00E5FF" />
                                <stop offset="20%" stop-color="#3B82F6" />
                                <stop offset="40%" stop-color="#8B5CF6" />
                                <stop offset="60%" stop-color="#EC4899" />
                                <stop offset="80%" stop-color="#F97316" />
                                <stop offset="100%" stop-color="#10B981" />
                            </linearGradient>
                            <linearGradient id="glass-specular-shine" x1="0%" y1="0%" x2="50%" y2="100%">
                                <stop offset="0%" stop-color="rgba(255, 255, 255, 0.95)" />
                                <stop offset="50%" stop-color="rgba(255, 255, 255, 0.3)" />
                                <stop offset="100%" stop-color="rgba(255, 255, 255, 0.05)" />
                            </linearGradient>
                        </defs>
                        <path class="svg-cursor-shadow" d="M 4 4 L 14 30 L 19 18 L 30 14 Z" />
                        <path class="svg-cursor-rainbow" d="M 4 4 L 14 30 L 19 18 L 30 14 Z" />
                        <path class="svg-cursor-glass-body" d="M 5 6 L 13 27 L 17 17 L 27 13 Z" />
                        <path class="svg-cursor-specular" d="M 5 6 L 12 21 L 15 16 L 22 13 Z" />
                    </svg>
                    <div class="cursor-sparkle-dot"></div>
                </div>
            `;
            document.body.appendChild(cursorEl);
        }

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let prevMouseX = mouseX;
        let prevMouseY = mouseY;
        let currentRotation = 0;
        let isHovered = false;
        let isClicked = false;
        let isVisible = false;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isVisible) {
                isVisible = true;
                cursorEl.classList.add('active');
            }
        });

        document.addEventListener('mouseleave', () => {
            isVisible = false;
            cursorEl.classList.remove('active');
        });

        document.addEventListener('mouseenter', () => {
            isVisible = true;
            cursorEl.classList.add('active');
        });

        document.addEventListener('mousedown', () => {
            isClicked = true;
            cursorEl.classList.add('clicking');
        });

        document.addEventListener('mouseup', () => {
            isClicked = false;
            cursorEl.classList.remove('clicking');
        });

        const interactiveSelector = 'a, button, input, textarea, select, label, .interactive, .card, .waterdrop-card, .timeline-card, .mini-social-icon, .btn, .top-nav-links a, .social-pills a';

        document.addEventListener('mouseover', e => {
            if (e.target && e.target.closest(interactiveSelector)) {
                isHovered = true;
                cursorEl.classList.add('hovering');
            }
        });

        document.addEventListener('mouseout', e => {
            if (e.target && e.target.closest(interactiveSelector)) {
                const related = e.relatedTarget;
                if (!related || !related.closest(interactiveSelector)) {
                    isHovered = false;
                    cursorEl.classList.remove('hovering');
                }
            }
        });

        const pointerWrapEl = cursorEl.querySelector('.cursor-pointer-wrap');

        function animLoop() {
            if (isVisible) {
                // Outer container locks INSTANTLY to exact mouse position (no tip lag)
                cursorEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

                if (prefersReducedMotion) {
                    currentRotation = 0;
                } else {
                    const vx = mouseX - prevMouseX;
                    const vy = mouseY - prevMouseY;
                    prevMouseX = mouseX;
                    prevMouseY = mouseY;

                    const velocity = Math.sqrt(vx * vx + vy * vy);
                    if (velocity > 1) {
                        const targetAngle = Math.atan2(vy, vx) * (180 / Math.PI) - 45;
                        const clampedAngle = Math.max(-20, Math.min(20, targetAngle));
                        currentRotation += (clampedAngle - currentRotation) * 0.15;
                    } else {
                        currentRotation += (0 - currentRotation) * 0.1;
                    }
                }

                let scaleStr = isHovered ? 'scale(1.18)' : 'scale(1)';
                if (isClicked) scaleStr = 'scale(0.88)';

                // Rotate & scale inner body anchored precisely at the top tip (4px, 4px)
                if (pointerWrapEl) {
                    pointerWrapEl.style.transform = `rotate(${currentRotation}deg) ${scaleStr}`;
                }
            }

            requestAnimationFrame(animLoop);
        }

        requestAnimationFrame(animLoop);
    }

    function initBackToTop() {
        let topBtn = document.getElementById('back-to-top-btn');
        if (!topBtn) {
            topBtn = document.createElement('button');
            topBtn.id = 'back-to-top-btn';
            topBtn.className = 'back-to-top-btn interactive';
            topBtn.setAttribute('aria-label', 'Scroll back to top');
            topBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#00E5FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
            `;
            document.body.appendChild(topBtn);

            topBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    topBtn.classList.add('visible');
                } else {
                    topBtn.classList.remove('visible');
                }
            });
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

        // Close when clicking any nav link inside overlay
        overlay.querySelectorAll('.overlay-nav-grid a').forEach(link => {
            link.addEventListener('click', closeOverlay);
        });

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
