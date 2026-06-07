import { describe, it, expect } from 'vitest';
import { formatDate, formatDateTime, formatRelative } from '../utils/date';

describe('formatDate', () => {
  it('formats ISO date strings', () => {
    const out = formatDate('2026-01-15T00:00:00Z');
    expect(out).toMatch(/2026/);
    expect(out).toMatch(/Jan/);
  });

  it('returns empty string for invalid input', () => {
    expect(formatDate('not-a-date')).toBe('');
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });

  it('accepts Date and number', () => {
    const out = formatDate(new Date(2026, 5, 6));
    expect(out).toMatch(/2026/);
    const fromNumber = formatDate(Date.UTC(2026, 5, 6));
    expect(fromNumber).toMatch(/2026/);
  });
});

describe('formatDateTime', () => {
  it('includes time component', () => {
    const out = formatDateTime('2026-01-15T13:45:00Z');
    expect(out).toMatch(/2026/);
    expect(out).toMatch(/:/);
  });
});

describe('formatRelative', () => {
  it('reports seconds for very recent', () => {
    const out = formatRelative(new Date(Date.now() - 5000));
    expect(out).toMatch(/second/);
  });

  it('reports days for a few days ago', () => {
    const out = formatRelative(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000));
    expect(out).toMatch(/3 days ago|3 day/);
  });

  it('returns empty for invalid input', () => {
    expect(formatRelative('garbage')).toBe('');
  });
});
