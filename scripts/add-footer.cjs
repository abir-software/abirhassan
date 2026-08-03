const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'blog.html' && f !== 'blog-detail.html');

const footerHtml = `  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <p>© 2024 Md Abir Hassan. Crafted with precision.</p>
        <div class="footer__links">
          <a href="index.html">Home</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>
    </div>
  </footer>`;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if footer exists
  const footerRegex = /<footer class="footer">[\s\S]*?<\/footer>/;
  if (footerRegex.test(content)) {
    // Replace existing footer
    content = content.replace(footerRegex, footerHtml);
  } else {
    // Inject before the cursor-trail, social-bar, penguin, scroll-robot, or scripts.
    // Easiest is to inject right before <!-- Main Script --> or <div class="cursor-trail"
    const insertPointRegex = /(<!-- Main Script -->|<div class="cursor-trail")/i;
    if (insertPointRegex.test(content)) {
      content = content.replace(insertPointRegex, `${footerHtml}\n\n  $1`);
    } else {
      // If none found, just inject before </body>
      content = content.replace('</body>', `${footerHtml}\n</body>`);
    }
  }

  fs.writeFileSync(filePath, content);
}

console.log("Footer successfully added/updated to all HTML files.");
