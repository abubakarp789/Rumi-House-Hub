import React from 'react';
import EmptyState from '../EmptyState';

export default function MembershipRequestsTab({
  pendingMemberships,
  filteredMemberships,
  deptFilter,
  setDeptFilter,
  selectedMemberships,
  handleBulkModerateMemberships,
  handleSelectAllMemberships,
  handleSelectMembership,
  handleModerateMembership,
  handleDeleteMembership
}) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-label-uppercase text-secondary font-bold text-xs tracking-widest block uppercase mb-1">
            Student Affiliations
          </span>
          <h2 className="font-headline-md text-3xl text-emerald-950 font-serif font-semibold">Membership Applications Queue</h2>
          <p className="text-slate-600 text-sm mt-1">Audit and moderate registrations submitted by students to join campus organizations.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          {/* Department Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold text-slate-400">Department Filter</label>
            <select 
              className="border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-emerald-700 w-44"
              value={deptFilter} 
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option>All Departments</option>
              <option>Computer Science</option>
              <option>Electrical Engineering</option>
              <option>Business Administration</option>
              <option>Mathematics</option>
              <option>Humanities</option>
              <option>Applied Science</option>
              <option>Fine Arts</option>
              <option>Management</option>
            </select>
          </div>

          {/* Bulk Actions */}
          {selectedMemberships.length > 0 && (
            <div className="flex gap-2">
              <button 
                onClick={() => handleBulkModerateMemberships('approved')}
                className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow"
              >
                <span className="material-symbols-outlined text-xs">done_all</span>
                Bulk Approve ({selectedMemberships.length})
              </button>
              <button 
                onClick={() => handleBulkModerateMemberships('rejected')}
                className="px-4 py-2 bg-red-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-800 transition-colors flex items-center gap-1.5 shadow"
              >
                <span className="material-symbols-outlined text-xs">close</span>
                Bulk Reject
              </button>
            </div>
          )}
        </div>
      </div>

      {filteredMemberships.length === 0 ? (
        <EmptyState message={`No pending memberships match the selected department "${deptFilter}".`} />
      ) : (
        <div className="paper-card overflow-hidden rounded-lg">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider">Registry Queue</span>
            <span className="text-emerald-800 font-semibold">{filteredMemberships.length} Student Requests Pending</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-label-uppercase text-[11px] font-bold">
                  <th className="px-6 py-4 w-12 text-center">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-emerald-700 focus:ring-0 cursor-pointer"
                      onChange={handleSelectAllMemberships}
                      checked={selectedMemberships.length === filteredMemberships.length && filteredMemberships.length > 0}
                    />
                  </th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Reg#</th>
                  <th className="px-6 py-4">Dept</th>
                  <th className="px-6 py-4">Target Society</th>
                  <th className="px-6 py-4">Request Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredMemberships.map((m) => {
                  const student = m.userId || { name: 'Student Applicant', registrationNumber: 'N/A', email: 'N/A', department: 'N/A' };
                  const societyName = m.societyId?.name || 'Target Society';
                  const isSelected = selectedMemberships.includes(m._id);

                  return (
                    <tr key={m._id} className={`hover:bg-slate-50/50 transition-colors ${isSelected ? 'bg-emerald-50/20' : ''}`}>
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-emerald-700 focus:ring-0 cursor-pointer"
                          checked={isSelected}
                          onChange={(e) => handleSelectMembership(m._id, e.target.checked)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 font-serif text-sm">{student.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{student.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-700">
                        {student.registrationNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-700">
                        {student.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-emerald-800 uppercase">
                        {societyName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded border border-amber-200">
                          Pending
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="inline-flex gap-2">
                          <button 
                            onClick={() => handleModerateMembership(m.societyId._id, m._id, 'approved')}
                            className="p-1 text-emerald-700 hover:text-emerald-950 hover:bg-emerald-50 transition-all rounded"
                            title="Approve Member"
                          >
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm('Permanently delete this membership request?')) {
                                handleDeleteMembership(m.societyId._id, m._id);
                              }
                            }}
                            className="p-1 text-slate-500 hover:text-red-800 hover:bg-red-50 transition-all rounded"
                            title="Delete Request"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                          <button 
                            onClick={() => handleModerateMembership(m.societyId._id, m._id, 'rejected')}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 transition-all rounded"
                            title="Reject Request"
                          >
                            <span className="material-symbols-outlined text-lg">cancel</span>
                          </button>
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
