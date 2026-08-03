const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../experience.html');
let content = fs.readFileSync(filePath, 'utf-8');

const newExperienceGrid = `<div class="experience-grid" id="experience-grid">
        <!-- Role 1 -->
        <div class="exp-card glass-card reveal-left">
          <div class="exp-card__badge exp-card__badge--current">Current</div>
          <div class="exp-card__header">
            <div class="exp-card__icon">💻</div>
            <div>
              <h3 class="exp-card__title">Software Engineer (QA & Operations)</h3>
              <p class="exp-card__company">Daffodil Software Limited (DSL) · Full-time (Promoted)</p>
              <span class="exp-card__date">July 2026 – Present</span>
            </div>
          </div>
          <p style="margin-bottom: 1rem;"><strong>Key Responsibilities & Leadership:</strong></p>
          <ul class="exp-card__list">
            <li><strong>QA Leadership & Test Automation:</strong> Architect and execute end-to-end test automation strategies using Cypress and JMeter, establishing automated regression test suites, security audits, and performance load benchmarks across 50+ enterprise systems.</li>
            <li><strong>Agile Scrum Master:</strong> Serve as central Agile Scrum Master, facilitating Sprint Planning, Daily Standups, Backlog Refinement, and Sprint Retrospectives directly with CTO and executive leadership.</li>
            <li><strong>Technical Project Management & STaaS:</strong> Manage client communications, SRS/BRS technical documentation, milestone delivery tracking, and direct Software Testing as a Service (STaaS) operations for corporate and government platforms.</li>
            <li><strong>Process Governance & Quality Operations:</strong> Establish QA standard operating procedures, defect tracking workflows in JIRA/Bugzilla, and drive quality-first software engineering across product teams.</li>
          </ul>
          <div class="exp-card__tags">
            <span class="tag">QA Leadership</span>
            <span class="tag">Test Automation</span>
            <span class="tag">Agile Scrum Master</span>
            <span class="tag">Tech PM</span>
            <span class="tag">STaaS Operations</span>
            <span class="tag">Cypress</span>
            <span class="tag">JMeter</span>
            <span class="tag">JIRA</span>
            <span class="tag">Defect Tracking</span>
          </div>
        </div>

        <!-- Role 2 -->
        <div class="exp-card glass-card reveal-right">
          <div class="exp-card__header">
            <div class="exp-card__icon">⚙️</div>
            <div>
              <h3 class="exp-card__title">Software Engineer (Jr)</h3>
              <p class="exp-card__company">Daffodil Software Limited (DSL) · Full-time</p>
              <span class="exp-card__date">Feb 2024 – July 2026</span>
            </div>
          </div>
          <p style="margin-bottom: 1rem;"><strong>Responsibilities Summary:</strong></p>
          <ul class="exp-card__list">
            <li><strong>Test Execution & Automation:</strong> Conduct functional, performance, and security testing for commercial and non-commercial projects using tools like JMeter, Cypress, and JIRA.</li>
            <li><strong>Defect Tracking & Quality Assurance:</strong> Identify, report, and track defects using JIRA/Bugzilla/others, ensuring timely resolution and adherence to quality standards.</li>
            <li><strong>Process Optimization & Documentation:</strong> Improve testing workflows, manage test cases, and maintain detailed project documentation for seamless software delivery.</li>
          </ul>
          <div class="exp-card__tags">
            <span class="tag">Administration</span>
            <span class="tag">Decision-Making</span>
            <span class="tag">Cypress</span>
            <span class="tag">JMeter</span>
            <span class="tag">JIRA</span>
            <span class="tag">Test Execution</span>
            <span class="tag">QA Operations</span>
          </div>
        </div>

        <!-- Role 3 -->
        <div class="exp-card glass-card reveal-left">
          <div class="exp-card__header">
            <div class="exp-card__icon">⚙️</div>
            <div>
              <h3 class="exp-card__title">Asst. Administrative Officer</h3>
              <p class="exp-card__company">Daffodil Software Limited (DSL)</p>
              <span class="exp-card__date">Feb 2023 – Jan 2024</span>
            </div>
          </div>
          <p style="margin-bottom: 1rem;"><em>Under Daffodil Corporate Office, assigned for working excellence and good performance on tech.</em></p>
          <ul class="exp-card__list">
            <li>Working as Project Coordination and System Documentation.</li>
          </ul>
          <div class="exp-card__tags">
            <span class="tag">Project Coordination</span>
            <span class="tag">System Documentation</span>
            <span class="tag">Software Testing</span>
            <span class="tag">AI Integration</span>
            <span class="tag">Admin</span>
          </div>
        </div>

        <!-- Role 4 -->
        <div class="exp-card glass-card reveal-right">
          <div class="exp-card__header">
            <div class="exp-card__icon">🌐</div>
            <div>
              <h3 class="exp-card__title">Assistant Administrative Officer, Dept. of Compliance Cell</h3>
              <p class="exp-card__company">Daffodil Family · Full-time</p>
              <span class="exp-card__date">Jun 2022 – Jan 2024</span>
            </div>
          </div>
          <ul class="exp-card__list">
            <li>As an Assistant Administrative Officer in the Compliance Cell at Daffodil Family, my role is pivotal in ensuring adherence to regulations and policies across over 54 subsidiaries of Daffodil Including Daffodil International University.</li>
            <li>Collaborating with senior management, conducting audits, facilitating IT tasks, and drafting compliance reports, policies.</li>
            <li>Upholding Daffodil's commitment to excellence and ethical business practices through meticulous attention to detail and effective communication.</li>
          </ul>
          <div class="exp-card__tags">
            <span class="tag">Compliance & Auditing</span>
            <span class="tag">Problem Solving</span>
            <span class="tag">Administration</span>
            <span class="tag">IT Task Facilitation</span>
            <span class="tag">Policy Drafting</span>
            <span class="tag">Smart Edu</span>
            <span class="tag">Event Execution</span>
            <span class="tag">Quality Assurance</span>
          </div>
        </div>
      </div>`;

content = content.replace(/<div class="experience-grid" id="experience-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, newExperienceGrid + '\n    </div>\n  </section>');

fs.writeFileSync(filePath, content);
console.log("Updated experience.html");
