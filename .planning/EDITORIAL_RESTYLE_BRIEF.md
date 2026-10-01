# DESIGN BRIEF — Super Duper landing page: editorial restyle

**From:** EVA (coordinator)
**To:** @Neo (designer / `designer` profile)
**Date:** 2026-10-01
**Task type:** Design direction ONLY. Write a spec file. Do NOT touch `index.html`, `styles.css`, or `script.js`.

---

## 1. Objective

Restyle the existing Super Duper Language Center landing page so it reads as a **premium editorial brand** instead of a generic edtech marketing page. The visual reference is `https://landonorris.com/`.

The real objective is NOT "look like Lando Norris." It is: **make the page feel expensive and distinctive enough to justify the program's price.** The reference is the vehicle, not the destination.

Secondary objective: kill the current decoration-competition problem — the live hero currently stacks gradient + bubbles + rings + confetti + yellow arc + blue ring + lightning bolt + pill CTAs, and every one of those competes with the headline.

## 2. Reference teardown — VERIFIED

I pulled the CSS and screenshotted the live site. Use these facts, not impressions.

**Confirmed from stylesheet:**
- Single font family: `Brier` — a **high-contrast serif**. No sans in the stack.
- Palette is three values only: `#d2ff00` (acid lime), `#101400` (near-black, green-tinted), `#000`.
- Layout is driven by only four custom properties: `--container-padding`, `--fluid-container`, `--fluid-font`, `--section-padding`.

**Confirmed from screenshot of the live hero:**
- **Field:** pure white. Not cream, not off-brand.
- **Contour layer:** full-bleed topographic contour lines in very light grey — flowing, organic, circuit-map geometry. Low contrast, present everywhere, never competing.
- **Ghost glyph:** one oversized light-grey numeral/shape at top-left, behind everything, near-invisible.
- **Display type:** heavy serif, black, stacked two lines, tight leading, pinned top-left.
- **Corners:** every hard-edged element is a **sharp rectangle**. The accent button and the menu button and the badge card all have zero border-radius. No pills anywhere.
- **Composition:** three elements only — wordmark, portrait, badge. Enormous negative space.
- **Badge card:** compact, thin black hairline outline, transparent fill, tight internal padding. Contains a tiny tracked uppercase label, a small black line-art glyph, another tracked label, and a laurel-wreath emblem. Reads as an instrument panel / event patch, not a UI card.
- **Gutters:** tight. Wordmark and badge start ~24px from the viewport edge; buttons end ~24px from the right edge. Content is **pinned to the extreme edges**, not centred in a max-width container.
- **Portrait:** cropped so the subject dominates and **bleeds off the bottom edge**. A translucent white wireframe helmet overlays the head and merges with the contour lines.
- **Contrast strategy:** pure black + one acid accent. Greys appear only in the contour layer and ghost glyph.

**Confirmed from DOM — the signature structural moves beyond the hero:**
1. **Sentence-runner typography.** One large mixed-case sentence with 2–3 words wrapped in `<strong>` for emphasis: *"Redefining **limits**, fighting for **wins**, bringing it all in all ways. Defining a **legacy** in Formula 1 on and off the track."* Regular weight with selective bold inline. This is the single most transferable device on the site.
2. **Two-word headings broken across two lines** — `ON / TRACK`, `OFF / TRACK`, `Helmets / Hall of Fame`. Tight leading, huge type.
3. **Editorial index list.** Image + tiny tracked caption (`FIA Prize Giving, 2024`) in a flowing sequence. Reads as a contact sheet / archive, not a card grid.
4. **Grid index with name + year.** Helmet list: item, name, year. Hairline-separated.
5. **Consistent section rhythm:** tiny tracked uppercase eyebrow → huge heading → one short paragraph → one underlined text link. Repeated verbatim down the whole page.
6. **Closing statement.** A short, confident sentence as the final word: *"Always bringing the fight."*

## 3. Current Super Duper state — what we are working with

Live at `http://127.0.0.1:8766/` (server running from the project dir). 12 sections, 515-line `index.html`, 1443-line `styles.css`, 149-line `script.js`. Committed and previously design-reviewed as APPROVED.

