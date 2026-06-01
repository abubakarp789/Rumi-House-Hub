const crypto = require('crypto');

const createQrCodeToken = () => `rumi_${crypto.randomBytes(24).toString('hex')}`;

const safeTokenEquals = (storedToken = '', providedToken = '') => {
  const stored = Buffer.from(String(storedToken));
  const provided = Buffer.from(String(providedToken));

  if (stored.length !== provided.length) {
    return false;
  }

  return crypto.timingSafeEqual(stored, provided);
};

module.exports = {
  createQrCodeToken,
  safeTokenEquals
};
