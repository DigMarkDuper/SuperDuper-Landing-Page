# MOTION SPEC BRIEF — Super Duper Language Center landing page

**To:** NEO (designer)
**From:** EVA (coordinator)
**Deliverable:** `MOTION_SPEC.md` — file-first motion design spec. **No code. No CSS. No edits to any other file.**
**Date:** 2026-10-02

---

## 1. THIS RESEARCH IS DONE — DO NOT RE-DERIVE IT

Every token, count, hex and measurement below was computed by EVA from the real files and real
sites. Do **not** re-run curl, do **not** re-measure, do **not** re-derive contrast ratios. Do **not**
re-verify the URLs. Read the code if you need a class name, then start writing.

Forbidden tools for this task: `curl`, `web_search`, `browser_*`, `python`/`node` one-liners for
colour maths or measurement. You are designing from finished facts.

### Current file state (verified)

| File | Lines |
|---|---|
| `index.html` | 500 |
| `styles.css` | 1690 |
| `script.js` | 110 |

Baseline commit `6dc4450`, branch `main`, tree clean, pushed.

### Motion already in the page (verified counts)

- `@keyframes`: **7** — all named `sd-blob-a` … `sd-blob-g`, all hero background blobs
- `animation:` declarations: **8**
- `transition:` declarations: **13**
- `.reveal` elements in HTML: **80**, across 26 distinct class combinations
- `IntersectionObserver`: **1 real observer** (reveal-on-scroll, threshold `0.15`, `rootMargin '0px 0px -8% 0px'`, unobserves after first fire)
- `prefers-reduced-motion` blocks: **3** — already correct, MUST survive
- Font delivery: **none in HTML** — system stack only
- `script.js` sections: (1) reveal observer (2) sticky nav `.is-scrolled` (3) mobile hamburger (4) FAQ single-open accordion (5) footer year

### The existing `.reveal` groups — real counts, these are your stagger units

```
.step               10      .testimonial-row      6
.eyebrow            13      .spec-row             6
.why-cell            6      .index-row            4
.camp-card           3      .section-title        8
.program-title       2      .program-body         2
.program-features     2      .lede                 4
.btn                 5      (hero-ctas, hero-title, final-title, exp-title, ...)
```

### Existing brand tokens (do not change)

```
Blue   #034E9E     Yellow #F9D024     White     Gray #D1D5DB
Display: Poppins   Body: Inter (system fallback — no webfont is loaded)
```

### The 11 sections, in document order, with their line numbers in `index.html`

| # | Section | Line |
|---|---|---|
| 1 | `.hero` | 51 |
| 2 | `.value-prop` | 130 |
| 3 | `.experience-band` | 169 |
| 4 | `.programs` | 182 |
| 5 | `.why` | 217 |
| 6 | `.curriculum` | 233 |
| 7 | `.format` | 253 |
| 8 | `.camp` | 270 |
| 9 | `.social-proof` | 297 |
| 10 | `.faq` | 386 |
| 11 | `.final-cta` | 463 |

---

## 2. THE PROBLEM — read this part twice

Motion is **not missing** from this page. It is **uniform**. All 80 `.reveal` elements share one
transition, one duration, one easing, and fire the instant each crosses 15% of the viewport. Every
element animates **alone**.

Generic is not "no animation." Generic is *uniform* animation — it is what every Webflow template
and every AI-generated landing page ships. The current page feels generic because of uniformity,
not absence.

**Therefore: this is not "add more animation." More uniform animation makes it worse.**

The fix is that **each section gets its own distinct motion idea**, and grouped siblings move as a
sequence (stagger) instead of all at once.

---

## 3. REFERENCE TEARDOWN — verified by EVA, all URLs returned HTTP 200

