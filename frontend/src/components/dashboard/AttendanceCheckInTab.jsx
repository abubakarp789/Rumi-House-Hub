import React from 'react';
import LoadingState from '../LoadingState';

export default function AttendanceCheckInTab({
  approvedEvents,
  verifyEventId,
  setVerifyEventId,
  handleRefreshAttendance,
  attendanceLoading,
  attendanceList,
  verifying,
  verifySuccess,
  verifyError,
  verifyToken,
  setVerifyToken,
  handleManualCheckInVerify
}) {
  const selectedEvent = approvedEvents.find(e => e._id === verifyEventId);
  const totalCheckedIn = attendanceList.length;
  const capacity = selectedEvent ? (selectedEvent.capacity || 0) : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="border-l-4 border-primary pl-6">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold text-2xl">Attendance Verification</h2>
        <p className="text-on-surface-variant font-body-md text-sm">Executive Command Center for real-time institutional event validation and entry management.</p>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Live Roster List (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Event Selector & Actions */}
          <div className="bg-white border border-outline-variant p-6 flex flex-wrap gap-4 items-end shadow-sm">
            <div className="flex-1 min-w-[250px]">
              <label className="font-label-uppercase text-label-uppercase text-[10px] font-bold text-on-surface-variant block mb-2 tracking-wider">
                SELECT ACTIVE EVENT
              </label>
              <select 
                id="verifyEventId" 
                className="w-full bg-surface border border-outline-variant rounded px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                value={verifyEventId} 
                onChange={(e) => setVerifyEventId(e.target.value)} 
                disabled={verifying}
              >
                <option value="">Choose an approved active event...</option>
                {approvedEvents.map((r) => (
                  <option key={r._id} value={r._id}>{r.title}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleRefreshAttendance}
              disabled={!verifyEventId || attendanceLoading}
              className="bg-primary text-white px-6 py-2.5 hover:bg-primary-container disabled:opacity-50 font-label-uppercase text-label-uppercase text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 shrink-0"
            >
              <span className="material-symbols-outlined text-sm">sync</span>
              Refresh List
            </button>
          </div>

          {/* Attendance Roster Table Card */}
          <div className="bg-white border border-outline-variant overflow-hidden shadow-sm">
            <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant flex justify-between items-center flex-wrap gap-2">
              <h3 className="font-label-uppercase text-label-uppercase text-xs font-bold text-primary tracking-wider uppercase">Live Attendance Roster</h3>
              {verifyEventId && (
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-secondary/20">
                  {totalCheckedIn} Checked In / {capacity} Expected
                </span>
              )}
            </div>
            
            <div className="overflow-x-auto max-h-[450px]">
              {attendanceLoading ? (
                <div className="p-8 text-center"><LoadingState count={2} /></div>
              ) : !verifyEventId ? (
                <div className="px-6 py-12 text-center text-sm text-on-surface-variant">
                  Select an approved event above to activate the live check-in roster.
                </div>
              ) : attendanceList.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-on-surface-variant">
                  No students have checked in for this event yet.
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface-container-low/40 border-b border-outline-variant text-[10px] font-label-uppercase font-bold text-on-surface-variant">
                      <th className="p-4 tracking-wider">Student Name</th>
                      <th className="p-4 tracking-wider">Reg#</th>
                      <th className="p-4 tracking-wider">Dept</th>
                      <th className="p-4 tracking-wider">RSVP Status</th>
                      <th className="p-4 tracking-wider">Check-in Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/40">
                    {attendanceList.map((record) => {
                      const student = record.userId || { name: 'Student', registrationNumber: 'N/A', department: 'CS' };
                      const timeStr = new Date(record.checkInTime).toLocaleTimeString('en-US', {
                        hour: 'numeric', minute: '2-digit'
                      });

                      return (
                        <tr key={record._id} className="hover:bg-surface-container-low/20 transition-colors">
                          <td className="p-4 font-bold text-primary">{student.name}</td>
                          <td className="p-4 font-mono text-[10px] text-outline">{student.registrationNumber}</td>
                          <td className="p-4 text-on-surface-variant">{student.department}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded text-[9px] font-bold uppercase tracking-wider border border-tertiary/10">
                              Confirmed
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="flex items-center gap-1 text-primary font-semibold">
                              <span className="material-symbols-outlined text-sm">check_circle</span>
                              {timeStr}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Scanner & Manual Entry (4 cols) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* QR Scan Trigger Card */}
          <div className="bg-primary p-6 text-white relative overflow-hidden group shadow-sm">
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <div className="relative z-10 text-center">
              <div className="mb-4 inline-block p-4 border border-white/20 bg-white/5">
                <span className="material-symbols-outlined text-5xl">qr_code_scanner</span>
              </div>
              <h4 className="font-headline-sm text-lg font-bold mb-2">Scan Attendance</h4>
              <p className="font-body-sm text-xs text-white/80 mb-6">Initialize integrated camera scanner for rapid student ID verification.</p>
              <button 
                onClick={() => alert('Digital scanner camera hardware is initialized. Present student Event Pass QR Code at the camera.')}
                type="button"
                className="w-full bg-white text-primary px-6 py-3 font-label-uppercase text-label-uppercase text-xs font-bold tracking-widest uppercase transition-all shadow-md active:scale-95 hover:bg-secondary-container hover:text-on-secondary-container"
              >
                Launch Scanner
              </button>
            </div>
          </div>

          {/* Manual Entry Fallback Form */}
          <div className="bg-white border border-outline-variant p-6 shadow-sm">
            <h4 className="font-label-uppercase text-label-uppercase text-xs font-bold text-on-surface-variant mb-4 flex items-center gap-1.5 uppercase tracking-wide">
              <span className="material-symbols-outlined text-base">keyboard</span>
              Manual Entry Fallback
            </h4>

            {verifySuccess && (
              <div className="p-3 mb-4 bg-tertiary-fixed text-on-tertiary-fixed-variant border border-tertiary/20 text-xs font-bold rounded flex items-center gap-1.5" role="alert">
                <span className="material-symbols-outlined text-sm">verified</span>
                {verifySuccess}
              </div>
            )}
            {verifyError && (
              <div className="p-3 mb-4 bg-error-container text-on-error-container border border-error/20 text-xs font-bold rounded flex items-center gap-1.5" role="alert">
                <span className="material-symbols-outlined text-sm">warning</span>
                {verifyError}
              </div>
            )}

            <form onSubmit={handleManualCheckInVerify} className="space-y-4">
              <div>
                <label className="font-body-sm text-xs text-on-surface-variant font-bold block mb-1" htmlFor="verifyToken">
                  Scanned QR payload or full pass token
                </label>
                <input 
                  id="verifyToken" 
                  type="text" 
                  placeholder='Paste {"eventId":"...","passToken":"pass_..."}'
                  className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-sm font-mono text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:font-sans"
                  value={verifyToken} 
                  onChange={(e) => setVerifyToken(e.target.value)}
                  disabled={verifying} 
                />
              </div>
              <button 
                type="submit" 
                disabled={verifying || !verifyEventId}
                className="w-full border border-primary text-primary px-6 py-3 hover:bg-primary hover:text-white transition-all font-label-uppercase text-label-uppercase text-xs font-bold tracking-widest uppercase flex justify-center items-center gap-2 disabled:opacity-40"
              >
                <span className="material-symbols-outlined text-sm">how_to_reg</span>
                {verifying ? 'Authorizing check-in ticket...' : 'Verify Attendance'}
              </button>
            </form>
          </div>

          {/* Event Metadata Panel */}
          {verifyEventId && (
            <div className="bg-surface-container-low p-6 border border-outline-variant shadow-sm">
              <h5 className="font-label-uppercase text-label-uppercase text-[10px] font-bold text-outline mb-4 tracking-wide uppercase">Event Metadata</h5>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                  <span className="text-on-surface-variant">Host Society</span>
                  <span className="font-bold text-primary">
                    {(() => {
                      return selectedEvent && typeof selectedEvent.societyId === 'object' 
                        ? selectedEvent.societyId.name 
                        : 'Dean\'s Council';
                    })()}
                  </span>
                </div>
                <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                  <span className="text-on-surface-variant">Seat Capacity</span>
                  <span className="font-bold">{capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Gate Status</span>
                  <span className="font-bold text-primary flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                    In Progress
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
