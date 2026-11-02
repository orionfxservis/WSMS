// Admin Shared JavaScript

let charts = {};

// Load notification count and items
async function loadNotifications() {
  try {
    const res = await fetch('/wsms/api/admin/notifications.php', {
      credentials: 'include'
    });
    const data = await res.json().catch(() => ({ count: 0, items: [] }));
    const badge = document.getElementById('notificationBadge');
    const dropdown = document.getElementById('notificationDropdown');
    
    if (badge) {
      const count = data.count || 0;
      badge.textContent = count > 99 ? '99+' : count;
      badge.style.display = count > 0 ? 'block' : 'none';
    }
    
    if (dropdown && data.items) {
      if (data.items.length === 0) {
        dropdown.innerHTML = '<div class="notification-item"><div class="notification-text">No notifications</div></div>';
      } else {
        dropdown.innerHTML = data.items.map(item => `
          <div class="notification-item ${item.read ? '' : 'unread'}" onclick="markRead(${item.id})">
            <div class="notification-text">${item.text}</div>
            <div class="notification-time">${new Date(item.ts).toLocaleString()}</div>
          </div>
        `).join('');
      }
    }
  } catch (e) {
    console.error('Failed to load notifications:', e);
  }
}

// Toggle notification dropdown
function toggleNotifications() {
  const dropdown = document.getElementById('notificationDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

// Mark notification as read
async function markRead(id) {
  // Stub - implement if needed
  console.log('Mark read:', id);
}

// Debug logging function
async function logDebug(event, data) {
  try {
    await fetch('/wsms/api/admin/log-writer.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, data })
    });
  } catch (e) {
    console.error('Log write failed:', e);
  }
}

function getAdminLoginUrl() {
  const isSub = window.location.pathname.includes('/subscriptions/');
  return isSub ? '../index.html' : 'index.html';
}

// Check session
async function checkSession() {
  try {
    const res = await fetch('/wsms/api/admin/check-session.php', {
      credentials: 'include'
    });
    const data = await res.json().catch(() => ({ valid: false }));
    if (data && data.valid === true) {
      return true;
    }
  } catch (e) {
    console.warn('Session API unreachable, verifying local admin session...');
  }

  // Static / GitHub Pages / Offline fallback
  const isLoggedIn = localStorage.getItem('wsms_admin_logged_in') === 'true';
  if (!isLoggedIn) {
    // If running in preview/local/github.io without explicit logout, allow demo session
    const isStaticEnv = window.location.protocol === 'file:' || 
                          window.location.hostname.includes('github.io') || 
                          window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
    if (isStaticEnv && !sessionStorage.getItem('wsms_admin_logged_out')) {
      localStorage.setItem('wsms_admin_logged_in', 'true');
      localStorage.setItem('wsms_admin_user', JSON.stringify({
        name: 'Super Admin',
        email: 'admin@wsms.pk',
        role: 'superadmin'
      }));
      return true;
    }
    window.location.href = getAdminLoginUrl();
    return false;
  }
  return true;
}

// Logout
async function logout() {
  try {
    localStorage.removeItem('wsms_admin_logged_in');
    localStorage.removeItem('wsms_admin_user');
    sessionStorage.setItem('wsms_admin_logged_out', 'true');
    await fetch('/wsms/api/admin/logout.php', {
      method: 'POST',
      credentials: 'include'
    }).catch(() => {});
  } finally {
    window.location.href = getAdminLoginUrl();
  }
}

// Initialize Chart.js defaults
function initChartDefaults() {
  if (typeof Chart !== 'undefined') {
    Chart.defaults.color = '#9aa3ad';
    Chart.defaults.borderColor = '#23262d';
    Chart.defaults.backgroundColor = 'rgba(59, 130, 246, 0.1)';
  }
}

// Load metrics
async function loadMetrics() {
  try {
    const res = await fetch('/wsms/api/admin/metrics.php', {
      credentials: 'include'
    });
    const data = await res.json().catch(() => ({
      mrr: 0,
      revenueYtd: 0,
      pendingPayouts: 0,
      activeSuppliers: 0,
      activeCustomers: 0,
      activeStations: 0
    }));
    
    document.getElementById('kpi-mrr').textContent = formatCurrency(data.mrr || 0);
    document.getElementById('kpi-revenue').textContent = formatCurrency(data.revenueYtd || 0);
    document.getElementById('kpi-payouts').textContent = formatCurrency(data.pendingPayouts || 0);
    document.getElementById('kpi-suppliers').textContent = data.activeSuppliers || 0;
    document.getElementById('kpi-customers').textContent = data.activeCustomers || 0;
    document.getElementById('kpi-stations').textContent = data.activeStations || 0;
  } catch (e) {
    console.error('Failed to load metrics:', e);
  }
}

// Load charts data
async function loadCharts(from, to) {
  try {
    const res = await fetch(`/wsms/api/admin/charts.php?from=${from}&to=${to}`, {
      credentials: 'include'
    });
    const data = await res.json();
    if (data && typeof data === 'object') {
      renderCharts(data);
    } else {
      console.error('Invalid chart data received');
    }
  } catch (e) {
    console.error('Failed to load charts:', e);
    // Don't render stub data - let charts show empty state
  }
}

// Render all charts
function renderCharts(data) {
  if (typeof Chart === 'undefined') return;
  
  // Revenue Trend (Line)
  const revCtx = document.getElementById('revTrend');
  if (revCtx && !charts.revTrend) {
    charts.revTrend = new Chart(revCtx, {
      type: 'line',
      data: {
        labels: data.revTrend.map(d => d.d),
        datasets: [{
          label: 'Revenue',
          data: data.revTrend.map(d => d.v),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  } else if (charts.revTrend) {
    charts.revTrend.data.labels = data.revTrend.map(d => d.d);
        charts.revTrend.data.datasets[0].data = data.revTrend.map(d => d.v);
        charts.revTrend.update();
  }
  
  // New Suppliers (Bar)
  const supCtx = document.getElementById('newSuppliers');
  if (supCtx && !charts.newSuppliers) {
    charts.newSuppliers = new Chart(supCtx, {
      type: 'bar',
      data: {
        labels: data.newSuppliers.map(d => d.d),
        datasets: [{
          label: 'New Suppliers',
          data: data.newSuppliers.map(d => d.v),
          backgroundColor: '#16a34a'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  } else if (charts.newSuppliers) {
    charts.newSuppliers.data.labels = data.newSuppliers.map(d => d.d);
        charts.newSuppliers.data.datasets[0].data = data.newSuppliers.map(d => d.v);
        charts.newSuppliers.update();
  }
  
  // Churn Rate (Area)
  const churnCtx = document.getElementById('churnRate');
  if (churnCtx && !charts.churnRate) {
    charts.churnRate = new Chart(churnCtx, {
      type: 'line',
      data: {
        labels: data.churnRate.map(d => d.d),
        datasets: [{
          label: 'Churn Rate',
          data: data.churnRate.map(d => d.v),
          borderColor: '#dc2626',
          backgroundColor: 'rgba(220, 38, 38, 0.2)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  } else if (charts.churnRate) {
    charts.churnRate.data.labels = data.churnRate.map(d => d.d);
        charts.churnRate.data.datasets[0].data = data.churnRate.map(d => d.v);
        charts.churnRate.update();
  }
  
  // Expense Split (Doughnut)
  const expCtx = document.getElementById('expenseSplit');
  if (expCtx && !charts.expenseSplit) {
    charts.expenseSplit = new Chart(expCtx, {
      type: 'doughnut',
      data: {
        labels: data.expenseSplit.labels,
        datasets: [{
          data: data.expenseSplit.values,
          backgroundColor: ['#3b82f6', '#16a34a', '#f59e0b', '#dc2626']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  } else if (charts.expenseSplit) {
    charts.expenseSplit.data.labels = data.expenseSplit.labels;
        charts.expenseSplit.data.datasets[0].data = data.expenseSplit.values;
        charts.expenseSplit.update();
  }
  
  // AR Aging (Stacked Bar)
  const arCtx = document.getElementById('arAging');
  if (arCtx && !charts.arAging) {
    charts.arAging = new Chart(arCtx, {
      type: 'bar',
      data: {
        labels: data.arAging.labels,
        datasets: [
          { label: '0-30', data: data.arAging.series[0], backgroundColor: '#16a34a' },
          { label: '31-60', data: data.arAging.series[1], backgroundColor: '#f59e0b' },
          { label: '61-90', data: data.arAging.series[2], backgroundColor: '#f97316' },
          { label: '90+', data: data.arAging.series[3], backgroundColor: '#dc2626' }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { x: { stacked: true }, y: { stacked: true } }
      }
    });
  } else if (charts.arAging) {
    charts.arAging.data.labels = data.arAging.labels;
        charts.arAging.data.datasets.forEach((ds, i) => {
          ds.data = data.arAging.series[i];
        });
        charts.arAging.update();
  }
  
  // Top Suppliers (Horizontal Bar)
  const topCtx = document.getElementById('topSuppliers');
  if (topCtx && !charts.topSuppliers) {
    charts.topSuppliers = new Chart(topCtx, {
      type: 'bar',
      data: {
        labels: data.topSuppliers.labels,
        datasets: [{
          label: 'Revenue',
          data: data.topSuppliers.values,
          backgroundColor: '#3b82f6'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  } else if (charts.topSuppliers) {
    charts.topSuppliers.data.labels = data.topSuppliers.labels;
        charts.topSuppliers.data.datasets[0].data = data.topSuppliers.values;
        charts.topSuppliers.update();
  }
}

// Format currency - Pakistani Rupees
function formatCurrency(amount) {
  return 'Rs. ' + new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Profile dropdown functions
let adminProfile = null;

async function loadAdminProfile() {
  try {
    const res = await fetch('/wsms/api/admin/profile.php?action=get', {
      credentials: 'include'
    });
    const data = await res.json();
    if (data.success && data.data) {
      adminProfile = data.data;
      updateProfileDropdown();
    }
  } catch (e) {
    console.error('Failed to load admin profile:', e);
  }
}

function updateProfileDropdown() {
  if (!adminProfile) return;
  const name = adminProfile.name || 'Super Admin';
  const dpUrl = adminProfile.dp_url || adminProfile.picture || '../assets/default-user.png';
  const email = adminProfile.email || 'admin@wsms.pk';

  // Update text in DOM
  const nameEls = document.querySelectorAll('#profileName, .profile-menu-trigger span, #profNameDisplay');
  nameEls.forEach(el => { el.textContent = name; });

  const emailEls = document.querySelectorAll('#profileEmail, #profEmailDisplay');
  emailEls.forEach(el => { el.textContent = email; });

  // Update avatars in DOM
  const avatarImgs = document.querySelectorAll('.profile-menu-trigger img, .profile-dropdown-header img, #profAvatarDisplay, #adminProfileAvatar');
  avatarImgs.forEach(img => {
    img.src = dpUrl;
    img.onerror = function() {
      this.src = '../assets/default-user.png';
      this.onerror = function() { this.src = '../logo.png'; };
    };
  });
}

function toggleProfileDropdown(e) {
  if (typeof toggleProfileMenu === 'function') {
    toggleProfileMenu(e);
  } else {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
      const isShow = dropdown.classList.contains('show') || dropdown.style.display === 'block';
      dropdown.classList.toggle('show', !isShow);
      dropdown.style.display = isShow ? 'none' : 'block';
    }
  }
}

function showChangePictureModal() {
  const url = prompt('Enter picture URL or upload path (e.g., uploads/profile-pictures/image.jpg):');
  if (url && url.trim()) {
    updateProfilePicture(url.trim());
  }
}

function showChangeNameModal() {
  const currentName = adminProfile?.name || '';
  const newName = prompt('Enter new name:', currentName);
  if (newName && newName.trim() && newName !== currentName) {
    updateProfileName(newName.trim());
  }
}

function showChangePasswordModal() {
  const currentPassword = prompt('Enter current password:');
  if (!currentPassword) return;
  
  const newPassword = prompt('Enter new password (min 8 characters):');
  if (!newPassword || newPassword.length < 8) {
    alert('Password must be at least 8 characters');
    return;
  }
  
  const confirmPassword = prompt('Confirm new password:');
  if (newPassword !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }
  
  updateProfilePassword(currentPassword, newPassword);
}

async function updateProfilePicture(url) {
  try {
    const user = JSON.parse(localStorage.getItem('wsms_admin_user') || '{}');
    user.dp_url = url;
    user.picture = url;
    localStorage.setItem('wsms_admin_user', JSON.stringify(user));

    await fetch('../api/admin/profile.php?action=update-picture', {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({picture_url: url})
    }).catch(() => null);

    adminProfile = user;
    updateProfileDropdown();
    if (typeof syncAllProfileAvatars === 'function') {
      syncAllProfileAvatars(url);
    }
    alert('Profile picture updated successfully');
  } catch (e) {
    console.error('Failed to update picture:', e);
    alert('Failed to update picture');
  }
}

async function updateProfileName(name) {
  try {
    const res = await fetch('/wsms/api/admin/profile.php?action=update-name', {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: name})
    });
    const data = await res.json();
    if (data.success) {
      await loadAdminProfile();
      alert('Name updated');
    } else {
      alert(data.error || 'Failed to update name');
    }
  } catch (e) {
    console.error('Failed to update name:', e);
    alert('Failed to update name');
  }
}

async function updateProfilePassword(currentPassword, newPassword) {
  try {
    const res = await fetch('/wsms/api/admin/profile.php?action=update-password', {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: newPassword
      })
    });
    const data = await res.json();
    if (data.success) {
      alert('Password updated successfully. Please login again.');
      logout();
    } else {
      alert(data.error || 'Failed to update password');
    }
  } catch (e) {
    console.error('Failed to update password:', e);
    alert('Failed to update password');
  }
}

// Theme switching functions
function getCurrentTheme() {
  const savedTheme = localStorage.getItem('wsms_admin_theme');
  if (savedTheme) {
    return savedTheme;
  }
  // Default to dark theme
  return 'dark';
}

function saveThemePreference(theme) {
  localStorage.setItem('wsms_admin_theme', theme);
}

function initTheme() {
  const theme = getCurrentTheme();
  applyTheme(theme);
}

function applyTheme(theme) {
  const html = document.documentElement;
  html.classList.remove('theme-light', 'theme-dark');
  if (theme === 'light') {
    html.classList.add('theme-light');
  } else {
    html.classList.add('theme-dark');
  }
}

function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  saveThemePreference(newTheme);
  applyTheme(newTheme);
  
  // Update the toggle in the dropdown if it exists
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.checked = newTheme === 'light';
  }
  
  // Update the theme label if it exists
  const themeLabel = document.querySelector('.theme-toggle-label');
  if (themeLabel) {
    themeLabel.textContent = newTheme === 'light' ? 'Light' : 'Dark';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  
  checkSession();
  initChartDefaults();
  initTheme();
  loadNotifications();
  loadAdminProfile();
  setInterval(loadNotifications, 30000);
  
  // Close notification dropdown on outside click
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('notificationDropdown');
    const bell = document.querySelector('.notification-bell');
    const notifTrigger = bell || document.querySelector('.header-notifications-btn');
    if (dropdown && notifTrigger && !notifTrigger.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('show');
      dropdown.style.display = 'none';
    }
    
    // Close profile dropdown on outside click
    const profileDropdown = document.getElementById('profileDropdown');
    const profileTrigger = document.querySelector('.profile-menu-trigger');
    if (profileDropdown && profileTrigger && !profileTrigger.contains(e.target) && !profileDropdown.contains(e.target)) {
      profileDropdown.classList.remove('show');
      profileDropdown.style.display = 'none';
    }
  });
});
