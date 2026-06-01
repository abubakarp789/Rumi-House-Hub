import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api/api';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

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

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('memberships');
  const [memberships, setMemberships] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrPasses, setQrPasses] = useState({});
  const [checkInEventId, setCheckInEventId] = useState('');
  
  // Digit-based manual check-in state
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const digitRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
  
  const [checkInSuccess, setCheckInSuccess] = useState('');
  const [checkInError, setCheckInError] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);

  // Sync active tab with query params (?tab=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['memberships', 'rsvps', 'checkin', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError('');
        const data = await api.getCurrentUser();
        setMemberships(data.memberships || []);
        setRsvps(data.rsvps || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load student workspace details. Local database offline.');
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleLoadQr = async (eventId) => {
    if (qrPasses[eventId]) {
      // Toggle logic to hide pass if clicked again
      setQrPasses((prev) => {
        const copy = { ...prev };
        delete copy[eventId];
        return copy;
      });
      return;
    }
    try {
      const data = await api.getEventQr(eventId);
      setQrPasses((prev) => ({ ...prev, [eventId]: data }));
    } catch (err) {
      console.error('Failed to load QR code pass:', err);
    }
  };

  const handleDigitChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Auto-focus next input
    if (value && index < 5) {
      digitRefs[index + 1].current.focus();
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      digitRefs[index - 1].current.focus();
    }
  };

  const handleManualCheckInSubmit = async (e) => {
    e.preventDefault();
    setCheckInSuccess('');
    setCheckInError('');

    if (!checkInEventId) {
      setCheckInError('Please select a registered event.');
      return;
    }

    const token = digits.join('').trim();
    if (token.length !== 6) {
      setCheckInError('Please enter the complete 6-digit session check-in token.');
      return;
    }

    try {
      setCheckingIn(true);
      const response = await api.recordCheckIn(checkInEventId, token);
      setCheckInSuccess(response.message || 'Attendance check-in verified successfully!');
      setDigits(['', '', '', '', '', '']);
      if (digitRefs[0] && digitRefs[0].current) {
        digitRefs[0].current.focus();
      }
    } catch (err) {
      console.error(err);
      setCheckInError(err.message || 'Check-in validation failed.');
    } finally {
      setCheckingIn(false);
    }
  };

  // Bento Stats calculations
  const approvedCount = memberships.filter((m) => m.status === 'approved').length;
  const pendingCount = memberships.filter((m) => m.status === 'pending').length;
  const rejectedCount = memberships.filter((m) => m.status === 'rejected').length;

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-44 bg-surface-container-high w-full rounded"></div>
        <div className="h-10 bg-surface-container-high w-1/3 rounded"></div>
        <div className="h-60 bg-surface-container-high w-full rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Personal Header & Summary Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-end">
        <div className="md:col-span-8">
          <span className="font-label-uppercase text-label-uppercase text-secondary tracking-[0.2em] mb-2 block font-bold text-xs">
            Welcome Back
          </span>
          <h3 className="font-display-lg text-display-lg text-primary mb-2 font-bold">
            {user.name}
          </h3>
          <div className="flex flex-wrap gap-6 text-on-surface-variant font-body-md border-l-2 border-outline-variant pl-4">
            <p><span className="font-bold text-on-surface">Reg #:</span> <span className="font-mono text-sm">{user.registrationNumber}</span></p>
            <p><span className="font-bold text-on-surface">Dept:</span> {user.department}</p>
            <p><span className="font-bold text-on-surface">Batch:</span> {user.batch}</p>
          </div>
        </div>
        <div className="md:col-span-4 grid grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant p-6 editorial-shadow hover:border-primary transition-all duration-300">
            <p className="font-label-uppercase text-label-uppercase text-secondary mb-1 font-bold text-[10px] tracking-wider uppercase">Memberships</p>
            <p className="text-4xl font-display-lg text-primary font-bold">
              {String(memberships.length).padStart(2, '0')}
            </p>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant p-6 editorial-shadow hover:border-primary transition-all duration-300">
            <p className="font-label-uppercase text-label-uppercase text-secondary mb-1 font-bold text-[10px] tracking-wider uppercase">Events</p>
            <p className="text-4xl font-display-lg text-primary font-bold">
              {String(rsvps.length).padStart(2, '0')}
            </p>
          </div>
        </div>
      </section>

      {error && (
        <div className="p-4 bg-error-container text-on-error-container border border-error text-xs rounded" role="alert">
          {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <section className="border-b border-outline-variant">
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <button 
            className={`pb-4 font-label-uppercase text-label-uppercase font-bold text-xs tracking-wider transition-all border-b-2 ${
              activeTab === 'memberships' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
            onClick={() => setActiveTab('memberships')}
          >
            My Societies ({memberships.length})
          </button>
          <button 
            className={`pb-4 font-label-uppercase text-label-uppercase font-bold text-xs tracking-wider transition-all border-b-2 ${
              activeTab === 'rsvps' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
            onClick={() => setActiveTab('rsvps')}
          >
            My Event Passes ({rsvps.length})
          </button>
          <button 
            className={`pb-4 font-label-uppercase text-label-uppercase font-bold text-xs tracking-wider transition-all border-b-2 ${
              activeTab === 'checkin' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
            onClick={() => setActiveTab('checkin')}
          >
            Manual Check-in
          </button>
          <button 
            className={`pb-4 font-label-uppercase text-label-uppercase font-bold text-xs tracking-wider transition-all border-b-2 ${
              activeTab === 'profile' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Settings
          </button>
        </div>
      </section>

      {/* Content Panels */}
      <div className="min-h-[400px]">
        
        {/* MEMBERSHIPS TAB */}
        {activeTab === 'memberships' && (
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
                              <Link 
                                to={`/societies/${soc._id}`} 
                                className="text-primary hover:underline text-xs font-label-uppercase font-bold tracking-wider"
                              >
                                View Desk
                              </Link>
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
        )}

        {/* RSVPS TAB */}
        {activeTab === 'rsvps' && (
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
                onAction={() => { window.location.href = '/events'; }}
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
                          {qrPasses[evt._id] ? `TOKEN: ${qrPasses[evt._id].checkInToken}` : `ID: PASS-${rsvp._id.slice(-6).toUpperCase()}`}
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
                              <h3 className="font-headline-sm text-sm text-primary font-bold leading-tight group-hover:text-primary transition-colors">
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
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MANUAL CHECK-IN TAB */}
        {activeTab === 'checkin' && (
          <div className="max-w-xl mx-auto py-8 animate-fade-in">
            <div className="bg-surface-container-lowest border border-outline-variant p-8 md:p-10 shadow-sm text-center">
              <div className="mb-4 inline-block p-4 border-2 border-primary/20 rounded-xl bg-primary/5 text-primary">
                <span className="material-symbols-outlined text-[48px]">how_to_reg</span>
              </div>
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold mb-2">Venue Session Gate Console</h2>
              <p className="text-on-surface-variant text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Integrated checkpoint manual override. Select your registered co-curricular event below and input the unique 6-digit session pass token.
              </p>

              {checkInSuccess && (
                <div className="p-4 mb-6 bg-tertiary-fixed/30 text-on-tertiary-fixed-variant border border-tertiary/40 rounded flex items-start gap-3 text-left animate-fade-in" role="alert">
                  <span className="material-symbols-outlined text-[18px] text-tertiary font-bold">verified</span>
                  <div>
                    <p className="font-bold text-xs">Access Granted</p>
                    <p className="text-[11px] opacity-90">{checkInSuccess}</p>
                  </div>
                </div>
              )}
              {checkInError && (
                <div className="p-4 mb-6 bg-error-container/30 text-on-error-container border border-error/30 rounded flex items-start gap-3 text-left animate-fade-in" role="alert">
                  <span className="material-symbols-outlined text-[18px] text-error font-bold">warning</span>
                  <div>
                    <p className="font-bold text-xs">Verification Failed</p>
                    <p className="text-[11px] opacity-90">{checkInError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleManualCheckInSubmit} className="space-y-6 text-left">
                <div>
                  <label className="block font-label-uppercase text-label-uppercase text-on-surface-variant mb-2 font-bold text-xs" htmlFor="checkin-select">
                    Select Active Event Gate
                  </label>
                  <select 
                    id="checkin-select" 
                    className="w-full bg-surface px-4 py-3 border border-outline-variant focus:border-primary focus:ring-0 transition-all font-body-md text-body-md outline-none text-on-background rounded-none"
                    value={checkInEventId} 
                    onChange={(e) => setCheckInEventId(e.target.value)} 
                    disabled={checkingIn}
                  >
                    <option value="">Choose an active event pass...</option>
                    {rsvps.map((r) => (
                      <option key={r._id} value={r.eventId._id}>{r.eventId.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-label-uppercase text-label-uppercase text-on-surface-variant mb-3 font-bold text-xs">
                    6-Digit Keypad Verification Token
                  </label>
                  <div className="flex justify-between gap-2 max-w-xs mx-auto">
                    {digits.map((digit, index) => (
                      <input
                        key={index}
                        ref={digitRefs[index]}
                        type="text"
                        maxLength="1"
                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-outline-variant focus:border-primary focus:ring-0 bg-surface outline-none transition-all rounded-none"
                        value={digit}
                        onChange={(e) => handleDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleDigitKeyDown(index, e)}
                        disabled={checkingIn}
                      />
                    ))}
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={checkingIn}
                  className="w-full border border-primary text-primary px-6 py-4 rounded font-label-uppercase text-label-uppercase hover:bg-primary hover:text-white transition-all flex justify-center items-center gap-2 font-bold tracking-widest text-xs uppercase"
                >
                  <span className="material-symbols-outlined text-lg">done_all</span>
                  {checkingIn ? 'Verifying Entry Gate...' : 'Submit Code & Open Gate'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-12 gap-gutter animate-fade-in">
            {/* Left Column: Credentials overview panel */}
            <div className="col-span-12 lg:col-span-4 space-y-gutter">
              <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-none flex flex-col items-center text-center shadow-sm">
                <div className="relative mb-6">
                  <div className="h-32 w-32 rounded-none border-2 border-primary p-1 bg-white">
                    <img 
                      alt="Avatar" 
                      className="w-full h-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8o-9hfTUgxDmX05MSXOdLOBuuSF2VPBmKnsOuxS0Beo7OW7yhnzm34zq6bD7YVR8LlWVihMd6eRDlQboLnpt7xgW_4VTlsd3pISZE9Kj5LIDbWlrfmLnrvKaoryReybl69DmnVc4QH6VNf5rw6YRgVJVTaD7scSIYuNgiuF4VCmWmkm50SRWLI5oAnexk1b2CEH9cxD8kxUP58-59rwG8Kq1sKiU5wCiXIQB-0ZFhxnVay6PLBR74N68Y-WV9D3fTbiO-re30u7Be" 
                    />
                  </div>
                  <button className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-2 rounded-none shadow-sm hover:bg-primary-container transition-all text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  </button>
                </div>
                <h3 className="font-headline-sm text-headline-sm mb-1 font-bold text-on-surface">{user.name}</h3>
                <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container font-label-uppercase text-[10px] rounded-[2px] mb-6 font-bold uppercase capitalize">
                  {user.role}
                </span>
                
                <div className="w-full space-y-4 pt-6 border-t border-outline-variant/60">
                  <div className="flex justify-between items-center text-left">
                    <span className="font-label-uppercase text-[10px] text-on-surface-variant font-bold">REGISTRATION ID</span>
                    <span className="font-body-sm font-semibold font-mono text-xs text-on-surface">{user.registrationNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-left">
                    <span className="font-label-uppercase text-[10px] text-on-surface-variant font-bold">DEPARTMENT</span>
                    <span className="font-body-sm font-semibold text-xs text-on-surface">{user.department}</span>
                  </div>
                  <div className="flex justify-between items-center text-left">
                    <span className="font-label-uppercase text-[10px] text-on-surface-variant font-bold">BATCH COHORT</span>
                    <span className="font-body-sm font-semibold text-xs text-on-surface">{user.batch}</span>
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-primary text-on-primary p-6 rounded-none flex items-center gap-3 shadow-sm">
                <span className="material-symbols-outlined text-secondary-fixed text-2xl font-bold">verified_user</span>
                <div>
                  <span className="font-label-uppercase text-[9px] text-white/80 block uppercase tracking-wider font-bold">CAMPUS ENROLLMENT STATUS</span>
                  <span className="font-body-md font-bold text-white text-sm">Active & Verified Student</span>
                </div>
              </div>
            </div>

            {/* Right Column: Personal Information & Password update details forms */}
            <div className="col-span-12 lg:col-span-8 space-y-gutter">
              {/* Profile Information Form */}
              <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-none shadow-sm">
                <div className="flex justify-between items-end mb-8 border-b border-outline-variant/30 pb-4">
                  <div>
                    <span className="font-label-uppercase text-label-uppercase text-primary mb-2 block font-bold text-xs tracking-wider">
                      ACCOUNT DETAILS
                    </span>
                    <h4 className="font-headline-sm text-lg font-bold text-on-surface">Personal Information</h4>
                  </div>
                  <span className="text-xs text-on-surface-variant italic">Last updated: June 01, 2026</span>
                </div>

                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="font-label-uppercase text-label-uppercase text-on-surface-variant font-bold text-xs tracking-wider block">
                        FULL NAME
                      </label>
                      <input 
                        className="w-full bg-surface border border-outline-variant px-4 py-3 focus:border-primary focus:ring-0 rounded-none font-body-md transition-all outline-none" 
                        type="text" 
                        defaultValue={user.name}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-uppercase text-label-uppercase text-on-surface-variant font-bold text-xs tracking-wider block">
                        EMAIL ADDRESS
                      </label>
                      <input 
                        className="w-full bg-surface border border-outline-variant px-4 py-3 focus:border-primary focus:ring-0 rounded-none font-body-md transition-all outline-none font-mono" 
                        type="email" 
                        defaultValue={user.email} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-uppercase text-label-uppercase text-on-surface-variant font-bold text-xs tracking-wider block">
                        PHONE NUMBER
                      </label>
                      <input 
                        className="w-full bg-surface border border-outline-variant px-4 py-3 focus:border-primary focus:ring-0 rounded-none font-body-md transition-all outline-none" 
                        placeholder="+92 300 1234567" 
                        type="text" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-label-uppercase text-label-uppercase text-on-surface-variant font-bold text-xs tracking-wider block">
                        EMERGENCY CONTACT
                      </label>
                      <input 
                        className="w-full bg-surface border border-outline-variant px-4 py-3 focus:border-primary focus:ring-0 rounded-none font-body-md transition-all outline-none" 
                        placeholder="Name & Contact Details" 
                        type="text" 
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button 
                      className="bg-primary text-on-primary px-8 py-3 font-label-uppercase text-label-uppercase hover:bg-primary-container transition-all flex items-center gap-2 text-white font-bold text-xs tracking-wider uppercase rounded" 
                      type="button"
                    >
                      Save Changes
                      <span className="material-symbols-outlined text-[18px]">done_all</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Password Update Section */}
              <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-none shadow-sm relative">
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 bg-secondary-fixed text-on-secondary-fixed-variant text-[9px] font-bold uppercase tracking-wider rounded border border-secondary/20">Coming Soon</span>
                </div>
                <div className="mb-8 border-b border-outline-variant/30 pb-4">
                  <span className="font-label-uppercase text-label-uppercase text-primary mb-2 block font-bold text-xs tracking-wider">
                    SECURITY CREDENTIALS
                  </span>
                  <h4 className="font-headline-sm text-lg font-bold text-on-surface">Authentication</h4>
                </div>

                <form className="space-y-6 opacity-50 pointer-events-none" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-label-uppercase text-label-uppercase text-on-surface-variant font-bold text-xs tracking-wider block">
                        CURRENT PASSWORD
                      </label>
                      <input 
                        className="w-full bg-surface border border-outline-variant px-4 py-3 focus:border-primary focus:ring-0 rounded-none font-body-md transition-all outline-none" 
                        type="password" 
                        disabled
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="font-label-uppercase text-label-uppercase text-on-surface-variant font-bold text-xs tracking-wider block">
                          NEW PASSWORD
                        </label>
                        <input 
                          className="w-full bg-surface border border-outline-variant px-4 py-3 focus:border-primary focus:ring-0 rounded-none font-body-md transition-all outline-none" 
                          type="password" 
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="font-label-uppercase text-label-uppercase text-on-surface-variant font-bold text-xs tracking-wider block">
                          CONFIRM NEW PASSWORD
                        </label>
                        <input 
                          className="w-full bg-surface border border-outline-variant px-4 py-3 focus:border-primary focus:ring-0 rounded-none font-body-md transition-all outline-none" 
                          type="password" 
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 flex flex-wrap justify-between items-center gap-4">
                    <p className="text-on-surface-variant font-body-sm text-xs max-w-[320px] leading-relaxed">
                      Password management will be available in a future update.
                    </p>
                    <button 
                      className="border border-outline text-on-surface px-8 py-3 font-label-uppercase text-label-uppercase hover:bg-surface-container-high transition-all text-xs font-bold uppercase tracking-wider rounded opacity-50 cursor-not-allowed" 
                      type="button"
                      disabled
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="border border-error/30 bg-error-container/5 p-8 rounded-none flex flex-wrap justify-between items-center gap-4 shadow-sm relative">
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 bg-secondary-fixed text-on-secondary-fixed-variant text-[9px] font-bold uppercase tracking-wider rounded border border-secondary/20">Coming Soon</span>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-error mb-1">Session Management</h5>
                  <p className="text-xs text-on-surface-variant">Sign out of all other active sessions across devices.</p>
                </div>
                <button className="bg-error text-white px-6 py-2.5 font-label-uppercase text-xs font-bold uppercase tracking-wider rounded opacity-50 cursor-not-allowed" disabled>
                  TERMINATE ALL SESSIONS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
