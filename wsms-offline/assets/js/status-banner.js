/**
 * Status Banner Utility
 * Shows banners and disables buttons for pending/suspended users
 */

(function() {
  'use strict';
  
  let statusBannerAdded = false;
  
  /**
   * Get user status from localStorage or window
   */
  function getUserStatus() {
    return window.userStatus || localStorage.getItem('userStatus') || 'active';
  }
  
  /**
   * Check if user has active status
   */
  function isUserActive() {
    return getUserStatus() === 'active';
  }
  
  /**
   * Show status banner at top of page
   */
  function showStatusBanner() {
    if (statusBannerAdded) return;
    
    const status = getUserStatus();
    if (status === 'active') return; // No banner for active users
    
    const banner = document.createElement('div');
    banner.id = 'user-status-banner';
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: ${status === 'pending' ? '#fff3cd' : '#f8d7da'};
      color: ${status === 'pending' ? '#856404' : '#721c24'};
      padding: 12px 16px;
      text-align: center;
      font-weight: 600;
      font-size: 14px;
      z-index: 10000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-bottom: 2px solid ${status === 'pending' ? '#ffc107' : '#dc3545'};
    `;
    
    let message = '';
    if (status === 'pending') {
      message = '⚠️ Your account is pending approval. You can view data but cannot make changes.';
    } else if (status === 'suspended') {
      message = '⚠️ Your account has been suspended. You can view data but cannot make changes.';
    } else if (status === 'denied') {
      message = '❌ Your account has been denied. Please contact support.';
    }
    
    banner.textContent = message;
    document.body.insertBefore(banner, document.body.firstChild);
    
    // Adjust body padding to account for banner
    document.body.style.paddingTop = '50px';
    
    statusBannerAdded = true;
  }
  
  /**
   * Disable all form buttons and inputs for write operations
   */
  function disableWriteOperations() {
    if (isUserActive()) return;
    
    // Disable all submit buttons
    const submitButtons = document.querySelectorAll('button[type="submit"], .submit-btn, button.btn-primary');
    submitButtons.forEach(btn => {
      if (!btn.disabled) {
        btn.disabled = true;
        btn.style.opacity = '0.6';
        btn.style.cursor = 'not-allowed';
        btn.title = 'Your account is pending approval or suspended';
      }
    });
    
    // Disable form inputs in forms (but allow viewing)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input[type="text"], input[type="number"], input[type="email"], input[type="tel"], textarea, select');
      inputs.forEach(input => {
        if (input.type !== 'hidden' && !input.readOnly) {
          input.readOnly = true;
          input.style.backgroundColor = '#f5f5f5';
          input.style.cursor = 'not-allowed';
        }
      });
    });
    
    // Disable action buttons (edit, delete, etc.)
    const actionButtons = document.querySelectorAll('.btn-edit, .btn-delete, .btn-update, [onclick*="edit"], [onclick*="delete"], [onclick*="update"]');
    actionButtons.forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btn.style.cursor = 'not-allowed';
      btn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        alert('Your account is pending approval or suspended. You cannot make changes.');
        return false;
      };
    });
  }
  
  /**
   * Initialize status banner and disable operations
   */
  function init() {
    // Wait for session to be validated
    if (window.sessionValidated) {
      showStatusBanner();
      disableWriteOperations();
    } else {
      window.addEventListener('sessionValidated', function() {
        showStatusBanner();
        disableWriteOperations();
      }, { once: true });
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Expose utility functions
  window.getUserStatus = getUserStatus;
  window.isUserActive = isUserActive;
})();

