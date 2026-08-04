/* ==========================================================================
   PORTFOLIO CMS — 300-Frame Scroll Canvas + Mouse Water Waves Animation Script
   ========================================================================== */

(function () {
  const canvas = document.getElementById('animationCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();

  const frameCount = 300;
  const images = [];
  const currentFrame = index => `/assets/frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`;

  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
  }

  let targetFrame = 0;
  let currentFrameIndex = 0;

  // Water Wave Ripples & Droplets Array
  const waterRipples = [];
  const waterDroplets = [];
  let mouse = { x: -1000, y: -1000, px: -1000, py: -1000 };
  let lastRippleTime = 0;

  function addWaterRipple(x, y, speedMult = 1) {
    waterRipples.push({
      x,
      y,
      radius: 4,
      maxRadius: 45 * speedMult,
      alpha: 0.7,
      lineWidth: 2.2,
      colorHue: Math.random() > 0.5 ? 185 : 210
    });
  }

  function addWaterDroplets(x, y, vx, vy) {
    const count = 2;
    for (let i = 0; i < count; i++) {
      waterDroplets.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2 + vx * 0.2,
        vy: (Math.random() - 0.5) * 2 + vy * 0.2,
        size: Math.random() * 3.5 + 1.5,
        alpha: 0.8,
        life: 1.0
      });
    }
  }

  window.addEventListener('mousemove', e => {
    const mx = e.clientX;
    const my = e.clientY;
    const dx = mx - mouse.px;
    const dy = my - mouse.py;
    const dist = Math.sqrt(dx * dx + dy * dy);

    mouse.x = mx;
    mouse.y = my;

    const now = Date.now();
    if (dist > 3 && now - lastRippleTime > 30) {
      lastRippleTime = now;
      addWaterRipple(mx, my, Math.min(2.5, 0.8 + dist * 0.05));
      addWaterDroplets(mx, my, dx, dy);
    }

    mouse.px = mx;
    mouse.py = my;
  });

  window.addEventListener('click', e => {
    addWaterRipple(e.clientX, e.clientY, 3.5);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      waterDroplets.push({
        x: e.clientX,
        y: e.clientY,
        vx: Math.cos(angle) * 3,
        vy: Math.sin(angle) * 3,
        size: 4,
        alpha: 1.0,
        life: 1.0
      });
    }
  });

  function drawWaterOverlay() {
    // 1. Draw Water Wave Ripples
    for (let i = waterRipples.length - 1; i >= 0; i--) {
      const r = waterRipples[i];
      r.radius += 1.6;
      r.alpha *= 0.945;

      if (r.alpha <= 0.01 || r.radius >= r.maxRadius) {
        waterRipples.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${r.colorHue}, 100%, 65%, ${r.alpha})`;
      ctx.lineWidth = r.lineWidth * (1 - r.radius / r.maxRadius);
      ctx.stroke();

      // Inner faint refraction ring
      if (r.radius > 10) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. Draw Liquid Water Droplets
    for (let i = waterDroplets.length - 1; i >= 0; i--) {
      const d = waterDroplets[i];
      d.x += d.vx;
      d.y += d.vy;
      d.vx *= 0.94;
      d.vy *= 0.94;
      d.life -= 0.025;
      d.alpha = d.life * 0.85;

      if (d.life <= 0) {
        waterDroplets.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size * d.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${d.alpha})`;
      ctx.shadowColor = '#00E5FF';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    }
  }

  function render(frame) {
    const img = images[frame];
    if (img && img.complete) {
      const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
      const cx = (canvas.width - img.width * ratio) / 2;
      const cy = (canvas.height - img.height * ratio) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.width * ratio);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Render interactive mouse water wave ripples & droplets
    drawWaterOverlay();
  }

  if (images[0]) {
    images[0].onload = () => render(0);
  }

  window.addEventListener('scroll', () => {
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) maxScroll = 1;
    targetFrame = Math.min(
      frameCount - 1,
      Math.floor(Math.max(0, Math.min(1, document.documentElement.scrollTop / maxScroll)) * frameCount)
    );
  });

  function update() {
    currentFrameIndex += (targetFrame - currentFrameIndex) * 0.08;
    render(Math.round(currentFrameIndex));
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);

  window.addEventListener('resize', () => {
    resizeCanvas();
    render(Math.round(currentFrameIndex));
  });
})();
