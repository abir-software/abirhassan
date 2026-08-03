const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, '../')).filter(f => f.endsWith('.html'));

const newNav = `<ul class="nav__links" id="nav-links">
        <li><a href="/" class="nav__link" data-section="home">Home</a></li>
        <li><a href="/about.html" class="nav__link" data-section="about">About</a></li>
        <li><a href="/experience.html" class="nav__link" data-section="experience">Experience</a></li>
        <li><a href="/qa-testing.html" class="nav__link" data-section="qa-testing">QA &amp; Testing</a></li>
        <li><a href="/pm.html" class="nav__link" data-section="project-management">PM</a></li>
        <li><a href="/web-dev.html" class="nav__link" data-section="web-development">Web Dev</a></li>
        <li><a href="/blog-page.html" class="nav__link" data-section="knowledge">Blog</a></li>
        <li><a href="/contact.html" class="nav__link" data-section="contact">Contact</a></li>
      </ul>`;

for (const file of files) {
  const filePath = path.join(__dirname, '../', file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Try to replace the old navigation (from before or newly generated)
  content = content.replace(/<ul class="nav__links" id="nav-links">[\s\S]*?<\/ul>/, newNav);
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated nav in ${file}`);
}
