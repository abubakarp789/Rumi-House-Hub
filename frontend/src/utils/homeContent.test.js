import { describe, expect, it } from 'vitest';
import {
  formatEventDate,
  formatTimeAgo,
  getEntityHref,
  normalizeHomeContent
} from './homeContent';
import { fallbackEvents, fallbackNews, fallbackSocieties } from '../data/homeFallbacks';

describe('home content utilities', () => {
  it('formats event dates without browser-locale drift', () => {
    expect(formatEventDate('2026-06-15T09:00:00Z')).toEqual({
      day: '15',
      month: 'JUN',
      year: '2026'
    });
  });

  it('formats relative dates against an injected clock', () => {
    const now = new Date('2026-06-12T12:00:00Z').getTime();
    expect(formatTimeAgo('2026-06-12T08:00:00Z', now)).toBe('Today');
    expect(formatTimeAgo('2026-06-11T08:00:00Z', now)).toBe('Yesterday');
    expect(formatTimeAgo('2026-06-08T08:00:00Z', now)).toBe('4 days ago');
  });

  it('links live entities to details and fallbacks to indexes', () => {
    expect(getEntityHref('societies', { _id: 'live' })).toBe('/societies/live');
    expect(getEntityHref('societies', { _id: 'fallback', isFallback: true })).toBe('/societies');
  });

  it('sorts live data and fills missing collections', () => {
    const result = normalizeHomeContent({
      societies: [],
      events: [
        { _id: 'later', startDateTime: '2026-07-01' },
        { _id: 'sooner', startDateTime: '2026-06-20' }
      ],
      news: []
    });

    expect(result.societies).toEqual(fallbackSocieties);
    expect(result.events.map((event) => event._id)).toEqual(['sooner', 'later']);
    expect(result.news).toEqual(fallbackNews);
    expect(result.counts.societies).toBe(fallbackSocieties.length);
  });

  it('keeps fallback events chronological', () => {
    expect(fallbackEvents.map((event) => event._id)).toEqual([
      'fallback-sports-gala',
      'fallback-blood-drive',
      'fallback-ai-workshop'
    ]);
  });
});
