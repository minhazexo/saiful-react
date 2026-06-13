# TODO.md

## Step 1 — Collect confirmed errors
- [ ] Wait for/collect output from: `npm run lint`, `npm run test`, `cd server && npm test`

## Step 2 — Apply high-confidence fixes (static)
- [x] Fix `src/components/ErrorBoundary.jsx`
  - [ ] Use correct React import (`import React, { Component } from 'react'`)
  - [ ] Replace `<a href="./">` with router `<Link to="/">` (base/hash-safe)

- [x] Fix `src/components/ScrollToTop.jsx`
- [x] Replace `behavior: 'instant'` with `behavior: 'auto'`

- [x] Fix `src/api.js`
  - [ ] Throw an `Error` instance in demo mode interceptor


## Step 3 — Verify
- [ ] Re-run `npm run lint`
- [ ] Re-run `npm run test`
- [ ] Re-run `cd server && npm test`

## Step 4 — Update FIXES.md
- [ ] Mark which items were confirmed vs. resolved

