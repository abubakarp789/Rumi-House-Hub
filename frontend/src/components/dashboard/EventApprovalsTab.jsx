import React from 'react';
import EmptyState from '../EmptyState';

export default function EventApprovalsTab({ pendingEvents, setSelectedEventForReview }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="font-label-uppercase text-secondary font-bold text-xs tracking-widest block uppercase mb-1">
            Co-Curricular Registry
          </span>
          <h2 className="font-headline-md text-3xl text-emerald-950 font-serif font-semibold">Event Moderation Queue</h2>
          <p className="text-slate-600 text-sm mt-1">Review student-led co-curricular event proposals. Audit academic alignment, capacities, and logistical parameters.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase border border-emerald-200">
            {pendingEvents.length} Pending Review
          </span>
        </div>
      </div>

      {/* Academic Rigor Policy Alert Box */}
      <div className="policy-alert p-6 bg-emerald-50 border-l-4 border-emerald-700 text-emerald-950 flex items-start gap-4">
        <span className="material-symbols-outlined text-emerald-700 font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
        <div>
          <h4 className="font-bold text-sm mb-1 uppercase tracking-wider font-serif">Academic Rigor Check</h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            All co-curricular event proposals must align with the institution's commitment to scholarly enrichment and intellectual character. Verify that all high-capacity symposiums have a verified faculty sponsor/patron attached before administrative scheduling approval.
          </p>
        </div>
      </div>

      {pendingEvents.length === 0 ? (
        <EmptyState message="No co-curricular event proposals are currently pending review." />
      ) : (
        <div className="paper-card overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-label-uppercase text-[11px] font-bold">
                  <th className="px-6 py-4">Event Title & Type</th>
                  <th className="px-6 py-4">Hosting Society</th>
                  <th className="px-6 py-4">Faculty Advisor</th>
                  <th className="px-6 py-4">Proposed By</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {pendingEvents.map((evt) => (
                  <tr key={evt._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-emerald-900 text-base font-serif">{evt.title}</div>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">location_on</span>
                        {evt.location} • {evt.startDateTime ? new Date(evt.startDateTime).toLocaleDateString() : 'Upcoming'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded border border-slate-200 uppercase">
                        {evt.societyId?.name || 'Representative Society'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-700">
                      {evt.societyId?.patronName || 'Faculty Sponsor'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-800">{evt.createdBy?.name || 'Academic Lead'}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{evt.createdBy?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-800">
                      {evt.capacity} Seats
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span className="text-xs font-semibold text-amber-700">Pending Review</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button 
                        onClick={() => setSelectedEventForReview(evt)}
                        className="px-4 py-2 border border-emerald-700 text-emerald-800 hover:bg-emerald-50 font-bold text-xs uppercase tracking-wider transition-colors font-label-uppercase"
                      >
                        Review Proposal
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
