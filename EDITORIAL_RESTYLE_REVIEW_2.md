# EDITORIAL RESTYLE — REVIEW 2 (live build gate)

**From:** Neo (designer) · **To:** EVA → REX · **Date:** 2026-10-01
**Reviewed:** live build at `http://127.0.0.1:8768/`, measured in-browser at 1352×692 + capture 1425×12364.
**Verdict:** ship after FIX 1 + FIX 2. Everything else passes.

<!-- Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V4 -->

## FIX 1 — hero is 1236px tall; badge is 332px below the fold. **BLOCKER**

**Measured (1352×692, live):** hero `height: 1236px` vs `min-height: 692px`. Rows `743px / 224px`, `row-gap: 64px`, padding `140px / 64px`. H1 `top=251..612`. CTA `top=879`. Badge `top=1024`. Nothing was mis-measured — the hero holds more content than a viewport. Three causes, all structural.

**1a · The H1 is 3 lines, not 2 — the real height driver.** `Live the Experience.` at 140px needs **1334px**; the content track is **1304px**, so it wraps. Client rects: `518×196 @334` + `794×196 @454`. H1 block = **361px**, not the 241px the spec assumes.

```css
--type-display: clamp(3.25rem, 9vw, 8rem);                    /* was clamp(3.25rem, 11.5vw, 8.75rem) */
.hero .lede    { font-size: clamp(1.25rem, 2.4vw, 2.25rem); }  /* was --type-runner, max 2.6rem */
```

`8rem` = 128px → `Live the Experience.` measures **1219px**, one line at ≥1320px viewport. **Keep 8rem. Do not shrink the H1 into irrelevance** — this fix is structural, not typographic.

**1b · `padding-top` double-counts the nav.** Header is `position: sticky` and in flow — measured `.hero` `top = 77` = nav height — yet `.hero` adds `calc(var(--nav-h) + var(--space-2xl))` = 140px on top. 76px dead.

```css
.hero { padding-block: var(--space-2xl) var(--gutter); }
```

**1c · The badge costs 288px as a stacked card — make it a strip.** As a grid row it adds `224px + 64px gap`. Re-express it as the **full-width instrument strip at the hero's foot**: three meta columns inline, one hairline above. Still the conversion surface, reads *more* editorial than a 280px card, costs 76px instead of 288px.

```css
.batch-badge {
  align-self: end; justify-self: stretch;          /* stretch, not start */
  width: auto; padding: .85rem 0 0;
  border: 0; border-top: 1px solid rgba(255,255,255,.32);
  display: grid; align-items: baseline; column-gap: var(--space-2xl);
  grid-template-columns: max-content repeat(3, minmax(0,1fr));
}
.batch-badge__glyph, .batch-badge__emblem { display: none; }  /* glyph optional, spec 5.7 */
.batch-badge__meta { display: contents; }
.batch-badge__row  { border-top: 0; padding-block: 0;
                     grid-template-columns: max-content minmax(0,1fr); }
.hero { row-gap: var(--space-xl); }               /* was --space-2xl */
```

Keep `.batch-badge__label` + the three `.batch-badge__row` pairs. **No copy changes.** Status dot still ships with `Pendaftaran dibuka`.

**1d · Budget — fits 100svh with slack.** Hero content lands at ≈636px against 691px available at 1366×768 (+55), 723px at 1280×800 (+87), 823px at 1440×900 (+187). Below 1320px the H1 takes 2 lines and the hero grows ~120px — intended responsive behaviour, not a regression.

**Verify** (DevTools console at 1366×768 / 1280×800 / 1440×900):

```js
const q=s=>document.querySelector(s), B=s=>Math.round(q(s).getBoundingClientRect().bottom),
      h=Math.round(q('.hero').getBoundingClientRect().height), c=B('.hero-ctas'), b=B('.batch-badge');
console.log({vh:innerHeight, hero:h, cta:c, badge:b,
  verdict: h<=innerHeight-57 && c<=innerHeight && b<=innerHeight ? 'PASS' : 'FAIL'});
```

`PASS` = `hero ≤ innerHeight − 57` (nav 77 less 20px tolerance) and both bottoms ≤ `innerHeight`. Visual: CTA row and `NEXT BATCH` strip both visible unscrolled.

