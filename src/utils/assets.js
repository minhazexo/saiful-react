/**
 * Resolve an asset path with the Vite base URL (e.g. `/saiful-react/`).
 *
 * Use this for assets in `/public/` referenced via absolute paths, so they
 * work correctly when the app is deployed to a sub-path (e.g. GitHub Pages).
 *
 * @example
 *   assetPath('/images/logo.png')  →  '/saiful-react/images/logo.png'
 */
export function assetPath(path) {
  const base = import.meta.env.BASE_URL || '/';
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${clean}`;
}
