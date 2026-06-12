import React from 'react';
import EmptyState from '../EmptyState';

export default function AttendanceOverviewTab({
  approvedEvents,
  attendanceDeptFilter,
  setAttendanceDeptFilter,
  attendanceTypeFilter,
  setAttendanceTypeFilter,
  filteredAttendanceEvents,
  setRoleSuccess
}) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-label-uppercase text-secondary font-bold text-xs tracking-widest block uppercase mb-1">
            Campus Engagement Metrics
          </span>
          <h2 className="font-display-lg text-3xl text-emerald-950 font-serif font-semibold">Attendance Overview</h2>
          <p className="text-slate-600 text-sm mt-1">Review occupancy checked-in logs and capacity metrics for all active campus events.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => { setRoleSuccess('CSV export feature coming soon.'); setTimeout(() => setRoleSuccess(''), 2000); }}
            className="px-4 py-2 border border-slate-200 font-bold text-xs hover:bg-slate-50 transition-colors uppercase tracking-wider font-label-uppercase cursor-pointer"
          >
            Export CSV
          </button>
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors uppercase tracking-wider font-label-uppercase cursor-pointer"
          >
            Print Summary
          </button>
        </div>
      </div>

      {/* Filter bar & Average Attendance Rate */}
      <div className="grid grid-cols-12 gap-6 items-stretch">
        <div className="col-span-12 lg:col-span-9 flex flex-wrap gap-6 p-6 bg-white border border-slate-200 rounded-lg">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Society / Dept</label>
            <select 
              className="border-b border-slate-200 bg-transparent py-1 pr-6 focus:outline-none focus:border-emerald-700 text-xs font-semibold"
              value={attendanceDeptFilter}
              onChange={(e) => setAttendanceDeptFilter(e.target.value)}
            >
              <option>All Societies</option>
              {Array.from(new Set(approvedEvents.map(evt => evt.societyId?.name).filter(Boolean))).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          <div className="w-px bg-slate-200 my-1 self-stretch"></div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Type</label>
            <select 
              className="border-b border-slate-200 bg-transparent py-1 pr-6 focus:outline-none focus:border-emerald-700 text-xs font-semibold cursor-pointer"
              value={attendanceTypeFilter}
              onChange={(e) => setAttendanceTypeFilter(e.target.value)}
            >
              <option>All Types</option>
              <option value="seminar">Seminar</option>
              <option value="workshop">Workshop</option>
              <option value="competition">Competition</option>
              <option value="sports">Sports</option>
            </select>
          </div>
          <div className="w-px bg-slate-200 my-1 self-stretch"></div>

          <div className="ml-auto flex items-center">
            <span className="text-emerald-700 font-bold text-xs flex items-center gap-1 cursor-pointer hover:underline">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Advanced Filters
            </span>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-3 p-6 bg-emerald-50 border border-emerald-100 text-emerald-950 rounded-lg flex flex-col justify-center shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Approved Events</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-headline-md text-3xl font-serif font-bold text-emerald-900">{filteredAttendanceEvents.length}</span>
            <span className="text-xs font-bold text-emerald-700 flex items-center">
              <span className="material-symbols-outlined text-xs">event_available</span> events
            </span>
          </div>
        </div>
      </div>

      {filteredAttendanceEvents.length === 0 ? (
        <EmptyState message="No approved active events match the current filters." />
      ) : (
        <div className="paper-card overflow-hidden rounded-lg bg-white shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-label-uppercase text-[11px] font-bold">
                  <th className="px-6 py-4">Event Name & Venue</th>
                  <th className="px-6 py-4">Hosting Society</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-center">RSVP Limits</th>
                  <th className="px-6 py-4 text-center">Active Logs</th>
                  <th className="px-6 py-4 text-right w-64">Check-in % (Capacity Progress)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredAttendanceEvents.map((evt) => {
                  const activeCount = evt.attendeeCount || 0;
                  const percent = Math.min(100, Math.round((activeCount / evt.capacity) * 100)) || 0;

                  return (
                    <tr key={evt._id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="font-bold text-emerald-950 font-serif text-[16px]">{evt.title}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-1">
                          {evt.startDateTime ? new Date(evt.startDateTime).toLocaleDateString() : 'Active Date'} • {evt.location}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase border border-slate-200">
                          {evt.societyId?.name || 'Academic Club'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-xs text-slate-600 capitalize">
                        {evt.type}
                      </td>
                      <td className="px-6 py-5 text-center font-bold text-slate-800">
                        {evt.capacity} Seats
                      </td>
                      <td className="px-6 py-5 text-center font-bold text-emerald-800">
                        {activeCount} Checked In
                      </td>
                      <td className="px-6 py-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-3 justify-end w-full">
                          <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                percent > 85 ? 'bg-emerald-700' : percent > 50 ? 'bg-amber-500' : 'bg-red-600'
                              }`} 
                              style={{ width: `${percent}%` }} 
                            />
                          </div>
                          <span className={`text-xs font-bold font-mono min-w-[36px] ${
                            percent > 85 ? 'text-emerald-800' : percent > 50 ? 'text-amber-700' : 'text-red-700'
                          }`}>
                            {percent}%
                          </span>
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
