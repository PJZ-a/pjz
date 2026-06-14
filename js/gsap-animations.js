/**
 * GSAP Animations — 稳重的入场动画 + 环境视差
 * 设计原则：元素揭示一次后保持可见，不反复出现消失，不干扰阅读
 */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof gsap === 'undefined') console.warn('GSAP not loaded — animations disabled');
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ duration: 0.7, ease: 'power3.out' });

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
       *  0. 初始状态 — 一次性设定，不做反复切换
       * ================================================================ */
      gsap.set('.hero-illustration', { autoAlpha: 0, scale: 0, rotation: -180 });
      gsap.set('.agent-badge', { autoAlpha: 0, y: -40, boxShadow: '0 0 15px rgba(20,184,166,0.2)' });
      gsap.set('h1', { autoAlpha: 0, y: 60, scale: 0.85 });
      gsap.set('.hero-identity', { autoAlpha: 0, y: 30 });
      gsap.set('.muted', { autoAlpha: 0, y: 20 });
      gsap.set('.summary', { autoAlpha: 0, y: 30 });
      gsap.set('.quick .btn', { autoAlpha: 0, y: 40, scale: 0.6 });
      gsap.set('.nav', { autoAlpha: 0, y: -80 });

      // 卡片及相关内容
      gsap.set('.card, .section-divider, .footer, .post-card, .project-card', {
        autoAlpha: 0,
        y: 50,
      });
      gsap.set('.contact img', { autoAlpha: 0, scale: 0.4, rotation: 15 });
      gsap.set('.contact p', { autoAlpha: 0, y: 20 });
      gsap.set('.contact .btn', { autoAlpha: 0, y: 20, scale: 0.8 });

      /* ================================================================
       *  1. HERO 入场 — 一次性时间线，播完就停
       * ================================================================ */
      const heroTL = gsap.timeline({
        defaults: { duration: dur(0.75), ease: 'power4.out' },
      });

      heroTL
        // SVG 插画：旋转弹入
        .to('.hero-illustration', {
          scale: 1,
          rotation: 0,
          autoAlpha: 1,
          duration: dur(1.1),
          ease: 'back.out(1.3)',
        })
        // 徽章：掉落 + 弹跳
        .to('.agent-badge', {
          y: 0,
          autoAlpha: 1,
          duration: dur(0.6),
          ease: 'back.out(1.8)',
        }, '-=0.4')
        // 先设初始光晕再开始呼吸
        .set('.agent-badge', { boxShadow: '0 0 15px rgba(20,184,166,0.2)' })
        // 徽章脉冲光晕：暗 → 亮 → 暗 持续呼吸
        .to('.agent-badge', {
          boxShadow: '0 0 55px rgba(20,184,166,0.5)',
          duration: 2.0,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
        // 姓名上升
        .to('h1', {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          duration: dur(0.8),
          ease: 'power4.out',
        }, '-=0.3')
        // 身份行
        .to('.hero-identity', { y: 0, autoAlpha: 1 }, '-=0.2')
        // 籍贯
        .to('.muted', { y: 0, autoAlpha: 1 }, '-=0.12')
        // 简介
        .to('.summary', { y: 0, autoAlpha: 1, duration: dur(0.8) }, '-=0.1')
        // 按钮弹性弹入
        .to('.quick .btn', {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          stagger: stagger(0.12),
          ease: 'back.out(2.2)',
          duration: dur(0.65),
        }, '-=0.08');

      /* ================================================================
       *  2. 导航栏 — 从上方滑入
       * ================================================================ */
      gsap.to('.nav', {
        y: 0,
        autoAlpha: 1,
        duration: dur(0.6),
        ease: 'power3.out',
        delay: 0.1,
      });

      /* ================================================================
       *  3. 环境视差 — Blob + 插画漂移（不影响内容阅读）
       * ================================================================ */
      if (!reduceMotion) {
        // Blob 深度视差
        gsap.to('.blob-1', {
          scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.8 },
          y: 200, x: 100, scale: 1.3,
          ease: 'none',
        });
        gsap.to('.blob-2', {
          scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.9 },
          y: -160, x: -80, scale: 0.8,
          ease: 'none',
        });
        gsap.to('.blob-3', {
          scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 0.7 },
          y: -100, x: 120, scale: 1.2,
          ease: 'none',
        });

        // 英雄插画轻微上移（保持可见，只做微妙的视差）
        if (isDesktop) {
          gsap.to('.hero-illustration', {
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
            y: 40, scale: 0.85, autoAlpha: 0.3,
            ease: 'none',
          });
        }
      }

      /* ================================================================
       *  4. 内容卡片 — 滚动到位后揭示一次，之后保持可见
       *     once: true = 播完就停，不再反复
       * ================================================================ */
      gsap.utils.toArray('.card').forEach((card) => {
        gsap.to(card, {
          scrollTrigger: {
            trigger: card,
            start: isMobile ? 'top 94%' : 'top 88%',
            once: true,
          },
          y: 0,
          autoAlpha: 1,
          duration: dur(0.85),
          ease: 'power3.out',
        });

        // Section icon — 小旋转弹入
        const sectionIcon = card.querySelector('.section-icon');
        if (sectionIcon) {
          gsap.set(sectionIcon, { scale: 0, rotation: -90 });
          gsap.to(sectionIcon, {
            scrollTrigger: { trigger: card, start: isMobile ? 'top 90%' : 'top 84%', once: true },
            scale: 1,
            rotation: 0,
            duration: dur(0.45),
            ease: 'back.out(1.8)',
          });
        }

        // 技能标签 — 轻微交错
        const skillTags = card.querySelectorAll('.skills li');
        if (skillTags.length) {
          gsap.set(skillTags, { y: 20, autoAlpha: 0 });
          gsap.to(skillTags, {
            scrollTrigger: { trigger: card, start: isMobile ? 'top 88%' : 'top 80%', once: true },
            y: 0,
            autoAlpha: 1,
            stagger: stagger(0.03),
            duration: dur(0.35),
            ease: 'power3.out',
          });
        }

        // 技能分组标题
        const groupHeadings = card.querySelectorAll('.skill-group h3');
        if (groupHeadings.length) {
          gsap.set(groupHeadings, { x: -15, autoAlpha: 0 });
          gsap.to(groupHeadings, {
            scrollTrigger: { trigger: card, start: isMobile ? 'top 86%' : 'top 78%', once: true },
            x: 0,
            autoAlpha: 1,
            stagger: stagger(0.06),
            duration: dur(0.35),
            ease: 'power3.out',
          });
        }
      });

      /* ================================================================
       *  5. 分区线 — 展开后保持
       * ================================================================ */
      gsap.utils.toArray('.section-divider').forEach((divider) => {
        gsap.to(divider, {
          scrollTrigger: { trigger: divider, start: 'top 94%', once: true },
          scaleX: 1,
          autoAlpha: 1,
          duration: dur(0.5),
          ease: 'power3.inOut',
        });

        const diamond = divider.querySelector('span');
        if (diamond) {
          gsap.set(diamond, { scale: 0, rotation: 60 });
          gsap.to(diamond, {
            scrollTrigger: { trigger: divider, start: 'top 92%', once: true },
            scale: 1,
            rotation: 0,
            duration: dur(0.3),
            ease: 'back.out(1.5)',
            delay: 0.25,
          });
        }
      });

      /* ================================================================
       *  6. 联系方式 — 一次性揭示
       * ================================================================ */
      gsap.to('.contact img', {
        scrollTrigger: { trigger: '#contact', start: 'top 82%', once: true },
        scale: 1,
        autoAlpha: 1,
        rotation: 0,
        duration: dur(0.65),
        ease: 'back.out(1.5)',
      });

      gsap.to('.contact p', {
        scrollTrigger: { trigger: '#contact', start: 'top 84%', once: true },
        y: 0,
        autoAlpha: 1,
        stagger: stagger(0.05),
        duration: dur(0.4),
        ease: 'power3.out',
      });

      gsap.to('.contact .btn', {
        scrollTrigger: { trigger: '#contact', start: 'top 80%', once: true },
        y: 0,
        autoAlpha: 1,
        scale: 1,
        stagger: stagger(0.08),
        duration: dur(0.45),
        ease: 'back.out(1.3)',
      });

      /* ================================================================
       *  7. 页脚 — 温和上升
       * ================================================================ */
      gsap.to('.footer', {
        scrollTrigger: { trigger: '.footer', start: 'top 97%', once: true },
        y: 0,
        autoAlpha: 1,
        duration: dur(0.5),
        ease: 'power3.out',
      });

      /* ================================================================
       *  8. 动态文章卡片 — 从左侧滑入，播完保持
       * ================================================================ */
      function animatePosts(scope) {
        const posts = (scope || document).querySelectorAll('.post-card:not(.gsap-done)');
        if (!posts.length) return;
        posts.forEach((post) => {
          post.classList.add('gsap-done');
          gsap.set(post, { x: -40, autoAlpha: 0 });
          gsap.to(post, {
            scrollTrigger: { trigger: post, start: isMobile ? 'top 94%' : 'top 90%', once: true },
            x: 0,
            autoAlpha: 1,
            duration: dur(0.5),
            ease: 'power3.out',
          });
          const tags = post.querySelectorAll('.tag');
          if (tags.length) {
            gsap.set(tags, { y: 8, autoAlpha: 0 });
            gsap.to(tags, {
              scrollTrigger: { trigger: post, start: isMobile ? 'top 92%' : 'top 87%', once: true },
              y: 0,
              autoAlpha: 1,
              stagger: stagger(0.03),
              duration: dur(0.25),
              ease: 'power3.out',
            });
          }
        });
      }

      animatePosts();

      /* ================================================================
       *  9. 动态项目卡片 — 缩放上升，播完保持
       * ================================================================ */
      function animateProjects(scope) {
        const cards = (scope || document).querySelectorAll('.project-card:not(.gsap-done)');
        if (!cards.length) return;
        cards.forEach((card) => {
          card.classList.add('gsap-done');
          gsap.set(card, { y: 35, autoAlpha: 0, scale: 0.9 });
          gsap.to(card, {
            scrollTrigger: { trigger: card, start: isMobile ? 'top 92%' : 'top 88%', once: true },
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: dur(0.55),
            ease: 'back.out(1.2)',
          });
          const icon = card.querySelector('.tech-icon');
          if (icon) {
            gsap.set(icon, { scale: 0, rotation: -45 });
            gsap.to(icon, {
              scrollTrigger: { trigger: card, start: isMobile ? 'top 90%' : 'top 85%', once: true },
              scale: 1,
              rotation: 0,
              duration: dur(0.35),
              ease: 'back.out(1.6)',
              delay: 0.1,
            });
          }
        });
      }

      animateProjects();

      window.GSAPAnimate = {
        projects: (container) => animateProjects(container),
        posts: (container) => animatePosts(container),
        refresh: () => ScrollTrigger.refresh(),
      };
    },
  );

  // ── 加载完成后刷新 ──────────────────────────────────
  window.addEventListener('load', () => ScrollTrigger.refresh());

  // ── 禁用 CSS 动画，避免双系统冲突 ─────────────────
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof ScrollAnim !== 'undefined') ScrollAnim.enabled = false;
    document.querySelectorAll('.fade-up').forEach((el) => {
      el.style.transition = 'none';
      el.classList.remove('visible');
    });
    // 关键：禁用与 GSAP 冲突的 CSS animation
    const heroIll = document.querySelector('.hero-illustration');
    if (heroIll) heroIll.style.animation = 'none';
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
