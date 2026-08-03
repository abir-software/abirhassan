const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, '../')).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(__dirname, '../', file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace variables in inline root styles
  content = content.replace(/--color-bg-card:\s*rgba\(15,\s*32,\s*64,\s*.55\);/g, '--color-bg-card: transparent;');
  content = content.replace(/--glass-bg:\s*rgba\(15,\s*32,\s*64,\s*.45\);/g, '--glass-bg: transparent;');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated cards background in ${file}`);
}
