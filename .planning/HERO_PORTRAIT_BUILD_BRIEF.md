# BUILD BRIEF — Hero portrait integration (Elsya)

**To:** @REX (developer / `developer` profile)
**Branch:** `editorial-restyle`
**Date:** 2026-10-01

## Your spec

`E:/1. Working/2. Super Duper/landing-page/HERO_PORTRAIT_SPEC.md` — 552 lines. Implement it.

Also read for context: `EDITORIAL_RESTYLE_SPEC.md` (the existing system spec — stay consistent).

## Three decisions from EVA — apply all, do not revisit

### (1) NO THIRD WIDTH TIER

Neo asked whether to build the 46vw tier for 1400–1599px, which costs one extra lede line at 1440.

**DECISION: NO.** Keep Neo's two tiers. A ~5px shortfall from the fold at 1200–1300px is visually imperceptible; a layout change at 1440 is not. Bad trade, and one fewer breakpoint to break later.

### (2) USE THE OPTIMISED WEBP, NOT THE PNG

The spec's markup points at `assets/hero/student-elsya-cutout.png` — **1.8MB**. Far too heavy for an LCP element. I have already optimised it. Use a `<picture>`:

```
srcset  = assets/hero/student-elsya-720.webp 720w, assets/hero/student-elsya-1240.webp 1240w
sizes   = (max-width: 768px) 62vw, (max-width: 1399px) 46vw, 40vw
src     = assets/hero/student-elsya-1240.webp
width   = 1086
height  = 1317
```

The cutout's aspect is 0.825. Keep `loading="eager"` and `fetchpriority="high"` — this is the LCP element.

Alpha is verified intact in both WebP files (alpha extrema 0–255), so transparency survives the encode. **Delete the 1.8MB PNG from the repo once nothing references it.**

### (3) FILL PLACEHOLDERS ARE RESOLVED

Replace both `[FILL]`s with exactly:

- `alt="Elsya, peserta Super Duper Language Center"`
- figcaption text: `Elsya · Peserta Super Duper`

Set the figcaption small and tracked per the spec's `.hero-portrait__label` rule. No title, no pull-quote, no invented achievement, no extra words.

## Hard rules — unchanged

- **No copy edits anywhere else.** The 2 `[FILL]` strings in the NEXT BATCH badge and the `[TBD]` in the footer must survive untouched. No invented dates, quotas, schedules, prices or names.
- Brand palette only. No serif, no pills, no CTA gradients, no surface shadows.
- White-on-blue **8.12:1**, yellow-on-blue **5.44:1**.
- Do not touch the testimonial disclosure.

## Verify before reporting — run these for real, not by reading your diff

1. Hero still fits viewport-minus-nav at **1366×768, 1280×800, 1440×900 and 1600×900**. Report hero height vs available at each.
2. CTA bottom **and** badge bottom above the fold at all four.
3. H1 still exactly **2 lines** at 1200 / 1280 / 1366 / 1440 / 1600 / 1920. Report line count and headroom in px at each.
4. Screenshot the hero at 1440×900 and 375×812. Confirm: Elsya reads cleanly on the blue with **no halo and no light-blue fringe**; she does not collide with the eyebrow, the CTAs or the badge strip; the ghost hairline S still reads and does not fight her.
5. Confirm the portrait actually **bleeds off the bottom edge** as designed at 1440.
6. Zero horizontal scroll at 320 / 375 / 414 / 768 / 960 / 1440 / 1600.
7. Confirm the browser fetched the **1240 WebP**, and that no 1.8MB PNG is requested.
8. All 6 testimonial images still load.

Commit in logical increments.

## Report back

Commits · the four hero-fit results · H1 line counts · which file the browser actually fetched for the portrait · anything you could not complete.