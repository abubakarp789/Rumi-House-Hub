import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api/api';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import MembershipsTab from '../components/dashboard/MembershipsTab';
import RsvpsTab from '../components/dashboard/RsvpsTab';
import ProfileTab from '../components/dashboard/ProfileTab';

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

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function Dashboard() {
  const { user, updateProfile } = useContext(AuthContext);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('memberships');
  const [memberships, setMemberships] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrPasses, setQrPasses] = useState({});

  // Sync active tab with query params (?tab=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['memberships', 'rsvps', 'profile'].includes(tabParam)) {
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

  const handleMembershipDelete = async (membership) => {
    try {
      await api.deleteMembership(membership.societyId?._id || membership.societyId, membership._id);
      setMemberships((prev) => prev.filter((item) => item._id !== membership._id));
    } catch (err) {
      setError(err.message || 'Failed to remove membership.');
    }
  };

  const handleCancelRsvp = async (rsvp) => {
    try {
      const eventId = rsvp.eventId?._id || rsvp.eventId;
      await api.cancelRsvp(eventId);
      setRsvps((prev) => prev.filter((item) => item._id !== rsvp._id));
      setQrPasses((prev) => {
        const next = { ...prev };
        delete next[eventId];
        return next;
      });
    } catch (err) {
      setError(err.message || 'Failed to cancel RSVP.');
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
        {activeTab === 'memberships' && (
          <MembershipsTab memberships={memberships} handleMembershipDelete={handleMembershipDelete} />
        )}

        {activeTab === 'rsvps' && (
          <RsvpsTab 
            rsvps={rsvps} 
            qrPasses={qrPasses} 
            handleLoadQr={handleLoadQr} 
            handleCancelRsvp={handleCancelRsvp}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileTab 
            user={user} 
            getInitials={getInitials} 
            updateProfile={updateProfile}
          />
        )}
      </div>
    </div>
  );
}
