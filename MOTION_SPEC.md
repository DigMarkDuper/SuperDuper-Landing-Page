# MOTION_SPEC — Super Duper Language Center landing page

**Author:** NEO (designer) · **Ruling:** EVA, MOTION_BRIEF_NEO.md, 2026-10-02 · **Baseline:** `6dc4450`
**Scope:** spec only, no code. Binding on REX. Files this may change: `styles.css` (one appended
block, last) and `script.js` (additive only).

---

## 1. Motion principle

Uniform motion is the generic signal, not the absence of motion — so each of the 11 sections gets
**one distinct motion idea** instead of a shared fade, and grouped siblings move as a **staggered
sequence** so a section reads as a composed idea rather than 80 independent fades. Anything moving on
scroll uses `transform`/`opacity` only, and every effect has a stated resting state so
reduced-motion and JS-off both land complete.

---

## 2. Global systems

### 2.1 Chapter nav indicator (Apple Watch technique)

A fixed right-edge rail (≥1024px only), 11 marks in document order, label revealed on hover/focus
only. One marker translates on `transform: translateY()` to track the active section. Active = last
section whose top has passed `50vh`, ties toward the earlier one; the active mark gets a `--blue`
fill, a `transform: scaleY()` grow, and `aria-current="true"` — never colour alone. 3px hairline with
marks hidden at 1024–1279px, fully hidden below 1024px. Driven by the shared rAF loop (§2.3), never
its own scroll listener, and `pointer-events: none` except on marks so it can never intercept clicks.

### 2.2 Stagger engine (highest-value change, lowest cost)

All 80 `.reveal` elements keep the existing observer (threshold `0.15`, `rootMargin '0px 0px -8% 0px'`,
unobserve after first fire) and gain group sequencing via `--i`, a zero-based index set once in the
appended block.

`--i` steps, in ms — `.step` 10 × **55**, `.eyebrow` 13 × **30**, `.why-cell` 6 × **70** (ascending,
§4.5), `.spec-row` 6 × **60** (paired, §4.7), `.index-row` 4 × **70**, `.camp-card` 3 × **90**,
`.program-title`/`-body`/`-features` 2 each × **80**. `.testimonial-row` 6 → **no motion** (§4.9).
`.section-title` 8 × **0** (solo — a heading never staggers against itself). `.lede` 4 and `.btn` 5
× **0**, following their own section's idea rather than a fade. Directions: `.index-row` and
`.camp-card` left → right, everything else top → bottom.

- Delay = `calc(var(--i) * step)`, capped at **560ms**; a group over 10 items (`.eyebrow`) compresses
  rather than exceeding the cap.
- Stagger is `animation-delay`, not `transition-delay`: the observer adds a class, the appended
  block owns the keyframes. The 13 existing `transition:` declarations are **not** modified.

### 2.3 One shared rAF loop (mandatory)

A single `requestAnimationFrame` reader in `script.js` drives, in one pass: chapter rail (§2.1),
`.hero` blobs (§4.1), `.experience-band` image (§4.3), `.programs` rail (§4.4), `.curriculum` pin
(§4.6), `.final-cta` ticker and magnetic pointer (§4.11). `passive: true`, one cached
`getBoundingClientRect` per section per frame, no layout thrash, no per-element listeners; the loop
unsubscribes when the page is hidden.

### 2.4 Reduced-motion master guard

`script.js` already reads `reduceMotion` at line 11. Add exactly one master guard right after it:

```
if (reduceMotion) { /* skip rAF init; add .is-visible to all 80 .reveal; no word split */ }

> **EVA CORRECTION 1 — class name.** The real class is **`is-visible`**, not `is-inview`.
> `styles.css:218` is `.js .reveal.is-visible { opacity: 1; transform: none; }`. There is no
> `is-inview` anywhere in this codebase. Use `is-visible` everywhere.
```

CSS is the backstop: the 3 existing `prefers-reduced-motion` blocks stay **unmodified**, and the
appended block ends with its own override setting every new effect to `opacity: 1` / `transform: none`
/ `clip-path: none`. **No element may be left at `opacity: 0`** — REX asserts this (target 4).

### 2.5 Cascade-order contract (bug `25e7b98`)

All new CSS goes in **one** block appended at the **very end of `styles.css`**, after the image tier
block, opening with this comment verbatim:

