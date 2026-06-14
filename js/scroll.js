// Scroll-triggered fade-in animations using Intersection Observer
// When GSAP is active, this is disabled to avoid conflicts
const ScrollAnim = {
  enabled: true,

  init() {
    if (!this.enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
  }
};

document.addEventListener('DOMContentLoaded', () => ScrollAnim.init());
