import React from 'react';
import { Link } from 'react-router-dom';
import { getEntityHref } from '../../utils/homeContent';

function getSocietyIcon(label) {
  const normLabel = String(label).toLowerCase();
  if (normLabel.includes('literary') || normLabel.includes('debate')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    );
  }
  if (normLabel.includes('computing') || normLabel.includes('tech')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
        <line x1="14" y1="4" x2="10" y2="20"/>
      </svg>
    );
  }
  if (normLabel.includes('media') || normLabel.includes('photo')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    );
  }
  if (normLabel.includes('sport') || normLabel.includes('wellness') || normLabel.includes('adventure')) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0 5.4 5.4 0 0 0 0 7.65l.77.78L12 21l7.78-7.78.77-.78a5.4 5.4 0 0 0 0-7.65z"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  );
}

export default function SocietiesExhibition({ societies }) {
  // We only show the 4 societies from the user's design image
  const displaySocieties = societies.slice(0, 4);

  return (
    <section id="societies" className="landing-section societies-exhibition" aria-labelledby="societies-title">
      <div className="landing-container">
        {/* Section Header */}
        <div className="section-top-block">
          <span className="section-number">01</span>
          <div className="section-title-wrap">
            <div className="section-heading-block">
              <h2 id="societies-title" className="section-title">Active Societies</h2>
              <p className="section-desc">
                The pillars of our intellectual and social community. Explore {societies.length} featured groups.
              </p>
            </div>
            <Link className="landing-text-link" to="/societies">
              Browse All Societies <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Societies 4-Column Grid */}
        <div className="societies-exhibition__grid" data-testid="societies-grid">
          {displaySocieties.map((society, index) => {
            const cardNumber = String(index + 1).padStart(2, '0');
            const categoryLabel = society.categoryLabel || society.category || 'Student Society';
            return (
              <article className="society-card" key={society._id || society.id || society.name}>
                <div className="society-card__header">
                  <span className="society-card__num">{cardNumber}</span>
                  <div className="society-card__icon-wrap">
                    {getSocietyIcon(categoryLabel)}
                  </div>
                </div>
                <div className="society-card__body">
                  <h3 className="society-card__title">{society.name}</h3>
                  <p className="society-card__desc">{society.description}</p>
                </div>
                <div className="society-card__footer">
                  <span className="society-card__est">EST. {society.estYear || '2010'}</span>
                  <span className="society-card__tag">{categoryLabel}</span>
                </div>
                <Link 
                  className="stretched-link" 
                  aria-label={`Discover ${society.name}`} 
                  to={getEntityHref('societies', society)}
                  style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0 }}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
