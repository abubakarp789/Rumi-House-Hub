import { beforeEach, expect, it, vi } from 'vitest';
import {
  cancelRsvp,
  deleteAttendance,
  deleteSociety,
  login,
  updateEvent,
  updateNews,
  updateProfile,
  updateSociety
} from './api';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

it('does not clear an existing session when a login attempt is rejected', async () => {
  localStorage.setItem('rumi_jwt_token', 'existing-session');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: false,
    status: 401,
    json: vi.fn().mockResolvedValue({ message: 'Invalid credentials.' })
  }));

  await expect(login('student@namal.edu.pk', 'wrong-password')).rejects.toThrow('Invalid credentials.');
  expect(localStorage.getItem('rumi_jwt_token')).toBe('existing-session');
});

it('uses RESTful methods for mutable resources', async () => {
  localStorage.setItem('rumi_jwt_token', 'session-token');
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: vi.fn().mockResolvedValue({ success: true })
  }));

  await updateProfile({ name: 'Updated Student' });
  await updateSociety('soc-1', { name: 'Updated Society' });
  await deleteSociety('soc-1');
  await updateEvent('event-1', { title: 'Updated Event' });
  await cancelRsvp('event-1');
  await updateNews('news-1', { title: 'Updated Bulletin' });
  await deleteAttendance('event-1', 'attendance-1');

  expect(fetch.mock.calls.map(([, options]) => options.method)).toEqual([
    'PATCH', 'PATCH', 'DELETE', 'PATCH', 'DELETE', 'PATCH', 'DELETE'
  ]);
});
