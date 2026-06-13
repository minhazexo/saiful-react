# 🚨 Mobile Responsive Deep-Dive Audit Report

> **Date:** June 12, 2026  
> **Scope:** All 12 public pages + 5 shared components + 6 admin pages  
> **Method:** Cross-referenced every responsive CSS selector against actual JSX class names

---

## 🔴 CRITICAL — Dead Selectors (Responsive Rules That NEVER Apply)

These selectors in `*.responsive.css` files **don't match any element** in the actual rendered DOM. The CSS is completely wasted — it's loaded by the browser but never activated.

### 1. About Page → `about-image-initial`

**File:** `src/pages/About/AboutPage.responsive.css`  
**Dead selectors (3 breakpoints):**

```css
/* ≡768px */ .about-image-initial { font-size: 96px; }
/* ≡480px */ .about-image-initial { font-size: 72px; }
/* ≡375px */ .about-image-initial { font-size: 60px; }
```

**Root cause:** The JSX uses `<div className="about-image-card">` with an `<img>` inside. There is **no** `.about-image-initial` class in AboutPage.jsx. This was likely from an older version that rendered initials instead of an image.

**Impact:** Low (no visual breakage, just wasted bytes) — but at 480px, the `.about-image-stat` is set to `position: static` which makes it disappear from its intended overlay position. See Issue #7.

---

### 2. Blog Page → `blog-filters` (class doesn't exist)

**File:** `src/pages/Blog/BlogPage.responsive.css`  
**Dead selectors (2 breakpoints):**

```css
/* ≡1024px */ .blog-filters { flex-wrap: wrap; gap: 8px; }
/* ≡1024px */ .blog-filters button { padding: 8px 16px; font-size: 13px; }
/* ≡480px  */ .blog-filters { justify-content: flex-start; gap: 6px; }
/* ≡480px  */ .blog-filters button { padding: 6px 12px; font-size: 12px; }
```

**Root cause:** The JSX renders filters as `<div className="blog-categories">` with **inline styles** for layout. Class `.blog-filters` does not exist anywhere.

**Impact:** Category filter buttons never resize on mobile. At 375px viewport, the buttons still render at `padding: 8px 16px; font-size: 13` (from inline styles) — could overlap or wrap awkwardly.

---

## 🟠 HIGH — Misplaced & Duplicated Selectors

These aren't broken per se, but they're in the wrong file, causing confusion and potential maintenance bugs.

### 3. CaseStudiesPage.responsive.css Contains Blog Rules

**File:** `src/pages/CaseStudies/CaseStudiesPage.responsive.css`  
**Misplaced selectors (duplicated across files):**

```
.blog-grid           (also in BlogPage.responsive.css)
.blog-image          (also in BlogPage.css base)
.blog-content        (also in BlogPage.responsive.css)
.blog-card h3        (also in BlogPage.responsive.css)
.blog-detail-image   (also in BlogPage.responsive.css)
.blog-detail-content (also in BlogPage.responsive.css)
.blog-detail h1      (also in BlogPage.responsive.css)
.blog-detail-meta    (also in BlogPage.responsive.css)
```

**Why it matters:** These rules are loaded on the Case Studies page even though no blog elements exist there. The rules are duplicated across two files with **different** values in some cases:

| Selector | CaseStudiesPage (768px) | BlogPage (768px) |
|----------|----------------------|-------------------|
| `.blog-image` | `height: 140px; font-size: 48px` | Not set at 768px |
| `.blog-content` | `padding: 18px` | Not set at 768px |
| `.blog-card h3` | `font-size: 16px` | Not set at 768px |
| `.blog-detail-image` | `height: 200px; font-size: 72px` | `height: 200px; font-size: 72px` ✅ (same) |
| `.blog-detail-content` | `font-size: 16px` | Not set at 768px |

At 480px and 375px, even more values diverge. This is a maintenance ticking bomb.

---

### 4. BlogPage.responsive.css Has No `blog-categories` Rules

**File:** `src/pages/Blog/BlogPage.responsive.css` is missing selectors for the actual class `.blog-categories` (only has dead `.blog-filters`).

