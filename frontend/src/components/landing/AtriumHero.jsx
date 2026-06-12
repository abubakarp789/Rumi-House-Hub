import React from 'react';
import { Link } from 'react-router-dom';

export default function AtriumHero({ societyCount, eventCount, newsCount = 0 }) {
  return (
    <section className="atrium-hero" aria-labelledby="atrium-title">
      <div className="landing-container atrium-hero__grid">
        <div className="atrium-hero__content">
          <Link to="/societies" className="atrium-hero__purpose">
            Discover our societies <span aria-hidden="true">&rarr;</span>
          </Link>

          <h1 id="atrium-title" className="atrium-hero__title">
            <span>Namal&apos;s Central</span>
            <span className="title-societies">Societies</span>
            <span>Headquarters</span>
          </h1>

          <p className="atrium-hero__intro">
            The official coordination hub for Namal student societies, clubs, events, and co-curricular programs.
          </p>

          <div className="atrium-hero__actions">
            <Link className="landing-button landing-button--green" to="/societies">
              Explore Societies <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link className="landing-button landing-button--outline" to="/events">
              View Calendar <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <dl className="atrium-hero__metrics" aria-label="Rumi House Hub activity">
            <div className="atrium-hero__metric">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="8 11 11 14 16 9"/></svg>
              <dd>{societyCount}</dd>
              <dt>Active Societies</dt>
            </div>
            <div className="atrium-hero__metric">
              <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <dd>{eventCount}</dd>
              <dt>Upcoming Events</dt>
            </div>
            <div className="atrium-hero__metric">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>
              <dd>{newsCount}</dd>
              <dt>News Updates</dt>
            </div>
          </dl>
        </div>

        <div className="atrium-hero__visual" aria-hidden="true" />
      </div>
    </section>
  );
}
