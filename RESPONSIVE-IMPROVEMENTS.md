# Responsive & UX Improvement Plan

_Last updated: 2026-06-21_

This document records (1) what was changed in the **Hero Visual** section, and (2) a
detailed, prioritized roadmap for making the **whole site** more responsive,
professional, and user-friendly.

It is written to be actionable: every item names the real file, the problem, and the
concrete fix.

---

## Part 1 — What was already fixed: the Hero Visual

**File:** `src/pages/Home/HomePage.css`
**Section:** `.hero-visual` → `.hero-visual-inner` → `.hero-photo-wrap` + `.hero-notif-card`

### Problems that existed

1. **Card clipping bug.** The floating testimonial card (`.hero-notif-card`) was
   positioned with a fixed negative offset (`right: -100px` on desktop, `right: -10/-8/-6px`
   on smaller screens). Because `.hero-section` has `overflow: hidden`, on mid-size
   desktops (≈1025–1300px) the card bled past the section edge and got **cut off**.
2. **Unbalanced mobile layout.** On phones the photo was shoved left
   (`align-items: flex-start; padding-left: 20px`) just to make room for the card. This
   looked lopsided and risked horizontal overflow.
3. **Duplicated cascade.** The *entire* responsive block set (1400 / 1200 / 1280 / 1024 /
   768 / 480 / 375) appears **twice** in the file. The second copy silently wins, so edits
   to the first copy had no effect — a maintenance trap.
4. **Dead code.** Rules for an old hero design (`.hero-portrait`, `.hero-portrait-wrapper`,
   `.hero-portrait-circle`, `.service-pill`, `.pill-*`) are still present but **no longer
   exist in the JSX** (`HomePage.jsx` uses `.hero-photo-wrap` + `.hero-notif-card`).

### The new model (robust at every width)

Two distinct behaviors, because what works on desktop fails on a small photo:

- **Desktop (> 1024px):** the inner box **tracks the photo width**, the photo fills it
  100%, and the card is **anchored to the photo's top-right corner** (transparent empty
  space in the cutout, so it never covers the face) with a **bounded** overhang via
  `clamp()` — no clipping at any width.
- **Tablet / mobile (≤ 1024px):** the card does **not** overlap. On a small centered photo
  a proportionally-large card covered the man's face and the tall `min-height` left a big
  empty gap above the photo. So on stacked layouts the card drops into **normal flow,
  centered just below the photo** (`position: relative`, slight `-24px` tuck for a
  connected look), and `min-height` is removed. Clean and impossible to overflow.

- Removed the `flex-start` + `padding-left` shift on mobile (caused the lopsided look).
- Removed the dead `.hero-portrait*` / `.service-pill` rules **from the blocks that were
  rewritten** (more remain elsewhere — see Part 2, item 1).
- Verified visually with Playwright screenshots at 1440 / 1280 / 1024 / 768 / 480 / 375 /
  360 px.

Verified with `vite build` (passes, no errors).

### How to test it

Open the home page and resize from 1920 → 320px (Chrome DevTools device toolbar). Check:
- 1920 / 1440 / 1280 / 1024 / 768 / 480 / 375 / 360 / 320.
- The card stays fully on-screen and over the transparent top-right of the photo.
- No horizontal scrollbar appears at any width.

---

## Part 2 — Site-wide roadmap

Ordered roughly by impact-to-effort. ✅ = quick win, 🔶 = medium, 🔴 = larger refactor.

### 1. 🔴 De-duplicate and clean `HomePage.css`

This is the **single highest-value** change. Every other page follows a clean convention:
`PageName.css` (base) + `PageName.responsive.css` (media queries). **HomePage is the only
page that breaks it** — all 5700 lines, including duplicated media queries, live in one file.

**Action:**
- Delete the **dead** selectors entirely: `.hero-portrait`, `.hero-portrait-wrapper`,
  `.hero-portrait-circle`, `.service-pill`, `.pill-independent/logo/ecommerce/backend/
  seller-left/social/facebook/seller-right`. Confirm with a project-wide search that they
  appear in **no** `.jsx` file before deleting.
- Remove the **duplicated** media-query set. The breakpoints `@media (min-width:1025px) and
  (max-width:1400px)`, `…1200px`, `…1280px`, `@media (max-width:1024px)`, `768px`, `480px`,
  `375px` each appear twice; keep one copy of each.
- Extract all `@media` rules into a new `src/pages/Home/HomePage.responsive.css` and import
  it where `HomePage.css` is imported, matching the rest of the codebase.

**Why:** the file is unmaintainable today — an edit can land in the losing copy and appear
to "do nothing." After cleanup it should drop by an estimated 1500–2000 lines.

### 2. ✅ Standardize the breakpoint set

The codebase mixes breakpoints: `375, 480, 576, 768, 992, 1024, 1200, 1280, 1400`. Pick a
canonical ladder and use it everywhere:

```
--bp-xs: 375px   /* small phone   */
--bp-sm: 480px   /* phone         */
--bp-md: 768px   /* tablet portrait */
--bp-lg: 1024px  /* tablet landscape */
--bp-xl: 1280px  /* small desktop */
```

Document it at the top of `src/style.css`. Consistency removes "works at 600 but breaks at
620" gaps.

### 3. ✅ Add a global overflow & tap-target safety net

In `src/style.css` (already has `overflow-x: hidden` on body — good):
- Add `img, video, svg { max-width: 100%; }` as a baseline so no media can ever force
  horizontal scroll.
- Ensure all interactive controls (buttons, nav links, icon buttons) are **≥44×44px** on
  touch — Apple/Google accessibility minimum. Audit `.hero-feature`, footer links,
  `LanguageSwitcher`, and social icons.
