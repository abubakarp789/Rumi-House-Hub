import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api/api';
import EventCard from '../components/EventCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { AuthContext } from '../context/AuthContext';

const TABS = ['All', 'Upcoming', 'Past'];

export default function Events() {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError('');

        if (activeTab === 'All') {
          const [upcoming, past] = await Promise.all([api.getEvents('upcoming'), api.getEvents('past')]);
          setEvents([...upcoming, ...past]);
        } else {
          setEvents(await api.getEvents(activeTab === 'Upcoming' ? 'upcoming' : 'past'));
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch event records from the MERN API.');
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [activeTab]);

  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full pt-10">
      {/* Editorial Hero / Page Header */}
      <section className="grid grid-cols-12 gap-gutter mb-12 items-end animate-fade-in-up">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4 text-left">
          <span className="atrium-eyebrow mb-2 block">
            NAMAL HUB / ACADEMIC YEAR {new Date().getFullYear()}
          </span>
          <h2 className="atrium-h1 text-[2.8rem] leading-tight mb-6">
            The Calendar of Excellence.
          </h2>
          <p className="atrium-desc max-w-2xl">
            Discover co-curricular workshops, seminars, and competitive sprints designed to bridge the gap between classroom theory and real-world leadership.
          </p>
        </div>
      </section>

      {/* Tabs & Filter Bar Section */}
      <section className="mb-10 animate-fade-in-up animate-delay-100">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e9e7] pb-4">
          <div className="flex gap-8" aria-label="Event Status">
            {TABS.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                  className={`atrium-tab-btn ${isSelected ? 'active' : ''}`}
                >
                  {tab} Events
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Link 
              to={
                !user 
                  ? '/login' 
                  : user.role === 'admin' 
                  ? '/admin?tab=events' 
                  : user.role === 'executive' 
                  ? '/executive?tab=events' 
                  : '/dashboard?tab=rsvps'
              }
              className="atrium-btn-outline px-5 py-2.5 flex items-center gap-2 rounded text-xs !font-bold"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              {!user 
                ? 'My Reservations' 
                : user.role === 'admin' 
                ? 'Manage Events' 
                : user.role === 'executive' 
                ? 'Executive Events' 
                : 'My Reservations'}
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <div className="p-4 mb-6 bg-error-container text-on-error-container border border-error rounded text-sm animate-fade-in-up" role="alert">
          {error}
        </div>
      )}

      {/* Events Bento Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <LoadingState count={6} />
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          message={`No ${activeTab.toLowerCase()} events scheduled at this moment.`}
          actionLabel="View All Events"
          onAction={() => setActiveTab('All')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-fade-in-up">
          {events.map((evt) => (
            <EventCard key={evt._id} event={evt} />
          ))}

          {/* Prompt Placeholder Card */}
          {user?.role === 'executive' && <div className="border-2 border-dashed border-[#b58a46]/40 flex flex-col items-center justify-center p-8 gap-6 text-center bg-white/60 hover:-translate-y-1 hover:border-[var(--atrium-green)] hover:shadow-md rounded transition-all duration-300 group animate-fade-in-up animate-delay-300">
            <div className="w-16 h-16 rounded-full bg-[#f4f6f5] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <span className="material-symbols-outlined text-3xl text-[var(--atrium-green)]">add_circle</span>
            </div>
            <div>
              <h3 className="atrium-card-title text-xl font-semibold mb-2">Propose an Event</h3>
              <p className="font-body-sm text-body-sm text-[#50665b] leading-relaxed">
                Have an initiative for your society? Propose it now to active members and administrators.
              </p>
            </div>
            <Link 
              to="/executive?tab=propose"
              className="font-label-uppercase text-label-uppercase text-[var(--atrium-green)] hover:text-[var(--atrium-gold)] underline font-bold transition-colors"
            >
              Start Proposal Flow
            </Link>
          </div>}
        </div>
      )}
    </div>
  );
}
