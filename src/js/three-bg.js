// ========================================
// THREE-BG — Three.js particle field background
// ========================================
import * as THREE from 'three';

export function initThreeBackground(canvas) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    // Particle system
    const particleCount = 600;
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    const colorPalette = [
        new THREE.Color(0x60a5fa), // Blue
        new THREE.Color(0x3b82f6), // Dim blue
        new THREE.Color(0xf59e0b), // Gold
        new THREE.Color(0x34d399), // Green
    ];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
        sizes[i] = Math.random() * 2 + 0.5;

        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom shader material
    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
        },
        vertexShader: `
      attribute float size;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uTime;
      uniform vec2 uMouse;
      
      void main() {
        vColor = color;
        
        vec3 pos = position;
        // Gentle floating motion
        pos.y += sin(uTime * 0.3 + position.x * 0.1) * 0.8;
        pos.x += cos(uTime * 0.2 + position.y * 0.1) * 0.5;
        
        // Mouse influence (subtle)
        float dist = length(pos.xy - uMouse * 20.0);
        float influence = smoothstep(15.0, 0.0, dist) * 2.0;
        pos.x += (uMouse.x * 20.0 - pos.x) * influence * 0.05;
        pos.y += (uMouse.y * 20.0 - pos.y) * influence * 0.05;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (200.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
        
        vAlpha = smoothstep(0.0, 1.0, size / 2.5) * 0.6;
      }
    `,
        fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
        transparent: true,
        depthWrite: false,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Floating geometric shapes
    const shapeMaterial = new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        wireframe: true,
        transparent: true,
        opacity: 0.06,
    });

    const shapes = [];
    const geoTypes = [
        new THREE.OctahedronGeometry(2, 0),
        new THREE.IcosahedronGeometry(1.5, 0),
        new THREE.TetrahedronGeometry(1.8, 0),
    ];

    for (let i = 0; i < 5; i++) {
        const geo = geoTypes[i % geoTypes.length];
        const mesh = new THREE.Mesh(geo, shapeMaterial.clone());
        mesh.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 20 - 10
        );
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        mesh.userData = {
            rotSpeed: {
                x: (Math.random() - 0.5) * 0.005,
                y: (Math.random() - 0.5) * 0.005,
                z: (Math.random() - 0.5) * 0.003,
            },
            floatOffset: Math.random() * Math.PI * 2,
            baseY: mesh.position.y,
        };
        scene.add(mesh);
        shapes.push(mesh);
    }

    // Mouse tracking
    let mouseX = 0, mouseY = 0;
    const onMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Resize
    const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize, { passive: true });

    // Animation loop
    let animationId;
    let isRunning = true;
    const clock = new THREE.Clock();

    function animate() {
        if (!isRunning) return;
        animationId = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();
        material.uniforms.uTime.value = elapsed;
        material.uniforms.uMouse.value.set(mouseX, mouseY);

        // Rotate shapes
        shapes.forEach((shape) => {
            shape.rotation.x += shape.userData.rotSpeed.x;
            shape.rotation.y += shape.userData.rotSpeed.y;
            shape.rotation.z += shape.userData.rotSpeed.z;
            shape.position.y = shape.userData.baseY + Math.sin(elapsed * 0.5 + shape.userData.floatOffset) * 2;
        });

        // Subtle camera drift
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.01;
        camera.position.y += (mouseY * 2 - camera.position.y) * 0.01;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    animate();

    // Cleanup
    return {
        stop: () => {
            isRunning = false;
            cancelAnimationFrame(animationId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
        },
    };
}
