import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import Navbar from './Navbar';
import { AuthContext } from '../context/AuthContext';

function renderNavbar() {
  return render(
    <AuthContext.Provider value={{ user: null, logout: vi.fn() }}>
      <MemoryRouter><Navbar /></MemoryRouter>
    </AuthContext.Provider>
  );
}

it('uses authentic branding and public routes', () => {
  renderNavbar();
  expect(screen.getByAltText('Rumi House Hub crest')).toBeVisible();
  expect(screen.getAllByRole('link', { name: 'Societies' })[0]).toHaveAttribute('href', '/societies');
  expect(screen.getAllByRole('link', { name: 'Events' })[0]).toHaveAttribute('href', '/events');
  expect(screen.getAllByRole('link', { name: 'News' })[0]).toHaveAttribute('href', '/news');
});

it('opens and closes the mobile navigation drawer', async () => {
  const user = userEvent.setup();
  renderNavbar();
  const openButton = screen.getByRole('button', { name: /Open menu/i });
  expect(openButton).toHaveAttribute('aria-expanded', 'false');
  await user.click(openButton);
  expect(screen.getByRole('navigation', { name: /Mobile Navigation/i })).toBeVisible();
  expect(openButton).toHaveAttribute('aria-expanded', 'true');
  await user.click(screen.getByRole('button', { name: /Close menu/i }));
  expect(screen.queryByRole('navigation', { name: /Mobile Navigation/i })).not.toBeInTheDocument();
});

it('dismisses the mobile navigation with Escape', async () => {
  const user = userEvent.setup();
  renderNavbar();
  await user.click(screen.getByRole('button', { name: /Open menu/i }));
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('navigation', { name: /Mobile Navigation/i })).not.toBeInTheDocument();
});