```
/* === MOTION v1 (MOTION_SPEC.md) — APPENDED BLOCK, MUST STAY LAST IN FILE === */
/* New motion rules live here ONLY. Equal-specificity collisions are resolved by source
   order, and reordering this block behind any later rule has broken the page before
   (bug 25e7b98). Do not insert motion rules above this marker. */
```

Internal order: tokens → keyframes → base states → per-section → hover/pointer → the
`prefers-reduced-motion` override last, so it wins on equal specificity.

---

## 3. Timing table

New tokens live only inside the appended block (§2.5) and never redefine an existing brand token.

| Token | Value | Used by | Reason |
|---|---|---|---|
| `--sd-ease-out` | `cubic-bezier(0.16, 1, 0.30, 1)` | wipe, pin, tilt, magnetic | Decelerating expo — arrives fast, settles without bounce. |
| `--sd-ease-inout` | `cubic-bezier(0.65, 0, 0.35, 1)` | accordion | Symmetric ease for reversible two-way motion. |
| `--sd-ease-magnetic` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | magnetic CTA only | Slight overshoot, on one element, to read as physical. |
| `--sd-dur-micro` | `160ms` | hover tint, rail marker | Below it feels unresponsive. |
| `--sd-dur-fast` | `320ms` | stagger entrance default | Under the 400ms "did it animate?" threshold. |
| `--sd-dur-base` | `560ms` | wipe, parallax, card reveal | A composed move, not a transition. |
| `--sd-dur-slow` | `820ms` | hero cascade, curriculum pin, ticker reveal | Long-form editorial moves. |
| `--sd-dur-panel` | `340ms` | FAQ accordion | Short enough that rapid tapping never queues. |
| `--sd-rail` | `0.18` | hero + image parallax | Below 0.25, so parallax registers without breaking the read. |
| `--sd-lift` | `6px` | hover lift on `.camp-card` | Over 8px reads as a floating toy. |
| `--sd-tilt` | `4deg` | `.camp-card` hover tilt | Past 6deg the card edge visibly wobbles. |
| `--sd-magnet` | `0.28` | magnetic CTA pull | Enough to feel magnetic, not enough to trap the pointer. |

**Non-values:** no bounce, no overshoot except the magnetic CTA, nothing above 820ms on a
scroll-triggered effect, and no two effects sharing a duration on one element. Identical durations
across sections are exactly what produced the uniform feel being fixed.

---

## 4. Per-section spec

### 4.1 `.hero` — blob parallax + word-by-word heading (L51)

**Blob field — cut 7 → 3.** `sd-blob-d`, `-e`, `-f`, `-g` are **deleted**; `sd-blob-a`, `-b`, `-c` are
retained and re-tuned.

