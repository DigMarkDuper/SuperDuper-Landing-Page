# FIX BRIEF — Elsya reads as "sinking"

**To:** @REX (developer / `developer` profile)
**Branch:** `editorial-restyle`
**From:** EVA
**Date:** 2026-10-01

## Client feedback

> "terlalu bawah seperti tenggelam" — she sits too low, like she is sinking.

## Measured diagnosis — do not re-diagnose, this is verified

Measured live at viewport **2190×1133**, hero height 1056px, hero bottom y=1133:

| Element | Value |
|---|---|
| Elsya `.hero-portrait` box | y **400 → 1281**, x **1224 → 2206**, w 982, h 881 |
| `.batch-badge` strip | y **1073 → 1109** (36px tall), x **0 → 2190** — full width |
| Badge Status column | x **1549 → 2166**, y 1088 → 1109 |
| H1 box right | 1424 |
| H1 **painted text** right | **1424** — identical to the box |

### Root cause

1. **The badge strip runs underneath Elsya at chest height.** Her body continues *below* the strip, so the strip reads as a waterline across her — the "sinking" the client saw.
2. **The `Status · Pendaftaran dibuka` column (x 1549→2166) renders behind her body** because the portrait has `z-index: 2`. That is content loss, not just a visual artefact.
3. **Her position is correct and must NOT change.** The H1's painted text reaches x=1424, i.e. the headline fills its entire 1400px track. Raising Elsya above y=400 would overlap `"Experience."`. Lowering the ceiling on `--type-display` would push the H1 back to 3 lines and regress the fold fix we already shipped and verified. The reference (landonorris.com) also has the subject's head below the headline.

**So: do not move or resize Elsya. Fix the badge strip.**

## The fix

The `.batch-badge` was converted from the reference's compact bottom-left card into a **full-width strip** during the editorial restyle — a decision made *before* Elsya existed. Nobody accounted for her. Constrain it.

### Required change

Make the strip end where Elsya begins, using the `--portrait-w` custom property already defined on `.hero`, so it stays correct at **every** viewport width rather than only at the one measured here.

Target behaviour:

- The strip's background and all four meta columns (`NEXT BATCH`, `Jadwal`, `Kuota`, `Status`) sit entirely to the **left** of Elsya's box.
- No strip text may fall behind her body at any viewport from 768px to 2190px.
- Keep the strip's current visual treatment — hairline `border-top`, `display: contents` on `.batch-badge__meta`, small tracked type, sharp corners. Do **not** reintroduce a boxed card (that was FIX 1c; the flat strip is correct).
- If four columns will not fit in the available width at some tier, **reduce the gap and type size before you reduce the number of columns** — do not delete `Status`. Report the narrowest width where this became tight.

Implementation is yours; use `calc()` against `--portrait-w` and `--gutter` so the relationship is structural. Do not hardcode a breakpoint for 2190px.

### One supporting change

The portrait's `z-index: 2` sits above the strip. Keep the portrait above the strip's *background* — that is what creates the bleed and is desirable — but confirm no strip **text** is occluded. If a tier cannot avoid occlusion, lower the portrait behind the strip's text layer rather than hiding content.

## Hard rules — unchanged

- **Do not move, resize, reposition or re-crop Elsya.** Her geometry stays exactly as built.
- **Do not touch `--type-display` or the H1.** It is verified at exactly 2 lines from 1200px to 1920px and must stay there.
- No copy edits. The 2 `[FILL]` strings in the badge and the `[TBD]` in the footer survive untouched. `Status · Pendaftaran dibuka` stays.
- Do not touch the testimonial disclosure.
- Brand palette only, no serif, no pills, no CTA gradients, no surface shadows.

## Verify before reporting — run these for real

1. At **1920, 1750, 1600, 1440, 1366, 1280, 1024, 960, 768** px wide: assert that every `.batch-badge__row` rectangle's `right` edge is `<=` the portrait box's `left` edge. Report any tier where it fails.
2. H1 still exactly **2 lines** at 1200 / 1280 / 1366 / 1440 / 1600 / 1920.
3. Hero still fits viewport-minus-nav at 1366×768, 1280×800, 1440×900, 1600×900.
4. CTA bottom and badge bottom above the fold at all four.
5. Zero horizontal scroll at 320 / 375 / 414 / 768 / 960 / 1440 / 1600.
6. Screenshot the hero at 1920×1080 and 1440×900. **Confirm visually that no horizontal bar crosses Elsya and that she no longer reads as half-submerged.**
7. All 6 testimonial images still load; no 1.8MB PNG is requested.

Commit in logical increments.

## Report back

Commits · the tier-by-tier strip-vs-portrait results · H1 line counts · the narrowest width that got tight · a screenshot path for the 1920×1080 hero · anything you could not complete.