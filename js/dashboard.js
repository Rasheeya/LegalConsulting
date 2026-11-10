/**
 * LEGAL & CONSULTING — SHARED DASHBOARD LOGIC (dashboard.js)
 * View navigation, mobile offcanvas sidebar, session guard, logout, date header
 */

(function () {
  'use strict';

  // Check and setup session
  function checkSession(expectedRole) {
    let user = null;
    try {
      const stored = localStorage.getItem('legal_current_user');
      if (stored) user = JSON.parse(stored);
    } catch (e) {
      user = null;
    }

    if (!user) {
      // Default to appropriate demo user
      user = {
        name: expectedRole === 'admin' ? 'Sarah Jenkins, Esq. (Admin)' : 'Nexus Global Holdings (Client)',
        email: expectedRole === 'admin' ? 'admin@stackly.demo' : 'legal@nexusglobal.demo',
        role: expectedRole,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('legal_current_user', JSON.stringify(user));
    }

    // Update profile info on UI
    const nameEl = document.querySelector('.dash-profile-name');
    const roleEl = document.querySelector('.dash-profile-role');
    const avatarEl = document.querySelector('.dash-profile-avatar');

    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = user.role.toUpperCase() + ' PORTAL';
    if (avatarEl) {
      avatarEl.textContent = 'R';
    }

    return user;
  }

  // Set today's date in header
  function initHeaderDate() {
    const dateEl = document.getElementById('dashHeaderDate');
    if (dateEl) {
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      dateEl.textContent = new Date().toLocaleDateString('en-US', options);
    }
  }

  // Sidebar navigation and view switching
  function initViewSwitching() {
    const menuItems = document.querySelectorAll('.dash-menu-item[data-view]');
    const views = document.querySelectorAll('.dash-view');

    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = item.getAttribute('data-view');
        switchView(viewId);

        // On mobile, close sidebar automatically
        const sidebar = document.querySelector('.dash-sidebar');
        const overlay = document.querySelector('.dash-sidebar-overlay');
        if (sidebar && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
          if (overlay) overlay.classList.remove('visible');
          document.body.classList.remove('dash-sidebar-open');
        }
      });
    });

    // Check URL query param for default view (e.g. ?view=consultations)
    const urlParams = new URLSearchParams(window.location.search);
    const viewParam = urlParams.get('view');
    if (viewParam) {
      switchView(viewParam);
    }

    if (urlParams.get('sidebar') === 'open') {
      setTimeout(() => {
        const toggleBtn = document.querySelector('.dash-sidebar-toggle');
        if (toggleBtn) toggleBtn.click();
      }, 1800);
    }
  }

  function switchView(viewId) {
    const views = document.querySelectorAll('.dash-view');
    const menuItems = document.querySelectorAll('.dash-menu-item[data-view]');

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
      views.forEach(v => v.classList.remove('active'));
      targetView.classList.add('active');

      menuItems.forEach(item => {
        if (item.getAttribute('data-view') === viewId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
  }

  // Mobile off-canvas toggle
  function initMobileSidebar() {
    const toggleBtn = document.querySelector('.dash-sidebar-toggle');
    const closeBtn = document.querySelector('.dash-sidebar-close');
    const sidebar = document.querySelector('.dash-sidebar');
    const overlay = document.querySelector('.dash-sidebar-overlay');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        if (overlay) overlay.classList.add('visible');
        document.body.classList.add('dash-sidebar-open');
      });
    }

    const closeSidebar = () => {
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('visible');
      document.body.classList.remove('dash-sidebar-open');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
      }
    });
  }

  // Logout handler (NO popup alert/confirm)
  function initLogout() {
    document.querySelectorAll('.logout-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('legal_current_user');
        if (window.LegalApp && window.LegalApp.showToast) {
          window.LegalApp.showToast('Logged Out', 'Demo session ended. Returning to login...', 'info', 1200);
        }
        setTimeout(() => {
          window.location.href = 'Login.html';
        }, 500);
      });
    });
  }

  // ==========================================
  // DASHBOARD 404 REDIRECTION FOR ALL NON-SIDEBAR LINKS & BUTTONS
  // ==========================================
  function initDashboard404Redirection() {
    // Intercept clicks on any button or link outside sidebar menus
    document.addEventListener('click', (e) => {
      const actionable = e.target.closest('a, button, [role="button"], input[type="submit"], input[type="button"]');
      if (!actionable) return;

      // 1. EXEMPT: Sidebar menus (allow switching views)
      if (actionable.closest('.dash-sidebar-menu')) return;

      // 2. EXEMPT: Logout button in sidebar footer
      if (actionable.closest('.logout-btn')) return;

      // 3. EXEMPT: Mobile sidebar drawer toggle & close controls
      if (actionable.closest('.dash-sidebar-toggle') || actionable.closest('.dash-sidebar-close')) return;

      // 4. EXEMPT: Sidebar brand logo
      if (actionable.closest('.dash-brand') || actionable.closest('.dash-sidebar-header a')) return;

      // 5. EXEMPT: Modal close / dismiss buttons (allow closing modals)
      if (actionable.classList.contains('modal-close-btn') || actionable.closest('.modal-close-btn') || actionable.hasAttribute('data-dismiss')) return;

      // 6. EXEMPT: Form controls / submit buttons inside forms (handled by form submit validation!)
      if (actionable.type === 'submit' || actionable.closest('form')) {
        return;
      }

      // All other links and buttons inside the dashboard go to 404 page
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      window.location.href = '404.html';
    }, true);

    // Fallback form submit listener for any unhandled form: validate first, then redirect to 404
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.getAttribute('data-validated') === 'true') return;

      // If form fails standard HTML5 constraint validation, do not redirect
      if (form.checkValidity && !form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        form.reportValidity();
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      if (window.LegalApp && window.LegalApp.showToast) {
        window.LegalApp.showToast('Validation Verified', 'Details validated. Directing to portal...', 'success', 1800);
      }
      setTimeout(() => {
        window.location.href = '404.html';
      }, 500);
    }, false);
  }

  // Animated KPI numbers
  function animateKpis() {
    document.querySelectorAll('.kpi-number[data-val]').forEach(el => {
      const target = parseInt(el.getAttribute('data-val'), 10);
      if (isNaN(target)) return;

      let cur = 0;
      const step = Math.max(1, Math.floor(target / 25));
      const interval = setInterval(() => {
        cur += step;
        if (cur >= target) {
          el.textContent = target.toLocaleString();
          clearInterval(interval);
        } else {
          el.textContent = cur.toLocaleString();
        }
      }, 30);
    });
  }

  // Expose Dashboard utilities
  window.DashboardBase = {
    checkSession,
    switchView,
    animateKpis
  };

  document.addEventListener('DOMContentLoaded', () => {
    initHeaderDate();
    initViewSwitching();
    initMobileSidebar();
    initLogout();
    animateKpis();
    initDashboard404Redirection();
  });

})();
