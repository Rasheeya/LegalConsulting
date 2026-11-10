/**
 * LEGAL & CONSULTING — PRACTICE AREAS LOGIC (practice.js)
 * Real-time search, category pill filter, URL parameter handling, prefilled booking
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const searchInput = document.getElementById('practiceSearch');
  const pillBtns = document.querySelectorAll('.pill-btn');
  const cards = document.querySelectorAll('.practice-dir-card');
  const noResults = document.getElementById('noResultsMsg');

  let activeCategory = 'all';
  let searchQuery = '';

  function filterCards() {
    let visibleCount = 0;

    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      const textContent = card.textContent.toLowerCase();

      const matchesCat = (activeCategory === 'all' || category === activeCategory);
      const matchesSearch = !searchQuery || textContent.includes(searchQuery.toLowerCase());

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Search input event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      filterCards();
    });
  }

  // Pill click events
  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      filterCards();
    });
  });

  // Check URL query parameters (e.g. ?cat=corporate)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam) {
    const matchingPill = Array.from(pillBtns).find(b => b.getAttribute('data-category') === catParam);
    if (matchingPill) {
      pillBtns.forEach(b => b.classList.remove('active'));
      matchingPill.classList.add('active');
      activeCategory = catParam;
      filterCards();
    }
  }

  // Pre-fill Consultation Modal
  document.querySelectorAll('[data-practice-cta]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const practiceTitle = btn.getAttribute('data-practice-cta');
      const select = document.getElementById('bookPracticeArea');
      if (select && practiceTitle) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text.toLowerCase().includes(practiceTitle.toLowerCase()) ||
              select.options[i].value.toLowerCase().includes(practiceTitle.toLowerCase())) {
            select.selectedIndex = i;
            break;
          }
        }
      }
      if (window.LegalApp && window.LegalApp.openModal) {
        window.LegalApp.openModal('consultationModal');
      }
    });
  });

});
