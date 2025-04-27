// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initGoogleAnalytics();
  initDarkMode();
  initFilters('#project-filters .filter-btn', '#projects .grid > div[data-category]', 'category', 'project');
  initFilters('#blog-filters .filter-btn', '#blog .grid article[data-tags]', 'tags', 'blog');
});

// MOBILE MENU HANDLING
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');

  const toggleMenu = () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('hidden');
    menu.setAttribute('aria-hidden', String(expanded));
  };

  menuBtn.addEventListener('click', toggleMenu);
}

// GOOGLE ANALYTICS INITIALIZATION
function initGoogleAnalytics() {
  if (typeof gtag !== 'function') {
    console.warn('gtag function not found. Analytics not initialized.');
    return;
  }

  gtag('js', new Date());
  gtag('config', 'G-Z30T46JGHS');
}

// DARK MODE HANDLING
function initDarkMode() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const storedTheme = localStorage.getItem('theme');

  // Set initial theme state
  let isDark = storedTheme === 'dark' || 
    (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const updateTheme = () => {
    document.documentElement.classList.toggle('dark', isDark);
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    
    if (typeof gtag === 'function') {
      gtag('event', 'theme_toggle', {
        theme: isDark ? 'dark' : 'light'
      });
    }
    
    updateTheme();
  });

  updateTheme(); // Initialize on load
}

// REUSABLE FILTER FUNCTION
function initFilters(buttonSelector, itemSelector, dataAttribute, eventCategory) {
  const buttons = document.querySelectorAll(buttonSelector);
  const items = document.querySelectorAll(itemSelector);

  const handleFilter = (selectedButton, filterValue) => {
    // Update button states
    buttons.forEach(btn => {
      const isActive = btn === selectedButton;
      btn.setAttribute('aria-pressed', String(isActive));
      btn.classList.toggle('bg-indigo-600', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('bg-gray-200', !isActive);
      btn.classList.toggle('text-gray-700', !isActive);
    });

    // Filter items
    items.forEach(item => {
      const itemValues = item.dataset[dataAttribute].split(',').map(v => v.trim());
      const shouldShow = filterValue === 'all' || itemValues.includes(filterValue);
      item.classList.toggle('hidden', !shouldShow);
    });

    // Analytics tracking
    if (typeof gtag === 'function') {
      gtag('event', 'filter_click', {
        event_category: eventCategory,
        value: filterValue
      });
    }
  };

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      handleFilter(button, button.dataset.filter);
    });
  });
}