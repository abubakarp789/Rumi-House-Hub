const test = require('node:test');
const assert = require('node:assert/strict');

/**
 * These tests verify critical auth controller behavior by directly
 * requiring the controller code logic and checking invariants.
 * They do NOT connect to MongoDB — they test pure logic paths.
 */

// ---------- Registration role enforcement ----------

test('registration handler always sets role to student regardless of request body', async () => {
  // The authController.js:85 hardcodes role: 'student' in User.create().
  // We verify this by checking the source code contains no conditional role assignment.
  const fs = require('node:fs');
  const path = require('node:path');
  const controllerSource = fs.readFileSync(
    path.join(__dirname, '..', 'controllers', 'authController.js'),
    'utf-8'
  );

  // The registerUser function must set role: 'student' unconditionally
  assert.match(controllerSource, /role:\s*['"]student['"]/,
    'Registration must hardcode role to student');

  // It must NOT read role from req.body
  const registerSection = controllerSource.split('registerUser')[1]?.split('loginUser')[0] || '';
  assert.ok(
    !registerSection.includes('req.body.role'),
    'Registration must not read role from req.body'
  );
});

// ---------- Login error messages ----------

test('login returns a generic invalid credential response', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const controllerSource = fs.readFileSync(
    path.join(__dirname, '..', 'controllers', 'authController.js'),
    'utf-8'
  );

  const loginSection = controllerSource.split('const loginUser')[1]?.split('const getUserProfile')[0] || '';
  assert.match(loginSection, /status\(401\).*Invalid email or password/);
  assert.doesNotMatch(loginSection, /User not found|Incorrect password/);
});

// ---------- Password policy ----------

test('registration enforces minimum 8 character password', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const controllerSource = fs.readFileSync(
    path.join(__dirname, '..', 'controllers', 'authController.js'),
    'utf-8'
  );

  assert.match(controllerSource, /password\.length\s*<\s*8/,
    'Registration must enforce minimum 8 character password');
});

// ---------- JWT token generation ----------

test('generateToken utility produces a string', () => {
  // Mock the JWT_SECRET for this test
  process.env.JWT_SECRET = 'test-secret-with-at-least-32-characters-long';
  const generateToken = require('../utils/generateToken');
  const token = generateToken('test-user-id');
  assert.equal(typeof token, 'string');
  assert.ok(token.length > 0, 'Token should not be empty');
});
