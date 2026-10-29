/**
 * Logout functionality
 * Destroys PHP session via API and clears UI-related localStorage
 * Note: PHP sessions are handled via cookies, not localStorage
 */
async function logout() {
  try {
    // Call API logout endpoint to destroy PHP session on server
    await fetch('/wsms/api/auth.php?action=logout', {
      method: 'POST',
      credentials: 'include' // CRITICAL: Include cookies to destroy PHP session
    }).catch(() => {
      // Ignore errors - continue with client-side cleanup
    });
  } catch (error) {
    // Ignore errors - continue with client-side cleanup
    console.error('Logout API call failed:', error);
  }
  
  // Clear UI-related localStorage (not session data - PHP handles sessions via cookies)
  // These are only for display purposes
  localStorage.removeItem('userName');
  localStorage.removeItem('userImage');
  localStorage.removeItem('userDP');
  localStorage.removeItem('username');
  
  // Legacy cleanup - remove old session storage keys (no longer used for auth)
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
  localStorage.removeItem('user_id');
  localStorage.removeItem('crm_session');
  
  // Redirect to login page - always use absolute path
  const isLocal = window.location.protocol === 'file:' || !window.location.hostname.includes('orionpixels.com'); window.location.href = isLocal ? '../index.html' : '/wsms/index.html';
}

// Auto-execute if this script is loaded directly
if (typeof window !== 'undefined') {
  // Make logout function globally available
  window.logout = logout;
}
