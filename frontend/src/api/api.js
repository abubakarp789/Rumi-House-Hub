// Rumi House Hub API client (Assignment 4)
// Automatically handles local storage token injection to authorize REST requests.
// Implements clean, browser-native Fetch API syntax.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper to inject bearer authorization headers and validate responses
async function request(method, path, body = null) {
  const token = localStorage.getItem('rumi_jwt_token');
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    let errorMessage = 'An unexpected error occurred.';
    try {
      const data = await response.json();
      errorMessage = data.message || data.error || errorMessage;
    } catch (e) {
      // JSON parsing failure fallback
    }
    
    // Let the caller (AuthContext) decide how to handle 401s.
    // Don't redirect here — it conflicts with React Router and
    // incorrectly treats login failures as expired sessions.

    throw new Error(errorMessage);
  }

  return await response.json();
}

/**
 * Auth API Operations
 */
export async function login(email, password) {
  return request('POST', '/auth/login', { email, password });
}

export async function register(userData) {
  return request('POST', '/auth/register', userData);
}

export async function getCurrentUser() {
  return request('GET', '/auth/me');
}

export async function getAllUsers() {
  return request('GET', '/auth/users');
}

export async function updateUserRole(userId, role) {
  return request('PATCH', `/auth/users/${userId}/role`, { role });
}

/**
 * Societies API Operations
 */
export async function getSocieties(category = '') {
  const path = category ? `/societies?category=${encodeURIComponent(category)}` : '/societies';
  return request('GET', path);
}

export async function getSocietyById(id) {
  return request('GET', `/societies/${id}`);
}

export async function createSociety(payload) {
  return request('POST', '/societies', payload);
}

export async function joinSociety(id) {
  return request('POST', `/societies/${id}/join`);
}

export async function updateMembershipStatus(societyId, membershipId, status) {
  return request('PATCH', `/societies/${societyId}/memberships/${membershipId}/status`, { status });
}

export async function getAllMemberships() {
  return request('GET', '/societies/memberships/all');
}

/**
 * Events API Operations
 */
export async function getEvents(status = '') {
  const path = status ? `/events?status=${encodeURIComponent(status)}` : '/events';
  return request('GET', path);
}

export async function getEventById(id) {
  return request('GET', `/events/${id}`);
}

export async function createEvent(payload) {
  return request('POST', '/events', payload);
}

export async function updateEventStatus(id, status, rejectionReason = '') {
  const payload = { status };
  if (rejectionReason) {
    payload.rejectionReason = rejectionReason;
  }
  return request('PATCH', `/events/${id}/status`, payload);
}

export async function submitRsvp(id) {
  return request('POST', `/events/${id}/rsvp`);
}

export async function getEventQr(id) {
  return request('GET', `/events/${id}/qr`);
}

export async function deleteEvent(id) {
  return request('DELETE', `/events/${id}`);
}

/**
 * Attendance API Operations
 */
export async function recordOrganizerCheckIn(id, token) {
  return request('POST', `/events/${id}/attendance/checkin`, { token });
}

export async function getEventAttendance(id) {
  return request('GET', `/events/${id}/attendance`);
}

/**
 * News API Operations
 */
export async function getNews() {
  return request('GET', '/news');
}

export async function getNewsById(id) {
  return request('GET', `/news/${id}`);
}

export async function createNews(payload) {
  return request('POST', '/news', payload);
}

export async function deleteNews(id) {
  return request('DELETE', `/news/${id}`);
}
