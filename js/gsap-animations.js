/**
 * GSAP Animations — scroll-driven reveals, parallax, entrance timelines
 * Depends on: gsap.min.js, ScrollTrigger.min.js (loaded before this file)
 */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof gsap === 'undefined') console.warn('GSAP not loaded — animations disabled');
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ── Defaults ────────────────────────────────────────────
  gsap.defaults({ duration: 0.7, ease: 'power3.out' });

  // ── Responsive + reduced-motion ─────────────────────────
  const mm = gsap.matchMedia();

  mm.add(
    {
      reduceMotion: '(prefers-reduced-motion: reduce)',
      isMobile: '(max-width: 768px)',
      isDesktop: '(min-width: 769px)',
    },
    (ctx) => {
      const { reduceMotion, isMobile, isDesktop } = ctx.conditions;
      const dur = (d = 0.7) => (reduceMotion ? 0 : d);
      const stagger = (s = 0.08) => (reduceMotion ? 0 : s);

      /* ================================================================
       *  0. INITIAL STATE — 用 gsap.set() 设定所有需要滚动揭示的元素
       *     不用 CSS opacity:0，因为 gsap.from() 会读到它造成目标不可见
       * ================================================================ */
      gsap.set('.card, .section-divider, .footer, .post-card, .project-card, .scroll-hint', {
        autoAlpha: 0,
        y: 70,
      });
      gsap.set('.contact .qr img, .contact img', { autoAlpha: 0, scale: 0.4, rotation: 15 });
      gsap.set('.contact p', { autoAlpha: 0, y: 20 });
      gsap.set('.contact .btn', { autoAlpha: 0, y: 20, scale: 0.8 });
      gsap.set('.hero-illustration', { autoAlpha: 0, scale: 0, rotation: -180 });
      gsap.set('.agent-badge', { autoAlpha: 0 });
      gsap.set('h1', { autoAlpha: 0, y: 60, scale: 0.85 });
      gsap.set('.hero-identity', { autoAlpha: 0, y: 30 });
      gsap.set('.muted', { autoAlpha: 0, y: 20 });
      gsap.set('.summary', { autoAlpha: 0, y: 30 });
      gsap.set('.quick .btn', { autoAlpha: 0, y: 40, scale: 0.6 });
      gsap.set('.nav', { autoAlpha: 0, y: -80 });

      /* ================================================================
       *  1. HERO ENTRANCE TIMELINE
       *     改用 gsap.to() — 因为初始状态已由 gsap.set() 设定
       * ================================================================ */
      const heroTL = gsap.timeline({
        defaults: { duration: dur(0.75), ease: 'power4.out' },
      });

      heroTL
        // ═══ Hero 插画：旋转 + 缩放弹入 ═══
        .to('.hero-illustration', {
          scale: 1,
          rotation: 0,
          autoAlpha: 1,
          duration: dur(1.0),
          ease: 'back.out(1.5)',
        })
        // ═══ Agent 徽章：从上方掉落 ═══
        .to(
          '.agent-badge',
          { y: 0, autoAlpha: 1, duration: dur(0.55), ease: 'back.out(1.7)' },
          '-=0.35',
        )
        // 徽章脉冲光晕
        .to('.agent-badge', {
          boxShadow: '0 0 40px rgba(20,184,166,0.35)',
          duration: 1.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        }, '-=0.3')
        // ═══ 姓名 ═══
        .to('h1', {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: dur(0.75),
          ease: 'power4.out',
        }, '-=0.2')
        // ═══ 身份行 ═══
        .to('.hero-identity', { y: 0, autoAlpha: 1 }, '-=0.15')
        // ═══ 籍贯 ═══
        .to('.muted', { y: 0, autoAlpha: 1 }, '-=0.1')
        // ═══ 简介段落 ═══
        .to('.summary', { y: 0, autoAlpha: 1, duration: dur(0.8) }, '-=0.1')
        // ═══ 按钮：弹性弹入 ═══
        .to(
          '.quick .btn',
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            stagger: stagger(0.12),
            ease: 'back.out(2.5)',
            duration: dur(0.7),
          },
          '-=0.1',
        )
        // ═══ 向下滚动提示 ═══
        .to('.scroll-hint', { autoAlpha: 0.5, y: 0 }, '-=0.05');

      /* ================================================================
       *  2. NAV BAR — slide down on load
       * ================================================================ */
      gsap.to('.nav', {
        y: 0,
        autoAlpha: 1,
        duration: dur(0.7),
        ease: 'power3.out',
        delay: 0.15,
      });

      /* ================================================================
       *  3. HERO ILLUSTRATION — parallax shrink on scroll
       * ================================================================ */
      if (isDesktop && !reduceMotion) {
        gsap.to('.hero-illustration', {
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
          y: 60,
          scale: 0.8,
          autoAlpha: 0.2,
          ease: 'none',
        });

        gsap.to('.agent-badge', {
          scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
          y: -20,
          autoAlpha: 0,
          ease: 'none',
        });
      }

      /* ================================================================
       *  4. FLOATING BLOBS — depth parallax
       * ================================================================ */
      if (!reduceMotion) {
        gsap.to('.blob-1', {
          scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.8 },
          y: 200,
          x: 100,
          scale: 1.3,
          ease: 'none',
        });
        gsap.to('.blob-2', {
          scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.9 },
          y: -160,
          x: -80,
          scale: 0.8,
          ease: 'none',
        });
        gsap.to('.blob-3', {
          scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.7 },
          y: -100,
          x: 120,
          scale: 1.2,
          ease: 'none',
        });
      }

      /* ================================================================
       *  5. SECTION CARDS — 滚动触发揭示 + 内容交错
       *     全部改用 gsap.to()，初始状态已由 gsap.set() 设定
       * ================================================================ */
      gsap.utils.toArray('.card').forEach((card) => {
        // 卡片主体 — 从下方淡入
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: isMobile ? 'top 92%' : 'top 85%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
          },
          y: 0,
          autoAlpha: 1,
          duration: dur(0.9),
          ease: 'power3.out',
        });

        // Section icon — 旋转弹入
        const sectionIcon = card.querySelector('.section-icon');
        if (sectionIcon) {
          gsap.set(sectionIcon, { scale: 0, rotation: -120 });
          gsap.to(sectionIcon, {
            scrollTrigger: {
              trigger: card,
              start: isMobile ? 'top 88%' : 'top 82%',
              toggleActions: 'play none none reverse',
            },
            scale: 1,
            rotation: 0,
            duration: dur(0.55),
            ease: 'back.out(2)',
          });
        }

        // 技能标签 — 交错弹入
        const skillTags = card.querySelectorAll('.skills li');
        if (skillTags.length) {
          gsap.set(skillTags, { y: 25, autoAlpha: 0, scale: 0.7 });
          gsap.to(skillTags, {
            scrollTrigger: {
              trigger: card,
              start: isMobile ? 'top 85%' : 'top 78%',
              toggleActions: 'play none none reverse',
            },
            y: 0,
            autoAlpha: 1,
            scale: 1,
            stagger: stagger(0.04),
            duration: dur(0.4),
            ease: 'back.out(1.8)',
          });
        }

        // 技能分组标题 — 从左侧淡入
        const groupHeadings = card.querySelectorAll('.skill-group h3');
        if (groupHeadings.length) {
          gsap.set(groupHeadings, { x: -20, autoAlpha: 0 });
          gsap.to(groupHeadings, {
            scrollTrigger: {
              trigger: card,
              start: isMobile ? 'top 84%' : 'top 76%',
              toggleActions: 'play none none reverse',
            },
            x: 0,
            autoAlpha: 1,
            stagger: stagger(0.08),
            duration: dur(0.4),
            ease: 'power3.out',
          });
        }
      });

      /* ================================================================
       *  6. SECTION DIVIDERS — 从中心扩展
       * ================================================================ */
      gsap.utils.toArray('.section-divider').forEach((divider) => {
        gsap.to(divider, {
          scrollTrigger: {
            trigger: divider,
            start: 'top 92%',
            toggleActions: 'play none none reverse',
          },
          scaleX: 1,
          autoAlpha: 1,
          duration: dur(0.6),
          ease: 'power3.inOut',
          transformOrigin: 'center center',
        });

        // 菱形图标 — 弹出
        const diamond = divider.querySelector('span');
        if (diamond) {
          gsap.set(diamond, { scale: 0, rotation: 90 });
          gsap.to(diamond, {
            scrollTrigger: {
              trigger: divider,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            scale: 1,
            rotation: 0,
            duration: dur(0.35),
            ease: 'back.out(2)',
            delay: 0.3,
          });
        }
      });

      /* ================================================================
       *  7. CONTACT SECTION — QR 弹入 + 链接交错 + 按钮弹入
       * ================================================================ */
      gsap.to('.contact img', {
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
        scale: 1,
        autoAlpha: 1,
        rotation: 0,
        duration: dur(0.7),
        ease: 'back.out(1.7)',
      });

      gsap.to('.contact p', {
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
        y: 0,
        autoAlpha: 1,
        stagger: stagger(0.06),
        duration: dur(0.45),
        ease: 'power3.out',
      });

      gsap.to('.contact .btn', {
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
        y: 0,
        autoAlpha: 1,
        scale: 1,
        stagger: stagger(0.1),
        duration: dur(0.5),
        ease: 'back.out(1.5)',
      });

      /* ================================================================
       *  8. FOOTER — 温和上升
       * ================================================================ */
      gsap.to('.footer', {
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 96%',
          toggleActions: 'play none none reverse',
        },
        y: 0,
        autoAlpha: 1,
        duration: dur(0.6),
        ease: 'power3.out',
      });

      /* ================================================================
       *  9. POST CARDS — 从左侧滑入（静态 + 动态内容）
       * ================================================================ */
      function animatePosts(scope) {
        const posts = (scope || document).querySelectorAll('.post-card:not(.gsap-done)');
        if (!posts.length) return;
        posts.forEach((post) => {
          post.classList.add('gsap-done');
          gsap.set(post, { x: -50, autoAlpha: 0 });
          gsap.to(post, {
            scrollTrigger: {
              trigger: post,
              start: isMobile ? 'top 92%' : 'top 88%',
              toggleActions: 'play none none reverse',
            },
            x: 0,
            autoAlpha: 1,
            duration: dur(0.55),
            ease: 'power3.out',
          });
          // 标签淡入交错
          const tags = post.querySelectorAll('.tag');
          if (tags.length) {
            gsap.set(tags, { y: 10, autoAlpha: 0 });
            gsap.to(tags, {
              scrollTrigger: {
                trigger: post,
                start: isMobile ? 'top 90%' : 'top 85%',
                toggleActions: 'play none none reverse',
              },
              y: 0,
              autoAlpha: 1,
              stagger: stagger(0.04),
              duration: dur(0.3),
              ease: 'power3.out',
            });
          }
        });
      }

      // 初始扫描
      animatePosts();

      /* ================================================================
       *  10. PROJECT CARDS — 缩放 + 上升交错（动态内容）
       * ================================================================ */
      function animateProjects(scope) {
        const cards = (scope || document).querySelectorAll('.project-card:not(.gsap-done)');
        if (!cards.length) return;
        cards.forEach((card) => {
          card.classList.add('gsap-done');
          gsap.set(card, { y: 40, autoAlpha: 0, scale: 0.88 });
          gsap.to(card, {
            scrollTrigger: {
              trigger: card,
              start: isMobile ? 'top 90%' : 'top 85%',
              toggleActions: 'play none none reverse',
            },
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: dur(0.65),
            ease: 'back.out(1.3)',
          });
          // 技术图标 — 弹出
          const icon = card.querySelector('.tech-icon');
          if (icon) {
            gsap.set(icon, { scale: 0, rotation: -60 });
            gsap.to(icon, {
              scrollTrigger: {
                trigger: card,
                start: isMobile ? 'top 88%' : 'top 83%',
                toggleActions: 'play none none reverse',
              },
              scale: 1,
              rotation: 0,
              duration: dur(0.4),
              ease: 'back.out(2)',
              delay: 0.1,
            });
          }
        });
      }

      // 初始扫描
      animateProjects();

      // 暴露给动态内容调用（render.js）
      window.GSAPAnimate = {
        projects: (container) => animateProjects(container),
        posts: (container) => animatePosts(container),
        refresh: () => ScrollTrigger.refresh(),
      };
    },
  );

  // ── 字体/图片加载完成后刷新 ScrollTrigger ──────────────
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  // ── GSAP 就绪：禁用 CSS 动画，防止冲突 ──────────────────
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof ScrollAnim !== 'undefined') {
      ScrollAnim.enabled = false;
    }
    // 清除 .fade-up 的 CSS transition，由 GSAP 接管
    // 注意：不要设 opacity:0！gsap.set() 已经在上面的 matchMedia 中处理了初始状态
    document.querySelectorAll('.fade-up').forEach((el) => {
      el.style.transition = 'none';
      el.classList.remove('visible');
    });
  });
})();

// ──────────────────────────────────────────────────
// 如果 GSAP 未加载（本地文件缺失等情况），回退到 CSS 动画
// ──────────────────────────────────────────────────
(function () {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') return;

  document.addEventListener('DOMContentLoaded', () => {
    // 恢复 CSS 过渡能力
    document.querySelectorAll('.fade-up').forEach((el) => {
      el.style.transition = '';
      el.classList.remove('visible');
    });
    // 启用 IntersectionObserver 动画
    if (typeof ScrollAnim !== 'undefined') {
      ScrollAnim.enabled = true;
      ScrollAnim.init();
    }
  });
})();
