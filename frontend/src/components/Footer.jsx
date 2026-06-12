import React from 'react';
import { Link } from 'react-router-dom';
import crestImage from '../assets/landing/rumi-house-hub-crest-display.png';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="landing-container site-footer__grid">
        <div className="site-footer__brand">
          <div className="site-footer__logo-wrap">
            <img src={crestImage} alt="Rumi House Hub crest" />
            <span>Rumi House Hub</span>
          </div>
          <p className="site-footer__brand-text">
            Namal&apos;s central portal for student societies, events, membership, and attendance.
          </p>
          <div className="site-footer__contacts">
            <div className="site-footer__contact-item">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>Rumi House, Namal University, Mianwali, Punjab, Pakistan</span>
            </div>
            <div className="site-footer__contact-item">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z"/><polyline points="22,6 12,13 2,6"/></svg>
              <a href="mailto:rumi.house@namal.edu.pk">rumi.house@namal.edu.pk</a>
            </div>
          </div>
        </div>

        <div className="site-footer__col">
          <h3>Explore</h3>
          <div className="site-footer__links">
            <Link to="/societies">Societies</Link>
            <Link to="/events">Events</Link>
            <Link to="/news">News</Link>
          </div>
        </div>

        <div className="site-footer__col">
          <h3>Account</h3>
          <div className="site-footer__links">
            <Link to="/login">Sign In</Link>
            <Link to="/register">Create Student Account</Link>
          </div>
        </div>
      </div>

      <div className="landing-container site-footer__bottom">
        <p>&copy; {new Date().getFullYear()} Namal University. All rights reserved.</p>
      </div>
    </footer>
  );
}
