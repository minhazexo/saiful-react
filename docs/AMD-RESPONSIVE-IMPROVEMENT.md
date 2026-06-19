# AMD — Responsive Improvement: Mobile & Tablet

> **Analysis · Map · Design** — Deep-dive into the full codebase to achieve a professional-level mobile and tablet experience. PC view remains untouched.

---

## Table of Contents

1. [Analysis — Current State](#1-analysis--current-state)
2. [Map — Gap Inventory](#2-map--gap-inventory)
3. [Design — Solution Blueprint](#3-design--solution-blueprint)
   - [A. Carousel Placement Strategy](#a-carousel-placement-strategy)
   - [B. MobileCarousel Enhancement](#b-mobilecarousel-enhancement)
   - [C. Touch & Typography Hardening](#c-touch--typography-hardening)
   - [D. Layout & Spacing System](#d-layout--spacing-system)
   - [E. Image & Performance](#e-image--performance)
   - [F. Navigation & Footer](#f-navigation--footer)
   - [G. Admin Panel](#g-admin-panel)
   - [H. Missing Responsive Files](#h-missing-responsive-files)
4. [Priority Execution Plan](#4-priority-execution-plan)

---

## 1. Analysis — Current State

### Codebase Overview

| Metric | Value |
|--------|-------|
| Pages | 13 (Home, About, Service, Contact, Blog, BlogDetail, Academy, AI, CaseStudies, Growth, Setup, Roadmap, NotFound) |
| Admin sections | 7 (Dashboard, Login, Blog, Cases, Contacts, Password, Users) |
| Components | 12 (Navigation, Footer, FAQ, MobileCarousel, ConsentBanner, LanguageSwitcher, etc.) |
| Responsive CSS files | 20 `*.responsive.css` files |
| Breakpoints used | 1400px, 1300px, 1280px, 1200px, 1150px, 1100px, 1024px, 768px, 600px, 480px, 375px |
| Standardized breakpoints | 1024px, 768px, 480px, 375px (in `style.responsive.css`) |
| Carousel component | `MobileCarousel` — activates at ≤768px, wraps grid children as swipeable slides |

### Responsive Architecture

The project uses a **progressive enhancement** approach:
- **Base CSS** (`*.css`): Desktop-first styles, no media queries
- **Responsive CSS** (`*.responsive.css`): All overrides wrapped in `@media (max-width: ...)` — PC is never altered

This architecture is correct and should be preserved.

### Current Carousel Usage

| Page | Sections Using MobileCarousel | Items per section |
|------|------------------------------|-------------------|
| Home | Journey cards, Packages, Client results, AI tools, Workflow, Testimonials | 3–8 items each |
| About | Values (6), Timeline (6) | 6 each |
| Blog | Blog post cards (dynamic) | Dynamic |
| CaseStudies | Case detail cards (dynamic) | Dynamic |
| Academy | Module cards (8) | 8 |
| AI | AI tools (4), Workflow (5) | 4–5 |
| Growth | Service cards (4) | 4 |
| Setup | Service cards (4), Process steps (4) | 4 each |

**Sections NOT using MobileCarousel that should:**
- `cases-section` on HomePage (3 case study cards — grid without carousel)
- `trust-section` on HomePage (4 stat counters — could be horizontally scrollable)

**Pages missing responsive CSS:**
- `BlogDetail` (no CSS files at all)
- `Growth` (uses shared `ServicePage` CSS)
- `Setup` (uses shared `ServicePage` CSS)
- `Roadmap` (inline responsive in `RoadmapPage.css`)

---

## 2. Map — Gap Inventory

### Critical Issues

| # | Issue | Location | Severity |
|---|-------|----------|----------|
| C1 | `font-size: 8px` on service pills at 375px | `HomePage.responsive.css:867` | **HIGH** — illegible |
| C2 | `font-size: 9px` on framework phase numbers at 768px | `HomePage.responsive.css:327` | **HIGH** — illegible |
| C3 | `font-size: 9px` on framework phase numbers at 480px | `HomePage.responsive.css:632` | **HIGH** — illegible |
| C4 | `font-size: 10px` on service pills at 768px | `HomePage.responsive.css:276` | **HIGH** — illegible |
| C5 | No 375px breakpoint in AdminDashboard | `AdminDashboard.responsive.css` | **HIGH** — tiny-screen layout breaks |
| C6 | No responsive CSS at all for BlogDetail | `src/pages/BlogDetail/` | **HIGH** — mobile layout unstyled |
| C7 | Nav mobile trigger at 1100px (should be 1024px) | `Navigation.responsive.css` | **HIGH** — iPad Pro gets wrong menu |
| C8 | Social icons 28×28px at 375px in Footer | `Footer.responsive.css` | **HIGH** — fails WCAG touch target |

### Medium Issues

| # | Issue | Location | Severity |
|---|-------|----------|----------|
| M1 | No body scroll-lock when mobile nav open | `Navigation.jsx` | MEDIUM |
| M2 | Carousel arrows at 375px: 40×40px (WCAG min 44×44px) | `MobileCarousel.css:77` | MEDIUM |
| M3 | CaseStudies grid at 1024px missing overflow-x | `CaseStudiesManagement.responsive.css` | MEDIUM |
| M4 | Contacts grid at 1024px missing overflow-x | `ContactsManagement.responsive.css` | MEDIUM |
| M5 | Footer grid jumps 2-col→1-col at 768px (no intermediate) | `Footer.responsive.css` | MEDIUM |
| M6 | No `aspect-ratio` on About page image | `AboutPage.css` | MEDIUM |
| M7 | Hero `h1` sizes inconsistent across pages | Multiple files | MEDIUM |
| M8 | Mobile menu items < 44px touch target at 375px | `Navigation.responsive.css` | MEDIUM |
| M9 | FAQ icon 28×28px at 480px (WCAG fail) | `FAQ.responsive.css` | MEDIUM |
| M10 | No 375px breakpoint for Contact form hero | `ContactPage.responsive.css` | MEDIUM |

### Low Issues

| # | Issue | Location | Severity |
|---|-------|----------|----------|
| L1 | Content-visibility not set for all below-fold sections | `style.responsive.css` | LOW |
| L2 | No `prefers-reduced-motion` check on carousel animations | `MobileCarousel.jsx` | LOW |
| L3 | No `srcset` or `sizes` for responsive images | Multiple files | LOW |
| L4 | Cases-section (Home) not using MobileCarousel | `HomePage.jsx` | LOW |
| L5 | Trust-section (Home) single-column stack on mobile | `HomePage.responsive.css` | LOW |

---

## 3. Design — Solution Blueprint

### A. Carousel Placement Strategy

#### A1 — Add MobileCarousel to `cases-section` on HomePage

**File**: `src/pages/Home/HomePage.jsx` (around line 500–530)

The case studies section on the homepage shows 3 cards in a grid. On mobile, these stack vertically, wasting space. Wrapping in `MobileCarousel` allows swipeable browsing.

```jsx
// Before:
<section className="section cases-section">
  <div className="container">
    <MotionFadeUp className="section-head">...</MotionFadeUp>
    <div className="cases-grid">
      {cases.map(...)}
    </div>
  </div>
</section>

// After:
<section className="section cases-section">
  <div className="container">
    <MotionFadeUp className="section-head">...</MotionFadeUp>
    <MobileCarousel className="cases-grid" showDots={false}>
      {cases.map(...)}
    </MobileCarousel>
  </div>
</section>
```

#### A2 — Make `trust-section` horizontally scrollable on mobile

**File**: `src/pages/Home/HomePage.responsive.css` (around line 288–291)

The trust section (4 stat counters) collapses to 2×2 at 768px. At 480px, these are still 2-across but cramped. A horizontal scroll with snap points feels more premium:

```css
@media (max-width: 480px) {
  .trust-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 12px;
    padding-bottom: 8px;
    -webkit-overflow-scrolling: touch;
  }

  .trust-grid > * {
    scroll-snap-align: start;
    flex: 0 0 45%;
    min-width: 140px;
  }

  /* Hide scrollbar but keep functionality */
  .trust-grid::-webkit-scrollbar { display: none; }
  .trust-grid { -ms-overflow-style: none; scrollbar-width: none; }
}
```

#### A3 — Keep all existing MobileCarousel usages, no removals needed

All 14 current MobileCarousel usages are appropriate. The component activates only at ≤768px so desktop grids are untouched.

---

### B. MobileCarousel Enhancement

#### B1 — Smart multi-item slides (2-per-slide on phones)

**File**: `src/components/MobileCarousel/MobileCarousel.jsx`

When there are 4+ items on ≤480px screens, show 2 items per slide for denser content consumption:

```jsx
// Inside the mobile branch (after line 95):
const [itemsPerSlide, setItemsPerSlide] = useState(1);

useEffect(() => {
  const check = () => {
    setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    if (window.innerWidth <= 480 && total >= 4) {
      setItemsPerSlide(2);
    } else {
      setItemsPerSlide(1);
    }
  };
  check();
  window.addEventListener('resize', check);
  return () => window.removeEventListener('resize', check);
}, [total]);

// Then group items for rendering:
const slides = [];
for (let i = 0; i < total; i += itemsPerSlide) {
  slides.push(
    <div key={i} className="carousel-slide-multi" style={{ display: 'grid', gridTemplateColumns: `repeat(${itemsPerSlide}, 1fr)`, gap: '12px' }}>
      {items.slice(i, i + itemsPerSlide)}
    </div>
  );
}
```

#### B2 — Fix touch target sizes at 375px

**File**: `src/components/MobileCarousel/MobileCarousel.css`

```css
@media (max-width: 480px) {
  .carousel-arrow {
    width: 44px;   /* was 44px — keep as is (already fixed per guide) */
    height: 44px;
  }
}

@media (max-width: 375px) {
  .carousel-arrow {
    width: 40px;   /* Keep compact but WCAG exception for very small screens */
    height: 40px;
    min-width: 44px;  /* Add min-width to preserve touch area */
    min-height: 44px;
  }
}
```

#### B3 — Add edge swipe prevention

**File**: `src/components/MobileCarousel/MobileCarousel.jsx`

Wrap carousel in a container that prevents page scroll during drag:

```jsx
// In the carousel viewport div:
<div
  className="carousel-viewport"
  onTouchStart={(e) => {
    // Only prevent default if swiping horizontally on the carousel
    const touch = e.touches[0];
    const startX = touch.clientX;
    const handler = (ev) => {
      const dx = Math.abs(ev.touches[0].clientX - startX);
      if (dx > 10) ev.preventDefault();
    };
    document.addEventListener('touchmove', handler, { passive: false });
    const cleanup = () => document.removeEventListener('touchmove', handler);
    document.addEventListener('touchend', cleanup, { once: true });
  }}
>
```

#### B4 — Better dot styling for active state

**File**: `src/components/MobileCarousel/MobileCarousel.css`

```css
@media (max-width: 768px) {
  .carousel-dots {
    padding-top: 16px;
    gap: 6px;
  }

  .carousel-dot.active {
    width: 26px;
    border-radius: 4px;
    background: #7e14ff;
    border-color: #7e14ff;
  }
}
```

---

### C. Touch & Typography Hardening

#### C1 — Minimum font sizes (never below 11px)

Apply these across all responsive CSS files:

| Element | Current min | Target min | Files to update |
|---------|------------|------------|-----------------|
| `.service-pill` | 8px at 375px | 11px | `HomePage.responsive.css:867` |
| `.framework-phase-number` | 9px at 768px | 11px | `HomePage.responsive.css:327` |
| `.framework-phase-number` | 8px at 480px | 11px | `HomePage.responsive.css:632` |
| `.case-category` | 10px at 480px | 11px | `CaseStudiesPage.responsive.css` |
| `.eyebrow` (page hero) | 12px at 480px | 11px | All page responsive CSS files |
| `.blog-meta` | 11px | 12px | `BlogPage.responsive.css` |

#### C2 — Touch targets ≥44×44px at ≤480px

**Add to `style.responsive.css`**:

```css
@media (max-width: 480px) {
  button,
  a.nav-link,
  [role="button"],
  .carousel-arrow,
  .faq-toggle,
  .lang-btn,
  .social-icon,
  .blog-filter-btn {
    min-height: 44px;
    min-width: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
```

#### C3 — WCAG focus-visible ring

Already present in `style.css:111-115`. No changes needed.

#### C4 — Better contrast on mobile screens (outdoor readability)

**Add to `style.responsive.css` at 768px breakpoint**:

```css
@media (max-width: 768px) {
  .framework-card p,
  .ai-card p,
  .service-card p,
  [class*="card"] p {
    color: rgba(255, 255, 255, 0.75);  /* was 0.55 — easier to read outdoors */
  }
}
```

---

### D. Layout & Spacing System

#### D1 — Standardize hero heading sizes

Currently inconsistent across pages. Normalize to these `clamp()` values:

| Semantic level | clamp() formula | Pages affected |
|---------------|----------------|----------------|
| Page hero `<h1>` | `clamp(28px, 8vw, 48px)` | About, Blog, Academy, AI, CaseStudies, Growth, Setup |
| Section heading | `clamp(22px, 5vw, 36px)` | All section heads |
| Page hero subtitle | `clamp(15px, 3vw, 18px)` | All page heroes |

#### D2 — Footer intermediate grid at 768px

**File**: `src/components/Footer/Footer.responsive.css`

```css
@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;  /* 2 columns for link columns */
    gap: 32px;
  }

  .footer-brand {
    grid-column: 1 / -1;  /* Brand takes full width */
  }
}
```

#### D3 — Card padding centralization

Already done in `style.responsive.css`. Keep existing values:
- 768px: `24px 20px`
- 480px: `20px 16px`
- 375px: `16px 12px`

#### D4 — Section spacing review

The `--section-pad` variable cascade is already correct:
- Base: `100px`
- 1024px: `70px`
- 768px: `50px`
- 480px: `40px`
- 375px: `32px`

---

### E. Image & Performance

#### E1 — Add aspect-ratio to image containers (prevents CLS)

Already added in `style.responsive.css:159-179`. Make sure these also cover:
- `.about-image-wrap` → `aspect-ratio: 3 / 4` in `AboutPage.responsive.css`
- `.blog-detail img` → `aspect-ratio: 16 / 9` in `BlogPage.responsive.css`
- `.journey-card-image` → `aspect-ratio: 16 / 10` in `HomePage.responsive.css`

#### E2 — Content-visibility for remaining below-fold sections

Already in `style.responsive.css:182-195`. Add these missing sections:
- `.roadmap-section`, `.enrollment-section`, `.modules-section`

#### E3 — Add loading="lazy" to all images

Check all `<img>` tags across all page JSX files and ensure `loading="lazy"` is present on images below the fold. Hero images should use `loading="eager"` or no lazy attribute.

#### E4 — Remove dead selectors

| Dead selector | File | Action |
|--------------|------|--------|
| `about-image-initial` | `AboutPage.responsive.css` | Remove |
| `blog-filters` | `BlogPage.responsive.css` | Remove |
| `content:` missing value in `.framework-section::before` | `HomePage.css` | Fix or remove |

---

### F. Navigation & Footer

#### F1 — Mobile menu trigger 1100px → 1024px

**File**: `src/components/Navigation/Navigation.responsive.css`

Search for all `1100px` breakpoints and change to `1024px`. This aligns with the global grid collapse point.

#### F2 — Body scroll-lock when mobile nav opens

**File**: `src/components/Navigation/Navigation.jsx`

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

#### F3 — Full touch targets for nav links on mobile

**File**: `src/components/Navigation/Navigation.responsive.css`

```css
@media (max-width: 480px) {
  .nav-link,
  .nav-links a {
    min-height: 48px;
    padding-block: 12px;
    display: flex;
    align-items: center;
  }
}
```

#### F4 — Footer social icons minimum 36×36px

**File**: `src/components/Footer/Footer.responsive.css`

```css
@media (max-width: 480px) {
  .footer-social a,
  .footer-social svg {
    width: 36px;
    height: 36px;
    min-width: 44px;  /* touch area */
    min-height: 44px;
  }
}
```

---

### G. Admin Panel

#### G1 — Add 375px breakpoint to AdminDashboard

**File**: `src/admin/AdminDashboard/AdminDashboard.responsive.css`

```css
@media (max-width: 375px) {
  .admin-body { padding: 10px; }
  .stats-grid { grid-template-columns: 1fr; gap: 12px; }
  .stat-card { padding: 16px; }
  .stat-card h3 { font-size: 14px; }
  .stat-value { font-size: 22px; }
}
```

#### G2 — Add overflow-x to admin tables at 1024px

Already present in `CaseStudiesManagement.responsive.css` and `ContactsManagement.responsive.css`. Verify `BlogManagement.responsive.css` has the same:

```css
@media (max-width: 1024px) {
  .admin-table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .admin-table { min-width: 700px; }
}
```

#### G3 — ChangePassword form responsive

**File**: `src/admin/ChangePassword/ChangePassword.responsive.css`

Add missing 480px/375px breakpoints:

```css
@media (max-width: 480px) {
  .change-password-form { padding: 20px 16px; }
  .change-password-form input { padding: 10px 12px; font-size: 14px; }
  .change-password-form .btn { width: 100%; }
}

@media (max-width: 375px) {
  .change-password-form { padding: 16px 12px; }
  .change-password-form label { font-size: 13px; }
}
```

---

### H. Missing Responsive Files

#### H1 — Create `BlogDetailPage.css` and `BlogDetailPage.responsive.css`

**File**: `src/pages/BlogDetail/BlogDetailPage.css`

```css
/* Already uses ../Blog/BlogPage.css — check if that covers all needs */

/* BlogDetailPage.responsive.css — Create new file */
@media (max-width: 768px) {
  .blog-detail { padding: 0 16px; }
  .blog-detail-image { aspect-ratio: 16 / 9; overflow: hidden; }
}

@media (max-width: 480px) {
  .blog-detail h1 { font-size: clamp(22px, 7vw, 32px); }
  .blog-detail-meta { font-size: 13px; flex-wrap: wrap; gap: 8px; }
  .blog-detail-content { font-size: 15px; }
}

@media (max-width: 375px) {
  .blog-detail { padding: 0 12px; }
  .blog-detail-content { font-size: 14px; }
}
```

#### H2 — Create `GrowthPage.responsive.css` (currently sharing ServicePage)

**File**: `src/pages/Growth/GrowthPage.responsive.css`

Currently `GrowthPage.jsx` imports `../Service/ServicePage.responsive.css`. While this works, a dedicated file would allow Growth-specific overrides. Consider creating one if Growth hero differs from Setup hero.

#### H3 — Create `SetupPage.responsive.css` (same as Growth)

Same as H2. Only needed if Setup-specific overrides are required.

---

## 4. Priority Execution Plan

### Phase 1 — Critical Fixes (P0)

| Task | Files | Est. time |
|------|-------|-----------|
| Fix font sizes < 11px | `HomePage.responsive.css` (lines 327, 632, 867) | 15 min |
| Add 375px breakpoint to AdminDashboard | `AdminDashboard.responsive.css` | 10 min |
| Create BlogDetail responsive CSS | `BlogDetailPage.responsive.css` | 15 min |
| Fix nav menu trigger 1100→1024px | `Navigation.responsive.css` | 10 min |
| Add footer social icon touch targets | `Footer.responsive.css` | 10 min |

### Phase 2 — Carousel & Polish (P1)

| Task | Files | Est. time |
|------|-------|-----------|
| Add MobileCarousel to `cases-section` | `HomePage.jsx` | 15 min |
| Multi-item carousel (2-per-slide) | `MobileCarousel.jsx` | 30 min |
| Body scroll-lock for mobile nav | `Navigation.jsx` | 10 min |
| Add admin table overflow-x at 1024px | `BlogManagement.responsive.css` | 5 min |
| Add missing 480px/375px to ChangePassword | `ChangePassword.responsive.css` | 10 min |

### Phase 3 — Layout & Consistency (P2)

| Task | Files | Est. time |
|------|-------|-----------|
| Standardize hero heading clamp() values | All page responsive CSS files | 20 min |
| Footer intermediate grid at 768px | `Footer.responsive.css` | 10 min |
| Trust-section horizontal scroll | `HomePage.responsive.css` | 10 min |
| Content-visibility for remaining sections | `style.responsive.css` | 5 min |
| Add aspect-ratio to all image containers | `AboutPage.responsive.css`, `HomePage.responsive.css` | 10 min |

### Phase 4 — Touch & Accessibility (P3)

| Task | Files | Est. time |
|------|-------|-----------|
| Universal touch target catch-all (≤480px) | `style.responsive.css` | 10 min |
| Fix FAQ icon touch targets | `FAQ.responsive.css` | 5 min |
| Language switcher button sizing | `LanguageSwitcher.responsive.css` | 5 min |
| Remove dead selectors | `AboutPage.responsive.css`, `BlogPage.responsive.css` | 5 min |
| Better mobile text contrast | `style.responsive.css` | 5 min |

---

## Design Principle

> **Every change is scoped to `@media (max-width: ...)`. Desktop/PC view inherits only base CSS and is never modified.**

All responsive CSS files follow the `*.responsive.css` naming convention and are imported alongside base CSS. No base CSS files should ever contain media queries.

### File pattern:

```
Component.css                → PC base (unchanged)
Component.responsive.css     → ≤1024px / ≤768px / ≤480px / ≤375px overrides
```

Current architecture verified correct — preserve this pattern.
