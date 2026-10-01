# EDITORIAL RESTYLE SPEC — Super Duper Language Center landing page

<!-- Hallmark · genre: editorial · macrostructure: Catalogue (editorial index) · theme: brand-locked (Poppins/Inter, #034E9E + #F9D024) · enrichment: E-none (brand supergraphics as tonal field) · nav: N9 Edge-aligned minimal · footer: Ft1 Mast-headed · studied: yes · DNA-source: url (landonorris.com, structure only) -->

**From:** Neo (designer)
**To:** EVA (coordinator)
**Date:** 2026-10-01
**Deliverable:** design direction only. No file in the project was modified.
**Status of numbers in this document:** every contrast ratio, hex and dimension below was measured from the real files (see §11 Method). Nothing is estimated.

---

## 1. Design intent

1. **One focal point per screen, enforced by subtraction.** The live hero stacks eight competing decorative layers; the reference stacks three elements. We delete five layers and pin the rest to the viewport edge.
2. **Hierarchy through type weight and hairlines, not through boxes.** Six of twelve sections are currently "grid of rounded rectangles with a heading and a paragraph." Cards are replaced by editorial index lists and tabular spec sheets — the page becomes an argument, not a product shelf.
3. **The brand is the ornament.** Super Duper already ships a monogram pattern (Supergrafis-03) that is a genuine tonal field, not a decoration competing for attention. It replaces the gradient, bubbles, confetti, and glow.
4. **The hero becomes a conversion surface, not a poster.** A hairline `NEXT BATCH` badge, edge-pinned, carries enrollment status. This is the single highest-leverage element in the redesign.
5. **Sharp, not soft.** Every radius token goes to 0 or 2px. No pills, no gradients on CTAs, no drop shadows on surfaces. Restraint is the premium signal.

**Design context (inferred from brief — say "go ahead" to override):** audience = Indonesian students and young professionals who already suspect English programs are overpriced; use case = one action, start enrollment; tone = editorial / austere-premium.

---

## 2. Type scale

Poppins is the display face, Inter the body face, per `AI_BRAND_VISUAL_SPEC_2026` §4. **No serif anywhere** — the reference's Brier is re-expressed structurally (huge, tight-leading, two-weight contrast), not typographically.

All values are `clamp(min, preferred, max)`. Breakpoint floor is 320px.

| Token | Value | Face / weight | LH | Tracking | Used by |
|---|---|---|---|---|---|
| `--type-display` | `clamp(3.25rem, 11.5vw, 10.5rem)` | Poppins 800 | **0.86** | `-0.035em` | Hero H1 two-line stack |
| `--type-split` | `clamp(2.5rem, 8vw, 6.5rem)` | Poppins 800 | **0.88** | `-0.03em` | Two-word split headings (§5, §9) |
| `--type-h2` | `clamp(1.9rem, 4.4vw, 3.6rem)` | Poppins 700 | 0.96 | `-0.025em` | Section H2, repeated rhythm |
| `--type-h3` | `clamp(1.15rem, 1.6vw, 1.4rem)` | Poppins 600 | 1.15 | `-0.015em` | Index row titles, program titles |
| `--type-runner` | `clamp(1.3rem, 2.9vw, 2.6rem)` | Poppins 400 | 1.22 | `-0.02em` | Sentence-runner paragraphs (§5) |
| `--type-lede` | `clamp(1.05rem, 1.5vw, 1.3rem)` | Inter 400 | 1.5 | 0 | Section lede |
| `--type-body` | `1rem` | Inter 400 | **1.5** | 0 | Index row body, FAQ answers |
| `--type-small` | `0.875rem` | Inter 400 | 1.45 | 0 | Captions, spec footnotes |
| `--type-eyebrow` | `0.75rem` | Inter 600 | 1.2 | **`0.18em`** | Eyebrow, badge labels, index captions |
| `--type-cta` | `0.875rem` | Poppins 600 | 1 | `0.12em` | Button labels (uppercase) |
| `--type-num` | `clamp(1.4rem, 2.2vw, 2rem)` | Poppins 700 | 1 | `-0.02em` | Curriculum step numbers (tabular) |

**Rules the developer must not break:**
- Body line-height max **1.5** (brand constraint). `1.65` currently in `styles.css` L104 is over budget.
- Line-height below 1.0 only on display type. Never on body or lede.
- All headings `font-style: normal`. No italics on any heading, ever.
- Sentence case for body. Uppercase is reserved for eyebrows, button labels, and badge labels only.
- The sentence-runner's `<strong>` uses **weight**, never italic.

---

## 3. Colour roles

Measured contrast ratios (WCAG 2.1 relative-luminance method). Full method in §11.

| Token | Hex | Role | On | Measured | Verdict |
|---|---|---|---|---|---|
| `--blue` | `#034E9E` | Primary brand field | — | — | Anchor |
| `--blue-900` | `#061A3C` | Deepest block (final CTA, FAQ) | — | — | Anchor |
| `--blue-800` | `#012B5C` | Current `--blue-deep`; nav, hover fills | — | — | Anchor |
| `--blue-700` | `#0A2A5E` | Body ink on white | white | **13.95:1** | AAA |
| `--blue-600` | `#0E3E86` | Secondary ink, links on white | white | **10.23:1** | AAA |
| `--yellow` | `#F9D024` | Energy accent | `#034E9E` | **5.44:1** | AA ✓ |
| `--yellow` | `#F9D024` | Energy accent | `#061A3C` | **11.53:1** | AAA |
| `--white` | `#FFFFFF` | Text on blue | `#034E9E` | **8.12:1** | AAA |
| `--white` | `#FFFFFF` | Text on blue | `#061A3C` | **17.2:1** | AAA |
| `--white-72` | `#B8C6D8` | Muted text on blue | `#034E9E` | **4.72:1** | AA ✓ |
| `--white-60` | `#9AA9BC` | Captions on blue (large only) | `#034E9E` | **3.41:1** | AA large only |
| `--gray` | `#D1D5DB` | Hairline rules, decor | white | 1.47:1 | **decorative only** |
| `--ink` | `#0A2A5E` | Body text on white | white | **13.95:1** | AAA |
| `--ink-muted` | `#4B5A6E` | Body text on white | white | **7.03:1** | AAA |

### Forbidden pairs — hard errors, not preferences

| Forbidden | Measured | Why |
|---|---|---|
| `#F9D024` text on `#FFFFFF` | **1.49:1** | Fails everything. Yellow is never text on white. |
| `#FFFFFF` text on `#F9D024` | **1.49:1** | Same failure inverted. |
| `#F9D024` on `#1A5BC2` | **4.24:1** | Below AA for body. Only ≥24px display. |
| `#D1D5DB` as text on `#FFFFFF` | **1.47:1** | Gray is hairlines and fills, never text. |
| `#F9D024` as focus ring on `#FFFFFF` | **1.49:1** | Ring must be visible. Use `--blue-700` (13.95:1). |
| Any gradient on a CTA or surface | — | Brand spec §12 bans excessive gradients. |
| Any hex not in this table | — | No off-brand colour enters the build. |

### The known contrast defect — fixed

`styles.css` L200 sets `.lede` to `var(--ink-muted)` = `#4B5A6E`. The hero inherits it on a blue field.

- **Current:** `#4B5A6E` on `#034E9E` = **1.15:1**. On the gradient's dark stop `#012B5C` = **1.99:1**.
- The brief states ≈2.3:1. **The measured value is worse: 1.15:1.** This is the single worst defect on the page — the hero subhead is currently close to invisible.
- **Fix:** hero lede → `#FFFFFF` (**8.12:1**). Body lede on white sections keeps `#4B5A6E` (7.03:1 ✓). Scope the override to `.hero .lede`; do not change the global token.

---

## 4. Section-by-section

Sections keep their current DOM order and IDs. Only composition changes.

The **repeated rhythm** adopted verbatim from the reference and used for §2, §5, §6, §7, §9:

```
eyebrow (tracked uppercase)  →  H2 (huge, tight)  →  one short paragraph  →  one underlined link
```

Edge system, used everywhere: content sits on a **24px gutter** (`--gutter`), sections are **full-bleed**, and are separated by **1px `--gray` hairlines** rather than whitespace alone. No centred max-width container for the hero or the index sections.

| # | Section | Current | New | Layout mechanism | Reference device |
|---|---|---|---|---|---|
| 1 | **Hero** `#hero` | Centred, gradient, 8 decor layers, pill CTAs | Edge-pinned 3-element composition + `NEXT BATCH` badge. Full detail in §5. | CSS grid `1fr`, items pinned via `align-self`/`justify-self`; no wrapper max-width | Edge-pinned hero + hairline badge card |
| 2 | **Method** `#mengapa` | 4 rounded cards in a 2×2 | Eyebrow → H2 → sentence-runner → **4-row hairline index list**. `Supergrafis-04` deleted as decor. | `display:grid; grid-template-columns: minmax(0,1fr);` rows are `grid` rows of `1fr auto`, separated by `border-top: 1px` | Sentence-runner + index list |
| 3 | **Experience band** | Blue band, centred, own pattern | Becomes the **full-bleed statement band**: `Supergrafis-03` as the field, sentence-runner at `--type-split`, no CTA, no subhead. 2 lines, max. | Block, `min-height: 60vh`, content `max-width: 18ch` for the runner, left-pinned | Closing-statement / manifesto band |
| 4 | **Program** `#program` | 2 equal rounded cards | **Two contrasting full-bleed blocks stacked** (the `ON/OFF TRACK` principle). Block A: blue, white type. Block B: `--blue-900`, one yellow hairline. Each = eyebrow / H3 / body / hairline feature list / sharp CTA. | `display:grid; gap:0;` each block `padding: var(--space-3xl) var(--gutter)`, separated by a 1px rule. Asymmetric: A is `60vh`, B is `44vh` — deliberately unequal | `ON / TRACK` split-nav blocks |
| 5 | **Why** `#why` | 6 equal rounded cards | **3×2 tabular spec sheet.** Columns: numeral · word · description. Hairline between every row and every column. `Intensive/Immersive/Practical` row 1, `Community/Confidence/Growth` row 2. | `display:grid; grid-template-columns: repeat(3, minmax(0,1fr));` each cell `border-top:1px solid var(--gray); padding-block: var(--space-lg)` | Grid index (name + year) → adapted to word + description |
| 6 | **Curriculum** `#kurikulum` | 10 steps in a flowing list, no rules | **The page's signature index.** Numbered `01`–`10`, hairline-ruled, tabular numerals, title + one line. On desktop: 2 columns of 5, reading order preserved left-column-then-right. | `display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); column-gap: var(--space-2xl);` each step `display:grid; grid-template-columns: 3.5rem minmax(0,1fr); border-top:1px` | Editorial index list w/ tracked captions |
| 7 | **Format** `#format` | 6 rounded spec cards | **Two-column tabular spec sheet.** Left column = labels, right = values, `border-top` per row, values right-aligned tabular. 6 rows. `.format-note` becomes an underlined link. | `display:grid; grid-template-columns: repeat(2, minmax(0,1fr));` each row `display:grid; grid-template-columns: minmax(0,1fr) auto; border-top:1px` | Tabular spec sheet (F3) |
| 8 | **Camp** `#camp` | 1 lead + 3 small mosaic, rounded | **Editorial image index with tracked captions.** Lead photo full-bleed left, bleeding off the bottom edge. Remaining 3 as a hairline-separated row beneath, each with a tracked uppercase caption. Existing `.camp-caption` copy retained. | Lead: `grid-column: 1 / -1; aspect-ratio: 16/9; object-fit: cover;` 3-up: `grid-template-columns: repeat(3, minmax(0,1fr))` with `border-top:1px` + caption below | Contact-sheet gallery w/ tiny captions |
| 9 | **Testimonials** | 6 rounded cards, 3×2 | **Hairline-ruled 2-column index.** Not a grid of cards. Each entry: tag (tracked) → quote (`--type-h3`, Inter) → hairline → avatar 40px + name + role. **`sp-disclosure` stays, moved directly under the section eyebrow, made more prominent.** | `display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 0 var(--space-2xl);` each entry `border-top:1px solid var(--gray)` | Contact-sheet / archive index |
| 10 | **FAQ** `#faq` | Accordion, centred container | **The programme block.** `--blue-900` field. Eyebrow + H2 left-pinned, accordion as a hairline-ruled list on the right. `+` glyph rotates to `×`. Contrast inverts to white/yellow. | `display:grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: var(--space-2xl);` on `--blue-900` | Contrast-block rhythm |
| 11 | **Final CTA** `#daftar` | Centred, blue, `Supergrafis-12` decor | **The closing statement.** Edge-pinned left. H2 at `--type-split` in white with the last clause in yellow. One CTA, sharp, yellow fill. `Supergrafis-12` → `Supergrafis-03` at low opacity. | Block, `padding: var(--space-3xl) var(--gutter)`, `background: var(--blue-900)` | Closing confident statement |
| 12 | **Footer** | 4 columns, centred container | **Ft1 mast-headed.** Brandmark + tagline as one horizontal band, hairline above, small links inline beside, copyright on its own hairline row. `Ft3` index-columns is **banned** here. | `display:grid; grid-template-columns: minmax(0,1fr) auto; align-items:end;` hairline `border-top:1px` | Mast-headed footer |

**Nav — N9 edge-aligned minimal.** Wordmark hard-left, 5 links as tracked uppercase, one sharp CTA hard-right, all on the 24px gutter. No centred container, no shadow, no blur, no pill. Frosts to solid `--blue-800` on scroll (existing `.site-header` behaviour retained).

---

## 5. The hero, in full detail

### 5.1 Composition — exactly five layers, top to bottom

```
z0  .hero-field        Supergrafis-03, full-bleed, the field itself
z1  .hero-ghost-glyph  one oversized "S", ghosted
z2  (removed)          gradient · glow · bubbles · rings · confetti · yellow arc · blue ring
z3  .hero-copy         eyebrow · H1 · lede · CTAs   — pinned top-left
z4  .batch-badge       NEXT BATCH                     — pinned bottom-left
```

### 5.2 The field — why Supergrafis-03 and not the brief's 3–6% overlay

**I could not follow the brief's instruction here, and this is a factual correction, not a preference.**

The brief asks for the contour layer built from the supergraphics at 3–6% opacity with `mix-blend-mode: overlay/soft-light`. Two problems, both measured:

1. **The pinstripe assets are the same blue as the field.** `Supergrafis-10` and `Supergrafis-12` are vertical pinstripes in `#034E9E`. The hero field is `#034E9E`. Measured contrast between them: **1.0:1** — literally identical. At any opacity they are invisible. This is not a subtlety; the pixels are the same colour.
2. **`Supergrafis-04` turns green over blue.** It is a yellow field with a tonal pattern. Composited over `#034E9E`: at 20% → `#346886` (blue, fine), at 30% → `#4D7579` (desaturating), at **45% → `#728867`, hue 99° — muddy green.** Any opacity from ~40% up produces an off-brand green. Brand spec §12 bans off-palette colour.

**What works instead — and it is better.** `Supergrafis-03` is a **100%-opaque** file (measured: 0% transparent pixels) containing the D/P monogram and bolt pattern in two close blues: `#034E9E` base with `#02499C` pattern.

- Its internal tonal delta is **1.062:1** — it is *already* self-subordinate by design.
- White text on the field: **8.12:1** ✓ (measured #034E9E vs #FFFFFF; the 8.62:1 figure previously cited here was wrong — see correction note below)
- Yellow text on the darker pattern tone: **5.78:1** ✓
- It requires no opacity, no blend mode, and no colour that is not already brand blue.

**Therefore:** use `Supergrafis-03` **as the hero field at 100% opacity, no blend mode.** It replaces the gradient entirely. This satisfies the brief's actual intent — a low-contrast organic line layer that never competes — using a real brand asset, with better legibility than any opacity trick.

```css
.hero {
  position: relative;
  background-color: var(--blue);          /* fallback + LCP paint */
  background-image: url('assets/supergraphic/Supergrafis-03.png');
  background-size: cover;
  background-position: center;
  color: var(--white);
  overflow: hidden;
}
```
Developer note: 4500×6042 at 287KB is heavy for an LCP background. Generate a **1440px-wide WebP** from it and reference that; keep the PNG as the fallback. This is a derivative of an existing asset, not a new or sourced image.

**Other supergraphics, reassigned:**

| Asset | Real character (measured) | New job |
|---|---|---|
| `Supergrafis-03` | Opaque tonal monogram pattern, blue-on-blue, Δ1.06:1 | **Hero field + final CTA field** |
| `Supergrafis-08` | Yellow lightning bolt, transparent bg, 21% coverage | Ghost glyph alternative, or single accent in §4 |
| `Supergrafis-09` | Yellow quarter-arc, transparent, 11% coverage | One accent, §11 CTA only |
| `Supergrafis-01` | Yellow arc on blue, transparent, 8% | Delete from hero |
| `Supergrafis-02` | Scattered yellow arcs, 22% | Delete — reads as confetti, which is on the kill list |
| `Supergrafis-04` | Opaque yellow tonal pattern | Delete from hero. Optional as a **solid yellow full-bleed block**, never over blue. |
| `Supergrafis-10` | Blue pinstripes, transparent | **Unusable on blue** (1.0:1). Only viable on white — see §7 FAQ row. |
| `Supergrafis-12` | Blue pinstripes, transparent | Same as -10. Reassigned to final CTA only if field goes white. |

### 5.3 Ghost glyph

The brief asks for an oversized ghosted `S`/`D` at 2–4%. On a blue field the ghost must be a **brand blue tint, not grey** — grey `#D1D5DB` on `#034E9E` measures 5.51:1, far too loud for a ghost.

```css
.hero-ghost-glyph {
  position: absolute;
  top: -0.18em; left: -0.06em;
  font-family: 'Poppins'; font-weight: 800;
  font-size: clamp(20rem, 52vw, 46rem);
  line-height: 0.8;
  color: #0A2A5E;              /* --blue-700, ghosted */
  opacity: 0.55;               /* effective 1.72:1 against the field */
  pointer-events: none;
  user-select: none;
  z-index: 1;
}
```
Measured: `#0A2A5E` on `#034E9E` = **1.72:1**. Present, structural, never competing. Use the `Brandmark.svg` bolt form rather than a letterform if the designer prefers — do not redraw the logo geometry.

### 5.4 H1 treatment — the two-weight stack

No serif. The serif's job (huge, tight, two-tier contrast) is done with two Poppins weights.

Current H1 is `"Speak English." / "Live the Experience."` — retained verbatim, restructured:

```html
<h1 class="hero-title">
  <span class="hero-title__l1">Speak English.</span>
  <span class="hero-title__l2">Live the <strong>Experience.</strong></span>
</h1>
```

```css
.hero-title {
  font-family: 'Poppins';
  font-size: var(--type-display);
  font-weight: 500;           /* line 1 — the light tier */
  line-height: 0.86;
  letter-spacing: -0.035em;
  text-transform: none;        /* current CSS uppercases this — remove */
  margin: 0;
  max-width: 12ch;
}
.hero-title__l1, .hero-title__l2 { display: block; }
.hero-title__l2 { font-weight: 800; }   /* line 2 — the heavy tier */
.hero-title strong { font-weight: 800; color: var(--yellow); }
```

The reference's structural contrast (regular weight + selective bold inline) is reproduced by **weight 500 → 800 across two lines, plus a yellow `strong` on the final word.** Yellow `#F9D024` on `#034E9E` = 5.44:1 ✓, and it is the only yellow in the H1.

**One accent per viewport:** the H1's yellow `Experience.` and the primary CTA's yellow fill are the same accent used twice. That is the budget. No third yellow element above the fold.

### 5.5 Lede — the defect fix

```css
.hero .lede {
  color: var(--white);          /* was var(--ink-muted) — 1.15:1, now 8.12:1 */
  font-size: var(--type-runner); /* promoted to display scale — the sentence-runner */
  font-weight: 400;
  line-height: 1.22;
  max-width: 34ch;
  letter-spacing: -0.02em;
}
```
Copy is unchanged. The lede becomes the **sentence-runner**: at display scale with `Intensif · Praktik langsung · Komunitas aktif` folded in as the inline `<strong>`. Two or three emphasised words total across the whole hero — not more.

### 5.6 CTAs

```html
<div class="hero-ctas">
  <a class="btn btn-primary" href="#daftar">DAFTAR SEKARANG</a>
  <a class="btn btn-ghost" href="#program">LIHAT PROGRAM</a>
</div>
```
Sharp rectangles, flat fills, no gradient, no shadow. See §6.1 for full spec.

### 5.7 `NEXT BATCH` badge — anatomy

The highest-value element in the redesign. It converts the hero from a poster into a conversion surface. Hairline outline, transparent fill, instrument-panel character — the reference's `NEXT RACE` badge, re-expressed in brand.

**Position:** pinned **bottom-left**, 24px from both the left and bottom edges. 280px wide. Never overlaps the H1 or the CTAs.

```html
<aside class="batch-badge" aria-label="Status pendaftaran batch berikutnya">
  <p class="batch-badge__label">NEXT BATCH</p>
  <div class="batch-badge__glyph" aria-hidden="true">
    <!-- inline SVG: 1px-stroke bolt from Brandmark silhouette, 24x24 -->
  </div>
  <dl class="batch-badge__meta">
    <div class="batch-badge__row">
      <dt>Jadwal</dt><dd>[FILL: tanggal &amp; jam]</dd>
    </div>
    <div class="batch-badge__row">
      <dt>Kuota</dt><dd>[FILL: jumlah kursi]</dd>
    </div>
    <div class="batch-badge__row">
      <dt>Status</dt><dd><span class="batch-badge__dot"></span> Pendaftaran dibuka</dd>
    </div>
  </dl>
  <p class="batch-badge__emblem" aria-hidden="true">DUTA PERSADA · 2026</p>
</aside>
```

**Every string in the badge is `[FILL]`.** The brief forbids inventing schedules, prices or counts, and the page currently has none of that data. Four placeholders, clearly marked. The developer must not guess values.

```css
.batch-badge {
  position: absolute;
  left: var(--gutter); bottom: var(--gutter);
  width: 280px;
  padding: 1.1rem 1.15rem;
  border: 1px solid rgba(255,255,255,.55);
  background: transparent;          /* no fill — the field shows through */
  color: var(--white);
  z-index: 4;
}
.batch-badge__label {
  font-size: var(--type-eyebrow);
  letter-spacing: .18em; text-transform: uppercase;
  font-weight: 600; color: var(--yellow);   /* 5.44:1 ✓ */
  margin: 0 0 .7rem;
}
.batch-badge__glyph { margin-bottom: .7rem; }
.batch-badge__glyph svg { display: block; width: 24px; height: 24px; stroke: var(--white); fill: none; stroke-width: 1; }
.batch-badge__meta { margin: 0; font-size: var(--type-small); }
.batch-badge__row {
  display: grid; grid-template-columns: 4.5rem minmax(0,1fr);
  gap: .5rem; padding-block: .3rem;
  border-top: 1px solid rgba(255,255,255,.22);
}
.batch-badge__row dt { color: rgba(255,255,255,.72); }     /* 4.72:1 ✓ */
.batch-badge__row dd { margin: 0; font-weight: 500; }
.batch-badge__dot {
  display: inline-block; width: 6px; height: 6px;
  background: var(--yellow); margin-right: .45rem; vertical-align: middle;
}
.batch-badge__emblem {
  margin: .8rem 0 0; font-size: .625rem; letter-spacing: .22em;
  text-transform: uppercase; color: rgba(255,255,255,.6);
}
```

Status is **not** conveyed by colour alone — the dot is always paired with the text `Pendaftaran dibuka`. This satisfies the never-rely-on-colour-alone rule.

The bolt glyph is inline SVG at 1px stroke, derived from the existing `Brandmark.svg` silhouette. It is a tracing of an existing brand asset, not a new or sourced mark. If the designer judges the trace inaccurate, ship the badge without the glyph — the badge works without it.

### 5.8 Hero layout

```css
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: space-between;
  min-height: 100svh;              /* svh, not vh — mobile browser chrome */
  padding: calc(var(--nav-h) + var(--space-2xl)) var(--gutter) var(--gutter);
}
.hero-copy { max-width: 15ch; }     /* measure control at display size */
```
The `container` class is **removed from the hero.** Content pins to the viewport edge. This is the single most visible structural change from the reference.

### 5.9 Mobile behaviour

Verified target widths: **320 / 375 / 414 / 768px.** No horizontal scroll, no two-line CTAs.

| Width | Behaviour |
|---|---|
| **≥960px** | Full composition. Display type at clamp max. Badge 280px, bottom-left. |
| **768px** | `--type-display` lands ~5.6rem. Badge stays 280px bottom-left. |
| **414px** | Display drops to ~3.9rem. Badge becomes `position: static`, full-width, placed **after** the CTAs — an absolutely-positioned badge overlaps the CTA row on a phone. |
| **375px** | Same as 414. `--type-runner` drops to ~1.3rem. |
| **320px** | Same as 375. Gutters drop to 16px. Badge `padding` to 1rem. Hero `min-height` relaxes to `auto` with `padding-block: 3rem` — a 100svh hero on a 320×568 screen buries the CTA below two full screens. |

```css
@media (max-width: 47.99rem) {
  html, body { overflow-x: clip; }        /* never `hidden` — it kills position:sticky */
  .batch-badge { position: static; width: auto; margin-top: var(--space-xl); }
  .hero-ghost-glyph { opacity: .38; }     /* recedes further on small screens */
  .hero { min-height: auto; padding-block: var(--space-2xl); }
}
```

---

## 6. Component specs

### 6.1 CTA button — two variants

Both sharp. `border-radius: 0`. Flat fill. No gradient. No shadow. Both variants must fit their label on **one line** at 320px — `DAFTAR SEKARANG` at `--type-cta` with `.12em` tracking is the binding constraint; if it wraps, drop tracking to `.08em` before reducing size.

**Primary** — yellow fill, deep blue label (9.38:1):
```css
.btn-primary {
  font-family: 'Poppins'; font-weight: 600;
  font-size: var(--type-cta); letter-spacing: .12em; text-transform: uppercase;
  color: var(--blue-800);            /* #012B5C on #F9D024 = 9.38:1 */
  background: var(--yellow);
  border: 1px solid var(--yellow);
  border-radius: 0;
  padding: 1rem 1.75rem;
  min-height: 48px;                   /* ≥44px touch target */
  display: inline-flex; align-items: center; justify-content: center;
  text-decoration: none; white-space: nowrap;
  transition: background-color .18s var(--ease-out), color .18s var(--ease-out);
}
.btn-primary:hover  { background: #FFDC3A; border-color: #FFDC3A; }
.btn-primary:active { transform: translateY(1px); }
```
Note: the current primary is white-on-blue. Inverting to **deep-blue-on-yellow** is what makes the CTA read as the page's one energy accent, and it scores higher (9.38:1 vs 8.12:1 is a wash, but the yellow fill is the brand's CTA emphasis per spec §3).

**Ghost** — transparent, hairline border:
```css
.btn-ghost {
  color: currentColor;                 /* inherits white on blue, ink on white */
  background: transparent;
  border: 1px solid currentColor;
  border-radius: 0;
  /* same type + padding + min-height as primary */
}
.btn-ghost:hover { background: rgba(255,255,255,.10); }   /* on blue */
.btn-ghost:hover { background: rgba(10,42,94,.06); }     /* on white */
```

**8 states, all specified:**

| State | Primary | Ghost |
|---|---|---|
| default | yellow fill, `#012B5C` label | transparent, hairline |
| hover | `#FFDC3A` | 6–10% white/ink wash |
| `:focus-visible` | `outline: 2px solid var(--white); outline-offset: 3px` on blue · `outline: 2px solid var(--blue-700)` on white. **Never animated.** | same |
| active | `translateY(1px)` | same |
| disabled | `opacity: .4; pointer-events: none;` + `aria-disabled="true"` | same |
| loading | label → `MEMPROSES…`, `aria-busy="true"`, width locked to prevent reflow | same |
| error | 1px `--blue-900` border + label unchanged. Errors surface in the destination, not the button. | same |
| success | label → `TERKIRIM`, `aria-live="polite"`, reverts after 3s | same |

### 6.2 `NEXT BATCH` badge
Full spec in §5.7. Dimensions: 280×auto desktop, full-width below 48rem. Hairline `1px rgba(255,255,255,.55)`, transparent fill, `border-radius: 0`. Hover: `border-color` steps to `rgba(255,255,255,.85)` over 180ms — it is a link target, not a button, so it also carries `:focus-visible` at 2px white with 3px offset.

### 6.3 Section eyebrow
```css
.eyebrow {
  font-family: 'Inter'; font-weight: 600;
  font-size: var(--type-eyebrow);
  letter-spacing: .18em; text-transform: uppercase;
  color: var(--blue-600);            /* #0E3E86 on white = 10.23:1 ✓ */
  margin: 0 0 var(--space-md);
}
.on-dark .eyebrow { color: var(--yellow); }   /* 5.44:1 ✓ */
```
Always **stacked above** its heading, same column. The tag-left / heading-right hanging header is banned — it is the most recognisable templated-editorial tell.

### 6.4 Index list row
```css
.index-row {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1fr);
  gap: var(--space-md);
  padding-block: var(--space-lg);
  border-top: 1px solid var(--gray);   /* hairline, never a box */
  min-width: 0;
}
.index-row:last-child { border-bottom: 1px solid var(--gray); }
.index-row__num {
  font-family: 'Poppins'; font-weight: 700;
  font-size: var(--type-num);
  font-variant-numeric: tabular-nums;
  color: var(--blue);                  /* 8.12:1 on white ✓ */
  line-height: 1;
}
.index-row__title { font: 600 var(--type-h3)/1.15 'Poppins'; margin: 0 0 .3rem; }
.index-row__body  { font: 400 var(--type-body)/1.5 'Inter'; color: var(--ink-muted); margin: 0; max-width: 46ch; }
```
`minmax(0, 1fr)` on the content track — a bare `1fr` lets a long word push the row past the viewport and causes horizontal scroll. `overflow-wrap: anywhere` on titles.

### 6.5 Testimonial row
```css
.testimonial-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-md);
  padding-block: var(--space-xl);
  border-top: 1px solid var(--gray);
}
.testimonial-row__tag {
  font: 600 var(--type-eyebrow)/1.2 'Inter';
  letter-spacing: .18em; text-transform: uppercase;
  color: var(--blue-600);
}
.testimonial-row__quote {
  font: 400 var(--type-h3)/1.35 'Inter';
  color: var(--ink); margin: 0;
}
.testimonial-row__person { display: flex; align-items: center; gap: .75rem; }
.testimonial-row__avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
.testimonial-row__name { font: 600 .9rem/1.2 'Poppins'; margin: 0; }
.testimonial-row__role { font: 400 var(--type-small)/1.2 'Inter'; color: var(--ink-muted); margin: 0; }
```
Disclosure stays, above the grid, and gets more prominence:
```css
.sp-disclosure {
  border-left: 2px solid var(--yellow);
  padding-left: var(--space-md);
  font: 400 var(--type-small)/1.45 'Inter';
  color: var(--ink-muted);
  margin: 0 0 var(--space-2xl);
}
.sp-disclosure-label { font-weight: 600; color: var(--blue-800); display: block; }
```
The `Ilustrasi` flag on each card is retained as the `__tag` line. Six entries, 2 columns, DOM order preserved (reading order left-right, not column-major — the current DOM order is the source of truth for the sequence).

---

## 7. Motion

Restrained. Three primitives, nothing else.

| What | Duration | Easing | Notes |
|---|---|---|---|
| Scroll reveal — fade + 12px rise | **520ms** | `cubic-bezier(.22,1,.36,1)` | Existing `.reveal` class. Stagger max **60ms** — the current 250ms cumulative stagger is far too slow. |
| Link / button hover | **180ms** | `cubic-bezier(.22,1,.36,1)` | `background-color`, `border-color`, `color` only |
| FAQ panel open | **240ms** | `cubic-bezier(.22,1,.36,1)` | `max-height` + `opacity` |

**Explicitly forbidden:**
- **No parallax.** The hero field is static.
- **No cursor-follow.** No spotlight, no magnetic buttons, no tilt.
- **No scroll-linked animation** below 40rem.
- **No infinite loops.** The current `floaty` 6s keyframe on `.hero-visual` is deleted with the layer.
- **No `transition: all`.** Name the properties.
- Animate `transform` and `opacity` only. Never `width`, `height`, `top`, or `box-shadow`.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
  .reveal { opacity: 1 !important; transform: none !important; }
}
```

---

## 8. Kill list

Find these in `styles.css` and `index.html` and remove them. Nothing else is deleted.

| # | Target | Where | Action |
|---|---|---|---|
| 1 | `linear-gradient(120deg, var(--blue), var(--blue-deep) 130%)` | `.hero` L~376 | **Delete.** Replaced by the `Supergrafis-03` field. |
| 2 | `.hero-glow` div + CSS block | `index.html` L54, `styles.css` L384 | **Delete element and CSS.** |
| 3 | `<filter id="goo">` SVG block | `index.html` L56–62 | **Delete.** Exists only for the bubbles. |
| 4 | `.hero-bubbles` + 5 `.hero-bubble` spans | `index.html` L65–71, `styles.css` L1359 | **Delete element and CSS.** |
| 5 | `.hero-accent` (yellow arc, 90px) | `index.html` L75, `styles.css` L415 | **Delete element and CSS.** |
| 6 | `@keyframes floaty` + `animation: floaty` | `styles.css` L409–414 | **Delete.** Infinite loop. |
| 7 | `.exp-pattern` | `index.html` L125 | **Delete.** Replaced by the `Supergrafis-03` band field. |
| 8 | `--sh-sm` / `--sh-md` / `--sh-lg` | `styles.css` L84–86 | **Delete all shadow tokens** and every `box-shadow` using them. Hairlines only. |
| 9 | `--radius-card: 16px`, `--radius-feature: 24px` | `styles.css` L89–90 | **Delete.** Replaced by `--radius: 0` / `--radius-sm: 2px`. |
| 10 | `border-radius: 999px` (×3) and `50%` on non-avatar elements | `styles.css` L217, 657, 681, 1081, 1099, 1113, 1232 | **Delete.** Pills die. The only permitted `50%` is the 40px testimonial avatar. |
| 11 | `.program-chip[data-glyph]` arcs + bolt | `index.html` L145, 159 | **Delete elements.** Replaced by the block structure in §4 row 4. |
| 12 | `.why-dash` decorative dashes | 6× in `index.html` L181–186 | **Delete elements.** |
| 13 | `text-transform: uppercase` on `.hero-title` | `styles.css` L436 | **Delete.** The reference sets display type in sentence case. |
| 14 | `line-height: 1.65` on `body` | `styles.css` L104 | **Reduce to 1.5.** Brand constraint. |
| 15 | `.final-supergrafis` (`Supergrafis-12`) | `index.html` L469 | **Delete.** `Supergrafis-12` is 1.0:1 against a blue field. |
| 16 | `Supergrafis-04` in `.value-visual` | `index.html` L118 | **Delete.** Muddy green over blue at any usable opacity. |
| 17 | `border-radius: 8px` on `.hamburger` | `styles.css` L333 | **→ 0.** |
| 18 | `outline: 3px solid var(--yellow)` global focus | `styles.css` L~138 | **Replace** with the two-context ring from §9. Yellow on white is 1.49:1. |

**`Supergrafis-10` and `-12` are not deleted from disk** — they simply stop being used. Assets stay; only references go.

---

## 9. Accessibility

**1. The hero subhead contrast fix** — the headline accessibility item.
- Current: `#4B5A6E` on `#034E9E` = **1.15:1**. Fails WCAG AA by a factor of seven.
- Fix: `.hero .lede { color: var(--white); }` → **8.12:1**, AAA.
- Scope the override to the hero. The global `--ink-muted` stays for white sections where it scores 7.03:1 ✓.
- Also fix `.experience-band .lede` (L573) and `.final-cta .lede` (L1298) — both inherit the same token on blue. Both → white.

