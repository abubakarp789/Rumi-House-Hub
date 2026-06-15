import React from 'react';
import EmptyState from '../EmptyState';

export default function NewsManagementTab({
  activeNews,
  newsSearchQuery,
  setNewsSearchQuery,
  filteredNews,
  newsFormData,
  setNewsFormData,
  newsSuccess,
  newsError,
  newsSubmitting,
  handleNewsSubmit,
  editingNewsId,
  setEditingNewsId,
  handleNewsEdit,
  handleNewsDelete
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
      <div className="lg:col-span-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-label-uppercase text-secondary font-bold text-xs tracking-widest block uppercase mb-1">
              Co-curricular Bulletins
            </span>
            <h2 className="font-headline-md text-3xl text-emerald-950 font-serif font-semibold">Published Bulletin Archive</h2>
            <p className="text-slate-600 text-sm mt-1">Registry of announcements, academic outreach newsletters, and campus co-curricular alerts.</p>
          </div>
          
          {/* Simulated Search highlight input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
              <span className="material-symbols-outlined text-sm">search</span>
            </span>
            <input 
              type="text" 
              placeholder="Search bulletins..."
              className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs focus:border-emerald-700 outline-none w-56"
              value={newsSearchQuery}
              onChange={(e) => setNewsSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredNews.length === 0 ? (
          <EmptyState message={newsSearchQuery ? `No bulletins matching "${newsSearchQuery}" were found.` : "No bulletins are currently published."} />
        ) : (
          <div className="space-y-4">
            {filteredNews.map((n) => {
              const isAlert = n.category === 'alert';
              const isVisit = n.category === 'visit';

              return (
                <article key={n._id} className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm hover:border-emerald-700 transition-all flex gap-4">
                  <div className="flex-grow space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-headline-sm text-lg text-emerald-950 font-serif font-bold leading-tight">
                          {n.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          {new Date(n.createdAt).toLocaleDateString()} • Published by Admin
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider whitespace-nowrap border ${
                          isAlert 
                            ? 'bg-red-50 text-red-700 border-red-100' 
                            : isVisit 
                            ? 'bg-amber-50 text-amber-800 border-amber-100' 
                            : 'bg-emerald-50 text-emerald-800 border-emerald-100'
                        }`}>
                          {n.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleNewsEdit(n)}
                          className="text-slate-400 hover:text-emerald-700 transition-colors p-1 flex items-center justify-center rounded hover:bg-emerald-50"
                          title="Edit Bulletin"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button 
                          onClick={() => {
                            if (window.confirm("Are you sure you want to permanently delete this bulletin?")) {
                              handleNewsDelete(n._id);
                            }
                          }}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1 flex items-center justify-center rounded hover:bg-red-50"
                          title="Delete Bulletin"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs text-emerald-900 font-bold bg-emerald-50/50 p-2.5 rounded border-l-2 border-emerald-700">
                      Summary: {n.summary}
                    </p>

                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {n.content}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <div className="lg:col-span-4">
        <article className="bg-white border border-slate-200 p-6 md:p-8 rounded-lg shadow-sm">
          <h3 className="font-headline-sm text-xl text-emerald-950 font-serif font-bold border-b border-slate-100 pb-4 mb-6">
            {editingNewsId ? 'Edit Bulletin Announcement' : 'Publish Bulletin Announcement'}
          </h3>
          
          {newsSuccess && (
            <div className="p-3 mb-4 bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs rounded" role="alert">
              {newsSuccess}
            </div>
          )}
          {newsError && (
            <div className="p-3 mb-4 bg-red-50 text-red-800 border border-red-100 text-xs rounded" role="alert">
              {newsError}
            </div>
          )}

          <form onSubmit={handleNewsSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="news-title">
                ARTICLE HEADER TITLE
              </label>
              <input 
                id="news-title" 
                type="text" 
                placeholder="e.g. Co-Curricular Registrations Open" 
                className="w-full bg-slate-50 px-4 py-3 border border-slate-200 focus:border-emerald-700 focus:bg-white focus:ring-0 outline-none transition-all text-xs"
                value={newsFormData.title} 
                onChange={(e) => setNewsFormData((prev) => ({ ...prev, title: e.target.value }))} 
                disabled={newsSubmitting} 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="news-cat">
                BULLETIN CLASSIFICATION
              </label>
              <select 
                id="news-cat" 
                className="w-full bg-slate-50 px-4 py-3 border border-slate-200 focus:border-emerald-700 focus:bg-white focus:ring-0 outline-none transition-all text-xs"
                value={newsFormData.category} 
                onChange={(e) => setNewsFormData((prev) => ({ ...prev, category: e.target.value }))} 
                disabled={newsSubmitting}
              >
                <option value="newsletter">Rumi Newsletter Announcement</option>
                <option value="alert">Mandatory Campus Alert</option>
                <option value="visit">Outreach Review</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="news-sum">
                EXECUTIVE DEVISE SUMMARY
              </label>
              <input 
                id="news-sum" 
                type="text" 
                placeholder="e.g. Schedule, timing, and venue criteria" 
                className="w-full bg-slate-50 px-4 py-3 border border-slate-200 focus:border-emerald-700 focus:bg-white focus:ring-0 outline-none transition-all text-xs"
                value={newsFormData.summary} 
                onChange={(e) => setNewsFormData((prev) => ({ ...prev, summary: e.target.value }))} 
                disabled={newsSubmitting} 
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="news-content">
                BULLETIN ARTICLE CONTENT
              </label>
              <textarea 
                id="news-content" 
                rows="4" 
                placeholder="Write full announcement details..." 
                className="w-full bg-slate-50 px-4 py-3 border border-slate-200 focus:border-emerald-700 focus:bg-white focus:ring-0 outline-none transition-all text-xs"
                value={newsFormData.content} 
                onChange={(e) => setNewsFormData((prev) => ({ ...prev, content: e.target.value }))} 
                disabled={newsSubmitting} 
              />
            </div>
            <button 
              type="submit" 
              disabled={newsSubmitting}
              className="w-full py-3 bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">campaign</span>
              {newsSubmitting ? 'Saving announcement...' : editingNewsId ? 'Update Article' : 'Publish Article'}
            </button>
            {editingNewsId && (
              <button
                type="button"
                onClick={() => {
                  setEditingNewsId('');
                  setNewsFormData({ title: '', summary: '', content: '', category: 'newsletter' });
                }}
                className="w-full py-3 border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 text-xs uppercase tracking-widest rounded"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </article>
      </div>
    </div>
  );
}
