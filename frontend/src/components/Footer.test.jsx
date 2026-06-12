import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import Footer from './Footer';

it('renders authentic branding and valid public links', () => {
  render(<MemoryRouter><Footer /></MemoryRouter>);
  expect(screen.getByAltText('Rumi House Hub crest')).toBeVisible();
  expect(screen.getByRole('link', { name: /Event Calendar/i })).toHaveAttribute('href', '/events');
  expect(screen.getByRole('link', { name: /Society Directory/i })).toHaveAttribute('href', '/societies');
  expect(screen.getByRole('link', { name: 'info@namal.edu.pk' })).toHaveAttribute('href', 'mailto:info@namal.edu.pk');
  expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeVisible();
});