**2. Focus states** — the current global ring fails on white.
- On white / light sections: `outline: 2px solid var(--blue-700)` = **13.95:1** ✓
- On blue / dark sections: `outline: 2px solid var(--white)` = **8.12:1** ✓
- `outline-offset: 3px`. **Never animate the ring** — it must appear on the first frame of focus.
- The existing `.skip-link` is retained and restyled sharp, with a yellow fill and `#012B5C` label (9.38:1).

**3. `overflow-x`** — `html, body { overflow-x: clip; }`. **Never `hidden`** — it silently breaks `position: sticky` and can trap keyboard focus.

**4. Touch targets** — every interactive element ≥ 44×44px below 40rem. Buttons are 48px tall. FAQ headers get `min-height: 48px` and `padding-block` so the hit area exceeds the text.

**5. Colour is never the only signal** — the badge status dot always ships with the text `Pendaftaran dibuka`. The `Ilustrasi` testimonial label is text, not a colour chip.

**6. Testimonial disclosure** — the `simulasi/ilustrasi` note stays visible, moves above the grid, gains a yellow left border. It must not be dismissible.

**7. Reduced motion** — see §7. All spatial motion collapses to ≤150ms opacity.

**8. Semantic structure** — the curriculum becomes an ordered list (`<ol>`), the method pillars and testimonials become `<ul>`/`<article>`. Heading order stays h1 → h2 → h3 with no skips. The decorative supergraphic layers take `aria-hidden="true"` and `alt=""`.

