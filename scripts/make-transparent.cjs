const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, '../')).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(__dirname, '../', file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace background in body block in inline styles
  content = content.replace(/body\s*\{\s*font-family[\s\S]*?background:\s*var\(--color-bg-deep\);/g, function(match) {
    return match.replace('background: var(--color-bg-deep);', 'background: transparent;');
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated body background in ${file}`);
}
