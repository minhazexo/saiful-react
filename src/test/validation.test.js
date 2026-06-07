import { describe, it, expect } from 'vitest';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+0-9 ()-]{6,20}$/;

describe('contact form validation regex', () => {
  it('accepts valid emails', () => {
    expect(EMAIL_RE.test('hello@example.com')).toBe(true);
    expect(EMAIL_RE.test('first.last+tag@sub.example.co')).toBe(true);
  });
  it('rejects invalid emails', () => {
    expect(EMAIL_RE.test('plainstring')).toBe(false);
    expect(EMAIL_RE.test('a@b')).toBe(false);
    expect(EMAIL_RE.test('a @b.com')).toBe(false);
    expect(EMAIL_RE.test('@b.com')).toBe(false);
    expect(EMAIL_RE.test('a@.com')).toBe(false);
    expect(EMAIL_RE.test('a@b.')).toBe(false);
  });
  it('accepts reasonable phone numbers', () => {
    expect(PHONE_RE.test('+8801712345678')).toBe(true);
    expect(PHONE_RE.test('01712-345678')).toBe(true);
    expect(PHONE_RE.test('(555) 123-4567')).toBe(true);
  });
  it('rejects phone numbers that are too short or too long', () => {
    expect(PHONE_RE.test('12345')).toBe(false);
    expect(PHONE_RE.test('+12345678901234567890')).toBe(false);
  });
});