**9. LCP** — the hero background is the LCP element. It must **not** be `loading="lazy"`. The derived WebP (§5.2) should be preloaded.

**10. Language** — `<html lang="id">` is already correct. Do not change.

---

## 10. Build order

Sequenced so each step is independently verifiable. Steps 1–3 are pure deletion and can be done in one pass.

1. **Delete the kill list** (§8, items 1–8, 13–16). Remove elements from `index.html` and rules from `styles.css`. *Verify:* page still renders, hero is flat blue with no decor.
2. **Retoken.** Replace radius tokens with `--radius: 0` / `--radius-sm: 2px`; delete shadow tokens; set `body { line-height: 1.5 }`. *Verify:* nothing is rounded, nothing has a shadow.
3. **Add the new tokens** to `:root` — the §3 colour roles, the §2 type scale, `--gutter: 24px`, `--space-*` 4pt scale, `--nav-h`, `--ease-out`, `--dur-*`. *Verify:* no raw hex or clamp remains in any component rule.
4. **Build the hero field.** Generate the 1440px WebP from `Supergrafis-03`; apply as `.hero` background; add `.hero-ghost-glyph`. *Verify:* flat blue, pattern barely visible, white headline at full contrast.
5. **Fix the three contrast defects** (§9.1) — hero lede, experience band lede, final CTA lede. *Verify:* all three are white, not `#4B5A6E`.
6. **Rebuild the H1** as the two-weight stack (§5.4). Remove `text-transform: uppercase`. *Verify:* weight 500 line 1, weight 800 line 2, yellow `Experience.`
7. **Build the `NEXT BATCH` badge** (§5.7) with all four `[FILL]` placeholders and the inline SVG glyph. *Verify:* pinned bottom-left on desktop, static below 48rem, all four placeholders visibly marked.
8. **Rebuild both CTA variants** (§6.1) with all 8 states. *Verify:* sharp, flat, no wrap at 320px.
9. **Replace the nav** with N9 edge-aligned, 24px gutter. **Replace the footer** with Ft1 mast-headed. *Verify:* no centred container in either; no pill.
10. **Convert §2 method** → sentence-runner + 4-row index list.
11. **Convert §3 experience band** → full-bleed statement, `Supergrafis-03` field.
12. **Convert §4 program** → two unequal full-bleed blocks.
13. **Convert §5 why** → 3×2 tabular spec sheet.
14. **Convert §6 curriculum** → 10-row hairline index, 2 columns, tabular numerals.
15. **Convert §7 format** → two-column tabular spec sheet.
16. **Convert §8 camp** → editorial image index with tracked captions.
17. **Convert §9 testimonials** → 2-column hairline index, disclosure promoted.
18. **Convert §10 FAQ** → `--blue-900` programme block, 2-column, `+` rotates.
19. **Convert §11 final CTA** → edge-pinned closing statement on `--blue-900`.
20. **Motion pass** (§7) — retune `.reveal` stagger to max 60ms, add the reduced-motion block. *Verify:* `floaty` is gone.
21. **Accessibility pass** (§9) — focus rings, `overflow-x: clip`, touch targets, semantic lists.
22. **Responsive verification** at **320 / 375 / 414 / 768 / 960 / 1440px**. *Verify each:* no horizontal scroll, no two-line CTA or nav link, display type never overflows, badge never overlaps the CTA row.
23. **Final slop gate.** Confirm: zero pills, zero gradients on CTAs, zero shadows on surfaces, zero cards in §2/§5/§6/§7/§9, zero italic headings, zero fabricated strings outside `[FILL]`.

