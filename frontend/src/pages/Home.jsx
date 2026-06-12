import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import AtriumHero from '../components/landing/AtriumHero';
import SocietiesExhibition from '../components/landing/SocietiesExhibition';
import EventsFeature from '../components/landing/EventsFeature';
import NewsEditorial from '../components/landing/NewsEditorial';
import { fallbackEvents, fallbackNews, fallbackSocieties } from '../data/homeFallbacks';
import { normalizeHomeContent } from '../utils/homeContent';
import { getEvents, getNews, getSocieties } from '../api/api';

export default function Home() {
  const rootRef = useRef(null);

  const [content, setContent] = useState(() => normalizeHomeContent({
    societies: fallbackSocieties,
    events: fallbackEvents,
    news: fallbackNews
  }));

  useEffect(() => {
    let active = true;
    Promise.allSettled([getSocieties(), getEvents(), getNews()]).then(([societies, events, news]) => {
      if (!active) return;
      setContent(normalizeHomeContent({
        societies: societies.status === 'fulfilled' ? societies.value : null,
        events: events.status === 'fulfilled' ? events.value : null,
        news: news.status === 'fulfilled' ? news.value : null
      }));
    });
    return () => { active = false; };
  }, []);

  useGSAP(() => {
    if (import.meta.env.MODE === 'test') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from('[data-section-reveal]', {
      autoAlpha: 0,
      y: 24,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out'
    });
  }, { scope: rootRef });

  return (
    <div ref={rootRef} className="landing-page">
      <AtriumHero societyCount={content.counts.societies} eventCount={content.counts.events} newsCount={content.counts.news} />
      <div data-section-reveal><SocietiesExhibition societies={content.societies} /></div>
      <div data-section-reveal><EventsFeature events={content.events} /></div>
      <div data-section-reveal><NewsEditorial news={content.news} /></div>
    </div>
  );
}
