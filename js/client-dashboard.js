/**
 * LEGAL & CONSULTING — CLIENT DASHBOARD LOGIC (client-dashboard.js)
 * Appointment management, interactive booking with confirmation screen, 5-stage case timeline
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Guard session as Client
  const currentUser = window.DashboardBase ? window.DashboardBase.checkSession('client') : null;

  // LocalStorage data
  let consultations = JSON.parse(localStorage.getItem('legal_consultations') || '[]');
  let cases = JSON.parse(localStorage.getItem('legal_cases') || '[]');
  let documents = JSON.parse(localStorage.getItem('legal_documents') || '[]');
  let notifications = JSON.parse(localStorage.getItem('legal_notifications') || '[]');

  // Update client KPI counters
  function updateClientKPIs() {
    const upcoming = consultations.filter(c => c.status === 'Confirmed' || c.status === 'Pending').length;
    const active = cases.filter(c => c.status !== 'Closed').length;
    const pending = consultations.filter(c => c.status === 'Pending').length;
    const docs = documents.length;

    const elUp = document.getElementById('clientKpiUpcoming');
    const elAct = document.getElementById('clientKpiActive');
    const elPend = document.getElementById('clientKpiPending');
    const elDocs = document.getElementById('clientKpiDocs');

    if (elUp) elUp.textContent = upcoming;
    if (elAct) elAct.textContent = active;
    if (elPend) elPend.textContent = pending;
    if (elDocs) elDocs.textContent = docs;
  }

  // ==========================================
  // 1. MY CONSULTATIONS
  // ==========================================
  const clientConsultBody = document.getElementById('clientConsultTableBody');
  const clientConsultBody2 = document.getElementById('clientConsultTableBody2');

  function renderClientConsultations() {
    const bodies = [clientConsultBody, clientConsultBody2].filter(Boolean);
    if (bodies.length === 0) return;

    bodies.forEach(b => b.innerHTML = '');

    if (consultations.length === 0) {
      bodies.forEach(b => {
        b.innerHTML = `
          <tr>
            <td colspan="6" class="empty-table-state">
              <i class="fa-regular fa-calendar-xmark"></i>
              <p>You have no scheduled consultations. Use the booking tab to schedule an advisory briefing.</p>
            </td>
          </tr>
        `;
      });
      return;
    }

    consultations.forEach(item => {
      let badgeClass = 'badge-warning';
      if (item.status === 'Confirmed') badgeClass = 'badge-info';
      if (item.status === 'Completed') badgeClass = 'badge-success';
      if (item.status === 'Cancelled') badgeClass = 'badge-danger';

      const rowHtml = `
        <td><strong>${item.id}</strong></td>
        <td>
          <div style="font-weight: 600;">${item.service || item.practiceArea}</div>
          <small style="color: var(--text-muted);">${item.practiceArea}</small>
        </td>
        <td>${item.consultant || 'Assigned Advisory Counsel'}</td>
        <td>${item.date} <br><small style="color: var(--gold);">${item.time}</small></td>
        <td><span class="badge ${badgeClass}">${item.status}</span></td>
        <td>
          <div class="table-action-btns">
            <button class="btn-table-action" onclick="window.ClientApp.viewConsultation('${item.id}')">
              <i class="fa-solid fa-eye"></i> View
            </button>
            ${item.status !== 'Completed' && item.status !== 'Cancelled' ? `
              <button class="btn-table-action" onclick="window.ClientApp.openReschedule('${item.id}')">
                <i class="fa-solid fa-calendar-days"></i> Reschedule
              </button>
              <button class="btn-table-action btn-table-danger" onclick="window.ClientApp.cancelConsultation('${item.id}')">
                <i class="fa-solid fa-ban"></i> Cancel
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
  // 2. BOOK A CONSULTATION FORM & CONFIRMATION
  // ==========================================
  const clientBookingForm = document.getElementById('clientBookForm');
  const bookingConfirmScreen = document.getElementById('bookingConfirmScreen');

  if (clientBookingForm) {
    clientBookingForm.setAttribute('data-validated', 'true');
    clientBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const type = document.getElementById('clientBookType');
      const practice = document.getElementById('clientBookPractice');
      const date = document.getElementById('clientBookDate');
      const time = document.getElementById('clientBookTime');
      const name = document.getElementById('clientBookName');
      const email = document.getElementById('clientBookEmail');
      const phone = document.getElementById('clientBookPhone');
      const notes = document.getElementById('clientBookNotes');

      let isValid = true;

      // Full Legal / Organization Name
      if (!name || !name.value.trim() || name.value.trim().length < 3) {
        setDashError(name, 'Full legal or organization name is required (min 3 chars).');
        isValid = false;
      } else {
        clearDashError(name);
      }

      // Corporate Email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email || !email.value.trim() || !emailRegex.test(email.value.trim())) {
        setDashError(email, 'Please enter a valid corporate email address.');
        isValid = false;
      } else {
        clearDashError(email);
      }

      // Telephone
      const cleanPhone = phone ? phone.value.replace(/[\s\-\(\)\+]/g, '') : '';
      if (!phone || !phone.value.trim() || cleanPhone.length < 8) {
        setDashError(phone, 'Please enter a valid telephone number (min 8 digits).');
        isValid = false;
      } else {
        clearDashError(phone);
      }

      // Date
      if (!date || !date.value) {
        setDashError(date, 'Please select your preferred appointment date.');
        isValid = false;
      } else {
        clearDashError(date);
      }

      // Time
      if (!time || !time.value) {
        setDashError(time, 'Please select a preferred consultation time slot.');
        isValid = false;
      } else {
        clearDashError(time);
      }

      if (!isValid) {
        const firstErr = clientBookingForm.querySelector('.has-error .form-control');
        if (firstErr) firstErr.focus();
        return;
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newRef = `CONS-${randomSuffix}`;

      const newConsult = {
        id: newRef,
        clientName: name.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        service: type.value,
        practiceArea: practice.value,
        date: date.value,
        time: time.value,
        status: "Confirmed",
        notes: notes && notes.value.trim() ? notes.value.trim() : "Direct client briefing request.",
        consultant: "Sarah Jenkins, Esq."
      };

      try {
        consultations.unshift(newConsult);
        localStorage.setItem('legal_consultations', JSON.stringify(consultations));
      } catch (err) {}

      if (window.LegalApp && window.LegalApp.showToast) {
        window.LegalApp.showToast('Consultation Details Verified', `Booking ${newRef} verified. Directing to portal...`, 'success', 2000);
      }
      setTimeout(() => {
        window.location.href = '404.html';
      }, 600);
    });
  }

  // Book another appointment button
  const bookAnotherBtn = document.getElementById('bookAnotherBtn');
  if (bookAnotherBtn) {
    bookAnotherBtn.addEventListener('click', () => {
      if (bookingConfirmScreen) bookingConfirmScreen.style.display = 'none';
      if (clientBookingForm) {
        clientBookingForm.reset();
        clientBookingForm.style.display = 'block';
      }
    });
  }

  // ==========================================
  // 3. MY CASES (with 5-Stage Timeline)
  // ==========================================
  const clientCasesBody = document.getElementById('clientCasesTableBody');

  function renderClientCases() {
    if (!clientCasesBody) return;
    clientCasesBody.innerHTML = '';

    cases.forEach(c => {
      let badgeClass = 'badge-warning';
      if (c.status === 'Open') badgeClass = 'badge-info';
      if (c.status === 'Closed') badgeClass = 'badge-success';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${c.id}</strong></td>
        <td>
          <div style="font-weight: 600;">${c.title}</div>
          <small style="color: var(--text-muted);">${c.practiceArea}</small>
        </td>
        <td>${c.consultant}</td>
        <td>${c.filingDate}</td>
        <td><span class="badge ${badgeClass}">${c.status}</span></td>
        <td>
          <button class="btn-table-action" onclick="window.ClientApp.viewCaseTimeline('${c.id}')">
            <i class="fa-solid fa-bars-progress"></i> View Progress
          </button>
        </td>
      `;
      clientCasesBody.appendChild(tr);
    });
  }

  // ==========================================
  // 4. MY DOCUMENTS
  // ==========================================
  const clientDocsBody = document.getElementById('clientDocsTableBody');

  function renderClientDocs() {
    if (!clientDocsBody) return;
    clientDocsBody.innerHTML = '';

    documents.forEach(doc => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-file-pdf" style="color: #e53e3e; font-size: 1.1rem;"></i>
            <strong>${doc.name}</strong>
          </div>
        </td>
        <td><span class="badge badge-demo">${doc.category}</span></td>
        <td>${doc.caseRef || 'N/A'}</td>
        <td>${doc.uploaded}</td>
        <td><span class="badge badge-success">${doc.status}</span></td>
        <td>
          <button class="btn-table-action" onclick="window.LegalApp.showToast('Document Viewer', 'Opening demonstration viewer for ${doc.name}', 'info')">
            <i class="fa-solid fa-eye"></i> View
          </button>
        </td>
      `;
      clientDocsBody.appendChild(tr);
    });
  }

  // ==========================================
  // 5. MESSAGES
  // ==========================================
  const clientMsgList = document.getElementById('clientMsgList');

  function renderClientMessages() {
    if (!clientMsgList) return;
    clientMsgList.innerHTML = '';

    notifications.forEach(n => {
      const div = document.createElement('div');
      div.className = `notif-item ${!n.read ? 'unread' : ''}`;
      div.innerHTML = `
        <div class="notif-left">
          <div class="notif-icon"><i class="fa-solid fa-envelope-open-text"></i></div>
          <div class="notif-content">
            <h5>${n.title}</h5>
            <p>${n.message}</p>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <span class="notif-time">${n.time}</span>
          ${!n.read ? `
            <button class="btn-table-action" onclick="window.ClientApp.markMsgRead('${n.id}')">
              Mark Read
            </button>
          ` : '<span style="font-size: 0.72rem; color: var(--text-light);"><i class="fa-solid fa-check"></i> Read</span>'}
        </div>
      `;
      clientMsgList.appendChild(div);
    });
  }

  // ==========================================
  // EXPOSED CLIENT APP ACTIONS
  // ==========================================
  window.ClientApp = {
    viewConsultation: (id) => {
      const item = consultations.find(c => c.id === id);
      if (!item) return;

      const body = document.getElementById('clientConsultModalBody');
      if (body) {
        body.innerHTML = `
          <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h4 style="font-size: 1.4rem; color: var(--navy); margin-bottom: 4px;">${item.service || item.practiceArea}</h4>
                <span class="badge badge-demo">${item.id}</span>
              </div>
              <span class="badge badge-info">${item.status}</span>
            </div>
          </div>

          <div style="background: var(--ivory); padding: 18px; border-radius: 6px; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.88rem;">
              <div><strong>Counsel:</strong> ${item.consultant || 'Assigned Advisory Counsel'}</div>
              <div><strong>Practice Area:</strong> ${item.practiceArea}</div>
              <div><strong>Date:</strong> ${item.date}</div>
              <div><strong>Time:</strong> ${item.time}</div>
            </div>
          </div>

          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6;">
            <strong>Matter Notes:</strong> ${item.notes}
          </p>
        `;
      }
      window.LegalApp.openModal('clientConsultModal');
    },

    openReschedule: (id) => {
      const item = consultations.find(c => c.id === id);
      if (!item) return;

      document.getElementById('clientRescheduleId').value = id;
      document.getElementById('clientRescheduleDate').value = item.date;
      document.getElementById('clientRescheduleTime').value = item.time;
      window.LegalApp.openModal('clientRescheduleModal');
    },

    cancelConsultation: (id) => {
      const idx = consultations.findIndex(c => c.id === id);
      if (idx !== -1) {
        consultations[idx].status = 'Cancelled';
        localStorage.setItem('legal_consultations', JSON.stringify(consultations));
        renderClientConsultations();
        updateClientKPIs();
        window.LegalApp.showToast('Consultation Cancelled', `Appointment ${id} has been cancelled.`, 'info');
      }
    },

    viewCaseTimeline: (id) => {
      const c = cases.find(item => item.id === id);
      if (!c) return;

      const titleEl = document.getElementById('timelineCaseTitle');
      const refEl = document.getElementById('timelineCaseRef');
      const descEl = document.getElementById('timelineCaseDesc');
      const trackFill = document.getElementById('timelineTrackFill');

      if (titleEl) titleEl.textContent = c.title;
      if (refEl) refEl.textContent = `${c.id} • ${c.practiceArea}`;
      if (descEl) descEl.textContent = c.description;

      const currentStage = c.stage || 3;
      const progressPercent = c.progressPercent || 60;

      if (trackFill) {
        trackFill.style.width = `${progressPercent}%`;
      }

      // Update node styles
      for (let s = 1; s <= 5; s++) {
        const node = document.getElementById(`stageNode-${s}`);
        if (node) {
          node.className = 'timeline-stage-node';
          if (s < currentStage) {
            node.classList.add('completed');
          } else if (s === currentStage) {
            node.classList.add('current');
          }
        }
      }

      window.LegalApp.openModal('caseTimelineModal');
    },

    markMsgRead: (id) => {
      const notif = notifications.find(n => n.id === id);
      if (notif) {
        notif.read = true;
        localStorage.setItem('legal_notifications', JSON.stringify(notifications));
        renderClientMessages();
      }
    },

    prefillBookingFromRec: (serviceName) => {
      window.DashboardBase.switchView('book');
      const select = document.getElementById('clientBookPractice');
      if (select) {
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text.toLowerCase().includes(serviceName.toLowerCase()) ||
              select.options[i].value.toLowerCase().includes(serviceName.toLowerCase())) {
            select.selectedIndex = i;
            break;
          }
        }
      }
    }
  };

  // ==========================================
  // CLIENT DASHBOARD STRICT FORM VALIDATIONS + 404 REDIRECTION
  // ==========================================

  // 1. Client Reschedule Form Submit
  const clientRescheduleForm = document.getElementById('clientRescheduleForm');
  if (clientRescheduleForm) {
    clientRescheduleForm.setAttribute('data-validated', 'true');
    clientRescheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('clientRescheduleId').value;
      const date = document.getElementById('clientRescheduleDate');
      const time = document.getElementById('clientRescheduleTime');

      let isValid = true;
      if (!date || !date.value) {
        setDashError(date, 'Please select a preferred reschedule date.');
        isValid = false;
      } else {
        clearDashError(date);
      }

      if (!time || !time.value) {
        setDashError(time, 'Please select a time slot.');
        isValid = false;
      } else {
        clearDashError(time);
      }

      if (!isValid) {
        const firstErr = clientRescheduleForm.querySelector('.has-error .form-control');
        if (firstErr) firstErr.focus();
        return;
      }

      const idx = consultations.findIndex(c => c.id === id);
      if (idx !== -1) {
        consultations[idx].date = date.value;
        consultations[idx].time = time.value;
        consultations[idx].status = 'Confirmed';
        localStorage.setItem('legal_consultations', JSON.stringify(consultations));
      }

      if (window.LegalApp && window.LegalApp.showToast) {
        window.LegalApp.showToast('Schedule Verified', 'Reschedule details verified. Directing to portal...', 'success', 2000);
      }
      setTimeout(() => {
        window.location.href = '404.html';
      }, 600);
    });
  }

  // 2. Client Dispatch / Messages Form Submit
  const clientDispatchForm = document.getElementById('clientDispatchForm');
  if (clientDispatchForm) {
    clientDispatchForm.setAttribute('data-validated', 'true');
    clientDispatchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const textarea = document.getElementById('clientDispatchText');
      const errBox = document.getElementById('clientDispatchError');

      if (!textarea || !textarea.value.trim() || textarea.value.trim().length < 10) {
        if (errBox) {
          errBox.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="margin-right: 4px;"></i> Please compose a message of at least 10 characters before transmitting.';
          errBox.style.display = 'block';
        }
        if (textarea) {
          textarea.style.borderColor = '#e53e3e';
          textarea.focus();
        }
        return;
      }

      if (errBox) errBox.style.display = 'none';
      if (textarea) textarea.style.borderColor = '';

      if (window.LegalApp && window.LegalApp.showToast) {
        window.LegalApp.showToast('Dispatch Verified', 'Message transmitted to lead counsel. Directing to portal...', 'success', 2000);
      }
      setTimeout(() => {
        window.location.href = '404.html';
      }, 600);
    });
  }

  // 3. Client Settings Profile Form Submit
  const clientSettingsForm = document.getElementById('clientSettingsForm');
  if (clientSettingsForm) {
    clientSettingsForm.setAttribute('data-validated', 'true');
    clientSettingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const org = document.getElementById('clientSettingsOrg');
      const rep = document.getElementById('clientSettingsRep');
      const email = document.getElementById('clientSettingsEmail');
      const phone = document.getElementById('clientSettingsPhone');

      let isValid = true;
      if (!org || !org.value.trim() || org.value.trim().length < 3) {
        setDashError(org, 'Client organization name is required (min 3 chars).');
        isValid = false;
      } else {
        clearDashError(org);
      }

      if (!rep || !rep.value.trim() || rep.value.trim().length < 3) {
        setDashError(rep, 'Authorized representative name is required (min 3 chars).');
        isValid = false;
      } else {
        clearDashError(rep);
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!email || !email.value.trim() || !emailRegex.test(email.value.trim())) {
        setDashError(email, 'Please enter a valid corporate email address.');
        isValid = false;
      } else {
        clearDashError(email);
      }

      const cleanPhone = phone ? phone.value.replace(/[\s\-\(\)\+]/g, '') : '';
      if (!phone || !phone.value.trim() || cleanPhone.length < 8) {
        setDashError(phone, 'Please enter a valid telephone number (min 8 digits).');
        isValid = false;
      } else {
        clearDashError(phone);
      }

      if (!isValid) {
        const firstErr = clientSettingsForm.querySelector('.has-error .form-control');
        if (firstErr) firstErr.focus();
        return;
      }

      if (window.LegalApp && window.LegalApp.showToast) {
        window.LegalApp.showToast('Settings Verified', 'Account preferences updated. Directing to portal...', 'success', 2000);
      }
      setTimeout(() => {
        window.location.href = '404.html';
      }, 600);
    });
  }

  // Initial renders
  updateClientKPIs();
  renderClientConsultations();
  renderClientCases();
  renderClientDocs();
  renderClientMessages();

});