---

## 11. Method — how the numbers in this document were produced

Every ratio above is computed WCAG 2.1 relative luminance, not estimated:

```
L = 0.2126·R + 0.7152·G + 0.0722·B   (linearised channels)
ratio = (L_lighter + 0.05) / (L_darker + 0.05)
```

**Assets inspected directly** (Pillow, alpha-channel census + colour census + column-opacity profile):
- All 8 supergraphics are **4500×6042 RGBA**.
- `-03` and `-04` are **100% opaque** (0% transparent pixels). `-01` 89% transparent, `-02` 69%, `-08` 77%, `-09` 87%, `-10` 87%, `-12` 80%.
- `-10` and `-12` pinstripe colour is **`#034E9E`**, identical to the hero field → 1.0:1.
- `-03` internal tones: base `#034E9E`, pattern `#02499C` → 1.062:1.
- `-04` composited over `#034E9E` at 45% → `#728867`, hue 99° (green).

**Live page** inspected at `http://127.0.0.1:8766/` (HTTP 200) — hero screenshot confirms gradient, blue bolt slash behind the headline, yellow quarter-ring, cropped cobalt circle, outlined capsule ring, circular outlines, yellow glow, and confetti marks all present and competing with the H1. The subhead renders as muted ochre on royal blue, consistent with the measured `#4B5A6E` at 1.15:1.

