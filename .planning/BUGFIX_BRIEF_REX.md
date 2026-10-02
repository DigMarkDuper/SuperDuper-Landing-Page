# BUG FIX BRIEF — motion pass regression (3 bugs)

**To:** REX (developer)
**From:** EVA (coordinator)
**Repo:** `E:/1. Working/2. Super Duper/landing-page`
**Baseline:** `0711719` (currently pushed to `origin/main`, and **live on Vercel** at
`superduperlanguagecenter.vercel.app`, which builds from `main`)
**Date:** 2026-10-02
**Priority:** LIVE BUG. Every fix here goes public on push. Do not `git push`. Do not commit.

`MOTION_SPEC.md` and the two earlier briefs are **superseded for this task** where they conflict with
this brief. This brief wins on every point.

---

## 0. READ THIS FIRST — one of my earlier findings was wrong

In a first pass I reported that `.step`, `.why-cell`, `.section-title`, `.spec-row` and `.camp-card`
had `animation-duration: 0s`, i.e. "the entrance animations are dead." **That was a measurement
error on my part and it is retracted.** My probe read computed styles at page top without scrolling
sections into view, so `.is-visible` had not been applied yet and the animation rules were not in
effect.

Corrected measurement — sections scrolled into view first, viewport 2005px:

```
.step            n=10  visible=10  delay=[0,1,2,3,4,5,6,7,8,9] ms   dur=0.32s  name=sd-in-up
.why-cell        n=6   visible=6   delay=[0,70,140,210,280,350]ms   dur=0.32s  name=sd-in-up-why
.spec-row        n=6   visible=6   delay=[0,60,120,180,240,300]ms   dur=0.32s  name=sd-in-left/right
.index-row       n=4   visible=4   delay=[0,1,2,3]ms                dur=0.32s  name=sd-in-left
.camp-card       n=3   visible=3   delay=[0,1,2]ms                   dur=0.56s  name=sd-in-down
.hero-title .w   n=5   visible=0   delay=[0,55,110,165,220]ms        dur=0.56s  name=sd-word-in
.section-title   n=8   visible=8   delay=[120,0,0,0,0,0,0,0]ms        dur=0.82s/0.32s
```

Animations run. Opacity ends at 1. No JS errors at any width. **The animations are working — they
are simply too fast and their stagger is wrong.** Do not "fix" a non-existent dead-animation bug.
Do not restructure the reveal system. Bug 2 is a timing bug, not a wiring bug.

---

## 1. BUG 1 — DEAD SPACE. 2,460px of nothing at ≥900px viewports. THE BIG ONE.

Measured on the live build, viewport 2005 and 1440:

| Section | Section height | Content actually ends at | DEAD SPACE |
|---|---|---|---|
| `.programs` | 2920px | 1219px | **1701px** |
| `.curriculum` | 1631px | 872px | **759px** |

At 390px both are correct (`.programs` dead = 0px, `.curriculum` dead = 84px). That is why it looks
fine on a phone and broken on a desktop.

Cause: `min-height` reserves pin distance, but **nothing is pinned**. The tokens at
`styles.css:1700-1708` (`--sd-hc-*`, `--sd-hs-*`) feed:

```
styles.css:1874  .js .programs   { min-height: calc(var(--sd-hc-1440) + 0.9 * 100vh); }
styles.css:1877  .js .programs   { min-height: calc(var(--sd-hc-900)  + 0.6 * 100vh); }
styles.css:1880  .js .programs   { min-height: calc(var(--sd-hc-1280) + 0.9 * 100vh); }
and the matching .curriculum rules at 1927+ using --sd-hs-*
```

`.curriculum-index` is `position: sticky; top: 50vh` (`styles.css:1899`). Sticky pins an element
**within its containing block's scroll range**. Because the section's extra height is empty rather
than being traversed by sticky content, the index just scrolls away immediately and the reserved
space becomes a void. The pin never engaged. It was speculative geometry with nothing to pin.

### Ruling: remove the pin. It is not salvageable.

