const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, '../')).filter(f => f.endsWith('.html'));

const canvasTag = `<canvas id="scroll-sequence" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; object-fit: cover; z-index: -1; pointer-events: none;"></canvas>`;
const scriptTag = `<script type="module" src="/src/js/sequence.js"></script>\n</body>`;

for (const file of files) {
  const filePath = path.join(__dirname, '../', file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace the old canvas with the new one
  // Old canvas might look like <canvas id="bg-canvas" ...></canvas>
  content = content.replace(/<canvas id="bg-canvas"[\s\S]*?<\/canvas>/, canvasTag);
  
  // If the canvas isn't found (maybe it was already replaced or missing), try injecting after <body>
  if (!content.includes('id="scroll-sequence"')) {
      content = content.replace(/<body[^>]*>/, match => `${match}\n  ${canvasTag}`);
  }
  
  // Inject the script tag right before </body>
  if (!content.includes('src="/src/js/sequence.js"')) {
      content = content.replace(/<\/body>/, scriptTag);
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`Injected sequence into ${file}`);
}
