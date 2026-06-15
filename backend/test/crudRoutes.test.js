const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const readRoute = (name) => fs.readFileSync(path.join(__dirname, '..', 'routes', name), 'utf8');

test('user routes expose profile update and protected account deletion', () => {
  const source = readRoute('authRoutes.js');
  assert.match(source, /router\.patch\('\/me'/);
  assert.match(source, /router\.delete\('\/users\/:id'/);
});

test('society routes expose update, delete, and membership withdrawal', () => {
  const source = readRoute('societyRoutes.js');
  assert.match(source, /router\.patch\('\/:id'/);
  assert.match(source, /router\.delete\('\/:id'/);
  assert.match(source, /router\.delete\('\/:id\/memberships\/:membershipId'/);
});

test('event routes expose event update and RSVP cancellation', () => {
  const source = readRoute('eventRoutes.js');
  assert.match(source, /router\.patch\('\/:id'/);
  assert.match(source, /router\.delete\('\/:id\/rsvp'/);
});

test('news and attendance routes expose update and correction operations', () => {
  assert.match(readRoute('newsRoutes.js'), /router\.patch\('\/:id'/);
  assert.match(readRoute('attendanceRoutes.js'), /router\.delete\('\/:id\/attendance\/:attendanceId'/);
});