**Sections:** hero → method (4 cards) → program (2 cards) → why (6 cards) → curriculum (10 steps) → format → camp (5-photo mosaic) → testimonials (6) → FAQ (8) → CTA → footer.

**The dominant problem is a card grid.** `article` after `article`, all rounded boxes, all similar weight. Nothing has editorial hierarchy. Sections 2, 3, 4, 5, 6 and 9 are all "grid of rounded rectangles with a heading and a paragraph." That is the thing to break.

**Existing assets (real, on disk — use these, do not generate replacements):**
- `assets/supergraphic/` — 8 brand supergraphics, all 4500×6042: `Supergrafis-01, -02, -03, -04, -08, -09, -10, -12.png`
- `assets/logo/Primary Logo.svg`, `assets/logo/Brandmark.svg`
- `assets/fonts/` — Poppins (Regular/Medium/SemiBold/Bold/ExtraBold) + Inter (Regular/Medium/SemiBold/Bold), self-hosted `.ttf`
- `assets/camp/` — 5 real campus photos `.webp`
- `assets/testimonial/` — 6 illustrated profile images `.png`
- Contact sheet of all 8 supergraphics on brand blue: `C:/Users/muham/AppData/Local/Temp/supergraphics_sheet.png` — **look at this** to pick which ones can serve as the contour/line-art layer.

## 4. Hard brand constraints — NON-NEGOTIABLE

Source of truth: `D:/Obsidian/03_ORGANIZATION/DUTA_PERSADA/SUPER_DUPER_LANGUAGE_CENTER/AI_BRAND_VISUAL_SPEC_2026.md`. Read it in full before you design.

- **Poppins is the primary display face. Inter is secondary.** No serif. The reference's Brier serif is the one element you must **not** copy — re-express its structural role (huge, tight-leading, high-contrast stacked display) inside Poppins.
- **Blue `#034E9E` carries the hero. Yellow `#F9D024` is the energy accent** — accent used sparingly and deliberately, never as a large fill except small UI accents. Blue tints: `#0A2A5E / #061A3C / #0E3E86 / #1A5BC2`.
- Yellow on white and white on yellow fail contrast. Use `#F9D024` on blue `#034E9E` (≈4.3:1) and on near-black `#061A3C`. Body text on blue must be `#FFFFFF` at high opacity — the current hero subhead is a known defect (contrast ≈2.3:1) and **must be fixed**.
- Off-brand: generic SaaS purple/indigo, teal/emerald, orange gradients, glassmorphism, emoji.
- Structural rules: geometric sans only, sentence case for body, ≤1.5 line-height body, ≥8px radii on UI elements (use **0 or 2px** — sharp is the new intent), one clear focal point per screen.

## 5. The translation table — do this, not a clone

Copy the **structure and discipline**. Replace the **surface**.

| Reference device | Super Duper equivalent — brand-legal |
|---|---|
| White field + contour lines | Keep blue hero (brand-mandated). Build the contour/line layer from the 8 supergraphics at 3–6% opacity, full-bleed, `mix-blend-mode: overlay/soft-light`. Pick the organic/line-art ones from the contact sheet. |
| Oversized ghost numeral | Same device in brand: one huge `S`/`D` bolt or the wordmark's own contour form ghosted at 2–4% behind the hero. |
| Sharp rectangles, no pills | Kill every pill/rounded-full button. CTAs become sharp rectangles. Badge card keeps its hairline-outline instrument-panel character. |
| Edge-pinned composition, ~24px gutters | Move content to the viewport edges. Kill the centred max-width container for the hero at least. Full-bleed sections with hairline rules. |
| `NEXT RACE` badge, lower-left, hairline outline | **`NEXT BATCH` / enrollment-status badge**, edge-pinned. Contains: tracked uppercase label, a small line-art glyph, batch/schedule line, and an emblem-style mark. This is the highest-value element in the whole redesign — it converts the hero from a poster into a conversion surface. |
| Serif display type | Poppins ExtraBold, huge, tight leading, two-tier contrast: `SUPER DUPER` light/medium + `LANGUAGE CENTER` ExtraBold. Two weights stacked = the contrast the serif was doing. |
| Acid lime `#d2ff00` | Brand yellow `#F9D024` in the same sparing role — small fills, one accent per viewport. |
| Sentence-runner with inline `<strong>` | Adopt directly in Indonesian. Body paragraph at display scale with 2–3 key words in ExtraBold yellow or white. This is the highest-leverage transfer on the site. |
| Two-word headings split across lines | Adopt: `Belajar / Jadi Karakter` style splits. |
| Editorial index list + caption | Convert **curriculum 10 steps** from a 10-card grid into a hairline-ruled numbered index list. Convert **camp photos** into an editorial index with tracked captions instead of a mosaic. |
| Repeated eyebrow → H2 → line → link rhythm | Adopt verbatim as the section rhythm. |
| `ON / TRACK` split-nav sections | Structural principle for program vs. camp: two distinct, contrasting full-bleed blocks. |
| Contact-sheet gallery w/ tiny captions | Testimonials: keep the 6, but as a hairline-ruled index, not a 6-card grid. **Keep the existing "simulasi/ilustrasi" disclosure visible.** |
| Closing confident statement | Replace or reinforce the final CTA headline. |
| Editorial archive grid (name + year) | Optional: the 14 supergraphics as a brand-mark grid, or the curriculum as a year/progress index. |

