const PUBLIC_EVENT_FILTERS = new Set(['', 'approved', 'upcoming', 'past']);

const idOf = (value) => {
  if (!value) return '';
  if (value.userId) return idOf(value.userId);
  if (value._id) return String(value._id);
  return String(value);
};

const canReadEventFilter = (user, status = '') => {
  if (user && ['admin', 'executive'].includes(user.role)) return true;
  return PUBLIC_EVENT_FILTERS.has(status);
};

const isPublicEvent = (event) => ['approved', 'past'].includes(event?.status);

const canProposeForSociety = (user, society) => {
  if (!user || !society) return false;
  if (user.role === 'admin') return true;
  if (user.role !== 'executive') return false;
  return (society.executiveBody || []).some((member) => idOf(member) === idOf(user));
};

const canManageEvent = (user, event) => {
  if (!user || !event) return false;
  if (user.role === 'admin') return true;
  return user.role === 'executive' && idOf(event.createdBy) === idOf(user);
};

module.exports = {
  canManageEvent,
  canProposeForSociety,
  canReadEventFilter,
  isPublicEvent
};
