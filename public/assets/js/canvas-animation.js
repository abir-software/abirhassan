/* ==========================================================================
   PORTFOLIO CMS — 300-Frame Scroll Canvas Animation Script
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

  function render(frame) {
    const img = images[frame];
    if (!img || !img.complete) return;

    const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);
    const cx = (canvas.width - img.width * ratio) / 2;
    const cy = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
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
