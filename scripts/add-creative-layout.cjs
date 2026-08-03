const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, '../src/styles/layout.css');

const newCSS = `
/* === Text Visibility Tweaks === */
.hero__title,
.hero__subtitle,
.section__title {
  text-shadow: var(--text-shadow-glow);
}

.hero__desc {
  text-shadow: var(--text-shadow-solid);
}

/* === Creative Staggered Grids === */
@media (min-width: 1025px) {
  .experience-grid > *:nth-child(even),
  .qa-expertise-grid > *:nth-child(even),
  .pm-grid > *:nth-child(even),
  .competencies__grid > *:nth-child(even),
  .blog-grid > *:nth-child(3n+2),
  .projects-grid > *:nth-child(3n+2) {
    transform: translateY(40px);
  }
  
  .blog-grid > *:nth-child(3n+3),
  .projects-grid > *:nth-child(3n+3) {
    transform: translateY(80px);
  }
  
  /* Prevent hover from overriding the stagger completely, or just rely on the staggered initial state */
  /* Actually, since .glass-card:hover transforms Y, we can wrap the cards in a stagger-wrapper, or just accept that hover might reset the Y if they have transition. */
  /* We will use margin-top instead of transform to preserve hover transforms! */
  
  .experience-grid > *:nth-child(even),
  .qa-expertise-grid > *:nth-child(even),
  .pm-grid > *:nth-child(even),
  .competencies__grid > *:nth-child(even) {
    transform: none; /* remove above transform */
    margin-top: 50px;
  }
  
  .blog-grid > *:nth-child(3n+2),
  .projects-grid > *:nth-child(3n+2) {
    transform: none;
    margin-top: 40px;
  }
  
  .blog-grid > *:nth-child(3n+3),
  .projects-grid > *:nth-child(3n+3) {
    transform: none;
    margin-top: 80px;
  }
}
`;

fs.appendFileSync(layoutPath, newCSS);
console.log("Appended creative tweaks to layout.css");
