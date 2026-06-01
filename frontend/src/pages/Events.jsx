import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api/api';
import EventCard from '../components/EventCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

const TABS = ['All', 'Upcoming', 'Past'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError('');

        let statusFilter = '';
        if (activeTab === 'Upcoming') statusFilter = 'approved';
        else if (activeTab === 'Past') statusFilter = 'past';

        const data = await api.getEvents(statusFilter);
        setEvents(activeTab === 'All' ? data.filter((e) => e.status === 'approved' || e.status === 'past') : data);
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
    <div className="p-margin-desktop max-w-container-max mx-auto w-full pt-10">
      {/* Editorial Hero / Page Header */}
      <section className="grid grid-cols-12 gap-gutter mb-12 items-end">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
          <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block">
            NAMAL HUB / ACADEMIC YEAR 2024
          </span>
          <h2 className="font-display-lg text-display-lg text-primary leading-none">
            The Calendar of Excellence.
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Discover co-curricular workshops, seminars, and competitive sprints designed to bridge the gap between classroom theory and real-world leadership.
          </p>
        </div>
        <div className="col-span-12 lg:col-span-4 flex items-end justify-end">
          <div className="editorial-shadow bg-white border border-outline-variant p-6 flex flex-col gap-2 w-full max-w-sm">
            <span className="font-label-uppercase text-label-uppercase text-primary font-bold">Featured Today</span>
            <span className="font-headline-sm text-headline-sm text-on-surface leading-tight">Co-Curricular Showcase</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant font-semibold">4:00 PM • Campus Aud</span>
          </div>
        </div>
      </section>

      {/* Tabs & Filter Bar Section */}
      <section className="mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant pb-4">
          <div className="flex gap-8" aria-label="Event Status">
            {TABS.map((tab) => {
              const isSelected = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                  className={`font-label-uppercase text-label-uppercase pb-2 transition-colors ${
                    isSelected 
                      ? 'text-primary border-b-2 border-primary font-bold' 
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {tab} Events
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Link 
              to="/dashboard" 
              className="bg-surface-container border border-outline-variant px-4 py-2 flex items-center gap-2 hover:bg-surface-container-high transition-all text-xs font-label-uppercase text-label-uppercase font-semibold text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              My Reservations
            </Link>
          </div>
        </div>
      </section>

      {error && (
        <div className="p-4 mb-6 bg-error-container text-on-error-container border border-error rounded text-sm" role="alert">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {events.map((evt) => (
            <EventCard key={evt._id} event={evt} />
          ))}

          {/* Prompt Placeholder Card */}
          <div className="border-2 border-dashed border-outline-variant flex flex-col items-center justify-center p-8 gap-4 text-center bg-white/50">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-primary">add_circle</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Propose an Event</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Have an initiative for your society? Propose it now to active members and administrators.
              </p>
            </div>
            <Link 
              to="/dashboard"
              className="font-label-uppercase text-label-uppercase text-primary underline font-bold"
            >
              Start Proposal Flow
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
