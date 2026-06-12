import React from 'react';
import { Link } from 'react-router-dom';
import courtyardImage from '../../assets/landing/namal-courtyard-display.jpg';
import { formatEventDate, getEntityHref } from '../../utils/homeContent';

function formatTimeRange(start, end) {
  if (!start) return '10:00 AM - 4:00 PM';
  try {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;
    
    // Fallback if Date is invalid
    if (isNaN(startDate.getTime())) return '10:00 AM - 4:00 PM';
    
    const formatTime = (d) => {
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      return `${hours}:${minutes} ${ampm}`;
    };

    if (endDate && !isNaN(endDate.getTime())) {
      return `${formatTime(startDate)} - ${formatTime(endDate)}`;
    }
    return formatTime(startDate);
  } catch (err) {
    return '10:00 AM - 4:00 PM';
  }
}

export default function EventsFeature({ events }) {
  const featuredEvent = events[0];
  if (!featuredEvent) return null;

  const featuredDate = formatEventDate(featuredEvent.startDateTime || featuredEvent.date);
  const timeRange = formatTimeRange(featuredEvent.startDateTime, featuredEvent.endDateTime);

  return (
    <section className="landing-section events-feature" aria-labelledby="events-title">
      <div className="events-feature__grid">
        {/* Left Column (Dark Green) */}
        <div className="events-feature__left">
          <div className="section-top-block">
            <span className="section-number">02</span>
            <h2 id="events-title" className="section-title">Upcoming Events</h2>
            <p className="section-desc">
              Stay engaged and be part of what's happening across Namal.
            </p>
            <Link className="landing-text-link" to="/events">
              View Full Calendar <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Big Date Counter */}
          <div className="events-feature__big-date">
            <div className="events-feature__date-block">
              <span className="big-num">{featuredDate.day}</span>
              <span className="date-sub">{featuredDate.month} {featuredDate.year}</span>
            </div>
          </div>
        </div>

        {/* Right Column (Featured Event Card) */}
        <div className="events-feature__right">
          <img 
            src={featuredEvent.image || courtyardImage} 
            alt="Namal University courtyard and main building" 
            className="events-feature__img"
          />
          <div className="events-feature__overlay">
            <span className="events-feature__tag">
              {featuredEvent.category || 'Featured Event'}
            </span>
            <h3 className="events-feature__title">{featuredEvent.title}</h3>
            <p className="events-feature__desc">{featuredEvent.description}</p>
            
            {/* Meta Row: Time & Location */}
            <div className="events-feature__meta">
              <div className="events-feature__meta-item">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{timeRange}</span>
              </div>
              <div className="events-feature__meta-item">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{featuredEvent.location || 'Namal University Campus'}</span>
              </div>
            </div>
            
            <Link 
              className="stretched-link" 
              aria-label={`View details for ${featuredEvent.title}`}
              to={getEntityHref('events', featuredEvent)}
              style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
