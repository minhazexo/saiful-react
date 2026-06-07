import { describe, it, expect } from 'vitest';
import * as mailer from './mailer.js';

describe('mailer', () => {
  it('reports not configured when SMTP_HOST is empty', async () => {
    const prevHost = process.env.SMTP_HOST;
    const prevFrom = process.env.SMTP_FROM;
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_FROM;
    try {
      const result = await mailer.sendMail({ to: 'a@b.com', subject: 's', text: 't' });
      expect(result.sent).toBe(false);
      expect(result.reason).toBe('not-configured');
    } finally {
      if (prevHost !== undefined) process.env.SMTP_HOST = prevHost;
      if (prevFrom !== undefined) process.env.SMTP_FROM = prevFrom;
    }
  });

  it('notifyNewContact returns no-recipient when NOTIFY_EMAIL is empty', async () => {
    const prev = process.env.NOTIFY_EMAIL;
    delete process.env.NOTIFY_EMAIL;
    try {
      const result = await mailer.notifyNewContact({ name: 'x', email: 'a@b.com', message: 'hi' });
      expect(result.sent).toBe(false);
      expect(result.reason).toBe('no-recipient');
    } finally {
      if (prev !== undefined) process.env.NOTIFY_EMAIL = prev;
    }
  });

  describe('escapeHtml', () => {
    it('escapes script tags', () => {
      expect(mailer.escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
    });
    it('escapes quotes and ampersands', () => {
      expect(mailer.escapeHtml('a & "b" \'c\'')).toBe('a &amp; &quot;b&quot; &#39;c&#39;');
    });
    it('handles null/undefined as empty', () => {
      expect(mailer.escapeHtml(null)).toBe('');
      expect(mailer.escapeHtml(undefined)).toBe('');
    });
  });
});
