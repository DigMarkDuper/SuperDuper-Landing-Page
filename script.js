/* ============================================================
   SUPER DUPER LANGUAGE CENTER — landing page JS
   Single IntersectionObserver reveal + nav + accordion + year
   + MOTION v1: stagger engine, one shared rAF loop, word split,
   FAQ height animation, pointer handlers.
   ============================================================ */

(function () {
  'use strict';

  document.documentElement.classList.add('js'); // stamp ASAP so scoped .js .reveal hidden-state applies

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  var clamp = function (v, a, b) { return v < a ? a : (v > b ? b : v); };
  var inView = function (r, h) { return r.bottom > 0 && r.top < h; };

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

  /* ---------- 4. FAQ accordion (single-open) ----------
     Height is animated instead of an instant layout jump. At most ONE panel
     animates at any instant: opening B while A is still collapsing snaps A
     shut immediately, so rapid tapping degrades to instant toggles and never
     queues stacked transitions. */
  var acc = document.getElementById('faq-accordion');
  if (acc) {
    var heads = Array.prototype.slice.call(acc.querySelectorAll('.acc-head'));
    var panels = Array.prototype.slice.call(acc.querySelectorAll('.acc-panel'));
    var animatingPanel = null;
    var animatingTimer = 0;

    function settle(panel) {
      panel.style.height = '';
      panel.classList.remove('is-animating');
      if (animatingPanel === panel) animatingPanel = null;
    }

    function collapseNow(panel) {
      if (!panel) return;
      if (panel === animatingPanel) {
        clearTimeout(animatingTimer); // snap: cancel in-flight, nothing queued
        settle(panel);
      }
      panel.setAttribute('hidden', '');
    }

    function openPanel(panel) {
      panel.classList.add('is-animating');
      panel.removeAttribute('hidden');
      var target = panel.scrollHeight; // measured once, on open
      animatingPanel = panel;
      if (reduceMotion) { settle(panel); return; }
      panel.style.height = '0px';
      void panel.offsetHeight;         // commit the 0px start before transitioning
      panel.style.height = target + 'px';
      clearTimeout(animatingTimer);
      animatingTimer = setTimeout(function () { settle(panel); }, 400);
    }

    function setItem(head, open) {
      var idx = heads.indexOf(head);
      if (idx === -1) return;
      head.setAttribute('aria-expanded', open ? 'true' : 'false');
      var panel = panels[idx];
      if (!panel) return;
      if (open) openPanel(panel);
      else collapseNow(panel);
    }

    heads.forEach(function (head) {
      head.addEventListener('click', function () {
        var isOpen = head.getAttribute('aria-expanded') === 'true';
        // Single-open: collapse all, then open the clicked one (unless it was open).
        heads.forEach(function (h) { if (h !== head || isOpen) setItem(h, false); });
        setItem(head, !isOpen);
      });
    });
  }

  /* ---------- 5. Footer year ---------- */
  var yEl = document.getElementById('year');
  if (yEl) yEl.textContent = String(new Date().getFullYear());

  /* ============================================================
     MOTION v1 (MOTION_SPEC.md)
     ============================================================ */

  /* ---------- 6. Stagger engine (2.2): zero-based --i per group, set once ----------
     The per-index multipliers live in CSS as --sd-stag-step and are clamped to
     --sd-stagger-cap by min(). The cap here mirrors that as a second line of
     defence; the CSS min() is the real guarantee. */
  var STAGGER_CAP = 560;
  function setGroup(selector, step) {
    var cap = Math.floor(STAGGER_CAP / step);
    Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(function (el, i) {
      el.style.setProperty('--i', Math.min(i, cap));
    });
  }
  setGroup('.step', 55);
  setGroup('.eyebrow', 30);
  setGroup('.why-cell', 70);
  setGroup('.index-row', 110);
  setGroup('.camp-card', 90);
  setGroup('.program-title', 80);
  setGroup('.program-body', 80);
  setGroup('.program-features', 80);
  setGroup('.section-title', 1);   // 8, solo
  setGroup('.lede', 1);            // 4, solo
  setGroup('.btn', 1);             // 5, solo
  // spec-row: paired offset, 60ms between halves, 120ms between pairs
  Array.prototype.slice.call(document.querySelectorAll('.spec-row')).forEach(function (el, i) {
    el.style.setProperty('--pair', Math.floor(i / 2));
    el.classList.add(i % 2 === 0 ? 'is-odd' : 'is-even');
  });
  // .testimonial-row (6): NO MOTION (spec 4.9). Never given --i.

  /* ---------- 7. Hero word split (4.1) ---------- */
  (function splitHeading() {
    var h1 = document.querySelector('.hero-title');
    if (!h1) return;
    h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
    var words = [];
    /* Walk CHILD NODES, never textContent. The old version read textContent per
       line and wrote a flat fragment back, which DESTROYED the inline markup:
       .hero-title strong { color: var(--yellow) } existed in the stylesheet but
       the <strong> around "Experience." was deleted on load, so line 2 rendered
       solid white. Preserving element nodes and splitting their text children
       keeps the emphasis — and any future emphasis — alive through the split. */
    function splitWords(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.nodeValue.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var s = document.createElement('span');
            s.className = 'w';
            s.textContent = part;
            frag.appendChild(s);
            words.push(s);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          splitWords(child);          /* keep <strong>, split inside it */
        }
      });
    }
    Array.prototype.slice.call(h1.children).forEach(splitWords);
    var n = Math.min(words.length, 8); // 8-step cap, ~440ms total
    words.forEach(function (w, i) {
      w.style.setProperty('--w', Math.min(i, n - 1));
      w.setAttribute('aria-hidden', 'true');
    });
  })();

  /* ---------- 8. Program rows (4.4) ----------
     The horizontal rail is gone: without the pin it had no scroll driver and
     never travelled. The blocks are ordinary vertical reveals handled by the
     shared observer, so there is nothing to build and nothing to drive. */

  /* ---------- 9. Chapter rail (2.1) ---------- */
  var SECTIONS = ['hero', 'value-prop', 'experience-band', 'programs', 'why',
    'curriculum', 'format', 'camp', 'social-proof', 'faq', 'final-cta'];
  var railSections = SECTIONS.map(function (s) { return document.querySelector('.' + s); });
  var marker = null, railLinks = [], activeSection = -1;
  (function buildChapterRail() {
    var nav = document.createElement('nav');
    nav.className = 'chapter-rail';
    nav.setAttribute('aria-label', 'Section navigation');
    marker = document.createElement('span');
    marker.className = 'chapter-rail__marker';
    marker.setAttribute('aria-hidden', 'true');
    nav.appendChild(marker);
    SECTIONS.forEach(function (s, i) {
      var el = railSections[i];
      if (!el) return;
      var a = document.createElement('a');
      a.href = '#' + (el.id || s);
      a.setAttribute('aria-current', 'false');
      var lab = document.createElement('span');
      lab.className = 'chapter-rail__label';
      var h = el.querySelector('h1, .section-title, .exp-title, .final-title, .eyebrow');
      lab.textContent = (h ? h.textContent : s).replace(/\s+/g, ' ').trim().slice(0, 34);
      var mark = document.createElement('span');
      mark.className = 'chapter-rail__mark';
      a.appendChild(lab);
      a.appendChild(mark);
      nav.appendChild(a);
      railLinks.push(a);
    });
    document.body.appendChild(nav);
  })();
  function railVisible() { return window.innerWidth >= 1024; }

  /* ---------- 11. Ticker (4.11) ---------- */
  var tickerTrack = null;
  (function buildTicker() {
    var cta = document.querySelector('.final-cta');
    if (!cta) return;
    var lede = cta.querySelector('.lede');
    if (!lede) return;
    var statement = lede.textContent.replace(/\s+/g, ' ').trim(); // verbatim, never reworded
    // No extra accessible copy: the .lede above already carries the statement
    // exactly once in the AX tree, and the band below is aria-hidden.
    var band = document.createElement('div');
    band.className = 'ticker';
    band.setAttribute('aria-hidden', 'true');
    var t = document.createElement('div');
    t.className = 'ticker__track';
    for (var i = 0; i < 2; i++) { // twice, for a seamless -50% loop
      var s = document.createElement('span');
      s.textContent = statement;
      t.appendChild(s);
    }
    band.appendChild(t);
    cta.insertBefore(band, cta.firstChild);
    tickerTrack = t;
    if (reduceMotion) return; // static readable line, no loop
    if ('IntersectionObserver' in window) {
      // paused off-screen: no CPU spent on an invisible marquee
      var to = new IntersectionObserver(function (es) {
        es.forEach(function (e) { band.classList.toggle('is-in', e.isIntersecting); });
      }, { threshold: 0.01 });
      to.observe(band);
    } else {
      band.classList.add('is-in');
    }
  })();
  function sizeTicker() {
    if (!tickerTrack || reduceMotion) return;
    var w = tickerTrack.scrollWidth;
    // Constant ~40px/s: duration sized to the real track width, not a fixed number.
    if (w > 0) tickerTrack.style.setProperty('--sd-ticker-dur', (w / 40) + 's');
  }

  /* ---------- 12. Pointer state (4.8 tilt, 4.11 magnetic) ----------
     One listener on the grid, one on the section. Never per card, never
     mousemove, never a getBoundingClientRect inside a handler. */
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var campGrid = document.querySelector('.camp-grid');
  var campCards = campGrid ? Array.prototype.slice.call(campGrid.querySelectorAll('.camp-card')) : [];
  var cta = document.querySelector('.final-cta');
  var magnetBtn = cta ? cta.querySelector('.btn') : null;
  var magnet = { cx: 0, cy: 0, active: false };
  if (campGrid && fine) {
    campGrid.addEventListener('pointermove', function (e) {
      campGrid._px = e.clientX; campGrid._py = e.clientY; campGrid._p = true;
    }, { passive: true });
    campGrid.addEventListener('pointerleave', function () {
      campGrid._p = false;
      campCards.forEach(function (c) {
        c.classList.remove('is-tilting', 'is-lifted');
        c.style.transform = '';
      });
    }, { passive: true });
  }
  if (magnetBtn && fine) {
    cta.addEventListener('pointermove', function (e) {
      magnet.cx = e.clientX; magnet.cy = e.clientY; magnet.active = true;
    }, { passive: true });
    cta.addEventListener('pointerleave', function () {
      magnet.active = false;
      magnetBtn.style.transform = '';
      magnetBtn.classList.remove('is-wc-magnet');
    }, { passive: true });
  }

  /* ---------- 13. THE single shared rAF loop (2.3) ----------
     One reader, one pass, driving blobs + band + tilt + magnetic + ticker
     sizing. One cached rect per section per frame. The loop unsubscribes when
     the page is hidden. */
  var running = false;
  var wc = { blob: false, band: false };
  var tickerW = 0;

  function frame() {
    var h = window.innerHeight;
    var vh = h * 0.5;

    /* chapter rail: active = last section whose top passed 50vh, ties earlier */
    if (railVisible()) {
      var act = -1;
      for (var i = 0; i < railSections.length; i++) {
        if (railSections[i] && railSections[i].getBoundingClientRect().top <= vh) act = i;
      }
      if (act !== activeSection) {
        railLinks.forEach(function (a, j) {
          a.setAttribute('aria-current', j === act ? 'true' : 'false');
        });
        if (act >= 0) {
          var mr = railLinks[act].getBoundingClientRect();
          var cr = railLinks[0].parentNode.getBoundingClientRect();
          marker.style.transform = 'translate3d(0,' + (mr.top - cr.top) + 'px,0)';
        }
        activeSection = act;
      }
    }

    /* hero blob parallax: three depths, clamped to the hero's scroll range */
    var hero = document.querySelector('.hero');
    if (hero) {
      var hr = hero.getBoundingClientRect();
      var hvis = inView(hr, h);
      var blobs = hero.querySelectorAll('.hero-blob');
      var layers = [0.14, 0.10, 0.06];
      for (var b = 0; b < blobs.length; b++) {
        if (hvis) {
          if (!wc.blob) { blobs[0].classList.add('is-wc-blob'); wc.blob = true; }
          blobs[b].style.setProperty('--px',
            (clamp(hr.bottom - h, 0, h) * layers[b] * -1).toFixed(2) + 'px');
        } else if (wc.blob) {
          for (var q = 0; q < blobs.length; q++) {
            blobs[q].classList.remove('is-wc-blob');
            blobs[q].style.removeProperty('--px');
          }
          wc.blob = false;
        }
      }
    }

    /* experience band image parallax: against the section, clamped +/-40px */
    var band = document.querySelector('.experience-band');
    if (band) {
      var br = band.getBoundingClientRect();
      if (inView(br, h)) {
        if (!wc.band) { band.classList.add('is-wc-band'); wc.band = true; }
        band.style.setProperty('--px',
          clamp((br.top + br.height / 2 - vh) * -0.14, -40, 40).toFixed(2) + 'px');
      } else if (wc.band) {
        band.classList.remove('is-wc-band');
        band.style.removeProperty('--px');
        wc.band = false;
      }
    }

    /* camp tilt: transform written once per frame, behind hover/fine only */
    if (campGrid && campGrid._p && fine) {
      var gr = campGrid.getBoundingClientRect();
      if (inView(gr, h)) {
        var nx = (campGrid._px - gr.left) / gr.width - 0.5;
        var ny = (campGrid._py - gr.top) / gr.height - 0.5;
        for (var c = 0; c < campCards.length; c++) {
          var card = campCards[c];
          var cr = card.getBoundingClientRect();
          if (campGrid._px < cr.left || campGrid._px > cr.right ||
              campGrid._py < cr.top || campGrid._py > cr.bottom) {
            card.classList.remove('is-tilting', 'is-lifted');
            card.style.transform = '';
            continue;
          }
          card.classList.add('is-tilting', 'is-lifted');
          // max 4deg per axis: pointer offset is +-0.5, multiplied by 8
          card.style.transform = 'rotateX(' + (-ny * 8).toFixed(2) + 'deg) rotateY(' +
            (nx * 8).toFixed(2) + 'deg) translateY(-6px)';
        }
      }
    }

    /* magnetic CTA: 0.28 of the offset, hard-capped +/-14px, never the raw offset */
    if (magnetBtn && magnet.active && fine) {
      var br2 = magnetBtn.getBoundingClientRect();
      if (br2.width) {
        var mx = clamp((magnet.cx - (br2.left + br2.width / 2)) * 0.28, -14, 14);
        var my = clamp((magnet.cy - (br2.top + br2.height / 2)) * 0.28, -14, 14);
        magnetBtn.classList.add('is-wc-magnet');
        magnetBtn.style.transform =
          'translate3d(' + mx.toFixed(2) + 'px,' + my.toFixed(2) + 'px,0)';
      }
    }

    /* ticker: size the loop once, then leave it to the compositor */
    if (tickerTrack) {
      var tw = tickerTrack.scrollWidth;
      if (tw && tw !== tickerW) { tickerW = tw; sizeTicker(); }
    }

    if (running) tick();
  }

  var raf = window.requestAnimationFrame;
  function tick() { raf(frame); }
  function start() { if (!running) { running = true; tick(); } }
  function stop() { running = false; }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
  window.addEventListener('resize', sizeTicker, { passive: true });

  /* ---------- 2.4 Reduced-motion master guard ----------
     No rAF loop is started, no word split is applied, and every reveal lands on
     its final state. Content stays complete because the reveal is .js-scoped
     (EVA CORRECTION 3) and the ticker was already built as a static line. */
  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  start();
})();
