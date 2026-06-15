import React from 'react';

export default function ProposeEventTab({
  societies,
  formData,
  proposalSuccess,
  proposalErrors,
  proposing,
  handleInputChange,
  handleProposalSubmit,
  editingEventId,
  handleCancelEventEdit
}) {
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="bg-white border border-outline-variant p-6 md:p-10 shadow-sm">
        <div className="border-l-4 border-primary pl-6 mb-8">
          <h2 className="font-headline-md text-headline-md text-primary font-bold text-2xl">
            {editingEventId ? 'Edit Campus Event Proposal' : 'Draft Campus Event Proposal'}
          </h2>
          <p className="text-on-surface-variant text-sm mt-1">Submit rigorous co-curricular outlines for academic and moderation review.</p>
        </div>

        {proposalSuccess && (
          <div className="p-4 mb-6 bg-tertiary-fixed text-on-tertiary-fixed-variant border border-tertiary/20 text-xs font-bold rounded flex items-center gap-2" role="alert">
            <span className="material-symbols-outlined text-sm">verified</span>
            {proposalSuccess}
          </div>
        )}
        {proposalErrors.submitError && (
          <div className="p-4 mb-6 bg-error-container text-on-error-container border border-error/20 text-xs font-bold rounded flex items-center gap-2" role="alert">
            <span className="material-symbols-outlined text-sm">warning</span>
            {proposalErrors.submitError}
          </div>
        )}

        <form onSubmit={handleProposalSubmit} className="space-y-6">
          <div>
            <label className="block font-label-uppercase text-label-uppercase text-on-surface-variant mb-2 font-bold text-xs tracking-wider" htmlFor="societyId">
              HOSTING REPRESENTATIVE CLUB *
            </label>
            <select 
              id="societyId" 
              name="societyId"
              className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              value={formData.societyId} 
              onChange={handleInputChange} 
              disabled={proposing}
            >
              <option value="">Select Representative Society...</option>
              {societies.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
            {proposalErrors.societyId && <p className="text-error text-xs mt-1 font-semibold">{proposalErrors.societyId}</p>}
          </div>

          <div>
            <label className="block font-label-uppercase text-label-uppercase text-on-surface-variant mb-2 font-bold text-xs tracking-wider" htmlFor="title">
              EVENT HEADER TITLE *
            </label>
            <input 
              id="title" 
              name="title"
              type="text" 
              placeholder="e.g. AI & Python Development Hands-on Seminar" 
              className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              value={formData.title} 
              onChange={handleInputChange} 
              disabled={proposing}
            />
            {proposalErrors.title && <p className="text-error text-xs mt-1 font-semibold">{proposalErrors.title}</p>}
          </div>

          <div>
            <label className="block font-label-uppercase text-label-uppercase text-on-surface-variant mb-2 font-bold text-xs tracking-wider" htmlFor="description">
              DETAILED OUTLINE & OBJECTIVES *
            </label>
            <textarea 
              id="description" 
              name="description"
              rows="4" 
              placeholder="Describe co-curricular purposes, outline sessions, and target student criteria..." 
              className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              value={formData.description} 
              onChange={handleInputChange} 
              disabled={proposing}
            />
            {proposalErrors.description && <p className="text-error text-xs mt-1 font-semibold">{proposalErrors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label-uppercase text-label-uppercase text-on-surface-variant mb-2 font-bold text-xs tracking-wider" htmlFor="type">
                EVENT CATEGORY TYPE *
              </label>
              <select 
                id="type" 
                name="type"
                className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                value={formData.type} 
                onChange={handleInputChange} 
                disabled={proposing}
              >
                <option value="seminar">Seminar</option>
                <option value="workshop">Workshop</option>
                <option value="competition">Competition</option>
                <option value="sports">Sports Gala</option>
              </select>
            </div>

            <div>
              <label className="block font-label-uppercase text-label-uppercase text-on-surface-variant mb-2 font-bold text-xs tracking-wider" htmlFor="capacity">
                VENUE SEAT CAPACITY *
              </label>
              <input 
                id="capacity" 
                name="capacity"
                type="number" 
                min="1" 
                className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                value={formData.capacity} 
                onChange={handleInputChange} 
                disabled={proposing}
              />
              {proposalErrors.capacity && <p className="text-error text-xs mt-1 font-semibold">{proposalErrors.capacity}</p>}
            </div>
          </div>

          <div>
            <label className="block font-label-uppercase text-label-uppercase text-on-surface-variant mb-2 font-bold text-xs tracking-wider" htmlFor="location">
              VENUE LOCATION *
            </label>
            <input 
              id="location" 
              name="location"
              type="text" 
              placeholder="e.g. Huawei Lab / Academic Block" 
              className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              value={formData.location} 
              onChange={handleInputChange} 
              disabled={proposing}
            />
            {proposalErrors.location && <p className="text-error text-xs mt-1 font-semibold">{proposalErrors.location}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-label-uppercase text-label-uppercase text-on-surface-variant mb-2 font-bold text-xs tracking-wider" htmlFor="startDateTime">
                START DATE & TIME *
              </label>
              <input 
                id="startDateTime" 
                name="startDateTime"
                type="datetime-local" 
                className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                value={formData.startDateTime} 
                onChange={handleInputChange} 
                disabled={proposing}
              />
              {proposalErrors.startDateTime && <p className="text-error text-xs mt-1 font-semibold">{proposalErrors.startDateTime}</p>}
            </div>

            <div>
              <label className="block font-label-uppercase text-label-uppercase text-on-surface-variant mb-2 font-bold text-xs tracking-wider" htmlFor="endDateTime">
                END DATE & TIME *
              </label>
              <input 
                id="endDateTime" 
                name="endDateTime"
                type="datetime-local" 
                className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                value={formData.endDateTime} 
                onChange={handleInputChange} 
                disabled={proposing}
              />
              {proposalErrors.endDateTime && <p className="text-error text-xs mt-1 font-semibold">{proposalErrors.endDateTime}</p>}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={proposing}
            className="w-full py-4 bg-primary text-white font-bold hover:bg-primary-container transition-all flex items-center justify-center gap-2 font-label-uppercase text-label-uppercase tracking-widest text-xs uppercase"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            {proposing ? 'Saving proposal...' : editingEventId ? 'Update & Resubmit for Review' : 'Submit Event for Admin Review'}
          </button>
          {editingEventId && (
            <button
              type="button"
              onClick={handleCancelEventEdit}
              className="w-full border border-outline text-on-surface px-6 py-3 hover:bg-surface-container-low font-label-uppercase text-xs font-bold tracking-widest uppercase"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
