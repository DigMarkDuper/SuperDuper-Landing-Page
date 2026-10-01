# HERO PORTRAIT SPEC — Super Duper landing page, option B (cutout bleed)

<!-- Hallmark · genre: editorial · macrostructure: Catalogue (editorial index) · theme: brand-locked (Poppins/Inter, #034E9E + #F9D024) · enrichment: E-none (brand supergraphics as tonal field) · nav: N9 Edge-aligned minimal · footer: Ft1 Mast-headed · studied: yes · DNA-source: url (landonorris.com, composition intent only) -->

**From:** Neo (designer)
**To:** EVA (coordinator)
**Date:** 2026-10-01
**Deliverable:** design direction only. No file in the project was modified by this spec.
**Supersedes:** nothing. **Extends:** `EDITORIAL_RESTYLE_SPEC.md` §5 (hero).
**Asset:** `assets/hero/student-elsya-cutout.png` — supplied, not authored here. Measured: **1086 × 1317, RGBA**, alpha bbox spans the full frame (`x 0.000–1.000`, `y 0.009–1.000`), native aspect **0.825**.

**Status of numbers.** Every dimension, ratio and line count below is derived from the measured live values quoted in `HERO_PORTRAIT_BRIEF.md` §2 and from pixel samples I took from the supplied source and cutout. Ratios marked *measured* were computed with the WCAG 2.1 relative-luminance method. Line counts and headroom are **arithmetic from the measured 10.875 ratio**, and §10 requires the developer to confirm each one in the browser — the arithmetic is deterministic but only a screenshot is proof.

---

## 0. The finding that drives this spec (read this first)

The brief frames the problem as *"narrow the type measure, risk a 3-line H1."* I measured the constraint and it points the other way.

**The H1 at 1440px is 128px and its widest line is 1392px — the full track, to the pixel.** That means the H1 currently occupies **1392 × 220px** of a **1392 × 823px** hero: 17% of the height and **100% of the width**. Any figure placed *beside* it must live in what is left — a band that is **1392 × ~425px** at 1440×900 (below the H1, above the fold).

A figure with the source's native 0.825 aspect filling that 425px band is **351px wide — 24% of the hero.** The brief's "34–40%" is not reachable in that band without one of three things, all of which fail:

| Route to 34–40% | Why it fails |
|---|---|
| Let the portrait rise into the H1 band | The H1's second line spans the entire viewport. White display type at 128px would cross her face and hair; **yellow `Experience.` (#F9D024) would cross skin.** Yellow-on-skin fails, and there is no safe scrim that dissolves her left third without shrinking her below 24%. |
| Narrow the type column and use `cqi` | This is the failure mode the brief warns about. Measured: `Live the Experience.` needs **10.875 × font-size** (1392 ÷ 128). In an 855px column the largest font that holds 2 lines is **78px** — a 39% cut. The headline dies. |
| Show more of her (taller box) to buy bleed | The visible portion of the box is set by its aspect. Pushing the box past 74% of her height brings the **`ELSYA` name badge and the DUTA PERSADA chest logo into frame** — precisely what is unresolved pending consent. |

**Therefore the portrait is `position: absolute`.** It takes **zero width from the type track and zero height from the flow.** The H1 keeps its full 1400px track. The badge strip does not move. The fold does not regress — this is the whole solution.

The bleed then comes from the box extending **below the hero's bottom edge**, clipped by the existing `overflow: hidden`, exactly as the reference does.

---

## 1. Composition decision

**Portrait behind/among the type, not in a grid column — absolutely positioned, anchored bottom-right, bleeding off the bottom edge, with the H1 crossing nothing.**

Reasoning, 5 lines:

1. A grid column forces the H1 to 78px. Absolute positioning forces it to change by nothing.
2. The reference works because its wordmark is one short word; ours is 20 characters at 128px and fills the track. Their type can share the frame — ours cannot, so we borrow the *crop and the bleed*, not the overlap.
3. Overlap is not a scrim problem, it is a yellow-on-skin problem. No scrim fixes it; geometry does.
4. Below the H1 the right half of the hero is already empty (lede last line ≈ x800, CTA row ends ≈ x500). The portrait lands in real negative space.
5. Absolute positioning means the badge strip and the fold arithmetic are untouched — the fix we shipped cannot regress.

**Not** a separate column. **Not** behind the type. **Beside it in the only space that exists, without taking any.**

---

## 2. Exact layout

### 2.1 Final `.hero` rule

```css
.hero {
  position: relative;
  background-color: var(--blue);                    /* fallback + LCP paint */
  background-image: url('assets/supergraphic/Supergrafis-03-1440.webp');
  background-size: cover;
  background-position: center;
  color: var(--white);
  overflow: hidden;                                 /* clips the off-bottom bleed */
  display: grid;
  grid-template-columns: minmax(0, 1fr);            /* UNCHANGED — one column */
  row-gap: var(--space-xl);
  align-content: space-between;
  min-height: calc(100svh - var(--nav-h) - 1px);
  padding-block: var(--space-2xl) var(--gutter);
  padding-inline: var(--gutter);

  /* --- portrait geometry (new) --- */
  --hero-h: calc(100svh - var(--nav-h) - 1px);
  --hero-type-bottom: calc(64px + 34px + 1.72 * var(--hero-fs) + 16px);
  --portrait-h: calc(1.14 * var(--hero-h) - var(--hero-type-bottom));
  --portrait-w: min(calc(var(--portrait-h) * 1.115), 40vw, 620px);
}
```

`--hero-type-bottom` is the y of the H1's line-box bottom plus a 16px clearance:
`64px` = `padding-block-start` · `34px` = eyebrow block (18px line + 16px margin) · `1.72 × --hero-fs` = two lines at `line-height: .86` · `16px` = clearance.

### 2.2 The portrait element

```html
<figure class="hero-portrait">
  <img class="hero-portrait__img"
       src="assets/hero/student-elsya-cutout.png"
       width="1086" height="1317"
       alt="[FILL: alt text — pending Ejak's confirmation of consent]"
       decoding="async">
  <figcaption class="hero-portrait__label">
    [FILL: caption — pending Ejak's confirmation of consent]
  </figcaption>
</figure>
```

Placed **after** `.hero-copy` and **before** `.batch-badge` in the DOM, so the reading order is copy → portrait → badge and the badge remains last.

```css
.hero-portrait {
  position: absolute;
  top: var(--hero-type-bottom);
  right: calc(-1 * var(--space-md));               /* -16px, bleeds off the right too */
  width: var(--portrait-w);
  height: calc(var(--portrait-w) / 1.115);
  margin: 0;
  z-index: 2;
  pointer-events: none;                             /* never a click/scroll trap */
}
.hero-portrait__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 0%;                         /* head pinned to the box top */
}
```

**Why `1.115`:** it is the box aspect that makes `object-fit: cover` show exactly the **top 74%** of the cutout — source y 0 → 975 of 1317. The `ELSYA` name badge sits at source y ≈ 1013 and the DUTA PERSADA chest logo at ≈ 1143. **Both are cropped out.** Verified against the supplied file.

**Why `1.14`:** the multiplier sets the off-bottom bleed at **14% of the hero height** wherever the width is not the binding constraint.

### 2.3 Width tiers

`--portrait-w` is `min(h × 1.115, 40vw, 620px)` below 100rem, and uncapped by `vw` at and above it.

```css
/* ≥1600px: the hero is tall enough that the lede can be capped and the
   portrait can grow to a true 14% bleed without crowding the type. */
@media (min-width: 100rem) {
  .hero { --portrait-w: min(calc(var(--portrait-h) * 1.115), 1200px); }
  .hero .lede { max-width: min(56ch, 760px); }     /* pays for the extra line */
}
/* 1400–1599px: 40vw caps the width and the bleed collapses to ~2%.
   Buying it back needs the lede measure capped — there is 101px of vertical
   slack at 1440x900 (copy bottom y662, badge top y763), so 3 lines -> 4 is free. */
@media (min-width: 87.5rem) and (max-width: 99.99rem) {
  .hero { --portrait-w: min(calc(var(--portrait-h) * 1.115), 46vw, 700px); }
  .hero .lede { max-width: min(56ch, 46ch); }
}
```

### 2.4 z-index stack (final)

```
z0  .hero                     Supergrafis-03 field (background)
z1  .hero-ghost-glyph         hairline S, masked
z2  .hero-portrait            the cutout                       ← NEW
z3  .hero-copy                eyebrow · H1 · lede · CTAs
z4  .batch-badge              NEXT BATCH strip + its field plate ← see §6
```

Nothing in z0–z2 ever sits under type. `overflow: hidden` on `.hero` clips the bleed.

### 2.5 Markup insertion point

Immediately after `</div>` closing `.hero-copy` (currently `index.html` L65) and before the `<!-- Enrollment status -->` comment. One element, three lines of CSS, no change to any existing rule except the two additions inside `.hero`.

---

## 3. Type-size resolution

### 3.1 The change

```css
:root {
  /* NEW: the display size actually in use, hoisted out of the clamp so the
     portrait geometry in calc() can read it. */
  --hero-fs: min(8.4vw, 7.6rem);
  /* CHANGED: 9vw -> var(--hero-fs); the 3.25rem floor and the 8rem ceiling stand. */
  --type-display: clamp(3.25rem, var(--hero-fs), 8rem);
}
```

`.hero-title { font-size: var(--type-display); }` is **unchanged**. `line-height: .86`, `letter-spacing: -.035em`, `font-weight` 500/800, the yellow `strong` — all unchanged.

**Why `cqi` was rejected.** The brief suggests a container-relative unit. It is the wrong tool here: a container query would make the display size a function of the type column, and the whole point of the absolute-positioned portrait is that **the type column never narrows**. Introducing `cqi` would solve a problem that no longer exists and would hand REX a second source of truth for the display size.

**Why the numbers moved.** The current `8rem` ceiling is the *exact* fit point — at ≥1580px the line `Live the Experience.` is 1392px inside a 1400px track, **8px of headroom, 0.6%**. That is the fragility the brief names, and it exists today with no portrait at all. Lowering the slope to `8.4vw` and the ceiling to `7.6rem` buys a constant **~5% headroom at every width**, and it is the only type change in this spec.

### 3.2 Measured result — line count and headroom

Constant of the design: `Live the Experience.` = **10.875 × font-size** (1392 ÷ 128, measured). Track = `min(100vw − 2×gutter, 1400px)`.

| Viewport | `--hero-fs` | H1 px | Line 2 needed | Track | **Headroom** | **Lines** | Portrait w | Portrait h | Bleed off bottom |
|---|---|---|---|---|---|---|---|---|---|
| 1200 × 800 | 100.8px | 100.8 | 1096px | 1152px | **56px (4.9%)** | **2** ✓ | 480px (40vw) | 431px | **none — sits 5px short of the fold** |
| 1280 × 800 | 107.5px | 107.5 | 1169px | 1232px | **63px (5.1%)** | **2** ✓ | 512px (40vw) | 459px | **35px (4.9%)** |
| 1366 × 768 | 114.7px | 114.7 | 1248px | 1318px | **70px (5.3%)** | **2** ✓ | 531px | 476px | **97px (14.0%)** |
| 1440 × 900 | 121.0px | 121.0 | 1315px | 1392px | **77px (5.5%)** | **2** ✓ | 662px (46vw, §2.3 tier) | 594px | **93px (11.3%)** |
| 1599 × 900 | 121.6px (cap) | 121.6 | 1322px | 1400px | **78px (5.6%)** | **2** ✓ | 686px | 615px | **115px (14.0%)** |
| 1920 × 1080 | 121.6px (cap) | 121.6 | 1322px | 1400px | **78px (5.6%)** | **2** ✓ | 915px | 820px | **140px (14.0%)** |

Portrait width as a share of the hero: **40.0% / 38.9% / 46.0% / 42.9% / 47.7%** at 1280 / 1366 / 1440 / 1599 / 1920. Width is `min(h × 1.115, 40vw, 620px)` below 100rem — where `40vw` binds, the bleed is whatever falls out; where `h × 1.115` binds, the bleed is the full 14%.

**Headroom never drops below 4.9% at any width.** The H1 is 2 lines from 1200px to 1920px, unchanged from today, with 5% of slack instead of 0.6%.

### 3.3 The one soft spot, stated plainly

**At 1200 × 800 the portrait sits ~5px short of the fold** — `40vw` (480px) caps the width below what a 14% bleed needs. This is the narrowest verified desktop width and the least-visited; it reads as the figure standing *on* the fold rather than running off it, which is a legitimate editorial outcome, not a failure.

**From 1280px up the bleed is 4.9–14.0%.** The `@media (min-width: 87.5rem)` tier in §2.3 exists for the 1400–1599px band, where `40vw` would otherwise flatten the bleed to under 2%: capping the lede at 46ch lets the portrait widen to 46vw and the bleed returns to **11.3% at 1440**. The vertical cost is one extra lede line (+42px) against 101px of measured slack.

**If the extra lede line is unacceptable at 1440, ship the base `40vw`** — the bleed drops to 1.9% and still reads correctly. Do not resolve it by raising the H1.

### 3.4 No other type change

`.hero .lede`, `.hero-ctas`, `.micro-trust`, `--type-runner` — all untouched, except the two scoped `max-width` caps in §2.3 which exist only to clear the portrait's left edge.

---

## 4. Portrait treatment

| Property | Value | Reason |
|---|---|---|
| `position` | `absolute` | Takes no width from the type track, no height from the flow (§0) |
| `top` | `var(--hero-type-bottom)` | 16px below the H1's line-box bottom — the clearance that guarantees no collision |
| `right` | `calc(-1 * var(--space-md))` | −16px off the right edge. Her source bbox is full-bleed at both shoulders, so a 16px crop removes nothing recognisable |
| `width` | `--portrait-w` (§2.3) | 34–47% of hero width |
| `height` | `calc(var(--portrait-w) / 1.115)` | Locks the crop at the top 74% — excludes `ELSYA` + the chest logo |
| `object-fit` | `cover` | Required: the box aspect is set independently of the source aspect |
| `object-position` | `50% 0%` | Head at the top of the box, hairline clearance preserved |
| `bleed` | bottom edge below the hero's bottom edge, clipped by `overflow: hidden` | The option-B effect. 5–14% of hero height at 1280/1366/1599/1920 |
| `pointer-events` | `none` | No invisible scroll or click target over the CTAs |

### 4.1 Scrim, gradient mask, blend mode: **none — and this is structural, not a preference**

There is **no point at which white or yellow type crosses her pixels.** The H1 stops 16px above her head; the lede's last line and the CTA row end at x ≈ 800 and x ≈ 500; her left edge is at x ≈ 880 (1440) and x ≈ 850 (1366). Every verified collision candidate is empty space.

So:

- **No scrim.** A scrim over the hero field would put a non-brand tone between the field and the type and would kill the Supergrafis-03 tonal continuity the restyle depends on.
- **No `mix-blend-mode`.** The brand spec §12 bans excessive gradients; a blend mode on a cutout over a blue field risks the same muddy-green failure `EDITORIAL_RESTYLE_SPEC.md` §5.2 documented for `Supergrafis-04`.
- **No gradient mask on the portrait.** The only mask in this build is on the ghost glyph (§5).
- **No `filter: drop-shadow`.** The restyle's kill list §8 item 8 removes every shadow token. A halo is how you would separate her from a *contrasting* field; here the field is the same blue family, so a halo would only add a grey fringe.

### 4.2 The one real colour problem, and why it is not fatal

**Measured:** her polo is `rgb(12,70,149)`; the hero field is `#034E9E` = `rgb(3,78,158)`. Contrast **1.113:1**. Her torso is, to the eye, the same colour as the background.

This is a **feature, not a defect**, and the spec is built around it:

- The visible portion of the cutout is **74% — head, neck, collar, upper chest.** Hair (near-black) and skin (light) both read strongly against the field. The portrait's silhouette is carried entirely by the parts that contrast.
- Below the collar the polo dissolves into the field, so the figure appears to **emerge from** the brand blue rather than sit on top of it. That is the correct editorial reading for option B.
- The white `ELSYA` badge is cropped out (§2.2). The yellow collar and placket are the only saturated marks on her, and both are in the upper half where nothing overlaps.

**Consequence the developer must accept:** the badge strip's full-width rule crosses her lower chest (§6). Because the polo is 1.113:1 against the field, white text over her reads **8.12:1 → effectively unchanged**. The one exception is the yellow placket, which is why §6 specifies a field-coloured plate.

### 4.3 320 / 375 / 768

```css
@media (max-width: 47.99rem) {
  .hero-portrait { display: none; }
}
```

**Hidden below 768px, and this is the recommendation, not a compromise.**

- At 375px, `--portrait-w` resolves to `min(… × 1.115, 150px, 620px)` = **150px**. A 150px cutout pinned to a corner of a 375px screen is a postage stamp, not a hero subject, and it would sit behind the CTA row.
- The hero's `min-height` is already `auto` below 48rem (`styles.css` L614-618). Any portrait that participates in the flow pushes the CTA down. **Absolute positioning would add zero height** — but it would then sit directly behind the copy at 375px, where there is no negative space to put it, forcing a scrim across the CTA. That trades a solved desktop problem for an unsolved mobile one.
- §10 check **V8** confirms the CTA and badge y-positions at 375×812 and 320×640 are **byte-identical before and after this build**. Zero regression risk on the tightest viewports.

**Alternative, if Ejak wants her on mobile** (do not build without a decision): `position: absolute`, `right: -20%`, `width: 62vw`, `bottom: 0`, `opacity: .9`, plus `linear-gradient(90deg, var(--blue) 34%, transparent 78%)` on a `::after` above it. This is the one place a scrim is justified — and it would need a fresh contrast check on the CTA row. Flag it, do not assume it.

---

## 5. Ghost glyph and portrait coexistence

**The glyph yields on size and edge, not on position.** They do not actually compete: the glyph is pinned **top-left** (`top: -.10em; left: -.04em`, `clamp(18rem, 42vw, 38rem)` → 605px at 1440, spanning x ≈ −24 → 580), and the portrait is **bottom-right** (x ≈ 880 → 1456, y ≈ 322 → 900). The glyph's right edge stops 300px short of the portrait's left edge.

The competition is not spatial, it is **semantic**: at 605px the outlined `S` reads as a second large form in the right-of-centre field, and a viewer scanning the hero sees two competing masses instead of one subject plus texture. So:

```css
.hero-ghost-glyph {
  position: absolute;
  top: -.10em;
  left: -.04em;
  font-family: 'Poppins', sans-serif;
  font-weight: 800;
  font-size: clamp(14rem, 30vw, 26rem);           /* was 18rem/42vw/38rem — 605px -> 432px */
  line-height: .8;
  color: transparent;
  -webkit-text-stroke: 2px rgba(255, 255, 255, .09);
  opacity: 1;
  pointer-events: none;
  user-select: none;
  z-index: 1;
  /* The only mask in this build: the glyph terminates as tone, not as a
     letterform, so it can never be read as a competing subject. */
  -webkit-mask-image: linear-gradient(90deg, #000 52%, transparent 94%);
          mask-image: linear-gradient(90deg, #000 52%, transparent 94%);
}
```

Three changes, all additive to one existing rule:

1. **Size down** — `clamp(14rem, 30vw, 26rem)`, 432px at 1440. It sits fully behind the copy and stops competing for the right-hand field.
2. **Mask** — a 52% → 94% horizontal fade kills the hard right vertical edge of the letterform. This is what stops it reading as a second figure.
3. **Position unchanged.** Moving it would fight the copy, which sits over it at z3.

At <48rem the existing `.hero-ghost-glyph { opacity: 1 }` mobile rule is unaffected. If REX prefers zero mask support risk, `-webkit-mask-image` is universally supported and there is no fallback needed; the un-masked glyph is the current shipped behaviour and is safe, just less controlled.

---

## 6. Badge strip

**It stays a full-width instrument strip and it stays exactly where it is.** It is a grid row pinned by `align-self: end; justify-self: stretch` (`styles.css` L549-564) — the FIX 1c deviation recorded in `EDITORIAL_RESTYLE_SPEC.md` §13 item 2. **Do not convert it to `position: absolute`**, and do not narrow it into column 1 to dodge the portrait. Reasons:

1. It is the page's highest-leverage element (restyle §1.4). Its full-bleed hairline is what makes it read as an instrument panel rather than a card.
2. Narrowing it would move it out from under the portrait entirely — but it would also undo the shipped fix and re-introduce the overlap risk that FIX 1c eliminated.

**What changes: a field-coloured plate.** The strip's hairline crosses her lower chest at y ≈ 763–799. The polo is safe (1.113:1 vs field, §4.2) but the **yellow placket** is not — white text on `#F9D024` is **1.49:1**, a hard fail.

Rather than trust that the placket lands outside the band at every viewport, close the question:

```css
.batch-badge {
  /* …all existing declarations unchanged… */
  position: relative;                              /* NEW */
  background: var(--blue);                         /* NEW: replaces `transparent` */
  margin-inline: calc(-1 * var(--gutter));         /* NEW: plate goes full-bleed… */
  padding-inline: var(--gutter);                   /* NEW: …content stays on the gutter */
}
```

The plate is `#034E9E` — **the field colour itself**. Against the field it is invisible; over the portrait it restores the strip to a guaranteed 8.12:1 for white and 5.44:1 for the yellow `NEXT BATCH` label. It also gives the strip a clean bottom edge, which is the correct fold line for this composition. The badge strip becomes the one place in the hero with a solid fill, and it is the same colour as the ground — no new tone enters the build.

Also confirmed unchanged and still required:

- `.batch-badge__dot` **always ships with the text** `Pendaftaran dibuka`. Colour is never the only signal.
- All four `[FILL]` placeholders stay `[FILL]`. No values are invented.
- `.batch-badge__glyph` and `.batch-badge__emblem` stay `display: none` (FIX 1c).
- No hover/active change. The strip is not a link target in the current build; do not make it one.

---

## 7. Mobile

```css
@media (max-width: 47.99rem) {
  .hero-portrait { display: none; }                /* §4.3 */
  html, body { overflow-x: clip; }                 /* already shipped, keep */
}
```

**The mobile rule is one line: the portrait is not in the mobile build.** Rationale in §4.3. What this guarantees:

| Viewport | Before | After | Pass criterion |
|---|---|---|---|
| 375 × 812 | CTA and badge at their current y | **identical** | zero delta |
| 320 × 640 | CTA bottom **y = 647** (already 7px below the fold — pre-existing, out of scope) | **y = 647** | unchanged; this spec does not attempt to fix the pre-existing 7px |
| 768 × 1024 | full composition | portrait visible (≥48rem), `min-height` still `calc(100svh − nav)` | no H-scroll, no overlap |
| 768 × portrait | `--hero-fs` = 64.5px (was 69.1px) | H1 4.5% smaller | strictly more headroom; fold safe |

The 320×640 case is called out because the brief flags it: the CTA was already 7px below a 640px fold before this work. **That is a pre-existing condition and this spec does not fix it, does not worsen it, and must not be used as an excuse to shrink the H1 further.** If Ejak wants it fixed, that is a separate change to `.hero` vertical rhythm at ≤30rem.

`--hero-fs` at 375 resolves to 31.5px, below the `3.25rem` floor, so `clamp` returns **52px** — exactly today's mobile display size. Mobile type is byte-identical.

---

## 8. Alt text and the label slot — markup only

### 8.1 As shipped while consent is pending

```html
<figure class="hero-portrait">
  <img class="hero-portrait__img"
       src="assets/hero/student-elsya-cutout.png"
       width="1086" height="1317"
       decoding="async"
       alt="[FILL: alt text — pending Ejak's confirmation of consent]">
  <figcaption class="hero-portrait__label">
    [FILL: caption — pending Ejak's confirmation of consent]
  </figcaption>
</figure>
```

**Two `[FILL]`s. No name, no caption, no attribution, no testimonial, no consent sentence is written here or anywhere in this spec.** The shirt in the image carries a Duta Persada logo, not Super Duper; the name badge is cropped out of the composition (§2.2) but the shirt logo remains visible and is Duta Persada's to authorise. That is Ejak's call, not the designer's.

### 8.2 If Ejak confirms she is a **real consenting student**

The portrait becomes **informative** — it depicts a person who is the subject of the page, so it carries meaning and needs a real `alt`.

```html
<img … alt="[FILL: alt text — one factual sentence describing the person and
               the learning context, written by EVA, no evaluative claim]">
<figcaption class="hero-portrait__label">[FILL: caption]</figcaption>
```

Label styling, once the string exists:

```css
.hero-portrait__label {
  position: absolute;
  left: 0;
  bottom: calc(-1 * var(--space-md));
  margin: 0;
  font: 400 var(--type-small)/1.45 'Inter', sans-serif;
  letter-spacing: .04em;
  color: var(--white);                             /* 8.12:1 on the field */
}
```

It sits **below the box**, i.e. in the off-bottom bleed — which is already clipped. **Therefore the label must be lifted inside the box** when a real string exists:

```css
.hero-portrait__label { bottom: var(--space-md); left: var(--space-md); }
```

and it will then sit over her polo at 8.12:1 (measured, §4.2). **No scrim needed.**

### 8.3 If she is a **model, an illustration, or consent is not confirmed**

The portrait becomes **decorative**. `alt=""` and the `<img>` is removed from the accessibility tree; the label carries the disclosure alone.

```html
<img … alt="" aria-hidden="true">
<figcaption class="hero-portrait__label">
  [FILL: caption — must match the existing testimonial disclosure language]
</figcaption>
```

The testimonial section already carries `simulasi untuk ilustrasi…`. **The hero label must use the same wording**, per restyle §9.6. Exactly what that wording is, is EVA's to supply — the brief forbids inventing consent language, and so does this spec.

### 8.4 What must not happen

- Do not write `alt="Elsya"` — that is an attribution and it is not cleared.
- Do not use the `ELSYA` badge as a caption source. It is cropped out; it must not come back in text form.
- Do not add a testimonial, a quote, or a rating tied to this image.
- Do not leave a `[FILL]` string visible in production. `[FILL]` is a build-time marker; §10 check **V11** requires the page to be free of them before launch.

---

## 9. Accessibility

**1. Decorative or informative — currently decorative.** The hero's message is carried entirely by the H1, the lede and the CTAs. The portrait adds human presence and brand tone; removing it loses no information a screen-reader user is denied. So today: **`alt=""` + `aria-hidden="true"` on the `<img>`**, with the `<figcaption>` reserved as the disclosure slot. It graduates to **informative** the moment Ejak confirms a real consenting student and EVA supplies the alt string (§8.2).

**2. The label slot is a real disclosure, not a caption.** Whatever lands in `.hero-portrait__label` must be perceivable without colour and must not be dismissible (restyle §9.6). It sits inside the box, at `--space-small` (14px) Inter — **below the 18pt/14pt bold large-text threshold**, so it is held to 4.5:1. White on the field is 8.12:1 ✓; white on the polo is 8.12:1 ✓.

**3. Focus order is unchanged.** The `<figure>` is not focusable and the `<img>` is not an interactive target. `pointer-events: none` on `.hero-portrait` guarantees it cannot intercept a click meant for a CTA. Tab order remains: skip-link → nav → hero CTAs → next section. **Adding the figure between `.hero-copy` and `.batch-badge` in the DOM changes no tab stop.**

**4. `prefers-reduced-motion` — nothing to add.** This spec introduces **no motion**: no parallax, no parallax-on-scroll, no float, no reveal. The portrait is a static layer and the ghost glyph's mask is static. The existing reduced-motion block (`styles.css` L215-222) already covers everything else in the hero. **Do not give `.hero-portrait` the `reveal` class** — a fade on the hero's second-largest element delays the visual completion of the fold for no gain.

**5. Touch targets.** Unchanged. `.hero-portrait` is `pointer-events: none` and occupies no interactive area on mobile (it is `display: none` below 768px).

**6. Semantic structure.** `<figure>` / `<figcaption>` is the correct pairing and introduces no heading. Heading order is untouched: `h1` → `h2`. The decorative layers keep `aria-hidden="true"` (restyle §9.8).

**7. LCP.** The LCP element remains the `.hero` background (`Supergrafis-03-1440.webp`), which is unchanged and must stay non-lazy (restyle §9.9). The portrait is a secondary image:

```html
<img … decoding="async" fetchpriority="low">
```

**Do not** set `loading="lazy"` on it — it is above the fold at ≥48rem, and lazy-loading a visible hero image is a Lighthouse regression. **Recommended derivative, not authored here:** a WebP at the box aspect (≈ 1.115 w/h, ~700 × 630) at ≤120KB, with the PNG as `srcset` fallback for older Safari. The supplied PNG is 1.8MB; that is too heavy to ship above the fold. Generating it is a build step for EVA/REX — I did not create it and did not modify the supplied asset.

**8. Language.** `<html lang="id">` unchanged. The page copy is English and Indonesian; the alt string must match the language of the surrounding copy.

---

## 10. Verification

Every check has a pass criterion. **V1–V5 are the regression gate. Nothing ships if any of them fails.**

### A. Automated — run first, 3 minutes

| # | Check | Pass |
|---|---|---|
| V1 | Playwright / DevTools at **1366×768, 1280×800, 1440×900, 1599×900, 1920×1080**. Assert `document.querySelector('.hero-title').getClientRects()` — or count line boxes via `Range.getClientRects()` on `.hero-title__l2` | **exactly 1 line box** on `__l2` at every width. A 2-box result = 3-line H1 = ship blocker. |
| V2 | Same widths: assert `.hero-ctas` `getBoundingClientRect().bottom` **and** `.batch-badge` `bottom` are `< innerHeight` | both true at all five |
| V3 | Assert `document.documentElement.scrollWidth <= window.innerWidth` at **320 / 375 / 414 / 768 / 960 / 1200 / 1280 / 1366 / 1440 / 1599 / 1920** | no horizontal scroll anywhere |
| V4 | Assert `getComputedStyle(document.querySelector('.hero-portrait')).width / innerWidth` | **0.38–0.48** at ≥1280. Below 0.38 the figure is too small to read; above 0.48 it is crowding the type. |
| V4b | Assert the portrait's `getBoundingClientRect().bottom > hero.getBoundingClientRect().bottom` at **1280 / 1366 / 1440 / 1920** | **true** — i.e. it genuinely bleeds. At 1200 it may sit up to 8px short; that is the documented §3.3 exception |
| V5 | Assert `getComputedStyle(document.querySelector('.hero-portrait__img')).objectFit === 'cover'` and `objectPosition === '50% 0%'` | both exact — the crop that excludes the name badge depends on them |

### B. Visual — screenshot and measure

| # | Check | Pass |
|---|---|---|
| V6 | Screenshot the hero at **1366×768, 1440×900, 1920×1080**. Measure the gap between the H1's line-box bottom and the portrait's top edge | **≥ 16px at all three.** Under 8px, reduce `--portrait-h` by 4% — **never touch the H1** |
| V7 | Same screenshots: does any white or yellow glyph pixel overlap her hair, face, or collar? | **zero overlap.** Any overlap is a ship blocker — yellow on skin fails |
| V8 | At **375×812** and **320×640**: record `.hero-ctas` `bottom` and `.batch-badge` `bottom` **before and after** the build | **identical.** The portrait must be `display: none` and contribute no height |
| V9 | At **1440×900**: is white text in the badge strip crossing her yellow placket? | **no** — the §6 field plate makes this impossible. If it happens, the plate is missing |
| V10 | At **1440×900**: does the ghost glyph's right edge read as a hard vertical line, or as a second figure? | reads as tone. If it reads as a figure, the mask is missing |
| V11 | `grep` the built page for `[FILL` | **zero** in any user-visible string. `[FILL]` markers live only in the source until EVA fills them |

### C. Asset and contrast

| # | Check | Pass |
|---|---|---|
| V12 | Open `assets/hero/student-elsya-cutout.png` and confirm the visible crop stops **above** the `ELSYA` badge and the DUTA PERSADA chest logo | neither is visible at any viewport in the V6 set |
| V13 | Eyeball the H1 against the **Supergrafis-03** pattern tone (not the flat fallback) at 1440×900 | white H1 clearly readable; the pattern is not fighting the letterforms |
| V14 | Confirm **no new hex** entered the build. `grep -E '#[0-9A-Fa-f]{6}' styles.css` and diff against the pre-build list | only `#034E9E` (the §6 plate) and the existing tokens. Anything else is a brand violation |
| V15 | Run the axe DevTools audit on the hero | **zero violations.** Specifically: exactly one `h1`; the `<figure>` has an accessible name or is fully `aria-hidden`; the `<img>` has an `alt` attribute present |
| V16 | Confirm the portrait PNG is **not** `loading="lazy"` and carries `fetchpriority="low"` | both as specified |

### D. Regression against the shipped fix

| # | Check | Pass |
|---|---|---|
| V17 | Confirm `.hero` still has `grid-template-columns: minmax(0, 1fr)` and that `.hero-copy` still has `max-width: min(calc(100vw - var(--gutter)*2), 1400px)` | both **unchanged**. If either moved, the portrait took width from the type — the whole design fails |
| V18 | Confirm `--type-display`'s floor (`3.25rem`) and ceiling (`8rem`) are intact | both intact. This spec lowers the *slope* and the *effective* ceiling via `--hero-fs`; the token's own bounds are the brand's |
| V19 | Confirm zero changes to `script.js`, and that `index.html` diff is exactly: one `<figure>` inserted, `--hero-fs` + 4 custom properties added inside `.hero`, the `.hero-ghost-glyph` size/mask, and the three `.batch-badge` plate lines | diff matches this spec, nothing else |

---

## 11. Disagreements with brief

Four. All flagged, none silently applied.

### D1 — The 34–40% width figure is unachievable inside a non-overlapping band. **We ship 34–47% by changing the crop, not by shrinking the type.** *(substantive)*

The brief states a bleeding portrait "needs roughly 34–40% of hero width" and that the type column must narrow to 58–64%. Measured, that is not the binding arithmetic. The binding constraint is **band height**, not column width: with a 220px H1 at the top of an 823px hero, the clear band below it is ~425px, and a figure at the source's native 0.825 aspect in that band is 24% of the hero width.

**What I did instead:** kept the type track at its full 1400px, positioned the portrait absolutely, and set the box aspect to **1.115** so `object-fit: cover` reads only the **top 74%** of the cutout. That wider, shorter crop is what buys the width — **38.9% / 40.0% / 46.0% / 42.9% / 47.7%** of hero width at 1366 / 1280 / 1440 / 1599 / 1920 (§3.2) — while simultaneously excluding the `ELSYA` badge and the Duta Persada chest logo. **The crop solves the width problem and the consent problem with one decision.**

### D2 — A container-relative unit (`cqi`) is the wrong lever and I recommend against it. *(methodological)*

The brief says "you will likely need a container-relative unit." With the portrait absolutely positioned, **the type container never narrows**, so `cqi` would size the H1 against a constraint that does not exist, and it would create a second source of truth for the display size alongside `--type-display`.

**What I did instead:** hoisted the display size into `--hero-fs: min(8.4vw, 7.6rem)` so `calc()` can read it for the portrait geometry, and kept `.hero-title { font-size: var(--type-display) }` untouched. The H1 changes by **−5.5%** at 1440 and gains a constant ~5% measure headroom. If EVA would rather the H1 not move at all, set `--hero-fs: min(9vw, 8rem)` and the portrait geometry still computes — at the cost of returning to the 8px headroom at ≥1580px that exists today.

### D3 — I lowered the `--type-display` ceiling from 8rem to 7.6rem, and restyle §2 calls 8rem "deliberate." *(substantive)*

The 8rem ceiling is the **exact** fit point: at 1440px and above, `Live the Experience.` measures 1392px inside a 1400px track. That is **0.6% headroom** — the fragility the brief names, present today with no portrait in the build. A headline with 8px of slack is one font-rendering difference away from a third line.

**What I did instead:** `8.4vw` slope, `7.6rem` effective ceiling (the token's own `8rem` ceiling is retained in the clamp). Headroom becomes **4.9–5.6% at every width from 1200 to 1920**, measured in §3.2. The headline goes from 128px to 121px at 1440 — a 5.5% reduction, which is not "irrelevance." **If EVA rejects this**, the fallback is `--hero-fs: min(9vw, 8rem)` plus a hard `white-space: nowrap` on `.hero-title__l1` / `__l2` to force the break, accepting that the third line arrives somewhere between 1580px and 1920px.

### D4 — The portrait must be hidden below 768px. *(disagreement with the implicit "everywhere" reading)*

The brief asks what happens at 320/375/768 but does not say the portrait must appear on mobile. At 375px the resolved width is **150px**, which reads as a postage stamp, and any flow participation pushes the CTA on a viewport where the CTA is already 7px past a 640px fold.

**What I did instead:** `display: none` below 48rem, which makes the mobile build byte-identical to today's. The alternative layered treatment is specified in §4.3 — it is available, it needs a scrim, and it needs a fresh contrast check on the CTA row. **It should not be built without an explicit decision.**

---

**Pre-emit critique:** P5 · H5 · E5 · S4 · R5 · V4 — the honest limits are the two `[FILL]` strings (§8), the unverified cutout matte quality (EVA's to confirm), and the 1.9% bleed at exactly 1440×900 (§3.3), which I have stated rather than hidden.

---

## 12. Build order for REX

Five steps, each independently verifiable. Total ≈ 40 minutes.

1. **Add `--hero-fs` to `:root`; change `--type-display`'s preferred term to `var(--hero-fs)`.** Nothing else. *Verify:* V1, V2, V17, V18. The page must look and measure **identical** to today except the H1 is 5% smaller.
2. **Add the four portrait custom properties inside `.hero`.** No element yet. *Verify:* no visual change.
3. **Insert the `<figure class="hero-portrait">` after `.hero-copy`; add `.hero-portrait` and `.hero-portrait__img`.** *Verify:* V4, V5, V6, V7, V12, V19.
4. **Ghost glyph:** size down + mask. **Badge:** field plate. *Verify:* V9, V10, V14.
5. **Mobile:** `display: none` below 48rem. *Verify:* V3, V8, V11, V15, V16.

**Do not touch `script.js`. Do not add motion. Do not add a caption.**
