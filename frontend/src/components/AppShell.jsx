import React, { useContext, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function AppShell() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };

  const closeSidebar = () => setSidebarOpen(false);

  // Extract query tab to highlight sidebar active state
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'default';

  // Extract initials
  const initials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) 
    : 'U';

  // Helper function to check active state for non-tab links
  const isPathActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="app-shell">
      {/* Repeating background texture grid */}
      <div className="campus-grid pointer-events-none"></div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Institutional Sidebar Navigation */}
      <aside className={`app-sidebar transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Mobile close button */}
        <button
          onClick={closeSidebar}
          className="md:hidden absolute top-5 right-4 flex items-center justify-center w-8 h-8 rounded-lg text-on-surface-variant hover:text-primary transition-colors"
          aria-label="Close sidebar"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="app-sidebar-brand flex flex-col items-center text-center">
          <img src={logo} alt="Rumi House Hub logo" className="w-16 h-16 object-contain mb-3 hover:scale-105 transition-transform duration-300" />
          <h1>Rumi House Hub</h1>
          <p>Namal University Portal</p>
        </div>

        <nav className="app-sidebar-nav">
          {/* STUDENT MENU ITEMS */}
          {user?.role === 'student' && (
            <>
              <Link
                to="/dashboard?tab=memberships"
                className={`app-sidebar-link ${
                  activeTab === 'memberships' || activeTab === 'default' ? 'active' : ''
                }`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">dashboard</span>
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/societies" 
                className={`app-sidebar-link ${isPathActive('/societies') ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">groups</span>
                <span>Societies</span>
              </Link>
              <Link 
                to="/events" 
                className={`app-sidebar-link ${isPathActive('/events') ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">event</span>
                <span>Events</span>
              </Link>
              <Link
                to="/dashboard?tab=memberships"
                className={`app-sidebar-link ${activeTab === 'memberships' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">card_membership</span>
                <span>My Memberships</span>
              </Link>
              <Link
                to="/dashboard?tab=rsvps"
                className={`app-sidebar-link ${activeTab === 'rsvps' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">qr_code_2</span>
                <span>My Passes</span>
              </Link>
              <Link 
                to="/news" 
                className={`app-sidebar-link ${isPathActive('/news') ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">newspaper</span>
                <span>News</span>
              </Link>
              <Link
                to="/dashboard?tab=profile"
                className={`app-sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">person</span>
                <span>Profile</span>
              </Link>
            </>
          )}

          {/* EXECUTIVE MENU ITEMS */}
          {user?.role === 'executive' && (
            <>
              <Link
                to="/executive?tab=dashboard"
                className={`app-sidebar-link ${
                  activeTab === 'dashboard' || activeTab === 'default' ? 'active' : ''
                }`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">dashboard</span>
                <span>Dashboard</span>
              </Link>
              <Link
                to="/executive?tab=society"
                className={`app-sidebar-link ${activeTab === 'society' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">domain</span>
                <span>My Society</span>
              </Link>
              <Link
                to="/executive?tab=propose"
                className={`app-sidebar-link ${activeTab === 'propose' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">add_box</span>
                <span>Propose Event</span>
              </Link>
              <Link
                to="/executive?tab=events"
                className={`app-sidebar-link ${activeTab === 'events' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">list_alt</span>
                <span>Proposed Events</span>
              </Link>
              <Link
                to="/executive?tab=attendance"
                className={`app-sidebar-link ${activeTab === 'attendance' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">how_to_reg</span>
                <span>Attendance</span>
              </Link>
              <Link 
                to="/news" 
                className={`app-sidebar-link ${isPathActive('/news') ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">newspaper</span>
                <span>News</span>
              </Link>
              <Link
                to="/executive?tab=profile"
                className={`app-sidebar-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">person</span>
                <span>Profile</span>
              </Link>
            </>
          )}

          {/* ADMIN MENU ITEMS */}
          {user?.role === 'admin' && (
            <>
              <Link
                to="/admin?tab=dashboard"
                className={`app-sidebar-link ${
                  activeTab === 'dashboard' || activeTab === 'default' ? 'active' : ''
                }`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">admin_panel_settings</span>
                <span>Dashboard</span>
              </Link>
              <Link
                to="/admin?tab=roles"
                className={`app-sidebar-link ${activeTab === 'roles' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">manage_accounts</span>
                <span>Users & Roles</span>
              </Link>
              <Link
                to="/admin?tab=societies"
                className={`app-sidebar-link ${activeTab === 'societies' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">corporate_fare</span>
                <span>Societies</span>
              </Link>
              <Link
                to="/admin?tab=memberships"
                className={`app-sidebar-link ${activeTab === 'memberships' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">playlist_add_check</span>
                <span>Membership Requests</span>
              </Link>
              <Link
                to="/admin?tab=events"
                className={`app-sidebar-link ${activeTab === 'events' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">rule_folder</span>
                <span>Event Approvals</span>
              </Link>
              <Link
                to="/admin?tab=news"
                className={`app-sidebar-link ${activeTab === 'news' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">newspaper</span>
                <span>News Management</span>
              </Link>
              <Link
                to="/admin?tab=attendance"
                className={`app-sidebar-link ${activeTab === 'attendance' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">query_stats</span>
                <span>Attendance Overview</span>
              </Link>
              <Link
                to="/admin?tab=settings"
                className={`app-sidebar-link ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={closeSidebar}
              >
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
              </Link>
            </>
          )}
        </nav>

        {/* User profile footer panel of Sidebar */}
        <div className="app-sidebar-footer">
          <div className="app-sidebar-user">
            <div className="app-sidebar-avatar">
              {initials}
            </div>
            <div className="app-sidebar-user-info">
              <p className="app-sidebar-user-name">
                {user?.name || 'User Name'}
              </p>
              <p className="app-sidebar-user-role">
                {user?.role || 'Guest'} Desk
              </p>
            </div>
          </div>
          <button
            onClick={handleLogoutClick}
            className="app-sidebar-logout"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area next to Sidebar */}
      <main className="app-main-content">
        {/* Sticky Dashboard Header */}
        <header className="app-header">
          <div className="app-header-left flex items-center gap-4">
            {/* Mobile hamburger — visible only below md */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-outline-variant bg-surface text-on-surface-variant hover:text-primary transition-colors -ml-2"
              aria-label="Open sidebar"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <span className="app-header-eyebrow">
                NAMAL UNIVERSITY / {user?.role?.toUpperCase()} PORTAL
              </span>
              <h2 className="app-header-title">
                {user?.role === 'admin' && 'Administrator Console'}
                {user?.role === 'executive' && 'Executive Society Desk'}
                {user?.role === 'student' && 'Student Academic Hub'}
              </h2>
            </div>
          </div>
          <div className="app-header-right">
            <div className="app-header-meta">
              <p className="app-header-meta-eyebrow">ACADEMIC YEAR</p>
              <p className="app-header-meta-value">2025 - 2026</p>
            </div>
            <div className="app-header-icon">
              🏛️
            </div>
          </div>
        </header>

        {/* Content Area inside Canvas */}
        <div className="app-content-canvas">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
