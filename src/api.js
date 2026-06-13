import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Demo mode: short-circuit every request and skip CSRF bootstrap.
// Activated by setting VITE_DEMO_MODE=true at build time (e.g. for the
// GitHub Pages read-only mirror). Set to false / remove to re-enable the
// backend — no code changes required.
export const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 20000,
});

const CSRF_HEADER = 'x-csrf-token';
let csrfToken = null;
let csrfPromise = null;

async function loadCsrfToken() {
  if (csrfPromise) return csrfPromise;
  csrfPromise = api
    .get('/auth/csrf')
    .then((res) => {
      csrfToken = res.data?.csrfToken;
      return csrfToken;
    })
    .finally(() => {
      csrfPromise = null;
    });
  return csrfPromise;
}

export async function ensureCsrf(force = false) {
  if (force) csrfToken = null;
  if (IS_DEMO_MODE) return null;
  if (!csrfToken) {
    try {
      await loadCsrfToken();
    } catch {
      /* will retry on next state-changing request */
    }
  }
  return csrfToken;
}

// Demo mode: reject every request before it leaves the browser.
if (IS_DEMO_MODE) {
  api.interceptors.request.use(
    () => {
      const e = new Error('Demo mode — backend disabled');
      e.isDemoMode = true;
      throw e;
    },
    (err) => Promise.reject(err)
  );
}

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase();
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    try {
      await ensureCsrf();
      if (csrfToken) {
        config.headers = config.headers || {};
        config.headers[CSRF_HEADER] = csrfToken;
      }
    } catch {
      /* no-op: server will reject with 403 */
    }
  }
  return config;
});

let onUnauthorized = null;
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    if (status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(err);
  }
);

export default api;
