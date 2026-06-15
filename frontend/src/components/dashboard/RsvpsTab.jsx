import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmptyState from '../EmptyState';

export default function RsvpsTab({ rsvps, qrPasses, handleLoadQr, handleCancelRsvp }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6 border-b border-outline-variant/30 pb-4">
        <span className="font-label-uppercase text-label-uppercase text-primary mb-2 block font-bold text-xs">
          VERIFICATION PASSPORTS
        </span>
        <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Active Event Passes</h2>
        <p className="text-on-surface-variant text-sm mt-1">Show or fallback print co-curricular credentials for scanned venue entry at campus gate checkpoints.</p>
      </div>

      {rsvps.length === 0 ? (
        <EmptyState
          message="You have no active co-curricular event passes registered."
          actionLabel="View Event Calendar"
          onAction={() => { navigate('/events'); }}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {rsvps.map((rsvp) => {
            const evt = rsvp.eventId;
            if (!evt) return null;
            
            const isCheckedIn = rsvp.status === 'checked-in' || rsvp.checkedIn;
            
            const evtDate = new Date(evt.startDateTime);
            const formattedDate = evtDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const formattedTime = evtDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

            return (
              <article 
                key={rsvp._id} 
                className="flex flex-col md:flex-row bg-surface-container-lowest border border-outline-variant/60 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Left Panel: qr-gradient passport side */}
                <div 
                  className="p-6 flex flex-col items-center justify-center min-w-[200px] text-white text-center relative"
                  style={{ background: 'linear-gradient(135deg, #005026 0%, #fdcc14 100%)' }}
                >
                  {qrPasses[evt._id] ? (
                    <div className="bg-white p-2.5 rounded-lg mb-3 shadow-md animate-fade-in">
                      <img 
                        src={qrPasses[evt._id].qrUrl} 
                        alt="Verification QR code" 
                        className="w-24 h-24 object-contain"
                      />
                    </div>
                  ) : (
                    <div 
                      onClick={() => handleLoadQr(evt._id)}
                      className="bg-white/10 p-3 rounded-lg mb-3 border border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white/20 transition-all w-24 h-24 shadow-inner"
                    >
                      <span className="material-symbols-outlined text-3xl text-white">qr_code_2</span>
                      <span className="text-[9px] uppercase font-bold tracking-widest mt-1">Tap to Load</span>
                    </div>
                  )}
                  <span className="font-label-uppercase text-[10px] tracking-widest text-white drop-shadow font-bold">
                    {qrPasses[evt._id] ? `PASS ID: ${qrPasses[evt._id].passId}` : `ID: PASS-${rsvp._id.slice(-6).toUpperCase()}`}
                  </span>
                </div>

                {/* Right Panel: Clean Details Sheet */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div>
                        <span className="font-label-uppercase text-[10px] text-secondary font-bold block mb-1 uppercase tracking-wider">
                          {evt.type || 'Institutional Event'}
                        </span>
                        <h3 className="font-headline-sm text-sm text-primary font-bold leading-tight">
                          {evt.title}
                        </h3>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full font-label-uppercase text-[9px] font-bold tracking-wider uppercase shrink-0 ${
                        isCheckedIn 
                          ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' 
                          : 'bg-error-container text-on-error-container'
                      }`}>
                        {isCheckedIn ? 'Checked In' : 'Not Verified'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 pt-3 border-t border-outline-variant/30">
                      <div>
                        <p className="text-[9px] font-label-uppercase text-outline font-bold mb-1 uppercase tracking-wider">Venue Coordinates</p>
                        <p className="text-xs font-bold text-on-surface flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-primary">location_on</span>
                          {evt.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] font-label-uppercase text-outline font-bold mb-1 uppercase tracking-wider">Time Badge</p>
                        <p className="text-xs font-bold text-on-surface flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-primary">schedule</span>
                          {formattedDate}, {formattedTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action anchors */}
                  <div className="mt-auto pt-4 border-t border-outline-variant/30 flex gap-3 items-center">
                    <Link 
                      to={`/events/${evt._id}`} 
                      className="flex-grow text-center bg-primary text-white py-2 rounded font-label-uppercase text-xs font-bold hover:bg-primary-container transition-all uppercase tracking-wider"
                    >
                      Details
                    </Link>
                    <button 
                      onClick={() => handleLoadQr(evt._id)}
                      className="px-4 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-uppercase text-xs font-bold rounded flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-sm">qr_code_2</span>
                      {qrPasses[evt._id] ? 'Hide Pass' : 'Reveal QR'}
                    </button>
                    <button
                      type="button"
                      disabled={isCheckedIn}
                      onClick={() => {
                        if (window.confirm(`Cancel your RSVP for ${evt.title}?`)) handleCancelRsvp(rsvp);
                      }}
                      className="px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed rounded"
                      aria-label={isCheckedIn ? 'Checked-in pass cannot be cancelled' : `Cancel RSVP for ${evt.title}`}
                      title={isCheckedIn ? 'Checked-in passes cannot be cancelled' : 'Cancel RSVP'}
                    >
                      <span className="material-symbols-outlined text-sm">event_busy</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
