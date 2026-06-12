import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import RoleRoute from './components/RoleRoute';
import { AuthContext } from './context/AuthContext';

/**
 * Renders a RoleRoute inside a test router at the given path.
 * Includes a /login route to verify redirects land correctly.
 */
function renderWithRoute(path, allowedRoles, authOverrides = {}) {
  const defaultAuth = {
    user: null,
    token: null,
    loading: false,
    authError: '',
    setAuthError: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    ...authOverrides,
  };

  return render(
    <AuthContext.Provider value={defaultAuth}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route
            path={path}
            element={
              <RoleRoute allowedRoles={allowedRoles}>
                <div data-testid="protected-content">Protected Content</div>
              </RoleRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
          <Route path="/dashboard" element={<div data-testid="dashboard-page">Dashboard</div>} />
          <Route path="/executive" element={<div data-testid="executive-page">Executive</div>} />
          <Route path="/admin" element={<div data-testid="admin-page">Admin</div>} />
          <Route path="/forbidden" element={<div data-testid="forbidden-page">Forbidden</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

// ---------- Unauthenticated redirects ----------

it('redirects unauthenticated user to /login for student-only route', () => {
  renderWithRoute('/dashboard', ['student']);
  expect(screen.getByTestId('login-page')).toBeInTheDocument();
  expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
});

it('redirects unauthenticated user to /login for executive-only route', () => {
  renderWithRoute('/executive', ['executive']);
  expect(screen.getByTestId('login-page')).toBeInTheDocument();
});

it('redirects unauthenticated user to /login for admin-only route', () => {
  renderWithRoute('/admin', ['admin']);
  expect(screen.getByTestId('login-page')).toBeInTheDocument();
});

// ---------- Role mismatch redirects ----------

it('redirects student away from admin-only route to /forbidden', () => {
  renderWithRoute('/admin', ['admin'], {
    user: { _id: 'u1', name: 'Student User', role: 'student' },
    token: 'test-token',
  });
  expect(screen.getByTestId('forbidden-page')).toBeInTheDocument();
  expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
});

it('redirects student away from executive-only route to /forbidden', () => {
  renderWithRoute('/executive', ['executive'], {
    user: { _id: 'u1', name: 'Student User', role: 'student' },
    token: 'test-token',
  });
  expect(screen.getByTestId('forbidden-page')).toBeInTheDocument();
});

it('redirects admin away from student-only route to /forbidden', () => {
  renderWithRoute('/dashboard', ['student'], {
    user: { _id: 'u1', name: 'Admin User', role: 'admin' },
    token: 'test-token',
  });
  expect(screen.getByTestId('forbidden-page')).toBeInTheDocument();
});

it('redirects executive away from admin-only route to /forbidden', () => {
  renderWithRoute('/admin', ['admin'], {
    user: { _id: 'u1', name: 'Exec User', role: 'executive' },
    token: 'test-token',
  });
  expect(screen.getByTestId('forbidden-page')).toBeInTheDocument();
});

// ---------- Authorized access ----------

it('renders protected content when student accesses student route', () => {
  renderWithRoute('/dashboard', ['student'], {
    user: { _id: 'u1', name: 'Student', role: 'student' },
    token: 'test-token',
  });
  expect(screen.getByTestId('protected-content')).toBeInTheDocument();
});

it('renders protected content when admin accesses admin route', () => {
  renderWithRoute('/admin', ['admin'], {
    user: { _id: 'u1', name: 'Admin', role: 'admin' },
    token: 'test-token',
  });
  expect(screen.getByTestId('protected-content')).toBeInTheDocument();
});

it('renders protected content when executive accesses executive route', () => {
  renderWithRoute('/executive', ['executive'], {
    user: { _id: 'u1', name: 'Exec', role: 'executive' },
    token: 'test-token',
  });
  expect(screen.getByTestId('protected-content')).toBeInTheDocument();
});

// ---------- Loading state ----------

it('shows loading state while auth is loading', () => {
  renderWithRoute('/dashboard', ['student'], { loading: true });
  expect(screen.getByText(/verifying/i)).toBeInTheDocument();
  expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
});
