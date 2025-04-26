// js/main.js

// Handles mobile menu toggle, Google Analytics init, and project filtering

document.addEventListener('DOMContentLoaded', () => {
  // MOBILE MENU TOGGLE
  const menuBtn = document.getElementById('menu-btn');
  const menu    = document.getElementById('menu');
  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('hidden');
    menu.setAttribute('aria-hidden', String(expanded));
  });

  // GOOGLE ANALYTICS (GA4) INIT
  if (typeof gtag === 'function') {
    gtag('js', new Date());
    gtag('config', 'G-Z30T46JGHS');
  } else {
    console.warn('gtag function not found. Analytics not initialized.');
  }

  // PROJECT FILTERING
  const filterButtons = document.querySelectorAll('#project-filters .filter-btn');
  const projectCards  = document.querySelectorAll('#projects .grid > div[data-category]');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Ensure category is read before use
      const category = button.dataset.filter;
      console.log('Filter clicked:', category);

      // Update active button styles and aria-pressed
      filterButtons.forEach(btn => {
        const isActive = btn === button;
        btn.setAttribute('aria-pressed', String(isActive));
        btn.classList.toggle('bg-indigo-600', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('bg-gray-200', !isActive);
        btn.classList.toggle('text-gray-700', !isActive);
      });

      // Show/hide cards based on category
      projectCards.forEach(card => {
        const match = category === 'all' || card.dataset.category === category;
        card.classList.toggle('hidden', !match);
      });
    });
  });
});
