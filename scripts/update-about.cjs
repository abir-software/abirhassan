const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../about.html');
let content = fs.readFileSync(filePath, 'utf-8');

const newAboutContent = `<div class="about-grid">
        <div class="about__profile reveal-left"
          style="translate: none; rotate: none; scale: none; transform: translate(-50px, 0px); opacity: 0;">
          <div class="about__avatar">
            <div class="about__avatar-glow"></div>
            <div class="about__avatar-placeholder">
              <img src="src/image/abir.jpeg" alt="Avatar" style="width: 100%; border-radius: 50%;">
            </div>
          </div>
          <div class="about__info">
            <h3>Md Abir Hassan</h3>
            <p class="about__role">Software Engineer<br>(QA & Operations)</p>
            <p class="about__company">Daffodil Software Ltd.</p>
          </div>
        </div>

        <div class="about__bio reveal-right"
          style="translate: none; rotate: none; scale: none; transform: translate(50px, 0px); opacity: 0;">
          <p>I am a <strong>Software Engineer</strong> specializing in Quality Assurance, Agile Delivery, and Technical Operations, with over 4 years of experience driving software reliability and process optimization. With a unique foundation of a BSc in CSE and an MBA in MIS, I bridge the gap between technical execution and business strategy—ensuring that quality is not just a testing phase, but a collaborative engineering mindset that accelerates delivery.</p>
          
          <p>My career evolved from corporate administration into technical engineering, giving me a distinct advantage in stakeholder management, team leadership, and operational workflows. I currently manage QA operations and act as a core administrative and Scrum facilitator, working directly with executive leadership (CTO) to align technical outputs with business goals.</p>
          
          <h4 style="margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--color-accent-bright);">Key Impacts at Daffodil Software Ltd. (DSL):</h4>
          <ul style="list-style-type: none; padding-left: 0; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <li>🔹 <strong>QA Leadership & STaaS:</strong> Established and currently lead QA operations for both internal and external clients, providing technical and managerial direction for our Software Testing as a Service (STaaS) initiative.</li>
            <li>🔹 <strong>Process Optimization & Automation:</strong> Introduced AI-assisted testing workflows and integrated Cypress and JMeter, reducing manual QA effort by approximately 40% and accelerating delivery timelines.</li>
            <li>🔹 <strong>Cross-Functional Delivery:</strong> Managed quality validation for 8+ commercial products (ERP, SaaS, POS, University Management Systems) and 34 Daffodil Group concerns.</li>
            <li>🔹 <strong>Agile Operations:</strong> Serve as the central Scrum facilitator and operational support resource, resolving day-to-day technical blockers and coordinating cross-functional teams.</li>
          </ul>

          <h4 style="margin-top: 1rem; margin-bottom: 0.5rem; color: var(--color-accent-bright);">Core Expertise:</h4>
          <ul style="padding-left: 1rem; margin-bottom: 1.5rem;">
            <li>QA Leadership & Test Strategy | Agile Scrum & Technical Project Management</li>
            <li>Functional, API, Regression & Performance Testing | Test Automation (Cypress, JMeter) & AI Workflows</li>
            <li>SDLC/STLC & Defect Lifecycle Management | Stakeholder Communication & Operational Coordination</li>
          </ul>
          
          <p><em>Open to dynamic opportunities in QA Leadership, Technical Project Management (TPM), Product Ownership, and Delivery Management where technical excellence meets strategic execution.</em></p>
        </div>
      </div>`;

content = content.replace(/<div class="about-grid">[\s\S]*?<\/div>\s*<!-- Career Timeline -->/, newAboutContent + '\n\n      <!-- Career Timeline -->');


const newTimeline = `<div class="timeline reveal-up" id="career-timeline"
        style="translate: none; rotate: none; scale: none; transform: translate(0px, 50px); opacity: 0;">
        <h3 class="timeline__title">Career Journey</h3>
        <div class="timeline__track">
          
          <div class="timeline__item">
            <div class="timeline__dot timeline__dot--edu"></div>
            <div class="timeline__content glass-card">
              <span class="timeline__date">2018 – 2021</span>
              <h4>BSc in CSE</h4>
              <p>Daffodil International University</p>
            </div>
          </div>

          <div class="timeline__item">
            <div class="timeline__dot timeline__dot--work"></div>
            <div class="timeline__content glass-card">
              <span class="timeline__date">Jun 2022 – Jan 2024</span>
              <h4>Assistant Administrative Officer</h4>
              <p>Dept. of Compliance Cell — Daffodil Family</p>
            </div>
          </div>

          <div class="timeline__item">
            <div class="timeline__dot timeline__dot--edu"></div>
            <div class="timeline__content glass-card">
              <span class="timeline__date">2023 – 2025</span>
              <h4>MBA in Management Information Systems (MIS)</h4>
              <p>Daffodil International University</p>
            </div>
          </div>

          <div class="timeline__item">
            <div class="timeline__dot timeline__dot--work"></div>
            <div class="timeline__content glass-card">
              <span class="timeline__date">Feb 2024 – Jun 2026</span>
              <h4>Software Engineer (Jr)</h4>
              <p>Daffodil Software Limited (DSL)</p>
            </div>
          </div>

          <div class="timeline__item">
            <div class="timeline__dot timeline__dot--work"></div>
            <div class="timeline__content glass-card" style="border-left: 4px solid var(--color-accent-bright);">
              <span class="timeline__date" style="color: var(--color-accent-bright); font-weight: bold;">July 2026 – Present</span>
              <h4 style="color: var(--color-accent-bright);">Software Engineer (QA & Operations)</h4>
              <p>Daffodil Software Limited (DSL)</p>
            </div>
          </div>

        </div>
      </div>`;

content = content.replace(/<div class="timeline reveal-up" id="career-timeline"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, newTimeline + '\n    </div>');

fs.writeFileSync(filePath, content);
console.log("Updated about.html");
