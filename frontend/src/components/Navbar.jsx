import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import crestImage from '../assets/landing/rumi-house-hub-crest-display.png';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);
  const handleLogout = () => {
    logout();
    closeMobile();
    navigate('/');
  };
  const initials = user?.name
    ? user.name.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2)
    : 'RH';

  const renderNavLinks = (mobile = false) => {
    const className = ({ isActive }) => `${mobile ? 'site-drawer__link' : 'site-nav__link'}${isActive ? ' is-active' : ''}`;
    return (
      <>
        <NavLink to="/societies" className={className} onClick={closeMobile}>Societies</NavLink>
        <NavLink to="/events" className={className} onClick={closeMobile}>Events</NavLink>
        <NavLink to="/news" className={className} onClick={closeMobile}>News</NavLink>
        {user?.role === 'student' ? <NavLink to="/dashboard" className={className} onClick={closeMobile}>Dashboard</NavLink> : null}
        {user?.role === 'executive' ? <NavLink to="/executive?tab=dashboard" className={className} onClick={closeMobile}>Dashboard</NavLink> : null}
        {user?.role === 'executive' ? <NavLink to="/executive?tab=propose" className={className} onClick={closeMobile}>Management</NavLink> : null}
        {user?.role === 'admin' ? <NavLink to="/admin?tab=dashboard" className={className} onClick={closeMobile}>Dashboard</NavLink> : null}
        {user?.role === 'admin' ? <NavLink to="/admin?tab=roles" className={className} onClick={closeMobile}>Management</NavLink> : null}
      </>
    );
  };

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="site-header__inner">
        <Link className="site-brand" to="/" aria-label="Rumi House Hub home">
          <img src={crestImage} alt="Rumi House Hub crest" />
          <span>Rumi House Hub</span>
        </Link>

        <nav className="site-nav" aria-label="Main Navigation">
          {renderNavLinks()}
        </nav>

        <div className="site-header__actions">
          <div className="site-header__search">
            <input type="text" placeholder="Search Portal..." aria-label="Search Portal" />
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {user ? (
            <div className="site-account">
              <span className="site-account__avatar" title={`${user.name} (${user.role})`}>{initials}</span>
              <button type="button" onClick={handleLogout} className="site-header__signin">Sign out</button>
            </div>
          ) : (
            <Link className="site-header__signin" to="/login">Sign In</Link>
          )}
          <button
            type="button"
            className="site-menu-button"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen(true)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="site-drawer-layer">
          <button className="site-drawer__backdrop" type="button" aria-label="Dismiss navigation overlay" onClick={closeMobile} />
          <nav id="mobile-navigation" className="site-drawer" aria-label="Mobile Navigation">
            <div className="site-drawer__header">
              <span>Navigation</span>
              <button type="button" aria-label="Close menu" onClick={closeMobile}>×</button>
            </div>
            <div className="site-drawer__links">{renderNavLinks(true)}</div>
            <div className="site-drawer__footer">
              {user ? (
                <button type="button" onClick={handleLogout}>Sign out · {user.name}</button>
              ) : (
                <Link to="/login" onClick={closeMobile}>Sign in to the hub <span aria-hidden="true">→</span></Link>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
