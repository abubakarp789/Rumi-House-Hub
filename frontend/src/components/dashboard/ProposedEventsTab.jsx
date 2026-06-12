import React from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../EmptyState';

export default function ProposedEventsTab({ events, setActiveTab, handleLoadAttendance }) {
  const awaitingReviewCount = events.filter(e => e.status === 'pendingApproval' || e.status === 'pending').length;
  const approvedCount = events.filter(e => e.status === 'approved').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header section with search/filter design elements */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="font-label-uppercase text-label-uppercase text-xs font-bold tracking-wider text-secondary">EXECUTIVE PORTAL</span>
          <h2 className="font-display-lg text-display-lg text-primary mt-2 font-bold text-3xl">Proposed Events</h2>
          <p className="text-sm text-on-surface-variant mt-1">Review, manage, and audit institutional event proposals for the upcoming academic semester.</p>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('propose')}
            className="bg-primary text-white px-6 py-2.5 hover:bg-primary-container font-label-uppercase text-label-uppercase text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            New Proposal
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 bg-white border border-outline-variant p-6 flex justify-between items-center shadow-sm">
          <div className="flex gap-8 md:gap-12 flex-wrap">
            <div>
              <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Total Proposals</p>
              <p className="font-headline-md text-2xl text-on-surface font-bold">{events.length}</p>
            </div>
            <div>
              <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Awaiting Review</p>
              <p className="font-headline-md text-2xl text-secondary font-bold">
                {awaitingReviewCount}
              </p>
            </div>
            <div>
              <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Approved Total</p>
              <p className="font-headline-md text-2xl text-primary font-bold">
                {approvedCount}
              </p>
            </div>
          </div>
          <div className="h-12 w-32 flex items-end gap-1 shrink-0 hidden sm:flex">
            <div className="bg-primary-fixed-dim w-3 h-1/2 rounded-t-sm"></div>
            <div className="bg-primary-container w-3 h-3/4 rounded-t-sm"></div>
            <div className="bg-primary w-3 h-full rounded-t-sm"></div>
            <div className="bg-secondary-container w-3 h-2/3 rounded-t-sm"></div>
            <div className="bg-tertiary-container w-3 h-1/3 rounded-t-sm"></div>
          </div>
        </div>
        <div className="md:col-span-4 bg-primary text-white p-6 border border-outline-variant shadow-sm flex flex-col justify-between">
          <div>
            <p className="font-label-uppercase text-[10px] opacity-80 mb-1 font-bold uppercase tracking-wider">System Notice</p>
            <p className="font-body-md text-xs leading-relaxed">All co-curricular events must satisfy seat capacity and venue regulation parameters before submission.</p>
          </div>
          <a className="text-secondary-fixed text-xs font-bold font-label-uppercase tracking-wider hover:underline inline-flex items-center gap-1 mt-3" href="#">
            View Regulations <span className="material-symbols-outlined text-[10px]">open_in_new</span>
          </a>
        </div>
      </div>

      {/* Events Portfolio Table */}
      {events.length === 0 ? (
        <EmptyState
          message="No co-curricular events have been proposed under your desk yet."
          actionLabel="Draft Event Proposal Now"
          onAction={() => setActiveTab('propose')}
        />
      ) : (
        <div className="bg-white border border-outline-variant overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant font-label-uppercase text-[10px] text-on-surface-variant font-bold">
                  <th className="px-6 py-4 tracking-wider">Event Title</th>
                  <th className="px-6 py-4 tracking-wider">Type</th>
                  <th className="px-6 py-4 tracking-wider">Date &amp; Venue</th>
                  <th className="px-6 py-4 text-center">Capacity</th>
                  <th className="px-6 py-4 text-center">RSVP</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {events.map((evt) => {
                  const dateStr = new Date(evt.startDateTime).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  });
                  const rsvpsCount = evt.rsvpsCount || evt.rsvps?.length || 0;

                  return (
                    <tr key={evt._id} className="hover:bg-surface-container-low/30 transition-colors">
                      <td className="px-6 py-5">
                        <p className="font-headline-sm text-sm text-primary font-bold leading-tight">{evt.title}</p>
                        <p className="font-body-sm text-[10px] text-on-surface-variant mt-1 font-mono uppercase">ID: {evt._id.slice(-8).toUpperCase()}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[9px] font-bold uppercase tracking-wider rounded border border-outline-variant">
                          {evt.type}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 text-on-surface font-semibold">
                          <span className="material-symbols-outlined text-xs text-primary">calendar_month</span>
                          <span>{dateStr}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-on-surface-variant mt-1">
                          <span className="material-symbols-outlined text-xs text-outline">location_on</span>
                          <span>{evt.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center font-semibold text-on-surface">{evt.capacity}</td>
                      <td className="px-6 py-5 text-center font-bold text-primary">{rsvpsCount}</td>
                      <td className="px-6 py-5">
                        {evt.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-on-tertiary-container text-on-tertiary-fixed text-[9px] font-bold border border-tertiary/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                            APPROVED
                          </span>
                        ) : evt.status === 'pendingApproval' || evt.status === 'pending' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[9px] font-bold border border-secondary/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            PENDING
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container text-[9px] font-bold border border-error/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                            REJECTED
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          {evt.status === 'approved' ? (
                            <>
                              <button 
                                onClick={() => handleLoadAttendance(evt._id, evt.title)}
                                className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-primary flex items-center justify-center border border-primary/20"
                                title="Inspect Attendance Roster"
                              >
                                <span className="material-symbols-outlined text-[16px]">group</span>
                              </button>
                              <Link 
                                to={`/events/${evt.slug || evt._id}`}
                                className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant flex items-center justify-center border border-outline-variant"
                                title="View Public Details"
                              >
                                <span className="material-symbols-outlined text-[16px]">visibility</span>
                              </Link>
                            </>
                          ) : (
                            <span className="text-[10px] text-on-surface-variant italic font-semibold uppercase">
                              Locked
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
