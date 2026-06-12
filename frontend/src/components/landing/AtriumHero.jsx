import React from 'react';
import { Link } from 'react-router-dom';

export default function AtriumHero({ societyCount, eventCount }) {
  return (
    <section 
      className="atrium-hero" 
      aria-labelledby="atrium-title"
    >
      <div className="landing-container atrium-hero__grid">
        {/* Left Side: Content */}
        <div className="atrium-hero__content">
          <Link to="/about" className="atrium-hero__purpose">
            Discover our purpose <span aria-hidden="true">→</span>
          </Link>
          
          <h1 id="atrium-title" className="atrium-hero__title">
            <span>Namal&apos;s Central</span>
            <span className="title-societies">Societies</span>
            <span>Headquarters</span>
          </h1>
          
          <p className="atrium-hero__intro">
            Serving as the official coordination office and creative community hub for all Namal student societies, clubs, and co-curricular programs overlooking Namal Lake.
          </p>
          
          <div className="atrium-hero__actions">
            <Link className="landing-button landing-button--green" to="/societies">
              Explore Societies <span aria-hidden="true">→</span>
            </Link>
            <Link className="landing-button landing-button--outline" to="/events">
              View Calendar <span aria-hidden="true">→</span>
            </Link>
          </div>
          
          {/* Stats Metrics with SVGs */}
          <dl className="atrium-hero__metrics" aria-label="Rumi House Hub activity">
            <div className="atrium-hero__metric">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="8 11 11 14 16 9"/>
              </svg>
              <dd>{societyCount}+</dd>
              <dt>Active Societies</dt>
            </div>
            
            <div className="atrium-hero__metric">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <dd>3000+</dd>
              <dt>Students Engaged</dt>
            </div>
            
            <div className="atrium-hero__metric">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <dd>{eventCount}+</dd>
              <dt>Signature Events</dt>
            </div>
          </dl>
        </div>

        {/* Right Side: Spacer column so background image on right is visible */}
        <div className="atrium-hero__visual" aria-hidden="true" />
      </div>
    </section>
  );
}
