/**
 * User Header Update Script for WSMS
 * Automatically updates user name and profile picture in headers across all pages
 * Reads from localStorage: userName and userImage
 * Updates elements: #headerUserName, #headerUserImage, #userName, #userDP
 */

(function() {
  'use strict';

  /**
   * Normalizes image path depending on whether the current page is in /pages/ or at root
   */
  function normalizeImagePath(path) {
    if (!path) return '';
    // Data URLs (base64 image data) and absolute URLs
    if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const isPagesDir = typeof window !== 'undefined' && window.location && window.location.pathname.includes('/pages/');
    if (isPagesDir) {
      if (path.startsWith('./assets/')) {
        return '.' + path; // './assets/...' -> '../assets/...'
      }
      if (path.startsWith('assets/')) {
        return '../' + path; // 'assets/...' -> '../assets/...'
      }
      return path;
    } else {
      if (path.startsWith('../assets/')) {
        return path.substring(1); // '../assets/...' -> './assets/...'
      }
      return path;
    }
  }

  /**
   * Update user header information from localStorage
   * Supports both new (#headerUserName, #headerUserImage) and old (#userName, #userDP) element IDs
   */
  function updateUserHeader() {
    if (typeof localStorage === 'undefined') return;

    // Get user data from localStorage
    const userName = localStorage.getItem('userName') || localStorage.getItem('username') || 'User';
    const rawImage = localStorage.getItem('userImage') || localStorage.getItem('userDP');
    const isPagesDir = typeof window !== 'undefined' && window.location && window.location.pathname.includes('/pages/');
    const defaultImg = isPagesDir ? '../assets/default-user.png' : './assets/default-user.png';
    const fallbackLogo = isPagesDir ? '../logo.png' : './logo.png';
    const userImage = rawImage ? normalizeImagePath(rawImage) : defaultImg;

    // Update header user name (try new ID first, then fallback to old ID)
    const headerUserName = document.getElementById('headerUserName');
    const userNameOld = document.getElementById('userName');
    
    if (headerUserName) {
      headerUserName.textContent = userName;
    }
    if (userNameOld && !headerUserName) {
      userNameOld.textContent = userName;
    }

    // Update header user image (try new ID first, then fallback to old ID)
    const headerUserImage = document.getElementById('headerUserImage');
    const userDP = document.getElementById('userDP');
    
    if (headerUserImage) {
      headerUserImage.src = userImage;
      headerUserImage.alt = userName + ' Profile Picture';
      headerUserImage.onerror = function() {
        this.src = fallbackLogo;
      };
    }
    if (userDP && !headerUserImage) {
      userDP.src = userImage;
      userDP.alt = userName + ' Profile Picture';
      userDP.onerror = function() {
        this.src = fallbackLogo;
      };
    }
  }

  /**
   * Listen for storage changes to update header in real-time
   * This allows updates when settings are saved on other tabs/pages
   */
  function setupStorageListener() {
    window.addEventListener('storage', function(e) {
      if (e.key === 'userName' || e.key === 'username' || e.key === 'userImage' || e.key === 'userDP') {
        updateUserHeader();
      }
    });

    // Also update whenever window regains focus (e.g. returning from settings page)
    window.addEventListener('focus', function() {
      updateUserHeader();
    });
  }

  /**
   * Initialize user header when DOM is ready or immediately
   */
  function initUserHeader() {
    updateUserHeader();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        updateUserHeader();
        setupStorageListener();
      });
    } else {
      updateUserHeader();
      setupStorageListener();
    }
  }

  // Initialize immediately
  initUserHeader();

  // Also update on page visibility change (when user returns to tab)
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      updateUserHeader();
    }
  });

  // Expose update function globally so it can be called manually after settings save
  window.updateUserHeader = updateUserHeader;
})();
