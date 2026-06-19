# Problem / Solution Section (Pixel-Perfect Blueprint)

## Goal

Create a section exactly like the reference image:

- Desktop: Two-column comparison layout
- Mobile: Stacked BEFORE → arrow → AFTER cards
- Large headline
- Problem/Solution comparison
- Trust strip
- CTA button
- Soft shadows, rounded cards, modern SaaS style

---

# Section Structure

```html
<section class="problems-section">
  <div class="container">

    <div class="badge">
      SOUND FAMILIAR?
    </div>

    <h2>
      The problems you face —
      <span>and how we solve them</span>
    </h2>

    <p>
      If you have felt any of these,
      you are not alone — and you are not stuck.
    </p>

    <div class="comparison-grid">

      <!-- BEFORE -->
      <div class="before-column">

        <div class="column-header red">
          BEFORE
        </div>

        <div class="hero-card">
          illustration
        </div>

        <div class="problem-list">

          <div class="problem-row">
            icon
            text
            arrow
          </div>

        </div>

      </div>

      <!-- AFTER -->
      <div class="after-column">

        <div class="column-header green">
          AFTER
        </div>

        <div class="hero-card">
          illustration
        </div>

        <div class="solution-list">

          <div class="solution-row">
            icon
            text
            benefit
          </div>

        </div>

      </div>

    </div>

    <div class="trust-strip">
      ...
    </div>

    <button>
      Free Consultation
    </button>

  </div>
</section>
```

---

# Desktop Layout

```css
.comparison-grid{
display:grid;
grid-template-columns:1fr 1fr;
gap:24px;
align-items:start;
}
```

Left = Problems

Right = Solutions

Centered arrow between rows.

---

# Mobile Layout

```css
@media(max-width:768px){

.comparison-grid{
display:flex;
flex-direction:column;
}

}
```

Order:

1. BEFORE card
2. Down Arrow
3. AFTER card
4. Trust Strip
5. CTA

---

# Heading

## Badge

Text:

```text
SOUND FAMILIAR?
```

Style:

```css
background:#FFF4D7;
color:#C98A00;
padding:8px 16px;
border-radius:999px;
font-size:12px;
font-weight:700;
```
---

## Main Title

```text
The problems you face —
and how we solve them
```

Typography:

```css
font-size:56px;
font-weight:800;
line-height:1.1;
letter-spacing:-1px;
```

Green Text:

```css
color:#16A34A;
```

Description:

```css
font-size:18px;
color:#6B7280;
max-width:650px;
margin:auto;
```
---

# BEFORE Card

## Header

```text
BEFORE
Struggling & Stuck
```

Colors:

```css
background:#EF4444;
color:white;
```
---

## Illustration

Use:

- frustrated person
- laptop
- declining graph
- sad face icon

Card:

```css
background:#FFF5F5;
border:1px solid #FECACA;
border-radius:20px;
```
---

## Problem Rows

### Row 1

```text
No Brand Identity or Logo
```

Icon:

🎨

### Row 2

```text
No Professional Website
```

Icon:

🌐

### Row 3

```text
No Content System or Strategy
```

Icon:

📄

### Row 4

```text
No Marketing Strategy or Ad Plan
```

Icon:

🎯

### Row 5

```text
No Consistent Sales Growth
```

Icon:

📈

---

Problem Row CSS

```css
.problem-row{
display:flex;
align-items:center;
gap:12px;
padding:18px;
background:white;
border-radius:16px;
border:1px solid #FEE2E2;
}
```
---

# Center Arrow

Desktop:

```css
width:48px;
height:48px;
border-radius:50%;
background:white;
box-shadow:0 10px 30px rgba(0,0,0,.08);
```
Icon:

```text
→
```

Mobile:

```text
↓
```

---

# AFTER Card

## Header

```text
AFTER
Growing & Successful
```

Color:

```css
background:#16A34A;
color:white;
```

---

## Illustration

Use:

- happy person
- laptop
- growth chart
- upward arrow

Card:

```css
background:#F0FDF4;
border:1px solid #BBF7D0;
border-radius:20px;
```
---

# Solution Rows

### 1

Title

```text
Complete Brand Identity
```

Description

```text
Logo, color palette, typography, brand guidelines
```

Benefit

```text
Trust increases significantly
```

---

### 2

Title

```text
High-Converting Website
```

Description

```text
Custom e-commerce with payment integration
```

Benefit

```text
More visitors become customers
```

---

### 3

Title

```text
AI-Powered Content System
```

Description

```text
Automated content pipeline using Canva, ChatGPT, CapCut
```

Benefit

```text
Save up to 80% content time
```

---

### 4

Title

```text
Full-Stack Marketing Strategy
```

Description

```text
Facebook Ads, organic content, video marketing
```

Benefit

```text
More leads and sales
```

---

### 5

Title

```text
Consistent Sales Growth
```

Description

```text
Proven funnel and growth system
```

Benefit

```text
Predictable revenue growth
```

---

Solution Card CSS

```css
.solution-row{
display:grid;
grid-template-columns:auto 1fr auto;
gap:16px;
padding:18px;
background:white;
border:1px solid #DCFCE7;
border-radius:16px;
}
```

---

# Trust Strip

Layout:

```text
🎯 Business Problems Solved
👥 Team Avatars
★★★★★
500+ Happy Clients
```

CSS

```css
.trust-strip{
display:flex;
justify-content:space-between;
align-items:center;
padding:18px;
background:white;
border-radius:18px;
box-shadow:0 10px 30px rgba(0,0,0,.05);
}
```

---

# CTA Button

Text:

```text
🚀 Free Business Consultation
```

Style:

```css
background:#16A34A;
color:white;
height:64px;
border-radius:18px;
font-size:18px;
font-weight:700;
width:100%;
border:none;
cursor:pointer;
```
---

# Container

```css
.problems-section{
padding:120px 0;
background:#FAFAFA;
}

.container{
max-width:1200px;
margin:auto;
padding:0 24px;
}
```

---

# Border Radius System

```css
Main Cards: 24px
Rows: 16px
Buttons: 18px
Badge: 999px
```
---

# Shadow System

```css
box-shadow:
0 20px 60px rgba(0,0,0,.06);
```

---

# Color Palette

```css
Green:
#16A34A

Green Light:
#F0FDF4

Red:
#EF4444

Red Light:
#FFF5F5

Text:
#0F172A

Muted:
#64748B

Border:
#E5E7EB
```
---

# Recommended Stack

- React
- Next.js
- Tailwind CSS
- Framer Motion
- Lucide Icons

This blueprint reproduces the exact structure, spacing, visual hierarchy, and responsive behavior shown in the reference image.
