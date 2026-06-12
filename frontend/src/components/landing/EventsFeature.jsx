import React from 'react';
import { Link } from 'react-router-dom';
import courtyardImage from '../../assets/landing/namal-courtyard-display.jpg';
import LandingSectionHeading from './LandingSectionHeading';
import { formatEventDate, getEntityHref } from '../../utils/homeContent';

export default function EventsFeature({ events }) {
  const [featuredEvent, ...upcomingEvents] = events;
  if (!featuredEvent) return null;
  const featuredDate = formatEventDate(featuredEvent.startDateTime || featuredEvent.date);

  return (
    <section className="landing-section events-feature" aria-labelledby="events-title">
      <div className="landing-container">
        <div className="landing-section__topline">
          <LandingSectionHeading
            id="events-title"
            eyebrow="The Campus Calendar"
            title="Meet where the next memory begins."
            description="A live view of gatherings, competitions, workshops, and conversations across Namal."
          />
          <Link className="landing-text-link landing-text-link--light" to="/events">View Full Calendar <span aria-hidden="true">↗</span></Link>
        </div>

        <div className="events-feature__layout">
          <article className="featured-event">
            <img src={featuredEvent.image || courtyardImage} alt="Namal University courtyard and main building" loading="lazy" />
            <div className="featured-event__shade" />
            <div className="featured-event__date">
              <strong>{featuredDate.day}</strong>
              <span>{featuredDate.month}</span>
            </div>
            <div className="featured-event__content">
              <span>{featuredEvent.category || 'Featured event'}</span>
              <h3>{featuredEvent.title}</h3>
              <p>{featuredEvent.description}</p>
              <Link to={getEntityHref('events', featuredEvent)}>Event details <span aria-hidden="true">↗</span></Link>
            </div>
          </article>

          <div className="events-feature__list" aria-label="More upcoming events">
            {upcomingEvents.map((event) => {
              const eventDate = formatEventDate(event.startDateTime || event.date);
              return (
              <article className="event-row" key={event._id || event.id || event.title}>
                <time dateTime={event.startDateTime || event.date}>
                  <strong>{eventDate.day}</strong>
                  <span>{eventDate.month}</span>
                </time>
                <div>
                  <span className="event-row__category">{event.category || 'Campus event'}</span>
                  <h3>{event.title}</h3>
                  <p>{event.location || 'Namal University Campus'}</p>
                </div>
                <Link aria-label={`View ${event.title}`} to={getEntityHref('events', event)}>↗</Link>
              </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
