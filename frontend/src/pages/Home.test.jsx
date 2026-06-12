import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import Home from './Home';

vi.mock('../hooks/useReducedMotion', () => ({ useReducedMotion: () => true }));

function renderHome() {
  return render(<MemoryRouter><Home /></MemoryRouter>);
}

it('renders fallback societies, events, and news on the landing page', () => {
  renderHome();
  
  // Societies
  expect(screen.getByText(/Namal Literary & Debating Society \(LDS\)/i)).toBeVisible();
  expect(screen.getByText(/Namal Computing Society \(NCS\)/i)).toBeVisible();
  expect(screen.getByText(/Namal Media Club \(VoN\)/i)).toBeVisible();
  expect(screen.getByText(/Namal Sports & Adventure Club \(NSAC\)/i)).toBeVisible();

  // Events
  expect(screen.getByText(/Namal Sports Gala 2026/i)).toBeVisible();

  // News
  expect(screen.getByText(/Namal Clean-Up Drive Creates a Greener Campus/i)).toBeVisible();
  expect(screen.getByText(/Reading Circle: Poetry Evening at Rumi Library/i)).toBeVisible();
  expect(screen.getByText(/NCS Workshop on Neural Networks/i)).toBeVisible();
});
