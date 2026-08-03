const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, '../')).filter(f => f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(__dirname, '../', file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Add hero-right-aligned to hero
  content = content.replace(/class="hero"/g, 'class="hero hero-right-aligned"');
  
  // To avoid breaking the header/footer containers, let's only do it for sections inside <section>
  // But wait, the hero is inside a <div class="container">. 
  // Let's add content-right-aligned to all section__header and section content grids.
  // Actually, replacing <div class="container"> with <div class="container content-right-aligned"> inside sections might be too broad.
  // We can just add right alignment to the `.container` inside `.section:not(.section--hero)`.
  
  // Instead of modifying HTML for everything, why not just add a global CSS rule for the sections?
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated classes in ${file}`);
}
