/**
 * LEGAL & CONSULTING — CONTACT PAGE LOGIC (contact.js)
 * Form validation, demo inquiry persistence, feedback banners, FAQ accordion
 */

(function () {
  'use strict';

  function initContact() {
    const form = document.getElementById('contactForm');
    const successBanner = document.getElementById('formSuccessBanner');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const phone = document.getElementById('contactPhone').value.trim();
      const inquiryType = document.getElementById('contactInquiryType').value;
      const practiceArea = document.getElementById('contactPracticeArea').value;
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();
      const contactMethod = form.querySelector('input[name="contactMethod"]:checked');

      let isValid = true;

      // Full Name
      if (!name || name.length < 3) {
        showError('contactName', 'Please provide your full legal name or organization name (min 3 chars).');
        isValid = false;
      } else {
        clearError('contactName');
      }

      // Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        showError('contactEmail', 'Please provide a valid corporate email address.');
        isValid = false;
      } else {
        clearError('contactEmail');
      }

      // Phone
      const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      if (!phone || !phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        showError('contactPhone', 'Please provide a valid telephone number with area code.');
        isValid = false;
      } else {
        clearError('contactPhone');
      }

      // Inquiry Type
      if (!inquiryType) {
        showError('contactInquiryType', 'Please select the inquiry classification.');
        isValid = false;
      } else {
        clearError('contactInquiryType');
      }

      // Practice Area
      if (!practiceArea) {
        showError('contactPracticeArea', 'Please choose the relevant practice area.');
        isValid = false;
      } else {
        clearError('contactPracticeArea');
      }

      // Subject
      if (!subject || subject.length < 5) {
        showError('contactSubject', 'Please enter a descriptive matter subject (min 5 characters).');
        isValid = false;
      } else {
        clearError('contactSubject');
      }

      // Message length
      if (!message || message.length < 15) {
        showError('contactMessage', 'Please provide a brief summary of at least 15 characters.');
        isValid = false;
      } else {
        clearError('contactMessage');
      }

      // Preferred contact method
      const methodError = document.getElementById('contactMethodError');
      if (!contactMethod) {
        if (methodError) methodError.textContent = 'Please choose your preferred communication channel.';
        isValid = false;
      } else {
        if (methodError) methodError.textContent = '';
      }

      if (!isValid) {
        // Scroll to first error
        const firstError = form.querySelector('.has-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Save inquiry in demo localStorage
      const newEnquiry = {
        id: `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        email,
        phone,
        inquiryType,
        practiceArea,
        subject,
        message,
        method: contactMethod.value,
        timestamp: new Date().toISOString()
      };

      try {
        let enquiries = JSON.parse(localStorage.getItem('legal_enquiries') || '[]');
        enquiries.unshift(newEnquiry);
        localStorage.setItem('legal_enquiries', JSON.stringify(enquiries));

        // Add to notifications
        let notifs = JSON.parse(localStorage.getItem('legal_notifications') || '[]');
        notifs.unshift({
          id: `NOTIF-${Date.now()}`,
          title: "New Advisory Inquiry Received",
          message: `${name} submitted an advisory brief regarding ${subject}.`,
          time: "Just now",
          read: false,
          type: "enquiry"
        });
        localStorage.setItem('legal_notifications', JSON.stringify(notifs));

        // Display success banner
        if (successBanner) {
          successBanner.style.display = 'block';
          successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        if (window.LegalApp && window.LegalApp.showToast) {
          window.LegalApp.showToast(
            'Inquiry Briefing Verified',
            `Your briefing (${newEnquiry.id}) has been validated. Directing to reference portal...`,
            'success',
            2000
          );
        }

        form.reset();

        setTimeout(() => {
          window.location.href = '404.html';
        }, 700);
      } catch (err) {
        console.error('Failed to save inquiry:', err);
      }
    });
  }

  function showError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const group = field.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      const err = group.querySelector('.form-error-msg');
      if (err) err.textContent = msg;
    }
  }

  function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const group = field.closest('.form-group');
    if (group) {
      group.classList.remove('has-error');
    }
  }

    // FAQ Accordion handled universally by js/main.js
    if (window.LegalApp && window.LegalApp.initFaqAccordion) {
      window.LegalApp.initFaqAccordion();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContact);
  } else {
    initContact();
  }
})();
