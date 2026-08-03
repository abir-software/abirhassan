const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const originalIndexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

const lines = originalIndexHtml.split('\n');

const headerLines = lines.slice(0, 7958);
const footerLines = lines.slice(9225);

// The sections:
// 8078-8225: About
// 8225-8298: Experience
// 8298-8438: QA & Testing
// 8438-8703: Project Management (Featured Projects)
// 8703-8854: Web Development
// 8854-8959: Education
// 8959-9027: Blog
// 9027-9225: Contact

// Generate pages
const pages = {
  'about.html': { start: 8078, end: 8225 },
  'experience.html': { start: 8225, end: 8298 },
  'qa-testing.html': { start: 8298, end: 8438 },
  'pm.html': { start: 8438, end: 8703 }, // Was projects.html
  'web-dev.html': { start: 8703, end: 8854 },
  'contact.html': { start: 9027, end: 9225 },
  'blog-page.html': { start: 8959, end: 9027 },
};

for (const [filename, config] of Object.entries(pages)) {
  const sectionContent = lines.slice(config.start, config.end);
  let html = [
    ...headerLines,
    ...sectionContent,
    ...footerLines
  ].join('\n');
  
  // Add right-alignment classes
  html = html.replace(/class="hero"/g, 'class="hero hero-right-aligned"');
  
  fs.writeFileSync(path.join(__dirname, '../', filename), html);
  console.log(`Created ${filename}`);
}

// Now generate trimmed index.html
let trimmedIndex = originalIndexHtml;

// 1. Trim About
trimmedIndex = trimmedIndex.replace(
  /<!-- Career Timeline -->[\s\S]*?(?=<\/section>)/,
  `\n      <div style="text-align: center; margin-top: 2rem;">\n        <a href="/about.html" class="btn btn--primary">Read Full Bio & Journey</a>\n      </div>\n    </div>\n  `
);

// 2. Trim Experience
const experienceExp = /<div class="timeline__track">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;
const experienceMatch = trimmedIndex.match(experienceExp);
if (experienceMatch) {
  const firstItemMatch = experienceMatch[1].match(/<div class="timeline__item"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
  if (firstItemMatch) {
    trimmedIndex = trimmedIndex.replace(experienceExp, 
      `<div class="timeline__track">\n${firstItemMatch[0]}\n</div>\n</div>\n      <div style="text-align: center; margin-top: 2rem;">\n        <a href="/experience.html" class="btn btn--primary">View All Experience</a>\n      </div>\n    </div>\n  </section>`
    );
  }
}

// 3. Trim QA & Testing
const qaExp = /<div class="qa-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;
const qaMatch = trimmedIndex.match(qaExp);
if (qaMatch) {
  const firstCardMatch = qaMatch[1].match(/<div class="qa-card glass-card[\s\S]*?<\/ul>\s*<\/div>\s*<\/div>/);
  if (firstCardMatch) {
    trimmedIndex = trimmedIndex.replace(qaExp,
      `<div class="qa-grid" style="grid-template-columns: 1fr; max-width: 600px; margin: 0 auto;">\n${firstCardMatch[0]}\n</div>\n      <div style="text-align: center; margin-top: 2rem;">\n        <a href="/qa-testing.html" class="btn btn--primary">See More QA & Testing</a>\n      </div>\n    </div>\n  </section>`
    );
  }
}

// 4. Do NOT trim Projects in index.html! (User said: "in home page it will be combined as before")
// But we still need to add right alignment classes to hero.
trimmedIndex = trimmedIndex.replace(/class="hero"/g, 'class="hero hero-right-aligned"');

// 5. Trim Web Dev
const webDevExp = /<div class="dev-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;
const webDevMatch = trimmedIndex.match(webDevExp);
if (webDevMatch) {
  const firstCardMatch = webDevMatch[1].match(/<div class="dev-card glass-card[\s\S]*?<\/ul>\s*<\/div>\s*<\/div>/);
  if (firstCardMatch) {
    trimmedIndex = trimmedIndex.replace(webDevExp,
      `<div class="dev-grid" style="grid-template-columns: 1fr; max-width: 600px; margin: 0 auto;">\n${firstCardMatch[0]}\n</div>\n      <div style="text-align: center; margin-top: 2rem;">\n        <a href="/web-dev.html" class="btn btn--primary">See More Web Dev</a>\n      </div>\n    </div>\n  </section>`
    );
  }
}

// 6. Trim Education
const certExp = /<div class="cert-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;
const certMatch = trimmedIndex.match(certExp);
if (certMatch) {
  const firstCardMatch = certMatch[1].match(/<div class="cert-card glass-card[\s\S]*?<\/div>\s*<\/div>/);
  if (firstCardMatch) {
    trimmedIndex = trimmedIndex.replace(certExp,
      `<div class="cert-grid" style="grid-template-columns: 1fr; max-width: 600px; margin: 0 auto;">\n${firstCardMatch[0]}\n</div>\n      <div style="text-align: center; margin-top: 2rem;">\n        <a href="/about.html#certifications" class="btn btn--primary">See More Education</a>\n      </div>\n    </div>\n  </section>`
    );
  }
}

// 7. Trim Blog
const blogExp = /<div class="knowledge-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;
const blogMatch = trimmedIndex.match(blogExp);
if (blogMatch) {
  const firstCardMatch = blogMatch[1].match(/<article class="knowledge-card glass-card[\s\S]*?<\/article>/);
  if (firstCardMatch) {
    trimmedIndex = trimmedIndex.replace(blogExp,
      `<div class="knowledge-grid" style="grid-template-columns: 1fr; max-width: 600px; margin: 0 auto;">\n${firstCardMatch[0]}\n</div>\n      <div style="text-align: center; margin-top: 2rem;">\n        <a href="/blog-page.html" class="btn btn--primary">Read All Blogs</a>\n      </div>\n    </div>\n  </section>`
    );
  }
}

fs.writeFileSync(indexHtmlPath, trimmedIndex);
console.log("Index trimmed successfully.");
