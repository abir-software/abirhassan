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
                    
                    <!-- Mini Contact Icons for Email, LinkedIn, Facebook, WhatsApp -->
                    <div class="footer-mini-contact-bar">
                        <a href="mailto:mdabirhassan2@gmail.com" class="mini-contact-icon interactive" aria-label="Email">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="#00E5FF"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                        </a>
                        <a href="https://www.linkedin.com/in/abirhassan2/" target="_blank" rel="noopener" class="mini-contact-icon interactive" aria-label="LinkedIn">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="#00E5FF"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                        </a>
                        <a href="https://facebook.com/abirhassan" target="_blank" rel="noopener" class="mini-contact-icon interactive" aria-label="Facebook">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="#00E5FF"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.5C10 7.01 11.49 5.65 13.75 5.65c1.08 0 2.22.19 2.22.19v2.44h-1.25c-1.23 0-1.62.77-1.62 1.56V12h2.77l-.44 3h-2.33v6.8c4.56-.93 8-4.96 8-9.8z"/></svg>
                        </a>
                        <a href="https://wa.me/8801700000000" target="_blank" rel="noopener" class="mini-contact-icon interactive" aria-label="WhatsApp">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="#00E5FF"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.55 0 8.24 3.69 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.19 8.19 0 0 1-5.82 2.42c-1.48 0-2.94-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.216 8.216 0 0 1-1.26-4.38c0-4.55 3.7-8.24 8.25-8.24M8.53 7.33c-.2 0-.44.07-.67.33-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.28 3.79.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.6 1.69-1.19.21-.58.21-1.08.15-1.19-.06-.11-.23-.17-.48-.3-.25-.12-1.48-.73-1.71-.81-.23-.09-.4-.12-.57.12-.17.24-.67.81-.82.98-.15.17-.3.19-.55.07-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.24-.4.08-.17.04-.31-.02-.44-.06-.12-.57-1.37-.78-1.87-.2-.5-.41-.43-.57-.44z"/></svg>
                        </a>
                    </div>

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
        if (window.innerWidth <= 768) {
            return;
        }

        let cursorEl = document.getElementById('custom-glass-cursor');
        if (!cursorEl) {
            cursorEl = document.createElement('div');
            cursorEl.id = 'custom-glass-cursor';
            cursorEl.className = 'custom-glass-cursor active';
            cursorEl.innerHTML = `
                <div class="cursor-glow-ring"></div>
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
                        <path class="svg-cursor-rainbow" d="M 4 4 L 4 27 L 11 20 L 15 29 L 19 27 L 15 18 L 23 18 Z" />
                        <path class="svg-cursor-glass-body" d="M 5 6 L 5 25 L 11 19 L 15 27 L 17 26 L 14 18 L 21 18 Z" />
                        <path class="svg-cursor-specular" d="M 5 6 L 5 24 L 10 19 Z" />
                    </svg>
                    <div class="cursor-sparkle-dot"></div>
                </div>
            `;
            document.body.appendChild(cursorEl);
            document.body.classList.add('has-custom-cursor');
        }

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let prevMouseX = mouseX;
        let prevMouseY = mouseY;
        let isHovered = false;
        let isClicked = false;
        let isVisible = true;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let moveTimeout;
        window.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isVisible) {
                isVisible = true;
                cursorEl.classList.add('active');
            }

            cursorEl.classList.add('moving');
            clearTimeout(moveTimeout);
            moveTimeout = setTimeout(() => {
                cursorEl.classList.remove('moving');
            }, 150);
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
        const BASE_UPRIGHT_ANGLE = 0; // Standard 90-degree classic OS mouse orientation
        let currentRotation = BASE_UPRIGHT_ANGLE;

        function animLoop() {
            if (isVisible) {
                // Outer container locks INSTANTLY to exact mouse position (no tip lag)
                cursorEl.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

                if (prefersReducedMotion) {
                    currentRotation = BASE_UPRIGHT_ANGLE;
                } else {
                    const vx = mouseX - prevMouseX;
                    const vy = mouseY - prevMouseY;
                    prevMouseX = mouseX;
                    prevMouseY = mouseY;

                    const velocity = Math.sqrt(vx * vx + vy * vy);
                    if (velocity > 1) {
                        const targetAngle = Math.atan2(vy, vx) * (180 / Math.PI) - 45;
                        const clampedAngle = Math.max(-15, Math.min(15, targetAngle));
                        const destAngle = BASE_UPRIGHT_ANGLE + clampedAngle;
                        currentRotation += (destAngle - currentRotation) * 0.15;
                    } else {
                        currentRotation += (BASE_UPRIGHT_ANGLE - currentRotation) * 0.1;
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
