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
  // DASHBOARD 404 REDIRECTION FOR ALL NON-SIDEBAR BUTTONS, ICONS & LINKS
  // ==========================================
  function initDashboard404Redirection() {
    function handle404(e) {
      const target = e.target;
      if (!target) return;

      // EXCLUSION: Never touch the sidebar or its controls
      if (target.closest('.dash-sidebar')) return;
      if (target.closest('.dash-sidebar-toggle')) return;
      if (target.closest('.dash-sidebar-overlay')) return;

      // EXCLUSION: Normal form input interactions (typing, focus, text selection)
      if (target.matches('input:not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea')) {
        return;
      }

      // MATCH TARGET: Any button, link, icon, icon wrapper, badge, pill outside sidebar
      const isActionable = target.closest(
        'button, a, i, svg, [class*="fa-"], [class*="-icon"], .kpi-icon, .kpi-icon-box, ' +
        '.rec-service-icon, .service-admin-icon, .dash-date-badge, .dash-notif-btn, ' +
        '.notif-badge-dot, .dash-profile-pill, .dash-profile-avatar, .node-dot, ' +
        'input[type="submit"], input[type="button"], [role="button"], .btn, [class*="btn"], ' +
        '.modal-close-btn, [data-dismiss="modal"]'
      );

      if (isActionable) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        window.location.href = '404.html';
      }
    }

    // Capture phase on window and document to intercept before inline onclicks or bubbling
    window.addEventListener('click', handle404, true);
    document.addEventListener('click', handle404, true);

    // Form submit outside sidebar redirects to 404
    document.addEventListener('submit', (e) => {
      if (e.target.closest('.dash-sidebar')) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      window.location.href = '404.html';
    }, true);
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
