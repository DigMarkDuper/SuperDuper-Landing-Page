# Super Duper Language Center — Landing Page

Modern, premium, conversion-focused landing page for **Super Duper Language Center** — intensive English learning in Yogyakarta, part of the Duta Persada ecosystem.

**Live:** https://DigMarkDuper.github.io/SuperDuper-Landing-Page/ *(once Pages is enabled)*

## Stack
Single-file static site (no build step): `index.html` + `styles.css` + `script.js` + `assets/`.

- **Fonts:** Poppins (display) + Inter (body), bundled via `@font-face`
- **Brand system:** blue `#034E9E`, yellow `#F9D024`, white, gray `#D1D5DB` (Super Duper Visual Brand Guidelines 2026)
- **Assets:** official final artwork from `E:\1. Working\2. Super Duper\FINAL ARTWORK` (supergraphics, brand marks, camp photography) — the project's `assets/` is the served subset
- **Motion:** IntersectionObserver scroll-reveal, hover states, subtle hero float; honors `prefers-reduced-motion`

## Sections
Nav · Hero · Value proposition · Learning experience · Programs (2) · Why Super Duper (6) · Curriculum (10-step journey) · Program format · English Camp & Community · Social proof (fillable slots) · FAQ (accordion) · Final CTA · Footer

## Run locally
```
python -m http.server 8765
# http://localhost:8765
```

## Status / TBD (awaiting owner confirmation — nothing fabricated)
- **Program names:** cards display working titles *Intensive Executive English* / *English Camp · Asrama* — confirm real names
- **Contact / phone / socials:** footer contact = TBD
- **Pricing & schedule details:** intentionally not invented (routes to `DAFTAR SEKARANG`)
- **Testimonials:** empty placeholder slots — content to be added by the team

Built via EVA-led specialist loop (NEO design → REX build → NEO review → REX fix). © 2026 Super Duper Language Center · Duta Persada ecosystem