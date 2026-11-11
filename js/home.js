/**
 * LEGAL & CONSULTING — HOME PAGE LOGIC (home.js)
 * GSAP entrance animations, FAQ accordion, statistics counter, quick consultation booking
 */

(function () {
  'use strict';

  function initHome() {
    // ==========================================
    // GSAP SCROLL & HERO ANIMATIONS (Safely wrapped)
    // ==========================================
    if (typeof gsap !== 'undefined') {
      try {
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
      } catch (err) {
        console.warn('GSAP initialization notice:', err);
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
    // Universally controlled by js/main.js
    // ==========================================
    if (window.LegalApp && window.LegalApp.initFaqAccordion) {
      window.LegalApp.initFaqAccordion();
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHome);
  } else {
    initHome();
  }
})();
