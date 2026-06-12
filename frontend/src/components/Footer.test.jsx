import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import Footer from './Footer';

it('renders authentic branding and valid public links', () => {
  render(<MemoryRouter><Footer /></MemoryRouter>);
  expect(screen.getByAltText('Rumi House Hub crest')).toBeVisible();
  expect(screen.getAllByRole('link', { name: 'Events' })[0]).toHaveAttribute('href', '/events');
  expect(screen.getAllByRole('link', { name: 'Societies' })[0]).toHaveAttribute('href', '/societies');
  expect(screen.getByRole('link', { name: 'rumi.house@namal.edu.pk' })).toHaveAttribute('href', 'mailto:rumi.house@namal.edu.pk');
  expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeVisible();
});
