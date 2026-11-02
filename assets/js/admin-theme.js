/**
 * Admin Theme Toggle System
 * Handles theme switching between light and dark modes
 */

(function() {
  'use strict';

  const THEME_KEY = 'wsms_admin_theme';
  const DEFAULT_THEME = 'dark';

  /**
   * Initialize theme on page load
   */
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || DEFAULT_THEME;
    applyTheme(savedTheme);
    updateThemeToggle(savedTheme);
  }

  /**
   * Apply theme to document
   */
  function applyTheme(theme) {
    const body = document.body;
    const html = document.documentElement;
    
    // Remove existing theme classes
    body.classList.remove('theme-light', 'theme-dark');
    html.classList.remove('theme-light', 'theme-dark');
    
    // Add new theme class
    body.classList.add(`theme-${theme}`);
    html.classList.add(`theme-${theme}`);
    
    // Save to localStorage
    localStorage.setItem(THEME_KEY, theme);
  }

  /**
   * Update theme toggle switch state
   */
  function updateThemeToggle(theme) {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.checked = theme === 'light';
    }
  }

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    const currentTheme = document.body.classList.contains('theme-light') ? 'light' : 'dark';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    updateThemeToggle(newTheme);
  }

  /**
   * Get current theme
   */
  function getCurrentTheme() {
    return document.body.classList.contains('theme-light') ? 'light' : 'dark';
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }

  // Expose toggle function globally
  window.toggleTheme = toggleTheme;
  window.getCurrentTheme = getCurrentTheme;
  window.applyTheme = applyTheme;

})();

