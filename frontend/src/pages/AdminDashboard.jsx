import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api/api';
import LoadingState from '../components/LoadingState';
import EventApprovalsTab from '../components/dashboard/EventApprovalsTab';
import MembershipRequestsTab from '../components/dashboard/MembershipRequestsTab';
import SocietiesSetupTab from '../components/dashboard/SocietiesSetupTab';
import NewsManagementTab from '../components/dashboard/NewsManagementTab';
import UsersRolesTab from '../components/dashboard/UsersRolesTab';
import AttendanceOverviewTab from '../components/dashboard/AttendanceOverviewTab';
import SettingsTab from '../components/dashboard/SettingsTab';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('events');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [pendingEvents, setPendingEvents] = useState([]);
  const [pendingMemberships, setPendingMemberships] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [activeSocieties, setActiveSocieties] = useState([]);
  const [activeNews, setActiveNews] = useState([]);

  // Forms states
  const [socFormData, setSocFormData] = useState({ name: '', description: '', patronName: '', category: 'social' });
  const [newsFormData, setNewsFormData] = useState({ title: '', summary: '', content: '', category: 'newsletter' });
  const [socSuccess, setSocSuccess] = useState('');
  const [newsSuccess, setNewsSuccess] = useState('');
  const [socError, setSocError] = useState('');
  const [newsError, setNewsError] = useState('');
  const [socSubmitting, setSocSubmitting] = useState(false);
  const [newsSubmitting, setNewsSubmitting] = useState(false);

  // Users list state for roles management
  const [usersList, setUsersList] = useState([]);
  const [roleSuccess, setRoleSuccess] = useState('');
  const [roleLoading, setRoleLoading] = useState(false);

  // Premium Features States
  const [selectedMemberships, setSelectedMemberships] = useState([]);
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [selectedEventForReview, setSelectedEventForReview] = useState(null);
  const [rejectComment, setRejectComment] = useState('');
  
  // Search and Filter simulations
  const [newsSearchQuery, setNewsSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [attendanceDeptFilter, setAttendanceDeptFilter] = useState('All Societies');
  const [attendanceTypeFilter, setAttendanceTypeFilter] = useState('All Types');

  // Sync active tab with URL queries
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['events', 'memberships', 'societies', 'news', 'roles', 'attendance', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    } else if (tabParam === 'dashboard' || !tabParam) {
      setActiveTab('events');
    }
  }, [location]);

  const loadAdminChecklists = async () => {
    try {
      setLoading(true);
      setError('');
      const [eventsList, membershipsList, allEvents, allSocieties, newsList, usersData] = await Promise.all([
        api.getEvents('pendingApproval'),
        api.getAllMemberships(),
        api.getEvents('approved'),
        api.getSocieties(),
        api.getNews(),
        api.getAllUsers().catch(() => [])
      ]);
      setPendingEvents(eventsList);
      setPendingMemberships(membershipsList);
      setApprovedEvents(allEvents);
      setActiveSocieties(allSocieties);
      setActiveNews(newsList || []);
      setUsersList(usersData || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch administrative lists. Local database offline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminChecklists();
  }, []);

  const handleModerateEvent = async (eventId, status, rejectionReason = '') => {
    try {
      setError('');
      await api.updateEventStatus(eventId, status, rejectionReason);
      setPendingEvents((prev) => prev.filter((event) => event._id !== eventId));
      loadAdminChecklists();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to moderate proposed event status.');
    }
  };

  const handleModerateMembership = async (societyId, membershipId, status) => {
    try {
      setError('');
      await api.updateMembershipStatus(societyId, membershipId, status);
      setPendingMemberships((prev) => prev.filter((membership) => membership._id !== membershipId));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to moderate society membership status.');
    }
  };

  // Bulk Operations
  const handleBulkModerateMemberships = async (status) => {
    if (selectedMemberships.length === 0) return;
    try {
      setError('');
      setLoading(true);
      
      await Promise.all(
        selectedMemberships.map(async (mId) => {
          const m = pendingMemberships.find((item) => item._id === mId);
          if (m && m.societyId) {
            const sId = m.societyId._id || m.societyId;
            await api.updateMembershipStatus(sId, m._id, status);
          }
        })
      );
      
      setPendingMemberships((prev) => prev.filter((m) => !selectedMemberships.includes(m._id)));
      setSelectedMemberships([]);
      loadAdminChecklists();
    } catch (err) {
      console.error(err);
      setError(err.message || `Failed to bulk ${status} memberships.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllMemberships = (e) => {
    if (e.target.checked) {
      const filtered = pendingMemberships
        .filter(m => deptFilter === 'All Departments' || (m.userId?.department === deptFilter))
        .map(m => m._id);
      setSelectedMemberships(filtered);
    } else {
      setSelectedMemberships([]);
    }
  };

  const handleSelectMembership = (mId, checked) => {
    if (checked) {
      setSelectedMemberships(prev => [...prev, mId]);
    } else {
      setSelectedMemberships(prev => prev.filter(id => id !== mId));
    }
  };

  const handleSocSubmit = async (e) => {
    e.preventDefault();
    setSocSuccess('');
    setSocError('');

    if (!socFormData.name.trim() || !socFormData.description.trim() || !socFormData.patronName.trim()) {
      setSocError('Please fill out all society parameters.');
      return;
    }

    try {
      setSocSubmitting(true);
      const response = await api.createSociety(socFormData);
      setSocSuccess(response.message || 'Society initialized and published successfully!');
      setSocFormData({ name: '', description: '', patronName: '', category: 'social' });
      loadAdminChecklists();
    } catch (err) {
      console.error(err);
      setSocError(err.message || 'Failed to initialize society.');
    } finally {
      setSocSubmitting(false);
    }
  };

  const handleNewsSubmit = async (e) => {
    e.preventDefault();
    setNewsSuccess('');
    setNewsError('');

    if (!newsFormData.title.trim() || !newsFormData.summary.trim() || !newsFormData.content.trim()) {
      setNewsError('Please fill out all bulletin parameters.');
      return;
    }

    try {
      setNewsSubmitting(true);
      const response = await api.createNews(newsFormData);
      setNewsSuccess(response.message || 'News article published successfully in co-curricular bulletin!');
      setNewsFormData({ title: '', summary: '', content: '', category: 'newsletter' });
      loadAdminChecklists();
    } catch (err) {
      console.error(err);
      setNewsError(err.message || 'Failed to publish news bulletin.');
    } finally {
      setNewsSubmitting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setRoleSuccess('');
    setRoleLoading(true);
    try {
      await api.updateUserRole(userId, newRole);
      setUsersList(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      const uName = usersList.find(u => u._id === userId)?.name;
      setRoleSuccess(`Role updated successfully: Authorized ${uName} as society ${newRole.toUpperCase()} Bearer.`);
      setTimeout(() => setRoleSuccess(''), 2500);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update user role.');
    } finally {
      setRoleLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse p-6">
        <div className="h-44 bg-slate-200 w-full rounded"></div>
        <div className="h-10 bg-slate-200 w-1/3 rounded"></div>
        <div className="h-60 bg-slate-200 w-full rounded"></div>
      </div>
    );
  }

  // Filter lists based on query simulations
  const filteredMemberships = pendingMemberships.filter(m => {
    const student = m.userId || {};
    if (deptFilter === 'All Departments') return true;
    return student.department === deptFilter;
  });

  const filteredNews = activeNews.filter(n => {
    if (!newsSearchQuery.trim()) return true;
    const query = newsSearchQuery.toLowerCase();
    return n.title.toLowerCase().includes(query) || 
           n.summary.toLowerCase().includes(query) || 
           n.content.toLowerCase().includes(query) || 
           n.category.toLowerCase().includes(query);
  });

  const filteredUsers = usersList.filter(u => {
    if (!userSearchQuery.trim()) return true;
    const query = userSearchQuery.toLowerCase();
    return u.name.toLowerCase().includes(query) || 
           u.email.toLowerCase().includes(query) || 
           u.registrationNumber.toLowerCase().includes(query) || 
           u.department.toLowerCase().includes(query);
  });

  const filteredAttendanceEvents = approvedEvents.filter(evt => {
    const socMatch = attendanceDeptFilter === 'All Societies' || evt.societyId?.name === attendanceDeptFilter;
    const typeMatch = attendanceTypeFilter === 'All Types' || evt.type?.toLowerCase() === attendanceTypeFilter.toLowerCase();
    return socMatch && typeMatch;
  });

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* Dynamic Styled Config block */}
      <style>{`
        .editorial-shadow {
          box-shadow: 4px 4px 0px 0px rgba(219, 231, 223, 0.5);
        }
        .paper-card {
          background: #ffffff;
          border: 1px solid #dbe7df;
          transition: all 0.2s ease;
        }
        .paper-card:hover {
          border-color: #006b35;
        }
        .academic-header {
          background-color: #005026;
          background-image: radial-gradient(#006b35 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .policy-alert {
          border-left-width: 6px;
        }
      `}</style>

      {/* Administrator Header Card */}
      <header className="academic-header text-white p-8 md:p-10 rounded border border-outline-variant relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
          <div>
            <span className="font-label-uppercase text-secondary-container tracking-[0.2em] mb-2 block text-xs font-bold uppercase">
              NAMAL IT COUNCIL DESK • EXECUTIVE ACCESS
            </span>
            <h1 className="font-display-lg text-4xl md:text-5xl leading-tight mb-3 font-serif">
              {user.name}
            </h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-emerald-100 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <strong>Privileges:</strong> Full Portal Administration
              </span>
              <span className="hidden md:inline text-white/40">|</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">dns</span>
                <strong>Workspace:</strong> Hard-coded Protected Account
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded text-center min-w-[130px] transition-all hover:scale-[1.03]">
              <p className="font-label-uppercase text-[10px] text-secondary-container font-bold uppercase tracking-wider mb-1">Pending Events</p>
              <p className="text-3xl font-display-lg text-white font-bold font-serif">{pendingEvents.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded text-center min-w-[130px] transition-all hover:scale-[1.03]">
              <p className="font-label-uppercase text-[10px] text-secondary-container font-bold uppercase tracking-wider mb-1">Pending Memb.</p>
              <p className="text-3xl font-display-lg text-white font-bold font-serif">{pendingMemberships.length}</p>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 text-sm rounded flex items-center gap-3" role="alert">
          <span className="material-symbols-outlined text-red-500">error</span>
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <section className="border-b border-slate-200">
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <button 
            className={`pb-4 font-label-uppercase font-bold text-xs tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'events' 
                ? 'border-emerald-700 text-emerald-800' 
                : 'border-transparent text-slate-500 hover:text-emerald-700'
            }`}
            onClick={() => setActiveTab('events')}
          >
            <span className="material-symbols-outlined text-sm">schedule</span>
            Event Approvals ({pendingEvents.length})
          </button>
          <button 
            className={`pb-4 font-label-uppercase font-bold text-xs tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'memberships' 
                ? 'border-emerald-700 text-emerald-800' 
                : 'border-transparent text-slate-500 hover:text-emerald-700'
            }`}
            onClick={() => setActiveTab('memberships')}
          >
            <span className="material-symbols-outlined text-sm">group</span>
            Membership Requests ({pendingMemberships.length})
          </button>
          <button 
            className={`pb-4 font-label-uppercase font-bold text-xs tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'societies' 
                ? 'border-emerald-700 text-emerald-800' 
                : 'border-transparent text-slate-500 hover:text-emerald-700'
            }`}
            onClick={() => setActiveTab('societies')}
          >
            <span className="material-symbols-outlined text-sm">corporate_fare</span>
            Societies Setup ({activeSocieties.length})
          </button>
          <button 
            className={`pb-4 font-label-uppercase font-bold text-xs tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'news' 
                ? 'border-emerald-700 text-emerald-800' 
                : 'border-transparent text-slate-500 hover:text-emerald-700'
            }`}
            onClick={() => setActiveTab('news')}
          >
            <span className="material-symbols-outlined text-sm">campaign</span>
            News Management ({activeNews.length})
          </button>
          <button 
            className={`pb-4 font-label-uppercase font-bold text-xs tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'roles' 
                ? 'border-emerald-700 text-emerald-800' 
                : 'border-transparent text-slate-500 hover:text-emerald-700'
            }`}
            onClick={() => setActiveTab('roles')}
          >
            <span className="material-symbols-outlined text-sm">security_update_good</span>
            Users & Roles
          </button>
          <button 
            className={`pb-4 font-label-uppercase font-bold text-xs tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'attendance' 
                ? 'border-emerald-700 text-emerald-800' 
                : 'border-transparent text-slate-500 hover:text-emerald-700'
            }`}
            onClick={() => setActiveTab('attendance')}
          >
            <span className="material-symbols-outlined text-sm">insights</span>
            Attendance Overview
          </button>
          <button 
            className={`pb-4 font-label-uppercase font-bold text-xs tracking-wider transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'settings' 
                ? 'border-emerald-700 text-emerald-800' 
                : 'border-transparent text-slate-500 hover:text-emerald-700'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="material-symbols-outlined text-sm">settings</span>
            Settings
          </button>
        </div>
      </section>

      {/* Content Panels */}
      <div className="min-h-[400px]">
        {activeTab === 'events' && (
          <EventApprovalsTab 
            pendingEvents={pendingEvents} 
            setSelectedEventForReview={setSelectedEventForReview} 
          />
        )}

        {activeTab === 'memberships' && (
          <MembershipRequestsTab 
            pendingMemberships={pendingMemberships} 
            filteredMemberships={filteredMemberships} 
            deptFilter={deptFilter} 
            setDeptFilter={setDeptFilter} 
            selectedMemberships={selectedMemberships} 
            handleBulkModerateMemberships={handleBulkModerateMemberships} 
            handleSelectAllMemberships={handleSelectAllMemberships} 
            handleSelectMembership={handleSelectMembership} 
            handleModerateMembership={handleModerateMembership} 
          />
        )}

        {activeTab === 'societies' && (
          <SocietiesSetupTab 
            activeSocieties={activeSocieties} 
            socFormData={socFormData} 
            setSocFormData={setSocFormData} 
            socSuccess={socSuccess} 
            socError={socError} 
            socSubmitting={socSubmitting} 
            handleSocSubmit={handleSocSubmit} 
          />
        )}

        {activeTab === 'news' && (
          <NewsManagementTab 
            activeNews={activeNews} 
            newsSearchQuery={newsSearchQuery} 
            setNewsSearchQuery={setNewsSearchQuery} 
            filteredNews={filteredNews} 
            newsFormData={newsFormData} 
            setNewsFormData={setNewsFormData} 
            newsSuccess={newsSuccess} 
            newsError={newsError} 
            newsSubmitting={newsSubmitting} 
            handleNewsSubmit={handleNewsSubmit} 
          />
        )}

        {activeTab === 'roles' && (
          <UsersRolesTab 
            usersList={usersList} 
            userSearchQuery={userSearchQuery} 
            setUserSearchQuery={setUserSearchQuery} 
            filteredUsers={filteredUsers} 
            roleSuccess={roleSuccess} 
            roleLoading={roleLoading} 
            handleRoleChange={handleRoleChange} 
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceOverviewTab 
            approvedEvents={approvedEvents} 
            attendanceDeptFilter={attendanceDeptFilter} 
            setAttendanceDeptFilter={setAttendanceDeptFilter} 
            attendanceTypeFilter={attendanceTypeFilter} 
            setAttendanceTypeFilter={setAttendanceTypeFilter} 
            filteredAttendanceEvents={filteredAttendanceEvents} 
            setRoleSuccess={setRoleSuccess} 
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab />
        )}
      </div>

      {/* EVENT PROPOSAL AUDIT MODAL */}
      {selectedEventForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 max-w-2xl w-full rounded-lg overflow-hidden shadow-2xl animate-fade-in">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-headline-sm text-lg text-emerald-950 font-serif font-bold">Event Proposal Audit</h3>
              <button 
                onClick={() => { setSelectedEventForReview(null); setRejectComment(''); }}
                className="text-slate-400 hover:text-slate-800 transition-colors font-bold text-lg"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-100">
                    {selectedEventForReview.type?.toUpperCase()}
                  </span>
                  <h4 className="font-headline-md text-xl font-serif text-emerald-950 mt-2 font-bold">{selectedEventForReview.title}</h4>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Proposed Capacity</span>
                  <span className="font-headline-sm text-base text-emerald-800 font-bold font-serif">{selectedEventForReview.capacity} Seats</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Hosting Society</span>
                  <span className="text-xs font-bold text-slate-800 font-serif">{selectedEventForReview.societyId?.name || 'Representative Society'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Faculty Advisor Patron</span>
                  <span className="text-xs font-bold text-slate-800 font-serif">{selectedEventForReview.societyId?.patronName || 'Faculty Sponsor'}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Proposed Date & Time</span>
                  <span className="text-xs font-bold text-slate-800 font-serif">
                    {selectedEventForReview.startDateTime ? new Date(selectedEventForReview.startDateTime).toLocaleString() : 'N/A'}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Proposed Venue Location</span>
                  <span className="text-xs font-bold text-slate-800 font-serif">{selectedEventForReview.location}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Charter Objectives & Description</span>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded border border-slate-100 whitespace-pre-line">
                  {selectedEventForReview.description}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider" htmlFor="reject-comment">
                  INTERNAL COMMENTS (Required for rejection reasons)
                </label>
                <textarea
                  id="reject-comment"
                  rows="3"
                  placeholder="Provide constructive co-curricular alignment feedback..."
                  className="w-full bg-slate-50 px-4 py-3 border border-slate-200 focus:border-emerald-700 focus:bg-white focus:ring-0 outline-none transition-all text-xs"
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between gap-4">
              <button
                onClick={() => { setSelectedEventForReview(null); setRejectComment(''); }}
                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider transition-colors rounded"
              >
                Cancel Audit
              </button>
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    if (!rejectComment.trim()) {
                      setError('Please provide internal comments before rejecting the proposal.');
                      return;
                    }
                    await handleModerateEvent(selectedEventForReview._id, 'rejected', rejectComment.trim());
                    setSelectedEventForReview(null);
                    setRejectComment('');
                  }}
                  className="px-5 py-2.5 bg-red-700 text-white font-bold uppercase tracking-wider hover:bg-red-800 transition-colors text-xs rounded shadow-sm"
                >
                  Reject Proposal
                </button>
                <button
                  onClick={async () => {
                    await handleModerateEvent(selectedEventForReview._id, 'approved');
                    setSelectedEventForReview(null);
                    setRejectComment('');
                  }}
                  className="px-5 py-2.5 bg-emerald-700 text-white font-bold uppercase tracking-wider hover:bg-emerald-800 transition-colors text-xs rounded shadow-sm"
                >
                  Approve Proposal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
