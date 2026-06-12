const test = require('node:test');
const assert = require('node:assert/strict');

const {
  canReadEventFilter,
  isPublicEvent,
  canManageEvent,
  canProposeForSociety,
} = require('../utils/accessPolicies');
const { createPassToken, createQrCodeToken, safeTokenEquals } = require('../utils/secureTokens');

/**
 * These tests verify critical event-related business rules without a database.
 * They complement the accessPolicies.test.js with event-specific scenarios.
 */

// ---------- Event status filter access control ----------

test('unauthenticated users cannot access pendingApproval filter', () => {
  assert.equal(canReadEventFilter(null, 'pendingApproval'), false);
});

test('unauthenticated users cannot access "all" filter', () => {
  assert.equal(canReadEventFilter(null, 'all'), false);
});

test('unauthenticated users cannot access "draft" filter', () => {
  assert.equal(canReadEventFilter(null, 'draft'), false);
});

test('unauthenticated users cannot access "rejected" filter', () => {
  assert.equal(canReadEventFilter(null, 'rejected'), false);
});

test('unauthenticated users can access "upcoming" (default) filter', () => {
  assert.equal(canReadEventFilter(null, ''), true);
  assert.equal(canReadEventFilter(null, 'upcoming'), true);
});

test('unauthenticated users can access "past" filter', () => {
  assert.equal(canReadEventFilter(null, 'past'), true);
});

test('student users cannot access moderation filters', () => {
  const student = { role: 'student' };
  assert.equal(canReadEventFilter(student, 'pendingApproval'), false);
  assert.equal(canReadEventFilter(student, 'all'), false);
  assert.equal(canReadEventFilter(student, 'draft'), false);
  assert.equal(canReadEventFilter(student, 'rejected'), false);
});

// ---------- Event visibility ----------

test('pending events are not public', () => {
  assert.equal(isPublicEvent({ status: 'pendingApproval' }), false);
});

test('draft events are not public', () => {
  assert.equal(isPublicEvent({ status: 'draft' }), false);
});

test('null/undefined events are not public', () => {
  assert.equal(isPublicEvent(null), false);
  assert.equal(isPublicEvent(undefined), false);
});

// ---------- Event management authorization ----------

test('student cannot manage any event', () => {
  assert.equal(
    canManageEvent({ _id: 'u1', role: 'student' }, { createdBy: 'u1' }),
    false
  );
});

test('executive cannot manage events created by others', () => {
  assert.equal(
    canManageEvent({ _id: 'u1', role: 'executive' }, { createdBy: 'u2' }),
    false
  );
});

// ---------- Secure token generation ----------

test('pass tokens have the expected prefix and length', () => {
  const token = createPassToken();
  assert.match(token, /^pass_/);
  // pass_ prefix + 64 hex chars (32 bytes)
  assert.equal(token.length, 5 + 64);
});

test('QR code tokens have the expected prefix and length', () => {
  const token = createQrCodeToken();
  assert.match(token, /^rumi_/);
  // rumi_ prefix + 48 hex chars (24 bytes)
  assert.equal(token.length, 5 + 48);
});

test('safeTokenEquals returns true for matching tokens', () => {
  const token = createPassToken();
  assert.equal(safeTokenEquals(token, token), true);
});

test('safeTokenEquals returns false for different tokens', () => {
  const token1 = createPassToken();
  const token2 = createPassToken();
  assert.equal(safeTokenEquals(token1, token2), false);
});

test('safeTokenEquals returns false for different length tokens', () => {
  assert.equal(safeTokenEquals('short', 'much-longer-token'), false);
});

// ---------- Event model status transitions (source-code verification) ----------

test('Event model defines valid status enum', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const modelSource = fs.readFileSync(
    path.join(__dirname, '..', 'models', 'Event.js'),
    'utf-8'
  );

  // Verify all expected statuses are in the enum
  for (const status of ['draft', 'pendingApproval', 'approved', 'rejected', 'past']) {
    assert.ok(
      modelSource.includes(`'${status}'`),
      `Event model should include status '${status}'`
    );
  }
});

// ---------- RSVP duplicate prevention (source-code verification) ----------

test('RSVP model has compound unique index for eventId+userId', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const modelSource = fs.readFileSync(
    path.join(__dirname, '..', 'models', 'RSVP.js'),
    'utf-8'
  );

  assert.ok(
    modelSource.includes('unique: true') && modelSource.includes('eventId: 1, userId: 1'),
    'RSVP model should have compound unique index on eventId + userId'
  );
});
