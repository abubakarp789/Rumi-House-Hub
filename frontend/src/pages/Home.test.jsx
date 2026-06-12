import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import Home from './Home';
import * as api from '../api/api';

vi.mock('../api/api');
vi.mock('../components/landing/AtriumHero', () => ({
  default: ({ societyCount, eventCount }) => <div>Hero counts {societyCount} / {eventCount}</div>
}));

const liveSociety = { _id: 'live-society', name: 'Live Society', description: 'Live society description.' };
const liveEvent = { _id: 'live-event', title: 'Live Event', location: 'Library', startDateTime: '2026-06-30T09:00:00Z' };
const liveNews = { _id: 'live-news', title: 'Live News', summary: 'Live news summary.', publishedAt: '2026-06-10T09:00:00Z' };

function renderHome() {
  return render(<MemoryRouter><Home /></MemoryRouter>);
}

beforeEach(() => vi.clearAllMocks());

it('renders normalized live API content', async () => {
  api.getSocieties.mockResolvedValue([liveSociety]);
  api.getEvents.mockResolvedValue([liveEvent]);
  api.getNews.mockResolvedValue([liveNews]);
  renderHome();
  expect(await screen.findByText('Live Society')).toBeVisible();
  expect(screen.getByText('Live Event')).toBeVisible();
  expect(screen.getByText('Live News')).toBeVisible();
  expect(screen.getByText('Hero counts 1 / 1')).toBeVisible();
});

it('renders authentic fallback content when requests fail', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  api.getSocieties.mockRejectedValue(new Error('offline'));
  api.getEvents.mockRejectedValue(new Error('offline'));
  api.getNews.mockRejectedValue(new Error('offline'));
  renderHome();
  await waitFor(() => expect(screen.getByText(/Literary & Debating/i)).toBeVisible());
  expect(screen.getByText(/Namal Sports Gala 2026/i)).toBeVisible();
  expect(screen.getByText(/Namal University Convocation/i)).toBeVisible();
});

it('preserves successful collections when one home request fails', async () => {
  api.getSocieties.mockResolvedValue([liveSociety]);
  api.getEvents.mockRejectedValue(new Error('events offline'));
  api.getNews.mockResolvedValue([liveNews]);
  renderHome();
  expect(await screen.findByText('Live Society')).toBeVisible();
  expect(screen.getByText('Live News')).toBeVisible();
  expect(screen.getByText(/Namal Sports Gala 2026/i)).toBeVisible();
});

it('starts all three home requests immediately', () => {
  api.getSocieties.mockReturnValue(new Promise(() => {}));
  api.getEvents.mockReturnValue(new Promise(() => {}));
  api.getNews.mockReturnValue(new Promise(() => {}));
  renderHome();
  expect(api.getSocieties).toHaveBeenCalledTimes(1);
  expect(api.getEvents).toHaveBeenCalledWith('approved');
  expect(api.getNews).toHaveBeenCalledTimes(1);
});
