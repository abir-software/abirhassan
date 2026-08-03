const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(path.join(__dirname, '..')).filter(f => f.endsWith('.html'));

const oldSummary = /<p class="hero__summary[\s\S]*?<\/p>/;
const newSummary = `<p class="hero__summary reveal-up">
A results-oriented <strong>Software Engineer (QA & Operations)</strong> with 4+ years of multi-functional experience leading QA teams, driving test automation, and managing technical projects as an Agile Scrum Master. I specialize in bridging technical excellence with operational efficiency across <strong>50+ enterprise software projects</strong> including university ERPs and SaaS platforms.
</p>`;

for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  content = content.replace(oldSummary, newSummary);

  // Update dynamic titles in the inline script block
  content = content.replace(/const gm = \{ titles: \[.*?\] \}/, 
    'const gm = { titles: ["Software Engineer (QA & Operations)", "QA Leadership & Test Automation", "Agile Scrum Master", "Technical PM", "Web Developer"] }');

  fs.writeFileSync(filePath, content);
}
console.log("Updated global hero and dynamic titles.");
