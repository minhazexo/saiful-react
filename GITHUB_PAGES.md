# Hosting on GitHub Pages

This React (Vite) project is fully configured for GitHub Pages deployment with a ready-made GitHub Actions workflow.

## Quick Startsss

### Automatic Deployment (Recommended)

1. Push your code to a GitHub repository
2. Go to **Settings → Pages** in your repo
3. Under **Source**, select **GitHub Actions**
4. Every push to `main` triggers an automatic build and deploy

The workflow (`.github/workflows/deploy-ghpages.yml`) handles everything:

- Installs dependencies (`npm ci`)
- Builds with `VITE_ROUTER=hash` and `VITE_DEMO_MODE=true`
- Copies `index.html` → `404.html` (SPA fallback for crawlers)
- Deploys to GitHub Pages

Your site will be live at:

```
https://<username>.github.io/<repo-name>/
```

---

## Manual Build

If you want to build locally before pushing:

```bash
# Set the base path (must match your repo name)
cross-env VITE_BASE_PATH=/saiful-react/ VITE_ROUTER=hash VITE_DEMO_MODE=true npm run build:gh
```

The output goes to `dist/`. You can deploy it manually via the GitHub Pages UI or push the `dist/` folder to a `gh-pages` branch.

---

## Environment Variables for GitHub Pages

These are set automatically by the GitHub Actions workflow. Override them in the workflow if needed:

| Variable | Value | Purpose |
|---|---|---|
| `VITE_BASE_PATH` | `/<repo-name>/` | Asset URLs base path (use `/` for user/org pages) |
| `VITE_ROUTER` | `hash` | Enables `HashRouter` so deep links work on a static host |
| `VITE_DEMO_MODE` | `true` | Disables API calls, renders with fallback data |
| `VITE_API_URL` | *(unset)* | No backend in demo mode |

### Important Notes

- **`VITE_ROUTER=hash`** — Changes URLs from `/blog/slug` to `/#/blog/slug`. Required because GitHub Pages has no SPA fallback.
- **`VITE_DEMO_MODE=true`** — The frontend won't call any backend. Contact forms and admin features are disabled. Blog posts and case studies render from hardcoded fallback data.
- **`VITE_BASE_PATH`** — Must match your repository name. For user/org pages (`username.github.io`), set it to `/`.

---

## User/Org Pages vs Project Pages

### Project Pages (default)

- URL: `https://username.github.io/repo-name/`
- Set `VITE_BASE_PATH: /repo-name/`
- Already handled by the workflow

### User/Org Pages

- URL: `https://username.github.io/`
- Set `VITE_BASE_PATH: /` in the workflow
- Deploy from a branch named `gh-pages` on the `username/username.github.io` repo

---

## Connecting a Custom Domain

1. Add a `CNAME` file to `public/` with your domain:
   ```
   yourdomain.com
   ```
2. In your DNS provider, point the domain to GitHub Pages:
   - **Apex domain** (`yourdomain.com`): Create `A` records pointing to GitHub's IPs (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`)
   - **Subdomain** (`www.yourdomain.com`): Create a `CNAME` record pointing to `<username>.github.io`
3. In your repo **Settings → Pages**, enable **Enforce HTTPS**
4. Update `VITE_BASE_PATH` to `/` (root domain)

---

## With a Backend

The GitHub Pages build runs in **demo mode** (`VITE_DEMO_MODE=true`) because there's no backend. To connect to a real API:

1. Set `VITE_DEMO_MODE: 'false'` (or remove it) in `.github/workflows/deploy-ghpages.yml`
2. Set `VITE_API_URL: 'https://your-api-domain.com/api'` in the same workflow
3. Ensure your backend's CORS is configured to allow your GitHub Pages domain

---

## SPA Routing on GitHub Pages

GitHub Pages doesn't support SPA fallback natively. The project solves this with two strategies:

1. **HashRouter** (`VITE_ROUTER=hash`) — URLs use `/#/path` format. This is the default for GitHub Pages builds.
2. **404.html mirror** — `index.html` is copied to `404.html` so search engine crawlers that cached old non-hash URLs still load the app.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Assets return 404 | Ensure `VITE_BASE_PATH` matches your repo name |
| Blank page | Check browser console; usually a missing base path |
| Deep links show 404 | Make sure `VITE_ROUTER=hash` is set |
| API errors | Set `VITE_DEMO_MODE=false` and `VITE_API_URL` in the workflow |
| Styles missing | Verify `base` in `vite.config.js` reads `VITE_BASE_PATH` |

---

## Workflow Reference

See `.github/workflows/deploy-ghpages.yml` for the full automation. Key points:

- Triggers on push to `main` and manual dispatch
- Uses `actions/deploy-pages` (OIDC-based, no token needed)
- Concurrency group prevents overlapping deploys
- Builds with `npm run build` (not `build:gh`, env vars are set inline)
