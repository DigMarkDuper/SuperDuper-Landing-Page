# Decision record — hero portrait (Elsya)

**Date:** 2026-10-01 · **Branch:** `editorial-restyle` · **Decided by:** EVA, on Ejak's instruction

This exists so a future agent does not re-litigate settled decisions.

## The three failures, in the order they were found

1. **Box aspect mismatch (the actual "sinking" bug).**
   `.hero-portrait` box was `1.115` wide-against-tall; the cutout is `1086/1317 = 0.8246`.
   `object-fit: cover` therefore discarded **26% of her body at every viewport** — at 2005px
   only 63% of the figure was on screen. She read as a head with no torso.
   **Fix:** box locked to `--portrait-aspect: 0.8246` and `object-fit: contain`. Box crop is now
   0px at every width, verified.

2. **The `NEXT BATCH` strip ran full-bleed across her chest.**
   The strip became full-width during the editorial restyle — a decision made *before* Elsya
   existed. It read as a waterline, and `Status · Pendaftaran dibuka` was rendering **behind** her
   at `z-index: 2`.
   **Fix:** `padding-right: calc(var(--portrait-w) + var(--space-md))` — the strip ends where she
   begins, structurally, at every width. Measured clearance **+56px at 768/960/1024/1280/1366/
   1440/1600/1750/1920**. Mobile resets to full-bleed because the portrait is `display: none` there.

3. **She was cornered and too small at narrow viewports.**
   Capping her inside the band left her at 0.217 of hero width at 1366px — visibly lost in dead
   blue. **Fix:** band runs 96px *past* the hero foot so she extends left into that space.
   Now **29–35% of hero width** across 1280–2005px.

## Settled decisions — do not re-open

| Decision | Rationale |
|---|---|
| **No caption** (`Elsya · Peserta Super Duper` removed) | Ejak's explicit instruction: *"hilangin juga keterangan elsya - peserta super duper"*. Her `alt` text is retained for screen readers. |
| **The hero's edge crops her below the waist** | This is an editorial crop, not the old bug. The old bug was the *box* amputating her torso (item 1). Do not "fix" this by capping her inside the band — that caused item 3. |
| **One server, port 8766** | A second server on 8768 caused stale-cache confusion. 8768 is killed. |
| **No third width tier** | Costs an extra lede line at 1440 for an invisible 5px gap at 1200–1300. |
| **Keep the Duta Persada uniform** | Parent brand, correct for a child brand. Not a defect. |

## Known cosmetic item, not fixed

The WebP encode leaves a **1px light fringe** where her image meets the hero's bottom edge
(visible only at 5× magnification). It is a compression artefact, not a matte failure — the matte
was verified clean: **0 of 9,519 edge pixels** retain backdrop colour. Fixing it would mean
shipping the 1.8MB PNG or a PNG/WebP pair. Judged not worth the 8× payload for an LCP element.
Revisit only if it becomes visible at normal viewing distance on real displays.

## Verified invariants — must survive any future change

- H1 is **exactly 2 lines** at 1200 / 1280 / 1366 / 1440 / 1600 / 1920. The display size fills its
  track to the pixel, so any column-narrowing change will silently rewrap it to 3.
- Hero fits `100svh − nav` and CTA + badge stay above the fold at 1920×1080, 1600×900, 1440×900,
  1366×768, 1280×800, 1024×768.
- 0 pills, 0 horizontal scroll at 320–1920.
- White on brand blue `#034E9E` = **8.12:1**. Yellow `#F9D024` on blue = **5.44:1**.
  (Neo's spec originally said 8.62:1; corrected and verified.)

## Noise Blob background layer (melon-ui port)

Vanilla port of `melon-ui/registry/components/noise-blob.tsx` — four drifting circles merged by an
SVG gooey filter (`feGaussianBlur` + `feColorMatrix` alpha threshold + `feBlend`). Upstream is
React + framer-motion; this project has neither, so the motion is CSS keyframes transcribed from
the upstream `x`/`y` arrays and the durations are `(14 / speed) * sizeMult` at `speed: 0.62`.

**Brand mapping.** Upstream defaults are `#ff5c71` / `#7fff5e` / `#e8d5b7` — off-brand and far too
loud for a background. Replaced with brand tints: `#1A5BC2`, `rgba(249,208,36,.5)`, `#5B8FD6`,
`#0E3E86`. Layer opacity capped at `.34` desktop / `.28` mobile.

**Placement.** `z-index: 0` — above the Supergrafis-03 field image, below the ghost glyph (1),
Elsya (2), copy (3), badge strip (4). The cluster is pushed right and down (52–68% x, 40–62% y)
because the H1 fills its 1400px track to the pixel; blobs must never drift under it.

**Verified:** 108 FPS with the filter animating. Worst-case field pixel `#517785` = **4.85:1**
white, **0 pixels below AA (4.5:1)** anywhere in the hero, measured on an isolated flat-blue field
with no text. `prefers-reduced-motion` holds a still frame rather than a blank field.

## Measurement pitfall — headless Chrome cannot verify this page

`chrome --headless --screenshot` **never fires `IntersectionObserver`**, so every `.reveal` element
stays at its pre-transition opacity. Captures therefore show the type semi-transparent, which
produces completely bogus readings — this cost three wrong conclusions in a row:

- "white on field is 2.97:1" → real value is **8.12:1**
- "white on field is 1.40:1" → that pixel was an antialiased glyph edge, not the field
- "`Experience.` renders olive `#C0B23F`" → real computed colour is exactly **`#F9D024`**; the
  captured pixels were `#F9D024` at ~77% opacity blended with the field

**Rule:** verify text rendering and contrast through the live DOM (`getComputedStyle`,
`elementsFromPoint`) or a capture path that runs the real IntersectionObserver. Treat headless
pixel sampling as valid only for regions with **no text**. Confirm any suspicious reading by
checking computed style before believing it.

## Outstanding data — needs Ejak, not engineering

Three live placeholders remain on the page:

- `Jadwal — [FILL: tanggal & jam]`
- `Kuota — [FILL: jumlah kursi]`
- footer — `[TBD — kontak resmi]`

None may be invented. The page is not publishable until these are supplied.