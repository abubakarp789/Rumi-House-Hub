import React, { useRef } from 'react';
import AtriumHero from '../components/landing/AtriumHero';
import SocietiesExhibition from '../components/landing/SocietiesExhibition';
import EventsFeature from '../components/landing/EventsFeature';
import NewsEditorial from '../components/landing/NewsEditorial';
import { fallbackEvents, fallbackNews, fallbackSocieties } from '../data/homeFallbacks';

export default function Home() {
  const rootRef = useRef(null);

  const societies = fallbackSocieties;
  const events = fallbackEvents;
  const news = fallbackNews;
  const counts = {
    societies: fallbackSocieties.length,
    events: fallbackEvents.length
  };

  return (
    <div ref={rootRef} className="landing-page">
      <AtriumHero societyCount={counts.societies} eventCount={counts.events} />
      <SocietiesExhibition societies={societies} />
      <EventsFeature events={events} />
      <NewsEditorial news={news} />
    </div>
  );
}
