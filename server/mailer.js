const nodemailer = require('nodemailer');

let cachedTransporter = null;
let lastConfigKey = '';

function readEnv(name) {
  const v = process.env[name];
  if (v === undefined || v === null) return '';
  return String(v).trim();
}

function isMailerConfigured() {
  return Boolean(readEnv('SMTP_HOST') && readEnv('SMTP_FROM'));
}

function getTransporter() {
  if (!isMailerConfigured()) return null;
  const configKey = [
    readEnv('SMTP_HOST'),
    readEnv('SMTP_PORT'),
    readEnv('SMTP_USER'),
    readEnv('SMTP_PASS'),
    readEnv('SMTP_SECURE'),
  ].join('|');
  if (cachedTransporter && configKey === lastConfigKey) return cachedTransporter;

  const port = Number.parseInt(readEnv('SMTP_PORT') || '587', 10);
  const secure = readEnv('SMTP_SECURE') === 'true' || port === 465;

  cachedTransporter = nodemailer.createTransport({
    host: readEnv('SMTP_HOST'),
    port,
    secure,
    auth: readEnv('SMTP_USER')
      ? { user: readEnv('SMTP_USER'), pass: readEnv('SMTP_PASS') }
      : undefined,
  });
  lastConfigKey = configKey;
  return cachedTransporter;
}

function escapeHtml(value) {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

module.exports.escapeHtml = escapeHtml;

async function sendMail({ to, subject, html, text }) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('[MAIL] SMTP not configured, skipping send');
    return { sent: false, reason: 'not-configured' };
  }
  const from = readEnv('SMTP_FROM') || readEnv('SMTP_USER');
  try {
    const info = await transporter.sendMail({ from, to, subject, html, text });
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error('[MAIL] send failed:', err.message);
    return { sent: false, error: err.message };
  }
}

async function notifyNewContact(contact) {
  const to = readEnv('NOTIFY_EMAIL');
  if (!to) return { sent: false, reason: 'no-recipient' };
  const subject = `[New contact] ${contact.name} — ${contact.service || 'General'}`;
  const safe = {
    name: escapeHtml(contact.name),
    email: escapeHtml(contact.email),
    whatsapp: escapeHtml(contact.whatsapp),
    service: escapeHtml(contact.service),
    source: escapeHtml(contact.source),
    message: escapeHtml(contact.message).replace(/\n/g, '<br>'),
  };
  const html = `
    <h2>New contact submission</h2>
    <table cellpadding="6" style="border-collapse:collapse">
      <tr><td><strong>Name</strong></td><td>${safe.name}</td></tr>
      <tr><td><strong>Email</strong></td><td>${safe.email}</td></tr>
      <tr><td><strong>WhatsApp</strong></td><td>${safe.whatsapp || '—'}</td></tr>
      <tr><td><strong>Service</strong></td><td>${safe.service || '—'}</td></tr>
      <tr><td><strong>Source</strong></td><td>${safe.source || '—'}</td></tr>
    </table>
    <h3>Message</h3>
    <p>${safe.message}</p>
  `;
  const text = [
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `WhatsApp: ${contact.whatsapp || '—'}`,
    `Service: ${contact.service || '—'}`,
    `Source: ${contact.source || '—'}`,
    '',
    contact.message,
  ].join('\n');
  return sendMail({ to, subject, html, text });
}

async function sendContactConfirmation(contact) {
  if (!contact?.email) return { sent: false, reason: 'no-recipient' };
  if (!isMailerConfigured()) return { sent: false, reason: 'not-configured' };
  const subject = 'We received your message — Saiful Studios';
  const html = `
    <p>Hi ${escapeHtml(contact.name)},</p>
    <p>Thanks for reaching out. We received your message and will get back to you within 1 business day.</p>
    <p>— Saiful Studios</p>
  `;
  const text = `Hi ${contact.name},\n\nThanks for reaching out. We received your message and will get back to you within 1 business day.\n\n— Saiful Studios`;
  return sendMail({ to: contact.email, subject, html, text });
}

module.exports = {
  isMailerConfigured,
  sendMail,
  notifyNewContact,
  sendContactConfirmation,
};
