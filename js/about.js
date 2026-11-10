/**
 * LEGAL & CONSULTING — ABOUT PAGE LOGIC (about.js)
 * GSAP animations for editorial sections and counters
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  if (typeof gsap !== 'undefined') {
    gsap.from('.about-hero-title', { opacity: 0, y: 25, duration: 0.8, ease: 'power3.out' });
    gsap.from('.about-hero-lead', { opacity: 0, y: 15, duration: 0.7, delay: 0.2, ease: 'power3.out' });
  }

  // Bind trigger buttons for Consultation Modal
  document.querySelectorAll('[data-open-modal="consultationModal"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.LegalApp && window.LegalApp.openModal) {
        window.LegalApp.openModal('consultationModal');
      }
    });
  });
});
