const DEFAULT_LOCALE = 'en-GB';
const DEFAULT_TZ = 'Asia/Dhaka';

const cache = new Map();

function getFormatter(locale, timeZone, options) {
  const key = `${locale}|${timeZone}|${JSON.stringify(options)}`;
  let fmt = cache.get(key);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, { timeZone, ...options });
    cache.set(key, fmt);
  }
  return fmt;
}

function toDate(value) {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value !== 'string') return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(value, { locale = DEFAULT_LOCALE, timeZone = DEFAULT_TZ } = {}) {
  const d = toDate(value);
  if (!d) return '';
  return getFormatter(locale, timeZone, { year: 'numeric', month: 'short', day: 'numeric' }).format(
    d
  );
}

export function formatDateTime(value, { locale = DEFAULT_LOCALE, timeZone = DEFAULT_TZ } = {}) {
  const d = toDate(value);
  if (!d) return '';
  return getFormatter(locale, timeZone, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatRelative(value, { locale = DEFAULT_LOCALE, now = new Date() } = {}) {
  const d = toDate(value);
  if (!d) return '';
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const abs = Math.abs(diffSec);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  if (abs < 60) return rtf.format(-diffSec, 'second');
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, 'minute');
  const diffHour = Math.round(diffMin / 60);
  if (Math.abs(diffHour) < 24) return rtf.format(-diffHour, 'hour');
  const diffDay = Math.round(diffHour / 24);
  if (Math.abs(diffDay) < 7) return rtf.format(-diffDay, 'day');
  const diffWeek = Math.round(diffDay / 7);
  if (Math.abs(diffWeek) < 5) return rtf.format(-diffWeek, 'week');
  const diffMonth = Math.round(diffDay / 30);
  if (Math.abs(diffMonth) < 12) return rtf.format(-diffMonth, 'month');
  const diffYear = Math.round(diffDay / 365);
  return rtf.format(-diffYear, 'year');
}
