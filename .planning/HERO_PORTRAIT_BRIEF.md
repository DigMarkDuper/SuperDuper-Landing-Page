# DESIGN BRIEF — Hero: add the student portrait (option B, cutout bleed)

**From:** EVA
**To:** @Neo (designer / `designer` profile)
**Date:** 2026-10-01
**Task type:** Design direction ONLY. Write a spec file. Do NOT touch `index.html`, `styles.css`, `script.js`.

---

## 1. Decision already made by Ejak

Option **B**, chosen by the client: **cut the student portrait out of its light-blue studio backdrop and float her on the brand blue hero field, bleeding off the bottom edge.**

Do not revisit A (panelled light-blue rectangle) or C (duotone). B is decided.

The matte itself is being produced by me in parallel — `rembg` u2net + alpha matting, cropped to the subject bbox. You do NOT need to do the cutout. Assume an RGBA PNG cutout with a clean feathered edge at roughly 0.75 aspect (1086×1448 source). I will verify the matte quality and tell you if it fails.

Asset path (will exist when you build): `assets/hero/student-elsya-cutout.png`

## 2. Current verified state of the hero

I measured the live build. Do not re-litigate; design within these numbers.

```css
.hero {
  position: relative;
  background-color: var(--blue);                              /* #034E9E */
  background-image: url('assets/supergraphic/Supergrafis-03-1440.webp');
  background-size: cover;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: var(--space-xl);
  align-content: space-between;
  min-height: calc(100svh - var(--nav-h) - 1px);
  padding-block: var(--space-2xl) var(--gutter);
  padding-inline: var(--gutter);
}
.hero-ghost-glyph { position:absolute; top:-.10em; left:-.04em; z-index:1;
  font-size: clamp(18rem,42vw,38rem); color:transparent;
  -webkit-text-stroke: 2px rgba(255,255,255,.09); }
.hero-copy { position:relative; z-index:3; max-width: min(calc(100vw - var(--gutter)*2), 1400px); }
.hero-title strong { font-weight:800; color: var(--yellow); }   /* #F9D024, 5.44:1 */
.batch-badge { /* full-width instrument strip at hero foot, 36px tall */ }
```

Measured at viewport 1440×900: nav 77px, hero height 823px, H1 font-size 128px, H1 **exactly 2 lines**, H1 track 1392px, widest line 1392px — **the H1 currently fills its track to the pixel.** That is the fragility.

Verified passing and MUST NOT regress:
- Hero fits viewport-minus-nav at 1366×768 (691px), 1280×800 (723px), 1440×900 (823px)
- CTA bottom and badge bottom above the fold at all three
- H1 stable at 2 lines from 1200px to 1920px
- 0 pills, 0 horizontal scroll at 320/375/414/768/960/1440
- `--type-display` is `clamp(3.25rem, 9vw, 8rem)` — the 8rem ceiling is deliberate

## 3. The problem you must solve

The H1 occupies the **full 1400px track**. A bleeding portrait needs roughly 34–40% of the hero width. So the type column must narrow to roughly 58–64%, which shrinks the H1's available measure — and the H1 currently has **zero headroom**. The obvious consequence is a 3-line H1, which pushes the CTA and the badge strip below the fold and destroys the fix we just shipped.

**That regression is the whole design problem.** Solve it deliberately.

Relevant lever you may use: the H1 is `clamp(3.25rem, 9vw, 8rem)` — the 9vw term is viewport-relative, so it does NOT shrink when the column narrows. Whether to change that term to a container-relative or `cqi`-based unit, or to tighten the display measure another way, is your call. Give me the exact values.

Also decide: does the portrait sit **behind** the type (with the type over it, requiring a scrim or safe-zone) or **beside** it in its own column? The reference (`landonorris.com`) puts the subject dead-centre with a large wordmark overlapping the composition — the type and the portrait share the frame rather than sitting in separate columns. Decide whether that is right here, given this page's type is left-aligned and English-language.

## 4. Brand constraints — unchanged and non-negotiable

Source of truth: `D:/Obsidian/03_ORGANIZATION/DUTA_PERSADA/SUPER_DUPER_LANGUAGE_CENTER/AI_BRAND_VISUAL_SPEC_2026.md`

- Poppins primary, Inter secondary. **No serif.**
- Hero field blue `#034E9E`; energy accent yellow `#F9D024` used sparingly.
- White on blue = **8.12:1**. Yellow on blue = **5.44:1**. Those are the verified figures — use them.
- Yellow on white and white on yellow are forbidden.
- Off-brand: generic SaaS purple/teal, orange gradients, glassmorphism, emoji.

## 5. One thing you must raise, not solve

The portrait's shirt carries the **Duta Persada** logo, not Super Duper. The name badge reads `ELSYA`.

I have separately asked Ejak whether she is a real student who consented to appear on the homepage. **Do not write a caption, name, testimonial, or attribution into the spec.** Mark it `[FILL: caption — pending Ejak's confirmation of consent]`. The page already carries a disclosure for its testimonials ("simulasi untuk ilustrasi…"), so the hero image must be labelled consistently with whatever Ejak decides. Give me the exact markup for a label slot and what must change if he confirms she is a real consenting student versus a model/illustration.

## 6. Deliverable

Write exactly one file:

`E:/1. Working/2. Super Duper/landing-page/HERO_PORTRAIT_SPEC.md`

Buildable by a developer with no further questions. Include:

1. **Composition decision** — portrait behind the type or in its own column, with the reasoning. 5 lines max.
2. **Exact layout** — grid definition, column widths/fractions, spans, and the z-index stack. Give the full `.hero` rule as final CSS.
3. **Type-size resolution** — the exact `--type-display` / H1 rule that keeps the headline at 2 lines inside the narrowed measure at 1200/1280/1366/1440/1920. State the measured line count at each width and the headroom in px.
4. **Portrait treatment** — exact `object-fit`, `object-position`, sizing, whether it bleeds off the bottom and how far, and what happens at 320/375/768. Say whether any scrim, gradient mask, or blend mode is needed to keep white type legible where it overlaps her.
5. **How the ghost glyph and portrait coexist** — the hairline `S` at z-index 1 and the portrait will compete for the same right-hand space. One must yield. Decide which and how.
6. **Badge strip** — confirm the full-width instrument strip still reads correctly with a portrait present, and what changes if any.
7. **Mobile** — the portrait must not push the CTA below the fold at 375×812, and 320×640 is already tight (CTA at y=647 vs 640 viewport). Give the mobile rule.
8. **Alt text and the label slot** — markup only, no invented copy.
9. **Accessibility** — the portrait is decorative-or-informative; state which and why. Focus order. `prefers-reduced-motion` if any motion is involved.
10. **Verification** — the exact checks a developer must run, with pass criteria, including the three desktop sizes and two mobile sizes.

## 7. Boundaries

- **Write only** `HERO_PORTRAIT_SPEC.md`. Touch nothing else.
- Do not edit `index.html`, `styles.css`, `script.js`, or any existing spec.
- Do not generate, source or substitute any image. The cutout is supplied.
- Do not invent copy, a name, a testimonial, or consent language.
- Do not change the brand palette.
- If you think part of this brief is wrong, build the spec and add a clearly-marked **"Disagreements with brief"** section. Do not silently deviate.

Respond with a 5-line verdict and your composition decision in one sentence.