| Ref | Technique | Vanilla difficulty | EVA ruling |
|---|---|---|---|
| `apple.com/iphone-18-pro` | Sticky-pinned scenes + 188 `clip-path` wipes, **pure CSS, zero JS libraries** | **Easy** | **ADOPT** — the blueprint |
| `apple.com/watch` | Scroll-linked chapter nav — keyframes literally named `ChapterNav_animate-item-opacity` | **Easy** | **ADOPT** |
| `on.com/en-us` | Horizontal scroll rail — vertical scroll drives horizontal translate | **Medium** | **ADOPT** — the single biggest "not generic" move |
| `koto.com` | Marquee ticker, CSS keyframe `ticker`, infinite | **Easy** (~10 lines) | **ADOPT** |
| `ochi.design` | Editorial marquee, keyframe `crawling-line` | Easy | **REJECT** — same technique as Koto, don't do both |
| `locomotive.ca` | Lenis smooth-scroll lerp | Medium | **REJECT — see 3a** |
| `resn.co.nz` | WebGL scene | Hard | **REJECT** — out of scope, and EVA's re-check returned only 4KB of HTML, so the "WebGL at 2190×1133" claim is unverified. Do not cite it. |

### 3a. Why smooth-scroll is REJECTED (do not add Lenis-style lerp)

It hijacks native scroll, breaks keyboard and screen-reader paging, is a known mobile-scrollbar
bug source, and — decisively — a lerped scroll loop is the single most recognisable **"2021 agency
template"** signal on the web. Adding it would make this page *more* generic, which is the explicit
anti-goal.

### 3b. The competitor evidence — this is the strongest argument in the brief

EVA measured the actual competitors:

```
Lingoda (direct language-school rival)   3 CSS animations total, effectively static
EF                                        46 uniform generic enter-fades, zero scroll linkage
Preply                                   textbook course-platform SEO structure
Superlist                                Framer SaaS: feature grid + testimonial wall
Duolingo (marketing site)                1 animation. Their motion lives in the APP, not the site.
```

**A language-school landing page that is static gets a competitor's job done.** Being a bootcamp
that *moves* is the differentiator. Do not soften this into "a few tasteful fades."

---

## 4. EVA'S RULING — the motion system, section by section

This is decided. Execute it. Do not re-litigate it in prose; if you disagree with one item, put it
in the "Disagreements" section and still spec the ruling as written.

**Global (all sections)**

1. **Chapter nav indicator** — a fixed side rail whose active marker tracks scroll position.
   Cheap, extends the existing observer pattern, and makes a long editorial page feel *guided*.
   This is the Apple Watch technique.
2. **Stagger every existing group** — the 10 `.step`, 6 `.why-cell`, 6 `.testimonial-row`,
   13 `.eyebrow`, 6 `.spec-row`, 4 `.index-row`, 3 `.camp-card`, 2 `.program-*`. Sequences must read
   as sequences. This is the single highest-value change and it costs almost nothing.
3. **One shared scroll loop.** A single `requestAnimationFrame` reader feeding all scroll-linked
   work. Never one listener per element.

**Per section**

| # | Section | Motion idea | Source |
|---|---|---|---|
| 1 | `.hero` | Blob field parallax — blobs drift slower than scroll. Heading arrives **word-by-word** split, not as one fading slab | Apple + own |
| 2 | `.value-prop` | **Clip-path wipe** on the statement, top-to-bottom | Apple |
| 3 | `.experience-band` | Image parallax — field image drifts against its section | Apple |
| 4 | `.programs` | **Horizontal scroll rail** — vertical scroll drives horizontal card translation. **The centrepiece.** | On Running |
| 5 | `.why` | Stagger the 6 `.why-cell`, ascending offset | own |
| 6 | `.curriculum` | **Sticky-pinned rail** — a pinned index stays while the 10 `.step` advance | Apple |
| 7 | `.format` | Stagger the 6 `.spec-row`, paired left/right offset | own |
| 8 | `.camp` | 3 `.camp-card` stagger + hover tilt | own |
| 9 | `.social-proof` | **DO NOT MOTION.** Placeholder content pending real testimonials. Do not invest craft in animating slots. | — |
| 10 | `.faq` | Accordion height animation. Today the panel toggles via the `hidden` attribute = **instant jump**. That is a jank source, not a flourish. Fix it. | own |
| 11 | `.final-cta` | Marquee ticker band + magnetic CTA | Koto |

**Also ruled:** cut the hero blobs from **7 to 3**. Seven drifting blobs is the trending-now
generic look; three heavily tuned ones read as intentional.

