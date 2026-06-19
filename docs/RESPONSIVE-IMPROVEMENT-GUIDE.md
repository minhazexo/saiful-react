# Mobile & Tablet Optimization Guide

> Deep-dive analysis focused solely on improving the experience for non-desktop devices. PC view stays untouched.

---

## Table of Contents

1. [Breakpoint Strategy](#1-breakpoint-strategy)
2. [MobileCarousel — Perfect Placement & Smoothness](#2-mobilecarousel--perfect-placement--smoothness)
3. [Image & Media on Mobile](#3-image--media-on-mobile)
4. [Typography & Spacing on Small Screens](#4-typography--spacing-on-small-screens)
5. [Touch Targets & Accessibility](#5-touch-targets--accessibility)
6. [Animation on Mobile](#6-animation-on-mobile)
7. [Navigation & Menu](#7-navigation--menu)
8. [Admin Panel on Mobile](#8-admin-panel-on-mobile)
9. [Mobile Performance & Layout Stability](#9-mobile-performance--layout-stability)
10. [Implementation Checklist](#10-implementation-checklist)

---

## 1. Breakpoint Strategy

### Current Breakpoints (Keep as-is for PC)

The project uses **4 standard breakpoints** across 20+ responsive CSS files — all `max-width` so PC is unaffected:

| Name | Width | Trigger |
|------|-------|---------|
| Tablet landscape | `1024px` | Grid 3→2 cols, hero stacks, nav collapses |
| Tablet portrait | `768px` | All grids → 1fr, mobile carousel activates |
| Phone | `480px` | Minimal padding, iOS zoom fix, tighter spacing |
| Small phone | `375px` | Absolute minimum sizes |

**12 non-standard breakpoints** are scattered across files — all `max-width`, so PC is untouched:

| Current | Replace With | Reason |
|---------|-------------|--------|
| `1400px`, `1300px`, `1280px`, `1200px` home pills | `1200px` or `1024px` | Consolidate tablet-landscape pill positioning |
| `1150px` featured package | `1024px` | Fold into grid collapse point |
| `1100px` nav trigger | `1024px` | iPad Pro 1024px shouldn't get mobile menu; PC unchanged |
| `992px`, `576px` client-results | `1024px`, `768px`, `480px` | Use standard tablet/phone breakpoints |
| `600px` consent banner | `480px` | Merge into phone breakpoint |
| `400px` carousel arrows | `375px` | Standardize to small phone breakpoint |

### Rule

> **Every single responsive override is wrapped in `@media (max-width: ...)` — PC view inherits only the base CSS and is never altered.**

---

## 2. MobileCarousel — Perfect Placement & Smoothness

### Current Mobile Behavior

- Activates at `≤768px` for any wrapped grid
- Spring slide animation (`stiffness: 320, damping: 30`)
- Drag/swipe threshold: 60px
- Arrows: 40px → 34px at 400px

### Mobile Issues

1. **`!important` overuse** — 11+ declarations at `≤768px` overriding parent grids
2. **Touch target violation on phones** — arrows 34×34px at 400px (WCAG: 44×44px)
3. **No edge swipe prevention** — drag may scroll the page
4. **Sparse look with 1–2 items** — carousel activates but has nothing to scroll
5. **Arrow overlap** — fixed `±8px` from edges clips content on narrow screens

### Mobile-Only Fixes (PC unchanged)

#### A. Remove `!important` — use parent-scoped selectors inside `@media`

```css
/* Instead of: .packages-grid { display: flex !important; } */
@media (max-width: 768px) {
  .mobile-carousel-wrapper.packages-grid {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
  }
}
```

#### B. Fix Arrow Touch Targets at Small Breakpoints

```css
/* PC: arrows stay 40px — unchanged */
.carousel-arrow {
  width: 40px;
  height: 40px;
}

@media (max-width: 480px) {
  .carousel-arrow {
    width: 44px;        /* WCAG minimum for touch */
    height: 44px;
  }
}

@media (max-width: 375px) {
  .carousel-arrow {
    width: 40px;        /* Balanced for very small screens */
    height: 40px;
  }
}
```

#### C. Prevent Page Scroll While Swiping (mobile only)

```jsx
// Already done — keep touchAction: 'pan-y' on mobile wrapper
// PC: no effect since drag is only enabled on mobile
```

#### D. Smart 2-Per-Slide on Phones (4+ items)

```jsx
// MobileCarousel.jsx — inside the mobile branch, PC never enters this code
const itemsPerSlide = total >= 4 && window.innerWidth <= 480 ? 2 : 1;
const totalSlides = Math.ceil(total / itemsPerSlide);
```

#### E. Better Dot Spacing & Active Pill on Mobile

```css
@media (max-width: 768px) {
  .carousel-dots {
    padding-top: 16px;
    gap: 6px;
  }

  .carousel-dot.active {
    width: 26px;
    border-radius: 4px;
  }
}
```

#### F. Smooth Arrow Animation (mobile hover = tap feedback)

```css
@media (max-width: 768px) {
  .carousel-arrow:active {
    transform: scale(0.92);
  }
}
```

---

## 3. Image & Media on Mobile

### Mobile Issues

- Fixed pixel heights on blog images, journey cards, hero portrait — no `aspect-ratio`
- No lazy loading on below-fold images
- No `srcset` for smaller viewports

### Mobile-Only Fixes (PC unchanged)

#### A. Add `aspect-ratio` Inside `@media` to Prevent Layout Shift

```css
/* PC keeps existing fixed heights — no change */

@media (max-width: 768px) {
  .hero-portrait {
    aspect-ratio: 1 / 1;
    max-width: min(300px, 60vw);
  }

  .journey-image-wrapper {
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  .blog-card-image {
    aspect-ratio: 16 / 10;
    overflow: hidden;
  }
}

@media (max-width: 768px) {
  [class*="image"] img,
  [class*="card"] img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
```

#### B. Lazy Load Below-Fold Images (mobile data saver)

```jsx
// PC already has loading="lazy" — this helps mobile more
<img loading="lazy" decoding="async" ... />
```

---

## 4. Typography & Spacing on Small Screens

### Mobile Issues

- **8px font sizes** on service pills and phase badges at 375px (fails WCAG)
- **No responsive line-height** adjustment
- **Tight spacing** makes tap targets overlap

### Mobile-Only Fixes (PC unchanged)

#### A. Minimum 11px Font Size at Small Breakpoints

```css
@media (max-width: 480px) {
  .service-pill,
  .framework-phase-number,
  .eyebrow {
    font-size: 11px;
    letter-spacing: 0.5px;
  }

  .framework-card p,
  .service-card p,
  .blog-card p {
    font-size: 12px;
  }
}
```

#### B. Better Line Height for Readability

```css
@media (max-width: 480px) {
  p, li, .description {
    line-height: 1.65;    /* Looser for small screen reading */
  }

  h1, h2, h3 {
    line-height: 1.2;
  }
}
```

#### C. Tighter Section Spacing (already done well)

Current: `--section-pad: 100px → 70px → 50px → 40px → 32px`

This is good — PC stays at 100px. Ensure all pages use the variable.

---

## 5. Touch Targets & Accessibility

### Mobile Issues (PC has cursor — no issue)

| Element | Size at 375px | WCAG Pass? |
|---------|--------------|-----------|
| Carousel arrows | 34×34px | ❌ |
| Language switcher buttons | ~30px | ❌ |
| Nav links | ~42px min-height | ❌ at 375px |
| FAQ icon | 28×28px at 480px | ❌ |

### Mobile-Only Fixes (PC unchanged)

```css
@media (max-width: 480px) {
  button,
  a.nav-link,
  [role="button"],
  .carousel-arrow,
  .faq-toggle,
  .lang-btn {
    min-height: 44px;
    min-width: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .lang-btn {
    padding: 10px 8px;
  }

  .faq-icon {
    width: 44px;
    height: 44px;
  }

  .carousel-arrow {
    width: 44px;
    height: 44px;
  }
}
```

#### Better Contrast on Mobile Screens

```css
@media (max-width: 768px) {
  .framework-card p,
  .ai-card p,
  .service-card p {
    color: rgba(255, 255, 255, 0.7);    /* was 0.55 — easier to read outdoors */
  }
}
```

---

## 6. Animation on Mobile

### Mobile Issues

- Heavy parallax/float animations cause jank on lower-end phones
- Entry animations with large `y` offsets feel slow
- Stagger delays stack up on slow devices

### Mobile-Only Fixes (PC animations untouched)

#### A. Disable Heavy Animations on Mobile

```css
@media (max-width: 768px) {
  .hero-portrait,
  .floating-pill,
  [class*="animated"] {
    animation: none;
    transform: none;
  }
}
```

#### B. Reduce Stagger Delay for Faster Feel

```jsx
// In components — only affects mobile branch
const isMobile = window.innerWidth <= 768;
const staggerDelay = isMobile ? 0.05 : 0.1;  // PC unchanged at 0.1
```

#### C. Respect `prefers-reduced-motion` (already done)

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}
```

---

## 7. Navigation & Menu

### Mobile Issues

- Mobile menu triggers at **1100px** — should be 1024px (PC range 1025+ is unaffected)
- No scroll-lock on body when mobile nav is open
- Language switcher buttons too small on phones

### Mobile-Only Fixes (PC nav unchanged)

#### A. Change Trigger to 1024px

```css
/* PC: nav stays horizontal for all widths > 1024px */
@media (max-width: 1024px) {
  .nav-menu {
    /* Mobile drawer styles — already exists, just move from 1100px → 1024px */
  }
}
```

#### B. Add Body Scroll-Lock (mobile only)

```jsx
useEffect(() => {
  if (!isMenuOpen) return;
  document.body.style.overflow = 'hidden';
  document.body.style.touchAction = 'none';
  return () => {
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  };
}, [isMenuOpen]);
```

#### C. Full Touch Targets on Phone

```css
@media (max-width: 480px) {
  .nav-link {
    min-height: 48px;
    padding-block: 12px;
    display: flex;
    align-items: center;
  }
}
```

---

## 8. Admin Panel on Mobile

### Mobile Issues

- `CaseStudiesManagement` and `ContactsManagement` missing 1024px and 375px breakpoints
- AdminDashboard stat cards don't stack at 375px
- Tables overflow without horizontal scroll

### Mobile-Only Fixes (PC admin untouched)

```css
@media (max-width: 1024px) {
  .admin-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .admin-table {
    min-width: 700px;
  }
}

@media (max-width: 375px) {
  .admin-stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .admin-card {
    padding: 16px;
  }

  .admin-card h3 {
    font-size: 14px;
  }
}
```

---

## 9. Mobile Performance & Layout Stability

### Cumulative Layout Shift (CLS) on Mobile

1. **Add `aspect-ratio` inside `@media`** (see Section 3)
2. **Set `width` + `height` on images** — browser reserves space before load:

```jsx
<img
  width={300}
  height={300}
  style={{ maxWidth: '100%', height: 'auto' }}
  loading="lazy"
/>
```

3. **Use `content-visibility` for below-fold sections** — helps mobile paint faster:

```css
@media (max-width: 768px) {
  .framework-section,
  .packages-section,
  .testimonials-section {
    content-visibility: auto;
    contain-intrinsic-size: 600px;
  }
}
```

### Reduce `!important` in Mobile-Only Blocks

Replace:

```css
/* Bad — affects cascade */
.framework-section .framework-card { animation: none !important; }
```

With:

```css
/* Good — scoped to mobile @media */
@media (max-width: 768px) {
  .framework-card {
    animation: none;
  }
}
```

---

## 10. Implementation Checklist

### High Priority (Mobile Bugs)

- [ ] Fix `content:` missing value in `.framework-section::before` — dead on all devices
- [ ] Remove dead selectors: `about-image-initial`, `blog-filters` (clutter, not PC-related)
- [ ] Move blog CSS from `CaseStudiesPage.responsive.css` to `BlogPage.responsive.css`
- [ ] Add missing 1024px & 375px breakpoint rules to admin table pages
- [ ] Increase service pills / phase badges to min **11px** at `≤480px`
- [ ] Increase carousel arrows to min **40×40px** at `≤375px`

### Medium Priority (Mobile Polish)

- [ ] Change nav mobile trigger from 1100px → **1024px** (PC unaffected)
- [ ] Add body scroll-lock when mobile nav opens
- [ ] Add `aspect-ratio` to image containers inside `@media (max-width: 768px)`
- [ ] Replace `!important` overrides with specific selectors in MobileCarousel
- [ ] Merge `600px` consent banner breakpoint into `480px`
- [ ] Reduce font color opacity from 0.55 → 0.7 for body text on dark sections (mobile readability)

### Low Priority (Nice-to-Have on Mobile)

- [ ] Add `content-visibility: auto` to below-fold sections at `≤768px`
- [ ] Add smart 2-per-slide carousel display at `≤480px`
- [ ] Add `loading="lazy"` + `decoding="async"` to all below-fold images
- [ ] Define breakpoint variables in `:root` as documentation

---

## Principle

> **Every change in this guide is wrapped in `@media (max-width: ...)`. The desktop/PC view inherits only the base CSS files and is never modified.**

### File Structure (only `*.responsive.css` files affect mobile)

```
style.css                → PC base (unchanged)
style.responsive.css     → 1024px, 768px, 480px, 375px overrides
  │
  ├── PageName.css           → PC base (unchanged)
  ├── PageName.responsive.css → Mobile/tablet overrides
  │
  ├── ComponentName.css        → PC base (unchanged)
  └── ComponentName.responsive.css → Mobile/tablet overrides
```
