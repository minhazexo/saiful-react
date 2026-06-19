import { describe, it, expect } from 'vitest';
import * as captcha from './captcha.js';

function evaluate(prompt) {
  const parts = prompt.split(' ');
  const a = parseInt(parts[0], 10);
  const op = parts[1];
  const b = parseInt(parts[2], 10);
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '×' || op === '*') return a * b;
  throw new Error('unknown op ' + op);
}

describe('captcha', () => {
  it('issues a challenge with id and prompt', () => {
    const c = captcha.issue();
    expect(c.id).toMatch(/^[a-f0-9]{32}$/);
    expect(typeof c.prompt).toBe('string');
    expect(c.ttlSeconds).toBeGreaterThan(0);
  });

  it('verifies a correct answer', () => {
    const c = captcha.issue();
    const answer = evaluate(c.prompt);
    expect(captcha.verify(c.id, answer).ok).toBe(true);
  });

  it('rejects a wrong answer and consumes the id', () => {
    const c = captcha.issue();
    const answer = evaluate(c.prompt) + 1;
    const first = captcha.verify(c.id, answer);
    expect(first.ok).toBe(false);
    expect(first.reason).toBe('wrong-answer');
    const second = captcha.verify(c.id, answer);
    expect(second.ok).toBe(false);
    expect(second.reason).toBe('expired-or-unknown');
  });

  it('rejects an unknown id', () => {
    const result = captcha.verify('not-a-real-id', 1);
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('expired-or-unknown');
  });

  it('rejects missing fields', () => {
    expect(captcha.verify(null, 1).ok).toBe(false);
    expect(captcha.verify('abcdef1234567890abcdef1234567890', undefined).ok).toBe(false);
  });
});
