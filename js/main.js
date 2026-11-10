/**
 * LEGAL & CONSULTING — MASTER JAVASCRIPT (main.js)
 * Core utilities, state persistence, preloader, responsive navigation, modals, toasts
 */

(function () {
  'use strict';

  // ==========================================
  // INITIAL DEMO DATA SEEDING (localStorage)
  // ==========================================
  const INITIAL_CONSULTATIONS = [
    {
      id: "CONS-8921",
      clientName: "Nexus Global Holdings",
      email: "legal@nexusglobal.demo",
      phone: "+1 (555) 234-8901",
      service: "Corporate Legal Advisory",
      practiceArea: "Corporate Law",
      date: "2026-11-12",
      time: "10:30 AM",
      status: "Confirmed",
      notes: "Cross-border corporate restructuring and subsidiary governance advisory.",
      consultant: "Sarah Jenkins, Esq."
    },
    {
      id: "CONS-8922",
      clientName: "Aether Dynamics LLC",
      email: "contact@aetherdyn.demo",
      phone: "+1 (555) 789-1234",
      service: "Contract Drafting and Review",
      practiceArea: "Commercial Law",
      date: "2026-11-14",
      time: "02:00 PM",
      status: "Pending",
      notes: "Series B investor subscription agreement and shareholder rights review.",
      consultant: "Alexander Wright, LL.M."
    },
    {
      id: "CONS-8923",
      clientName: "Vanguard Retail Partners",
      email: "ops@vanguardretail.demo",
      phone: "+1 (555) 456-7890",
      service: "Employment & Labour Law",
      practiceArea: "Employment Law",
      date: "2026-11-16",
      time: "11:00 AM",
      status: "Pending",
      notes: "Executive severance framework and intellectual property assignment covenants.",
      consultant: "Elena Rostova, Esq."
    },
    {
      id: "CONS-8924",
      clientName: "Horizon Bioscience Corp",
      email: "ip@horizonbio.demo",
      phone: "+1 (555) 678-9012",
      service: "Intellectual Property Advisory",
      practiceArea: "Intellectual Property",
      date: "2026-11-02",
      time: "03:30 PM",
      status: "Completed",
      notes: "International patent portfolio audit and proprietary trade secret protection.",
      consultant: "Marcus Sterling, Esq."
    },
    {
      id: "CONS-8925",
      clientName: "Silverline Logistics Ltd",
      email: "direct@silverline.demo",
      phone: "+1 (555) 345-6789",
      service: "Dispute Resolution & Mediation",
      practiceArea: "Dispute Resolution",
      date: "2026-10-28",
      time: "09:00 AM",
      status: "Cancelled",
      notes: "Commercial freight vendor breach dispute; settled via internal mediation.",
      consultant: "Alexander Wright, LL.M."
    }
  ];

  const INITIAL_CASES = [
    {
      id: "CASE-2026-041",
      title: "OmniCorp Cross-Border Restructuring",
      client: "OmniCorp International",
      practiceArea: "Corporate Law",
      consultant: "Sarah Jenkins, Esq.",
      filingDate: "2026-09-15",
      status: "In Progress",
      stage: 3, // 1 to 5
      progressPercent: 65,
      description: "Restructuring of UK and US operating entities into a dual-holding corporate structure."
    },
    {
      id: "CASE-2026-042",
      title: "SaaS Enterprise Master Agreement",
      client: "Aether Dynamics LLC",
      practiceArea: "Commercial Law",
      consultant: "Alexander Wright, LL.M.",
      filingDate: "2026-10-04",
      status: "Under Review",
      stage: 2,
      progressPercent: 40,
      description: "Drafting of multi-tiered enterprise service level contracts and data processing compliance."
    },
    {
      id: "CASE-2026-043",
      title: "BioPharma Patent Infringement Assessment",
      client: "Horizon Bioscience Corp",
      practiceArea: "Intellectual Property",
      consultant: "Marcus Sterling, Esq.",
      filingDate: "2026-08-20",
      status: "Open",
      stage: 1,
      progressPercent: 20,
      description: "Freedom-to-operate inquiry and competitive patent landscape review for enzymatic process."
    },
    {
      id: "CASE-2026-044",
      title: "Prime Commercial Lease Arbitration",
      client: "Apex Properties Group",
      practiceArea: "Real Estate Law",
      consultant: "Elena Rostova, Esq.",
      filingDate: "2026-07-11",
      status: "On Hold",
      stage: 3,
      progressPercent: 50,
      description: "Commercial tenant arbitration regarding capital improvements and shared operational expenses."
    },
    {
      id: "CASE-2026-045",
      title: "FinTech Regulatory Compliance Audit",
      client: "PayStream Systems Inc.",
      practiceArea: "Regulatory Compliance",
      consultant: "Sarah Jenkins, Esq.",
      filingDate: "2026-05-30",
      status: "Closed",
      stage: 5,
      progressPercent: 100,
      description: "Comprehensive AML/KYC regulatory alignment and policy manual certification."
    }
  ];

  const INITIAL_CLIENTS = [
    {
      id: "CLT-101",
      name: "Nexus Global Holdings",
      category: "Multinational Enterprise",
      email: "legal@nexusglobal.demo",
      phone: "+1 (555) 234-8901",
      consultations: 4,
      cases: 2,
      registered: "2026-01-15"
    },
    {
      id: "CLT-102",
      name: "Aether Dynamics LLC",
      category: "Technology & Software",
      email: "contact@aetherdyn.demo",
      phone: "+1 (555) 789-1234",
      consultations: 2,
      cases: 1,
      registered: "2026-03-22"
    },
    {
      id: "CLT-103",
      name: "Horizon Bioscience Corp",
      category: "Healthcare & Biotech",
      email: "ip@horizonbio.demo",
      phone: "+1 (555) 678-9012",
      consultations: 5,
      cases: 3,
      registered: "2026-02-09"
    },
    {
      id: "CLT-104",
      name: "Apex Properties Group",
      category: "Commercial Real Estate",
      email: "advisory@apexprop.demo",
      phone: "+1 (555) 992-3341",
      consultations: 3,
      cases: 1,
      registered: "2026-04-18"
    },
    {
      id: "CLT-105",
      name: "PayStream Systems Inc.",
      category: "Fintech & Banking",
      email: "compliance@paystream.demo",
      phone: "+1 (555) 441-8890",
      consultations: 6,
      cases: 2,
      registered: "2025-11-04"
    }
  ];

  const INITIAL_DOCUMENTS = [
    {
      id: "DOC-701",
      name: "Corporate_Articles_Amendment_Draft_v2.pdf",
      category: "Legal Agreements",
      caseRef: "CASE-2026-041",
      uploaded: "2026-10-18",
      size: "2.4 MB",
      status: "Approved"
    },
    {
      id: "DOC-702",
      name: "Master_Services_Agreement_Aether_Draft.docx",
      category: "Contracts",
      caseRef: "CASE-2026-042",
      uploaded: "2026-10-24",
      size: "1.1 MB",
      status: "Pending Review"
    },
    {
      id: "DOC-703",
      name: "Biotech_Patent_Search_Memorandum.pdf",
      category: "Consultation Notes",
      caseRef: "CASE-2026-043",
      uploaded: "2026-10-29",
      size: "3.8 MB",
      status: "Finalized"
    },
    {
      id: "DOC-704",
      name: "Commercial_Tenancy_Arbitration_Brief.pdf",
      category: "Litigation & Dispute",
      caseRef: "CASE-2026-044",
      uploaded: "2026-10-12",
      size: "4.5 MB",
      status: "Archived"
    },
    {
      id: "DOC-705",
      name: "AML_KYC_Compliance_Manual_Certified.pdf",
      category: "Compliance Documents",
      caseRef: "CASE-2026-045",
      uploaded: "2026-06-15",
      size: "5.2 MB",
      status: "Approved"
    }
  ];

  const INITIAL_NOTIFICATIONS = [
    {
      id: "NOTIF-01",
      title: "New Consultation Request",
      message: "Aether Dynamics LLC submitted a consultation request for Contract Review.",
      time: "10 mins ago",
      read: false,
      type: "consultation"
    },
    {
      id: "NOTIF-02",
      title: "Consultation Confirmed",
      message: "Consultation CONS-8921 with Nexus Global Holdings was confirmed for Nov 12.",
      time: "1 hour ago",
      read: false,
      type: "confirmation"
    },
    {
      id: "NOTIF-03",
      title: "Document Uploaded",
      message: "New draft agreement uploaded for CASE-2026-042.",
      time: "3 hours ago",
      read: true,
      type: "document"
    },
    {
      id: "NOTIF-04",
      title: "Case Status Updated",
      message: "CASE-2026-045 has been marked as Closed and certified.",
      time: "1 day ago",
      read: true,
      type: "case"
    }
  ];

  // Initialize storage if not existing
  function initLocalStorage() {
    if (!localStorage.getItem('legal_consultations')) {
      localStorage.setItem('legal_consultations', JSON.stringify(INITIAL_CONSULTATIONS));
    }
    if (!localStorage.getItem('legal_cases')) {
      localStorage.setItem('legal_cases', JSON.stringify(INITIAL_CASES));
    }
    if (!localStorage.getItem('legal_clients')) {
      localStorage.setItem('legal_clients', JSON.stringify(INITIAL_CLIENTS));
    }
    if (!localStorage.getItem('legal_documents')) {
      localStorage.setItem('legal_documents', JSON.stringify(INITIAL_DOCUMENTS));
    }
    if (!localStorage.getItem('legal_notifications')) {
      localStorage.setItem('legal_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    }
  }

  // ==========================================
  // PRELOADER (Stackly Legal & Consulting — strictly 2.0s lifecycle)
  // ==========================================
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    if (preloader.style.display === 'none') {
      revealVisibleElements();
      return;
    }

    let dismissed = false;
    const dismissPreloader = () => {
      if (dismissed) return;
      dismissed = true;
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
        if (typeof AOS !== 'undefined') {
          try {
            AOS.refresh();
          } catch (e) {}
        }
        // Sweep visibility immediately upon preloader exit
        revealVisibleElements();
      }, 400);
    };

    // Calculate elapsed time from the exact millisecond the preloader was parsed
    const startTime = window.__preloaderStart || Date.now();
    const elapsed = Date.now() - startTime;
    const remainingToFade = Math.max(0, 1600 - elapsed);
    const hardExitTime = Math.max(0, 2000 - elapsed);

    // Fade out at 1.6s
    setTimeout(dismissPreloader, remainingToFade);

    // Hard ceiling: guaranteed complete dismissal and visibility unblock at exactly 2.0s
    setTimeout(() => {
      dismissPreloader();
      preloader.style.display = 'none';
      revealVisibleElements();
    }, hardExitTime);
  }

  // Helper to reveal an element safely
  function revealAosElement(el) {
    if (!el) return;
    el.classList.add('aos-animate');
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.visibility = 'visible';
  }

  // Reveal all elements currently in or near viewport
  function revealVisibleElements() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= vh + 100 && rect.bottom >= -100) {
        revealAosElement(el);
      }
    });
  }

  // ==========================================
  // AOS (ANIMATE ON SCROLL) INITIALIZATION
  // ==========================================
  function initAOS() {
    // 1. Initialize AOS library if available
    if (typeof AOS !== 'undefined') {
      try {
        AOS.init({
          duration: 700,
          easing: 'ease-out-cubic',
          once: true,
          offset: 20,
          disableMutationObserver: false
        });
        AOS.refreshHard();
      } catch (err) {
        console.warn('AOS initialization note:', err);
      }
    }

    // 2. High-performance native IntersectionObserver
    // Guarantees all [data-aos] elements reveal smoothly on scroll
    if ('IntersectionObserver' in window) {
      const aosObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            revealAosElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '60px 0px 60px 0px',
        threshold: 0.02
      });

      document.querySelectorAll('[data-aos]').forEach(el => {
        aosObserver.observe(el);
      });
    }

    // 3. Check elements immediately and on scroll/resize
    revealVisibleElements();
    window.addEventListener('scroll', revealVisibleElements, { passive: true });
    window.addEventListener('resize', revealVisibleElements, { passive: true });

    // 4. Absolute Safety Sweep: Guarantees no text is ever stuck invisible
    setTimeout(() => {
      revealVisibleElements();
      if (typeof AOS !== 'undefined') {
        try { AOS.refresh(); } catch (e) {}
      }
    }, 600);

    setTimeout(() => {
      document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => {
        revealAosElement(el);
      });
    }, 1500);
  }

  // ==========================================
  // STICKY HEADER & ACTIVE NAV
  // ==========================================
  function initNavigation() {
    const header = document.querySelector('.site-header');
    if (header) {
      const handleScroll = () => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      };
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');

    if (hamburger && mobileNav) {
      const toggleMenu = () => {
        const isOpen = mobileNav.classList.contains('open');
        if (isOpen) {
          mobileNav.classList.remove('open');
          hamburger.classList.remove('is-active');
          if (mobileOverlay) mobileOverlay.classList.remove('visible');
          document.body.style.overflow = '';
        } else {
          mobileNav.classList.add('open');
          hamburger.classList.add('is-active');
          if (mobileOverlay) mobileOverlay.classList.add('visible');
          document.body.style.overflow = 'hidden';
        }
      };

      hamburger.addEventListener('click', toggleMenu);
      if (mobileOverlay) mobileOverlay.addEventListener('click', toggleMenu);

      // Close when clicking any mobile link
      mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileNav.classList.remove('open');
          hamburger.classList.remove('is-active');
          if (mobileOverlay) mobileOverlay.classList.remove('visible');
          document.body.style.overflow = '';
        });
      });
    }

    // Highlight Active Link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================
  function showToast(title, message, type = 'info', duration = 4000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconClass = 'fa-solid fa-circle-info';
    if (type === 'success') iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';
    if (type === 'warning') iconClass = 'fa-solid fa-triangle-exclamation';

    toast.innerHTML = `
      <div class="toast-icon"><i class="${iconClass}"></i></div>
      <div class="toast-body">
        <div class="toast-title">${escapeHTML(title)}</div>
        <div class="toast-message">${escapeHTML(message)}</div>
      </div>
      <button class="toast-close" aria-label="Close Notification"><i class="fa-solid fa-xmark"></i></button>
    `;

    const closeBtn = toast.querySelector('.toast-close');
    const dismiss = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => toast.remove(), 300);
    };

    closeBtn.addEventListener('click', dismiss);
    container.appendChild(toast);

    if (duration > 0) {
      setTimeout(dismiss, duration);
    }
  }

  // ==========================================
  // GLOBAL MODAL CONTROLLER
  // ==========================================
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function initModals() {
    // Backdrop clicks & close buttons
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal(modal.id);
        }
      });

      modal.querySelectorAll('.modal-close-btn, [data-dismiss="modal"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          closeModal(modal.id);
        });
      });
    });

    // Modal open buttons across pages
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = btn.getAttribute('data-open-modal');
        openModal(modalId);
      });
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
          closeModal(modal.id);
        });
      }
    });
  }

  // Helper Escape HTML
  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Check login state helper
  function getCurrentUser() {
    try {
      const user = localStorage.getItem('legal_current_user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      return null;
    }
  }

  // ==========================================
  // CONSULTATION BOOKING MODAL FORM VALIDATION + 404 REDIRECTION
  // ==========================================
  function initQuickBookingForm() {
    const form = document.getElementById('quickBookingForm');
    if (!form) return;

    let submittedOnce = false;

    const validateField = (id, condition, errorMsg) => {
      const field = document.getElementById(id);
      if (!field) return true;
      const group = field.closest('.form-group');
      let errEl = group ? group.querySelector('.form-error-msg') : null;
      if (!errEl && group) {
        errEl = document.createElement('div');
        errEl.className = 'form-error-msg';
        group.appendChild(errEl);
      }

      const val = field.value ? field.value.trim() : '';
      if (!condition(val)) {
        if (group) {
          group.classList.add('has-error');
          group.classList.remove('has-success');
        }
        if (errEl) {
          errEl.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="margin-right: 4px;"></i> ${errorMsg}`;
          errEl.style.display = 'block';
        }
        return false;
      } else {
        if (group) {
          group.classList.remove('has-error');
          group.classList.add('has-success');
        }
        if (errEl) {
          errEl.textContent = '';
          errEl.style.display = 'none';
        }
        return true;
      }
    };

    const runValidation = () => {
      const nameOk = validateField('bookName', val => val.length >= 3, 'Please enter your full legal or entity name (min 3 chars).');
      const emailOk = validateField('bookEmail', val => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val), 'Please enter a valid corporate email address.');
      const phoneOk = validateField('bookPhone', val => val.replace(/[\s\-\(\)\+]/g, '').length >= 8, 'Please enter a valid telephone number (min 8 digits).');
      const practiceOk = validateField('bookPracticeArea', val => !!val, 'Please choose a relevant legal or consulting area.');
      const dateOk = validateField('bookDate', val => !!val, 'Please select your preferred consultation date.');
      const timeOk = validateField('bookTime', val => !!val, 'Please select an appointment time slot.');

      return nameOk && emailOk && phoneOk && practiceOk && dateOk && timeOk;
    };

    ['bookName', 'bookEmail', 'bookPhone', 'bookPracticeArea', 'bookDate', 'bookTime'].forEach(fieldId => {
      const el = document.getElementById(fieldId);
      if (el) {
        el.addEventListener('blur', () => { if (submittedOnce || el.value.trim()) runValidation(); });
        el.addEventListener('input', () => { if (submittedOnce) runValidation(); });
        el.addEventListener('change', () => { if (submittedOnce) runValidation(); });
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submittedOnce = true;

      const isValid = runValidation();
      if (!isValid) {
        const firstError = form.querySelector('.has-error .form-control');
        if (firstError) firstError.focus();
        return;
      }

      // Valid: Save in local storage
      const nameVal = document.getElementById('bookName').value.trim();
      const emailVal = document.getElementById('bookEmail').value.trim();
      const phoneVal = document.getElementById('bookPhone').value.trim();
      const practiceVal = document.getElementById('bookPracticeArea').value;
      const dateVal = document.getElementById('bookDate').value;
      const timeVal = document.getElementById('bookTime').value;
      const notesVal = document.getElementById('bookNotes') ? document.getElementById('bookNotes').value.trim() : '';

      const newBooking = {
        id: `CONS-${Math.floor(1000 + Math.random() * 9000)}`,
        clientName: nameVal,
        email: emailVal,
        phone: phoneVal,
        service: practiceVal,
        practiceArea: practiceVal,
        date: dateVal,
        time: timeVal,
        status: "Confirmed",
        notes: notesVal || "Direct corporate consultation booking.",
        consultant: "Sarah Jenkins, Esq."
      };

      try {
        let list = JSON.parse(localStorage.getItem('legal_consultations') || '[]');
        list.unshift(newBooking);
        localStorage.setItem('legal_consultations', JSON.stringify(list));
      } catch (err) {}

      showToast('Consultation Details Verified', 'Appointment confirmed in simulation. Directing to portal brief...', 'success', 2000);
      closeModal('consultationModal');
      form.reset();

      setTimeout(() => {
        window.location.href = '404.html';
      }, 600);
    });
  }

  // ==========================================
  // UNIVERSAL NEWSLETTER FORM VALIDATION + 404 REDIRECTION
  // ==========================================
  function initNewsletterForms() {
    const forms = document.querySelectorAll('.newsletter-form');
    forms.forEach(form => {
      const emailInput = form.querySelector('.newsletter-email-input') || form.querySelector('input[type="email"]');
      let errorMsg = form.querySelector('.newsletter-error-msg');
      if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'newsletter-error-msg form-error-msg';
        errorMsg.style.cssText = 'color: #e53e3e; font-size: 0.8rem; margin-top: 8px; display: none; font-weight: 500; text-align: left;';
        form.appendChild(errorMsg);
      }

      if (emailInput) {
        emailInput.addEventListener('input', () => {
          emailInput.style.borderColor = '';
          emailInput.style.boxShadow = '';
          errorMsg.style.display = 'none';
        });
      }

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailVal = emailInput ? emailInput.value.trim() : '';

        if (!emailVal) {
          errorMsg.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 4px;"></i> Corporate email is required';
          errorMsg.style.display = 'block';
          if (emailInput) {
            emailInput.style.borderColor = '#e53e3e';
            emailInput.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.2)';
            emailInput.focus();
          }
          return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(emailVal)) {
          errorMsg.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 4px;"></i> Please provide a valid corporate email address';
          errorMsg.style.display = 'block';
          if (emailInput) {
            emailInput.style.borderColor = '#e53e3e';
            emailInput.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.2)';
            emailInput.focus();
          }
          return;
        }

        // Success: strict validation passed -> redirect to 404
        errorMsg.style.display = 'none';
        if (emailInput) {
          emailInput.value = '';
          emailInput.style.borderColor = '';
          emailInput.style.boxShadow = '';
        }

        showToast('Email Verified', 'Subscription registered. Directing to briefing brief...', 'success', 2000);
        setTimeout(() => {
          window.location.href = '404.html';
        }, 600);
      });
    });
  }

  // ==========================================
  // UNIVERSAL CONTENT 404 REDIRECTION
  // All links & buttons across pages go to 404
  // EXEMPTIONS: Navlinks, Footer, Login page, Signup page, Dashboards
  // ==========================================
  function initContent404Redirection() {
    const pagePath = (window.location.pathname || '').toLowerCase();
    const isExemptPage = pagePath.endsWith('login.html') || 
                         pagePath.endsWith('signup.html') || 
                         pagePath.endsWith('admindashboard.html') || 
                         pagePath.endsWith('clientdashboard.html') || 
                         pagePath.endsWith('404.html');

    if (isExemptPage) return;

    document.addEventListener('click', (e) => {
      const target = e.target.closest('a, button, [role="button"]');
      if (!target) return;

      // 1. EXEMPT: Navigation Bar & Mobile Off-canvas Drawer (navlinks)
      if (target.closest('.site-header') || target.closest('.navbar-container') || target.closest('.mobile-nav') || target.closest('.hamburger') || target.closest('.mobile-nav-overlay')) {
        return;
      }

      // 2. EXEMPT: Footer (footer links, social, map, policies)
      if (target.closest('.site-footer')) {
        return;
      }

      // 3. EXEMPT: Modal Triggers & Dismiss Buttons (allow opening modal to fill form)
      if (target.hasAttribute('data-open-modal') || target.hasAttribute('data-dismiss') || target.classList.contains('modal-close-btn') || target.closest('.modal-close-btn')) {
        return;
      }

      // 4. EXEMPT: Submit buttons inside forms (handled by form submit validation)
      if (target.type === 'submit' || target.closest('form')) {
        return;
      }

      // 5. EXEMPT: Password visibility toggles
      if (target.classList.contains('password-toggle-btn') || target.closest('.password-toggle-btn')) {
        return;
      }

      // 6. ALL OTHER links and buttons in page content redirect to 404 page
      e.preventDefault();
      e.stopPropagation();
      window.location.href = '404.html';
    });
  }

  // ==========================================
  // STRICT POPUP ALERT SUPPRESSION (Website-wide)
  // Ensures NO browser popup alerts (alert, confirm, prompt) appear
  // ==========================================
  window.alert = function (msg) {
    if (typeof showToast === 'function') {
      showToast('Notice', String(msg), 'info');
    } else {
      console.warn('Popup alert suppressed:', msg);
    }
  };
  window.confirm = function (msg) {
    console.warn('Popup confirm suppressed:', msg);
    return true;
  };
  window.prompt = function (msg, defaultVal) {
    console.warn('Popup prompt suppressed:', msg);
    return defaultVal || null;
  };

  // Expose global methods
  window.LegalApp = {
    showToast,
    openModal,
    closeModal,
    escapeHTML,
    getCurrentUser,
    initLocalStorage
  };

  // Run initializers on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    initLocalStorage();
    initPreloader();
    initAOS();
    initNavigation();
    initModals();
    initQuickBookingForm();
    initNewsletterForms();
    initContent404Redirection();
  });

})();
