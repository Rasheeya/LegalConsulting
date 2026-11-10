/**
 * LEGAL & CONSULTING — AUTHENTICATION LOGIC (auth.js)
 * Strict form validation for Login & Signup pages, real-time validation feedback,
 * role switching, password toggles, and safe toast-driven redirection (NO popup alerts).
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ==========================================
  // PASSWORD TOGGLE (Show / Hide)
  // ==========================================
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const input = btn.closest('.password-input-wrap').querySelector('input');
      const icon = btn.querySelector('i');
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });

  // ==========================================
  // ROLE SWITCHER (Admin / Client)
  // ==========================================
  let selectedRole = 'admin';
  const roleButtons = document.querySelectorAll('.role-toggle-btn');
  const roleInput = document.getElementById('authRoleInput');

  // Check initial active role
  const activeRoleBtn = document.querySelector('.role-toggle-btn.active');
  if (activeRoleBtn) {
    selectedRole = activeRoleBtn.getAttribute('data-role') || 'admin';
    if (roleInput) roleInput.value = selectedRole;
  }

  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedRole = btn.getAttribute('data-role');
      if (roleInput) roleInput.value = selectedRole;
      clearAuthErrors();
    });
  });

  // ==========================================
  // STRICT LOGIN FORM VALIDATION & ROUTING
  // ==========================================
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    let loginSubmittedOnce = false;

    // Real-time validation on input/blur
    const validateLoginField = (fieldId) => {
      if (fieldId === 'loginEmail') {
        const val = loginEmail.value.trim();
        if (!val) {
          setAuthError('loginEmail', 'Corporate email address or user ID is required.');
          return false;
        }
        if (val.includes('@')) {
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(val)) {
            setAuthError('loginEmail', 'Please enter a valid corporate email address (e.g. counsel@company.com).');
            return false;
          }
        } else if (val.length < 3) {
          setAuthError('loginEmail', 'User ID must be at least 3 characters.');
          return false;
        }
        clearAuthError('loginEmail');
        return true;
      }

      if (fieldId === 'loginPassword') {
        const pwd = loginPassword.value;
        if (!pwd) {
          setAuthError('loginPassword', 'Password is required to authenticate.');
          return false;
        }
        if (pwd.length < 8) {
          setAuthError('loginPassword', 'Password must be at least 8 characters in length.');
          return false;
        }
        if (!/[A-Z]/.test(pwd)) {
          setAuthError('loginPassword', 'Password must include at least one uppercase letter (A-Z).');
          return false;
        }
        if (!/[0-9]/.test(pwd)) {
          setAuthError('loginPassword', 'Password must include at least one number (0-9).');
          return false;
        }
        clearAuthError('loginPassword');
        return true;
      }
      return true;
    };

    [loginEmail, loginPassword].forEach(inp => {
      if (!inp) return;
      inp.addEventListener('blur', () => {
        if (loginSubmittedOnce || inp.value.trim()) {
          validateLoginField(inp.id);
        }
      });
      inp.addEventListener('input', () => {
        if (loginSubmittedOnce) {
          validateLoginField(inp.id);
        }
      });
    });

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loginSubmittedOnce = true;

      const emailValid = validateLoginField('loginEmail');
      const passValid = validateLoginField('loginPassword');

      if (!emailValid || !passValid) {
        const firstErr = loginForm.querySelector('.has-error input');
        if (firstErr) firstErr.focus();
        return;
      }

      const email = loginEmail.value.trim();
      const displayName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const userSession = {
        email: email,
        name: selectedRole === 'admin' ? `${displayName} (Admin)` : `${displayName} (Client)`,
        role: selectedRole,
        loginTime: new Date().toISOString()
      };

      try {
        localStorage.setItem('legal_current_user', JSON.stringify(userSession));

        if (window.LegalApp && window.LegalApp.showToast) {
          window.LegalApp.showToast('Login Successful', `Authenticated as ${userSession.role.toUpperCase()}. Directing to workspace...`, 'success', 2000);
        }

        setTimeout(() => {
          if (selectedRole === 'admin') {
            window.location.href = 'AdminDashboard.html';
          } else {
            window.location.href = 'ClientDashboard.html';
          }
        }, 500);
      } catch (err) {
        console.error('Session save failed:', err);
      }
    });
  }

  // ==========================================
  // STRICT SIGNUP FORM VALIDATION
  // ==========================================
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupConfirmPassword = document.getElementById('signupConfirmPassword');
    const signupTerms = document.getElementById('signupTerms');
    let signupSubmittedOnce = false;

    // Inject Password Strength Meter under password field if not present
    const pwdGroup = signupPassword ? signupPassword.closest('.form-group') : null;
    let strengthContainer = null;
    if (pwdGroup && !pwdGroup.querySelector('.pwd-meter')) {
      strengthContainer = document.createElement('div');
      strengthContainer.innerHTML = `
        <div class="pwd-meter">
          <div class="pwd-meter-bar" id="pwdBar1"></div>
          <div class="pwd-meter-bar" id="pwdBar2"></div>
          <div class="pwd-meter-bar" id="pwdBar3"></div>
          <div class="pwd-meter-bar" id="pwdBar4"></div>
        </div>
        <div class="pwd-meter-label">
          <span>Security Strength:</span>
          <span id="pwdStrengthText" style="font-weight: 600;">Too Short</span>
        </div>
      `;
      pwdGroup.appendChild(strengthContainer);
    }

    const calculatePasswordStrength = (pwd) => {
      let score = 0;
      if (pwd.length >= 8) score++;
      if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
      if (/[0-9]/.test(pwd)) score++;
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score++;
      return score;
    };

    const updateStrengthUI = (pwd) => {
      const bars = [
        document.getElementById('pwdBar1'),
        document.getElementById('pwdBar2'),
        document.getElementById('pwdBar3'),
        document.getElementById('pwdBar4')
      ];
      const text = document.getElementById('pwdStrengthText');
      if (!bars[0] || !text) return;

      if (!pwd) {
        bars.forEach(b => { if (b) b.style.background = '#e2e8f0'; });
        text.textContent = 'Minimum 8 chars';
        text.style.color = 'var(--text-muted)';
        return;
      }

      const score = calculatePasswordStrength(pwd);
      const colors = ['#dc2626', '#f59e0b', '#3b82f6', '#16a34a'];
      const labels = ['Weak', 'Fair', 'Good', 'Strong'];

      bars.forEach((b, idx) => {
        if (!b) return;
        b.style.background = idx < score ? colors[score - 1] : '#e2e8f0';
      });

      text.textContent = labels[Math.max(0, score - 1)];
      text.style.color = colors[Math.max(0, score - 1)];
    };

    if (signupPassword) {
      signupPassword.addEventListener('input', () => {
        updateStrengthUI(signupPassword.value);
        if (signupSubmittedOnce) {
          validateSignupField('signupPassword');
        }
      });
    }

    const validateSignupField = (fieldId) => {
      if (fieldId === 'signupName') {
        const val = signupName.value.trim();
        if (!val) {
          setAuthError('signupName', 'Full legal or organization name is required.');
          return false;
        }
        if (val.length < 3) {
          setAuthError('signupName', 'Legal name must be at least 3 characters.');
          return false;
        }
        const nameRegex = /^[a-zA-Z\s\.\,\'\-]{3,70}$/;
        if (!nameRegex.test(val)) {
          setAuthError('signupName', 'Please enter a valid entity or legal name (letters and spaces only).');
          return false;
        }
        clearAuthError('signupName');
        return true;
      }

      if (fieldId === 'signupEmail') {
        const email = signupEmail.value.trim();
        if (!email) {
          setAuthError('signupEmail', 'Corporate email address is required.');
          return false;
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
          setAuthError('signupEmail', 'Please enter a valid corporate email (e.g. counsel@company.com).');
          return false;
        }
        clearAuthError('signupEmail');
        return true;
      }

      if (fieldId === 'signupPassword') {
        const pwd = signupPassword.value;
        if (!pwd) {
          setAuthError('signupPassword', 'Password is required.');
          return false;
        }
        if (pwd.length < 8) {
          setAuthError('signupPassword', 'Password must be at least 8 characters.');
          return false;
        }
        if (!/[A-Z]/.test(pwd)) {
          setAuthError('signupPassword', 'Must contain at least one uppercase letter (A-Z).');
          return false;
        }
        if (!/[a-z]/.test(pwd)) {
          setAuthError('signupPassword', 'Must contain at least one lowercase letter (a-z).');
          return false;
        }
        if (!/[0-9]/.test(pwd)) {
          setAuthError('signupPassword', 'Must contain at least one number (0-9).');
          return false;
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
          setAuthError('signupPassword', 'Must contain at least one special character (!@#$%^&*).');
          return false;
        }
        clearAuthError('signupPassword');
        return true;
      }

      if (fieldId === 'signupConfirmPassword') {
        const confirm = signupConfirmPassword.value;
        const pwd = signupPassword.value;
        if (!confirm) {
          setAuthError('signupConfirmPassword', 'Please confirm your password.');
          return false;
        }
        if (confirm !== pwd) {
          setAuthError('signupConfirmPassword', 'Passwords do not match.');
          return false;
        }
        clearAuthError('signupConfirmPassword');
        return true;
      }

      if (fieldId === 'signupTerms') {
        if (!signupTerms.checked) {
          const termsErr = document.getElementById('termsErrorMsg');
          if (termsErr) {
            termsErr.textContent = 'You must review and accept the demonstration terms to continue.';
            termsErr.style.display = 'block';
          }
          return false;
        } else {
          const termsErr = document.getElementById('termsErrorMsg');
          if (termsErr) {
            termsErr.textContent = '';
            termsErr.style.display = 'none';
          }
          return true;
        }
      }

      return true;
    };

    [signupName, signupEmail, signupConfirmPassword].forEach(inp => {
      if (!inp) return;
      inp.addEventListener('blur', () => {
        if (signupSubmittedOnce || inp.value.trim()) {
          validateSignupField(inp.id);
        }
      });
      inp.addEventListener('input', () => {
        if (signupSubmittedOnce) {
          validateSignupField(inp.id);
        }
      });
    });

    if (signupTerms) {
      signupTerms.addEventListener('change', () => {
        validateSignupField('signupTerms');
      });
    }

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      signupSubmittedOnce = true;

      const nameOk = validateSignupField('signupName');
      const emailOk = validateSignupField('signupEmail');
      const passOk = validateSignupField('signupPassword');
      const confirmOk = validateSignupField('signupConfirmPassword');
      const termsOk = validateSignupField('signupTerms');

      if (!nameOk || !emailOk || !passOk || !confirmOk || !termsOk) {
        const firstErr = signupForm.querySelector('.has-error input, #signupTerms:not(:checked)');
        if (firstErr) firstErr.focus();
        return;
      }

      const name = signupName.value.trim();
      const email = signupEmail.value.trim();

      const newClient = {
        id: `CLT-${Math.floor(100 + Math.random() * 900)}`,
        name: name,
        category: selectedRole === 'admin' ? 'Administrative Partner' : 'Commercial Enterprise',
        email: email,
        phone: '+1 (555) 000-DEMO',
        consultations: 0,
        cases: 0,
        registered: new Date().toISOString().split('T')[0]
      };

      try {
        let clients = JSON.parse(localStorage.getItem('legal_clients') || '[]');
        clients.unshift(newClient);
        localStorage.setItem('legal_clients', JSON.stringify(clients));

        if (window.LegalApp && window.LegalApp.showToast) {
          window.LegalApp.showToast(
            'Demo Account Created',
            'Registration successful! Directing to portal login...',
            'success',
            2500
          );
        }

        setTimeout(() => {
          window.location.href = 'Login.html';
        }, 800);
      } catch (err) {
        console.error('Signup error:', err);
      }
    });
  }

  // ==========================================
  // ERROR HELPERS (Inline DOM only - NO popup alerts)
  // ==========================================
  function setAuthError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const group = field.closest('.form-group');
    if (group) {
      group.classList.add('has-error');
      group.classList.remove('has-success');
      const err = group.querySelector('.form-error-msg');
      if (err) {
        err.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="margin-right: 4px;"></i> ${msg}`;
        err.style.display = 'block';
      }
    }
  }

  function clearAuthError(fieldId) {
    const field = document.getElementById(fieldId);
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

  function clearAuthErrors() {
    document.querySelectorAll('.form-group.has-error').forEach(g => {
      g.classList.remove('has-error');
      const err = g.querySelector('.form-error-msg');
      if (err) {
        err.textContent = '';
        err.style.display = 'none';
      }
    });
  }
});