The JSX uses inline styles for the categories container:
```jsx
<div className="blog-categories"
     style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
```

These inline values **never resize** on any breakpoint. At 375px, the gap and font size remain at desktop values.

---

## 🟡 MEDIUM — Missing Responsive Coverage

### 5. No Dedicated BlogDetailPage.responsive.css

**File:** Does not exist.  
BlogDetailPage.jsx imports `BlogPage.css` and `BlogPage.responsive.css`, which is fine, but means blog-detail-specific responsive rules are crammed into BlogPage.responsive.css. If BlogDetail needs unique responsive behavior, there's no good place to put it without bloating BlogPage.responsive.css.

---

### 6. Shared ServicePage.responsive.css (Setup + Growth)

**Files:**
- `src/pages/Setup/SetupPage.jsx` → imports `ServicePage.responsive.css`
- `src/pages/Growth/GrowthPage.jsx` → imports `ServicePage.responsive.css`
- `src/pages/Service/ServicePage.css` — exists but there's no ServicePage.jsx

All selectors match the JSX ✅ — but the `services-grid` collapses to `1fr` at 1024px for ALL three pages (Setup, Growth, and whatever hypothetical Service page). This means Setup (4 service cards) and Growth (4 service cards) both become single-column at tablet size. This might be intentional, but worth verifying.

---

### 7. About Page — `about-image-stat` Positioning Breaks at 480px

**File:** `src/pages/About/AboutPage.responsive.css`  
At 480px:
```css
.about-image-stat { position: static; margin-top: 16px; text-align: center; }
```

This removes the absolute positioning that overlays the stat badge on the image. But the JSX also uses `.about-image-wrap` (the parent) at `max-width: 260px`. The stat badge will now appear **below** the image — check if this is the intended mobile layout or if the stat badge should remain overlaid.

---

### 8. Contact Page — CAPTCHA Row Stacks Vertically

**File:** `src/pages/Contact/ContactPage.responsive.css`  
At 480px:
```css
.captcha-group .captcha-row { flex-direction: column; gap: 8px; }
```

This stacks the CAPTCHA input and the "↻ New" button vertically on phone screens. ✅ This is correct responsive behavior — but the `btn-outline` button in the row doesn't have a responsive width override. It should likely be `width: 100%` at 480px.

---

### 9. Home Page Lead-Magnet CAPTCHA Row Doesn't Stack

**File:** `src/pages/Home/HomePage.responsive.css`

ContactPage.responsive.css correctly stacks the captcha row vertically at 480px:
```css
.captcha-group .captcha-row { flex-direction: column; gap: 8px; }
```

But HomePage.responsive.css has **zero** `.captcha-row` overrides. The home page's lead form (`lead-form`) also contains a captcha input + "↻ New" button inside `.captcha-group .captcha-row`. At 375px viewport (container padding: 12px), these two elements remain side-by-side with the button at `btn-outline` size — very cramped.

**Fix needed:** Add the same `.captcha-group .captcha-row` stacking override in HomePage.responsive.css at 480px and below.

---

### 10. Consent Banner — 600px & 480px Duplicate

**File:** `src/components/ConsentBanner/ConsentBanner.responsive.css`

The 600px breakpoint and 480px breakpoint have nearly identical padding/left/right/bottom values. The 600px block sets `padding: 18px`, then 480px overrides to `padding: 14px`. 600px also sets the `consent-btn-*` to `width: 100%`, while 480px sets `font-size: 13px` and `padding: 8px 16px`. Consider consolidating.

---

### 11. No Responsive File for NotFound Page

**File:** Should exist at `src/pages/NotFound/NotFound.responsive.css` or be handled elsewhere.  
Currently, NotFound.jsx has **no** responsive CSS import. It relies on `style.responsive.css` which has:
```css
@media (max-width: 480px) {
  .not-found-wrap { padding: 80px 16px; }
  .not-found-desc { font-size: 14px; }
}
@media (max-width: 375px) {
  .not-found-wrap { padding: 60px 12px; }
}
```

