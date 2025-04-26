// js/main.js

// Handles mobile menu toggle and Google Analytics initialization

document.addEventListener('DOMContentLoaded', () => {
  // MOBILE MENU TOGGLE
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
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
});