> **EVA CORRECTION 2 — this section contradicted itself and was wrong about the code.** The original
> text said "`sd-blob-c` … `sd-blob-g` are removed" and then said "`sd-blob-a/b/c` keep their names",
> which would have deleted `c` and kept a broken reference to it. The correct cut is **keep a/b/c,
> delete d/e/f/g**.
>
> The `<span>` elements live in `index.html:57-63` as `.hero-blob--1` … `.hero-blob--7`, and each is
> bound to its keyframe by name at `styles.css:750-762` (`--1`→`a`, `--2`→`b`, … `--7`→`g`).
> Deleting keyframes `d`-`g` **alone** leaves `.hero-blob--4` … `--7` alive with no animation —
> they will sit as static blobs, which is exactly the 4 extra blobs this cut exists to remove.
> **REX must delete the four `<span>` elements from `index.html:60-63` in the same change**, so
> 3 spans remain and 3 keyframes remain. This is the one place where `index.html` is in scope.
>
> Verified current timings, for the record: a=31s, b=27s(+1.5s), c=24s(+3s). Retuned to
> **18s / 24s / 31s** `alternate` as specified below.
Each translates on `transform: translate3d()` at the hero's own scroll delta — layer 1 (dominant)
0.14, layer 2 0.10, layer 3 0.06, three depths, clamped to the hero's scroll range, `will-change:
transform` only while the hero is in view.

**Heading — word by word, not one slab.** Split in `script.js` into per-word `<span>`s at runtime
(text verbatim; `aria-label` on the parent holds the full unsplit string so a screen reader hears one
sentence, not 6 fragments). Each word `translateY(0.55em)` + `opacity: 0` → resting,
`--sd-dur-base`, `--sd-ease-out`, 55ms stagger, 8-step cap (~440ms total). Under reduced motion or
JS-off the split is never applied and the heading renders intact.

Hero `.eyebrow` fires at +0ms; hero `.lede` and the 2 hero `.btn` follow the cascade at +180ms, same
easing. No other hero effects. **Do not** add a scroll-scrubbed WebGL hero, a custom cursor, or a
second blob layer set.

### 4.2 `.value-prop` — clip-path wipe (L130)

The statement text is masked with `clip-path: inset(0 0 100% 0)` → `inset(0 0 0 0)`, **top to
bottom**, `--sd-dur-slow`, `--sd-ease-out`. The mask is a pseudo-element in the section's own
background colour, so no layout wrapper is introduced and section height is unchanged. This is the
one named exception to the `transform`/`opacity` rule in brief §5: `clip-path` here is a static
one-shot entrance, paint-only and layout-free, **not** a scroll-linked animation. The `.eyebrow` fires
on its 30ms stagger, finishing ~120ms **before** the wipe begins, so the statement never competes
with its own label; the `.lede` follows at +140ms, `--sd-dur-fast`. Resting state is
`clip-path: inset(0 0 0% 0)`. One shot — scrolling back up does not replay it (the observer
unobserves after first fire).

### 4.3 `.experience-band` — image parallax (L169)

The band's field image drifts **against** the section: `translate3d(0, Ypx, 0)` where
`Y = (sectionCentre − viewportCentre) × −0.14`, clamped to ±40px so no edge is exposed. The image is
**scaled 1.14** inside an `overflow: hidden` band before drift starts — that overscan is what makes
the drift possible without a gap, and it is the only geometry change here, internal to the clipped
box, so the band's outer height is unchanged (§5). The copy side (`.section-title`, `.lede`,
`.eyebrow`) uses the standard staggered entrance and does not parallax: the image moves, the text
settles. `will-change: transform` while the band is in view only, released on exit. Reduced motion /
JS-off: `translate3d(0,0,0)`, scale 1, fully visible.

### 4.4 `.programs` — horizontal scroll rail (L182) · CENTREPIECE

**The single biggest "not generic" move on the page. Unmistakably the centrepiece, and it must not
break touch.** Vertical scroll in `.programs` drives horizontal travel of the `.program-*` track:
`translate3d(-Xpx, 0, 0)`, `X = progress × (trackScrollWidth − viewportWidth)`,
`progress = clamp((scrollY − sectionTop) / sectionHeight, 0, 1)`. The section gains **pin distance**
to make that travel legible (§5) — one of only two sections permitted to change height. Easing is
**linear**, never eased: easing a scrubbed rail detaches the track from the finger, so this is the
one place in the spec with no curve, deliberately.

The 2 `.program-title`, 2 `.program-body`, 2 `.program-features` rows enter on an 80ms stagger as
each row's leading edge crosses 60% of the viewport — **in addition to** the rail travel, not instead
of it, so the rail reads as one object being revealed.

**Below 900px the rail is disabled entirely** and `.programs` reverts to a vertical stack with the
standard stagger: a horizontal scrub on touch is a gesture users cannot predict, so the centrepiece
is a desktop/tablet enhancement, not a mobile tax. 900–1279px runs with reduced pin distance (§5).
Reduced motion: rail off, vertical stack, all rows at rest, no pin. `will-change: transform` on the
track only while `.programs` is in view — one element, one layer.

### 4.5 `.why` — ascending cell stagger (L217)

The 6 `.why-cell` elements stagger with an **ascending offset**: each cell travels further than the
one before it, so the sequence sweeps upward instead of fading as a block. Cell `n` (0-indexed):
`translateY(calc((n + 1) * 10px))` → resting, 70ms steps, `--sd-dur-fast`, `--sd-ease-out`. Cell 0
moves 10px, cell 5 moves 60px — the differential *is* the effect, and it is what makes the group read
as designed rather than templated. Travel is capped at 60px so the last cell never crosses body copy
in a way that reads as misalignment. `.section-title` and `.lede` above fire first, solo, no stagger:
the cells are the only sequence here. No hover, no tilt, no pointer motion — `.why` earns its
distinctiveness from the stagger alone.

### 4.6 `.curriculum` — sticky-pinned index (L233)

A sticky index column pins while the 10 `.step` elements advance past it — the Apple Watch / iPhone
blueprint pattern, in vanilla CSS. The 4 `.index-row` elements become the pinned rail:
`position: sticky; top: 50vh` in a two-column grid. Active row = the `.index-row` whose `.step` is
nearest the viewport centre, marked by a `--yellow` left-edge bar growing on `transform: scaleY()` from
0, `--sd-dur-fast`, plus `aria-current="true"` — never colour alone.

The 10 `.step` elements advance normally on the 55ms stagger (§2.2). They are **not** scrubbed: the
pin is sticky, not scroll-linked, and the scrub is confined to the index bar. The section gains pin
distance so 10 steps have room to advance against a pinned column (§5) — the second and last section
permitted to change height. **Below 900px the index column un-pins** into a plain ordered list above
the steps; sticky plus a narrow rail is unusable at that width. Reduced motion: no pin, no sticky,
no bar — a static list of all 10 steps.

### 4.7 `.format` — paired spec-row stagger (L253)

The 6 `.spec-row` elements form 3 pairs (REX reads the real DOM grouping and pairs by parent).
Each pair enters with a **paired offset**: the odd element comes from the left, the even from the
right, so the two halves meet in the middle as they arrive — odd `translateX(-18px)`, even
`translateX(18px)`, both → resting, `--sd-dur-fast`, `--sd-ease-out`, 60ms between the halves of a
pair and 120ms between pairs. Total ≈ 480ms for 6 rows — the longest stagger on the page, which is
correct: this is the most tabular section and needs the most time to become legible. `.section-title`
solo, first. No hover state — spec rows are data, not cards, and tilting data would signal
interactivity that does not exist.

### 4.8 `.camp` — card stagger + hover tilt (L270)

**Entrance.** 3 `.camp-card` elements stagger left → right, 90ms steps (the widest on the page — only
3 items, so the gaps can be generous), `translateY(24px)` → resting, `--sd-dur-base`, `--sd-ease-out`.

**Hover tilt.** Strictly behind `(hover: hover) and (pointer: fine)`. Pointer position maps to
`rotateX`/`rotateY` at max `--sd-tilt` (4deg) with a `--sd-lift` (6px) `translateY` and a shadow
step: `--sd-dur-fast` on transform, `--sd-dur-micro` on the shadow. `perspective: 900px` on the grid,
excluded from the transition so it does not re-trigger on every pointer move. Transform is written
**once per frame** from the shared rAF loop (§2.3), never from a per-card `mousemove` — three cards ×
60fps of layout-free transform writes is acceptable, three listeners is not. Tilt resets to zero with
no delay on pointer leave. Touch: no tilt, no lift; the entrance stagger still runs, since it is not
pointer-driven.

### 4.9 `.social-proof` — NO MOTION (L297)

**Ruling: no motion in this section. A spec instruction, not an omission.** The 6 `.testimonial-row`
elements are excluded from the stagger engine (§2.2) and from the rail, the parallax, and every other
effect; they render statically at full opacity, immediately. The exclusion is stated explicitly so REX
does not "helpfully" add them to the sequence.

Reason: the content is placeholder pending real testimonials. Animating slots that will be replaced
makes the craft investment invisible and guarantees the animation is rebuilt.

**When real testimonials land**, this section gets its own idea and a new subsection here: a
**quote-swap** — one quote per viewport with a clip-path line-wipe between quotes, driven by the
rail's active state, **not** by autoplay. Autoplay is excluded (unreadable at your own pace; the most
overused testimonial behaviour of 2026) and a card grid is excluded (§7). Until then: no keyframes,
no stagger, no hover, no `will-change` in this section.

### 4.10 `.faq` — animated accordion height (L386)

The FAQ toggles `hidden` on the panel today = an **instant layout jump**. That is jank, not
flourish. Fix it without breaking the existing single-open accordion logic (section 4 of `script.js`).
Measure `panel.scrollHeight` **once**, on open; animate `height: 0 → Npx`, `--sd-dur-panel`,
`--sd-ease-inout`. On close, animate to 0 then set `height: auto` **after** `transitionend`, so a
viewport resize or late font load reflows correctly. This is the **only** height animation permitted
anywhere on this page (brief §5).

**Never all panels at once** — at most **one** panel animating at any instant. Opening B while A is
still collapsing: collapse A immediately (snap, no animation), animate only B. Rapid tapping degrades
to instant toggles, never a queue of stacked transitions. A mid-animation re-toggle reads current
computed height as the new start.

`aria-expanded`, `aria-controls`, and `hidden` semantics are **preserved**: `hidden` is removed on
open and re-applied only after the collapse finishes, so AT never loses content mid-animation. Focus
and keyboard behaviour are unchanged — the button stays the only focusable element, and `hidden` on a
collapsed panel still removes it from the tab order, so removing it early would be a keyboard
regression. REX verifies tab order (target 8). Reduced motion: `hidden` toggles instantly, no
measurement, no transition.

### 4.11 `.final-cta` — marquee ticker + magnetic CTA (L463)

**Ticker.** Full-bleed band, statement repeated twice for a seamless loop, translated `-50%` by
infinite CSS keyframes named `sd-ticker`, `linear`, duration sized to track width for a constant
**~40px/s** — constant *speed*, not constant duration; that is what stops it reading as a template.
The band is `aria-hidden="true"` with the statement present once and visually hidden for screen
readers, because a repeated infinite marquee read aloud is unusable (hard requirement), and
`animation-play-state: paused` off-screen so no CPU is spent on an invisible marquee. It enters once
— `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)`, `--sd-dur-slow`, then the loop starts; reveal
and loop are separate effects with separate easings. Copy:
`[FILL: closing statement, verbatim from index.html — do not invent or reword]`. Repetition is a
layout device, not new copy.

**Magnetic CTA.** The single `.btn` pulls toward the pointer at `--sd-magnet` (0.28) of the offset
from the button centre, capped at **±14px**, `--sd-dur-fast`, `--sd-ease-magnetic`, behind
`(hover: hover) and (pointer: fine)` only. Touch gets a plain `:active` scale of 0.97. Tracking comes
from the shared rAF loop (§2.3) — one listener on the section, no per-frame `getBoundingClientRect`
on the button. `will-change: transform` only during hover; the clamp means the pointer can never drag
the button under the cursor or trap it. `.final-title` and `.lede` above: solo entrance, no
stagger — ticker and button are the two ideas here and they do not share a timing.

---

## 5. Geometry impact

**Only two sections change height.** Every other section's before/after height must match baseline
within ±1px; the image overscan in §4.3 is internal to an `overflow: hidden` band and does not move
the band's outer box.

| Section | After | Delta | Why |
|---|---|---|---|
| `.programs` ≥1280px | `Hc + 0.9 × Hviewport` | **+0.9 × viewport height** | Rail travel needs scroll distance proportional to track overflow; 0.9 is the minimum that lets the reader see the last card before release. |
| `.programs` 900–1279px | `Hc + 0.6 × Hviewport` | **+0.6 × viewport height** | Same logic, reduced: shorter viewport, less overflow to cover. |
| `.programs` <900px | `Hc` | **0** | Rail disabled (§4.4). |
| `.curriculum` ≥900px | `Hs + 0.8 × Hviewport` | **+0.8 × viewport height** | 10 steps need room to advance past a pinned index; 0.8 covers step 10 entering and clearing the rail. |
| `.curriculum` <900px | `Hs` | **0** | Pin disabled (§4.6). |
| All 9 other sections | unchanged | **0** | Geometry lock. |

`Hc` and `Hs` are the baseline heights from commit `6dc4450`; REX records the measured numbers before
and after rather than the formula. Pin distance is applied as `min-height` on the section, never as
padding that shifts the content baseline.

Under reduced motion **both deltas are 0** — the pin distance lives inside
`@media (prefers-reduced-motion: no-preference)` only.

---

## 6. Reduced-motion matrix

**Everything in this table is the reduced-motion final state.** Governing rule: no element is left
at `opacity: 0`; invisibility is permitted only where it is the element's real rest state.

| # | Effect | Normal | `reduce` |
|---|---|---|---|
| 1 | Chapter rail (§2.1) | Tracks scroll | **Hidden** (`display: none`) — pure affordance, decoration without motion. |
| 2 | Stagger engine (§2.2) | Grouped, 560ms cap | All visible at rest, opacity 1, **every `--i` delay → 0ms.** |
| 3 | Hero blobs (§4.1) | Drift 18/24/31s + parallax | `animation: none`, `transform: none`, 3 static blobs. |
| 4 | Hero word split (§4.1) | Word cascade | **Split never applied** (JS guard); heading one intact block. |
| 5 | Wipe (§4.2) | `clip-path` top-to-bottom | `clip-path: none`, opacity 1. |
| 6 | Image parallax (§4.3) | ±40px, scale 1.14 | `transform: none`, **scale 1** (no overscan gap). |
| 7 | Programs rail (§4.4) | Horizontal translate, pinned | Rail off, vertical stack, pin delta 0. |
| 8 | Why stagger (§4.5) | Differential travel | All cells visible, `translateY(0)`, delay 0. |
| 9 | Curriculum pin (§4.6) | Sticky index + bar | No sticky, no pin, no bar; static list of all 10 steps. |
| 10 | Format stagger (§4.7) | Paired L/R entry | All rows visible, `translateX(0)`, delay 0. |
| 11 | Camp entrance (§4.8) | 3-card, 90ms | All cards visible, delay 0. |
| 12 | Camp tilt (§4.8) | Pointer 4deg | **No tilt, no lift, no pointer handler.** |
| 13 | Social proof (§4.9) | Static | Static — unchanged. |
| 14 | FAQ panel (§4.10) | 340ms height, one at a time | `hidden` toggles instantly; no measurement. |
| 15 | Marquee (§4.11) | Infinite loop + reveal | **`animation: none`** — renders as a static readable line, not hidden. |
| 16 | Magnetic CTA (§4.11) | Pull 0.28 | No handler, `transform: none`, hover tint kept. |

**JS-off**, independent of the OS setting: no split words, no rail, no parallax, no scrub, no tilt,
no magnetic pull, no marquee loop.

> **EVA CORRECTION 3 — this section asked REX to investigate something I already answered. Do not
> re-investigate; the existing system is safe, and here is the proof.**
>
> The reveal IS class-toggled by JS, but it is **correctly scoped to `.js`**, so JS-off is already
> safe. `script.js:9` stamps `js` on `<html>` as early as possible. `styles.css:217` is
> `.js .reveal { opacity: 0; transform: translateY(12px); }` — the hidden state applies **only when
> that stamp exists**. Without JS the stamp is absent, no hidden state is ever set, and all 80
> elements render at full opacity by default. `script.js:28` additionally force-reveals every
> element when IntersectionObserver is unavailable.
>
> Two consequences for the build:
> 1. **Do not add a full-opacity fallback** — the one already in place is correct. Adding a second
>    would be redundant.
> 2. **New CSS must follow the same `.js` scoping discipline.** Any new hidden/rest state you
>    introduce MUST be written as `.js .<selector>` — never bare. A bare `.my-thing { opacity: 0 }`
>    in the appended block would blank the page when JS is off, which is a real regression risk.

---

## 7. Anti-patterns rejected

Every item here is currently in wide use and is banned from this page.

| Rejected | Reason |
|---|---|
| Count-up stat blocks | SaaS template; the numbers are not the story and the count delays comprehension. |
| Uniform ~80ms fade-up stagger | The exact defect being fixed (§2). One duration across 80 elements *is* the generic signal. |
| Custom cursor follower | Interaction chrome for its own sake; breaks native affordances and touch entirely. |
| "Trusted by" logo rows | Implying endorsement the school does not have; also not in the content. |
| Blob gradient backgrounds | Already cut 7 → 3 (§4.1). Three tuned blobs are a field; seven is a cliché. |
| Scroll-scrubbed WebGL hero | Out of scope per EVA; the §4.4 rail already carries the scroll-linked idea at a fraction of the cost. |
| Testimonial card grids | §4.9 has no motion, and a grid implies a set of testimonials that do not exist. |
| Centred hero + 3 feature boxes | The page is 11 distinct sections; the grid template erases the editorial nature that is the differentiator. |
| Lenis / lerp smooth-scroll | Rejected by EVA (§3a): hijacks native scroll, breaks keyboard and SR paging, and is the loudest "2021 agency template" signal there is. **The single most damaging thing that could be added here.** |
| Purple/blue SaaS gradient | Off-brand. Brand is blue `#034E9E` + yellow `#F9D024`. |
| Glassmorphism / neon glow | Off-brand, and unreadable on the brand yellow. |
| Emoji icons | Off-brand for an institutional education site. |
| Rounded-pill-everything | Pill CTAs exist as `.btn`; do not extend the treatment to nav, cards, and tags. |
| Second marquee (ochi `crawling-line`) | Same technique as the §4.11 ticker, which EVA already rejected. Do not reintroduce it in `.hero`. |
| `will-change` on settled elements | Permanent layer promotion is a memory leak, not an optimisation. Bounded and released per §2.3. |

