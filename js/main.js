document.addEventListener('DOMContentLoaded', () => {
  try {
    // Initialize all components
    const components = [
      { name: 'Mobile Menu', init: initMobileMenu },
      { name: 'Dark Mode', init: initDarkMode },
      { name: 'Project Filters', init: () => initFilters(
        '#project-filters .filter-btn', 
        '#projects .grid > a[data-category]', 
        'category', 
        'project'
      )},
      { name: 'Blog Filters', init: () => initFilters(
        '#blog-filters .filter-btn', 
        '#blog .grid article[data-tags]', 
        'tags', 
        'blog'
      )},
      // Analytics is initialized separately after consent
    ];
    
    // Initialize each component with error handling
    components.forEach(component => {
      try {
        component.init();
      } catch (error) {
        console.error(`Error initializing ${component.name}:`, error);
      }
    });
    
    // Handle cookie consent and analytics
    initCookieConsent();
  } catch (error) {
    console.error('Error during page initialization:', error);
    // Display a user-friendly error message if needed
  }
});

/**
 * Initialize the mobile menu functionality with keyboard accessibility
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  
  // Exit if elements don't exist
  if (!menuBtn || !menu) {
    console.warn('Mobile menu elements not found');
    return;
  }
  
  // Provide a CSS-only fallback for no-JS environments
  document.body.classList.add('js-enabled');
  
  const toggleMenu = () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('hidden');
    menu.setAttribute('aria-hidden', String(expanded));
    
    // If menu is opening, focus the first item
    if (!expanded) {
      const firstMenuItem = menu.querySelector('a');
      if (firstMenuItem) {
        setTimeout(() => firstMenuItem.focus(), 100);
      }
    }
  };
  
  // Click handler
  menuBtn.addEventListener('click', toggleMenu);
  
  // Keyboard handler
  menuBtn.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMenu();
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    if (menu.classList.contains('hidden')) return;
    if (!menu.contains(event.target) && event.target !== menuBtn) {
      toggleMenu();
    }
  });
  
  // Close menu on Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.classList.contains('hidden')) {
      toggleMenu();
      menuBtn.focus();
    }
  });
}

/**
 * Initialize dark mode functionality
 */
function initDarkMode() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // Exit if elements don't exist
  if (!themeToggle || !themeIcon) {
    console.warn('Theme toggle elements not found');
    return;
  }
  
  const storedTheme = localStorage.getItem('theme');
  
  // Set initial theme state based on user preference or system preference
  let isDark = storedTheme === 'dark' || 
    (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const updateTheme = () => {
    // Apply dark class to HTML element for Tailwind
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Update icon
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    
    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Debug log
    console.log('Dark mode updated:', isDark);
    
    // Announce theme change to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = `Theme changed to ${isDark ? 'dark' : 'light'} mode`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      announcement.remove();
    }, 3000);
  };
  
  // Initialize theme on page load
  updateTheme();
  
  // Toggle theme on button click with debounce
  let themeToggleTimeout;
  themeToggle.addEventListener('click', () => {
    if (themeToggleTimeout) return;
    
    themeToggleTimeout = setTimeout(() => {
      themeToggleTimeout = null;
    }, 200);
    
    isDark = !isDark;
    updateTheme();
    
    // Analytics tracking if available
    if (window.analyticsConsent && typeof trackEvent === 'function') {
      trackEvent('theme_toggle', {
        theme: isDark ? 'dark' : 'light' 
      });
    }
  });
  
  // Keyboard accessibility
  themeToggle.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      themeToggle.click();
    }
  });
  
  // Ensure toggle is focusable
  themeToggle.setAttribute('tabindex', '0');
  
  // Listen for system preference changes
  try {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Modern browsers
    if (typeof darkModeMediaQuery.addEventListener === 'function') {
      darkModeMediaQuery.addEventListener('change', (e) => {
        // Only update if user hasn't explicitly set a preference
        if (!localStorage.getItem('theme')) {
          isDark = e.matches;
          updateTheme();
        }
      });
    } 
    // Legacy browsers
    else if (typeof darkModeMediaQuery.addListener === 'function') {
      darkModeMediaQuery.addListener((e) => {
        // Only update if user hasn't explicitly set a preference
        if (!localStorage.getItem('theme')) {
          isDark = e.matches;
          updateTheme();
        }
      });
    }
  } catch (error) {
    console.warn('Could not set up system theme preference listener:', error);
  }
}

/**
 * Initialize content filtering system with improved accessibility
 * 
 * @param {string} buttonSelector - CSS selector for filter buttons
 * @param {string} itemSelector - CSS selector for filterable items
 * @param {string} dataAttribute - Data attribute name to filter by
 * @param {string} eventCategory - Category name for analytics
 */
