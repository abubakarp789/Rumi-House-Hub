import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import crestImage from '../assets/landing/rumi-house-hub-crest-display.png';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  // Close drawer on route change
  useEffect(() => {
    closeMobile();
  }, [location.pathname, location.search]);

  // Focus trap & Escape listener for mobile drawer
  useEffect(() => {
    if (!mobileOpen) return undefined;
    
    const focusableSelector = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const drawerElement = document.getElementById('mobile-navigation');
    const focusableElements = drawerElement ? drawerElement.querySelectorAll(focusableSelector) : [];
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeMobile();
        return;
      }
      
      if (e.key === 'Tab') {
        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus the first element inside the drawer
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate('/');
  };

  const initials = user?.name
    ? user.name.split(' ').map((part) => part[0]).join('').toUpperCase().slice(0, 2)
    : 'RH';

  const renderNavLinks = (mobile = false) => {
    const className = (toPath) => {
      // Parse targets using a safe URL constructor helper
      const targetUrl = new URL(toPath, window.location.origin);
      const targetPath = targetUrl.pathname;
      const targetTab = targetUrl.searchParams.get('tab');
      
      const currentPath = location.pathname;
      const currentTab = new URLSearchParams(location.search).get('tab');
      
      const isPathMatch = currentPath === targetPath;
      const isTabMatch = currentTab === targetTab || (!currentTab && !targetTab);
      const isActive = isPathMatch && isTabMatch;
      
      return `${mobile ? 'site-drawer__link' : 'site-nav__link'}${isActive ? ' is-active' : ''}`;
    };

    return (
      <>
        <Link to="/societies" className={className('/societies')} onClick={closeMobile}>Societies</Link>
        <Link to="/events" className={className('/events')} onClick={closeMobile}>Events</Link>
        <Link to="/news" className={className('/news')} onClick={closeMobile}>News</Link>
        {user?.role === 'student' ? <Link to="/dashboard" className={className('/dashboard')} onClick={closeMobile}>Dashboard</Link> : null}
        {user?.role === 'executive' ? <Link to="/executive?tab=dashboard" className={className('/executive?tab=dashboard')} onClick={closeMobile}>Dashboard</Link> : null}
        {user?.role === 'executive' ? <Link to="/executive?tab=propose" className={className('/executive?tab=propose')} onClick={closeMobile}>Management</Link> : null}
        {user?.role === 'admin' ? <Link to="/admin?tab=dashboard" className={className('/admin?tab=dashboard')} onClick={closeMobile}>Dashboard</Link> : null}
        {user?.role === 'admin' ? <Link to="/admin?tab=roles" className={className('/admin?tab=roles')} onClick={closeMobile}>Management</Link> : null}
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