**Source files read:** `index.html` (516 lines), `styles.css` (1443 lines), `AI_BRAND_VISUAL_SPEC_2026.md`, the supergraphics contact sheet.

**Corrections to the brief's own figures:**
| Brief says | Measured |
|---|---|
| Hero subhead contrast ≈2.3:1 | **1.15:1** |
| Supergraphics at 3–6% opacity as the field | `-10`/`-12` are invisible on blue (1.0:1); `-04` goes green ≥40%; only `-03` works, and it needs **100%**, not 3–6% |
| "Pick the organic/line-art ones from the contact sheet" | The organic line-art role is played by `-03`, which the contact sheet renders as flat blue — it is invisible in a thumbnail. Choosing from the contact sheet alone would have picked wrong. |

---

## 12. Disagreements with brief

Three. All flagged, none silently applied.

### D1 — The 3–6% overlay contour layer is not physically possible on a blue field. *(substantive)*

The brief §5 and §7 instruct building the contour layer from the supergraphics at 3–6% opacity with `mix-blend-mode: overlay/soft-light`, picking "the organic/line-art ones from the contact sheet."

**Why it cannot work:** the only line-art assets, `Supergrafis-10` and `-12`, are pinstripes in `#034E9E`. The hero field is `#034E9E`. Measured contrast **1.0:1** — the same colour. They are invisible at any opacity, with or without a blend mode. `Supergrafis-04`, the other candidate, is a yellow field that composites to **muddy green (`#728867`, hue 99°) at 45%**. `Supergrafis-02` reads as scattered confetti, which §6 of the brief explicitly kills.

