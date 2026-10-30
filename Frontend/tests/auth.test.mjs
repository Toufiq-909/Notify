import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSession, readSession, AUTH_STORAGE_KEY } from '../ApiCall/auth.js';

const token = payload => `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;

test('session parsing handles unicode names, expiry, and malformed responses', () => {
  const exp = Math.floor(Date.now() / 1000) + 300;
  assert.equal(parseSession(token({ name: 'tést-user', exp })).name, 'tést-user');
  for (const value of [null, '', 'invalid', token({ name: 'user', exp: 1 }), token({ name: 'user' })]) {
    assert.equal(parseSession(value), null);
  }
});

test('restoring expired sessions clears only account storage', () => {
  const saved = globalThis.localStorage;
  const values = new Map([[AUTH_STORAGE_KEY, token({ name: 'user', exp: 1 })], ['token', 'push-token']]);
  globalThis.localStorage = { getItem: key => values.get(key), removeItem: key => values.delete(key) };
  try {
    assert.equal(readSession(), null);
    assert.equal(values.has(AUTH_STORAGE_KEY), false);
    assert.equal(values.get('token'), 'push-token');
  } finally { globalThis.localStorage = saved; }
});
