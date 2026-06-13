# FIXES.md — Project Deep-Dive: Errors & Bugs

> **Status:** Comprehensive static + dynamic review completed 2026-06-12
> **Tests:** Frontend 24/24 passed ✅ | Server 16/16 passed ✅ | Lint: clean on source ✅

---

## 🟢 FIXES APPLIED (all sessions)

| # | Severity | File(s) | Issue | Status |
|---|----------|---------|-------|--------|
| 1 | 🔴 | `src/api.js:51` | Threw plain object instead of `Error` — now creates proper `Error` instance with `.isDemoMode` | ✅ |
| 2 | 🔴 | `src/components/ScrollToTop.jsx:7` | `behavior: 'instant'` non-standard — changed to `'auto'` | ✅ |
| 3 | 🟡 | `src/components/ErrorBoundary.jsx:2` | Missing default `React` import — now `import React, { Component }` | ✅ |
| 4 | 🟠 | `src/components/LanguageUrlHandler.jsx:31` | `eslint-disable` suppressing missing deps — deps now explicit | ✅ |
| 5 | 🟠 | `src/motion/MotionFadeUp.jsx` | Dynamic `motion[Component]()` — refactored to static `motion.div`/`motion.span` | ✅ |
| 6 | 🔴 | `src/pages/Home/HomePage.jsx` | Lead-magnet form sent to `/contact` without captcha — added full captcha (fetch, UI, submit, error-refresh) | ✅ |
| 7 | 🔴 | `src/pages/Contact/ContactPage.jsx` + `src/locales/bn.json` | Hardcoded WhatsApp placeholder `8801XXXXXXXXX` — now reads from `t('contact.info.whatsappValue')`; Bangla locale fixed too | ✅ |
| 8 | 🔴 | `server/server.js:126` | `uncaughtException` handler didn't exit — added `process.exit(1)` | ✅ |
| 9 | 🟠 | `HomePage.jsx`, `ContactPage.jsx`, `AcademyPage.jsx` | `setTimeout` not cleaned up on unmount — added `useRef` + cleanup `useEffect` in all 3 pages | ✅ |
| 11 | 🟠 | `server/routes/blog.js`, `server/routes/cases.js` | `?status=all` exposed drafts/private data without auth — inline JWT verification from cookie/Bearer header now required | ✅ |
| 27 | 🟠 | `ServicePage.css` + `style.css` | CSS `transition: all` competing with framer-motion on Setup/Growth cards — changed to `box-shadow, border-color, background, color` only; removed overridden hover `transform` rules | ✅ |

---

## 🟡 REMAINING — Not yet fixed

### 10) `server/server.js:99,109,118` — Rate-limit error response may conflict with global error handler
```js
message: { error: 'Too many requests, please try again later.' },
```
The rate limiter returns `res.status(429).json(...)` but the global error handler also attaches a `requestId`. Verify the 429 response isn't double-wrapped.
**Severity:** Low/Medium

### 12) `server/server.js:144` — `global.db = db` pollutes global scope
```js
global.db = db;
```
Attaching to `global` leaks state across test suites. Remove it — `db` is already importable from `server/models`.
**Severity:** Medium

### 13) `src/auth.jsx:9-16` — `localStorage` user data can be stale
If admin role/account is changed server-side, frontend shows stale localStorage data until `/auth/me` completes. Partially mitigated by `bootstrapping` flag in `PrivateRoute`.
**Severity:** Medium

### 14) `src/api.js:21-30` — `csrfPromise` subtle race condition
`loadCsrfToken()` uses `.finally(() => { csrfPromise = null })` — tiny window where two concurrent calls both launch requests. Very narrow but could be hardened.
**Severity:** Low

### 15) `src/components/ErrorBoundary.jsx:21` — Still uses `<a href="/">` instead of `<Link to="/">`
Full page reload instead of SPA navigation. Should use `<Link>` from react-router-dom. The comment says it avoids router dependency in non-router test envs, but ErrorBoundary is only used inside the router tree.
**Severity:** Medium

### 16) `Dockerfile` — `npm ci` requires `package-lock.json`
Both client and server build stages copy `package-lock.json` and run `npm ci`. Verify both lock files are committed to git.
**Severity:** Medium (blocks Docker builds if missing)

### 17) `docker-compose.yml:1` — Deprecated `version: "3.9"` field
Docker Compose V2+ warns on the `version` field. Remove it.
**Severity:** Low

### 18) `src/context/LanguageContext.jsx:38` — `isLoading` always false
`const [isLoading] = useState(false)` is never updated but exposed in context value.
**Severity:** Low

### 19) `src/context/LanguageContext.jsx:96` — Untested error throw
`throw new Error('useLanguage must be used within LanguageProvider')` — not covered by tests.
**Severity:** Low

### 20) `src/components/ErrorBoundary.jsx:53` — `console.error` leaks in production
`console.error('[ErrorBoundary]', error, errorInfo)` — component stack traces visible in production console. Wrap in `import.meta.env.DEV` guard.
**Severity:** Low

### 21) `src/pages/Home/HomePage.jsx:269` — Dead expression
`key === 'academy' ? 'academy' : key` — always evaluates to `key` (no-op).
**Severity:** Low

### 22) `server/captcha.js:67` — captcha `store.delete(id)` not in try/finally
If `verify()` throws between finding and deleting, the captcha could be stuck. Wrap in try/finally.
**Severity:** Low

### 23) `server/routes/blog.js:54-56` — `limit !== null` allows `limit=0`
`limit` defaults to `null` but `0` would be falsy and treated as "no limit". Check `limit != null` instead.
**Severity:** Low

### 24) `server/routes/cases.js:56-58` — Same `limit` issue as blog.js
**Severity:** Low

### 25) `public/sw.js:16-18` — Service worker `BASE` auto-detection fragile
`BASE` is computed from `self.location.pathname` which could break on subpath deployments.
**Severity:** Low

### 26) `src/pages/Home/HomePage.jsx` — `as="li"` on `MotionStaggerItem`
Uses `as="li"` inside `<ul>` which is correct DOM-wise, but the StaggerItem was refactored for `as="span"`. Fine without SSR, worth noting.
**Severity:** Low

---

## ✅ VALIDATED

- Frontend: 24/24 tests passed · Server: 16/16 tests passed · Lint: zero errors on source
- FormData upload — tests confirm no manual Content-Type ✅
- Controlled checkboxes — proper `checked` + `onChange` ✅
- CSRF exempts GET/HEAD/OPTIONS + `/auth/login` + `/contact` POST ✅
- Auth bootstrap — `aliveRef`/`cancelled` pattern prevents memory leaks ✅
- ErrorBoundary fallback — tested with intentional throw ✅

---

## 📋 REMAINING PRIORITY

1. 🟡 #15 — `<a href="/">` → `<Link to="/">` in ErrorBoundary
2. 🟡 #16 — Verify `package-lock.json` files in git
3. 🟡 #17 — Remove deprecated `version` from docker-compose.yml
4. 🟡 #12 — Remove `global.db = db` from server.js
5. 🔵 #18-26 — Code quality improvements
