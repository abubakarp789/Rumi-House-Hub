import React, { useContext, useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api/api';
import Modal from '../components/Modal';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

export default function ExecutiveDashboard() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('events');
  
  const [events, setEvents] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [proposalSuccess, setProposalSuccess] = useState('');
  const [proposalErrors, setProposalErrors] = useState({});
  const [proposing, setProposing] = useState(false);
  const [formData, setFormData] = useState({
    societyId: '',
    title: '',
    description: '',
    type: 'seminar',
    location: '',
    startDateTime: '',
    endDateTime: '',
    capacity: 50
  });

  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [activeEventTitle, setActiveEventTitle] = useState('');

  // Attendance manual verify states
  const [verifyEventId, setVerifyEventId] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [verifySuccess, setVerifySuccess] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Sync active tab with URL queries
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['society', 'propose', 'events', 'attendance', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (tabParam === 'dashboard' || !tabParam) {
      setActiveTab('events');
    }
  }, [location]);

  useEffect(() => {
    async function loadExecutiveData() {
      try {
        setLoading(true);
        setError('');
        const [socList, allEvts] = await Promise.all([
          api.getSocieties(),
          api.getEvents('all')
        ]);
        setSocieties(socList);
        
        // Filter events created by this executive or related to the societies managed
        const ownedEvents = allEvts.filter(
          (event) => event.createdBy === user._id || event.createdBy?._id === user._id
        );
        setEvents(ownedEvents);
      } catch (err) {
        console.error(err);
        if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
          setError('Unable to connect to the backend server. Please ensure the server is running on port 5000.');
        } else {
          setError(err.message || 'Failed to load executive dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadExecutiveData();
  }, [user]);
  
  // Auto-load attendance list for check-in verification tab
  useEffect(() => {
    if (verifyEventId) {
      async function loadLiveAttendance() {
        try {
          setAttendanceLoading(true);
          const list = await api.getEventAttendance(verifyEventId);
          setAttendanceList(list);
        } catch (err) {
          console.error(err);
        } finally {
          setAttendanceLoading(false);
        }
      }
      loadLiveAttendance();
    } else {
      setAttendanceList([]);
    }
  }, [verifyEventId]);

  const handleRefreshAttendance = async () => {
    if (!verifyEventId) return;
    try {
      setAttendanceLoading(true);
      const list = await api.getEventAttendance(verifyEventId);
      setAttendanceList(list);
    } catch (err) {
      console.error(err);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (proposalErrors[name]) {
      setProposalErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateProposal = () => {
    const errors = {};
    if (!formData.societyId) errors.societyId = 'Hosting society selection is required.';
    if (!formData.title.trim()) errors.title = 'Event title header is required.';
    if (!formData.description.trim()) errors.description = 'Detailed outlines & objective description is required.';
    if (!formData.location.trim()) errors.location = 'Venue location is required.';
    if (!formData.startDateTime) errors.startDateTime = 'Start date/time are required.';
    if (!formData.endDateTime) errors.endDateTime = 'End date/time are required.';
    if (!formData.capacity || parseInt(formData.capacity, 10) < 1) errors.capacity = 'Seat capacity must be at least 1.';
    setProposalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    setProposalSuccess('');
    if (!validateProposal()) return;

    try {
      setProposing(true);
      const response = await api.createEvent(formData);
      setProposalSuccess(response.message || 'Co-curricular event proposal drafted and queued successfully!');
      setEvents((prev) => [response.event, ...prev]);
      setFormData({
        societyId: '',
        title: '',
        description: '',
        type: 'seminar',
        location: '',
        startDateTime: '',
        endDateTime: '',
        capacity: 50
      });
      setTimeout(() => {
        setProposalSuccess('');
        setActiveTab('events');
      }, 1500);
    } catch (err) {
      console.error(err);
      setProposalErrors({ submitError: err.message || 'Failed to submit event proposal.' });
    } finally {
      setProposing(false);
    }
  };

  const handleLoadAttendance = async (eventId, eventTitle) => {
    try {
      setActiveEventTitle(eventTitle);
      setIsAttendanceOpen(true);
      setAttendanceLoading(true);
      const list = await api.getEventAttendance(eventId);
      setAttendanceList(list);
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve checked-in attendees roster list.');
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleManualCheckInVerify = async (e) => {
    e.preventDefault();
    setVerifySuccess('');
    setVerifyError('');

    if (!verifyEventId) {
      setVerifyError('Please select a verified co-curricular event.');
      return;
    }
    if (!verifyToken.trim() || verifyToken.trim().length !== 6) {
      setVerifyError('Verification passcode must be exactly 6 alphanumeric digits.');
      return;
    }

    try {
      setVerifying(true);
      const response = await api.recordCheckIn(verifyEventId, verifyToken.trim());
      setVerifySuccess(response.message || 'Student venue entry check-in verified and updated.');
      setVerifyToken('');
      
      // Auto-update the live attendee roster list
      const updatedList = await api.getEventAttendance(verifyEventId);
      setAttendanceList(updatedList);
    } catch (err) {
      console.error(err);
      setVerifyError(err.message || 'Check-in entry passcode verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-44 bg-surface-container-high w-full rounded"></div>
        <div className="h-10 bg-surface-container-high w-1/3 rounded"></div>
        <div className="h-60 bg-surface-container-high w-full rounded"></div>
      </div>
    );
  }

  const approvedEvents = events.filter(e => e.status === 'approved');

  return (
    <div className="space-y-12">
      {/* Welcome & Overview Header */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white border border-outline-variant p-8 md:p-10 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div className="relative z-10 max-w-xl">
            <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block mb-2 font-bold text-xs uppercase">
              Welcome Back
            </span>
            <h3 className="font-display-lg text-headline-md leading-tight text-primary font-bold mb-4">
              Strategic Oversight for Rumi House
            </h3>
            <p className="font-body-md text-on-surface-variant leading-relaxed mb-6">
              Review ongoing co-curricular proposals, manage member registrations, and coordinate checked-in attendance sheets aligned with Namal regulations.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4 mt-auto">
            <button 
              onClick={() => setActiveTab('propose')}
              className="bg-primary text-white px-6 py-3 hover:bg-primary-container font-label-uppercase text-label-uppercase text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              Propose New Event
            </button>
            <button 
              onClick={() => setActiveTab('attendance')}
              className="border border-outline text-primary px-6 py-3 hover:bg-surface-container-low font-label-uppercase text-label-uppercase text-xs font-bold tracking-widest uppercase transition-colors"
            >
              Verify Passcodes
            </button>
          </div>
          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none hidden md:block">
            <span className="material-symbols-outlined text-[160px] text-primary">
              architecture
            </span>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-primary p-6 md:p-8 text-white border border-outline-variant flex-1 flex flex-col justify-center">
            <p className="font-label-uppercase text-label-uppercase text-secondary tracking-widest text-[10px] uppercase font-bold mb-2">
              CURRENT STANDING
            </p>
            <h4 className="font-headline-sm text-headline-sm font-bold mb-3">
              Top Tier Society Bearer
            </h4>
            <div className="flex items-center gap-1.5 text-secondary">
              <span className="material-symbols-outlined fill-1">star</span>
              <span className="material-symbols-outlined fill-1">star</span>
              <span className="material-symbols-outlined fill-1">star</span>
              <span className="material-symbols-outlined fill-1">star</span>
              <span className="material-symbols-outlined opacity-40">star</span>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 border border-outline-variant flex-1 flex flex-col justify-center">
            <p className="font-label-uppercase text-label-uppercase text-primary tracking-widest text-[10px] uppercase font-bold mb-2">
              ACTIVE LEDGER PORTFOLIO
            </p>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-display-lg font-bold text-primary">{events.length}</span>
              <span className="text-tertiary text-xs font-bold pb-1">
                +12% Proposed this term
              </span>
            </div>
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
              activeTab === 'events' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
            onClick={() => setActiveTab('events')}
          >
            Proposed Events Queue ({events.length})
          </button>
          <button 
            className={`pb-4 font-label-uppercase text-label-uppercase font-bold text-xs tracking-wider transition-all border-b-2 ${
              activeTab === 'society' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
            onClick={() => setActiveTab('society')}
          >
            Society Roster Details
          </button>
          <button 
            className={`pb-4 font-label-uppercase text-label-uppercase font-bold text-xs tracking-wider transition-all border-b-2 ${
              activeTab === 'propose' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
            onClick={() => setActiveTab('propose')}
          >
            Draft Event Proposal
          </button>
          <button 
            className={`pb-4 font-label-uppercase text-label-uppercase font-bold text-xs tracking-wider transition-all border-b-2 ${
              activeTab === 'attendance' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
            onClick={() => setActiveTab('attendance')}
          >
            Passcode Attendance Check-in
          </button>
          <button 
            className={`pb-4 font-label-uppercase text-label-uppercase font-bold text-xs tracking-wider transition-all border-b-2 ${
              activeTab === 'profile' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Credentials Profile
          </button>
        </div>
      </section>

      {/* Active Tab Panel */}
      <div className="min-h-[400px]">
        {/* PROPOSED EVENTS QUEUE */}
        {activeTab === 'events' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header section with search/filter design elements */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <span className="font-label-uppercase text-label-uppercase text-xs font-bold tracking-wider text-secondary">EXECUTIVE PORTAL</span>
                <h2 className="font-display-lg text-display-lg text-primary mt-2 font-bold text-3xl">Proposed Events</h2>
                <p className="text-sm text-on-surface-variant mt-1">Review, manage, and audit institutional event proposals for the upcoming academic semester.</p>
              </div>
              <div className="flex flex-wrap gap-4 w-full md:w-auto">
                <button 
                  onClick={() => setActiveTab('propose')}
                  className="bg-primary text-white px-6 py-2.5 hover:bg-primary-container font-label-uppercase text-label-uppercase text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  New Proposal
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 bg-white border border-outline-variant p-6 flex justify-between items-center shadow-sm">
                <div className="flex gap-8 md:gap-12 flex-wrap">
                  <div>
                    <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Total Proposals</p>
                    <p className="font-headline-md text-2xl text-on-surface font-bold">{events.length}</p>
                  </div>
                  <div>
                    <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Awaiting Review</p>
                    <p className="font-headline-md text-2xl text-secondary font-bold">
                      {events.filter(e => e.status === 'pendingApproval' || e.status === 'pending').length}
                    </p>
                  </div>
                  <div>
                    <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 font-bold uppercase tracking-wider">Approved Total</p>
                    <p className="font-headline-md text-2xl text-primary font-bold">
                      {events.filter(e => e.status === 'approved').length}
                    </p>
                  </div>
                </div>
                <div className="h-12 w-32 flex items-end gap-1 shrink-0 hidden sm:flex">
                  <div className="bg-primary-fixed-dim w-3 h-1/2 rounded-t-sm"></div>
                  <div className="bg-primary-container w-3 h-3/4 rounded-t-sm"></div>
                  <div className="bg-primary w-3 h-full rounded-t-sm"></div>
                  <div className="bg-secondary-container w-3 h-2/3 rounded-t-sm"></div>
                  <div className="bg-tertiary-container w-3 h-1/3 rounded-t-sm"></div>
                </div>
              </div>
              <div className="md:col-span-4 bg-primary text-white p-6 border border-outline-variant shadow-sm flex flex-col justify-between">
                <div>
                  <p className="font-label-uppercase text-[10px] opacity-80 mb-1 font-bold uppercase tracking-wider">System Notice</p>
                  <p className="font-body-md text-xs leading-relaxed">All co-curricular events must satisfy seat capacity and venue regulation parameters before submission.</p>
                </div>
                <a className="text-secondary-fixed text-xs font-bold font-label-uppercase tracking-wider hover:underline inline-flex items-center gap-1 mt-3" href="#">
                  View Regulations <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                </a>
              </div>
            </div>

            {/* Events Portfolio Table */}
            {events.length === 0 ? (
              <EmptyState
                message="No co-curricular events have been proposed under your desk yet."
                actionLabel="Draft Event Proposal Now"
                onAction={() => setActiveTab('propose')}
              />
            ) : (
              <div className="bg-white border border-outline-variant overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-outline-variant font-label-uppercase text-[10px] text-on-surface-variant font-bold">
                        <th className="px-6 py-4 tracking-wider">Event Title</th>
                        <th className="px-6 py-4 tracking-wider">Type</th>
                        <th className="px-6 py-4 tracking-wider">Date &amp; Venue</th>
                        <th className="px-6 py-4 tracking-wider text-center">Capacity</th>
                        <th className="px-6 py-4 tracking-wider text-center">RSVP</th>
                        <th className="px-6 py-4 tracking-wider">Status</th>
                        <th className="px-6 py-4 tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/40">
                      {events.map((evt) => {
                        const dateStr = new Date(evt.startDateTime).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        });
                        const rsvpsCount = evt.rsvpsCount || evt.rsvps?.length || 0;

                        return (
                          <tr key={evt._id} className="hover:bg-surface-container-low/30 transition-colors">
                            <td className="px-6 py-5">
                              <p className="font-headline-sm text-sm text-primary font-bold leading-tight">{evt.title}</p>
                              <p className="font-body-sm text-[10px] text-on-surface-variant mt-1 font-mono uppercase">ID: {evt._id.slice(-8).toUpperCase()}</p>
                            </td>
                            <td className="px-6 py-5">
                              <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant text-[9px] font-bold uppercase tracking-wider rounded border border-outline-variant">
                                {evt.type}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-1.5 text-on-surface font-semibold">
                                <span className="material-symbols-outlined text-xs text-primary">calendar_month</span>
                                <span>{dateStr}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-on-surface-variant mt-1">
                                <span className="material-symbols-outlined text-xs text-outline">location_on</span>
                                <span>{evt.location}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5 text-center font-semibold text-on-surface">{evt.capacity}</td>
                            <td className="px-6 py-5 text-center font-bold text-primary">{rsvpsCount}</td>
                            <td className="px-6 py-5">
                              {evt.status === 'approved' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-on-tertiary-container text-on-tertiary-fixed text-[9px] font-bold border border-tertiary/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                  APPROVED
                                </span>
                              ) : evt.status === 'pendingApproval' || evt.status === 'pending' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[9px] font-bold border border-secondary/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                  PENDING
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container text-[9px] font-bold border border-error/20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                  REJECTED
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex justify-end gap-2">
                                {evt.status === 'approved' ? (
                                  <>
                                    <button 
                                      onClick={() => handleLoadAttendance(evt._id, evt.title)}
                                      className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-primary flex items-center justify-center border border-primary/20"
                                      title="Inspect Attendance Roster"
                                    >
                                      <span className="material-symbols-outlined text-[16px]">group</span>
                                    </button>
                                    <Link 
                                      to={`/events/${evt.slug || evt._id}`}
                                      className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant flex items-center justify-center border border-outline-variant"
                                      title="View Public Details"
                                    >
                                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                                    </Link>
                                  </>
                                ) : (
                                  <span className="text-[10px] text-on-surface-variant italic font-semibold uppercase">
                                    Locked
                                  </span>
                                )}
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
        )}

        {/* SOCIETY OVERVIEW */}
        {activeTab === 'society' && (
          <div className="space-y-10 animate-fade-in">
            {societies.length === 0 ? (
              <EmptyState message="No assigned societies under your representative charge." />
            ) : (
              societies.map((soc) => {
                // Filter events belonging to this specific society
                const socEvents = events.filter(
                  (evt) => evt.societyId === soc._id || evt.societyId?._id === soc._id
                );
                
                return (
                  <div key={soc._id} className="space-y-8">
                    {/* Bento Grid Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      {/* Main Society Overview (Asymmetric - 8 cols) */}
                      <div className="col-span-12 lg:col-span-8 space-y-6">
                        {/* Identity Card */}
                        <div className="bg-white border border-outline-variant p-6 md:p-8 relative overflow-hidden shadow-sm">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/10 -mr-16 -mt-16 rounded-full"></div>
                          <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                              <div>
                                <span className="font-label-uppercase text-label-uppercase text-secondary tracking-[0.2em] mb-2 block text-xs uppercase font-bold">
                                  SOCIETY PROFILE
                                </span>
                                <h3 className="font-headline-md text-headline-md text-primary font-bold text-2xl">
                                  {soc.name}
                                </h3>
                                <p className="font-body-lg text-on-surface-variant mt-2 text-sm leading-relaxed max-w-2xl">
                                  {soc.description}
                                </p>
                              </div>
                              <div className="bg-surface-container-low p-4 text-center border border-outline-variant min-w-[120px] self-start md:self-auto">
                                <p className="font-display-lg text-3xl font-bold text-primary">
                                  {soc.memberCount || 0}
                                </p>
                                <p className="font-label-uppercase text-[9px] text-on-surface-variant uppercase font-bold tracking-wider">
                                  ACTIVE MEMBERS
                                </p>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-outline-variant">
                              <div>
                                <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">CATEGORY</p>
                                <p className="font-body-md text-sm font-semibold text-on-surface">{soc.category}</p>
                              </div>
                              <div>
                                <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">FACULTY PATRON</p>
                                <p className="font-body-md text-sm font-semibold text-on-surface">{soc.patronName || 'Faculty Sponsor'}</p>
                              </div>
                              <div>
                                <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">REPRESENTATIVE PRESIDENT</p>
                                <p className="font-body-md text-sm font-semibold text-on-surface">{user.name}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Upcoming Events Table-Style Section */}
                        <div className="bg-white border border-outline-variant shadow-sm">
                          <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
                            <h4 className="font-label-uppercase text-label-uppercase text-xs font-bold tracking-wider text-primary uppercase">UPCOMING EVENTS SCHEDULE</h4>
                            <button onClick={() => setActiveTab('events')} className="text-[10px] font-label-uppercase text-secondary font-bold hover:underline uppercase">View Ledger</button>
                          </div>
                          <div className="divide-y divide-outline-variant">
                            {socEvents.length === 0 ? (
                              <div className="px-6 py-8 text-center text-sm text-on-surface-variant">
                                No scheduled upcoming events under this society's desk.
                              </div>
                            ) : (
                              socEvents.slice(0, 3).map((evt) => {
                                const evtDate = new Date(evt.startDateTime);
                                const day = evtDate.getDate().toString().padStart(2, '0');
                                const month = evtDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                                const timeStr = evtDate.toLocaleTimeString('en-US', {
                                  hour: 'numeric', minute: '2-digit'
                                });

                                return (
                                  <div key={evt._id} className="px-6 py-5 flex items-center justify-between group hover:bg-surface-container-low/20 transition-colors">
                                    <div className="flex items-center gap-6">
                                      <div className="text-center w-12 shrink-0">
                                        <p className="font-label-uppercase text-secondary text-lg font-bold">{day}</p>
                                        <p className="font-label-uppercase text-[9px] text-on-surface-variant font-bold">{month}</p>
                                      </div>
                                      <div>
                                        <h5 className="font-headline-sm text-base text-primary font-bold">{evt.title}</h5>
                                        <p className="font-body-sm text-xs text-on-surface-variant mt-1">{evt.location} • {timeStr}</p>
                                      </div>
                                    </div>
                                    <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Sidebar Content (4 cols) */}
                      <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Recent Activity Feed */}
                        <div className="bg-white border border-outline-variant p-6 shadow-sm">
                          <h4 className="font-label-uppercase text-label-uppercase text-xs font-bold tracking-wider text-primary border-b border-outline-variant pb-4 mb-4 uppercase">RECENT ACTIVITY</h4>
                          <div className="space-y-4">
                            {socEvents.length > 0 ? socEvents.slice(0, 3).map((evt, idx) => (
                              <div key={evt._id} className="flex gap-3 items-start">
                                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${evt.status === 'approved' ? 'bg-primary' : evt.status === 'pendingApproval' ? 'bg-secondary' : 'bg-outline'}`}></div>
                                <div>
                                  <p className="font-body-sm text-xs text-on-surface"><span className="font-bold">{evt.title}:</span> {evt.status === 'approved' ? 'Approved and active' : evt.status === 'pendingApproval' ? 'Awaiting admin review' : 'Status: ' + evt.status}</p>
                                  <p className="font-label-uppercase text-[9px] text-on-surface-variant font-bold mt-1 uppercase">{new Date(evt.createdAt || evt.startDateTime).toLocaleDateString()}</p>
                                </div>
                              </div>
                            )) : (
                              <p className="text-xs text-on-surface-variant">No recent activity for this society.</p>
                            )}
                          </div>
                        </div>

                        {/* Membership Summary */}
                        <div className="bg-surface-container-low border border-outline-variant p-6 shadow-sm">
                          <h4 className="font-label-uppercase text-label-uppercase text-xs font-bold tracking-wider text-primary mb-4 uppercase">SOCIETY OVERVIEW</h4>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-[10px] font-label-uppercase font-bold mb-1 tracking-wide">
                                <span>ACTIVE EVENTS</span>
                                <span>{socEvents.filter(e => e.status === 'approved').length}</span>
                              </div>
                              <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full transition-all" style={{ width: `${Math.min(100, (socEvents.filter(e => e.status === 'approved').length / Math.max(1, socEvents.length)) * 100)}%` }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] font-label-uppercase font-bold mb-1 tracking-wide">
                                <span>PENDING REVIEW</span>
                                <span>{socEvents.filter(e => e.status === 'pendingApproval').length}</span>
                              </div>
                              <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                                <div className="bg-secondary h-full transition-all" style={{ width: `${Math.min(100, (socEvents.filter(e => e.status === 'pendingApproval').length / Math.max(1, socEvents.length)) * 100)}%` }}></div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 pt-6 border-t border-outline-variant/60 grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <p className="font-display-lg text-xl font-bold text-primary">{soc.memberCount || 0}</p>
                              <p className="font-label-uppercase text-[8px] text-on-surface-variant font-bold uppercase tracking-wider">MEMBERS</p>
                            </div>
                            <div className="text-center">
                              <p className="font-display-lg text-xl font-bold text-secondary">{socEvents.length}</p>
                              <p className="font-label-uppercase text-[8px] text-on-surface-variant font-bold uppercase tracking-wider">PROPOSALS</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Membership Table */}
                    <div className="bg-white border border-outline-variant shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                        <h4 className="font-label-uppercase text-label-uppercase text-xs font-bold tracking-wider text-primary uppercase">SOCIETY INFORMATION</h4>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">CATEGORY</p>
                            <p className="font-body-md text-sm font-semibold text-on-surface capitalize">{soc.category}</p>
                          </div>
                          <div>
                            <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">FACULTY ADVISOR</p>
                            <p className="font-body-md text-sm font-semibold text-on-surface">{soc.patronName || 'Not Assigned'}</p>
                          </div>
                          <div>
                            <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">TOTAL MEMBERS</p>
                            <p className="font-body-md text-sm font-semibold text-primary">{soc.memberCount || 0}</p>
                          </div>
                          <div>
                            <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">CHARTER STATUS</p>
                            <span className="inline-block px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[9px] font-bold uppercase rounded border border-tertiary/10">Active</span>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-outline-variant">
                          <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-1 uppercase font-bold tracking-wider">REPRESENTATIVE EXECUTIVE</p>
                          <p className="font-body-md text-sm font-semibold text-on-surface">{user.name}</p>
                          <p className="font-body-sm text-[10px] text-on-surface-variant font-mono">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* DRAFT PROPOSAL */}
        {activeTab === 'propose' && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="bg-white border border-outline-variant p-6 md:p-10 shadow-sm">
              <div className="border-l-4 border-primary pl-6 mb-8">
                <h2 className="font-headline-md text-headline-md text-primary font-bold text-2xl">
                  Draft Campus Event Proposal
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
                      <option value="orientation">Orientation</option>
                      <option value="meetup">Meetup</option>
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
                  {proposing ? 'Submitting proposal for audit...' : 'Submit Event for Admin Review'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* PASSCODE ATTENDANCE CHECK-IN */}
        {activeTab === 'attendance' && (
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
                        {attendanceList.length} Checked In / {approvedEvents.find(e => e._id === verifyEventId)?.capacity || 0} Expected
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
                        Verification Token / Passcode (6-digits)
                      </label>
                      <input 
                        id="verifyToken" 
                        type="text" 
                        maxLength="6"
                        placeholder="e.g. AA04XB" 
                        className="w-full bg-surface border border-outline-variant rounded px-4 py-3 text-center text-xl font-mono font-bold tracking-widest text-primary uppercase focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:normal-case placeholder:font-sans placeholder:tracking-normal placeholder:text-sm"
                        value={verifyToken} 
                        onChange={(e) => setVerifyToken(e.target.value.toUpperCase())} 
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
                            const sel = approvedEvents.find(e => e._id === verifyEventId);
                            return sel && typeof sel.societyId === 'object' ? sel.societyId.name : 'Dean\'s Council';
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-outline-variant/40 pb-2">
                        <span className="text-on-surface-variant">Seat Capacity</span>
                        <span className="font-bold">{approvedEvents.find(e => e._id === verifyEventId)?.capacity || 0}</span>
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
        )}

        {/* EXECUTIVE PROFILE CREDENTIALS */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white border border-outline-variant p-8 md:p-10 shadow-sm">
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold border-b border-outline-variant pb-4 mb-6">
                Executive Profile Credentials
              </h2>
              
              <div className="space-y-4 text-sm text-on-surface-variant">
                <div className="grid grid-cols-3 py-3 border-b border-outline-variant/40">
                  <span className="font-bold">Executive Bearer</span>
                  <span className="col-span-2 text-on-surface font-semibold">{user.name}</span>
                </div>
                <div className="grid grid-cols-3 py-3 border-b border-outline-variant/40">
                  <span className="font-bold">Institutional Email</span>
                  <span className="col-span-2 text-on-surface font-mono">{user.email}</span>
                </div>
                <div className="grid grid-cols-3 py-3 border-b border-outline-variant/40">
                  <span className="font-bold">Registration ID</span>
                  <span className="col-span-2 text-on-surface font-mono">{user.registrationNumber}</span>
                </div>
                <div className="grid grid-cols-3 py-3 border-b border-outline-variant/40">
                  <span className="font-bold">Department Office</span>
                  <span className="col-span-2 text-on-surface font-semibold">{user.department}</span>
                </div>
                <div className="grid grid-cols-3 py-3">
                  <span className="font-bold">Desk Clearance</span>
                  <span className="col-span-2">
                    <span className="bg-primary/10 text-primary font-bold text-[10px] px-3 py-1 border border-primary/20 rounded uppercase">
                      Executive Authority
                    </span>
                  </span>
                </div>
              </div>

              <div className="p-4 bg-surface-container-low border border-outline-variant/60 rounded text-xs leading-relaxed text-on-surface-variant mt-8">
                Your executive privileges have been formally cleared and assigned by the Namal University IT Council. Contact Admin if you require society reassignments.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Roster Attendance Sheet Modal */}
      <Modal 
        isOpen={isAttendanceOpen} 
        onClose={() => setIsAttendanceOpen(false)} 
        title={`Attendance Sheet Roster: ${activeEventTitle}`}
      >
        {attendanceLoading ? (
          <LoadingState count={3} />
        ) : attendanceList.length === 0 ? (
          <EmptyState message="No students have registered entry checkpoints for this event yet." />
        ) : (
          <div className="bg-white border border-outline-variant overflow-x-auto max-h-[400px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-label-uppercase text-label-uppercase text-[10px] font-bold border-b border-outline-variant">
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">ID Number</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3 text-right">Time In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 text-xs">
                {attendanceList.map((record) => {
                  const student = record.userId || { name: 'Student', registrationNumber: 'N/A', department: 'CS' };
                  const timeStr = new Date(record.checkInTime).toLocaleTimeString('en-US', {
                    hour: 'numeric', minute: '2-digit'
                  });

                  return (
                    <tr key={record._id} className="hover:bg-surface-container-low/20">
                      <td className="px-4 py-3 font-bold text-primary">{student.name}</td>
                      <td className="px-4 py-3 font-mono text-[11px]">{student.registrationNumber}</td>
                      <td className="px-4 py-3">{student.department}</td>
                      <td className="px-4 py-3">
                        <span className="bg-tertiary-container text-on-tertiary-container font-bold text-[9px] px-2 py-0.5 rounded border border-tertiary/20 uppercase">
                          {record.checkInMethod}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-on-surface-variant">{timeStr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
}
