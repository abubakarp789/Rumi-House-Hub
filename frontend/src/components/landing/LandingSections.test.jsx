import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import SocietiesExhibition from './SocietiesExhibition';
import EventsFeature from './EventsFeature';
import NewsEditorial from './NewsEditorial';
import { fallbackEvents, fallbackNews, fallbackSocieties } from '../../data/homeFallbacks';

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

it('renders four numbered societies and the directory link', () => {
  renderWithRouter(<SocietiesExhibition societies={fallbackSocieties} />);
  expect(screen.getAllByRole('article')).toHaveLength(4);
  expect(screen.getByRole('link', { name: /Browse All Societies/i })).toHaveAttribute('href', '/societies');
});

it('renders the featured event and calendar route', () => {
  renderWithRouter(<EventsFeature events={fallbackEvents} />);
  expect(screen.getByRole('heading', { name: /Intra-Society Debate Championship/i })).toBeVisible();
  expect(screen.getByRole('link', { name: /View Full Calendar/i })).toHaveAttribute('href', '/events');
});

it('renders the news lead and news index route', () => {
  renderWithRouter(<NewsEditorial news={fallbackNews} />);
  expect(screen.getByRole('heading', { name: /Namal Clean-Up Drive Creates a Greener Campus/i })).toBeVisible();
  expect(screen.getAllByRole('link', { name: /Read story/i })[0]).toHaveAttribute('href', '/news');
  expect(screen.getByRole('link', { name: /View All News/i })).toHaveAttribute('href', '/news');
});
