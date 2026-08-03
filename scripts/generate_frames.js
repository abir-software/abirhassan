import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'sequence');

// Ensure directory exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const WIDTH = 1920;
const HEIGHT = 1080;
const FRAMES = 300;

console.log(`Generating ${FRAMES} frames in ${OUT_DIR}...`);

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

for (let i = 1; i <= FRAMES; i++) {
  // Clear background
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const progress = i / FRAMES; // 0 to 1

  // Draw some abstract rotating geometry
  ctx.save();
  ctx.translate(WIDTH / 2, HEIGHT / 2);
  
  // Outer glowing ring
  ctx.rotate(progress * Math.PI * 4); // 2 full rotations
  ctx.beginPath();
  ctx.arc(0, 0, 400 + Math.sin(progress * Math.PI * 8) * 50, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(${100 + progress*100}, 50, ${255 - progress*100}, 0.5)`;
  ctx.lineWidth = 10;
  ctx.stroke();

  // Inner shape
  ctx.rotate(-progress * Math.PI * 6);
  ctx.beginPath();
  ctx.rect(-200, -200, 400, 400);
  ctx.fillStyle = `rgba(${50 + progress*50}, 150, ${200 + progress*50}, 0.8)`;
  ctx.fill();
  
  ctx.restore();

  // Add some text or noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.font = '30px Arial';
  ctx.fillText(`FRAME ${i.toString().padStart(4, '0')}`, 50, 50);

  // Save frame
  const fileName = `frame_${i.toString().padStart(4, '0')}.jpg`;
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 });
  fs.writeFileSync(join(OUT_DIR, fileName), buffer);
  
  if (i % 50 === 0) console.log(`Generated ${i}/${FRAMES} frames...`);
}

console.log('✅ Done generating frames!');