## FIX 2 — ghost glyph reads as a soft blob, not hairline geometry. **HIGH**

`.hero-ghost-glyph` is Poppins 800 `"S"` at **703px**, `opacity .55`, `top: -.18em`, clipped by `.hero { overflow: hidden }`. In the capture only the lower bowl survives the crop — an amorphous dark mass at top-left, not a letterform. (The soft circles lower-right are Supergrafis-03 and read correctly.)

```css
.hero-ghost-glyph {
  top: -.10em; left: -.04em;
  font-size: clamp(18rem, 42vw, 38rem);   /* was clamp(20rem,52vw,46rem) = 703px */
  color: transparent;
  -webkit-text-stroke: 2px rgba(255,255,255,.09);
  opacity: 1;                              /* the stroke carries it */
}
```

Stroke vs `#034E9E` ≈ 1.5:1 — present, structural, self-subordinate, same discipline as §5.3. Do not redraw the Brandmark geometry.

**Verify:** screenshot hero at 1440. The glyph must read as one recognisable letterform — both bowls visible, not a cropped mass.

## FIX 3 — page reads striped. `#format` is the offender. **MEDIUM**

**Measured fields, DOM order:** blue · white · blue · white · white · white · **blue** · white · white · blue900 · blue900. Three consecutive white index sections (`#program` head → `#why` → `#kurikulum`) are interrupted by a **blue `#format`** — a section spec §4 row 7 designed as a *light* tabular spec sheet. That one band is what makes the page read striped. The reference is a mostly-light field with two dark punctuation marks.

```css
#format { background: var(--white); color: var(--ink); }
#format h2, #format dt, #format dd { color: var(--ink); }
#format .eyebrow { color: var(--blue-600); }
#format .spec-row { border-top-color: var(--gray); }
```

That leaves **3 dark fields** across 12 sections. Do not touch the program blocks or the FAQ — they work as specced.

**Verify:** full-page screenshot. Dark bands countable as hero → experience band → FAQ/final-CTA run. Nothing between `#program` and `#camp`.

## FIX 4 — two program block titles are `h2`, not `h3`. **MEDIUM (a11y)**

Measured sequence in `#program`: `H2 Dua Jalur Belajar…` → `H2 Intensive Executive English` → `H2 English Camp · Asrama`. Three siblings at one level; spec §4 row 4 specifies H3 per block. No copy touched.

```html
<h3>Intensive Executive English</h3>
<h3>English Camp · Asrama</h3>
```

**Verify:** `[...document.querySelectorAll('#program h2, #program h3')].map(h=>h.tagName)` → `['H2','H3','H3']`.

## Confirmed clean — do not re-open

1. Hero type `rgb(255,255,255)` + `strong rgb(249,208,36)`; two-weight stack and single yellow accent correct. All three §9.1 ledes white — no `#4B5A6E` on any blue field.
2. Focus ring `2px var(--blue-700)` / offset 3px + dark-section white override. No yellow ring. `overflow-x: clip` (not `hidden`), `body { line-height: 1.5 }`, radius 0/2px, no pills, no shadows, no CTA gradients.
3. All 4 `#camp` images at `naturalWidth` 1448/1086 — loaded. Optional: the 3-up row mixes landscape and portrait crops, so `object-position` may need tuning.
4. H1 roman, no italics; sentence-runners with inline `<strong>` working in `#mengapa`; Supergrafis-03 at 100% as the hero field, self-subordinate; all four `[FILL]` placeholders intact, no invented copy.

## Build order for REX

1. **FIX 1** — type ceiling + `padding-block` + badge strip + `row-gap`. Re-measure at 1366×768 / 1280×800 / 1440×900.
2. **FIX 4** — two `<h3>` tags. 2 minutes.
3. **FIX 2** — hairline ghost. Screenshot to confirm.
4. **FIX 3** — `#format` to white. Full-page screenshot to confirm band count.

Nothing in §5.2, §5.4, §6 or §7 needs revisiting. The type scale, two-weight H1, CTA pair, badge anatomy and motion set survived implementation intact.