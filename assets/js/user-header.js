/**
 * User Header Update Script
 * Automatically updates user name and profile picture in headers across all pages
 * Reads from localStorage: userName and userImage
 * Updates elements: #headerUserName, #headerUserImage, #userName, #userDP (for backward compatibility)
 */

(function() {
  'use strict';

  /**
   * Update user header information from localStorage
   * Supports both new (#headerUserName, #headerUserImage) and old (#userName, #userDP) element IDs
   */
  function updateUserHeader() {
    // Get user data from localStorage
    const userName = localStorage.getItem('userName') || localStorage.getItem('username') || 'User';
    const userImage = localStorage.getItem('userImage') || localStorage.getItem('userDP') || '../assets/default-user.png';

    // Update header user name (try new ID first, then fallback to old ID)
    const headerUserName = document.getElementById('headerUserName');
    const userNameOld = document.getElementById('userName');
    
    // Update new ID element
    if (headerUserName) {
      headerUserName.textContent = userName;
    }
    // Also update old ID element for backward compatibility
    if (userNameOld && !headerUserName) {
      userNameOld.textContent = userName;
    }

    // Update header user image (try new ID first, then fallback to old ID)
    const headerUserImage = document.getElementById('headerUserImage');
    const userDP = document.getElementById('userDP');
    
    // Update new ID element
    if (headerUserImage) {
      headerUserImage.src = userImage;
      headerUserImage.alt = userName + ' Profile Picture';
    }
    // Also update old ID element for backward compatibility
    if (userDP && !headerUserImage) {
      userDP.src = userImage;
      userDP.alt = userName + ' Profile Picture';
    }
  }

  /**
   * Listen for storage changes to update header in real-time
   * This allows updates when settings are saved on other tabs/pages
   */
  function setupStorageListener() {
    window.addEventListener('storage', function(e) {
      if (e.key === 'userName' || e.key === 'userImage' || e.key === 'userDP') {
        updateUserHeader();
      }
    });
  }

  /**
   * Initialize user header when DOM is ready
   */
  function initUserHeader() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        updateUserHeader();
        setupStorageListener();
      });
    } else {
      // DOM is already loaded
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

