import gsap from 'gsap';

export function initCursor() {
    // 1. Feature Detection: Disable on touch devices to avoid visibility/scroll bugs
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.style.cursor = 'auto';
        return;
    }

    let cursor = document.getElementById('cursor');
    let cursorDot = document.querySelector('.cursor-dot');
    let cursorRing = document.querySelector('.cursor-ring');

    const styles = ['duo', 'aura', 'minimal', 'trail'];
    let currentStyle = localStorage.getItem('cursor-style') || 'duo';

    function applyStyle(style) {
        if (!cursor) return;
        styles.forEach(s => cursor.classList.remove(`style-${s}`));
        cursor.classList.add(`style-${style}`);
        localStorage.setItem('cursor-style', style);

        // Special handling for trail visibility via body class if needed
        document.body.setAttribute('data-cursor-style', style);
    }

    if (!cursor) {
        cursor = document.createElement('div');
        cursor.id = 'cursor';
        cursor.className = 'custom-cursor';

        cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';

        cursorRing = document.createElement('div');
        cursorRing.className = 'cursor-ring';

        cursor.appendChild(cursorDot);
        cursor.appendChild(cursorRing);
        document.body.appendChild(cursor);
    }

    // Create trail elements
    const trailCount = 5;
    const trails = [];
    for (let i = 0; i < trailCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        document.body.appendChild(dot);
        trails.push({
            el: dot,
            xSetter: gsap.quickSetter(dot, "x", "px"),
            ySetter: gsap.quickSetter(dot, "y", "px")
        });
    }

    // quickSetters for main cursor (for maximum performance)
    const xSet = gsap.quickSetter(cursor, "x", "px");
    const ySet = gsap.quickSetter(cursor, "y", "px");

    let mouseX = -100;
    let mouseY = -100;

    // Track mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Show cursor on movement
        cursor.style.opacity = '1';
        trails.forEach(t => t.el.style.opacity = '0.4');

        // Note: Global class for hidden cursor is removed to keep system cursor visible
    });

    // Click effect
    document.addEventListener('mousedown', () => {
        gsap.to(cursorRing, { scale: 0.8, duration: 0.1, overwrite: true });
        gsap.to(cursorDot, { scale: 1.5, duration: 0.1, overwrite: true });
    });

    document.addEventListener('mouseup', () => {
        const isHovering = cursor.classList.contains('cursor--hover');
        const isText = cursor.classList.contains('cursor--text');

        gsap.to(cursorRing, {
            scale: isHovering ? 1.5 : (isText ? 0.3 : 1),
            duration: 0.2,
            overwrite: true
        });
        gsap.to(cursorDot, {
            scale: isHovering ? 0.5 : (isText ? 2 : 1),
            duration: 0.2,
            overwrite: true
        });
    });

    // Animation Loop (High-speed updates)
    gsap.ticker.add(() => {
        // Main cursor (instant)
        xSet(mouseX);
        ySet(mouseY);

        // Trail logic
        trails.forEach((trail, i) => {
            const isTrailMode = currentStyle === 'trail';
            const dtFactor = isTrailMode ? (0.12 - i * 0.015) : (0.15 - i * 0.02);
            const dt = 1.0 - Math.pow(1.0 - dtFactor, gsap.ticker.deltaRatio());
            const currentX = gsap.getProperty(trail.el, "x");
            const currentY = gsap.getProperty(trail.el, "y");

            trail.xSetter(currentX + (mouseX - currentX) * dt);
            trail.ySetter(currentY + (mouseY - currentY) * dt);
        });
    });

    // Hover effects delegation/refresh logic
    function setupHoverEffects() {
        const links = document.querySelectorAll('a, button, .social-btn, .btn, .nav__link');
        const textInputs = document.querySelectorAll('input, textarea, .form-group textarea');
        const cards = document.querySelectorAll('.project-card, .expertise-card, .glass-card');

        links.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor--hover');
                gsap.to(cursorRing, { scale: 1.8, borderColor: '#60a5fa', duration: 0.3, ease: "power2.out" });
                gsap.to(cursorDot, { scale: 0, opacity: 0, duration: 0.2 });
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor--hover');
                gsap.to(cursorRing, { scale: 1, borderColor: 'rgba(255, 255, 255, 0.5)', duration: 0.3 });
                gsap.to(cursorDot, { scale: 1, opacity: 1, duration: 0.2 });
            });
        });

        textInputs.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor--text');
                gsap.to(cursorRing, { scale: 0.3, opacity: 0.2, duration: 0.2 });
                gsap.to(cursorDot, { scale: 2, background: '#60a5fa', duration: 0.2 });
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor--text');
                gsap.to(cursorRing, { scale: 1, opacity: 1, duration: 0.2 });
                gsap.to(cursorDot, { scale: 1, background: '#ffffff', duration: 0.2 });
            });
        });

        cards.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursorRing, { scale: 1.2, borderColor: '#ffffff', duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursorRing, { scale: 1, borderColor: 'rgba(255, 255, 255, 0.5)', duration: 0.3 });
            });
        });
    }

    setupHoverEffects();

    // Re-run setup intermittently to catch dynamic content (like CMS items)
    setTimeout(setupHoverEffects, 2000);

    // Start with hidden
    cursor.style.opacity = '0';
    trails.forEach(t => t.el.style.opacity = '0');

    // Apply initial style
    applyStyle(currentStyle);

    // Expose functions for external UI interaction
    window.toggleCursorStyle = () => {
        const currentIndex = styles.indexOf(currentStyle);
        const nextIndex = (currentIndex + 1) % styles.length;
        currentStyle = styles[nextIndex];
        applyStyle(currentStyle);
        return currentStyle;
    };

    window.setCursorStyle = (style) => {
        if (styles.includes(style)) {
            currentStyle = style;
            applyStyle(currentStyle);
        }
    };

    window.getCurrentCursorStyle = () => currentStyle;
}

