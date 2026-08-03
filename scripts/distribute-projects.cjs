const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

// Extract the whole projects grid from index.html
const gridMatch = indexHtml.match(/<div class="projects-grid" id="projects-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/);

if (!gridMatch) {
  console.error("Could not find projects grid in index.html");
  process.exit(1);
}

const gridInner = gridMatch[1];
const cards = gridInner.split(/(?=<div class="project-card glass-card")/);

const qaCards = cards.filter(c => c.includes('data-category="qa"')).join('');
const webCards = cards.filter(c => c.includes('data-category="web"')).join('');
const pmCards = cards.filter(c => c.includes('data-category="pm"')).join('');

// 1. Update pm.html
// In pm.html, we just replace the inner contents of the projects-grid with pmCards.
// And we should probably remove the projects-filter buttons if there's only PM projects?
// Let's remove the filter buttons from pm.html, since it only has PM projects.
const pmPath = path.join(__dirname, '../pm.html');
let pmHtml = fs.readFileSync(pmPath, 'utf-8');
pmHtml = pmHtml.replace(/<div class="projects-filter">[\s\S]*?<\/div>/, '');
pmHtml = pmHtml.replace(/<div class="projects-grid" id="projects-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, 
  `<div class="projects-grid" id="projects-grid">\n${pmCards}</div>\n    </div>\n  </section>`);
fs.writeFileSync(pmPath, pmHtml);
console.log("Updated pm.html");

// 2. Update qa-testing.html
// Append a new projects grid to qa-testing before </section>
const qaPath = path.join(__dirname, '../qa-testing.html');
let qaHtml = fs.readFileSync(qaPath, 'utf-8');
const qaProjectsSection = `
      <div style="margin-top: 4rem;">
        <h3 class="section__title">QA <span class="text-accent">Projects</span></h3>
        <div class="projects-grid" style="margin-top: 2rem;">
${qaCards}
        </div>
      </div>
    </div>
  </section>`;
qaHtml = qaHtml.replace(/<\/div>\s*<\/section>/, qaProjectsSection);
fs.writeFileSync(qaPath, qaHtml);
console.log("Updated qa-testing.html");

// 3. Update web-dev.html
// Append a new projects grid to web-dev before </section>
const webPath = path.join(__dirname, '../web-dev.html');
let webHtml = fs.readFileSync(webPath, 'utf-8');
const webProjectsSection = `
      <div style="margin-top: 4rem;">
        <h3 class="section__title">Web Dev <span class="text-accent">Projects</span></h3>
        <div class="projects-grid" style="margin-top: 2rem;">
${webCards}
        </div>
      </div>
    </div>
  </section>`;
webHtml = webHtml.replace(/<\/div>\s*<\/section>/, webProjectsSection);
fs.writeFileSync(webPath, webHtml);
console.log("Updated web-dev.html");
