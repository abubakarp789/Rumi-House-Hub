const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveMongoUri } = require('./db');

test('uses the configured MongoDB URI when provided', () => {
  assert.equal(
    resolveMongoUri({ MONGODB_URI: 'mongodb://db.example/rumi' }),
    'mongodb://db.example/rumi'
  );
});

test('falls back to local MongoDB during development', () => {
  assert.equal(
    resolveMongoUri({ NODE_ENV: 'development' }),
    'mongodb://127.0.0.1:27017/rumi_house_hub'
  );
});

test('requires an explicit MongoDB URI in production', () => {
  assert.throws(
    () => resolveMongoUri({ NODE_ENV: 'production' }),
    /MONGODB_URI is required in production/
  );
});
