const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, '../')).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(__dirname, '../', file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Remove the image wrapper completely
  content = content.replace(/<div class="hero__image-wrapper[\s\S]*?<\/div>\s*<\/div>/, '');

  // Modify the hero layout in inline CSS if it exists
  content = content.replace(/\.hero__layout\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*1\.2fr\s*0\.8fr;/g, 
    '.hero__layout { display: flex; justify-content: flex-end; width: 100%;');

  // Also remove it from media queries if necessary
  content = content.replace(/\.hero__layout\s*\{\s*grid-template-columns:\s*1fr;/g, 
    '.hero__layout { display: flex; flex-direction: column; align-items: flex-end;');

  // Add strong text shadow to hero texts for visibility on the moving background
  // and set color to white
  if (!content.includes('.hero__content * { text-shadow:')) {
      content = content.replace(/<\/style>/, `
    .hero__content * {
      text-shadow: 0 4px 15px rgba(0, 0, 0, 0.9), 0 2px 5px rgba(0, 0, 0, 0.9);
      color: #ffffff;
    }
    .hero__summary strong {
      color: var(--color-accent-bright);
    }
    .text-accent {
      color: var(--color-accent-bright) !important;
    }
  </style>`);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Updated hero layout in ${file}`);
}
