export function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('.nav__link').forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });
}

export function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-category]');

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card) => {
                const category = card.getAttribute('data-category');
                const match = filter === 'all' || category === filter;
                card.setAttribute('data-visible', match ? 'true' : 'false');
                card.style.opacity = match ? '1' : '0';
                card.style.transform = match ? 'scale(1)' : 'scale(0.9)';
                setTimeout(() => {
                    card.style.display = match ? '' : 'none';
                }, match ? 0 : 300);
            });
        });
    });
}

export function initModeSwitch() {
    const modeBtns = document.querySelectorAll('.mode-btn');
    const expertiseCards = document.querySelectorAll('.expertise-card[data-mode]');

    modeBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            modeBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const mode = btn.getAttribute('data-mode');

            expertiseCards.forEach((card) => {
                const cardMode = card.getAttribute('data-mode');
                if (mode === 'all') {
                    card.style.opacity = '1';
                    card.style.transform = '';
                } else if (cardMode === mode) {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1.03)';
                    card.style.borderColor = 'rgba(96, 165, 250, 0.4)';
                } else {
                    card.style.opacity = '0.4';
                    card.style.transform = 'scale(0.97)';
                    card.style.borderColor = '';
                }
            });
        });
    });
}

export function initCursorToggle() {
    const toggle = document.getElementById('cursor-toggle');
    if (!toggle) return;

    const currIcon = toggle.querySelector('.curr-icon');
    const styles = ['duo', 'aura', 'minimal', 'trail'];
    const icons = {
        'duo': '✦',
        'aura': '◎',
        'minimal': '·',
        'trail': '≈'
    };

    const syncUI = () => {
        if (typeof window.getCurrentCursorStyle === 'function') {
            const activeStyle = window.getCurrentCursorStyle();
            currIcon.textContent = icons[activeStyle] || '✦';
        }
    };

    syncUI();

    toggle.addEventListener('click', () => {
        // Find style management functions (might be on window from cursor.js)
        const getStyle = window.getCurrentCursorStyle;
        const setStyle = window.setCursorStyle;

        if (typeof getStyle === 'function' && typeof setStyle === 'function') {
            const current = getStyle();
            const currentIndex = styles.indexOf(current);
            const nextIndex = (currentIndex + 1) % styles.length;
            const nextStyle = styles[nextIndex];

            // Apply new style
            setStyle(nextStyle);
            syncUI();

            // Add pulse feedback
            toggle.classList.remove('pulse');
            void toggle.offsetWidth; // Trigger reflow
            toggle.classList.add('pulse');
        } else {
            console.error('Cursor style management not initialized');
        }
    });
}

export function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const span = btn.querySelector('span');
        const originalText = span.textContent;

        // Collect data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        span.textContent = 'Sending...';
        btn.disabled = true;

        try {
            const res = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Failed to send');

            span.textContent = 'Sent! ✓';
            btn.style.background = 'var(--color-success)';
            form.reset();
        } catch (err) {
            span.textContent = 'Error! ❌';
            btn.style.background = 'var(--color-danger)';
        } finally {
            setTimeout(() => {
                span.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }
    });
}
export function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"], a[href^="index.html#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const targetId = href.includes('#') ? href.split('#')[1] : null;

            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    e.preventDefault();

                    // Update URL without reload
                    history.pushState(null, null, `#${targetId}`);

                    // Smooth scroll
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // Adjust for fixed nav height
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}
