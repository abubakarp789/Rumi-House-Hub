import React, { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as api from '../api/api';
import AtriumHero from '../components/landing/AtriumHero';
import SocietiesExhibition from '../components/landing/SocietiesExhibition';
import EventsFeature from '../components/landing/EventsFeature';
import NewsEditorial from '../components/landing/NewsEditorial';
import { fallbackEvents, fallbackNews, fallbackSocieties } from '../data/homeFallbacks';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { normalizeHomeContent } from '../utils/homeContent';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const rootRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [content, setContent] = useState(() => normalizeHomeContent({}));

  useEffect(() => {
    let active = true;

    Promise.allSettled([api.getSocieties(), api.getEvents('approved'), api.getNews()])
      .then(([societiesResult, eventsResult, newsResult]) => {
        if (!active) return;
        setContent(normalizeHomeContent({
          societies: societiesResult.status === 'fulfilled' ? societiesResult.value : undefined,
          events: eventsResult.status === 'fulfilled' ? eventsResult.value : undefined,
          news: newsResult.status === 'fulfilled' ? newsResult.value : undefined,
        }));
      });

    return () => {
      active = false;
    };
  }, []);

  useGSAP(() => {
    if (reducedMotion) return;
    const sections = gsap.utils.toArray('.landing-section');
    sections.forEach((section) => {
      gsap.from(section.querySelectorAll('.landing-section-heading, article'), {
        scrollTrigger: { trigger: section, start: 'top 78%', once: true },
        opacity: 0,
        y: 42,
        duration: 0.75,
        stagger: 0.08,
        ease: 'power3.out',
        immediateRender: false,
      });
    });
  }, { scope: rootRef, dependencies: [reducedMotion] });

  const { societies, events, news, counts } = content;

  return (
    <div ref={rootRef} className="landing-page">
      <AtriumHero societyCount={counts.societies} eventCount={counts.events} />
      <SocietiesExhibition societies={societies.length ? societies : fallbackSocieties} />
      <EventsFeature events={events.length ? events : fallbackEvents} />
      <NewsEditorial news={news.length ? news : fallbackNews} />
    </div>
  );
}
