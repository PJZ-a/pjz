// Visual effects: particles, cursor glow, card spotlight tracking
const Effects = {
  init() {
    this.initParticles();
    this.initCursorGlow();
    this.initSpotlight();
    this.initSmoothScroll();
    this.initNavScroll();
  },

  /* === Nav scroll shadow === */
  initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  },

  /* Re-init spotlight for dynamically added cards */
  refreshSpotlight() {
    this.initSpotlight();
  },

  /* === Particle System with Connection Lines === */
  initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const MAX = 80;
    const CONNECT_DIST = 130;

    const theme = () => document.documentElement.getAttribute('data-theme') || 'dark';

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.reset(true);
      }
      reset(initial) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : -10;
        this.size = Math.random() * 2.2 + 0.6;
        this.speedY = Math.random() * 0.5 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fade = Math.random() * 0.004 + 0.0015;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.008 + this.pulseOffset) * 0.3;
        this.opacity -= this.fade;
        if (this.opacity <= 0 || this.y > canvas.height + 10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset(false);
          this.y = canvas.height + 5;
          this.opacity = Math.random() * 0.5 + 0.1;
          this.fade = Math.random() * 0.003 + 0.001;
        }
      }
      draw(ctx, isDark) {
        const r = isDark ? 180 : 20;
        const g = isDark ? 220 : 150;
        const b = isDark ? 200 : 140;
        // Glow circle
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        grad.addColorStop(0, `rgba(${r},${g},${b},${this.opacity})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, this.opacity * 1.5)})`;
        ctx.fill();
      }
    }

    // Create particles — mix of data nodes and ambient particles
    for (let i = 0; i < MAX; i++) particles.push(new Particle());

    // A few highlighted "data nodes"
    const dataNodes = [];
    for (let i = 0; i < 6; i++) {
      dataNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1.5,
        pulse: Math.random() * Math.PI * 2
      });
    }

    let frame = 0;
    const animate = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const isDark = theme() === 'dark';

      // Update and draw particles
      particles.forEach(p => { p.update(); p.draw(ctx, isDark); });

      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.12;
            const r = isDark ? 180 : 20;
            const g = isDark ? 220 : 150;
            const b = isDark ? 200 : 140;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw data nodes (pulsing connection hubs)
      dataNodes.forEach(node => {
        node.x += node.vx + Math.sin(frame * 0.02 + node.pulse) * 0.2;
        node.y += node.vy + Math.cos(frame * 0.02 + node.pulse) * 0.2;
        // Bounce
        if (node.x < 0) { node.x = 0; node.vx *= -1; }
        if (node.x > canvas.width) { node.x = canvas.width; node.vx *= -1; }
        if (node.y < 0) { node.y = 0; node.vy *= -1; }
        if (node.y > canvas.height) { node.y = canvas.height; node.vy *= -1; }

        const pulseSize = node.size + Math.sin(frame * 0.05 + node.pulse) * 1.2;
        const r = isDark ? 100 : 20;
        const g = isDark ? 200 : 140;
        const b = isDark ? 180 : 130;
        const a = 0.35 + Math.sin(frame * 0.05 + node.pulse) * 0.15;

        // Outer glow
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, pulseSize * 5);
        grad.addColorStop(0, `rgba(${r},${g},${b},${a})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${a * 1.5})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    // Update data node positions on resize
    window.addEventListener('resize', () => {
      dataNodes.forEach(node => {
        node.x = Math.min(node.x, canvas.width);
        node.y = Math.min(node.y, canvas.height);
      });
    });
  },

  /* === Cursor Glow === */
  initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.matchMedia('(max-width: 768px)').matches) {
      if (glow) glow.style.display = 'none';
      return;
    }

    let rafId;
    const onMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
        glow.style.opacity = '1';
      });
    };

    const onLeave = () => { glow.style.opacity = '0'; };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
  },

  /* === Card Spotlight === */
  initSpotlight() {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--spot-x', x + '%');
        card.style.setProperty('--spot-y', y + '%');
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--spot-x', '50%');
        card.style.setProperty('--spot-y', '50%');
      });
    });
  },

  /* === Smooth Scroll for anchor links === */
  initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => Effects.init());
