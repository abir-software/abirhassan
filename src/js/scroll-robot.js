import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export function initScrollRobot() {
    const container = document.createElement('div');
    container.className = 'scroll-robot-container';
    document.body.appendChild(container);

    // Initial Icon (Arrow Up)
    const icon = document.createElement('div');
    icon.className = 'scroll-robot-icon';
    icon.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  `;
    container.appendChild(icon);

    // Robot (Hidden initially)
    const robot = document.createElement('div');
    robot.className = 'scroll-robot';
    robot.innerHTML = `
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="16" fill="#60a5fa" stroke="#2563eb" stroke-width="2"/>
      <rect x="24" y="28" width="16" height="8" rx="4" fill="#1e3a8a"/>
      <circle cx="28" cy="32" r="2" fill="#93c5fd"/>
      <circle cx="36" cy="32" r="2" fill="#93c5fd"/>
      <path d="M22 46L18 54" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"/>
      <path d="M42 46L46 54" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"/>
      <path d="M16 32L8 28" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"/>
      <path d="M48 32L56 28" stroke="#60a5fa" stroke-width="3" stroke-linecap="round"/>
      <path d="M32 16V8" stroke="#60a5fa" stroke-width="2"/>
      <circle cx="32" cy="6" r="3" fill="#ef4444" class="robot-antenna"/>
      <path d="M20 44Q32 50 44 44" stroke="none" fill="#3b82f6" opacity="0.5"/>
    </svg>
  `;
    container.appendChild(robot);

    let isFlying = false;

    // Show/Hide logic based on scroll
    window.addEventListener('scroll', () => {
        if (isFlying) return;
        if (window.scrollY > 300) {
            container.classList.add('visible');
        } else {
            container.classList.remove('visible');
        }
    });

    // Click Handler
    container.addEventListener('click', () => {
        if (isFlying) return;
        isFlying = true;
        container.classList.add('flying');

        // 1. Morph Icon to Robot
        gsap.to(icon, { scale: 0, rotation: 360, duration: 0.4, opacity: 0 });
        gsap.fromTo(robot,
            { scale: 0, opacity: 0, y: 20 },
            { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
        );

        // 2. Fly Up
        const startY = window.scrollY;
        const duration = Math.min(2, Math.max(1, startY / 1000));

        // Smooth Scroll
        gsap.to(window, { scrollTo: 0, duration: duration, ease: 'power2.inOut' });

        // Fly Animation
        gsap.to(container, {
            bottom: '100%',
            duration: duration,
            ease: 'power2.inOut',
            onUpdate: () => {
                spawnParticle(container);
            },
            onComplete: () => {
                // Reset
                isFlying = false;
                container.style.bottom = '30px';
                container.classList.remove('visible'); // Hide until scroll down logic triggers
                container.classList.remove('flying');

                gsap.set(icon, { scale: 1, rotation: 0, opacity: 1 });
                gsap.set(robot, { scale: 0, opacity: 0 });
            }
        });

        // Wobble
        gsap.to(robot, {
            rotation: 10,
            yoyo: true,
            repeat: -1,
            duration: 0.1,
            ease: 'sine.inOut'
        });
    });

    function spawnParticle(source) {
        const particle = document.createElement('div');
        particle.className = 'robot-particle';
        document.body.appendChild(particle);

        const rect = source.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height;

        const size = Math.random() * 6 + 2;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;

        gsap.set(particle, {
            x: x + (Math.random() - 0.5) * 10,
            y: y,
            width: size,
            height: size,
            background: Math.random() > 0.5 ? '#60a5fa' : '#f59e0b',
        });

        gsap.to(particle, {
            y: y + 50 + Math.random() * 50,
            x: x + (Math.random() - 0.5) * 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power1.out',
            onComplete: () => particle.remove()
        });
    }
}
