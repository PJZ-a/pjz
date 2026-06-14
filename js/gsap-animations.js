/**
 * GSAP Animations — 入场动画 + 滚动揭示
 */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof gsap === 'undefined') console.warn('GSAP not loaded');
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ duration: 0.6, ease: 'power3.out' });

  // ── 无障碍：尊重用户减少动效偏好 ────────────────
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const dur = (d) => prefersReduced ? 0 : d;
  const stag = (s) => prefersReduced ? 0 : s;

  /* ================================================================
   *  0. 初始状态
   * ================================================================ */
  gsap.set('.hero-illustration',  { autoAlpha: 0, scale: 0, rotation: -180 });
  gsap.set('.agent-badge',       { autoAlpha: 0, y: -30 });
  gsap.set('h1',                  { autoAlpha: 0, y: 40, scale: 0.9 });
  gsap.set('.hero-identity',     { autoAlpha: 0, y: 20 });
  gsap.set('.muted',              { autoAlpha: 0, y: 15 });
  gsap.set('.summary',           { autoAlpha: 0, y: 20 });
  gsap.set('.quick .btn',        { autoAlpha: 0, y: 30, scale: 0.7 });
  gsap.set('.nav',                { autoAlpha: 0, y: -60 });
  gsap.set('.card, .section-divider, .footer', { autoAlpha: 0, y: 40 });
  gsap.set('.contact img',       { autoAlpha: 0, scale: 0.4, rotation: 15 });
  gsap.set('.contact p',         { autoAlpha: 0, y: 15 });

  /* ================================================================
   *  1. HERO 入场 — 绝对时间定位，可靠无延迟
   * ================================================================ */
  const heroTL = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTL
    // 0.00s SVG 插画旋转弹入
    .to('.hero-illustration', {
      scale: 1, rotation: 0, autoAlpha: 1,
      duration: dur(0.7), ease: 'back.out(1.3)',
    }, 0)
    // 0.20s 徽章掉落
    .to('.agent-badge', {
      y: 0, autoAlpha: 1,
      duration: dur(0.4), ease: 'back.out(1.7)',
    }, 0.20)
    // 0.25s 姓名（徽章开始后仅 0.05s）
    .to('h1', {
      y: 0, autoAlpha: 1, scale: 1,
      duration: dur(0.25), ease: 'power3.out',
    }, 0.25)
    // 0.35s 身份行
    .to('.hero-identity', {
      y: 0, autoAlpha: 1,
      duration: dur(0.2),
    }, 0.35)
    // 0.40s 籍贯
    .to('.muted', {
      y: 0, autoAlpha: 1,
      duration: dur(0.18),
    }, 0.40)
    // 0.45s 简介
    .to('.summary', {
      y: 0, autoAlpha: 1,
      duration: dur(0.25),
    }, 0.45)
    // 0.52s 按钮
    .to('.quick .btn', {
      y: 0, autoAlpha: 1, scale: 1,
      stagger: stag(0.05), ease: 'back.out(2)',
      duration: dur(0.3),
    }, 0.52)
    // 0.55s 徽章光晕脉冲
    .to('.agent-badge', {
      boxShadow: '0 0 50px rgba(20,184,166,0.45)',
      duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1,
    }, 0.55)
    // 0.70s SVG 持续慢转
    .to('.hero-illustration', {
      rotation: 360,
      duration: 25, ease: 'none', repeat: -1,
    }, 0.70);

  // ── 导航栏 ──────────────────────────────────────
  gsap.to('.nav', {
    y: 0, autoAlpha: 1,
    duration: dur(0.5), ease: 'power3.out', delay: 0.05,
  });

  /* ================================================================
   *  2. 背景 Blob 视差（纯装饰，不影响任何内容元素）
   * ================================================================ */
  if (!prefersReduced) {
    gsap.to('.blob-1', {
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.8 },
      y: 200, x: 100, scale: 1.3, ease: 'none',
    });
    gsap.to('.blob-2', {
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.9 },
      y: -160, x: -80, scale: 0.8, ease: 'none',
    });
    gsap.to('.blob-3', {
      scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.7 },
      y: -100, x: 120, scale: 1.2, ease: 'none',
    });
  }

  /* ================================================================
   *  3. 卡片 — 滚动到位揭示一次，永久保持
   * ================================================================ */
  gsap.utils.toArray('.card').forEach((card) => {
    gsap.to(card, {
      scrollTrigger: { trigger: card, start: isMobile ? 'top 94%' : 'top 88%', once: true },
      y: 0, autoAlpha: 1,
      duration: dur(0.7), ease: 'power3.out',
    });

    // 图标
    const icon = card.querySelector('.section-icon');
    if (icon) {
      gsap.set(icon, { scale: 0, rotation: -90 });
      gsap.to(icon, {
        scrollTrigger: { trigger: card, start: isMobile ? 'top 90%' : 'top 84%', once: true },
        scale: 1, rotation: 0,
        duration: dur(0.35), ease: 'back.out(1.5)',
      });
    }

    // 技能标签
    const tags = card.querySelectorAll('.skills li');
    if (tags.length) {
      gsap.set(tags, { y: 15, autoAlpha: 0 });
      gsap.to(tags, {
        scrollTrigger: { trigger: card, start: isMobile ? 'top 88%' : 'top 80%', once: true },
        y: 0, autoAlpha: 1,
        stagger: stag(0.03), duration: dur(0.3), ease: 'power3.out',
      });
    }

    // 技能分组标题
    const headings = card.querySelectorAll('.skill-group h3');
    if (headings.length) {
      gsap.set(headings, { x: -12, autoAlpha: 0 });
      gsap.to(headings, {
        scrollTrigger: { trigger: card, start: isMobile ? 'top 86%' : 'top 78%', once: true },
        x: 0, autoAlpha: 1,
        stagger: stag(0.05), duration: dur(0.3), ease: 'power3.out',
      });
    }
  });

  /* ================================================================
   *  4. 分区线
   * ================================================================ */
  gsap.utils.toArray('.section-divider').forEach((divider) => {
    gsap.to(divider, {
      scrollTrigger: { trigger: divider, start: 'top 94%', once: true },
      scaleX: 1, autoAlpha: 1,
      duration: dur(0.4), ease: 'power3.inOut',
    });
    const diamond = divider.querySelector('span');
    if (diamond) {
      gsap.set(diamond, { scale: 0, rotation: 60 });
      gsap.to(diamond, {
        scrollTrigger: { trigger: divider, start: 'top 92%', once: true },
        scale: 1, rotation: 0,
        duration: dur(0.25), ease: 'back.out(1.5)', delay: 0.2,
      });
    }
  });

  /* ================================================================
   *  5. 联系方式
   * ================================================================ */
  gsap.to('.contact img', {
    scrollTrigger: { trigger: '#contact', start: 'top 82%', once: true },
    scale: 1, autoAlpha: 1, rotation: 0,
    duration: dur(0.5), ease: 'back.out(1.3)',
  });
  gsap.to('.contact p', {
    scrollTrigger: { trigger: '#contact', start: 'top 84%', once: true },
    y: 0, autoAlpha: 1,
    stagger: stag(0.04), duration: dur(0.35), ease: 'power3.out',
  });
  gsap.fromTo('.contact .btn',
    { autoAlpha: 0, y: 15, scale: 0.85 },
    {
      scrollTrigger: { trigger: '#contact', start: 'top 80%', once: true },
      autoAlpha: 1, y: 0, scale: 1,
      stagger: stag(0.06), duration: dur(0.4), ease: 'back.out(1.2)',
    }
  );

  /* ================================================================
   *  6. 页脚
   * ================================================================ */
  gsap.to('.footer', {
    scrollTrigger: { trigger: '.footer', start: 'top 97%', once: true },
    y: 0, autoAlpha: 1,
    duration: dur(0.4), ease: 'power3.out',
  });

  /* ================================================================
   *  7. 动态文章卡片
   * ================================================================ */
  function animatePosts(scope) {
    const posts = (scope || document).querySelectorAll('.post-card:not(.gsap-done)');
    if (!posts.length) return;
    posts.forEach((post) => {
      post.classList.add('gsap-done');
      gsap.set(post, { x: -30, autoAlpha: 0 });
      gsap.to(post, {
        scrollTrigger: { trigger: post, start: isMobile ? 'top 94%' : 'top 90%', once: true },
        x: 0, autoAlpha: 1,
        duration: dur(0.4), ease: 'power3.out',
      });
      const tags = post.querySelectorAll('.tag');
      if (tags.length) {
        gsap.set(tags, { y: 6, autoAlpha: 0 });
        gsap.to(tags, {
          scrollTrigger: { trigger: post, start: isMobile ? 'top 92%' : 'top 87%', once: true },
          y: 0, autoAlpha: 1,
          stagger: stag(0.02), duration: dur(0.2), ease: 'power3.out',
        });
      }
    });
  }
  animatePosts();

  /* ================================================================
   *  8. 动态项目卡片
   * ================================================================ */
  function animateProjects(scope) {
    const cards = (scope || document).querySelectorAll('.project-card:not(.gsap-done)');
    if (!cards.length) return;
    cards.forEach((card) => {
      card.classList.add('gsap-done');
      gsap.set(card, { y: 30, autoAlpha: 0, scale: 0.92 });
      gsap.to(card, {
        scrollTrigger: { trigger: card, start: isMobile ? 'top 92%' : 'top 88%', once: true },
        y: 0, autoAlpha: 1, scale: 1,
        duration: dur(0.45), ease: 'back.out(1.1)',
      });
      const icon = card.querySelector('.tech-icon');
      if (icon) {
        gsap.set(icon, { scale: 0, rotation: -30 });
        gsap.to(icon, {
          scrollTrigger: { trigger: card, start: isMobile ? 'top 90%' : 'top 85%', once: true },
          scale: 1, rotation: 0,
          duration: dur(0.3), ease: 'back.out(1.4)', delay: 0.08,
        });
      }
    });
  }
  animateProjects();

  window.GSAPAnimate = {
    projects: (c) => animateProjects(c),
    posts: (c) => animatePosts(c),
    refresh: () => ScrollTrigger.refresh(),
  };

  // ── 加载后刷新 ──────────────────────────────────
  window.addEventListener('load', () => ScrollTrigger.refresh());

  // ── 禁用冲突 CSS 动画、禁用 CSS 滚动动画系统 ────
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof ScrollAnim !== 'undefined') ScrollAnim.enabled = false;
    document.querySelectorAll('.fade-up').forEach((el) => {
      el.style.transition = 'none';
      el.classList.remove('visible');
    });
    // 禁用与 GSAP 冲突的 CSS animation
    const ill = document.querySelector('.hero-illustration');
    if (ill) ill.style.animation = 'none';
    const badge = document.querySelector('.agent-badge');
    if (badge) badge.style.animation = 'none';
  });
})();

// ── GSAP 不可用时的 CSS 回退 ───────────────────────
(function () {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') return;
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fade-up').forEach((el) => {
      el.style.transition = '';
      el.classList.remove('visible');
    });
    if (typeof ScrollAnim !== 'undefined') {
      ScrollAnim.enabled = true;
      ScrollAnim.init();
    }
  });
})();
