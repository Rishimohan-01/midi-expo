/* ================================================================
   MIDI EXPORTS — animations.js
   Brightmark-style scroll storytelling
   - Parallax sticky background
   - Scroll reveal with IntersectionObserver
   - Navbar shrink on scroll
   - Counter animation
   - FAQ smooth open/close
   - Ripple on buttons
================================================================ */

(function () {
  'use strict';

  /* ── helpers ─────────────────────────────────────────────── */
  const qs  = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ================================================================
     1. PARALLAX BACKGROUND
     Adds a fixed aerial-farm background behind all sections,
     matching the Brightmark video: background stays still while
     white content panels scroll over it.
  ================================================================ */
  // function initParallax() {
  //   const bgImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80&fit=crop';
  //   document.body.style.cssText += `
  //     background-image: url('${bgImage}');
  //     background-attachment: fixed;
  //     background-size: cover;
  //     background-position: center top;
  //     background-repeat: no-repeat;
  //   `;
  //   document.body.classList.add('has-parallax-bg');
  // }

  /* ================================================================
     2. SCROLL REVEAL (IntersectionObserver)
     Watches every .sr-* element and adds .sr-visible when it
     enters the viewport — triggering CSS keyframe animations.
  ================================================================ */
  function initScrollReveal() {
    const targets = qsa(
      '.sr-panel,.sr-text,.sr-label,.sr-heading,.sr-body,.sr-card,.sr-image,.sr-btn'
    );

    if (!targets.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sr-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => io.observe(el));
  }

  /* ================================================================
     3. AUTO-TAG ELEMENTS WITH sr-* CLASSES
     Walks the DOM and attaches the right sr-* class + stagger
     delay to every matching element — so NO manual class changes
     are needed in the HTML files.
  ================================================================ */
  function autoTag() {
    let cardCounter = 0;

    /* Section label tags */
    qsa('.section-tag, .stag').forEach(el => {
      el.classList.add('sr-label');
    });

    /* All h2 headings in sections */
    qsa('section h2').forEach(el => {
      el.classList.add('sr-heading', 'anim-heading');
    });

    /* All h3 inside cards */
    qsa('.pcard h3, .service-card h3, .why-us-card h5, .vbox h3, .ccard h3, .mbox h3').forEach(el => {
      el.classList.add('sr-text');
    });

    /* Body paragraphs in sections (not navbar/footer) */
    qsa('section p:not(.footer-tagline):not(.mb-0)').forEach(el => {
      el.classList.add('sr-body');
    });

    /* Cards — pcard, service-card, why-us-card, vbox, ccard, mbox */
    qsa('.pcard, .service-card, .why-us-card, .vbox, .ccard, .mbox').forEach((el, i) => {
      el.classList.add('sr-card');
      // stagger within each row group (reset every 4)
      const delay = `sr-d${(i % 6) + 1}`;
      el.classList.add(delay);
    });

    /* Images in main content (not navbar/footer) */
    qsa('section img:not(.footer-logo):not(.navbar-brand img)').forEach(el => {
      if (!el.closest('.navbar') && !el.closest('.site-footer')) {
        el.classList.add('sr-image');
        el.parentElement.classList.add('img-hover-wrap');
      }
    });

    /* Buttons */
    qsa('section .btn-gold, section .btn-outline-gold, .cta-sec a').forEach(el => {
      el.classList.add('sr-btn');
    });

    /* Page-banner children — these animate on load, not scroll */
    qsa('.page-banner .banner-content h1, .page-banner .banner-content p').forEach(el => {
      el.style.animationPlayState = 'running';
    });

    /* About image specifically */
    qsa('.col-lg-6 > img, .col-lg-5 > img').forEach(el => {
      el.classList.add('sr-image');
    });
  }

  /* ================================================================
     4. NAVBAR SHRINK ON SCROLL
  ================================================================ */
  function initNavbar() {
    const nav = qs('.navbar');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ================================================================
     5. COUNTER ANIMATION
     Targets any element with data-count="NUMBER"
  ================================================================ */
  // function initCounters() {
  //   const counters = qsa('[data-count]');
  //   if (!counters.length) return;

  //   const io = new IntersectionObserver((entries) => {
  //     entries.forEach(entry => {
  //       if (!entry.isIntersecting) return;
  //       const el     = entry.target;
  //       const target = parseInt(el.dataset.count, 10);
  //       const suffix = el.dataset.suffix || '';
  //       const dur    = 1800;
  //       const fps    = 60;
  //       const steps  = dur / (1000 / fps);
  //       const inc    = target / steps;
  //       let   cur    = 0;

  //       el.classList.add('counting');
  //       const tick = setInterval(() => {
  //         cur += inc;
  //         if (cur >= target) { cur = target; clearInterval(tick); }
  //         el.textContent = Math.floor(cur) + suffix;
  //       }, 1000 / fps);

  //       io.unobserve(el);
  //     });
  //   }, { threshold: 0.5 });

  //   counters.forEach(el => io.observe(el));
  // }

  /* ================================================================
     6. FAQ — SMOOTH OPEN / CLOSE
     Replaces any existing toggle with max-height animation
  ================================================================ */
  function initFAQ() {
    const items = qsa('.faq-item');
    if (!items.length) return;

    items.forEach(item => {
      const q = qs('.faq-q', item);
      const a = qs('.faq-a', item);
      if (!q || !a) return;

      /* Force max-height approach */
      a.style.maxHeight  = '0';
      a.style.overflow   = 'hidden';
      a.style.display    = 'block';
      a.style.transition = 'max-height 0.42s cubic-bezier(0.22,1,0.36,1), padding 0.3s ease';

      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        /* Close all */
        items.forEach(i => {
          i.classList.remove('open');
          const ia = qs('.faq-a', i);
          if (ia) { ia.style.maxHeight = '0'; ia.style.padding = '0 1.5rem'; }
        });

        /* Open clicked one */
        if (!isOpen) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 40 + 'px';
          a.style.padding   = '0 1.5rem 1.2rem';
        }
      });
    });
  }

  /* ================================================================
     7. RIPPLE ON BUTTONS
  ================================================================ */
  function initRipple() {
    qsa('.btn-gold, .btn-outline-gold').forEach(btn => {
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.addEventListener('click', function (e) {
        const r    = this.getBoundingClientRect();
        const size = Math.max(r.width, r.height) * 2;
        const x    = e.clientX - r.left - size / 2;
        const y    = e.clientY - r.top  - size / 2;

        const ripple = document.createElement('span');
        Object.assign(ripple.style, {
          position:      'absolute',
          borderRadius:  '50%',
          width:         size + 'px',
          height:        size + 'px',
          left:          x + 'px',
          top:           y + 'px',
          background:    'rgba(255,255,255,0.28)',
          transform:     'scale(0)',
          animation:     'rippleAnim 0.55s ease-out',
          pointerEvents: 'none',
        });
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });

    /* Inject ripple keyframe once */
    if (!qs('#ripple-kf')) {
      const s = document.createElement('style');
      s.id = 'ripple-kf';
      s.textContent = '@keyframes rippleAnim{to{transform:scale(1);opacity:0}}';
      document.head.appendChild(s);
    }
  }

  /* ================================================================
     8. SMOOTH PAGE TRANSITIONS
     Fades out body on link click, fades back in on load
  ================================================================ */
  // function initPageTransitions() {
  //   /* Fade in on load */
  //   document.body.style.opacity = '0';
  //   document.body.style.transition = 'opacity 0.45s ease';
  //   requestAnimationFrame(() => {
  //     requestAnimationFrame(() => { document.body.style.opacity = '1'; });
  //   });

  //   /* Fade out on internal link click */
  //   qsa('a[href]').forEach(link => {
  //     const href = link.getAttribute('href');
  //     if (!href || href.startsWith('#') || href.startsWith('mailto') ||
  //         href.startsWith('tel') || href.startsWith('http') ||
  //         link.target === '_blank') return;

  //     link.addEventListener('click', function (e) {
  //       e.preventDefault();
  //       document.body.style.opacity = '0';
  //       const dest = this.href;
  //       setTimeout(() => { window.location.href = dest; }, 380);
  //     });
  //   });
  // }

  /* ================================================================
     9. NAVBAR HAMBURGER (mobile) — animated 3-bar → X
  ================================================================ */
  // function initHamburger() {
  //   const toggler = qs('.navbar-toggler');
  //   const menu    = qs('#mobileMenu');
  //   if (!toggler || !menu) return;

  //   toggler.addEventListener('click', () => {
  //     toggler.classList.toggle('is-open');
  //   });
  // }

  /* ================================================================
     10. INIT
  ================================================================ */
  function init() {
    // initParallax();
    autoTag();           /* tag elements BEFORE scroll reveal */
    initScrollReveal();
    initNavbar();
    // initCounters();
    initFAQ();
    initRipple();
    // initPageTransitions();
    // initHamburger();
  }

  /* Run after DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
