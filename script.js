/* =========================================================
   actols — Landing interactions & animations
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Año dinámico en el footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Navbar: cambiar estilo al hacer scroll ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Reveal on scroll (services, etc.) ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = (Array.from(entry.target.parentElement?.children || [])
            .indexOf(entry.target) % 4) * 80;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Glow que sigue al cursor en las service cards ---------- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '0%');
    });
  });

  /* ---------- Parallax sutil del glow del hero ---------- */
  const heroGlow = document.querySelector('.hero-glow');
  if (heroGlow && window.matchMedia('(min-width: 900px)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroGlow.style.transform = `translate3d(0, ${y * 0.15}px, 0)`;
      }
    }, { passive: true });
  }

  /* ---------- Scroll suave para enlaces internos ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});


/* =========================================================
   actols — Hero & Gallery advanced animations
   ========================================================= */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     1. HERO STATS — animated counters
     --------------------------------------------------------- */
  function animateCounter(el) {
    if (el.dataset.done === '1') return;
    el.dataset.done = '1';

    const target  = parseFloat(el.dataset.count || '0');
    const prefix  = el.dataset.prefix || '';
    const suffix  = el.dataset.suffix || '';
    const duration = 1600;
    const start    = performance.now();

    const ease = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const value = Math.round(target * ease(t));
      el.textContent = prefix + value + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const stats = document.querySelectorAll('.hero-stats [data-count]');
  if (stats.length) {
    if (reduceMotion) {
      stats.forEach(el => {
        el.textContent =
          (el.dataset.prefix || '') + el.dataset.count + (el.dataset.suffix || '');
      });
    } else if ('IntersectionObserver' in window) {
      const statIO = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      stats.forEach(el => statIO.observe(el));
    } else {
      stats.forEach(animateCounter);
    }
  }

  /* ---------------------------------------------------------
     2. HERO — cursor-reactive aura parallax (desktop only)
     --------------------------------------------------------- */
  const hero = document.querySelector('.hero');
  const heroGlowEl = document.querySelector('.hero-glow');

  if (hero && heroGlowEl && !reduceMotion && window.matchMedia('(min-width: 900px)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      heroGlowEl.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)';
      heroGlowEl.style.transform  = `translate3d(${x * 20}px, ${y * 20}px, 0)`;
    });

    hero.addEventListener('mouseleave', () => {
      heroGlowEl.style.transform = 'translate3d(0, 0, 0)';
    });
  }

  /* ---------------------------------------------------------
     3. GALLERY — 3D cursor tilt + spotlight
     --------------------------------------------------------- */
  const tiltItems = document.querySelectorAll('.gallery-item');

  if (!reduceMotion) {
    tiltItems.forEach(card => {
      card.classList.add('tilt-3d');

      let raf = null;
      let targetRx = 0, targetRy = 0;

      const applyTilt = () => {
        raf = null;
        card.style.setProperty('--rx', targetRx.toFixed(2) + 'deg');
        card.style.setProperty('--ry', targetRy.toFixed(2) + 'deg');
      };

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top)  / rect.height;

        const maxDeg = 6;
        targetRy = (px - 0.5) * 2 * maxDeg;
        targetRx = -(py - 0.5) * 2 * maxDeg;

        if (raf === null) raf = requestAnimationFrame(applyTilt);
      });

      card.addEventListener('mouseleave', () => {
        targetRx = 0;
        targetRy = 0;
        if (raf === null) raf = requestAnimationFrame(applyTilt);
      });
    });
  }

  /* ---------------------------------------------------------
     4. GALLERY — staggered reveal entrance
     --------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item.reveal');

  if ('IntersectionObserver' in window && galleryItems.length && !reduceMotion) {
    const galleryIO = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const index = Array.from(galleryItems).indexOf(entry.target);
        const delay = (index % 3) * 120;
        setTimeout(() => entry.target.classList.add('visible'), delay);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    galleryItems.forEach(el => galleryIO.observe(el));
  }

})();
