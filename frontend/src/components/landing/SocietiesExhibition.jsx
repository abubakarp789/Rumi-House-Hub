import React from 'react';
import { Link } from 'react-router-dom';
import LandingSectionHeading from './LandingSectionHeading';
import { getEntityHref } from '../../utils/homeContent';

export default function SocietiesExhibition({ societies }) {
  return (
    <section className="landing-section societies-exhibition" aria-labelledby="societies-title">
      <div className="landing-container">
        <div className="landing-section__topline">
          <LandingSectionHeading
            id="societies-title"
            eyebrow="The Society Exhibition"
            title="Find the room that feels like yours."
            description="From debate and computing to service, media, and sport, every society adds a new perspective to campus life."
          />
          <Link className="landing-text-link" to="/societies">Browse All Societies <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="societies-exhibition__grid">
          {societies.map((society, index) => (
            <article className={`society-card${index === 0 ? ' society-card--featured' : ''}`} key={society._id || society.id || society.name}>
              <span className="society-card__number">{String(index + 1).padStart(2, '0')}</span>
              <div className="society-card__body">
                <span className="society-card__category">{society.categoryLabel || society.category || 'Student Society'}</span>
                <h3>{society.name}</h3>
                <p>{society.description}</p>
                <Link aria-label={`Discover ${society.name}`} to={getEntityHref('societies', society)}>
                  Discover society <span aria-hidden="true">→</span>
                </Link>
              </div>
              {society.memberCount ? <span className="society-card__members">{society.memberCount}+ members</span> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
