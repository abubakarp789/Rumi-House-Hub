const test = require('node:test');
const assert = require('node:assert/strict');

const {
  canManageEvent,
  canProposeForSociety,
  canReadEventFilter,
  isPublicEvent
} = require('./accessPolicies');

test('public and student users can only request public event filters', () => {
  assert.equal(canReadEventFilter(null, ''), true);
  assert.equal(canReadEventFilter({ role: 'student' }, 'past'), true);
  assert.equal(canReadEventFilter({ role: 'student' }, 'pendingApproval'), false);
  assert.equal(canReadEventFilter(null, 'all'), false);
});

test('executives and admins can request moderation filters', () => {
  assert.equal(canReadEventFilter({ role: 'executive' }, 'pendingApproval'), true);
  assert.equal(canReadEventFilter({ role: 'admin' }, 'all'), true);
});

test('only approved or explicitly past events are public', () => {
  assert.equal(isPublicEvent({ status: 'approved' }), true);
  assert.equal(isPublicEvent({ status: 'past' }), true);
  assert.equal(isPublicEvent({ status: 'draft' }), false);
  assert.equal(isPublicEvent({ status: 'rejected' }), false);
});

test('executives can only propose events for societies they lead', () => {
  const user = { _id: 'user-1', role: 'executive' };
  const society = { executiveBody: [{ userId: 'user-1' }] };
  const otherSociety = { executiveBody: [{ userId: 'user-2' }] };

  assert.equal(canProposeForSociety(user, society), true);
  assert.equal(canProposeForSociety(user, otherSociety), false);
  assert.equal(canProposeForSociety({ _id: 'admin-1', role: 'admin' }, otherSociety), true);
});

test('event management is limited to admins and the event creator', () => {
  assert.equal(canManageEvent({ _id: 'admin-1', role: 'admin' }, { createdBy: 'user-2' }), true);
  assert.equal(canManageEvent({ _id: 'user-1', role: 'executive' }, { createdBy: 'user-1' }), true);
  assert.equal(canManageEvent({ _id: 'user-1', role: 'executive' }, { createdBy: 'user-2' }), false);
});