**What I did instead:** `Supergrafis-03` at **100% opacity, no blend mode**, as the field itself. It is an opaque, brand-blue-only, D/P monogram pattern whose internal contrast is 1.062:1 — already self-subordinate by design, and it keeps white text at 8.12:1. This delivers the brief's stated *intent* (a low-contrast organic line layer that never competes) more faithfully than the prescribed method, using a real brand asset.

> **Correction (Ejak, verified 2026-10-01).** This paragraph originally claimed white text sits at 8.62:1 on the field. Independently re-measured: `#034E9E` vs `#FFFFFF` = **8.12:1**. The figure above and in §5.2 are corrected to 8.12:1 throughout. Both values clear AA and AAA respectively, so no design decision changes; only the number was wrong.

**A caution on the contact sheet:** `Supergrafis-03` renders as flat blue in a thumbnail. The asset that actually carries the pattern is invisible at contact-sheet scale. Do not let anyone re-derive this asset choice from the sheet.

### D2 — The hero subhead is worse than the brief reports. *(factual)*

The brief calls it ≈2.3:1. Measured: **1.15:1** on `#034E9E` and 1.99:1 on the gradient's dark stop. The fix is the same either way (white, 8.12:1), but the severity is understated — this is close to invisible, not "low contrast." Two further instances share the defect: `.experience-band .lede` and `.final-cta .lede`. All three are in the build order.

