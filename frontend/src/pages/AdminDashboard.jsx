import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api/api';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

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

  const handleModerateEvent = async (eventId, status) => {
    try {
      setError('');
      await api.updateEventStatus(eventId, status);
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
        
        {/* TAB 1: EVENT APPROVALS TAB */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="font-label-uppercase text-secondary font-bold text-xs tracking-widest block uppercase mb-1">
                  Co-Curricular Registry
                </span>
                <h2 className="font-headline-md text-3xl text-emerald-950 font-serif font-semibold">Event Moderation Queue</h2>
                <p className="text-slate-600 text-sm mt-1">Review student-led co-curricular event proposals. Audit academic alignment, capacities, and logistical parameters.</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase border border-emerald-200">
                  {pendingEvents.length} Pending Review
                </span>
              </div>
            </div>

            {/* Academic Rigor Policy Alert Box */}
            <div className="policy-alert p-6 bg-emerald-50 border-l-4 border-emerald-700 text-emerald-950 flex items-start gap-4">
              <span className="material-symbols-outlined text-emerald-700 font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <div>
                <h4 className="font-bold text-sm mb-1 uppercase tracking-wider font-serif">Academic Rigor Check</h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  All co-curricular event proposals must align with the institution's commitment to scholarly enrichment and intellectual character. Verify that all high-capacity symposiums have a verified faculty sponsor/patron attached before administrative scheduling approval.
                </p>
              </div>
            </div>

            {pendingEvents.length === 0 ? (
              <EmptyState message="No co-curricular event proposals are currently pending review." />
            ) : (
              <div className="paper-card overflow-hidden rounded-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-label-uppercase text-[11px] font-bold">
                        <th className="px-6 py-4">Event Title & Type</th>
                        <th className="px-6 py-4">Hosting Society</th>
                        <th className="px-6 py-4">Faculty Advisor</th>
                        <th className="px-6 py-4">Proposed By</th>
                        <th className="px-6 py-4">Capacity</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {pendingEvents.map((evt) => (
                        <tr key={evt._id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-bold text-emerald-900 text-base font-serif">{evt.title}</div>
                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">location_on</span>
                              {evt.location} • {evt.startDateTime ? new Date(evt.startDateTime).toLocaleDateString() : 'Upcoming'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 bg-slate-100 text-slate-700 text-[10px] font-bold rounded border border-slate-200 uppercase">
                              {evt.societyId?.name || 'Representative Society'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-700">
                            {evt.societyId?.patronName || 'Faculty Sponsor'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-xs font-bold text-slate-800">{evt.createdBy?.name || 'Academic Lead'}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{evt.createdBy?.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-slate-800">
                            {evt.capacity} Seats
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                              <span className="text-xs font-semibold text-amber-700">Pending Review</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <button 
                              onClick={() => setSelectedEventForReview(evt)}
                              className="px-4 py-2 border border-emerald-700 text-emerald-800 hover:bg-emerald-50 font-bold text-xs uppercase tracking-wider transition-colors font-label-uppercase"
                            >
                              Review Proposal
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MEMBERSHIP REQUESTS TAB */}
        {activeTab === 'memberships' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="font-label-uppercase text-secondary font-bold text-xs tracking-widest block uppercase mb-1">
                  Student Affiliations
                </span>
                <h2 className="font-headline-md text-3xl text-emerald-950 font-serif font-semibold">Membership Applications Queue</h2>
                <p className="text-slate-600 text-sm mt-1">Audit and moderate registrations submitted by students to join campus organizations.</p>
              </div>
              
              <div className="flex flex-wrap gap-3 items-center">
                {/* Department Filter */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Department Filter</label>
                  <select 
                    className="border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-emerald-700 w-44"
                    value={deptFilter} 
                    onChange={(e) => setDeptFilter(e.target.value)}
                  >
                    <option>All Departments</option>
                    <option>Computer Science</option>
                    <option>Electrical Engineering</option>
                    <option>Business Administration</option>
                    <option>Mathematics</option>
                    <option>Humanities</option>
                    <option>Applied Science</option>
                    <option>Fine Arts</option>
                    <option>Management</option>
                  </select>
                </div>

                {/* Bulk Actions */}
                {selectedMemberships.length > 0 && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleBulkModerateMemberships('approved')}
                      className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-800 transition-colors flex items-center gap-1.5 shadow"
                    >
                      <span className="material-symbols-outlined text-xs">done_all</span>
                      Bulk Approve ({selectedMemberships.length})
                    </button>
                    <button 
                      onClick={() => handleBulkModerateMemberships('rejected')}
                      className="px-4 py-2 bg-red-700 text-white font-bold text-xs uppercase tracking-wider hover:bg-red-800 transition-colors flex items-center gap-1.5 shadow"
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                      Bulk Reject
                    </button>
                  </div>
                )}
              </div>
            </div>

            {filteredMemberships.length === 0 ? (
              <EmptyState message={`No pending memberships match the selected department "${deptFilter}".`} />
            ) : (
              <div className="paper-card overflow-hidden rounded-lg">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Registry Queue</span>
                  <span className="text-emerald-800 font-semibold">{filteredMemberships.length} Student Requests Pending</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-label-uppercase text-[11px] font-bold">
                        <th className="px-6 py-4 w-12 text-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-emerald-700 focus:ring-0 cursor-pointer"
                            onChange={handleSelectAllMemberships}
                            checked={selectedMemberships.length === filteredMemberships.length && filteredMemberships.length > 0}
                          />
                        </th>
                        <th className="px-6 py-4">Student Name</th>
                        <th className="px-6 py-4">Reg#</th>
                        <th className="px-6 py-4">Dept</th>
                        <th className="px-6 py-4">Target Society</th>
                        <th className="px-6 py-4">Request Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredMemberships.map((m) => {
                        const student = m.userId || { name: 'Student Applicant', registrationNumber: 'N/A', email: 'N/A', department: 'N/A' };
                        const societyName = m.societyId?.name || 'Target Society';
                        const isSelected = selectedMemberships.includes(m._id);

                        return (
                          <tr key={m._id} className={`hover:bg-slate-50/50 transition-colors ${isSelected ? 'bg-emerald-50/20' : ''}`}>
                            <td className="px-6 py-4 text-center">
                              <input 
                                type="checkbox" 
                                className="rounded border-slate-300 text-emerald-700 focus:ring-0 cursor-pointer"
                                checked={isSelected}
                                onChange={(e) => handleSelectMembership(m._id, e.target.checked)}
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-bold text-slate-900 font-serif text-sm">{student.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{student.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-700">
                              {student.registrationNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-700">
                              {student.department}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-emerald-800 uppercase">
                              {societyName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                              {new Date(m.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded border border-amber-200">
                                Pending
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                              <div className="inline-flex gap-2">
                                <button 
                                  onClick={() => handleModerateMembership(m.societyId._id, m._id, 'approved')}
                                  className="p-1 text-emerald-700 hover:text-emerald-950 hover:bg-emerald-50 transition-all rounded"
                                  title="Approve Member"
                                >
                                  <span className="material-symbols-outlined text-lg">check_circle</span>
                                </button>
                                <button 
                                  onClick={() => handleModerateMembership(m.societyId._id, m._id, 'rejected')}
                                  className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 transition-all rounded"
                                  title="Reject Request"
                                >
                                  <span className="material-symbols-outlined text-lg">cancel</span>
                                </button>
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

        {/* TAB 3: SOCIETIES SETUP TAB */}
        {activeTab === 'societies' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
        )}

        {/* TAB 4: NEWS MANAGEMENT TAB */}
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                    const isNewsletter = n.category === 'newsletter';
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
                            <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider whitespace-nowrap border ${
                              isAlert 
                                ? 'bg-red-50 text-red-700 border-red-100' 
                                : isVisit 
                                ? 'bg-amber-50 text-amber-800 border-amber-100' 
                                : 'bg-emerald-50 text-emerald-800 border-emerald-100'
                            }`}>
                              {n.category}
                            </span>
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
                  Publish Bulletin Announcement
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
                    {newsSubmitting ? 'Publishing announcement...' : 'Publish Article'}
                  </button>
                </form>
              </article>
            </div>
          </div>
        )}

        {/* TAB 5: USERS & ROLES TAB */}
        {activeTab === 'roles' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="font-label-uppercase text-secondary font-bold text-xs tracking-widest block uppercase mb-1">
                  Access Management
                </span>
                <h2 className="font-headline-md text-3xl text-emerald-950 font-serif font-semibold">Users & Roles</h2>
                <p className="text-slate-600 text-sm mt-1">Manage institutional access, administrative privileges, and academic roles for the directory.</p>
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 pointer-events-none">
                  <span className="material-symbols-outlined text-sm">search</span>
                </span>
                <input 
                  type="text" 
                  placeholder="Search active registry..."
                  className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs focus:border-emerald-700 outline-none w-64"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Bento-style stats overview cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm border-l-4 border-l-emerald-700 relative overflow-hidden">
                <p className="font-label-uppercase text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Users</p>
                <h3 className="font-headline-sm text-2xl font-serif font-bold text-emerald-950">{usersList.length}</h3>
                <div className="flex items-center gap-1 text-emerald-700 text-[10px] font-bold mt-2">
                  <span className="material-symbols-outlined text-xs">group</span>
                  <span>Registered accounts</span>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm border-l-4 border-l-amber-500">
                <p className="font-label-uppercase text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Administrators</p>
                <h3 className="font-headline-sm text-2xl font-serif font-bold text-emerald-950">{usersList.filter(u => u.role === 'admin').length}</h3>
                <p className="text-slate-500 text-[10px] mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-slate-400">shield</span>
                  Protected Status
                </p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm border-l-4 border-l-amber-300">
                <p className="font-label-uppercase text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Executives</p>
                <h3 className="font-headline-sm text-2xl font-serif font-bold text-amber-700">{usersList.filter(u => u.role === 'executive').length}</h3>
                <p className="text-slate-500 text-[10px] mt-2">Society leaders</p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm border-l-4 border-l-slate-400">
                <p className="font-label-uppercase text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Students</p>
                <h3 className="font-headline-sm text-2xl font-serif font-bold text-emerald-900">{usersList.filter(u => u.role === 'student').length}</h3>
                <p className="text-slate-500 text-[10px] mt-2 font-mono">Active learners</p>
              </div>
            </div>

            {roleSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 text-xs rounded" role="alert">
                {roleSuccess}
              </div>
            )}

            {/* Active registry table */}
            <div className="paper-card overflow-hidden rounded-lg bg-white">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wider">Active Registry</span>
                <span className="text-slate-400 font-mono">Showing {filteredUsers.length} academic entries</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-label-uppercase text-[11px] font-bold">
                      <th className="px-6 py-4">User Name</th>
                      <th className="px-6 py-4">Email Address</th>
                      <th className="px-6 py-4">Reg#</th>
                      <th className="px-6 py-4">Dept</th>
                      <th className="px-6 py-4">Batch</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredUsers.map((u) => {
                      const isSuper = u.role === 'admin';
                      const isExec = u.role === 'executive';

                      return (
                        <tr key={u._id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                                {u.name.split(' ').map(n=>n[0]).join('')}
                              </div>
                              <span className="font-bold text-slate-900 font-serif">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                            {u.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-700 font-mono">
                            {u.registrationNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-slate-700">
                            {u.department}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                            {u.batch}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              isSuper 
                                ? 'bg-emerald-700 text-white border-emerald-800' 
                                : isExec 
                                ? 'bg-amber-100 text-amber-800 border-amber-200' 
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                              <span className="text-xs text-slate-700 font-medium">Active</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            {isSuper ? (
                              <span className="text-xs text-slate-400 italic">Root Protected</span>
                            ) : (
                              <select 
                                className="bg-slate-50 px-3 py-1.5 border border-slate-200 focus:border-emerald-700 focus:bg-white focus:ring-0 outline-none text-xs w-[130px] rounded"
                                value={u.role} 
                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                              >
                                <option value="student">Student</option>
                                <option value="executive">Executive</option>
                              </select>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ATTENDANCE OVERVIEW TAB */}
        {activeTab === 'attendance' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="font-label-uppercase text-secondary font-bold text-xs tracking-widest block uppercase mb-1">
                  Campus Engagement Metrics
                </span>
                <h2 className="font-display-lg text-3xl text-emerald-950 font-serif font-semibold">Attendance Overview</h2>
                <p className="text-slate-600 text-sm mt-1">Review occupancy checked-in logs and capacity metrics for all active campus events.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => { setRoleSuccess('CSV export feature coming soon.'); setTimeout(() => setRoleSuccess(''), 2000); }}
                  className="px-4 py-2 border border-slate-200 font-bold text-xs hover:bg-slate-50 transition-colors uppercase tracking-wider font-label-uppercase cursor-pointer"
                >
                  Export CSV
                </button>
                <button 
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition-colors uppercase tracking-wider font-label-uppercase cursor-pointer"
                >
                  Print Summary
                </button>
              </div>
            </div>

            {/* Filter bar & Average Attendance Rate */}
            <div className="grid grid-cols-12 gap-6 items-stretch">
              <div className="col-span-12 lg:col-span-9 flex flex-wrap gap-6 p-6 bg-white border border-slate-200 rounded-lg">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Society / Dept</label>
                  <select 
                    className="border-b border-slate-200 bg-transparent py-1 pr-6 focus:outline-none focus:border-emerald-700 text-xs font-semibold"
                    value={attendanceDeptFilter}
                    onChange={(e) => setAttendanceDeptFilter(e.target.value)}
                  >
                    <option>All Societies</option>
                    {Array.from(new Set(approvedEvents.map(evt => evt.societyId?.name).filter(Boolean))).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="w-px bg-slate-200 my-1 self-stretch"></div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Type</label>
                  <select 
                    className="border-b border-slate-200 bg-transparent py-1 pr-6 focus:outline-none focus:border-emerald-700 text-xs font-semibold cursor-pointer"
                    value={attendanceTypeFilter}
                    onChange={(e) => setAttendanceTypeFilter(e.target.value)}
                  >
                    <option>All Types</option>
                    <option value="seminar">Seminar</option>
                    <option value="workshop">Workshop</option>
                    <option value="competition">Competition</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
                <div className="w-px bg-slate-200 my-1 self-stretch"></div>

                <div className="ml-auto flex items-center">
                  <span className="text-emerald-700 font-bold text-xs flex items-center gap-1 cursor-pointer hover:underline">
                    <span className="material-symbols-outlined text-sm">filter_list</span>
                    Advanced Filters
                  </span>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-3 p-6 bg-emerald-50 border border-emerald-100 text-emerald-950 rounded-lg flex flex-col justify-center shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Approved Events</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-headline-md text-3xl font-serif font-bold text-emerald-900">{filteredAttendanceEvents.length}</span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center">
                    <span className="material-symbols-outlined text-xs">event_available</span> events
                  </span>
                </div>
              </div>
            </div>

            {filteredAttendanceEvents.length === 0 ? (
              <EmptyState message="No approved active events match the current filters." />
            ) : (
              <div className="paper-card overflow-hidden rounded-lg bg-white shadow-sm border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-label-uppercase text-[11px] font-bold">
                        <th className="px-6 py-4">Event Name & Venue</th>
                        <th className="px-6 py-4">Hosting Society</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4 text-center">RSVP Limits</th>
                        <th className="px-6 py-4 text-center">Active Logs</th>
                        <th className="px-6 py-4 text-right w-64">Check-in % (Capacity Progress)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredAttendanceEvents.map((evt) => {
                        const activeCount = evt.attendeeCount || 0;
                        const percent = Math.min(100, Math.round((activeCount / evt.capacity) * 100)) || 0;

                        return (
                          <tr key={evt._id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-6 py-5">
                              <div className="font-bold text-emerald-950 font-serif text-[16px]">{evt.title}</div>
                              <div className="text-[11px] text-slate-500 font-medium mt-1">
                                {evt.startDateTime ? new Date(evt.startDateTime).toLocaleDateString() : 'Active Date'} • {evt.location}
                              </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase border border-slate-200">
                                {evt.societyId?.name || 'Academic Club'}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-xs text-slate-600 capitalize">
                              {evt.type}
                            </td>
                            <td className="px-6 py-5 text-center font-bold text-slate-800">
                              {evt.capacity} Seats
                            </td>
                            <td className="px-6 py-5 text-center font-bold text-emerald-800">
                              {activeCount} Checked In
                            </td>
                            <td className="px-6 py-5 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-3 justify-end w-full">
                                <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      percent > 85 ? 'bg-emerald-700' : percent > 50 ? 'bg-amber-500' : 'bg-red-600'
                                    }`} 
                                    style={{ width: `${percent}%` }} 
                                  />
                                </div>
                                <span className={`text-xs font-bold font-mono min-w-[36px] ${
                                  percent > 85 ? 'text-emerald-800' : percent > 50 ? 'text-amber-700' : 'text-red-700'
                                }`}>
                                  {percent}%
                                </span>
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

        {/* TAB 7: SETTINGS CONFIGURATIONS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto py-4">
            <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-lg shadow-sm">
              <h2 className="font-headline-sm text-2xl text-emerald-950 font-serif font-bold border-b border-slate-100 pb-4 mb-6">
                Portal System Configurations
              </h2>
              
              <div className="space-y-6 text-sm text-slate-600">
                <div className="flex justify-between items-start py-4 border-b border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-800 font-serif text-base">Mandatory Email Domain Verification</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Restrict student registrations exclusively to <code>@namal.edu.pk</code> addresses to preserve campus database security.
                    </p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Active
                  </span>
                </div>

                <div className="flex justify-between items-start py-4 border-b border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-800 font-serif text-base">6-Digit Manual Fallback Tokens</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Allow campus house executives to verify event check-in entries manually via alphanumeric code tokens.
                    </p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Active
                  </span>
                </div>

                <div className="flex justify-between items-start py-4">
                  <div>
                    <h4 className="font-bold text-slate-800 font-serif text-base">Protected Administrative Console</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Encrypt and restrict executive and super-admin registrations through formal council invitation desk exclusively.
                    </p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Active
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs leading-relaxed text-slate-500 mt-8 font-mono">
                Academic governance configurations are protected via hardcoded administrative parameters in the MERN boundary layer to guarantee secure co-curricular operations.
              </div>
            </div>
          </div>
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
                    await handleModerateEvent(selectedEventForReview._id, 'rejected');
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
