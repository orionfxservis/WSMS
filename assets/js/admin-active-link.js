/**
 * Admin Active Link Highlighter
 * Sets active state on sidebar links based on current page URL
 * Runs immediately without waiting for layout injection
 */
(function() {
  'use strict';

  function setActiveLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.sidebar .nav a');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      // Remove query params and hash for comparison
      const linkPath = href.split('?')[0].split('#')[0];
      const currentPathClean = currentPath.split('?')[0].split('#')[0];
      
      // Check if current path matches link
      if (currentPathClean.endsWith(linkPath) || currentPathClean.includes(linkPath)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Run immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setActiveLink);
  } else {
    setActiveLink();
  }
})();