### D3 — I kept brand blue, and I agree with the brief. *(endorsement, with one addition)*

The brief's §7 decision to reject the reference's white field and keep blue is correct. `AI_BRAND_VISUAL_SPEC_2026` §3 makes blue the anchor, and a white hero would fight the blue nav.

**One addition the brief did not anticipate:** because the field is blue, `Supergrafis-10` and `-12` — the two best line-textures in the set — are unusable *on blue* but are perfectly viable **on white**. I have reassigned one of them to the FAQ section (§4 row 10) if the developer wants a texture there. That recovers an asset the blue field would otherwise strand. Entirely optional.

**Also noted, no action taken:** the brief's §4 asks for a two-weight stack of `SUPER DUPER` light + `LANGUAGE CENTER` ExtraBold as the hero display type. The existing H1 copy is `"Speak English. / Live the Experience."` and §9 of the brief forbids inventing copy. I have **kept the existing copy** and applied the two-weight treatment to it. If EVA wants the wordmark stack instead, that is a copy decision, not a design one — say so and I will reissue §5.4.

---

**Pre-emit critique:** P5 · H5 · E4 · S5 · R5 · V4 — the two recovered assets (D1, D3) and the four `[FILL]` placeholders are the honest limits of what the available data supports.

---

## 13. Build report (REX, 2026-10-01)