Do **not** try to make the sticky index work. There is no scroll container to pin against, the
programs rail has no transform driving it (see bug 2 note), and 900px of `min-height` is the entire
cause. A fake pin is strictly worse than no pin.

Required:

1. Delete the `.programs` `min-height` rules at 1874 / 1877 / 1880 and the `.curriculum`
   `min-height` rules at 1927+.
2. Delete the now-unused `--sd-hc-900/1280/1440` and `--sd-hs-900/1280/1440` tokens at 1700-1708.
3. Delete `.curriculum-index` display rules (`.js .curriculum-index { display: none }` at 1889, the
   `@media (min-width: 56.25rem)` block at 1893-1925, and its reduced-motion rule at 2119).
4. If `.curriculum-index` markup exists in `index.html`, delete the element. **Check whether any JS
   references it first** (`script.js` builds it or queries it — grep before removing, and remove the
   JS that populates it so there is no dead code).
5. Keep `.programs-track` and `.program-block` as normal, static, vertical-stacking content. The
   rail becomes an ordinary stacked list. Remove any `flex`/`min-width` rail-only geometry that no
   longer has a purpose.

**Expected result: `.programs` and `.curriculum` return to their natural content height, and dead
space in both drops to ≤84px (the pre-existing bottom padding).** That is the acceptance test for
bug 1. Do not "preserve" the +810/+720 deltas — those deltas ARE the bug. `MOTION_SPEC.md` §5
authorised those deltas for a pin that does not work, and that authorisation is **withdrawn**.

---

## 2. BUG 2 — TIMING. Animations too fast, and two staggers are effectively zero.

Two distinct timing defects.

### 2a. The `--i` multiplier is wrong for two groups — stagger collapses to nothing

`styles.css:1789` sets the base delay:

```css
.js .step.is-visible, ... { animation-delay: calc(var(--i, 0) * 1ms); }
```

`1ms` per index. Measured result: 10 `.step` elements get delays `[0,1,2,3,4,5,6,7,8,9]` **milliseconds**.
A 9ms spread across a 10-item sequence is invisible — the whole group animates as one blob.
Same defect at `styles.css:1869` for `.index-row`: delays `[0,1,2,3]ms`.

Compare the groups that DO work, which override this with their own multipliers:
`.why-cell` `* 70ms` (line 1884) → 350ms spread, and `.spec-row` → 300ms spread. Those two are
correct. `.step` and `.index-row` are broken.

Fix: give `.step` and `.index-row` real per-index multipliers so their total spread lands in the
500-560ms band, consistent with `.why-cell`. `.step` has 10 items, so ~55ms per index gives 495ms.
`.index-row` has 4 items, ~110ms gives 330ms. Keep `--sd-stagger-cap: 560ms` as the ceiling and keep
the JS cap that enforces it (`script.js:158`).

### 2b. `--sd-stagger-cap` is declared but never used as a cap

`styles.css:1698` declares `--sd-stagger-cap: 560ms`, but line 1789/1869 compute
`calc(var(--i, 0) * Nms)` with no `min()`. `script.js:158` caps the *index* at a JS-side cap rather
than clamping computed time. Ensure no group's total delay can exceed 560ms — if you add a group,
clamp with `min()` in CSS rather than relying on JS.

### 2c. The whole timing scale is too fast

Current scale (`styles.css:1693-1697`):

```
--sd-dur-micro: 160ms
--sd-dur-fast: 320ms
--sd-dur-base: 560ms
--sd-dur-slow: 820ms
```

Ejak's report: **"all animation in text is too fast."** 320ms for a text entrance reads as a flash,
and 55ms word spacing on the 5 hero words makes the heading look like it blinks in.

New scale — adopt exactly this:

```
--sd-dur-micro: 160ms   (unchanged — hover/press feedback only)
--sd-dur-fast:  560ms   (was 320ms) — small text elements, spec rows, index rows
--sd-dur-base:  820ms   (was 560ms) — cards, program blocks, camp cards, hero words
--sd-dur-slow: 1100ms   (was 820ms) — section titles, the clip-path wipe
```

