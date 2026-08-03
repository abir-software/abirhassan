// ========================================
// PENGUIN — Interactive mascot with physics
// ========================================
import gsap from 'gsap';

const SOCIAL_LINKS = [
    { id: 'fb', icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`, name: 'Facebook', color: '#1877F2', url: '#' },
    { id: 'tw', icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`, name: 'X / Twitter', color: '#000000', url: '#' },
    { id: 'ig', icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`, name: 'Instagram', color: '#E4405F', url: '#' },
    { id: 'li', icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`, name: 'LinkedIn', color: '#0A66C2', url: '#' },
    { id: 'gh', icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`, name: 'GitHub', color: '#ffffff', url: '#' },
];

function createPenguinSVG() {
    return `
    <svg class="penguin-svg" viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="60" cy="135" rx="30" ry="5" fill="rgba(0,0,0,0.2)"/>
      <ellipse class="penguin-foot penguin-foot--left" cx="42" cy="130" rx="14" ry="6" fill="#F59E0B" stroke="#D97706" stroke-width="1"/>
      <ellipse class="penguin-foot penguin-foot--right" cx="78" cy="130" rx="14" ry="6" fill="#F59E0B" stroke="#D97706" stroke-width="1"/>
      <ellipse cx="60" cy="85" rx="38" ry="50" fill="#1a1a2e"/>
      <ellipse cx="60" cy="90" rx="28" ry="40" fill="#f0f0f5"/>
      <ellipse cx="55" cy="82" rx="18" ry="28" fill="rgba(255,255,255,0.15)"/>
      <g class="penguin-wing penguin-wing--left">
        <path d="M22 70 Q15 85 18 105 Q20 110 25 108 Q30 95 28 75 Z" fill="#1a1a2e" stroke="#111128" stroke-width="0.5"/>
      </g>
      <g class="penguin-wing penguin-wing--right">
        <path d="M98 70 Q105 85 102 105 Q100 110 95 108 Q90 95 92 75 Z" fill="#1a1a2e" stroke="#111128" stroke-width="0.5"/>
      </g>
      <g class="penguin-head">
        <ellipse cx="60" cy="38" rx="30" ry="28" fill="#1a1a2e"/>
        <ellipse cx="60" cy="42" rx="22" ry="18" fill="#f0f0f5"/>
        <g class="penguin-eye penguin-eye--left">
          <ellipse cx="48" cy="36" rx="7" ry="8" fill="white" stroke="#1a1a2e" stroke-width="0.5"/>
          <circle class="penguin-pupil penguin-pupil--left" cx="48" cy="36" r="3.5" fill="#1a1a2e"/>
          <circle cx="46" cy="34" r="1.2" fill="white" opacity="0.9"/>
        </g>
        <g class="penguin-eye penguin-eye--right">
          <ellipse cx="72" cy="36" rx="7" ry="8" fill="white" stroke="#1a1a2e" stroke-width="0.5"/>
          <circle class="penguin-pupil penguin-pupil--right" cx="72" cy="36" r="3.5" fill="#1a1a2e"/>
          <circle cx="70" cy="34" r="1.2" fill="white" opacity="0.9"/>
        </g>
        <path d="M53 46 L60 54 L67 46 Z" fill="#F59E0B" stroke="#D97706" stroke-width="0.5"/>
        <ellipse cx="40" cy="46" rx="5" ry="3" fill="#ff9999" opacity="0.35"/>
        <ellipse cx="80" cy="46" rx="5" ry="3" fill="#ff9999" opacity="0.35"/>
      </g>
      <g class="penguin-bowtie">
        <path d="M50 62 L57 66 L50 70 Z" fill="#60a5fa"/>
        <path d="M70 62 L63 66 L70 70 Z" fill="#60a5fa"/>
        <circle cx="60" cy="66" r="3" fill="#3b82f6"/>
      </g>
    </svg>
  `;
}

export function initPenguin() {
    const socialBar = document.createElement('div');
    socialBar.className = 'social-bar';
    socialBar.id = 'social-bar';
    socialBar.innerHTML = SOCIAL_LINKS.map((s) => `
    <div class="social-btn" data-social="${s.id}" data-name="${s.name}" data-color="${s.color}" data-url="${s.url}">
      <div class="social-btn__icon">${s.icon}</div>
      <span class="social-btn__name">${s.name}</span>
    </div>
  `).join('');
    document.body.appendChild(socialBar);

    const penguinEl = document.createElement('div');
    penguinEl.className = 'penguin';
    penguinEl.id = 'penguin';
    penguinEl.innerHTML = createPenguinSVG();
    document.body.appendChild(penguinEl);

    const state = {
        currentButtonIndex: 0,
        isJumping: false,
        penguinX: 0,
        penguinY: 0,
        mouseX: window.innerWidth / 2,
        mouseY: window.innerHeight / 2,
        idleTimer: null,
        jumpInterval: null,
        expandedBtn: null,
    };

    const pupils = {
        left: penguinEl.querySelector('.penguin-pupil--left'),
        right: penguinEl.querySelector('.penguin-pupil--right'),
    };
    const head = penguinEl.querySelector('.penguin-head');
    const wingLeft = penguinEl.querySelector('.penguin-wing--left');
    const wingRight = penguinEl.querySelector('.penguin-wing--right');

    function getButtonPositions() {
        const buttons = document.querySelectorAll('.social-btn');
        return Array.from(buttons).map((btn) => {
            const rect = btn.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top,
                el: btn,
            };
        });
    }

    function positionPenguin(x, y, instant = false) {
        state.penguinX = x;
        state.penguinY = y;
        const penguinWidth = 60;
        const penguinHeight = 70;

        // Correct offset to sit ON the button
        const targetY = y - penguinHeight + 12; // Adjusted offset

        if (instant) {
            penguinEl.style.transition = 'none';
            gsap.set(penguinEl, { x: x - penguinWidth / 2, y: targetY });
        } else {
            penguinEl.style.transition = '';
            penguinEl.style.left = `${x - penguinWidth / 2}px`;
            penguinEl.style.top = `${targetY}px`;
        }
    }

    // Use GSAP for jumping
    function jumpTo(targetIndex) {
        if (state.isJumping) return;
        const positions = getButtonPositions();
        if (!positions[targetIndex]) return;

        state.isJumping = true;
        const target = positions[targetIndex];
        const startX = state.penguinX;
        const startY = state.penguinY;
        const endX = target.x;
        const endY = target.y - 70 + 12; // Match offset

        const dx = endX - startX;
        const midX = startX + dx / 2;
        const jumpPeak = Math.min(startY, endY) - 50; // Jump height

        // Animate wings
        penguinEl.classList.add('penguin--jumping');
        gsap.to([wingLeft, wingRight], { rotation: (i) => i === 0 ? 30 : -30, duration: 0.2 });

        // Squash
        gsap.to(penguinEl, { scaleX: 1.1, scaleY: 0.85, duration: 0.1, yoyo: true, repeat: 1 });

        // Jump Arc
        const tl = gsap.timeline({
            onComplete: () => {
                state.isJumping = false;
                state.currentButtonIndex = targetIndex;
                penguinEl.classList.remove('penguin--jumping');
                gsap.to(penguinEl, { scaleX: 1, scaleY: 1, duration: 0.2 });
                gsap.to([wingLeft, wingRight], { rotation: 0, duration: 0.3 });
            }
        });

        tl.to(penguinEl, {
            x: midX - 30, // center offset
            y: jumpPeak,
            duration: 0.3,
            ease: 'power1.out',
            onUpdate: () => {
                // Rotate slightly towards jump
                const progress = tl.progress();
                const rot = Math.sin(progress * Math.PI) * 10 * Math.sign(dx);
                gsap.set(penguinEl, { rotation: rot });
            }
        });

        tl.to(penguinEl, {
            x: endX - 30,
            y: endY,
            duration: 0.3,
            ease: 'power1.in',
        });

        // Landing squash
        tl.to(penguinEl, { scaleX: 1.15, scaleY: 0.85, duration: 0.1 });
        tl.to(penguinEl, { scaleX: 1, scaleY: 1, duration: 0.2 });
    }

    function startAutoJump() {
        clearInterval(state.jumpInterval);
        state.jumpInterval = setInterval(() => {
            const positions = getButtonPositions();
            if (positions.length === 0) return;
            let next = (state.currentButtonIndex + 1) % positions.length;
            jumpTo(next);
        }, 4000);
    }

    function updateEyes() {
        if (!pupils.left || !pupils.right) return;
        const penguinRect = penguinEl.getBoundingClientRect();
        const penguinCenterX = penguinRect.left + penguinRect.width / 2;
        const penguinCenterY = penguinRect.top + penguinRect.height * 0.28;

        const dx = state.mouseX - penguinCenterX;
        const dy = state.mouseY - penguinCenterY;
        const angle = Math.atan2(dy, dx);
        const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 300);
        const offset = (distance / 300) * 3;

        gsap.to([pupils.left, pupils.right], {
            x: Math.cos(angle) * offset,
            y: Math.sin(angle) * offset,
            duration: 0.1
        });

        const headTilt = (dx / window.innerWidth) * 10;
        gsap.to(head, { rotation: headTilt, duration: 0.3 });

        requestAnimationFrame(updateEyes);
    }

    window.addEventListener('mousemove', (e) => {
        state.mouseX = e.clientX;
        state.mouseY = e.clientY;
        clearTimeout(state.idleTimer);
        clearInterval(state.jumpInterval);
        state.idleTimer = setTimeout(() => {
            startAutoJump();
        }, 3000);
    }, { passive: true });

    document.querySelectorAll('.social-btn').forEach((btn, i) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (state.currentButtonIndex !== i) jumpTo(i);

            // Expand logic
            const isExpanded = btn.classList.contains('social-btn--expanded');
            document.querySelectorAll('.social-btn').forEach(b => b.classList.remove('social-btn--expanded'));

            if (!isExpanded) {
                btn.classList.add('social-btn--expanded');
                // Happy bounce
                gsap.to(penguinEl, { y: '-=15', yoyo: true, repeat: 1, duration: 0.2 });
            }
        });

        btn.addEventListener('mouseenter', () => {
            if (state.currentButtonIndex !== i && !state.isJumping) {
                jumpTo(i);
            }
        });
    });

    // Init
    const positions = getButtonPositions();
    if (positions.length > 0) {
        positionPenguin(positions[0].x, positions[0].y, true);
    }
    updateEyes();
    startAutoJump();

    // Resize
    window.addEventListener('resize', () => {
        const pos = getButtonPositions();
        if (pos[state.currentButtonIndex]) {
            const p = pos[state.currentButtonIndex];
            gsap.set(penguinEl, { x: p.x - 30, y: p.y - 70 + 12 });
        }
    });
}
