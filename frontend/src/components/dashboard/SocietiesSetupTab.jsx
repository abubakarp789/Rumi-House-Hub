import React from 'react';
import EmptyState from '../EmptyState';

export default function SocietiesSetupTab({
  activeSocieties,
  socFormData,
  setSocFormData,
  socSuccess,
  socError,
  socSubmitting,
  handleSocSubmit
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      <div className="lg:col-span-8 space-y-6">
        <div>
          <span className="font-label-uppercase text-secondary font-bold text-xs tracking-widest block uppercase mb-1">
            Active Directory
          </span>
          <h2 className="font-headline-md text-3xl text-emerald-950 font-serif font-semibold">Registered Campus Societies</h2>
          <p className="text-slate-600 text-sm mt-1">Formal student organizations initialized and sanctioned by Namal IT Desk.</p>
        </div>

        {activeSocieties.length === 0 ? (
          <EmptyState message="No campus societies have been initialized yet." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeSocieties.map((soc) => (
              <article key={soc._id} className="paper-card p-6 rounded-lg flex flex-col justify-between relative overflow-hidden bg-white shadow-sm border border-slate-200">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full translate-x-8 -translate-y-8 z-0"></div>
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-headline-sm text-lg text-emerald-950 font-serif font-bold">{soc.name}</h4>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 border border-emerald-100 rounded uppercase tracking-wider whitespace-nowrap">
                      {soc.category}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                      Faculty Advisor: <strong className="text-slate-800">{soc.patronName}</strong>
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {soc.description}
                  </p>
                </div>
                <div className="relative z-10 border-t border-slate-100 pt-4 mt-4 flex justify-between items-center text-xs">
                  <span className="text-emerald-800 font-bold uppercase tracking-widest text-[9px]">ACTIVE CHARTER</span>
                  <span className="text-slate-400">Authenticated Node</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-4">
        <article className="bg-white border border-slate-200 p-6 md:p-8 rounded-lg shadow-sm">
          <h3 className="font-headline-sm text-xl text-emerald-950 font-serif font-bold border-b border-slate-100 pb-4 mb-6">
            Initialize New Society
          </h3>
          
          {socSuccess && (
            <div className="p-3 mb-4 bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs rounded" role="alert">
              {socSuccess}
            </div>
          )}
          {socError && (
            <div className="p-3 mb-4 bg-red-50 text-red-800 border border-red-100 text-xs rounded" role="alert">
              {socError}
            </div>
          )}

          <form onSubmit={handleSocSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="soc-name">
                SOCIETY / CLUB FULL NAME
              </label>
              <input 
                id="soc-name" 
                type="text" 
                placeholder="e.g. Namal Debating Society" 
                className="w-full bg-slate-50 px-4 py-3 border border-slate-200 focus:border-emerald-700 focus:bg-white focus:ring-0 outline-none transition-all text-xs"
                value={socFormData.name} 
                onChange={(e) => setSocFormData((prev) => ({ ...prev, name: e.target.value }))} 
                disabled={socSubmitting} 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="soc-patron">
                FACULTY ADVISOR SPONSOR
              </label>
              <input 
                id="soc-patron" 
                type="text" 
                placeholder="e.g. Dr. Sajid Mahmood" 
                className="w-full bg-slate-50 px-4 py-3 border border-slate-200 focus:border-emerald-700 focus:bg-white focus:ring-0 outline-none transition-all text-xs"
                value={socFormData.patronName} 
                onChange={(e) => setSocFormData((prev) => ({ ...prev, patronName: e.target.value }))} 
                disabled={socSubmitting} 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="soc-category">
                DOMAIN CATEGORY
              </label>
              <select 
                id="soc-category" 
                className="w-full bg-slate-50 px-4 py-3 border border-slate-200 focus:border-emerald-700 focus:bg-white focus:ring-0 outline-none transition-all text-xs"
                value={socFormData.category} 
                onChange={(e) => setSocFormData((prev) => ({ ...prev, category: e.target.value }))} 
                disabled={socSubmitting}
              >
                <option value="technical">Technical/Computing</option>
                <option value="literary">Literary/Debating</option>
                <option value="social">Social Welfare</option>
                <option value="arts">Arts/Decor</option>
                <option value="sports">Sports/Adventure</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="soc-desc">
                CHARTER DESCRIPTION & OBJECTIVES
              </label>
              <textarea 
                id="soc-desc" 
                rows="3" 
                placeholder="Outline co-curricular objectives..." 
                className="w-full bg-slate-50 px-4 py-3 border border-slate-200 focus:border-emerald-700 focus:bg-white focus:ring-0 outline-none transition-all text-xs"
                value={socFormData.description} 
                onChange={(e) => setSocFormData((prev) => ({ ...prev, description: e.target.value }))} 
                disabled={socSubmitting} 
              />
            </div>
            <button 
              type="submit" 
              disabled={socSubmitting}
              className="w-full py-3 bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">verified_user</span>
              {socSubmitting ? 'Initializing charter...' : 'Confirm & Register'}
            </button>
          </form>
        </article>
      </div>
    </div>
  );
}