---

## 5. NON-NEGOTIABLE ENGINEERING RULES — these bind REX, spec them as constraints

- `transform` and `opacity` **only** for anything animating on scroll. Never animate
  `top/left/width/height/box-shadow` — that is exactly what makes motion feel cheap and janky.
- The FAQ fix is the **one** permitted height animation, and it must not run on every accordion
  instance simultaneously.
- Gate all pointer-driven motion behind `@media (hover: hover) and (pointer: fine)`. No tilt, no
  parallax on touch.
- **Geometry lock.** Section heights and card dimensions must not change — except the two pinned
  sections (`.programs` rail, `.curriculum` pin), where pin distance is the whole point. State the
  expected before/after height for exactly those two, and nowhere else.
- `prefers-reduced-motion: reduce` must bypass every new effect and land on the **final** state. No
  element may be left at `opacity: 0`. The 3 existing blocks stay; the spec names the one master
  guard to add in `script.js` (the file already reads `reduceMotion` at line 11).
- JS-off must show all content.
- New CSS is appended in one clearly-marked block that **must stay last in the file** — this exact
  cascade-order mistake shipped as bug `25e7b98` on this repo (equal specificity, later rule wins).
  Spec the comment that prevents its recurrence.
- No `will-change` left on settled elements. Cap total `will-change` count.
- Do not break: FAQ accordion, mobile menu, sticky nav, hero blob field, existing `.reveal`
  behaviour, the image tier block at the end of `styles.css`.

---

## 6. WHAT TO AVOID — overused right now, this is how you stay non-generic

```
count-up stat blocks                        uniform ~0.08s fade-up stagger
custom cursor followers                     "trusted by" logo rows
blob gradient backgrounds (ours is 7, cut to 3)   scroll-scrubbed WebGL hero
testimonial card grids                      generic centred hero + 3 feature boxes
```

Also rejected for this brand: purple/blue SaaS gradient, glassmorphism, neon glow, emoji icons,
rounded-pill-everything.

---

## 7. BOUNDARIES — mechanical, not advisory

You may create **exactly one file**: `MOTION_SPEC.md` at the repo root.

Forbidden: editing `index.html`, `styles.css`, `script.js`, any asset, any existing `.md`
(including `.planning/MOTION_BRIEF_NEO.md` and `MOTION_MAKE_IT_MOVE.md`), or running `git` write
commands. Generating or substituting imagery is forbidden. Inventing copy, testimonials, numbers,
dates or prices is forbidden — if a section needs a string, spec a literal `[FILL: ...]` token.

Anything outside this boundary is a **stop-and-report** condition, not a judgement call.

---

## 8. HOW TO WRITE IT — follow literally, this is not optional

The output shape is prescribed so you cannot loop on a single large write:

1. `write_file` → `MOTION_SPEC.md` with the section skeleton and all 11 section headings present.
2. `patch` each section body, anchored on that section's unique heading line.
3. **Hard cap: 400 lines total.** Brevity is a feature. A spec past 400 lines has failed.
4. **Read cap: at most 6 reads, at most 12 tool calls total before you begin writing.** You have
   every fact you need in section 1 — you do not need a research phase. Start writing immediately.

Required contents, in order:

```
1. Motion principle        — 3 sentences max, the one idea behind the system
2. Global systems          — chapter nav, stagger engine, shared rAF loop, reduced-motion guard
3. Timing table            — every duration + easing you specify, in ONE table, with the reason
4. Per-section spec        — 11 subsections, one per section in the table at 1.x
5. Geometry impact         — expected height delta for .programs and .curriculum ONLY
6. Reduced-motion matrix   — what each effect does when the OS setting is on
7. Anti-patterns rejected  — from section 6, with a one-line reason each
8. Disagreements with brief— or the literal word "None"
```

End with a "Verification targets for REX" list: the exact measurable assertions REX must prove.

---

## 9. REPORT BACK

Return: the file path, its line count, and any disagreement with the ruling in section 4.
Do not paste the spec inline. Do not claim it is done until the file exists on disk with content.