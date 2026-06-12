import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import AtriumHero from './AtriumHero';

it('keeps the complete hero usable without animation', () => {
  render(
    <MemoryRouter>
      <AtriumHero societyCount={15} eventCount={6} />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', {
    level: 1,
    name: /Namal's Central Societies Headquarters/i
  })).toBeVisible();
  expect(screen.getByRole('link', { name: /Explore Societies/i })).toHaveAttribute('href', '/societies');
  expect(screen.getByRole('link', { name: /View Calendar/i })).toHaveAttribute('href', '/events');
});
