const STORAGE_KEY = 'saiful-consent';

function readConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore quota / disabled storage
  }
}

function loadPlausible(domain) {
  if (typeof document === 'undefined') return;
  if (document.querySelector('script[data-plausible]')) return;
  const s = document.createElement('script');
  s.defer = true;
  s.src = 'https://plausible.io/js/script.js';
  s.dataset.plausible = domain;
  s.dataset.domain = domain;
  document.head.appendChild(s);
}

let initialized = false;
const subscribers = new Set();

export function getConsent() {
  return readConsent();
}

export function hasAnalyticsConsent() {
  const c = readConsent();
  return Boolean(c && c.analytics);
}

export function acceptAll() {
  const value = { analytics: true, decidedAt: new Date().toISOString() };
  writeConsent(value);
  notify(value);
}

export function rejectAll() {
  const value = { analytics: false, decidedAt: new Date().toISOString() };
  writeConsent(value);
  notify(value);
}

function notify(value) {
  subscribers.forEach((fn) => {
    try {
      fn(value);
    } catch {
      /* ignore */
    }
  });
}

export function subscribeConsent(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function initAnalytics() {
  if (initialized) return;
  initialized = true;
  const consent = readConsent();
  if (consent && consent.analytics) {
    const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
    if (domain) loadPlausible(domain);
  }
}
