const crypto = require('crypto');

const TTL_MS = 5 * 60 * 1000;
const MAX_ACTIVE = 5000;
const store = new Map();

function purge() {
  const now = Date.now();
  for (const [id, entry] of store) {
    if (entry.expiresAt < now) store.delete(id);
  }
  if (store.size > MAX_ACTIVE) {
    const overflow = store.size - MAX_ACTIVE;
    const oldest = [...store.entries()].sort((a, b) => a[1].createdAt - b[1].createdAt);
    for (let i = 0; i < overflow; i += 1) store.delete(oldest[i][0]);
  }
}

function pickQuestion() {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const ops = ['+', '-', '*'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let answer;
  let prompt;
  switch (op) {
    case '+':
      answer = a + b;
      prompt = `${a} + ${b}`;
      break;
    case '-': {
      const big = Math.max(a, b);
      const small = Math.min(a, b);
      answer = big - small;
      prompt = `${big} - ${small}`;
      break;
    }
    case '*':
      answer = a * b;
      prompt = `${a} × ${b}`;
      break;
    default:
      answer = a + b;
      prompt = `${a} + ${b}`;
  }
  return { prompt, answer };
}

function issue() {
  purge();
  const { prompt, answer } = pickQuestion();
  const id = crypto.randomBytes(16).toString('hex');
  const now = Date.now();
  store.set(id, { answer, createdAt: now, expiresAt: now + TTL_MS });
  return { id, prompt, ttlSeconds: Math.floor(TTL_MS / 1000) };
}

function verify(id, submitted) {
  purge();
  if (!id || typeof id !== 'string') return { ok: false, reason: 'missing-id' };
  const entry = store.get(id);
  store.delete(id);
  if (!entry) return { ok: false, reason: 'expired-or-unknown' };
  const expected = String(entry.answer);
  const got = String(submitted ?? '').trim();
  if (got !== expected) return { ok: false, reason: 'wrong-answer' };
  return { ok: true };
}

module.exports = { issue, verify };
