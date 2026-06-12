import React from 'react';

export default function UsersRolesTab({
  usersList,
  userSearchQuery,
  setUserSearchQuery,
  filteredUsers,
  roleSuccess,
  roleLoading,
  handleRoleChange
}) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="font-label-uppercase text-secondary font-bold text-xs tracking-widest block uppercase mb-1">
            Access Management
          </span>
          <h2 className="font-headline-md text-3xl text-emerald-950 font-serif font-semibold">Users & Roles</h2>
          <p className="text-slate-600 text-sm mt-1">Manage institutional access, administrative privileges, and academic roles for the directory.</p>
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
            <span className="material-symbols-outlined text-sm">search</span>
          </span>
          <input 
            type="text" 
            placeholder="Search active registry..."
            className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs focus:border-emerald-700 outline-none w-64"
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Bento-style stats overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm border-l-4 border-l-emerald-700 relative overflow-hidden">
          <p className="font-label-uppercase text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Users</p>
          <h3 className="font-headline-sm text-2xl font-serif font-bold text-emerald-950">{usersList.length}</h3>
          <div className="flex items-center gap-1 text-emerald-700 text-[10px] font-bold mt-2">
            <span className="material-symbols-outlined text-xs">group</span>
            <span>Registered accounts</span>
          </div>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm border-l-4 border-l-amber-500">
          <p className="font-label-uppercase text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Administrators</p>
          <h3 className="font-headline-sm text-2xl font-serif font-bold text-emerald-950">{usersList.filter(u => u.role === 'admin').length}</h3>
          <p className="text-slate-500 text-[10px] mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs text-slate-400">shield</span>
            Protected Status
          </p>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm border-l-4 border-l-amber-300">
          <p className="font-label-uppercase text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Executives</p>
          <h3 className="font-headline-sm text-2xl font-serif font-bold text-amber-700">{usersList.filter(u => u.role === 'executive').length}</h3>
          <p className="text-slate-500 text-[10px] mt-2">Society leaders</p>
        </div>
        <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm border-l-4 border-l-slate-400">
          <p className="font-label-uppercase text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Students</p>
          <h3 className="font-headline-sm text-2xl font-serif font-bold text-emerald-900">{usersList.filter(u => u.role === 'student').length}</h3>
          <p className="text-slate-500 text-[10px] mt-2 font-mono">Active learners</p>
        </div>
      </div>

      {roleSuccess && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs rounded" role="alert">
          {roleSuccess}
        </div>
      )}

      {/* Active registry table */}
      <div className="paper-card overflow-hidden rounded-lg bg-white">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-500 uppercase tracking-wider">Active Registry</span>
          <span className="text-slate-400 font-mono">Showing {filteredUsers.length} academic entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-label-uppercase text-[11px] font-bold">
                <th className="px-6 py-4">User Name</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Reg#</th>
                <th className="px-6 py-4">Dept</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsers.map((u) => {
                const isSuper = u.role === 'admin';
                const isExec = u.role === 'executive';
                const initials = u.name ? u.name.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 3).toUpperCase() : '??';

                return (
                  <tr key={u._id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          {initials}
                        </div>
                        <span className="font-bold text-slate-900 font-serif">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-700 font-mono">
                      {u.registrationNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-700">
                      {u.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                      {u.batch}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        isSuper 
                          ? 'bg-emerald-700 text-white border-emerald-800' 
                          : isExec 
                          ? 'bg-amber-100 text-amber-800 border-amber-200' 
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        <span className="text-xs text-slate-700 font-medium">Active</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {isSuper ? (
                        <span className="text-xs text-slate-400 italic">Root Protected</span>
                      ) : (
                        <select 
                          className="bg-slate-50 px-3 py-1.5 border border-slate-200 focus:border-emerald-700 focus:bg-white focus:ring-0 outline-none text-xs w-[130px] rounded"
                          value={u.role} 
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={roleLoading}
                        >
                          <option value="student">Student</option>
                          <option value="executive">Executive</option>
                        </select>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