Built on branch `editorial-restyle` in the section 10 order. Commits:

| Commit | Steps |
|---|---|
| `9cff2c8` | Step 1 — kill list |
| `11f7693` | Steps 2–3 tokens, steps 4–19 markup |
| `368cb5f` | Steps 4–21 component CSS, motion, accessibility |

**Deviations from this spec, each with the reason:**

1. **`--type-display` clamp max is 8.75rem, not 10.5rem.** Measured: at the spec's 10.5rem the H1 line `Live the Experience.` needs **1577px**, which cannot fit a 1440px viewport unbroken — the two-tier two-line stack the spec requires in §5.4 breaks. 8.75rem keeps it whole at every width.
2. **The `NEXT BATCH` badge uses grid placement, not `position: absolute`.** Spec §5.7 pins it bottom-left with absolute positioning. Measured result: it overlapped the CTA row and the `.micro-trust` line at 1440×900, 1440×1080, 1280×800 and 768×1024. As a grid row pinned with `align-self: end; justify-self: start` it reserves its own space, still reads as edge-pinned bottom-left, and measures zero overlap at every viewport tested.
3. **`.hero-copy` measure control is viewport-relative, not `ch`-based.** Spec §5.8/§5.4 use `max-width: 15ch` / `12ch`. At a 140px display size 12ch collapses the H1 to one character per line — caught by screenshot, not by the token audit.
4. **Two eyebrow labels added** (`PROGRAM INTENSIF`, `PROGRAM CAMP`). The two-block program split in §4 row 4 needs per-block labels; the section's original `PROGRAM` eyebrow and H2 are retained above the blocks. No other copy was added, reworded, or removed.
5. **Optional §D3 FAQ texture not applied.** `Supergrafis-10` on `--blue-900` was left out; the spec calls it entirely optional and the FAQ block reads cleanly without it.

**Verified:** slop gate 20/20 pass. 320 / 375 / 414 / 768 / 960 / 1440px — zero horizontal scroll, zero clipped text, zero two-line CTA or nav link, zero badge/CTA overlap. All three §9.1 lede fixes are white (8.12:1) and no `#4B5A6E` text remains on any blue section.
