/**
 * Admin Header Functions
 * Shared functions for header interactions (profile menu, notifications, theme, live date, profile avatar sync)
 * Included on every admin page for consistent behavior
 */

// Profile menu toggle with direct display control and stopPropagation
function toggleProfileMenu(e) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  }
  const dropdown = document.getElementById('profileDropdown');
  const notifDropdown = document.getElementById('notificationDropdown');
  if (notifDropdown) {
    notifDropdown.classList.remove('show');
    notifDropdown.style.display = 'none';
  }
  if (!dropdown) return;

  const isVisible = dropdown.classList.contains('show') || dropdown.style.display === 'block';
  if (isVisible) {
    dropdown.classList.remove('show');
    dropdown.style.display = 'none';
  } else {
    dropdown.classList.add('show');
    dropdown.style.display = 'block';

    setTimeout(() => {
      function closeProfileOnClickOutside(evt) {
        if (!dropdown.contains(evt.target) && !evt.target.closest('.profile-menu-trigger')) {
          dropdown.classList.remove('show');
          dropdown.style.display = 'none';
          document.removeEventListener('click', closeProfileOnClickOutside);
        }
      }
      document.addEventListener('click', closeProfileOnClickOutside);
    }, 10);
  }
}

// Notification toggle with direct display control
function toggleNotifications(e) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
  }
  const dropdown = document.getElementById('notificationDropdown');
  const profileDropdown = document.getElementById('profileDropdown');
  if (profileDropdown) {
    profileDropdown.classList.remove('show');
    profileDropdown.style.display = 'none';
  }
  if (!dropdown) return;

  const isVisible = dropdown.classList.contains('show') || dropdown.style.display === 'block';
  if (isVisible) {
    dropdown.classList.remove('show');
    dropdown.style.display = 'none';
  } else {
    dropdown.classList.add('show');
    dropdown.style.display = 'block';

    const isSub = window.location.pathname.includes('/subscriptions/');
    const pendingUrl = isSub ? '../pending.html' : 'pending.html';
    dropdown.innerHTML = '<div style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); font-weight: 700; font-size: 13px; color: #ffffff; background: #007bdb; border-radius: 10px 10px 0 0;">System Notifications</div><div style="padding: 14px 16px; font-size: 13px; color: #e6e8ea; background: #1b1d22;"><div style="margin-bottom: 6px; font-weight: 600;">Pending Approvals</div><div style="color: #9aa3ad; margin-bottom: 10px;">New suppliers and station requests require review.</div><a href="' + pendingUrl + '" style="display: inline-block; background: #007bdb; color: #ffffff; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; text-decoration: none;">View Requests →</a></div>';

    setTimeout(() => {
      function closeNotifOnClickOutside(evt) {
        if (!dropdown.contains(evt.target) && !evt.target.closest('.header-notifications-btn')) {
          dropdown.classList.remove('show');
          dropdown.style.display = 'none';
          document.removeEventListener('click', closeNotifOnClickOutside);
        }
      }
      document.addEventListener('click', closeNotifOnClickOutside);
    }, 10);
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

// Initialize current date in header
function initHeaderDate() {
  const dateEls = document.querySelectorAll('.header-current-date');
  if (dateEls.length > 0) {
    const formatted = new Date().toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    dateEls.forEach(el => el.textContent = formatted);
  }
}

// Synchronize all Super Admin avatar images and profile names across header and page
function syncAllProfileAvatars(explicitPic) {
  try {
    const isSub = window.location.pathname.includes('/subscriptions/');
    const defaultPic = isSub ? '../../assets/default-user.png' : '../assets/default-user.png';
    const fallbackLogo = isSub ? '../../logo.png' : '../logo.png';
    
    const user = JSON.parse(localStorage.getItem('wsms_admin_user') || '{}');
    const pic = explicitPic || user.dp_url || user.picture || defaultPic;
    const name = user.name || 'Super Admin';
    const email = user.email || 'admin@wsms.pk';

    // 1. Update all avatar images
    const imgs = document.querySelectorAll('.profile-menu-trigger img, .profile-dropdown-header img, #profAvatarDisplay, #adminProfileAvatar');
    imgs.forEach(img => {
      img.src = pic;
      img.onerror = function() {
        this.src = defaultPic;
        this.onerror = function() { this.src = fallbackLogo; };
      };
    });

    // 2. Update name displays
    const names = document.querySelectorAll('.profile-menu-trigger span, #profileName, #profNameDisplay');
    names.forEach(el => { el.textContent = name; });

    // 3. Update email displays
    const emails = document.querySelectorAll('#profileEmail, #profEmailDisplay');
    emails.forEach(el => { el.textContent = email; });
  } catch (e) {
    console.error('Error syncing profile avatars:', e);
  }
}

// Expose globally
window.syncAllProfileAvatars = syncAllProfileAvatars;
window.toggleProfileMenu = toggleProfileMenu;
window.toggleProfileDropdown = toggleProfileMenu;
window.toggleNotifications = toggleNotifications;

// Initialize header functions when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initHeaderDate();
    syncAllProfileAvatars();
  });
} else {
  initThemeToggle();
  initHeaderDate();
  syncAllProfileAvatars();
}

// Listen to storage event (updates avatar if changed in another tab)
window.addEventListener('storage', (e) => {
  if (e.key === 'wsms_admin_user') {
    syncAllProfileAvatars();
  }
});
