// ========================================
// ANIMATIONS — GSAP scroll-triggered animations
// ========================================
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations() {
    // === Scroll Reveal: Fade Up ===
    gsap.utils.toArray('.reveal-up').forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    once: true,
                },
            }
        );
    });

    // === Scroll Reveal: Slide Left ===
    gsap.utils.toArray('.reveal-left').forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0, x: -50 },
            {
                opacity: 1, x: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    once: true,
                },
            }
        );
    });

    // === Scroll Reveal: Slide Right ===
    gsap.utils.toArray('.reveal-right').forEach((el) => {
        gsap.fromTo(el,
            { opacity: 0, x: 50 },
            {
                opacity: 1, x: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    once: true,
                },
            }
        );
    });

    // === Staggered Cards ===
    gsap.utils.toArray('.expertise-grid, .qa-expertise-grid, .achievements-grid, .tools-grid, .certs-grid, .blog-grid').forEach((grid) => {
        const children = grid.children;
        if (children.length === 0) return;
        gsap.fromTo(children,
            { opacity: 0, y: 30, scale: 0.95 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 85%',
                    once: true,
                },
            }
        );
    });

    // === Competency Bars ===
    gsap.utils.toArray('.competency-bar__fill').forEach((bar) => {
        const target = bar.getAttribute('data-value');
        gsap.fromTo(bar,
            { width: '0%' },
            {
                width: `${target}%`,
                duration: 1.4,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: bar,
                    start: 'top 90%',
                    once: true,
                },
            }
        );
    });

    // === Section Background Text Parallax ===
    gsap.utils.toArray('.section__bg-text').forEach((text) => {
        gsap.fromTo(text,
            { x: '-5%' },
            {
                x: '5%',
                ease: 'none',
                scrollTrigger: {
                    trigger: text.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1,
                },
            }
        );
    });

    // === Timeline Items ===
    gsap.utils.toArray('.timeline__item').forEach((item, i) => {
        gsap.fromTo(item,
            { opacity: 0, x: -30 },
            {
                opacity: 1, x: 0,
                duration: 0.6,
                delay: i * 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 88%',
                    once: true,
                },
            }
        );
    });

    // === Nav scroll behavior ===
    ScrollTrigger.create({
        start: 80,
        onUpdate: (self) => {
            const nav = document.getElementById('nav');
            if (self.direction === 1 && self.scroll() > 80) {
                nav.classList.add('scrolled');
            } else if (self.scroll() <= 80) {
                nav.classList.remove('scrolled');
            }
        },
    });
}

// === Floating Animation for Hero Image ===
export function initHeroImageAnimation() {
    const img = document.querySelector('.hero__image-container');
    if (!img) return;

    gsap.to(img, {
        y: -15,
        duration: 3,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
    });
}

// === Animated Counters ===
export function initCounters() {
    const counters = document.querySelectorAll('[data-target]');

    counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10);

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 90%',
            once: true,
            onEnter: () => {
                gsap.fromTo(counter,
                    { innerText: 0 },
                    {
                        innerText: target,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { innerText: 1 },
                        onUpdate: function () {
                            counter.textContent = Math.round(this.targets()[0].innerText);
                        },
                    }
                );
            },
        });
    });
}

// === Typing Effect ===
export function initTypingEffect(titles) {
    const element = document.getElementById('typed-title');
    if (!element) return;

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const current = titles[titleIndex];

        if (isDeleting) {
            element.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            element.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === current.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typeSpeed = 400; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// === Scroll Spy ===
export function initScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav__link');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach((link) => {
                        link.classList.toggle('active', link.getAttribute('data-section') === id);
                    });
                }
            });
        },
        { threshold: 0.3, rootMargin: '-70px 0px -30% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
}
