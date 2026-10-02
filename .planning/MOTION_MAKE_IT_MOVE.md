# MOTION PASS — "make it all moving, not a generic landing page"

**Owner ruling (Ejak, 2026-10-02):** find a good reference on the internet, then make the page
move throughout. Explicit anti-goal: generic landing-page feel.

**Baseline commit:** `6dc4450` (local == origin/main, tree clean at start).
**Files in scope:** `index.html`, `styles.css`, `script.js` (500 / 1690 / 110 lines).
**Hard constraint:** static HTML/CSS/JS. NO framework, NO npm, NO build step. Must still work
opened via file:// or `python -m http.server`.

## Verified baseline (measured, not assumed)

| Fact | Value |
|---|---|
| `@keyframes` | 7 (all hero background blobs: `sd-blob-a`..`g`) |
| `animation:` decls | 8 |
| `transition:` decls | 13 |
| `.reveal` elements in HTML | 80 |
| IntersectionObservers | 4 sites (really 1 observer, 4 `grep` hits) |
| `prefers-reduced-motion` blocks | 3 (already correct — must be preserved) |
| Font delivery | none in HTML — system stack only |

## The real diagnosis

Motion is NOT absent. It is **uniform**. 80 elements share one `.reveal` class with one
transition, all firing the instant they cross 15% viewport. Every element animates alone, at the
same duration, with the same easing, and nothing in the page has depth, velocity, or
relationship to scroll position.

That uniformity IS the generic feel. Generic is not "no animation" — generic is *uniform*
animation, which is what every Webflow template and every AI-generated page ships.

So the pass is not "add more animation." It is:
1. **Stagger** grouped siblings so sequences read as sequences (10 `.step`, 6 `.why-cell`,
   6 `.testimonial-row`, 13 `.eyebrow`, 6 `.spec-row`, 4 `.index-row` are the natural groups).
2. **Scroll-linked depth** — hero drifts slower than scroll; blob field gets parallax.
3. **Text-split reveal** on display type (`.hero-title`, `.section-title`, `.final-title`)
   so headings arrive line/word by line instead of fading as one slab.
4. **Micro-interactions** on the interactive elements that already exist (program cards,
   `.mf` CTA, camp cards, FAQ heads) — tilt/magnetic/arrow-shift, all transform+opacity only.

## Non-negotiable engineering rules

- `transform` and `opacity` ONLY for anything that animates on scroll. Never animate
  `top/left/width/height/box-shadow` — that is the jank that makes motion feel cheap.
- One shared `requestAnimationFrame` scroll loop with a rAF-throttled read. Never attach a
  scroll listener per element.
- `prefers-reduced-motion: reduce` must bypass every new effect and show final state. The 3
  existing blocks stay; add one master guard in JS (the file already reads `reduceMotion`).
- No `will-change` left behind on elements once settled. Cap the total count.
- All new CSS appended in a clearly marked section with a comment saying it must stay last
  (same cascade-order lesson as the `25e7b98` tier bug: equal specificity, later wins).
- Touch devices: no pointer-parallax, no tilt. Gate on `(hover: hover) and (pointer: fine)`.
- Must not break: FAQ accordion, mobile menu, sticky nav, hero blob field, existing
  `.reveal` behaviour when JS is off.

## Gates before this ships

- [ ] No console errors.
- [ ] `scrollWidth <= innerWidth` at 390 / 768 / 1440 / 2005 / 2560 (no horizontal overflow).
- [ ] Layout geometry unchanged: section tops, card heights, CTA positions before vs after.
- [ ] Reduced-motion: with the OS setting on, no motion, nothing invisible.
- [ ] Reduced-motion: no element left at `opacity: 0`.
- [ ] JS-off: all content visible.
- [ ] `git status --short` clean before start; every hunk accounted for after.

## Loop

1. JOY research: references + technique teardown + overused-technique warnings. IN FLIGHT.
2. NEO: motion design spec (`MOTION_SPEC.md`) — file-first, no code.
3. REX: implement spec.
4. NEO: visual review gate.
5. REX: fix pass.
6. EVA: measure every gate above myself. Commit (push is a SEPARATE gate).

## Open items carried forward (not motion, still blocking publish)

- `[FILL: tanggal & jam]`, `[FILL: jumlah kursi]` — index.html:116,119
- 26 dead `href="#"`; no contact/WhatsApp wired anywhere (conversion gap)
- No deploy target: no `netlify.toml` / `vercel.json` / `CNAME`, `has_pages: false`
- `task_plan.md` still says P1 in_progress — all 6 phases actually shipped
- ~4.2MB orphaned Elsya assets, 0 references in code
