// Dark/light theme toggle with system preference detection and localStorage persistence
const Theme = {
  KEY: 'pjz-theme',

  init() {
    const saved = localStorage.getItem(this.KEY);
    if (saved) {
      this.set(saved);
    } else {
      this.set(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    // Listen for system changes when no manual preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.KEY)) this.set(e.matches ? 'dark' : 'light');
    });
  },

  toggle() {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    this.set(next);
    localStorage.setItem(this.KEY, next);
  },

  set(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
};

document.addEventListener('DOMContentLoaded', () => Theme.init());
