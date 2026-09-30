/* ============================================================
   SUPER DUPER LANGUAGE CENTER — landing page JS
   Single IntersectionObserver reveal + nav + accordion + year.
   ============================================================ */

(function () {
  'use strict';

  document.documentElement.classList.add('js'); // stamp ASAP so scoped .js .reveal hidden-state applies

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  /* ---------- 1. Reveal-on-scroll (single IntersectionObserver) ---------- */
  if ('IntersectionObserver' in window && !reduceMotion) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // fire once, never re-trigger
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    // No observer or reduced motion -> show everything immediately.
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 2. Sticky nav: add .is-scrolled on scroll ---------- */
  var header = document.getElementById('site-header');
  var scrolled = false;
  function computeScroll() {
    var root = document.documentElement || document.body;
    return (root && root.scrollTop > 8) || false;
  }
  function onScroll() {
    var should = computeScroll();
    if (should !== scrolled) {
      scrolled = should;
      if (header) header.classList.toggle('is-scrolled', scrolled);
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Mobile hamburger menu ---------- */
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  function openMenu(open) {
    if (hamburger) hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (mobileMenu) {
      if (open) mobileMenu.classList.add('open');
      else mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
  }
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      openMenu(!mobileMenu.classList.contains('open'));
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { openMenu(false); });
    });
    document.addEventListener('click', function (e) {
      if (mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(e.target) && e.target !== hamburger) {
        openMenu(false);
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        openMenu(false);
        if (hamburger) hamburger.focus();
      }
    });
  }

  /* ---------- 4. FAQ accordion (single-open) ---------- */
  var acc = document.getElementById('faq-accordion');
  if (acc) {
    var heads = Array.prototype.slice.call(acc.querySelectorAll('.acc-head'));
    var panels = Array.prototype.slice.call(acc.querySelectorAll('.acc-panel'));

    function setItem(head, open) {
      var idx = heads.indexOf(head);
      if (idx === -1) return;
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
      var panel = panels[idx];
      if (panel) {
        if (open) panel.removeAttribute('hidden');
        else panel.setAttribute('hidden', '');
      }
    }

    heads.forEach(function (head) {
      head.addEventListener('click', function () {
        var isOpen = head.getAttribute('aria-expanded') === 'true';
        // Single-open: collapse all, then open the clicked one (unless it was open).
        heads.forEach(function (h) { setItem(h, false); });
        setItem(head, !isOpen);
      });
    });
  }

  /* ---------- 5. Footer year ---------- */
  var yEl = document.getElementById('year');
  if (yEl) yEl.textContent = String(new Date().getFullYear());

  /* ---------- 6. Hero bubble cursor-follow (parallax spring) ---------- */
  // Only for fine pointers (mouse) and when motion isn't reduced. Transform-only,
  // single rAF loop, no scroll listeners. Touch/coarse pointers get static field.
  var bubbles = document.querySelector('.hero-bubbles');
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  if (bubbles && finePointer && !reduceMotion) {
    var hero = document.getElementById('hero') || document.querySelector('.hero');
    var tx = 0, ty = 0;      // current (lerped) offset toward cursor
    var gx = 0, gy = 0;      // target offset
    var running = false;
    var PARALLAX = 26;       // max travel px; keep it subtle behind H1

    function onPointerMove(e) {
      var rect = hero ? hero.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
      // Normalize cursor to hero center (-1..1), then scale to travel range.
      gx = ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) * PARALLAX;
      gy = ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * PARALLAX;
      if (!running) {
        running = true;
        requestAnimationFrame(tick);
      }
    }
    function tick() {
      // Soft lerp (spring-ish) toward the target; tiny epsilon keeps it settling.
      tx += (gx - tx) * 0.08;
      ty += (gy - ty) * 0.08;
      var scale = 1.04;
      bubbles.style.transform = 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) scale(' + scale + ')';
      if (Math.abs(gx - tx) < 0.05 && Math.abs(gy - ty) < 0.05) {
        tx = gx; ty = gy;
        bubbles.style.transform = 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) scale(' + scale + ')';
        running = false;   // idle: stop looping until the cursor moves again
        return;
      }
      requestAnimationFrame(tick);
    }
    hero.addEventListener('pointermove', onPointerMove, { passive: true });
  }
})();