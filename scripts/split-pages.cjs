const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');

const lines = indexHtml.split('\n');

const headerLines = lines.slice(0, 7958);
const footerLines = lines.slice(9225);

const pages = {
  'about.html': { start: 8078, end: 8225, id: 'about' },
  'experience.html': { start: 8225, end: 8298, id: 'experience' },
  'qa-testing.html': { start: 8298, end: 8438, id: 'qa-testing' },
  'projects.html': { start: 8438, end: 8703, id: 'project-management' },
  'web-dev.html': { start: 8703, end: 8854, id: 'web-development' },
  'contact.html': { start: 9027, end: 9225, id: 'contact' },
  'blog-page.html': { start: 8959, end: 9027, id: 'knowledge' },
};

// Create the subpages
for (const [filename, config] of Object.entries(pages)) {
  const sectionContent = lines.slice(config.start, config.end);
  
  const html = [
    ...headerLines,
    ...sectionContent,
    ...footerLines
  ].join('\n');
  
  fs.writeFileSync(path.join(__dirname, '../', filename), html);
  console.log(`Created ${filename}`);
}

console.log('Done splitting pages.');