---

## 8. Disagreements with brief

None. Two notes recorded for REX, neither a disagreement:

1. §4.2 uses `clip-path`, outside the `transform`/`opacity` rule in brief §5. Read as intended — that
   rule governs *scroll-linked* motion, and the wipe is a one-shot static entrance, paint-only and
   layout-free. Stated here so the exception is on the record.
2. §4.4 and §4.6 disable the rail and the pin below 900px. EVA's ruling named no breakpoint; a
   mobile tax on the centrepiece would be a regression, so one is specified. Both effects run on
   tablet and desktop.

---

## Verification targets for REX

Measurable assertions. Each is pass/fail.

| # | Target | Assertion |
|---|---|---|
| 1 | File discipline | `git diff --name-only` vs `6dc4450` lists only `styles.css`, `script.js`, this file. |
| 2 | Cascade order | MOTION v1 marker is the last ruleset in `styles.css`, after the image tier block; no motion rule above it. |
| 3 | No-op guard | JS off: all 11 sections render all text. Diff vs reduced-motion render → **0 differing text nodes.** |
| 4 | Reduced motion | **0** elements at `opacity: 0`, 0 at `clip-path: inset(0 0 100% 0)`. The 3 pre-existing blocks unmodified. |
| 5 | Hero blobs | `@keyframes` 7 → 3; `sd-blob-a/b/c` distinct (18s/24s/31s, `alternate`); `sd-blob-d…g` absent. |
| 6 | Stagger is real | In `.step` (10), `.why-cell` (6), `.spec-row` (6), `.index-row` (4), `.camp-card` (3): `animation-delay` non-decreasing in DOM order, spread = step × (n−1) per §2.2. Max delay ≤ 560ms. |
| 7 | Property discipline | No animated `top`/`left`/`width`/`box-shadow`/`margin`. `height` appears **only** on the FAQ panel selector. |
| 8 | FAQ | Peak simultaneous animations = **1** when 3 panels are clicked in 400ms. `aria-expanded` and `hidden` correct at rest. Tab order hits every trigger, no collapsed panel content. |
| 9 | Pins | `.programs` delta matches §5 (+0.9 / +0.6 / 0); `.curriculum` (+0.8 / 0); **the other 9 sections within ±1px.** Both deltas 0 under reduced motion. |
| 10 | Rail off on mobile | At 375px and 414px: `.programs` is a vertical stack, track `transform: none`, no pin distance. |
| 11 | Single rAF loop | `grep -c 'requestAnimationFrame' script.js` = **1**; one passive scroll listener; zero `mousemove` listeners. |
| 12 | will-change budget | ≤ **6** at any settled moment; **0** on settled elements at idle; released when a section leaves the viewport. |
| 13 | Touch safety | At `(pointer: coarse)`: no tilt, no lift, no magnetic pull. `.camp-card` computed `transform` is `none`. |
| 14 | Ticker a11y | Band is `aria-hidden="true"`; statement appears **exactly once** in the AX tree. |
| 15 | Pointer trap | Magnetic translate never exceeds ±14px and never equals the raw pointer offset; hit area stays in original bounds. |
| 16 | No regressions | FAQ single-open, hamburger, sticky nav `.is-scrolled`, blob field, existing `.reveal`, image tier block all behave as at `6dc4450`. Footer year correct. |
| 17 | No invented content | Every `[FILL: ...]` replaced with verbatim `index.html` strings; `git diff` on `index.html` shows no new copy. |
