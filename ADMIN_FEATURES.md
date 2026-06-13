# 🛠️ Saiful Studios — Admin Features Documentation

> **Date:** June 12, 2026
> **Codebase:** React + Vite (frontend) · Express + Sequelize + MySQL (backend)
> **Auth:** JWT (httpOnly cookie) + CSRF double-submit cookie pattern + role-based access

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [✅ WORKING: Authentication & Security](#-working-authentication--security)
3. [✅ WORKING: Admin Layout & Navigation](#-working-admin-layout--navigation)
4. [✅ WORKING: Dashboard](#-working-dashboard)
5. [✅ WORKING: Blog Management](#-working-blog-management)
6. [✅ WORKING: Case Studies Management](#-working-case-studies-management)
7. [✅ WORKING: Contacts Management](#-working-contacts-management)
8. [✅ WORKING: Change Password](#-working-change-password)
9. [✅ WORKING: Image Uploader](#-working-image-uploader)
10. [✅ WORKING: Shared Components](#-working-shared-components)
11. [⚠️ PARTIALLY WORKING: Features with Caveats](#️-partially-working-features-with-caveats)
12. [❌ NEEDED: Missing Admin Features](#-needed-missing-admin-features)
13. [🔮 FUTURE: Recommended Feature Roadmap](#-future-recommended-feature-roadmap)
14. [📊 Summary Table](#-summary-table)

---

## Architecture Overview

### Route Structure (`src/App.jsx`)

```
/admin/login          → AdminLogin (public, no auth wrapper)
/admin                → PrivateRoute → AdminLayout (outlet)
  /admin              → AdminDashboard
  /admin/blog         → BlogManagement
  /admin/cases        → CaseStudiesManagement
  /admin/contacts     → ContactsManagement
  /admin/password     → ChangePassword
  /admin/*            → Redirect to /admin
```

### API Endpoints (backend — `server/routes/`)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/auth/csrf` | No | — | Get CSRF token |
| POST | `/api/auth/login` | No | — | Admin login |
| POST | `/api/auth/logout` | No | — | Clear auth cookie |
| GET | `/api/auth/me` | Yes | any | Get current admin profile |
| POST | `/api/auth/refresh` | No | — | Refresh expired JWT (within 24h) |
| PUT | `/api/auth/password` | Yes | any | Change own password |
| GET | `/api/blog` | No* | — | List blog posts (public only unless status=all + valid JWT) |
| GET | `/api/blog/:slug` | No | — | Get single blog post (increments views) |
| POST | `/api/blog` | Yes | any | Create blog post |
| PUT | `/api/blog/:id` | Yes | any | Update blog post |
| DELETE | `/api/blog/:id` | Yes | admin | Delete blog post |
| GET | `/api/cases` | No* | — | List case studies (featured only unless status=all + valid JWT) |
| GET | `/api/cases/:slug` | No | — | Get single case study |
| POST | `/api/cases` | Yes | any | Create case study |
| PUT | `/api/cases/:id` | Yes | any | Update case study |
| DELETE | `/api/cases/:id` | Yes | admin | Delete case study |
| GET | `/api/contact` | Yes | any | List contacts |
| GET | `/api/contact/stats` | Yes | any | Contact status counts |
| GET | `/api/contact/:id` | Yes | any | Get single contact |
| PUT | `/api/contact/:id` | Yes | any | Update contact status |
| DELETE | `/api/contact/:id` | Yes | admin | Delete contact |
| GET | `/api/contact/captcha` | No | — | Get CAPTCHA challenge |
| POST | `/api/contact` | No | — | Public contact form (captcha-protected) |
| POST | `/api/upload` | Yes | any | Upload image (5MB max, auth required) |

*\* Public list endpoints return only published/featured items. Adding `?status=all` requires a valid JWT.*

### Database Models

| Model | Table | Key Fields |
|-------|-------|------------|
| Admin | `admins` | id, email, password (bcrypt), name, role (admin/editor), timestamps |
| Blog | `blogs` | id, title, slug, excerpt, content, category, author, image, readTime, featured, views, published, timestamps |
| CaseStudy | `case_studies` | id, title, slug, category, icon, challenge, solution, result, resultHighlight, headerGradient, metrics (JSON), images (JSON), featured, client, description, timestamps |
| Contact | `contacts` | id, name, email, whatsapp, service, message, status (new/contacted/interested/closed), source, timestamps |

### Security Stack

- **JWT authentication** via httpOnly `admin_token` cookie (7-day expiry, refreshable within 24h)
- **Double-submit CSRF pattern** using `csrf-csrf` library, session-bound to auth cookie or long-lived session cookie
- **Rate limiting:** Login (5/15min), Contact (5/hour), Global (300/15min)
- **Helmet** HTTP headers with strict CSP in production
- **Input sanitization:** All string inputs stripped of HTML tags and length-truncated
- **Role-based delete protection:** Only `admin` role can delete; `editor` role cannot

---

## ✅ WORKING: Authentication & Security

### Login Page (`/admin/login`)
- **UI:** Styled login form with email + password, centered on gradient background
- **CSRF priming:** On login, the frontend fetches a CSRF token first (login endpoint is CSRF-exempt)
- **Auto-redirect:** If already authenticated, redirects to `/admin` (or the originally requested path)
- **Error handling:** Server validation errors displayed inline (invalid credentials, missing fields)
- **Rate limiting:** 5 login attempts per 15-minute window
- **Sign-up prompt:** Shows "Don't have an account? Contact administrator" with mailto link

### Auth Provider (`src/auth.jsx`)
- **Bootstrapping:** On page load, fetches `/api/auth/me` to verify cookie is still valid
- **localStorage cache:** Admin user info cached in `localStorage` for instant UI rendering
- **401 interceptor:** Axios response interceptor clears user state on any 401 response
- **Logout:** POST to `/api/auth/logout` + clears localStorage + redirects to login
- **Token refresh:** `/api/auth/refresh` endpoint can extend token within 24h of expiry

### Private Route (`src/components/PrivateRoute.jsx`)
- Shows loading state during bootstrapping
- Redirects unauthenticated users to `/admin/login` with `state.from` for return navigation

### Password Strength
- Backend enforces: min 12 chars, max 200 chars, no whitespace
- Frontend form validates: current password + new password + confirm match
- New password must differ from current password

---

## ✅ WORKING: Admin Layout & Navigation

### Sidebar (`AdminLayout.jsx`)
- **Desktop:** Fixed 280px sidebar with navigation links, user info, and actions
- **Mobile:** Hamburger toggle button (fixed position, floating), backdrop overlay, scroll lock
- **Auto-close:** Sidebar closes on route change
- **Active link highlighting:** Uses `NavLink` with `isActive` prop
- **Navigation links:**
  - 📊 Dashboard (`/admin`)
  - 📰 Blog Posts (`/admin/blog`)
  - 📁 Case Studies (`/admin/cases`)
  - 📧 Contacts (`/admin/contacts`)
- **User info:** Avatar (first letter), name, email
- **Actions:**
  - 🔒 Change Password (`/admin/password`)
  - 🌐 Language Switcher (mobile variant)
  - 🚪 Logout button (red, full width)

### Content Area
- Scrollable main content area with header and body sections
- Consistent `admin-header` / `admin-body` pattern across all pages

---

## ✅ WORKING: Dashboard

### Dashboard Page (`/admin`)
- **Welcome message** with subtitle
- **Stat cards grid** (3 cards linking to management pages):
  - 📰 Blog Posts → `/admin/blog`
  - 📁 Case Studies → `/admin/cases`
  - 📧 Contacts → `/admin/contacts`
- Cards have hover animation (translateY + shadow)
- Fully translated via locale keys

---

## ✅ WORKING: Blog Management

### `BlogManagement.jsx` — Full CRUD

#### List View
- Sortable table columns: Title, Category, Author, Status (Published/Draft badge), Actions
- Search bar filters by title, slug, category, author
- Pagination with Previous/Next and "X–Y of Z" display
- Empty states: "No blog posts yet" or "No matches" for filtered searches

#### Create/Edit Form
- Fields: title*, slug*, excerpt*, content, category*, author, read time, image, featured (checkbox), published (checkbox)
- Image uploader with URL input, file browser, and preview
- Content supports Markdown
- Toggle between create/edit mode with context-aware save button

#### Backend
- Input sanitization (HTML stripping, length limits)
- Pagination (default 20, max 100)
- Search via `LIKE` queries on title, slug, category, author
- Sortable by: createdAt, updatedAt, title, category, author, readTime, published
- `?status=all` requires valid JWT (auth check added as security fix)
- Public list returns only `published: true`
- View counter increments on public single-post fetch

---

## ✅ WORKING: Case Studies Management

### `CaseStudiesManagement.jsx` — Full CRUD

#### List View
- Sortable table columns: Title, Category, Status (Featured/Standard badge), Actions
- Search, pagination, empty states (same pattern as blog)

#### Create/Edit Form
- Fields: title*, slug*, category*, icon (emoji)*, challenge*, solution*, result*, result highlight, header gradient CSS, featured (checkbox)
- **Dynamic metrics:** Add/remove key-value pairs (label + value, up to 20)
- **Dynamic images:** Add/remove image URLs with separate uploader instances (up to 20)
- Header gradient defaults to `linear-gradient(135deg,#FFE7CC,#fff)`

#### Backend
- Same sanitize/paginate/sort/search pattern as blog
- JSON fields for `metrics` and `images` (validated as arrays, max 20 items)
- Featured-only public list
- `?status=all` requires JWT (same security fix as blog)

---

## ✅ WORKING: Contacts Management

### `ContactsManagement.jsx` — Read, Update Status, Delete

#### Dashboard Header Stats
- 4 stat counters: New, Contacted, Interested, Closed
- Loaded from `/api/contact/stats` endpoint

#### List View
- Sortable columns: Name, Email, WhatsApp, Service, Status, Date, Actions
- **Inline status dropdown:** Change contact status directly in the table (optimistic update with rollback on error)
- **WhatsApp link:** Direct `wa.me` link for easy messaging
- **Email link:** `mailto:` link

#### Filters
- Search bar (name, email, WhatsApp, service)
- Status filter dropdown (All / New / Contacted / Interested / Closed)

#### Backend
- Statuses: `new`, `contacted`, `interested`, `closed`
- Sortable by: createdAt, updatedAt, name, email, status, service
- Stats endpoint provides grouped counts
- Delete restricted to `admin` role

---

## ✅ WORKING: Change Password

### `ChangePassword.jsx`
- Form fields: Current password*, New password* (min 12 chars), Confirm new password*
- Validates match on client side before submission
- Backend validates: current password correct, new password different, meets strength requirements
- Success/error messages displayed inline
- Form resets on success
- Accessible via sidebar link (`/admin/password`)

---

## ✅ WORKING: Image Uploader

### `ImageUploader.jsx` — Reusable Component
- **Dual input:** Text URL input + file browser button
- **File upload:** POST to `/api/upload` via multipart/form-data with auth
- **Validation:** 5MB max, image types only (jpg, png, webp, gif, svg)
- **Preview:** Shows uploaded image with lazy loading
- **Error handling:** Specific messages for 401, 403, 413, and generic failures
- **Clear button:** Remove uploaded image
- Used by: BlogManagement (single image), CaseStudiesManagement (multiple images)
- Exported `resolveImageUrl()` helper for consistent URL handling

---

## ✅ WORKING: Shared Components

### `useAdminList.jsx` — Custom Hook
- **Params:** API path, extra params, default sort/order, page size
- **Returns:** rows, total, page, setPage, q, setSearch, sort, order, toggleSort, isLoading, error, reload, limit, pageCount
- **Features:**
  - Pagination with offset-based loading
  - Sort toggle (click same field reverses direction)
  - Search with debounce (resets to page 0)
  - Race condition protection via `aliveRef`
  - Supports both array and `{ rows, total }` API responses

### `SortHeader` Component
- Clickable table header button with ascending/descending indicator arrows
- `aria-sort` attribute for accessibility

### `Pagination` Component
- Previous/Next buttons with disabled states at boundaries
- "X–Y of Z" info text
- Hides when pageCount ≤ 1

### `PrivateRoute` Component
- Auth gate for all admin routes except login
- Shows loading while bootstrapping, redirects to login if unauthenticated

### API Client (`src/api.js`)
- CSRF token auto-fetching and injection on state-changing requests
- Demo mode support (`VITE_DEMO_MODE=true` — short-circuits all requests)
- Unauthorized handler callback
- 20-second timeout

---

## ⚠️ PARTIALLY WORKING: Features with Caveats

### Admin Responsive CSS
- Admin pages were restructured into subdirectories (`/admin/AdminLogin/` etc.) but `AdminLayout.jsx` still imports CSS from the old flat paths
- Mobile sidebar toggle works but some responsive breakpoints may need alignment
- Refer to `MOBILE_RESPONSIVE_AUDIT.md` for a full audit

### `limit=0` Edge Case
- In blog & cases list endpoints, `limit=0` is falsy and treated as "no limit" — should explicitly check `limit !== null`
- (Documented in FIXES.md as issue #23, #24)

### `global.db = db` in `server.js`
- Attaches DB to global scope which can leak across test suites
- (Documented in FIXES.md as issue #12)

### localStorage Stale Data
- Admin user cached in localStorage can show stale data briefly if server-side role changes
- (Documented in FIXES.md as issue #13)

---

## ❌ NEEDED: Missing Admin Features

Below are features that **do not exist yet** in the codebase — identified by analyzing all routes, components, locale keys, and models.

### 🔴 HIGH Priority

#### 1. Admin User Management
- **What:** CRUD interface for managing admin users
- **Why:** Currently only the `seed.js` script or direct DB manipulation can create users
- **Requirements:**
  - List all admins (id, email, name, role, created date)
  - Create new admin (email, password, name, role)
  - Edit existing admin (change email, name, role; optionally reset password)
  - Delete admin (with confirmation)
  - Cannot delete own account / last admin
- **Backend status:** No admin-management routes exist (no `/api/admin/users` endpoints)
- **Model:** ✅ Admin model exists with roles `admin`/`editor`
- **Locale keys:** ❌ None exist
- **UI:** ❌ No page

#### 2. Blog/Case Studies Analytics
- **What:** View-level analytics dashboard
- **Why:** Blog model tracks `views` but there's no UI to see it
- **Requirements:**
  - Show total views, top posts, views over time
  - Show per-post view counts in BlogManagement table
  - Blog detail page already increments views (backend works)
- **Backend status:** ✅ `views` field exists on Blog model, incremented on public GET `/:slug`
- **Locale keys:** ❌ None exist
- **UI:** ❌ Not shown in table columns

#### 3. WYSIWYG / Rich Text Editor for Blog Content
- **What:** Replace plain textarea with a rich text editor (e.g., TinyMCE, Quill, TipTap)
- **Why:** Content field currently a plain `<textarea>` — Markdown supported but no formatting toolbar
- **Requirements:**
  - Rich text formatting (bold, italic, headings, lists, links)
  - Image embedding within content
  - Source view for HTML/Markdown editing
  - Content field uses `TEXT('long')`, so large content is supported
- **Backend status:** ✅ Content field is `TEXT('long')`
- **UI:** ❌ Plain textarea

#### 4. Bulk Actions
- **What:** Select multiple items and perform batch operations
- **Why:** No way to publish/unpublish/delete multiple blog posts or contacts at once
- **Requirements:**
  - Checkbox column in management tables
  - Bulk publish/unpublish for blog posts
  - Bulk update status for contacts
  - Bulk delete (with confirmation showing count)
- **Backend status:** ❌ No bulk endpoints exist
- **UI:** ❌ No checkboxes or bulk toolbar

#### 5. Activity / Audit Log
- **What:** Track all admin actions (create, update, delete, login, logout)
- **Why:** No visibility into who did what in the admin panel
- **Requirements:**
  - Log admin ID, action type, target resource, timestamp, IP address
  - Viewable log page with filters (by admin, resource type, date range)
  - Automatic cleanup or retention policy
- **Backend status:** ❌ No audit model or logging middleware
- **Locale keys:** ❌ None exist
- **UI:** ❌ No page

### 🟡 MEDIUM Priority

#### 6. Admin Profile / Settings Page
- **What:** Edit own profile (name, email) in addition to password
- **Why:** Currently only password can be changed. Admin can't update their name or email.
- **Requirements:**
  - Edit name, email
  - Update confirmation (or separate password re-entry for email changes)
  - API endpoint for updating profile
- **Backend status:** ❌ No PUT `/api/auth/profile` endpoint
- **Locale keys:** ❌ None exist
- **UI:** ❌ No form

#### 7. Media / File Library
- **What:** Browse, search, and manage all uploaded images
- **Why:** Currently images are uploaded per-item with no centralized library. Hard to reuse images.
- **Requirements:**
  - Grid view of all uploaded files with thumbnails
  - Filter by file type, date uploaded
  - Copy URL to clipboard
  - Delete files
  - "Select from library" option in ImageUploader
- **Backend status:** ❌ No library endpoint (GET `/api/uploads` or similar)
- **Locale keys:** ❌ None exist
- **UI:** ❌ No page

#### 8. Blog Categories Management
- **What:** Manage blog categories separately from posts
- **Why:** Category is currently a free-text field — leads to duplicates, typos, and inconsistent taxonomy
- **Requirements:**
  - CRUD for categories (name, slug, description)
  - Category selection in blog form becomes a dropdown
  - Category filter on blog list page
  - See count of posts per category
- **Backend status:** ❌ No categories model or table
- **Locale keys:** ❌ None exist
- **UI:** ❌ No page

#### 9. Admin Notification System
- **What:** In-app notifications for important events (new contacts, etc.)
- **Why:** No real-time awareness of new inquiries without refreshing
- **Requirements:**
  - Toast/badge on sidebar for new contacts
  - Notification history page
  - Mark as read / clear
  - Could be polling-based (since no WebSocket setup exists)
- **Backend status:** ❌ No notification model or endpoints
- **Locale keys:** ❌ None exist
- **UI:** ❌ No component

#### 10. Export to CSV / Excel
- **What:** Download management data as CSV or Excel files
- **Why:** No way to export contacts, blog posts, or case studies for offline analysis
- **Requirements:**
  - "Export" button on each management page
  - Export contacts with all fields + status
  - Export blog posts (published + draft), case studies
  - Respect current filters and search in export
- **Backend status:** ❌ No export endpoints
- **Locale keys:** ❌ None exist
- **UI:** ❌ No button

### 🔵 LOWER Priority (Nice to Have)

#### 11. Dark Mode Toggle for Admin
- CSS variables are set up (`var(--surface)`, `var(--dark)`, etc.) — could be extended
- Toggle persisted in user preference

#### 12. Dashboard Statistics / Charts
- Dashboard currently just links — no real stats
- Show: total blog posts, total case studies, total contacts by status, recent activity
- Simple charts using a lightweight library

#### 13. Blog Post Preview
- Preview button that opens the blog post in a new tab at the public URL using the current slug
- Useful before publishing

#### 14. SEO Preview / Meta Tag Editor
- Edit meta title, description, OG image per blog post / case study
- Preview how it looks in Google search results / social share cards

#### 15. Draft Autosave
- Auto-save blog/case form to localStorage periodically
- Recover unsaved changes if browser crashes

#### 16. Two-Factor Authentication (2FA)
- TOTP-based 2FA for admin accounts
- Setup/enable/disable in admin settings

#### 17. Email Template Management
- Currently email templates are hardcoded in `mailer.js`
- Could build an admin UI to customize notification/confirmation email templates

#### 18. Docker / Deployment Admin
- Health check endpoint exists (`/api/health`)
- Could build a simple deployment dashboard showing server status, DB connection, uptime

---

## 🔮 FUTURE: Recommended Feature Roadmap

### Phase 1 (Immediate — Fix Gaps)
1. Admin User Management (critical)
2. Blog views column in management table (quick win)
3. Blog categories management
4. Export contacts to CSV

### Phase 2 (Near-term — Enhance Workflow)
5. WYSIWYG / Rich text editor for blog
6. Admin profile settings (edit name/email)
7. Media library
8. Bulk actions on contacts and blog posts

### Phase 3 (Medium-term — Analytics & Monitoring)
9. Dashboard analytics (views, trends)
10. Activity / audit log
11. Admin notification system (new contacts)
12. Blog post preview

### Phase 4 (Long-term — Platform Maturity)
13. 2FA
14. Email template management
15. Draft autosave
16. SEO meta editor

---

## 📊 Summary Table

| Feature | Type | Status | Priority |
|---------|------|--------|----------|
| Admin Login / Authentication | Core | ✅ Working | — |
| JWT + CSRF Security | Core | ✅ Working | — |
| Rate Limiting | Core | ✅ Working | — |
| Role-based Access (admin/editor) | Core | ✅ Working | — |
| Admin Layout + Navigation | UI | ✅ Working | — |
| Dashboard | UI | ✅ Working | — |
| Blog CRUD | Feature | ✅ Working | — |
| Case Studies CRUD | Feature | ✅ Working | — |
| Contacts Management (Read/Status/Delete) | Feature | ✅ Working | — |
| Change Password | Feature | ✅ Working | — |
| Image Upload | Feature | ✅ Working | — |
| Pagination / Search / Sort | Shared | ✅ Working | — |
| Admin User Management | Feature | ❌ Missing | 🔴 High |
| Blog View Analytics | Feature | ❌ Missing | 🔴 High |
| Rich Text Editor | Feature | ❌ Missing | 🔴 High |
| Bulk Actions | Feature | ❌ Missing | 🔴 High |
| Activity / Audit Log | Feature | ❌ Missing | 🔴 High |
| Admin Profile Settings | Feature | ❌ Missing | 🟡 Medium |
| Media / File Library | Feature | ❌ Missing | 🟡 Medium |
| Blog Categories Management | Feature | ❌ Missing | 🟡 Medium |
| Admin Notifications | Feature | ❌ Missing | 🟡 Medium |
| Export to CSV | Feature | ❌ Missing | 🟡 Medium |
| Dark Mode | UI | ❌ Missing | 🔵 Low |
| Dashboard Charts | Feature | ❌ Missing | 🔵 Low |
| Blog Post Preview | Feature | ❌ Missing | 🔵 Low |
| SEO Meta Editor | Feature | ❌ Missing | 🔵 Low |
| Draft Autosave | Feature | ❌ Missing | 🔵 Low |
| Two-Factor Auth | Security | ❌ Missing | 🔵 Low |
| Email Template Management | Feature | ❌ Missing | 🔵 Low |

---

*Generated by deep-dive audit of the Saiful Studios codebase. Covers all frontend components, backend routes, models, middleware, and locale files.*
