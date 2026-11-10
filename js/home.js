/**
 * LEGAL & CONSULTING — HOME PAGE LOGIC (home.js)
 * GSAP entrance animations, FAQ accordion, statistics counter, quick consultation booking
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // GSAP SCROLL & HERO ANIMATIONS
  // ==========================================
  if (typeof gsap !== 'undefined') {
    // Register ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Hero timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl.from('.hero-badge-tag', { opacity: 0, y: -20, duration: 0.8, delay: 0.2 })
      .from('.hero-title', { opacity: 0, y: 30, duration: 1 }, '-=0.5')
      .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8 }, '-=0.6')
      .from('.hero-actions .btn', { opacity: 0, y: 20, stagger: 0.15, duration: 0.7 }, '-=0.5')
      .from('.hero-floating-card', { opacity: 0, x: 40, duration: 1 }, '-=0.7');

    // Scroll reveals for service cards
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.utils.toArray('.service-card').forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          delay: (index % 3) * 0.15,
          ease: 'power2.out'
        });
      });

      // Practice Tiles Stagger
      gsap.utils.toArray('.practice-tile').forEach((tile, index) => {
        gsap.from(tile, {
          scrollTrigger: {
            trigger: tile,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          delay: (index % 4) * 0.1,
          ease: 'power2.out'
        });
      });

      // Process Steps Timeline
      const processLine = document.querySelector('.process-line-progress');
      if (processLine) {
        gsap.from(processLine, {
          scrollTrigger: {
            trigger: '.process-timeline',
            start: 'top 75%',
            end: 'bottom 75%',
            scrub: 0.6
          },
          scaleX: 0,
          transformOrigin: 'left'
        });
      }
    }
  }

  // ==========================================
  // ANIMATED STAT COUNTERS
  // ==========================================
  const statCounters = document.querySelectorAll('.stat-counter');
  let animatedStats = false;

  const countUp = (el, target) => {
    let current = 0;
    const duration = 2000;
    const stepTime = 20;
    const increment = target / (duration / stepTime);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString() + '+';
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current).toLocaleString() + '+';
      }
    }, stepTime);
  };

  const initCounters = () => {
    const statsSection = document.querySelector('.stats-banner');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animatedStats) {
          animatedStats = true;
          statCounters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            if (!isNaN(target)) {
              countUp(counter, target);
            }
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  };

  initCounters();

  // ==========================================
  // FAQ ACCORDION INTERACTION
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all other items
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  });

  // ==========================================
  // QUICK CONSULTATION BOOKING MODAL & FORM
  // Handled universally with strict validation and 404 redirection in main.js
  // ==========================================

  function setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const group = field.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      let err = group.querySelector('.form-error-msg');
      if (err) err.textContent = message;
    }
  }

  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const group = field.closest('.form-group');
    if (group) {
      group.classList.remove('has-error');
    }
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