- Honor reduced motion: wrap heavy animations in
  `@media (prefers-reduced-motion: reduce) { *{animation:none!important; transition:none!important;} }`.
  Several marquees (`.stats-marquee`, `.testimonial-marquee`, `.trust-marquee`) and the
  floating `y` loops run infinitely and should pause for users who opt out.

### 3b. ✅ Fix the `.comparison-heroes` overflow at ~1024px

Confirmed bug (Playwright): at 1024px the before/after image grid in `.problems-section`
breaks ~10px past the container on each side (`.hero-card-before` left ≈ −10,
`.hero-card-after` right ≈ 1034). It's currently **invisible** to users because
`body { overflow-x: hidden }` clips it, but it's real. Fix: ensure `.comparison-heroes`
respects `.container` padding (give the grid `min-width: 0` / `max-width: 100%`, and add
`min-width: 0` to the grid items so the images can shrink below intrinsic size). Note: the
cutout PNG (`Entreprenure-cutout.png`) also has transparent padding at the top, which reads
as extra space above the hero photo on mobile — re-export it tightly cropped to remove it.

### 4. 🔶 Fluid typography with `clamp()` everywhere

Many headings already use `clamp()` (good). But body copy, paddings, and section gaps
often jump at breakpoints. Convert the big section rhythm to fluid values:
- `--section-pad`, `--container-pad` → `clamp()` so spacing scales smoothly instead of
  snapping at 768/480.
- Audit `.hero-description`, `.problems-subtitle`, `.founder-bio` for fixed `px` that feel
  large on phones.

### 5. 🔶 Verify the Bangla (bn) layout at every breakpoint

The site is bilingual (`src/locales/en.json`, `bn.json`) with `html[data-lang='bn']`
overrides. Bangla strings are typically **longer/taller**. Test each breakpoint in **both**
languages — especially:
- Buttons that may wrap to 2 lines (`.hero-btn`, `.btn-journey`, package CTAs).
- Card headings with `text-wrap: balance` (`.case-card h3`).
- The hero badge and `.hero-subtitle-line`.

### 6. 🔶 Images: serve responsive sizes & correct loading

- The hero cutout (`Entreprenure-cutout.png`) and founder image are large PNGs. Provide
  `WebP`/`AVIF` and use `<img srcset>`/`sizes` (or `<picture>`) to cut mobile payload.
- `Stage` images on the home page point to **external Unsplash URLs**
  (`STAGE_IMAGES` in `HomePage.jsx`) — these add a third-party dependency and latency.
  Self-host them.
- Add explicit `width`/`height` (or `aspect-ratio`) to all `<img>` to prevent layout shift
  (CLS). `loading="lazy"` is already used in most places — keep it for below-the-fold only,
  and **not** on the hero image (it is above the fold).

### 7. 🔶 Navigation on mobile

`Navigation.jsx` / `Navigation.responsive.css` were recently edited. Re-check:
- The mobile menu open/close has a visible focus state and is keyboard-operable (Esc to
  close, focus trap while open).
- The new logo (`public/images/nav logo.png`) is constrained by `max-height` and doesn't
  overflow the bar on small screens.
- Sticky-header height matches `--nav-h` so `.home-page { padding-top: var(--nav-h) }`
  never leaves a gap or overlaps content.

### 8. ✅ Marquee usability on touch

`.stats-marquee`, `.testimonial-marquee`, and the mobile `.trust-marquee` auto-scroll and
pause on `:hover` — but `:hover` doesn't exist on touch. Consider:
- A slower duration on small screens (some already set `animation-duration: 30s`).
- Letting users swipe (the `MobileCarousel` component already exists — reuse it for these).

### 9. 🔶 Forms (lead magnet + contact)

`.lead-form-card` and `ContactPage`:
- Inputs are `height: 56px` (good for touch). Ensure `font-size ≥ 16px` on inputs so iOS
  Safari does not auto-zoom on focus.
- Add visible validation/error states and `aria-live` for submit status (partially present
  via `.lead-success` / `.lead-error`).
- Test the two-column `.lead-grid` collapse on tablet — confirm the form card doesn't get
  squeezed below comfortable width.

### 10. ✅ Cross-device QA checklist

Before shipping, walk this matrix in DevTools + at least one real phone:

| Width | Device class        | Check |
|-------|---------------------|-------|
| 320   | iPhone SE (old)     | no overflow, text legible, card on-screen |
| 375   | iPhone SE/12 mini   | hero, packages, cases |
| 414   | large phone         | spacing rhythm |
| 768   | iPad portrait       | grid → 1 col transitions |
| 1024  | iPad landscape      | 2-col vs 1-col boundary |
| 1280  | laptop              | hero card overhang safe |
| 1440+ | desktop             | max-width container centering |

For each: test **EN + BN**, light interactions (hover where applicable, tap targets),
and run Lighthouse (mobile) targeting Performance ≥ 90, Accessibility ≥ 95, CLS ≈ 0.

---

## Quick reference — files touched / to touch

| Area | File |
|------|------|
| Hero visual (done) | `src/pages/Home/HomePage.css` |
| Home de-dup (item 1) | `src/pages/Home/HomePage.css` → split into `HomePage.responsive.css` |
| Global tokens/safety (items 2,3,4) | `src/style.css` |
| i18n layout (item 5) | `src/locales/en.json`, `src/locales/bn.json` + page CSS |
| Nav (item 7) | `src/components/Navigation/Navigation*.css`, `Navigation.jsx` |
| Forms (item 9) | `HomePage.jsx` (lead magnet), `src/pages/Contact/*` |
