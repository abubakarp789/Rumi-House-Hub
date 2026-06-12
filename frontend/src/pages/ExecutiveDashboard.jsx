import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api/api';
import Modal from '../components/Modal';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import ProposedEventsTab from '../components/dashboard/ProposedEventsTab';
import SocietyRosterTab from '../components/dashboard/SocietyRosterTab';
import ProposeEventTab from '../components/dashboard/ProposeEventTab';
import AttendanceCheckInTab from '../components/dashboard/AttendanceCheckInTab';
import CredentialsProfileTab from '../components/dashboard/CredentialsProfileTab';

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
        
        const userManagedSocieties = socList.filter(soc => 
          (soc.executiveBody || []).some(member => {
            const memberId = member.userId && typeof member.userId === 'object' 
              ? member.userId._id 
              : member.userId;
            return String(memberId) === String(user?._id);
          })
        );
        setSocieties(userManagedSocieties);
        
        // Filter events created by this executive or related to the societies managed
        const managedSocietyIds = userManagedSocieties.map(s => String(s._id));
        const ownedEvents = allEvts.filter(
          (event) => 
            event.createdBy === user?._id || 
            event.createdBy?._id === user?._id ||
            managedSocietyIds.includes(String(event.societyId?._id || event.societyId))
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
    if (!verifyToken.trim()) {
      setVerifyError('Paste the scanned QR payload or the full event pass token.');
      return;
    }

    try {
      setVerifying(true);
      const response = await api.recordOrganizerCheckIn(verifyEventId, verifyToken.trim());
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
        {activeTab === 'events' && (
          <ProposedEventsTab 
            events={events} 
            setActiveTab={setActiveTab} 
            handleLoadAttendance={handleLoadAttendance} 
          />
        )}

        {activeTab === 'society' && (
          <SocietyRosterTab 
            societies={societies} 
            events={events} 
            setActiveTab={setActiveTab} 
            user={user} 
          />
        )}

        {activeTab === 'propose' && (
          <ProposeEventTab 
            societies={societies} 
            formData={formData} 
            proposalSuccess={proposalSuccess} 
            proposalErrors={proposalErrors} 
            proposing={proposing} 
            handleInputChange={handleInputChange} 
            handleProposalSubmit={handleProposalSubmit} 
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceCheckInTab 
            approvedEvents={approvedEvents} 
            verifyEventId={verifyEventId} 
            setVerifyEventId={setVerifyEventId} 
            handleRefreshAttendance={handleRefreshAttendance} 
            attendanceLoading={attendanceLoading} 
            attendanceList={attendanceList} 
            verifying={verifying} 
            verifySuccess={verifySuccess} 
            verifyError={verifyError} 
            verifyToken={verifyToken} 
            setVerifyToken={setVerifyToken} 
            handleManualCheckInVerify={handleManualCheckInVerify} 
          />
        )}

        {activeTab === 'profile' && (
          <CredentialsProfileTab 
            user={user} 
          />
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