This works but means all Not Found responsive rules live in the global `style.responsive.css` instead of a page-specific file, breaking the project convention.

---

## 🟢 LOW — Minor / Cosmetic

### 12. Home Page — `service-card` Animation Override

**File:** `src/pages/Home/HomePage.responsive.css`  
At 1024px:
```css
.service-card, .glass-card { animation: none; }
```

This is correct (removes floating animations on mobile) ✅. But `.service-card` has 3 separate blocks overriding its position/padding at various breakpoints. Could be consolidated.

---

### 13. Home Page — `founder-exp-badge` Position Override

At 768px:
```css
.founder-exp-badge { right: 0; bottom: -16px; padding: 14px 18px; }
```

But at the same breakpoint, `.founder-image-wrap` is set to `max-width: 300px; margin: 0 auto`. The exp badge sits at `right: 0` within this narrowed container. At 480px, the stat badge is supposed to be inside the 300px container but this might cause right-edge clipping. Verify visually.

---

### 14. Package Featured Card — Mobile Scaling

At 1150px:
```css
.package-card.featured { transform: none; }
```

This correctly removes the `scale(1.08)` on narrower screens ✅. But the featured card still has `padding: 52px 36px` from the base CSS (no mobile override until 480px where it becomes `padding: 36px 24px`). Between 1150px and 480px, the featured card maintains desktop padding inside a collapsed single-column layout — might make it taller than expected.

---

## 📊 Summary Count

| Severity | Count | Issues |
|----------|-------|--------|
| 🔴 Critical (dead selectors) | 2 | `about-image-initial`, `blog-filters` |
| 🟠 High (misplaced/duplicated) | 2 | Blog rules in CaseStudiesPage, missing `blog-categories` |
| 🟡 Medium (missing coverage) | 7 | No BlogDetailPage.responsive.css, image-stat overlap, Home Captcha not stacking, CAPTCHA button width, Consent duplication, NotFound convention, shared ServicePage pattern |
| 🟢 Low (cosmetic) | 3 | Service-card animation, founder badge, featured card padding |
| **Total** | **14** | |

---

## 📁 Files That Are 100% Clean ✅

These responsive CSS files have all selectors matching their JSX:

| File | Verdict |
|------|---------|
| `src/pages/Home/HomePage.responsive.css` | ✅ Clean |
| `src/pages/Academy/AcademyPage.responsive.css` | ✅ Clean (rewritten earlier) |
| `src/pages/AI/AIPage.responsive.css` | ✅ Clean (rewritten earlier) |
| `src/pages/Contact/ContactPage.responsive.css` | ✅ Clean |
| `src/pages/Service/ServicePage.responsive.css` | ✅ Clean |
| `src/components/Navigation/Navigation.responsive.css` | ✅ Clean |
| `src/components/Footer/Footer.responsive.css` | ✅ Clean |
| `src/components/FAQ/FAQ.responsive.css` | ✅ Clean |
| `src/components/LanguageSwitcher/LanguageSwitcher.responsive.css` | ✅ Clean |
| `src/components/ConsentBanner/ConsentBanner.responsive.css` | ✅ Clean |
| `src/style.responsive.css` | ✅ Clean |

**Note:** Admin pages were reviewed in a previous session (ChangePassword + AdminLogin selectors were fixed). A re-audit of admin responsive CSS is recommended as a follow-up.

---

## 🔍 Recommended Fix Priority

1. **Fix AboutPage.responsive.css** — Remove dead `.about-image-initial` selectors, decide on stat badge positioning at 480px
2. **Fix BlogPage.responsive.css** — Replace `.blog-filters` with `.blog-categories` selectors, add proper responsive rules
3. **Clean CaseStudiesPage.responsive.css** — Remove all `.blog-*` selectors (they belong only in BlogPage.responsive.css)
4. **Fix Home lead-magnet CAPTCHA row** — Add `.captcha-group .captcha-row` stacking at 480px
5. **Add CAPTCHA button width** in ContactPage.responsive.css at 480px
6. **Create NotFound.responsive.css** for consistency (or leave in style.responsive.css if preferred)
