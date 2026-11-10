/**
 * LEGAL & CONSULTING — ADMIN DASHBOARD LOGIC (admin-dashboard.js)
 * Full CRUD, consultation manager, case tracking, documents upload demo, SVG analytics charts
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Guard session as Admin
  if (window.DashboardBase) {
    window.DashboardBase.checkSession('admin');
  }

  // ==========================================
  // STATE MANAGEMENT (from localStorage)
  // ==========================================
  let consultations = JSON.parse(localStorage.getItem('legal_consultations') || '[]');
  let cases = JSON.parse(localStorage.getItem('legal_cases') || '[]');
  let clients = JSON.parse(localStorage.getItem('legal_clients') || '[]');
  let documents = JSON.parse(localStorage.getItem('legal_documents') || '[]');
  let notifications = JSON.parse(localStorage.getItem('legal_notifications') || '[]');

  // ==========================================
  // REFRESH KPI COUNTERS
  // ==========================================
  function updateKPIs() {
    const totalClients = clients.length;
    const activeCases = cases.filter(c => c.status !== 'Closed').length;
    const pendingConsultations = consultations.filter(c => c.status === 'Pending').length;
    const completedConsultations = consultations.filter(c => c.status === 'Completed').length;

    const elClients = document.getElementById('kpiTotalClients');
    const elCases = document.getElementById('kpiActiveCases');
    const elPending = document.getElementById('kpiPendingConsultations');
    const elCompleted = document.getElementById('kpiCompletedConsultations');

    if (elClients) elClients.textContent = totalClients;
    if (elCases) elCases.textContent = activeCases;
    if (elPending) elPending.textContent = pendingConsultations;
    if (elCompleted) elCompleted.textContent = completedConsultations;
  }

  // ==========================================
  // 1. RECENT CONSULTATIONS TABLE & MANAGEMENT
  // ==========================================
  const consultTableBody = document.getElementById('consultationsTableBody');
  const consultTableBody2 = document.getElementById('consultationsTableBody2');
  const consultFilterStatus = document.getElementById('consultStatusFilter');
  const consultSearchInput = document.getElementById('consultSearchInput');

  function renderConsultations() {
    const bodies = [consultTableBody, consultTableBody2].filter(Boolean);
    if (bodies.length === 0) return;

    bodies.forEach(b => b.innerHTML = '');

    const filterStatus = consultFilterStatus ? consultFilterStatus.value : 'all';
    const searchQuery = consultSearchInput ? consultSearchInput.value.toLowerCase().trim() : '';

    const filtered = consultations.filter(item => {
      const matchStatus = (filterStatus === 'all' || item.status === filterStatus);
      const matchSearch = (!searchQuery || 
        item.id.toLowerCase().includes(searchQuery) ||
        item.clientName.toLowerCase().includes(searchQuery) ||
        item.practiceArea.toLowerCase().includes(searchQuery)
      );
      return matchStatus && matchSearch;
    });

    if (filtered.length === 0) {
      bodies.forEach(b => {
        b.innerHTML = `
          <tr>
            <td colspan="7" class="empty-table-state">
              <i class="fa-solid fa-folder-open"></i>
              <p>No consultations found matching your current filter.</p>
            </td>
          </tr>
        `;
      });
      return;
    }

    filtered.forEach(item => {
      let badgeClass = 'badge-warning';
      if (item.status === 'Confirmed') badgeClass = 'badge-info';
      if (item.status === 'Completed') badgeClass = 'badge-success';
      if (item.status === 'Cancelled') badgeClass = 'badge-danger';

      const rowHtml = `
        <td><strong>${item.id}</strong></td>
        <td>
          <div style="font-weight: 600;">${item.clientName}</div>
          <small style="color: var(--text-muted);">${item.email}</small>
        </td>
        <td>${item.service || item.practiceArea}</td>
        <td>${item.date}</td>
        <td>${item.time}</td>
        <td><span class="badge ${badgeClass}">${item.status}</span></td>
        <td>
          <div class="table-action-btns">
            <button class="btn-table-action" onclick="window.AdminApp.viewConsultation('${item.id}')" title="View Details">
              <i class="fa-solid fa-eye"></i> Details
            </button>
            ${item.status === 'Pending' ? `
              <button class="btn-table-action" style="color: var(--status-completed);" onclick="window.AdminApp.updateConsultStatus('${item.id}', 'Confirmed')" title="Confirm">
                <i class="fa-solid fa-check"></i>
              </button>
            ` : ''}
            ${item.status !== 'Completed' && item.status !== 'Cancelled' ? `
              <button class="btn-table-action" onclick="window.AdminApp.openRescheduleModal('${item.id}')" title="Reschedule">
                <i class="fa-regular fa-clock"></i>
              </button>
              <button class="btn-table-action btn-table-danger" onclick="window.AdminApp.updateConsultStatus('${item.id}', 'Cancelled')" title="Cancel">
                <i class="fa-solid fa-ban"></i>
              </button>
            ` : ''}
          </div>
        </td>
      `;

      bodies.forEach(b => {
        const tr = document.createElement('tr');
        tr.innerHTML = rowHtml;
        b.appendChild(tr);
      });
    });
  }

  if (consultFilterStatus) consultFilterStatus.addEventListener('change', renderConsultations);
  if (consultSearchInput) consultSearchInput.addEventListener('input', renderConsultations);

  // ==========================================
  // 2. CASE MANAGEMENT
  // ==========================================
  const casesTableBody = document.getElementById('casesTableBody');
  const caseStatusFilter = document.getElementById('caseStatusFilter');

  function renderCases() {
    if (!casesTableBody) return;
    casesTableBody.innerHTML = '';

    const filterStatus = caseStatusFilter ? caseStatusFilter.value : 'all';
    const filtered = cases.filter(c => filterStatus === 'all' || c.status === filterStatus);

    if (filtered.length === 0) {
      casesTableBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-table-state">
            <i class="fa-solid fa-scale-balanced"></i>
            <p>No demo cases found.</p>
          </td>
        </tr>
      `;
      return;
    }

    filtered.forEach(c => {
      let badgeClass = 'badge-warning';
      if (c.status === 'Open') badgeClass = 'badge-info';
      if (c.status === 'In Progress') badgeClass = 'badge-warning';
      if (c.status === 'Under Review') badgeClass = 'badge-info';
      if (c.status === 'Closed') badgeClass = 'badge-success';
      if (c.status === 'On Hold') badgeClass = 'badge-danger';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${c.id}</strong></td>
        <td>
          <div style="font-weight: 600;">${c.title}</div>
          <small style="color: var(--text-muted);">${c.client}</small>
        </td>
        <td>${c.practiceArea}</td>
        <td>${c.consultant}</td>
        <td>${c.filingDate}</td>
        <td><span class="badge ${badgeClass}">${c.status}</span></td>
        <td>
          <button class="btn-table-action" onclick="window.AdminApp.viewCase('${c.id}')">
            <i class="fa-solid fa-folder-open"></i> View Case
          </button>
        </td>
      `;
      casesTableBody.appendChild(tr);
    });
  }

  if (caseStatusFilter) caseStatusFilter.addEventListener('change', renderCases);

  // ==========================================
  // 3. CLIENT MANAGEMENT
  // ==========================================
  const clientsTableBody = document.getElementById('clientsTableBody');

  function renderClients() {
    if (!clientsTableBody) return;
    clientsTableBody.innerHTML = '';

    clients.forEach(cl => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${cl.id}</strong></td>
        <td>
          <div style="font-weight: 600;">${cl.name}</div>
          <small style="color: var(--text-muted);">${cl.category}</small>
        </td>
        <td>${cl.email}</td>
        <td>${cl.phone || '+1 (555) 234-8901'}</td>
        <td><strong>${cl.consultations || 1}</strong> sessions</td>
        <td>${cl.registered || '2026-01-15'}</td>
        <td>
          <button class="btn-table-action" onclick="window.AdminApp.viewClient('${cl.id}')">
            <i class="fa-solid fa-id-card"></i> Profile
          </button>
        </td>
      `;
      clientsTableBody.appendChild(tr);
    });
  }

  // ==========================================
  // 4. DOCUMENT MANAGEMENT
  // ==========================================
  const docsTableBody = document.getElementById('docsTableBody');

  function renderDocuments() {
    if (!docsTableBody) return;
    docsTableBody.innerHTML = '';

    documents.forEach(doc => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${doc.id}</strong></td>
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-file-pdf" style="color: #e53e3e; font-size: 1.1rem;"></i>
            <span>${doc.name}</span>
          </div>
        </td>
        <td><span class="badge badge-demo">${doc.category}</span></td>
        <td>${doc.caseRef || 'N/A'}</td>
        <td>${doc.uploaded}</td>
        <td><span class="badge badge-success">${doc.status}</span></td>
        <td>
          <button class="btn-table-action" onclick="window.LegalApp.showToast('Demo Document', 'Displaying sample preview of ${doc.name}', 'info')">
            <i class="fa-solid fa-download"></i> View
          </button>
        </td>
      `;
      docsTableBody.appendChild(tr);
    });
  }

  // Mock Upload Handler
  const dropzone = document.getElementById('adminUploadZone');
  const fileInput = document.getElementById('adminDocFileInput');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        const file = e.target.files[0];
        const newDoc = {
          id: `DOC-${Math.floor(710 + Math.random() * 200)}`,
          name: file.name,
          category: 'Contracts',
          caseRef: 'CASE-2026-041',
          uploaded: new Date().toISOString().split('T')[0],
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          status: 'Pending Review'
        };

        documents.unshift(newDoc);
        localStorage.setItem('legal_documents', JSON.stringify(documents));
        renderDocuments();

        if (window.LegalApp && window.LegalApp.showToast) {
          window.LegalApp.showToast('Document Uploaded', `${file.name} saved in simulated records.`, 'success');
        }
      }
    });
  }

  // ==========================================
  // 5. NOTIFICATIONS
  // ==========================================
  const notifContainer = document.getElementById('adminNotifList');

  function renderNotifications() {
    if (!notifContainer) return;
    notifContainer.innerHTML = '';

    const unreadCount = notifications.filter(n => !n.read).length;
    const badgeDot = document.getElementById('adminNotifDot');
    if (badgeDot) badgeDot.style.display = unreadCount > 0 ? 'block' : 'none';

    notifications.forEach(n => {
      const div = document.createElement('div');
      div.className = `notif-item ${!n.read ? 'unread' : ''}`;
      div.innerHTML = `
        <div class="notif-left">
          <div class="notif-icon"><i class="fa-solid fa-bell"></i></div>
          <div class="notif-content">
            <h5>${n.title}</h5>
            <p>${n.message}</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 14px;">
          <span class="notif-time">${n.time}</span>
          ${!n.read ? `
            <button class="btn-table-action" onclick="window.AdminApp.markNotifRead('${n.id}')">
              Mark Read
            </button>
          ` : '<span style="font-size: 0.72rem; color: var(--text-light);"><i class="fa-solid fa-check-double"></i> Read</span>'}
        </div>
      `;
      notifContainer.appendChild(div);
    });
  }

  // Mark all read button
  const markAllBtn = document.getElementById('markAllNotifsBtn');
  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      notifications.forEach(n => n.read = true);
      localStorage.setItem('legal_notifications', JSON.stringify(notifications));
      renderNotifications();
      if (window.LegalApp && window.LegalApp.showToast) {
        window.LegalApp.showToast('Notifications Updated', 'All notifications marked as read.', 'info');
      }
    });
  }

  // ==========================================
  // 6. ANALYTICS CHARTS (Interactive SVG)
  // ==========================================
  const periodData = {
    '7D': {
      bars: [12, 18, 14, 22, 28, 20, 26],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      total: 140
    },
    '30D': {
      bars: [35, 48, 52, 60],
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      total: 195
    },
    '3M': {
      bars: [120, 145, 175],
      labels: ['September', 'October', 'November'],
      total: 440
    },
    '1Y': {
      bars: [80, 95, 110, 105, 130, 125, 140, 160, 155, 170, 180, 195],
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      total: 1645
    }
  };

  function renderBarChart(period = '30D') {
    const container = document.getElementById('consultationsChartSvg');
    if (!container) return;

    const data = periodData[period];
    const maxVal = Math.max(...data.bars);
    const height = 180;
    const width = 500;
    const barWidth = Math.min(40, (width / data.bars.length) * 0.6);
    const spacing = width / data.bars.length;

    let svgHtml = `<svg viewBox="0 0 ${width} 220" preserveAspectRatio="none">`;

    // Horizontal grid lines
    for (let i = 0; i <= 3; i++) {
      const y = height - (i * (height / 3));
      svgHtml += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="rgba(20,43,59,0.08)" stroke-width="1" stroke-dasharray="4" />`;
    }

    // Bars
    data.bars.forEach((val, idx) => {
      const barH = (val / maxVal) * (height - 20);
      const x = (idx * spacing) + (spacing - barWidth) / 2;
      const y = height - barH;

      svgHtml += `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${barH}" fill="url(#goldGrad)" rx="3">
          <title>${data.labels[idx]}: ${val} Consultations</title>
        </rect>
        <text x="${x + barWidth / 2}" y="205" fill="#5D6C78" font-size="11" text-anchor="middle" font-family="Poppins">${data.labels[idx]}</text>
        <text x="${x + barWidth / 2}" y="${y - 6}" fill="#142B3B" font-size="10" font-weight="600" text-anchor="middle" font-family="Poppins">${val}</text>
      `;
    });

    svgHtml += `
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#B08D57" />
          <stop offset="100%" stop-color="#8a6c3d" />
        </linearGradient>
      </defs>
    </svg>`;

    container.innerHTML = svgHtml;
  }

  // Bind period buttons
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderBarChart(btn.getAttribute('data-period'));
    });
  });

  // ==========================================
  // 7. EXPOSED ADMIN APP ACTIONS
  // ==========================================
  window.AdminApp = {
    viewConsultation: (id) => {
      const item = consultations.find(c => c.id === id);
      if (!item) return;

      const body = document.getElementById('consultModalBody');
      if (body) {
        body.innerHTML = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <div>
              <h4 style="font-size: 1.4rem; color: var(--navy); margin-bottom: 4px;">${item.clientName}</h4>
              <span class="badge badge-demo">${item.id}</span>
            </div>
            <div>
              <span class="badge ${item.status === 'Confirmed' ? 'badge-info' : item.status === 'Completed' ? 'badge-success' : 'badge-warning'}">
                ${item.status}
              </span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
            <div><strong>Practice Domain:</strong> ${item.practiceArea}</div>
            <div><strong>Consultant:</strong> ${item.consultant || 'Assigned Advisory Counsel'}</div>
            <div><strong>Appointment Date:</strong> ${item.date}</div>
            <div><strong>Time Slot:</strong> ${item.time}</div>
            <div><strong>Corporate Email:</strong> ${item.email}</div>
            <div><strong>Direct Contact:</strong> ${item.phone}</div>
          </div>

          <div style="background: var(--ivory); padding: 16px; border-radius: 6px; margin-bottom: 20px;">
            <strong>Matter Brief Notes:</strong>
            <p style="margin-top: 6px; font-size: 0.88rem; color: var(--text-dark);">${item.notes}</p>
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            ${item.status === 'Pending' ? `
              <button class="btn btn-primary btn-sm" onclick="window.AdminApp.updateConsultStatus('${item.id}', 'Confirmed'); window.LegalApp.closeModal('consultDetailModal');">
                Confirm Appointment
              </button>
            ` : ''}
            ${item.status === 'Confirmed' ? `
              <button class="btn btn-primary btn-sm" onclick="window.AdminApp.updateConsultStatus('${item.id}', 'Completed'); window.LegalApp.closeModal('consultDetailModal');">
                Mark Completed
              </button>
            ` : ''}
          </div>
        `;
      }
      window.LegalApp.openModal('consultDetailModal');
    },

    updateConsultStatus: (id, newStatus) => {
      const idx = consultations.findIndex(c => c.id === id);
      if (idx !== -1) {
        consultations[idx].status = newStatus;
        localStorage.setItem('legal_consultations', JSON.stringify(consultations));
        renderConsultations();
        updateKPIs();
        window.LegalApp.showToast('Consultation Updated', `Consultation ${id} marked as ${newStatus}.`, 'success');
      }
    },

    openRescheduleModal: (id) => {
      const item = consultations.find(c => c.id === id);
      if (!item) return;

      document.getElementById('rescheduleId').value = id;
      document.getElementById('rescheduleDate').value = item.date;
      document.getElementById('rescheduleTime').value = item.time;
      window.LegalApp.openModal('rescheduleModal');
    },

    viewCase: (id) => {
      const c = cases.find(item => item.id === id);
      if (!c) return;

      const body = document.getElementById('caseModalBody');
      if (body) {
        body.innerHTML = `
          <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h4 style="font-size: 1.4rem; color: var(--navy); margin-bottom: 4px;">${c.title}</h4>
                <span class="badge badge-demo">${c.id}</span>
              </div>
              <span class="badge badge-info">${c.status}</span>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
            <div><strong>Client:</strong> ${c.client}</div>
            <div><strong>Practice Domain:</strong> ${c.practiceArea}</div>
            <div><strong>Assigned Counsel:</strong> ${c.consultant}</div>
            <div><strong>Filing Date:</strong> ${c.filingDate}</div>
          </div>

          <p style="background: var(--ivory); padding: 14px; border-radius: 6px; font-size: 0.9rem; line-height: 1.6;">
            <strong>Overview:</strong> ${c.description}
          </p>

          <div style="margin-top: 20px;">
            <label class="form-label">Update Case Status:</label>
            <div style="display: flex; gap: 10px;">
              <select id="updateCaseStatusSelect" class="form-control">
                <option value="Open" ${c.status === 'Open' ? 'selected' : ''}>Open</option>
                <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Under Review" ${c.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
                <option value="On Hold" ${c.status === 'On Hold' ? 'selected' : ''}>On Hold</option>
                <option value="Closed" ${c.status === 'Closed' ? 'selected' : ''}>Closed</option>
              </select>
              <button class="btn btn-primary btn-sm" onclick="window.AdminApp.saveCaseStatus('${c.id}')">
                Save Status
              </button>
            </div>
          </div>
        `;
      }
      window.LegalApp.openModal('caseDetailModal');
    },

    saveCaseStatus: (id) => {
      const select = document.getElementById('updateCaseStatusSelect');
      if (!select) return;
      const newStatus = select.value;

      const idx = cases.findIndex(c => c.id === id);
      if (idx !== -1) {
        cases[idx].status = newStatus;
        localStorage.setItem('legal_cases', JSON.stringify(cases));
        renderCases();
        updateKPIs();
        window.LegalApp.closeModal('caseDetailModal');
        window.LegalApp.showToast('Case Updated', `Case ${id} status updated to ${newStatus}.`, 'success');
      }
    },

    viewClient: (id) => {
      const cl = clients.find(c => c.id === id);
      if (!cl) return;

      const body = document.getElementById('clientModalBody');
      if (body) {
        body.innerHTML = `
          <div style="text-align: center; margin-bottom: 24px;">
            <div class="dash-profile-avatar" style="width: 60px; height: 60px; font-size: 1.4rem; margin: 0 auto 12px;">
              ${cl.name.substring(0, 2).toUpperCase()}
            </div>
            <h4 style="font-size: 1.5rem; color: var(--navy); margin-bottom: 4px;">${cl.name}</h4>
            <span class="badge badge-gold">${cl.category}</span>
          </div>

          <div style="background: var(--ivory); padding: 18px; border-radius: 6px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <strong>Client ID:</strong> <span>${cl.id}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <strong>Email:</strong> <span>${cl.email}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <strong>Telephone:</strong> <span>${cl.phone || '+1 (555) 234-8901'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <strong>Total Consultations:</strong> <span>${cl.consultations || 1}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <strong>First Retained:</strong> <span>${cl.registered || '2026-01-15'}</span>
            </div>
          </div>
        `;
      }
      window.LegalApp.openModal('clientDetailModal');
    },

    markNotifRead: (id) => {
      const notif = notifications.find(n => n.id === id);
      if (notif) {
        notif.read = true;
        localStorage.setItem('legal_notifications', JSON.stringify(notifications));
        renderNotifications();
      }
    }
  };

  // ==========================================
  // DASHBOARD ERROR HELPERS (Inline DOM Only - NO Popup Alerts)
  // ==========================================
  function setDashError(field, msg) {
    if (!field) return;
    const group = field.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      group.classList.remove('has-success');
      let err = group.querySelector('.form-error-msg');
      if (!err) {
        err = document.createElement('div');
        err.className = 'form-error-msg';
        group.appendChild(err);
      }
      err.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="margin-right: 4px;"></i> ${msg}`;
      err.style.display = 'block';
    }
  }

  function clearDashError(field) {
    if (!field) return;
    const group = field.closest('.form-group');
    if (group) {
      group.classList.remove('has-error');
      group.classList.add('has-success');
      const err = group.querySelector('.form-error-msg');
      if (err) {
        err.textContent = '';
        err.style.display = 'none';
      }
    }
  }

  // ==========================================
  // STRICT FORM VALIDATIONS + 404 REDIRECTION
  // ==========================================

  // 1. Admin Settings Form
  const adminSettingsForm = document.getElementById('adminSettingsForm');
  if (adminSettingsForm) {
    adminSettingsForm.setAttribute('data-validated', 'true');
    adminSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('adminSettingsName');
      const emailInput = document.getElementById('adminSettingsEmail');
      const titleInput = document.getElementById('adminSettingsTitle');

      let isValid = true;

      // Validate Name
      if (!nameInput || !nameInput.value.trim() || nameInput.value.trim().length < 3) {
        setDashError(nameInput, 'Full legal name is required (min 3 characters).');
        isValid = false;
      } else {
        clearDashError(nameInput);
      }

      // Validate Email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailInput || !emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
        setDashError(emailInput, 'Please provide a valid corporate email address.');
        isValid = false;
      } else {
        clearDashError(emailInput);
      }

      // Validate Title
      if (!titleInput || !titleInput.value.trim() || titleInput.value.trim().length < 3) {
        setDashError(titleInput, 'Primary practice title is required (min 3 characters).');
        isValid = false;
      } else {
        clearDashError(titleInput);
      }

      if (!isValid) {
        const firstErr = adminSettingsForm.querySelector('.has-error .form-control');
        if (firstErr) firstErr.focus();
        return;
      }

      if (window.LegalApp && window.LegalApp.showToast) {
        window.LegalApp.showToast('Profile Validated', 'Administrator preferences verified. Directing to portal...', 'success', 2000);
      }
      setTimeout(() => {
        window.location.href = '404.html';
      }, 600);
    });
  }

  // 2. Reschedule Form Submit
  const rescheduleForm = document.getElementById('rescheduleForm');
  if (rescheduleForm) {
    rescheduleForm.setAttribute('data-validated', 'true');
    rescheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('rescheduleId').value;
      const dateInput = document.getElementById('rescheduleDate');
      const timeSelect = document.getElementById('rescheduleTime');

      let isValid = true;
      if (!dateInput || !dateInput.value) {
        setDashError(dateInput, 'Please select a new appointment date.');
        isValid = false;
      } else {
        clearDashError(dateInput);
      }

      if (!timeSelect || !timeSelect.value) {
        setDashError(timeSelect, 'Please select an appointment time slot.');
        isValid = false;
      } else {
        clearDashError(timeSelect);
      }

      if (!isValid) {
        const firstErr = rescheduleForm.querySelector('.has-error .form-control');
        if (firstErr) firstErr.focus();
        return;
      }

      const idx = consultations.findIndex(c => c.id === id);
      if (idx !== -1) {
        consultations[idx].date = dateInput.value;
        consultations[idx].time = timeSelect.value;
        consultations[idx].status = 'Confirmed';
        localStorage.setItem('legal_consultations', JSON.stringify(consultations));
      }

      if (window.LegalApp && window.LegalApp.showToast) {
        window.LegalApp.showToast('Schedule Validated', 'Reschedule details verified. Directing to portal...', 'success', 2000);
      }
      setTimeout(() => {
        window.location.href = '404.html';
      }, 600);
    });
  }

  // 3. Add Practice Service Form
  const addServiceForm = document.getElementById('adminAddServiceForm');
  if (addServiceForm) {
    addServiceForm.setAttribute('data-validated', 'true');
    addServiceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const titleInput = document.getElementById('newServiceTitle');
      const categorySelect = document.getElementById('newServiceCategory');
      const overviewInput = document.getElementById('newServiceOverview');

      let isValid = true;
      if (!titleInput || !titleInput.value.trim() || titleInput.value.trim().length < 3) {
        setDashError(titleInput, 'Service domain title is required (min 3 characters).');
        isValid = false;
      } else {
        clearDashError(titleInput);
      }

      if (!categorySelect || !categorySelect.value) {
        setDashError(categorySelect, 'Please choose a category classification.');
        isValid = false;
      } else {
        clearDashError(categorySelect);
      }

      if (!overviewInput || !overviewInput.value.trim() || overviewInput.value.trim().length < 10) {
        setDashError(overviewInput, 'Please provide an overview of at least 10 characters.');
        isValid = false;
      } else {
        clearDashError(overviewInput);
      }

      if (!isValid) {
        const firstErr = addServiceForm.querySelector('.has-error .form-control');
        if (firstErr) firstErr.focus();
        return;
      }

      if (window.LegalApp && window.LegalApp.showToast) {
        window.LegalApp.showToast('Practice Validated', 'Practice domain verified. Directing to registry...', 'success', 2000);
      }
      setTimeout(() => {
        window.location.href = '404.html';
      }, 600);
    });
  }

  // Initial Renders
  updateKPIs();
  renderConsultations();
  renderCases();
  renderClients();
  renderDocuments();
  renderNotifications();
  renderBarChart('30D');

});
