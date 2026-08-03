// ========================================
// MAIN — App entry point
// ========================================
import { getHero, applyThemeSettings, trackVisitor } from './js/data.js';
// ... existing animation imports
// Import Renderers
import {
  renderExpertise, renderCompetencies, renderQAExpertise, renderQATools,
  renderPMResponsibilities, renderPMDocs, renderProjects, renderWebDevSkills,
  renderWorkflow, renderWebProjects, renderEducation, renderCertifications,
  renderBlog, renderContactChannels, renderNavigation, renderTestimonials, renderGlobalContent
} from './js/renderers.js';

// Import Animations & Effects
import {
  initAnimations, initHeroImageAnimation, initCounters,
  initTypingEffect, initScrollSpy
} from './js/animations.js';
import { initCursor } from './js/cursor.js';
import { initThreeBackground } from './js/three-bg.js';
import { initPenguin } from './js/penguin.js';
import { initScrollRobot } from './js/scroll-robot.js';

// Init interactions
import {
  initMobileMenu, initProjectFilter, initModeSwitch,
  initCursorToggle, initContactForm, initSmoothScroll
} from './js/interactions.js';

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', async () => {
  // Visitor Tracker
  trackVisitor().catch(() => { });

  // Apply CMS theme settings first
  applyThemeSettings().catch(() => { });

  // Render all content (async — loads from API)
  await Promise.allSettled([
    renderExpertise(),
    renderCompetencies(),
    renderQAExpertise(),
    renderQATools(),
    renderPMResponsibilities(),
    renderPMDocs(),
    renderProjects(),
    renderWebDevSkills(),
    renderWorkflow(),
    renderWebProjects(),
    renderEducation(),
    renderCertifications(),
    renderBlog(),
    renderNavigation(),
    renderTestimonials(),
    renderGlobalContent(),
  ]);
  renderContactChannels();

  // Init custom cursor
  try {
    initCursor();
    console.log('Cursor initialized');
  } catch (e) {
    console.error('Cursor init failed:', e);
  }

  // Init interactions
  initMobileMenu();
  initProjectFilter();
  initModeSwitch();
  initCursorToggle();
  initContactForm();
  initSmoothScroll();

  // Init animations (after content is rendered)
  requestAnimationFrame(async () => {
    initAnimations();
    initHeroImageAnimation();
    initCounters();
    // Load hero data for typing animation
    try {
      const hero = await getHero();
      initTypingEffect(hero.titles || []);
    } catch {
      initTypingEffect(['Software Engineer', 'QA Specialist', 'Project Manager']);
    }
    initScrollSpy();
  });

  // Init Three.js background
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    try {
      initThreeBackground(canvas);
    } catch (e) {
      console.warn('Three.js background disabled:', e.message);
    }
  }

  // Init penguin mascot
  try {
    initPenguin();
    console.log('Penguin initialized');
  } catch (e) {
    console.error('Penguin init failed:', e);
  }

  // Init scroll robot
  try {
    initScrollRobot();
    console.log('Scroll robot initialized');
  } catch (e) {
    console.error('Scroll robot init failed:', e);
  }
});
