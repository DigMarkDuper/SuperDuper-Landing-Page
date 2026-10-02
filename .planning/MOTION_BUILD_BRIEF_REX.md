# MOTION BUILD BRIEF — Super Duper Language Center landing page

**To:** REX (developer)
**From:** EVA (coordinator)
**Spec:** `MOTION_SPEC.md` at the repo root — read it in full. It is 432 lines. It is authoritative.
**Baseline:** `6dc4450`, branch `main`, tree clean.
**Date:** 2026-10-02

---

## 1. START HERE

`MOTION_SPEC.md` contains three **EVA CORRECTION** blocks that override the spec's own text. Read
those first — they fix defects that would otherwise ship:

| # | Location | What it overrides |
|---|---|---|
| 1 | §2.1 | Class is `is-visible`, **not** `is-inview`. |
| 2 | §4.1 | Blob cut is **keep a/b/c, delete d/e/f/g** — and delete the 4 matching `<span>`s in `index.html:60-63`. |
| 3 | §6 | JS-off is **already safe**. Do NOT add a fallback. But all new hidden states MUST be `.js`-scoped. |

Spec §8 lists two accepted notes (clip-path exception for the wipe; 900px breakpoint disabling rail
and pin). Both are approved. Do not re-open them.

---

## 2. FILES YOU MAY EDIT

| File | Baseline | Change |
|---|---|---|
| `styles.css` | 1690 lines | Append one clearly-marked MOTION v1 block. **Must stay last in the file.** |
| `script.js` | 110 lines | Add the stagger engine, shared rAF loop, word split, FAQ height anim, pointer handlers. |
| `index.html` | 500 lines | **Only** delete 4 blob spans at lines 60-63. Add only what the spec strictly requires (split-word wrappers are built in JS, not HTML). Nothing else. |

**Forbidden:** `git commit`, `git push`, `git add`, any branch operation, any edit to any asset, any
edit to `MOTION_SPEC.md`, any `.planning/*.md`, any file outside this table. Regenerating imagery is
forbidden. Inventing copy, testimonials, numbers, dates or prices is forbidden — use a literal
`[FILL: ...]` token where the spec calls for one.

---

## 3. WHY THE CASCADE RULE IS NOT OPTIONAL

This repo already shipped this exact bug as commit `25e7b98`. Image tier rules were placed at line
653; `.experience-band` (line ~1068) and `.final-cta` (line ~1568) are defined later at equal
specificity, so the later rules silently won and both sections regressed. It was diagnosed as a
hero-only bug for a full round because the hero happened to be defined earlier.

Your MOTION block goes **after the image tier block at the end of `styles.css`**. Put a comment at
the top of it saying it must stay last and naming `25e7b98` as the reason.

---

## 4. NON-NEGOTIABLE CONSTRAINTS (from spec §2, §5)

- `transform` + `opacity` only for scroll-linked motion. Never animate `top/left/width/box-shadow/margin`.
  `height` appears **only** on the FAQ panel selector.
- Exactly **one** `requestAnimationFrame` loop in `script.js`. `grep -c requestAnimationFrame script.js` must return `1`.
- Exactly **one** scroll listener total. No per-element listeners.
- All pointer-driven motion behind `@media (hover: hover) and (pointer: fine)`.
- All new hidden/rest states scoped `.js .<selector>`, never bare.
- `prefers-reduced-motion: reduce` lands every element on its **final** state. Zero elements left at
  `opacity: 0`. Spec §6 is the pass/fail matrix — read it as a checklist, not a summary.
- The 3 existing `prefers-reduced-motion` blocks stay **byte-identical**.
- Pin distance via `min-height`, never padding.
- Bounded `will-change`, released when an element settles.

---

## 5. BEFORE YOU EDIT — MEASURE THE BASELINE

Record these numbers now and again at the end. Spec §5 says two sections change height; **the other
nine must not move by even 1px.** Measure, do not assume.

Baseline to capture: height of all 11 sections at 1440×900 and 390×844, plus horizontal overflow
(`scrollWidth` vs `innerWidth`) at 390 / 768 / 1440 / 2005 / 2560.

---

## 6. SELF-VERIFY BEFORE REPORTING — all 16, by measurement

Spec's "Verification targets for REX" is 16 pass/fail assertions. Run every one. Do not report
"done" with 3 skipped.

The ones that most often get skipped, and are the reason this brief exists:

- **#5** 3 blob spans **and** 3 keyframes. 7→3 in both HTML and CSS. Not just keyframes.
- **#6** `animation-delay` non-decreasing in DOM order for every staggered group. Max ≤ 560ms.
- **#7** property discipline — no animated layout properties. FAQ height is the single exception.
- **#8** FAQ: peak **1** simultaneous animation when 3 panels clicked within 400ms.
- **#9** the other nine sections within ±1px, and both deltas 0 under reduced motion.
- **#10** at 375px and 414px: `.programs` is a vertical stack, track `transform: none`.

Report the measured value for each, not a pass word. A measurement you did not take is a gate you
did not run.

---

## 7. REPORT BACK

Return, compactly:
1. Files changed + line counts before/after.
2. The 16 verification results with measured values.
3. Anything you could not achieve, and why.
4. Baseline vs final geometry table for the 2 permitted height changes.

Do not commit. Do not push. Do not paste whole file contents. If you believe the spec is wrong
somewhere, implement the spec, note the disagreement in one line, and keep going.