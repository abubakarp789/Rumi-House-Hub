import React, { useContext, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '🏛️';

  const linkClass = ({ isActive }) => 
    `font-label-uppercase text-label-uppercase pb-1 transition-colors ${
      isActive 
        ? 'text-primary border-b-2 border-primary' 
        : 'text-on-surface-variant hover:text-primary'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `block px-4 py-3 font-label-uppercase text-label-uppercase transition-colors ${
      isActive
        ? 'text-primary bg-primary-container/20 border-l-4 border-primary'
        : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
    }`;

  const closeMobile = () => setMobileOpen(false);

  /* Shared nav links rendered for both desktop and mobile */
  const renderNavLinks = (className) => (
    <>
      <NavLink to="/societies" className={className} onClick={closeMobile}>
        Societies
      </NavLink>
      <NavLink to="/events" className={className} onClick={closeMobile}>
        Events
      </NavLink>
      <NavLink to="/news" className={className} onClick={closeMobile}>
        News
      </NavLink>

      {user && (
        <>
          {user.role === 'student' && (
            <NavLink to="/dashboard" className={className} onClick={closeMobile}>
              Dashboard
            </NavLink>
          )}
          {user.role === 'executive' && (
            <>
              <NavLink to="/executive?tab=dashboard" className={className} onClick={closeMobile}>
                Dashboard
              </NavLink>
              <NavLink to="/executive?tab=propose" className={className} onClick={closeMobile}>
                Management
              </NavLink>
            </>
          )}
          {user.role === 'admin' && (
            <>
              <NavLink to="/admin?tab=dashboard" className={className} onClick={closeMobile}>
                Dashboard
              </NavLink>
              <NavLink to="/admin?tab=roles" className={className} onClick={closeMobile}>
                Management
              </NavLink>
            </>
          )}
        </>
      )}
    </>
  );

  return (
    <header className="bg-surface border-b border-outline-variant fixed top-0 w-full z-50 h-20 flex items-center">
      <a className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white focus:text-primary z-50" href="#main-content">
        Skip to main content
      </a>
      
      <div className="flex justify-between items-center w-full px-margin-desktop max-w-container-max mx-auto">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={logo} alt="Rumi House Hub logo" className="w-8 h-8 object-contain" />
            <span className="font-display-lg text-headline-sm text-primary font-bold tracking-tight">
              Rumi House Hub
            </span>
          </Link>
        </div>

        {/* Navigation Middle Links — Desktop */}
        <nav className="hidden md:flex gap-8 items-center" aria-label="Main Navigation">
          {renderNavLinks(linkClass)}
        </nav>

        {/* Search Bar & Profile Block */}
        <div className="flex items-center gap-6">
          {/* Portal Search */}
          <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-lg border border-outline-variant">
            <span className="material-symbols-outlined text-on-surface-variant mr-2 text-lg">search</span>
            <input 
              type="text" 
              placeholder="Search Portal..." 
              className="bg-transparent border-none focus:ring-0 text-body-sm p-0 w-32 placeholder-on-surface-variant/50 focus:outline-none"
            />
          </div>

          {/* Profile/Auth Button Block */}
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={handleLogoutClick} 
                title="Logout" 
                className="bg-transparent border-0 cursor-pointer flex items-center text-on-surface-variant hover:text-error transition-colors"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>
              <div 
                title={`${user.name} (${user.role})`}
                className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm border border-outline shadow-sm uppercase cursor-default"
              >
                {initials}
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="hidden md:inline-block bg-primary text-white px-6 py-2 font-label-uppercase text-label-uppercase transition-all hover:bg-primary-container hover:text-on-primary-container border border-primary text-xs"
            >
              Sign In
            </Link>
          )}

          {/* Hamburger — Mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-outline-variant bg-surface text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeMobile}
          />

          {/* Drawer */}
          <nav
            className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-surface shadow-xl flex flex-col animate-slide-in-right"
            aria-label="Mobile Navigation"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 h-20 border-b border-outline-variant shrink-0">
              <span className="font-display-lg text-headline-sm text-primary font-bold tracking-tight">
                Menu
              </span>
              <button
                onClick={closeMobile}
                className="flex items-center justify-center w-10 h-10 rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex-1 overflow-y-auto py-4">
              {renderNavLinks(mobileLinkClass)}
            </div>

            {/* Drawer Footer — Auth */}
            <div className="border-t border-outline-variant p-4 shrink-0">
              {user ? (
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm border border-outline shadow-sm uppercase cursor-default shrink-0"
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface truncate">{user.name}</p>
                    <p className="text-xs text-on-surface-variant capitalize">{user.role}</p>
                  </div>
                  <button
                    onClick={() => { handleLogoutClick(); closeMobile(); }}
                    title="Logout"
                    className="bg-transparent border-0 cursor-pointer flex items-center text-on-surface-variant hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobile}
                  className="block w-full text-center bg-primary text-white px-6 py-2.5 font-label-uppercase text-label-uppercase transition-all hover:bg-primary-container hover:text-on-primary-container border border-primary text-xs"
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 250ms cubic-bezier(.16, 1, .3, 1);
        }
      `}</style>
    </header>
  );
}
