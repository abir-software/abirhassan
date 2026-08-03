import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
            trigger: "body", // We can use body or a specific tall container
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5 // Smoothing
        },
        onUpdate: render // Use animation onUpdate instead of scrollTrigger onUpdate
    });
}

initScrollSequence();

