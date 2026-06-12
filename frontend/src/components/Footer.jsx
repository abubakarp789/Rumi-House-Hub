import React from 'react';
import { Link } from 'react-router-dom';
import crestImage from '../assets/landing/rumi-house-hub-crest-display.png';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="landing-container site-footer__top">
        <div className="site-footer__brand">
          <img src={crestImage} alt="Rumi House Hub crest" />
          <div>
            <span>Rumi House Hub</span>
            <p>One home for Namal University&apos;s student communities, campus experiences, and shared ambition.</p>
          </div>
        </div>
        <div className="site-footer__statement">
          <span>Build community.</span>
          <strong>Shape campus.</strong>
        </div>
      </div>

      <div className="landing-container site-footer__links">
        <div>
          <h2>Explore</h2>
          <Link to="/societies">Society Directory</Link>
          <Link to="/events">Event Calendar</Link>
          <Link to="/news">Campus News</Link>
        </div>
        <div>
          <h2>Namal</h2>
          <a href="https://namal.edu.pk" target="_blank" rel="noreferrer">University Website</a>
          <a href="https://namal.edu.pk/about" target="_blank" rel="noreferrer">About Namal</a>
          <a href="https://namal.edu.pk/contact" target="_blank" rel="noreferrer">Campus Contact</a>
        </div>
        <div>
          <h2>Connect</h2>
          <a href="mailto:info@namal.edu.pk">info@namal.edu.pk</a>
          <span>30 KM Talagang Road</span>
          <span>Mianwali, Pakistan</span>
        </div>
      </div>

      <div className="landing-container site-footer__bottom">
        <p>© {new Date().getFullYear()} Namal University. Rumi House Hub.</p>
        <Link to="/">Back to the atrium <span aria-hidden="true">↑</span></Link>
      </div>
    </footer>
  );
}
