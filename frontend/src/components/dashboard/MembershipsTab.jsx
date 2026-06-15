import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_STYLES = {
  technical: {
    bg: 'bg-primary-fixed-dim/20',
    text: 'text-primary',
    icon: 'architecture',
    badge: 'bg-primary-container/20 text-primary-container'
  },
  literary: {
    bg: 'bg-secondary-fixed/30',
    text: 'text-secondary',
    icon: 'history_edu',
    badge: 'bg-secondary-container/20 text-secondary'
  },
  sports: {
    bg: 'bg-tertiary-fixed/30',
    text: 'text-tertiary',
    icon: 'sports_soccer',
    badge: 'bg-tertiary-container/20 text-tertiary'
  },
  arts: {
    bg: 'bg-surface-variant/40',
    text: 'text-on-surface-variant',
    icon: 'palette',
    badge: 'bg-surface-container-highest text-on-surface'
  },
  creative: {
    bg: 'bg-surface-variant/40',
    text: 'text-on-surface-variant',
    icon: 'palette',
    badge: 'bg-surface-container-highest text-on-surface'
  },
  default: {
    bg: 'bg-surface-variant/40',
    text: 'text-on-surface-variant',
    icon: 'groups',
    badge: 'bg-surface-container-highest text-on-surface'
  }
};