And retime the hero word cascade to read as deliberate, not a blink:

```
5 hero words: keep 55ms spacing, but on --sd-dur-base (820ms).
Final word lands at 220ms + 820ms = ~1040ms after first paint. That is the target.
```

`.section-title` currently mixes 0.82s and 0.32s in the same group — that inconsistency is part of
why text feels erratic. Make every `.section-title` the same duration (`--sd-dur-slow`).

Note `section-title` also shows a stray `delay=120ms` on the first element only. Check where that
comes from and make it deliberate (0 is fine) rather than incidental.

### 2d. Programs rail is inert — leave it inert, but do not leave dead code

`.program-block` measured: `animation-name: none`, `animation-duration: 0s`, `.programs-track`
`transform: none` at 2005px. Because bug 1 removes the pin, **the horizontal rail has no scroll
driver and cannot work.** Do not attempt to build a scroll-driven rail in this fix — that is a
separate feature, not a bug fix, and it needs the pin to be worth doing.

Required instead: make `.program-block` a normal staggered vertical entrance like the other groups
(it already has `.reveal`), and remove any now-dead rail JS (track transform, progress mapping,
`--sd-hc-*` consumers). No dead code, no half-wired feature.

---

## 3. BOUNDARIES

May edit: `styles.css`, `script.js`, `index.html` (only to delete the now-unused
`.curriculum-index` element, if present).

Forbidden: `git commit`, `git push`, `git add`, any branch operation. Any asset. Any `.md` file.
`.planning/_measure/` is gitignored — leave it. No new copy, no invented dates/numbers/testimonials.
No new dependencies, no CDN, no framework.

Keep: the MOTION v1 block stays last in `styles.css`; its "MUST STAY LAST" comment stays; the 3
`prefers-reduced-motion` blocks stay byte-identical; all hidden states stay `.js`-scoped; exactly
one `requestAnimationFrame` loop and one scroll listener remain; the 3 blob spans + 3 blob keyframes
stay as they are; `index.html` keeps all 3 `[FILL: ...]` placeholder tokens verbatim.

---

## 4. VERIFY BEFORE REPORTING — measured values, not adjectives

Reuse the existing harness in `.planning/_measure/` (gitignored, playwright already installed):
`verify.mjs` is the 18-assertion suite, `eva-geometry.mjs` compares against a git baseline,
`eva-bug2.mjs` measures stagger. Adjust paths/assertions as needed; do not weaken assertions to make
them pass.

Required results:

1. **Dead space** — at 2005 and 1440: `.programs` and `.curriculum` dead space ≤84px each. Print the
   four numbers.
2. **Stagger** — `.step` total spread ≥450ms and ≤560ms; `.index-row` spread ≥300ms. Print both.
3. **Timings** — computed `animation-duration` on `.step`=560ms, `.camp-card`=820ms,
   `.hero-title .w`=820ms, `.section-title`=1100ms. Print the 4 values.
4. **No regression** — run the full 18-assertion suite. Target 18/18. Any gate that now legitimately
   fails **because the pin was removed by ruling** (e.g. the "+810/+720 delta" assertions in the old
   suite) must be **deleted, not suppressed** — the delta requirement is withdrawn by bug 1. Report
   exactly which assertions you removed and why.
5. **Geometry** — run `eva-geometry.mjs` against `0711719`. Expect `.programs` and `.curriculum`
   deltas to now be **negative** (sections shrink back to content height). Print the table.
6. **Reduced motion** — 0 invisible elements, full text length. **JS disabled** — 0 invisible
   elements. Console errors 0 at 390/768/1440/2005/2560. Horizontal overflow 0 at all five.
7. **No dead code** — `grep -n "sd-hc-\|sd-hs-\|curriculum-index" styles.css script.js` returns
   nothing.

Report: files changed + line counts, the measured values for items 1-3, the item 4 and 5 tables,
which assertions you deleted, and anything you could not achieve. Do not paste file contents.