function initFilters(buttonSelector, itemSelector, dataAttribute, eventCategory) {
  const buttons = document.querySelectorAll(buttonSelector);
  const items = document.querySelectorAll(itemSelector);
  
  // Exit if no buttons or items found
  if (!buttons.length || !items.length) {
    console.warn(`Filter elements not found: ${buttonSelector} or ${itemSelector}`);
    return;
  }
  
  // Create keyboard navigation group
  buttons.forEach((button, index) => {
    button.setAttribute('tabindex', '0');
    button.setAttribute('role', 'button');
    
    // Add keyboard navigation
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        button.click();
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        const nextButton = buttons[(index + 1) % buttons.length];
        nextButton.focus();
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        const prevButton = buttons[(index - 1 + buttons.length) % buttons.length];
        prevButton.focus();
      }
    });
  });
  
  // Track the current filter value
  let currentFilter = 'all';
  
  const handleFilter = (selectedButton, filterValue) => {
    // Skip if already selected
    if (currentFilter === filterValue) return;
    currentFilter = filterValue;
    
    // Update button states
    buttons.forEach(btn => {
      const isActive = btn === selectedButton;
      btn.setAttribute('aria-pressed', String(isActive));
      btn.classList.toggle('bg-indigo-600', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('bg-gray-200', !isActive);
      btn.classList.toggle('dark:bg-gray-700', !isActive);
      btn.classList.toggle('text-gray-700', !isActive);
      btn.classList.toggle('dark:text-gray-200', !isActive);
    });
    
    // Filter items with animation
    items.forEach(item => {
      const itemValues = item.dataset[dataAttribute]?.split(',').map(v => v.trim()) || [];
      const shouldShow = filterValue === 'all' || itemValues.includes(filterValue);
      
      // Apply transition
      item.style.transition = 'opacity 0.3s ease';
      if (shouldShow) {
        item.classList.remove('hidden');
        // Small delay to ensure 'hidden' is removed before changing opacity
        setTimeout(() => {
          item.style.opacity = '1';
        }, 10);
      } else {
        item.style.opacity = '0';
        setTimeout(() => {
          item.classList.add('hidden');
        }, 300); // Match transition duration
      }
    });
    
    // Announce filter change to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = `Filtered by ${filterValue}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      announcement.remove();
    }, 3000);
    
    // Analytics tracking is now handled separately after consent
    if (window.analyticsConsent && typeof trackEvent === 'function') {
      trackEvent('filter_click', {
        event_category: eventCategory,
        value: filterValue
      });
    }
  };
  
  // Add event listeners to buttons
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const filterValue = button.dataset.filter;
      if (!filterValue) return;
      handleFilter(button, filterValue);
    });
  });
}

/**
 * Initialize cookie consent banner and handle analytics loading
 */
function initCookieConsent() {
  // Check if consent was already given
  const consent = localStorage.getItem('analytics_consent');
  window.analyticsConsent = consent === 'true';
  
  if (window.analyticsConsent) {
    // Load analytics if consent was previously given
    loadAnalytics();
    return;
  }
  
  // Create consent banner if it doesn't exist yet
  if (!document.getElementById('cookie-consent')) {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent';
    banner.className = 'fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex flex-col sm:flex-row items-center justify-between z-50';
    
    banner.innerHTML = `
      <div class="mb-2 sm:mb-0">
        This website uses cookies to improve your experience and analyze site traffic.
      </div>
      <div class="flex space-x-2">
        <button id="reject-cookies" class="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
          Reject
        </button>
        <button id="accept-cookies" class="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Accept
        </button>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // Handle consent choices
    document.getElementById('accept-cookies').addEventListener('click', () => {
      localStorage.setItem('analytics_consent', 'true');
      window.analyticsConsent = true;
      loadAnalytics();
      banner.remove();
    });
    
    document.getElementById('reject-cookies').addEventListener('click', () => {
      localStorage.setItem('analytics_consent', 'false');
      window.analyticsConsent = false;
      banner.remove();
    });
  }
}

/**
 * Load Google Analytics script
 */
function loadAnalytics() {
  // Don't load if already loaded
  if (window.gtagLoaded) return;
  
  try {
    // Create and load the gtag script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-Z30T46JGHS';
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    
    gtag('js', new Date());
    gtag('config', 'G-Z30T46JGHS', {
      anonymize_ip: true,
      allow_ad_personalization_signals: false
    });
    
    window.gtagLoaded = true;
  } catch (error) {
    console.error('Failed to load analytics:', error);
  }
}

/**
 * Centralized analytics tracking function
 * 
 * @param {string} eventName - Name of the event to track
 * @param {Object} params - Additional parameters for the event
 */
function trackEvent(eventName, params = {}) {
  if (!window.analyticsConsent) return;
  
  try {
    if (typeof gtag === 'function') {
      gtag('event', eventName, params);
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
}

/**
 * Add a simple error reporting mechanism
 */
window.addEventListener('error', (event) => {
  console.error('Runtime error:', event.error);
  // Could send to a server-side error logging service
});

// Add no-JS fallback
document.addEventListener('DOMContentLoaded', () => {
  // Add a class to the body to indicate JS is available
  document.body.classList.add('js-enabled');
  
  // Remove no-JS styling
  const noJSElements = document.querySelectorAll('.no-js');
  noJSElements.forEach(el => el.classList.remove('no-js'));
});
