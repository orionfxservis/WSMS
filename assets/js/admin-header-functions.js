/**
 * Admin Header Functions
 * Shared functions for header interactions (profile menu, notifications, theme)
 * Included on every admin page for consistent behavior
 */

// Profile menu toggle
function toggleProfileMenu() {
  const dropdown = document.getElementById('profileDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
    // Close on outside click
    if (dropdown.classList.contains('show')) {
      setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
          if (!dropdown.contains(e.target) && !e.target.closest('.profile-menu-trigger')) {
            dropdown.classList.remove('show');
            document.removeEventListener('click', closeMenu);
          }
        });
      }, 0);
    }
  }
}

// Update theme toggle label
function initThemeToggle() {
  if (typeof getCurrentTheme === 'function') {
    const currentTheme = getCurrentTheme();
    const themeLabel = document.getElementById('themeLabel');
    const themeToggle = document.getElementById('themeToggle');
    if (themeLabel) {
      themeLabel.textContent = currentTheme === 'light' ? 'On' : 'Off';
    }
    if (themeToggle) {
      themeToggle.checked = currentTheme === 'light';
    }
  }
}

// Notification toggle
function toggleNotifications() {
  const dropdown = document.getElementById('notificationDropdown');
  if (dropdown) {
    if (dropdown.style.display === 'block') {
      dropdown.style.display = 'none';
    } else {
      const isSub = window.location.pathname.includes('/subscriptions/');
      const pendingUrl = isSub ? '../pending.html' : 'pending.html';
      dropdown.innerHTML = '<div style="padding: 10px;">Pending user approvals: <a href="' + pendingUrl + '" style="color: #3b82f6;">View</a></div>';
      dropdown.style.display = 'block';
    }
  }
}

// Initialize header functions when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeToggle);
} else {
  initThemeToggle();
}