export default function MembershipsTab({ memberships, handleMembershipDelete }) {
  const approvedCount = memberships.filter((m) => m.status === 'approved').length;
  const pendingCount = memberships.filter((m) => m.status === 'pending').length;
  const rejectedCount = memberships.filter((m) => m.status === 'rejected').length;

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header info */}
      <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
        <div>
          <span className="font-label-uppercase text-label-uppercase text-primary mb-2 block font-bold text-xs">
            SOCIETY NETWORK
          </span>
          <h2 className="font-headline-sm text-headline-sm text-primary font-bold">My Memberships</h2>
          <p className="text-on-surface-variant text-sm mt-1">Monitor your institutional affiliations and manage your active society engagement requests.</p>
        </div>
        <Link 
          to="/societies" 
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded font-label-uppercase text-xs tracking-wider font-bold hover:bg-primary-container transition-all group"
        >
          <span className="material-symbols-outlined text-sm">search</span>
          Browse Societies
        </Link>
      </div>

      {/* Bento Statistics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {/* Approved Bento Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 moss-border p-6 rounded-none flex flex-col justify-between group hover:border-primary transition-all duration-300 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="font-label-uppercase text-label-uppercase text-on-surface-variant font-bold text-xs">Approved</span>
            <div className="bg-tertiary-fixed text-on-tertiary-fixed p-2 rounded-lg text-primary bg-primary/10">
              <span className="material-symbols-outlined font-bold">verified</span>
            </div>
          </div>
          <div className="mt-8">
            <span className="text-4xl font-bold font-display-lg text-primary">{String(approvedCount).padStart(2, '0')}</span>
            <p className="text-xs text-on-surface-variant mt-1 font-semibold">Active Memberships</p>
          </div>
        </div>

        {/* Pending Bento Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 moss-border p-6 rounded-none flex flex-col justify-between group hover:border-secondary transition-all duration-300 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="font-label-uppercase text-label-uppercase text-on-surface-variant font-bold text-xs">Pending</span>
            <div className="bg-secondary-fixed text-on-secondary-fixed p-2 rounded-lg text-secondary bg-secondary/15">
              <span className="material-symbols-outlined font-bold">pending_actions</span>
            </div>
          </div>
          <div className="mt-8">
            <span className="text-4xl font-bold font-display-lg text-secondary">{String(pendingCount).padStart(2, '0')}</span>
            <p className="text-xs text-on-surface-variant mt-1 font-semibold">Under Review</p>
          </div>
        </div>

        {/* Rejected Bento Card */}
        <div className="bg-surface-container-lowest border border-outline-variant/60 moss-border p-6 rounded-none flex flex-col justify-between group hover:border-error transition-all duration-300 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="font-label-uppercase text-label-uppercase text-on-surface-variant font-bold text-xs">Rejected</span>
            <div className="bg-error-container text-on-error-container p-2 rounded-lg text-error bg-error/10">
              <span className="material-symbols-outlined font-bold">cancel</span>
            </div>
          </div>
          <div className="mt-8">
            <span className="text-4xl font-bold font-display-lg text-error">{String(rejectedCount).padStart(2, '0')}</span>
            <p className="text-xs text-on-surface-variant mt-1 font-semibold">Needs Revision</p>
          </div>
        </div>
      </section>

      {/* Membership Registry Table Section */}
      <section className="bg-surface-container-lowest border border-outline-variant/60 moss-border overflow-hidden shadow-sm">
        <div className="bg-surface-container-low px-8 py-4 border-b border-outline-variant/60 flex justify-between items-center">
          <h2 className="font-label-uppercase text-label-uppercase text-primary font-bold text-xs tracking-wider">Membership Registry</h2>
          <div className="flex items-center gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors text-lg">filter_list</span>
            <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors text-lg">sort</span>
          </div>
        </div>

        {memberships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 mb-4 rounded-full bg-surface-container-low flex items-center justify-center text-outline-variant">
              <span className="material-symbols-outlined text-3xl">folder_off</span>
            </div>
            <h3 className="font-headline-sm text-sm text-on-surface font-bold">No active memberships</h3>
            <p className="text-on-surface-variant mt-1 text-xs max-w-xs mx-auto">You haven't joined any societies yet. Explore the campus directory to start your journey.</p>
            <Link 
              to="/societies"
              className="mt-6 border border-outline-variant px-6 py-2.5 font-label-uppercase text-xs text-primary font-bold hover:bg-surface transition-colors"
            >
              Browse the Directory
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 border-b border-outline-variant/40">
                  <th className="px-8 py-4 font-label-uppercase text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Society Name</th>
                  <th className="px-8 py-4 font-label-uppercase text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Category</th>
                  <th className="px-8 py-4 font-label-uppercase text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Request Date</th>
                  <th className="px-8 py-4 font-label-uppercase text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">Status</th>
                  <th className="px-8 py-4 font-label-uppercase text-[11px] text-on-surface-variant font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {memberships.map((membership) => {
                  const soc = membership.societyId;
                  if (!soc) return null;
                  
                  const catLower = soc.category ? soc.category.toLowerCase() : 'default';
                  const style = CATEGORY_STYLES[catLower] || CATEGORY_STYLES.default;
                  
                  const requestDate = new Date(membership.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  return (
                    <tr key={membership._id} className="hover:bg-surface-container/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded ${style.bg} flex items-center justify-center ${style.text}`}>
                            <span className="material-symbols-outlined font-bold text-lg">{style.icon}</span>
                          </div>
                          <div>
                            <p className="font-headline-sm text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{soc.name}</p>
                            <p className="text-[10px] font-mono text-on-surface-variant opacity-70">ID: RHH-{membership._id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="bg-surface-container-highest text-on-surface px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-tight">
                          {soc.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-xs text-on-surface-variant">
                        {requestDate}
                      </td>
                      <td className="px-8 py-5">
                        {membership.status === 'approved' && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed/30 text-on-tertiary-fixed-variant text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                            Approved
                          </div>
                        )}
                        {membership.status === 'pending' && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed/30 text-on-secondary-fixed-variant text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                            Pending
                          </div>
                        )}
                        {membership.status !== 'approved' && membership.status !== 'pending' && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container/30 text-on-error-container text-[11px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                            {membership.status || 'Rejected'}
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="inline-flex items-center gap-3">
                          <Link
                            to={`/societies/${soc._id}`}
                            className="text-primary hover:underline text-xs font-label-uppercase font-bold tracking-wider"
                          >
                            View Desk
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              const action = membership.status === 'approved' ? 'leave this society' : 'withdraw this request';
                              if (window.confirm(`Are you sure you want to ${action}?`)) handleMembershipDelete(membership);
                            }}
                            className="text-red-600 hover:underline text-xs font-label-uppercase font-bold tracking-wider"
                          >
                            {membership.status === 'approved' ? 'Leave' : 'Withdraw'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-8 py-4 bg-surface-container-low/30 border-t border-outline-variant/60 flex justify-between items-center text-xs text-on-surface-variant font-medium">
              <span>Showing {memberships.length} society membership(s)</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
