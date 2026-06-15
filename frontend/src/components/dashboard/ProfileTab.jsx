import React, { useEffect, useState } from 'react';

export default function ProfileTab({ user, getInitials, updateProfile }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    department: user.department || '',
    batch: user.batch || '',
    phone: user.phone || '',
    emergencyContact: user.emergencyContact || ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setFormData({
      name: user.name || '',
      department: user.department || '',
      batch: user.batch || '',
      phone: user.phone || '',
      emergencyContact: user.emergencyContact || ''
    });
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    if (!formData.name.trim() || !formData.department.trim() || !formData.batch.trim()) {
      setMessage('Name, department, and batch are required.');
      return;
    }
    try {
      setSaving(true);
      await updateProfile(formData);
      setMessage('Profile saved successfully.');
    } catch (error) {
      setMessage(error.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="grid grid-cols-12 gap-gutter animate-fade-in">
      {/* Left Column: Credentials overview panel */}
      <div className="col-span-12 lg:col-span-4 space-y-gutter">
        <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-none flex flex-col items-center text-center shadow-sm">
          <div className="relative mb-6">
            <div className="h-32 w-32 rounded-none border-2 border-primary p-1 bg-white">
              <div className="w-full h-full bg-primary-fixed-dim/20 text-primary flex items-center justify-center font-display text-4xl font-bold uppercase">
                {getInitials(user.name)}
              </div>
            </div>
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

          {message && <div className="mb-4 p-3 border border-outline-variant bg-surface text-xs" role="status">{message}</div>}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label-uppercase text-label-uppercase text-on-surface-variant font-bold text-xs tracking-wider block">
                  FULL NAME
                </label>
                <input 
                  className="w-full bg-surface border border-outline-variant px-4 py-3 focus:border-primary focus:ring-0 rounded-none font-body-md transition-all outline-none" 
                  type="text" 
                  value={formData.name}
                  onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-uppercase text-label-uppercase text-on-surface-variant font-bold text-xs tracking-wider block">
                  EMAIL ADDRESS
                </label>
                <input 
                  className="w-full bg-surface border border-outline-variant px-4 py-3 focus:border-primary focus:ring-0 rounded-none font-body-md transition-all outline-none font-mono" 
                  type="email" 
                  value={user.email}
                  readOnly
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-uppercase text-label-uppercase text-on-surface-variant font-bold text-xs tracking-wider block">
                  PHONE NUMBER
                </label>
                <input 
                  className="w-full bg-surface border border-outline-variant px-4 py-3 focus:border-primary focus:ring-0 rounded-none font-body-md transition-all outline-none" 
                  placeholder="+92 300 1234567"
                  value={formData.phone}
                  onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
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
                  value={formData.emergencyContact}
                  onChange={(event) => setFormData((current) => ({ ...current, emergencyContact: event.target.value }))}
                  type="text" 
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button 
                className="bg-primary text-on-primary px-8 py-3 font-label-uppercase text-label-uppercase hover:bg-primary-container transition-all flex items-center gap-2 text-white font-bold text-xs tracking-wider uppercase rounded" 
                type="submit"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
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
  );
}
