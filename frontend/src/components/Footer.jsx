import React from 'react';
import { Link } from 'react-router-dom';
import crestImage from '../assets/landing/rumi-house-hub-crest-display.png';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="landing-container site-footer__grid">
        {/* Column 1: Brand & Contact */}
        <div className="site-footer__brand">
          <div className="site-footer__logo-wrap">
            <img src={crestImage} alt="Rumi House Hub crest" />
            <span>Rumi House Hub</span>
          </div>
          <p className="site-footer__brand-text">
            Namal's Central Societies Headquarters. Empowering leaders, building community, creating impact.
          </p>
          <div className="site-footer__contacts">
            <div className="site-footer__contact-item">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>Rumi House, Namal University, Mianwali, Punjab, Pakistan</span>
            </div>
            <div className="site-footer__contact-item">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <a href="mailto:rumi.house@namal.edu.pk">rumi.house@namal.edu.pk</a>
            </div>
          </div>
          {/* Social Icons */}
          <div className="site-footer__socials">
            <a href="https://facebook.com" className="site-footer__social-btn" aria-label="Facebook" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://instagram.com" className="site-footer__social-btn" aria-label="Instagram" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="https://youtube.com" className="site-footer__social-btn" aria-label="YouTube" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
            </a>
            <a href="https://linkedin.com" className="site-footer__social-btn" aria-label="LinkedIn" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>

        {/* Column 2: Explore */}
        <div className="site-footer__col">
          <h3>Explore</h3>
          <div className="site-footer__links">
            <Link to="/societies">Societies</Link>
            <Link to="/events">Events</Link>
            <Link to="/news">News</Link>
            <Link to="/events">Calendar</Link>
            <Link to="/about">About Rumi House</Link>
          </div>
        </div>

        {/* Column 3: Resources */}
        <div className="site-footer__col">
          <h3>Resources</h3>
          <div className="site-footer__links">
            <Link to="/guide">Portal Guide</Link>
            <Link to="/handbook">Student Handbook</Link>
            <Link to="/guidelines">Brand Guidelines</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>

        {/* Column 4: Newsletter */}
        <div className="site-footer__col site-footer__newsletter">
          <h3>Stay Connected</h3>
          <p>Get updates on events and opportunities.</p>
          <form className="site-footer__form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" aria-label="Email address" required />
            <button type="submit" className="site-footer__form-btn" aria-label="Subscribe">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>
        </div>


      </div>

      {/* Bottom Bar */}
      <div className="landing-container site-footer__bottom">
        <p>© {new Date().getFullYear()} Namal University. All rights reserved.</p>
        <div className="site-footer__legal">
          <Link to="/privacy">Privacy Policy</Link>
          <span>|</span>
          <Link to="/terms">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}
