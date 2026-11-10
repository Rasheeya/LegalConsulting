/**
 * LEGAL & CONSULTING — SERVICES PAGE LOGIC (services.js)
 * Tab filtering (All / Legal Services / Business Consulting), prefilled booking modal
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const tabBtns = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-detailed-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'grid';
          if (typeof gsap !== 'undefined') {
            gsap.from(card, { opacity: 0, y: 15, duration: 0.4 });
          }
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Handle request consultation buttons with prefilled service
  document.querySelectorAll('[data-request-service]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-request-service');
      const practiceSelect = document.getElementById('bookPracticeArea');

      if (practiceSelect && serviceName) {
        // Try to match or set notes
        let matched = false;
        for (let i = 0; i < practiceSelect.options.length; i++) {
          if (practiceSelect.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) ||
              practiceSelect.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
            practiceSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        const notes = document.getElementById('bookNotes');
        if (notes && !notes.value) {
          notes.value = `Inquiry regarding specialized advisory: ${serviceName}.`;
        }
      }

      if (window.LegalApp && window.LegalApp.openModal) {
        window.LegalApp.openModal('consultationModal');
      }
    });
  });

  // Check URL hash for direct filter or anchor jump
  const hash = window.location.hash;
  if (hash) {
    const targetElement = document.querySelector(hash);
    if (targetElement) {
      setTimeout(() => {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }, 400);
    }
  }
});
