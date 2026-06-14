/**
 * GSAP Animations — scroll-driven reveals, parallax, entrance timelines
 * Depends on: gsap.min.js, ScrollTrigger.min.js (loaded before this file)
 */
(function () {
  // Guard — wait for GSAP to be available
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
       *  1. HERO ENTRANCE TIMELINE
       *  Staggered entrance: illustration → badge → name → details → btns
       * ================================================================ */
      const heroTL = gsap.timeline({
        defaults: { duration: dur(0.75), ease: 'power4.out' },
      });

      heroTL
        // ═══ Hero 插画：旋转 + 缩放弹入 ═══
        .from('.hero-illustration', {
          scale: 0,
          rotation: -180,
          autoAlpha: 0,
          duration: dur(1.0),
          ease: 'back.out(1.5)',
        })
        // ═══ Agent 徽章：从上方掉落 ═══
        .from(
          '.agent-badge',
          { y: -40, autoAlpha: 0, duration: dur(0.55), ease: 'back.out(1.7)' },
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
        // ═══ 姓名：逐字感上升 ═══
        .from('h1', {
          y: 60,
          autoAlpha: 0,
          scale: 0.85,
          duration: dur(0.75),
          ease: 'power4.out',
        }, '-=0.2')
        // ═══ 身份行 ═══
        .from('.hero-identity', { y: 30, autoAlpha: 0 }, '-=0.15')
        // ═══ 籍贯 ═══
        .from('.muted', { y: 20, autoAlpha: 0 }, '-=0.1')
        // ═══ 简介段落 ═══
        .from('.summary', { y: 30, autoAlpha: 0, duration: dur(0.8) }, '-=0.1')
        // ═══ 按钮：弹性缩放弹入 ═══
        .from(
          '.quick .btn',
          {
            y: 40,
            autoAlpha: 0,
            scale: 0.6,
            stagger: stagger(0.12),
            ease: 'back.out(2.5)',
            duration: dur(0.7),
          },
          '-=0.1',
        )
        // ═══ 向下滚动提示 ═══
        .from('.scroll-hint', { autoAlpha: 0, y: -16 }, '-=0.05');

      /* ================================================================
       *  2. NAV BAR — slide down on load
       * ================================================================ */
      gsap.from('.nav', {
        y: -80,
        autoAlpha: 0,
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

        // Agent badge also fades up
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
       *  5. SECTION CARDS — scroll-triggered reveal with content stagger
       * ================================================================ */
      gsap.utils.toArray('.card').forEach((card) => {
        // Card container — scale-in from below
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: isMobile ? 'top 92%' : 'top 85%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
          },
          y: 70,
          autoAlpha: 0,
          duration: dur(0.9),
          ease: 'power3.out',
        });

        // Section icon — spin-in with bounce
        const sectionIcon = card.querySelector('.section-icon');
        if (sectionIcon) {
          gsap.from(sectionIcon, {
            scrollTrigger: {
              trigger: card,
              start: isMobile ? 'top 88%' : 'top 82%',
              toggleActions: 'play none none reverse',
            },
            scale: 0,
            rotation: -120,
            duration: dur(0.55),
            ease: 'back.out(2)',
          });
        }

        // Card heading text — rise
        const heading = card.querySelector('h2');
        if (heading) {
          const textNode = heading.childNodes[heading.childNodes.length - 1];
          if (textNode && textNode.nodeType === 3) {
            // Animate the last text node
          }
        }

        // Skill tags — staggered bounce in
        const skillTags = card.querySelectorAll('.skills li');
        if (skillTags.length) {
          gsap.from(skillTags, {
            scrollTrigger: {
              trigger: card,
              start: isMobile ? 'top 85%' : 'top 78%',
              toggleActions: 'play none none reverse',
            },
            y: 25,
            autoAlpha: 0,
            scale: 0.7,
            stagger: stagger(0.04),
            duration: dur(0.4),
            ease: 'back.out(1.8)',
          });
        }

        // Skill group headings — fade right
        const groupHeadings = card.querySelectorAll('.skill-group h3');
        if (groupHeadings.length) {
          gsap.from(groupHeadings, {
            scrollTrigger: {
              trigger: card,
              start: isMobile ? 'top 84%' : 'top 76%',
              toggleActions: 'play none none reverse',
            },
            x: -20,
            autoAlpha: 0,
            stagger: stagger(0.08),
            duration: dur(0.4),
            ease: 'power3.out',
          });
        }
      });

      /* ================================================================
       *  6. SECTION DIVIDERS — expand from center
       * ================================================================ */
      gsap.utils.toArray('.section-divider').forEach((divider) => {
        gsap.from(divider, {
          scrollTrigger: {
            trigger: divider,
            start: 'top 92%',
            toggleActions: 'play none none reverse',
          },
          scaleX: 0,
          autoAlpha: 0,
          duration: dur(0.6),
          ease: 'power3.inOut',
          transformOrigin: 'center center',
        });

        // Diamond inside — pop
        const diamond = divider.querySelector('span');
        if (diamond) {
          gsap.from(diamond, {
            scrollTrigger: {
              trigger: divider,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            scale: 0,
            rotation: 90,
            duration: dur(0.35),
            ease: 'back.out(2)',
            delay: 0.3,
          });
        }
      });

      /* ================================================================
       *  7. CONTACT SECTION — QR code bounce, button stagger
       * ================================================================ */
      // QR code image
      gsap.from('.contact img', {
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
        scale: 0.4,
        autoAlpha: 0,
        rotation: 15,
        duration: dur(0.7),
        ease: 'back.out(1.7)',
      });

      // Contact links — rise stagger
      gsap.from('.contact p', {
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
        y: 20,
        autoAlpha: 0,
        stagger: stagger(0.06),
        duration: dur(0.45),
        ease: 'power3.out',
      });

      // Bottom buttons — scale stagger
      gsap.from('.contact .btn', {
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
        y: 20,
        autoAlpha: 0,
        scale: 0.8,
        stagger: stagger(0.1),
        duration: dur(0.5),
        ease: 'back.out(1.5)',
      });

      /* ================================================================
       *  8. FOOTER — gentle rise
       * ================================================================ */
      gsap.from('.footer', {
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 96%',
          toggleActions: 'play none none reverse',
        },
        y: 30,
        autoAlpha: 0,
        duration: dur(0.6),
        ease: 'power3.out',
      });

      /* ================================================================
       *  9. POST CARDS — slide in from left (handles existing + dynamic)
       * ================================================================ */
      function animatePosts(scope) {
        const posts = (scope || document).querySelectorAll('.post-card:not(.gsap-done)');
        if (!posts.length) return;
        posts.forEach((post) => {
          post.classList.add('gsap-done');
          gsap.from(post, {
            scrollTrigger: {
              trigger: post,
              start: isMobile ? 'top 92%' : 'top 88%',
              toggleActions: 'play none none reverse',
            },
            x: -50,
            autoAlpha: 0,
            duration: dur(0.55),
            ease: 'power3.out',
          });
          // Tags fade-up stagger
          const tags = post.querySelectorAll('.tag');
          if (tags.length) {
            gsap.from(tags, {
              scrollTrigger: {
                trigger: post,
                start: isMobile ? 'top 90%' : 'top 85%',
                toggleActions: 'play none none reverse',
              },
              y: 10,
              autoAlpha: 0,
              stagger: stagger(0.04),
              duration: dur(0.3),
              ease: 'power3.out',
            });
          }
        });
      }

      // Initial pass
      animatePosts();

      /* ================================================================
       *  10. PROJECT CARDS — scale + rise stagger (dynamic content)
       * ================================================================ */
      function animateProjects(scope) {
        const cards = (scope || document).querySelectorAll('.project-card:not(.gsap-done)');
        if (!cards.length) return;
        cards.forEach((card) => {
          card.classList.add('gsap-done');
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: isMobile ? 'top 90%' : 'top 85%',
              toggleActions: 'play none none reverse',
            },
            y: 40,
            autoAlpha: 0,
            scale: 0.88,
            duration: dur(0.65),
            ease: 'back.out(1.3)',
          });
          // Tech icon — pop
          const icon = card.querySelector('.tech-icon');
          if (icon) {
            gsap.from(icon, {
              scrollTrigger: {
                trigger: card,
                start: isMobile ? 'top 88%' : 'top 83%',
                toggleActions: 'play none none reverse',
              },
              scale: 0,
              rotation: -60,
              duration: dur(0.4),
              ease: 'back.out(2)',
              delay: 0.1,
            });
          }
        });
      }

      // Initial pass for any static project cards
      animateProjects();

      // Expose for dynamic content (called from render.js)
      window.GSAPAnimate = {
        projects: (container) => animateProjects(container),
        posts: (container) => animatePosts(container),
        refresh: () => ScrollTrigger.refresh(),
      };
    },
  );

  // ── Refresh after fonts/images load ─────────────────────
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  // ── GSAP 就绪：禁用 CSS 动画，准备 GSAP 控制 ──────
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof ScrollAnim !== 'undefined') {
      ScrollAnim.enabled = false;
    }
    // 重置 fade-up 元素：去掉 CSS transition，由 GSAP 接管
    document.querySelectorAll('.fade-up').forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });
  });
})();

// ──────────────────────────────────────────────────
// 如果 GSAP 未加载（CDN 超时/被屏蔽），回退到 CSS 动画
// ──────────────────────────────────────────────────
(function () {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') return;

  // GSAP 不可用 — 确保 CSS 动画正常工作
  document.addEventListener('DOMContentLoaded', () => {
    // 恢复 .fade-up 的 CSS 过渡能力
    document.querySelectorAll('.fade-up').forEach((el) => {
      el.style.opacity = '';
      el.style.transform = '';
      el.style.transition = '';
    });
    // 确保 ScrollAnim 正常工作
    if (typeof ScrollAnim !== 'undefined') {
      ScrollAnim.enabled = true;
    }
  });
})();