## 6. Explicitly kill

- Blue gradient hero background (flat brand blue + line layer, not a gradient)
- Bubbles / rings / confetti particle layer
- Pill and rounded-full CTAs
- The card-grid rhythm as the page's default — this is the single biggest change
- Any gradient on CTAs (flat fills only)
- Soft drop shadows on surfaces (hairline borders only)

## 7. Open decision I am making — flag it if you disagree

I am **keeping the brand blue hero and rejecting the reference's white field.** Reasoning: `AI_BRAND_VISUAL_SPEC_2026` makes blue the hero field with yellow as the energy accent, and that spec explicitly says to flag conflicts rather than silently replace the brand system. A white hero would also fight the blue nav bar and break the section rhythm.

**If you disagree, say so explicitly in your spec with your reason.** Do not quietly redesign around it.

## 8. Deliverable

Write exactly one file:

`E:/1. Working/2. Super Duper/landing-page/EDITORIAL_RESTYLE_SPEC.md`

It must be buildable by a developer with no further questions. Include:

1. **Design intent** — 5 lines max, the argument, not decoration.
2. **Type scale** — exact `clamp()` values for every level, Poppins weights, line-heights, letter-spacing. Say which element uses each.
3. **Colour roles** — a token table mapping every surface/text/accent role to a brand hex, with the hex, verified contrast ratio, and which pairs are forbidden.
4. **Section-by-section** — all 12 sections. For each: current composition, new composition, exact layout mechanism (grid/flex, column spans), and the structural device borrowed from the reference.
5. **The hero, in full detail** — exact composition, the `NEXT BATCH` badge anatomy and its contents, type treatment, the contour layer build (which supergraphic, opacity, blend mode, positioning), and the mobile behaviour.
6. **Component specs** — CTA button (both variants), badge card, section eyebrow, index list row, testimonial row. With dimensions, colours, states.
7. **Motion** — restrained. Scroll reveal timing/easing, hover states. Explicitly no parallax, no cursor-follow.
8. **Kill list** — what gets removed, so the developer can find it.
9. **Accessibility** — the hero subhead contrast fix, focus states, reduced-motion.
10. **Build order** — sequenced steps so implementation is mechanical.

## 9. Boundaries

- **Write only** `EDITORIAL_RESTYLE_SPEC.md` in the project dir. Touch nothing else.
- Do not edit `index.html`, `styles.css`, `script.js`, or any existing spec.
- Do not generate, source, or substitute any image. Use only the assets listed in §3.
- Do not invent copy, testimonials, names, prices, phone numbers, or schedules. Existing copy is the source of truth; if a new string is needed, mark it `[FILL: ...]`.
- Do not change the brand palette or introduce any colour outside the brand tokens.
- If you think part of this brief is wrong, write the spec and add a clearly-marked **"Disagreements with brief"** section at the end. Do not silently deviate.

Respond with a short summary: the design intent in 3 lines, plus anything you flagged as a disagreement.