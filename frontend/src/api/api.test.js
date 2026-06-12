import { beforeEach, expect, it, vi } from 'vitest';
import { login } from './api';

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
