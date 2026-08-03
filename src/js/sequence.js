import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function initScrollSequence() {
    const canvas = document.getElementById('scroll-sequence');
    if (!canvas) return;

    const context = canvas.getContext('2d');

    // Set internal resolution
    canvas.width = 1920;
    canvas.height = 1080;

    const frameCount = 300;
    const currentFrame = (index) =>
        `/sequence/ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

    const images = [];
    const airpods = {
        frame: 0
    };

    // Preload first frame to get size, then load the rest
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    // Render first frame
    images[0].onload = render;

    function render() {
        if (!images[airpods.frame]) return;
        // Draw the image scaled to fit the canvas, maintaining aspect ratio
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[airpods.frame], 0, 0, canvas.width, canvas.height);
    }

    // Setup GSAP
    gsap.to(airpods, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5 // Smoothing
        },
        onUpdate: render
    });
}

export function initSmoothScroll() {
    // Initialize Lenis
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
}

export function initEntryAnimations() {
    // Reveal Up
    const revealElements = document.querySelectorAll('.glass-card, .section__header, .hero__content > *');
    
    revealElements.forEach((el, index) => {
        gsap.fromTo(el, 
            { 
                y: 50, 
                opacity: 0,
                scale: 0.95
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%", // Trigger when the top of the element hits 90% of the viewport height
                    toggleActions: "play none none reverse", // Play on scroll down, reverse on scroll back up
                }
            }
        );
    });
}

initSmoothScroll();
initScrollSequence();
initEntryAnimations();
