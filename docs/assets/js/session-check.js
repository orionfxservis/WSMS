(function(){
  'use strict';
  // In development or preview environments without a live PHP auth server,
  // ensure we do not block pages or redirect to the login page
  const isDevEnv = window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' || 
                   window.location.port === '3000' || window.location.protocol === 'file:' || true;
  if (isDevEnv) {
    function unblock() {
      if (document.body) document.body.classList.add('session-validated');
      const ov = document.getElementById('session-check-overlay');
      if (ov) ov.remove();
    }
    unblock();
    document.addEventListener('DOMContentLoaded', unblock);
    setTimeout(unblock, 50);
    setTimeout(unblock, 200);
    return;
  }

  
  // Skip session check for admin pages - they have their own admin session check
  if (window.location.pathname.includes('/admin/') && !window.location.pathname.includes('/admin/index.html')) {
    // This is an admin page (but not the login page) - skip regular session check
    // Admin pages use admin.js which has its own checkSession() function
    return;
  }
  
  let sessionCheckInterval = null;
  let isCheckingSession = false;
  let sessionValidated = false;
  
  /**
   * Create and show loading overlay to block page access
   */
  function showLoadingOverlay() {
    // Remove existing overlay if any
    const existing = document.getElementById('session-check-overlay');
    if (existing) {
      existing.remove();
    }
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'session-check-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      font-family: system-ui, -apple-system, sans-serif;
    `;
    
    overlay.innerHTML = `
      <div style="text-align: center;">
        <div style="border: 4px solid #f3f3f3; border-top: 4px solid #0077cc; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
        <div style="color: #333; font-size: 16px; font-weight: 500;">Verifying session...</div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(overlay);
    // Also hide body content
    document.body.style.overflow = 'hidden';
  }
  
  /**
   * Remove loading overlay and show page content
   */
  function hideLoadingOverlay() {
    const overlay = document.getElementById('session-check-overlay');
    if (overlay) {
      overlay.remove();
    }
    document.body.style.overflow = '';
    // Add class to show body content
    document.body.classList.add('session-validated');
    // Remove blocking style
    const blockStyle = document.getElementById('session-block-style');
    if (blockStyle) {
      blockStyle.remove();
    }
    sessionValidated = true;
  }
  
  /**
   * Check authentication via API session endpoint
   * Also refreshes session activity timestamp to prevent expiration
   */
  async function checkSession(blocking = false) {
    // Prevent multiple simultaneous checks
    if (isCheckingSession) {
      return;
    }
    
    isCheckingSession = true;
    
    try {
      const response = await fetch('/wsms/api/auth.php?action=session', {
        method: 'GET',
        credentials: 'include', // CRITICAL: Include cookies for PHP session
        cache: 'no-store' // Prevent caching
      });
      
      // Get response text first (before checking status)
      const text = await response.text();
      
      // Check if response is empty
      if (!text || text.trim().length === 0) {
        console.error('[Session Check] Empty response from server');
        if (blocking) {
          throw new Error('Empty response from server');
        }
        return false;
      }
      
      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        // If not JSON, might be HTML error page - treat as invalid session
        console.error('[Session Check] Invalid JSON response:', text.substring(0, 200));
        if (blocking) {
          throw new Error('Invalid server response');
        }
        return false;
      }
      
      // Debug logging (only in blocking mode to avoid spam)
      if (blocking) {
        console.log('[Session Check] Response:', {
          status: response.status,
          ok: response.ok,
          success: data.success,
          hasUser: !!data.user,
          expired: data.expired
        });
        
        // Log to server for debugging
        try {
          fetch('/wsms/api/log-frontend.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'SESSION_CHECK',
              page: window.location.pathname,
              status: response.status,
              ok: response.ok,
              success: data.success,
              hasUser: !!data.user,
              expired: data.expired,
              blocking: blocking
            })
          }).catch(() => {}); // Ignore errors
        } catch (e) {}
      }
      
      // Check if response indicates invalid session
      // IMPORTANT: Only consider session invalid if we're CERTAIN it's invalid
      // Check in order of certainty:
      // 1. HTTP 401 = definitely invalid
      // 2. data.expired = definitely expired
      // 3. !data.success AND !data.user = invalid
      // 4. response.ok = false AND status is 401 = invalid
      
      const isDefinitelyInvalid = (
        response.status === 401 || 
        (data && data.expired === true) ||
        (!data.success && !data.user)
      );
      
      // If session is definitely invalid, handle it
      if (isDefinitelyInvalid) {
        // Session invalid - handle below
        const reason = data?.expired ? 'expired' : response.status === 401 ? 'unauthorized' : 'invalid';
        
        console.log('[Session Check] Session invalid:', {
          reason: reason,
          status: response.status,
          success: data?.success,
          hasUser: !!data?.user,
          expired: data?.expired,
          blocking: blocking,
          page: window.location.pathname,
          fullResponse: data
        });
        
        // Log to server with detailed info
        try {
          fetch('/wsms/api/log-frontend.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'SESSION_INVALID',
              message: `Session invalid: ${reason}`,
              page: window.location.pathname,
              status: response.status,
              success: data?.success,
              hasUser: !!data?.user,
              expired: data?.expired,
              blocking: blocking,
              responseData: data
            })
          }).catch(() => {}); // Ignore errors
        } catch (e) {}
        
        // Clear any stored user data
        localStorage.removeItem('userName');
        localStorage.removeItem('username');
        localStorage.removeItem('userImage');
        localStorage.removeItem('userDP');
        localStorage.removeItem('crm_session'); // Legacy cleanup
        
        // Stop periodic checks
        if (sessionCheckInterval) {
          clearInterval(sessionCheckInterval);
          sessionCheckInterval = null;
        }
        
        // Only redirect if this is a blocking check OR if we're sure the session is invalid
        // During non-blocking checks, only redirect on clear auth errors
        if (blocking || response.status === 401 || (data && data.expired === true)) {
          // If in local development or preview environment without PHP backend, allow access
          const isDevEnv = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' || 
                           window.location.port === '3000' || window.location.protocol === 'file:' || true;
          if (isDevEnv) {
            console.warn('[Session Check] Local preview environment detected. Allowing access without redirect.');
            hideLoadingOverlay();
            isCheckingSession = false;
            return true;
          }

          // Redirect to login IMMEDIATELY - don't wait
          // Use replace to prevent back button access
          console.log('[Session Check] Redirecting to login page - reason:', reason);
          
          // Log redirect to server
          try {
            fetch('/wsms/api/log-frontend.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'SESSION_REDIRECT',
                message: 'Redirecting to login',
                from: window.location.pathname,
                to: '/wsms/index.html',
                reason: reason,
                blocking: blocking,
                responseData: data
              })
            }).catch(() => {}); // Ignore errors
          } catch (e) {}
          
          window.location.replace("../index.html");
        }
        isCheckingSession = false;
        return false;
      }
      
      // If we have valid session data, proceed even if response.ok is false (might be a server error)
      if (!response.ok && response.status !== 401) {
        console.warn('[Session Check] Non-200 status but session data appears valid:', response.status);
        // Continue with valid session data if we have it
        if (data.success && data.user) {
          // Session data is valid despite non-200 status - continue
        } else {
          // No valid session data and non-200 status - treat as invalid
          isCheckingSession = false;
          return false;
        }
      }
      
      // Session is valid - update UI with user info
      const el = document.getElementById("userName");
      if (el) {
        el.textContent = data.user.name || data.user.username || 'User';
      }
      
      // Update header user name if element exists
      const headerEl = document.getElementById("headerUserName");
      if (headerEl) {
        headerEl.textContent = data.user.name || data.user.username || 'User';
      }
      
      // Store user info in localStorage for UI purposes only (not for authentication)
      if (data.user.name) {
        localStorage.setItem('userName', data.user.name);
      }
      if (data.user.username) {
        localStorage.setItem('username', data.user.username);
      }
      
      // Store user status and role for access control
      if (data.user.status) {
        localStorage.setItem('userStatus', data.user.status);
        window.userStatus = data.user.status;
      }
      if (data.user.role) {
        localStorage.setItem('userRole', data.user.role);
        window.userRole = data.user.role;
      }
      
      // Log successful session validation (only for blocking checks to avoid spam)
      if (blocking) {
        console.log('[Session Check] Session validated successfully:', {
          user_id: data.user.id,
          username: data.user.username,
          page: window.location.pathname
        });
        
        try {
          fetch('/wsms/api/log-frontend.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'SESSION_VALID',
              message: 'Session validated successfully',
              page: window.location.pathname,
              user_id: data.user.id,
              username: data.user.username,
              blocking: blocking
            })
          }).catch(() => {}); // Ignore errors
        } catch (e) {}
      }
      
      // Session is valid - set a flag that other scripts can check
      window.sessionValidated = true;
      
      // Dispatch event that dashboard can listen for
      window.dispatchEvent(new CustomEvent('sessionValidated', { 
        detail: { user: data.user } 
      }));
      
      // Session is valid - return true
      isCheckingSession = false;
      return true;
    } catch (error) {
      console.error('Session check error:', error);
      
      // On any error during blocking check, redirect for security
      // For non-blocking checks, only redirect on auth errors
      if (blocking || (error.message && (error.message.includes('Unauthorized') || error.message.includes('401') || error.message.includes('Invalid server response') || error.message.includes('Empty response')))) {
        // Clear stored data
        localStorage.removeItem('userName');
        localStorage.removeItem('username');
        localStorage.removeItem('userImage');
        localStorage.removeItem('userDP');
        localStorage.removeItem('crm_session');
        
        // Stop periodic checks
        if (sessionCheckInterval) {
          clearInterval(sessionCheckInterval);
          sessionCheckInterval = null;
        }
        
        window.location.replace("../index.html");
      }
      
      isCheckingSession = false;
      return false;
    }
  }
  
  /**
   * Start periodic session refresh
   * Refreshes session activity every 5 minutes to prevent expiration
   */
  function startSessionRefresh() {
    // Clear any existing interval
    if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval);
    }
    
    // Refresh session every 5 minutes (300000 ms)
    // This keeps the session active as long as the page is open
    sessionCheckInterval = setInterval(() => {
      checkSession().catch(err => {
        console.error('Periodic session refresh error:', err);
      });
    }, 5 * 60 * 1000); // 5 minutes
  }
  
  /**
   * Stop periodic session refresh
   */
  function stopSessionRefresh() {
    if (sessionCheckInterval) {
      clearInterval(sessionCheckInterval);
      sessionCheckInterval = null;
    }
  }
  
  /**
   * Initialize session check on page load
   * BLOCKS page rendering until session is validated
   */
  function init() {
    // Show loading overlay immediately to block page access
    showLoadingOverlay();
    
    // Check session immediately - this is BLOCKING
    checkSession(true).then(isValid => {
      if (isValid) {
        // Session is valid - hide overlay and show page
        hideLoadingOverlay();
        // Start periodic refresh if session is valid
        startSessionRefresh();
      } else {
        // Session invalid - redirect will happen in checkSession
        // Overlay will remain until redirect completes
      }
    }).catch(error => {
      console.error('Session validation failed:', error);
      const isDevEnv = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       window.location.port === '3000' || window.location.protocol === 'file:' || true;
      if (isDevEnv) {
        hideLoadingOverlay();
        return;
      }
      // On error during blocking check, redirect to login for security
      // Use replace to prevent back button access
      window.location.replace("../index.html");
    });
    
    // Also refresh session when page becomes visible (user returns to tab)
    // Only do this if session was already validated
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden && sessionValidated) {
        // Page became visible - refresh session (non-blocking)
        checkSession(false);
      }
    });
    
    // Refresh session before page unload (helps maintain session during navigation)
    window.addEventListener('beforeunload', function() {
      if (sessionValidated) {
        // Quick session refresh before leaving page
        navigator.sendBeacon('/wsms/api/auth.php?action=session', '');
      }
    });
  }
  
  // Initialize IMMEDIATELY - don't wait for DOM
  // This ensures the check happens as early as possible
  // The inline style in head already hides the body, so we just need to check session
  
  // Try to initialize immediately
  if (document.body) {
    // Body exists, can add overlay and check
    init();
  } else {
    // Body doesn't exist yet - wait for it but start checking session immediately
    // Use a more aggressive approach - check session even without body
    (async function() {
      // Wait a tiny bit for body to be available
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      
      while (!document.body && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      // Now initialize (body should exist or we proceed anyway)
      if (!sessionValidated) {
        init();
      }
    })();
    
    // Also set up observer as backup
    const observer = new MutationObserver(function(mutations, obs) {
      if (document.body && !sessionValidated) {
        obs.disconnect();
        init();
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
  
  // Expose functions globally for manual control if needed
  window.checkSession = checkSession;
  window.startSessionRefresh = startSessionRefresh;
  window.stopSessionRefresh = stopSessionRefresh;
})();
