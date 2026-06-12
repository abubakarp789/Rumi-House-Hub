import { fallbackEvents, fallbackNews, fallbackSocieties } from '../data/homeFallbacks';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function formatEventDate(value) {
  const date = new Date(value);
  return {
    day: String(date.getUTCDate()).padStart(2, '0'),
    month: MONTHS[date.getUTCMonth()],
    year: String(date.getUTCFullYear())
  };
}

export function formatTimeAgo(value, now = Date.now()) {
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.max(0, Math.floor((now - new Date(value).getTime()) / dayMs));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export function getEntityHref(collection, entity) {
  if (!entity?._id || entity.isFallback) return `/${collection}`;
  return `/${collection}/${entity._id}`;
}

export function normalizeHomeContent({ societies, events, news }) {
  const resolvedSocieties = societies?.length ? societies : fallbackSocieties;
  const resolvedEvents = events?.length
    ? [...events].sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
    : fallbackEvents;
  const resolvedNews = news?.length
    ? [...news].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    : fallbackNews;

  return {
    societies: resolvedSocieties.slice(0, 5),
    events: resolvedEvents.slice(0, 4),
    news: resolvedNews.slice(0, 4),
    counts: {
      societies: societies?.length || fallbackSocieties.length,
      events: events?.length || fallbackEvents.length,
      news: news?.length || fallbackNews.length
    }
  };
}
