const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '../index.html');
let lines = fs.readFileSync(indexHtmlPath, 'utf-8').split('\n');

// We will do this by finding the sections and manipulating the lines array.
// But since modifying the array shifts indices, we'll just build a new array or do it carefully.
// A better way: replace block between specific strings.

let content = fs.readFileSync(indexHtmlPath, 'utf-8');

// About Section trim
content = content.replace(
  /<!-- Career Timeline -->[\s\S]*?(?=<\/section>)/,
  `\n      <div style="text-align: center; margin-top: 2rem;">
        <a href="/about.html" class="btn btn--primary">Read Full Bio & Journey</a>
      </div>\n    </div>\n  `
);

// Experience Section trim (keep first timeline item, remove rest)
// We need to match <div class="timeline__item"> ... </div> then remove the rest.
// It's safer to just replace the whole timeline track contents.
const experienceExp = /<div class="timeline__track">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;
const experienceMatch = content.match(experienceExp);
if (experienceMatch) {
  // Extract just the first item
  const firstItemMatch = experienceMatch[1].match(/<div class="timeline__item"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
  if (firstItemMatch) {
    content = content.replace(experienceExp, 
      `<div class="timeline__track">\n${firstItemMatch[0]}\n</div>\n</div>\n      <div style="text-align: center; margin-top: 2rem;">\n        <a href="/experience.html" class="btn btn--primary">View All Experience</a>\n      </div>\n    </div>\n  </section>`
    );
  }
}

// QA & Testing trim (keep first card)
const qaExp = /<div class="qa-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;
const qaMatch = content.match(qaExp);
if (qaMatch) {
  const firstCardMatch = qaMatch[1].match(/<div class="qa-card glass-card[\s\S]*?<\/ul>\s*<\/div>\s*<\/div>/);
  if (firstCardMatch) {
//    content = content.replace(qaExp,
//      `<div class="qa-grid" style="grid-template-columns: 1fr; max-width: 600px; margin: 0 auto;">\n${firstCardMatch[0]}\n</div>\n      <div style="text-align: center; margin-top: 2rem;">\n        <a href="/qa-testing.html" class="btn btn--primary">See More QA & Testing</a>\n      </div>\n    </div>\n  </section>`
//    );
//  }
//}
//
//// Projects trim
//const projectsExp = /<div class="projects-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;
//const projectsMatch = content.match(projectsExp);
//if (projectsMatch) {
  const firstTwoCardsMatch = projectsMatch[1].match(/(<div class="project-card[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>[\s\S]*?){2}/);
  if (firstTwoCardsMatch) {
    content = content.replace(projectsExp,
      `<div class="projects-grid">\n${firstTwoCardsMatch[0]}\n</div>\n      <div style="text-align: center; margin-top: 2rem;">\n        <a href="/projects.html" class="btn btn--primary">View All Projects</a>\n      </div>\n    </div>\n  </section>`
    );
  }
}

// Web Dev trim
const webDevExp = /<div class="dev-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;
const webDevMatch = content.match(webDevExp);
if (webDevMatch) {
  const firstCardMatch = webDevMatch[1].match(/<div class="dev-card glass-card[\s\S]*?<\/ul>\s*<\/div>\s*<\/div>/);
  if (firstCardMatch) {
    content = content.replace(webDevExp,
      `<div class="dev-grid" style="grid-template-columns: 1fr; max-width: 600px; margin: 0 auto;">\n${firstCardMatch[0]}\n</div>\n      <div style="text-align: center; margin-top: 2rem;">\n        <a href="/web-dev.html" class="btn btn--primary">See More Web Dev</a>\n      </div>\n    </div>\n  </section>`
    );
  }
}

// Education / Certifications trim
const certExp = /<div class="cert-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;
const certMatch = content.match(certExp);
if (certMatch) {
  const firstCardMatch = certMatch[1].match(/<div class="cert-card glass-card[\s\S]*?<\/div>\s*<\/div>/);
  if (firstCardMatch) {
    content = content.replace(certExp,
      `<div class="cert-grid" style="grid-template-columns: 1fr; max-width: 600px; margin: 0 auto;">\n${firstCardMatch[0]}\n</div>\n      <div style="text-align: center; margin-top: 2rem;">\n        <a href="/about.html#certifications" class="btn btn--primary">See More Education</a>\n      </div>\n    </div>\n  </section>`
    );
  }
}

// Blog trim
const blogExp = /<div class="knowledge-grid">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;
const blogMatch = content.match(blogExp);
if (blogMatch) {
  const firstCardMatch = blogMatch[1].match(/<article class="knowledge-card glass-card[\s\S]*?<\/article>/);
  if (firstCardMatch) {
    content = content.replace(blogExp,
      `<div class="knowledge-grid" style="grid-template-columns: 1fr; max-width: 600px; margin: 0 auto;">\n${firstCardMatch[0]}\n</div>\n      <div style="text-align: center; margin-top: 2rem;">\n        <a href="/blog-page.html" class="btn btn--primary">Read All Blogs</a>\n      </div>\n    </div>\n  </section>`
    );
  }
}

fs.writeFileSync(indexHtmlPath, content);
console.log("Index trimmed successfully.");
