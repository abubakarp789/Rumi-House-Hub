import React from 'react';
import EmptyState from '../EmptyState';

export default function SocietyRosterTab({ societies, events, setActiveTab, user }) {
  return (
    <div className="space-y-10 animate-fade-in">
      {societies.length === 0 ? (
        <EmptyState message="No assigned societies under your representative charge." />
      ) : (
        societies.map((soc) => {
          // Filter events belonging to this specific society
          const socEvents = events.filter(
            (evt) => evt.societyId === soc._id || evt.societyId?._id === soc._id
          );
          
          return (
            <div key={soc._id} className="space-y-8">
              {/* Bento Grid Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Society Overview (Asymmetric - 8 cols) */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                  {/* Identity Card */}
                  <div className="bg-white border border-outline-variant p-6 md:p-8 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/10 -mr-16 -mt-16 rounded-full"></div>
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div>
                          <span className="font-label-uppercase text-label-uppercase text-secondary tracking-[0.2em] mb-2 block text-xs uppercase font-bold">
                            SOCIETY PROFILE
                          </span>
                          <h3 className="font-headline-md text-headline-md text-primary font-bold text-2xl">
                            {soc.name}
                          </h3>
                          <p className="font-body-lg text-on-surface-variant mt-2 text-sm leading-relaxed max-w-2xl">
                            {soc.description}
                          </p>
                        </div>
                        <div className="bg-surface-container-low p-4 text-center border border-outline-variant min-w-[120px] self-start md:self-auto">
                          <p className="font-display-lg text-3xl font-bold text-primary">
                            {soc.memberCount || 0}
                          </p>
                          <p className="font-label-uppercase text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">
                            ACTIVE MEMBERS
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-outline-variant">
                        <div>
                          <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">CATEGORY</p>
                          <p className="font-body-md text-sm font-semibold text-on-surface">{soc.category}</p>
                        </div>
                        <div>
                          <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">FACULTY PATRON</p>
                          <p className="font-body-md text-sm font-semibold text-on-surface">{soc.patronName || 'Faculty Sponsor'}</p>
                        </div>
                        <div>
                          <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">REPRESENTATIVE PRESIDENT</p>
                          <p className="font-body-md text-sm font-semibold text-on-surface">{user.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Events Table-Style Section */}
                  <div className="bg-white border border-outline-variant shadow-sm">
                    <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
                      <h4 className="font-label-uppercase text-label-uppercase text-xs font-bold tracking-wider text-primary uppercase">UPCOMING EVENTS SCHEDULE</h4>
                      <button onClick={() => setActiveTab('events')} className="text-[10px] font-label-uppercase text-secondary font-bold hover:underline uppercase">View Ledger</button>
                    </div>
                    <div className="divide-y divide-outline-variant">
                      {socEvents.length === 0 ? (
                        <div className="px-6 py-8 text-center text-sm text-on-surface-variant">
                          No scheduled upcoming events under this society's desk.
                        </div>
                      ) : (
                        socEvents.slice(0, 3).map((evt) => {
                          const evtDate = new Date(evt.startDateTime);
                          const day = evtDate.getDate().toString().padStart(2, '0');
                          const month = evtDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                          const timeStr = evtDate.toLocaleTimeString('en-US', {
                            hour: 'numeric', minute: '2-digit'
                          });

                          return (
                            <div key={evt._id} className="px-6 py-5 flex items-center justify-between group hover:bg-surface-container-low/20 transition-colors">
                              <div className="flex items-center gap-6">
                                <div className="text-center w-12 shrink-0">
                                  <p className="font-label-uppercase text-secondary text-lg font-bold">{day}</p>
                                  <p className="font-label-uppercase text-[9px] text-on-surface-variant font-bold">{month}</p>
                                </div>
                                <div>
                                  <h5 className="font-headline-sm text-base text-primary font-bold">{evt.title}</h5>
                                  <p className="font-body-sm text-xs text-on-surface-variant mt-1">{evt.location} • {timeStr}</p>
                                </div>
                              </div>
                              <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar Content (4 cols) */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  {/* Recent Activity Feed */}
                  <div className="bg-white border border-outline-variant p-6 shadow-sm">
                    <h4 className="font-label-uppercase text-label-uppercase text-xs font-bold tracking-wider text-primary border-b border-outline-variant pb-4 mb-4 uppercase">RECENT ACTIVITY</h4>
                    <div className="space-y-4">
                      {socEvents.length > 0 ? socEvents.slice(0, 3).map((evt) => (
                        <div key={evt._id} className="flex gap-3 items-start">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${evt.status === 'approved' ? 'bg-primary' : evt.status === 'pendingApproval' ? 'bg-secondary' : 'bg-outline'}`}></div>
                          <div>
                            <p className="font-body-sm text-xs text-on-surface"><span className="font-bold">{evt.title}:</span> {evt.status === 'approved' ? 'Approved and active' : evt.status === 'pendingApproval' ? 'Awaiting admin review' : 'Status: ' + evt.status}</p>
                            <p className="font-label-uppercase text-[9px] text-on-surface-variant font-bold mt-1 uppercase">{new Date(evt.createdAt || evt.startDateTime).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )) : (
                        <p className="text-xs text-on-surface-variant">No recent activity for this society.</p>
                      )}
                    </div>
                  </div>

                  {/* Membership Summary */}
                  <div className="bg-surface-container-low border border-outline-variant p-6 shadow-sm">
                    <h4 className="font-label-uppercase text-label-uppercase text-xs font-bold tracking-wider text-primary mb-4 uppercase">SOCIETY OVERVIEW</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[10px] font-label-uppercase font-bold mb-1 tracking-wide">
                          <span>ACTIVE EVENTS</span>
                          <span>{socEvents.filter(e => e.status === 'approved').length}</span>
                        </div>
                        <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary h-full transition-all" style={{ width: `${Math.min(100, (socEvents.filter(e => e.status === 'approved').length / Math.max(1, socEvents.length)) * 100)}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-label-uppercase font-bold mb-1 tracking-wide">
                          <span>PENDING REVIEW</span>
                          <span>{socEvents.filter(e => e.status === 'pendingApproval').length}</span>
                        </div>
                        <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                          <div className="bg-secondary h-full transition-all" style={{ width: `${Math.min(100, (socEvents.filter(e => e.status === 'pendingApproval').length / Math.max(1, socEvents.length)) * 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-outline-variant/60 grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="font-display-lg text-xl font-bold text-primary">{soc.memberCount || 0}</p>
                        <p className="font-label-uppercase text-[8px] text-on-surface-variant font-bold uppercase tracking-wider">MEMBERS</p>
                      </div>
                      <div className="text-center">
                        <p className="font-display-lg text-xl font-bold text-secondary">{socEvents.length}</p>
                        <p className="font-label-uppercase text-[8px] text-on-surface-variant font-bold uppercase tracking-wider">PROPOSALS</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Membership Table */}
              <div className="bg-white border border-outline-variant shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                  <h4 className="font-label-uppercase text-label-uppercase text-xs font-bold tracking-wider text-primary uppercase">SOCIETY INFORMATION</h4>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">CATEGORY</p>
                      <p className="font-body-md text-sm font-semibold text-on-surface capitalize">{soc.category}</p>
                    </div>
                    <div>
                      <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">FACULTY ADVISOR</p>
                      <p className="font-body-md text-sm font-semibold text-on-surface">{soc.patronName || 'Not Assigned'}</p>
                    </div>
                    <div>
                      <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">TOTAL MEMBERS</p>
                      <p className="font-body-md text-sm font-semibold text-primary">{soc.memberCount || 0}</p>
                    </div>
                    <div>
                      <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">CHARTER STATUS</p>
                      <span className="inline-block px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[9px] font-bold uppercase rounded border border-tertiary/10">Active</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-outline-variant">
                    <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">REPRESENTATIVE EXECUTIVE</p>
                    <p className="font-body-md text-sm font-semibold text-on-surface">{user.name}</p>
                    <p className="font-body-sm text-[10px] text-on-surface-variant font-mono">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
