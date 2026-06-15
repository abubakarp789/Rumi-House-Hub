import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api/api';
import workshopImg from '../assets/landing/news-workshop.png';
import poetryImg from '../assets/landing/news-poetry.png';
import cleanupImg from '../assets/landing/news-cleanup.png';
import academicImg from '../assets/landing/namal-academic-block-display.jpg';
import courtyardImg from '../assets/landing/namal-courtyard-display.jpg';

const CATEGORY_IMAGES = {
  technical: workshopImg,
  arts: poetryImg,
  literary: poetryImg,
  sports: courtyardImg,
  social: cleanupImg,
  default: academicImg
};

const CATEGORY_BADGES = {
  technical: 'bg-primary-container text-on-primary-container',
  arts: 'bg-secondary-container text-on-secondary-container',
  literary: 'bg-tertiary-container text-on-tertiary-container',
  social: 'bg-on-tertiary-fixed-variant text-white',
  sports: 'bg-secondary text-white',
  default: 'bg-outline-variant text-on-surface'
};

const CATEGORY_ICONS = {
  technical: 'smart_toy',
  arts: 'brush',
  literary: 'menu_book',
  sports: 'sports_basketball',
  social: 'eco',
  default: 'groups'
};

export default function SocietyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [society, setSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [membershipStatus, setMembershipStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');

  useEffect(() => {
    async function loadSocietyAndMembership() {
      try {
        setLoading(true);
        setError('');
        const socData = await api.getSocietyById(id);
        setSociety(socData);

        if (user) {
          const activeMembership = (user.memberships || []).find((m) => (m.societyId?._id || m.societyId) === id);
          if (activeMembership) {
            setMembershipStatus(activeMembership.status);
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Society details not found.');
      } finally {
        setLoading(false);
      }
    }
    loadSocietyAndMembership();
  }, [id, user]);

  const handleJoinSociety = async () => {
    try {
      setSubmitting(true);
      setError('');
      setSubmitSuccess('');
      const response = await api.joinSociety(id);
      setSubmitSuccess(response.message || 'Join request submitted.');
      setMembershipStatus('pending');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit join request.');
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-desktop py-20 animate-pulse">
        <div className="h-10 bg-surface-container-high w-1/3 mb-6 rounded"></div>
        <div className="h-80 bg-surface-container-high w-full mb-12 rounded"></div>
        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-8 space-y-4">
            <div className="h-6 bg-surface-container-high w-2/3 rounded"></div>
            <div className="h-24 bg-surface-container-high w-full rounded"></div>
          </div>
          <div className="col-span-4 h-48 bg-surface-container-high rounded"></div>
        </div>
      </div>
    );
  }

  if (error && !society) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-outline-variant text-center">
        <div className="mb-6 p-4 bg-error-container text-on-error-container border border-error text-sm rounded">
          {error}
        </div>
        <Link to="/societies" className="px-6 py-3 bg-primary text-white font-label-uppercase text-label-uppercase hover:bg-primary-container transition-all">
          Back to Directory
        </Link>
      </div>
    );
  }

  const catLower = society.category ? society.category.toLowerCase() : 'default';
  const bannerImage = CATEGORY_IMAGES[catLower] || CATEGORY_IMAGES.default;
  const badgeClass = CATEGORY_BADGES[catLower] || CATEGORY_BADGES.default;
  const catIcon = CATEGORY_ICONS[catLower] || CATEGORY_ICONS.default;

  return (
    <div className="min-h-screen relative overflow-hidden pt-10">
      {/* Top Header Navigation (Contextual Detail) */}
      <div className="max-w-container-max mx-auto px-margin-desktop mb-6 flex items-center gap-4">
        <button 
          onClick={() => navigate('/societies')} 
          className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded bg-white hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="h-8 w-px bg-outline-variant"></div>
        <nav className="flex gap-6">
          <span className="font-label-uppercase text-label-uppercase text-primary border-b-2 border-primary pb-1 cursor-default">Overview</span>
          <span className="font-label-uppercase text-label-uppercase text-on-surface-variant cursor-default">Portfolio</span>
        </nav>
      </div>

      {/* Society Hero Section */}
      <section className="max-w-container-max mx-auto px-margin-desktop py-6 grid grid-cols-12 gap-gutter">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className={`${badgeClass} px-3 py-1 font-label-uppercase text-[10px] tracking-widest rounded-sm uppercase`}>
              {society.category || 'General'}
            </span>
            <div className="flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[18px]">group</span>
              <span className="font-label-uppercase text-[10px] tracking-widest">
                {society.memberCount || 0} ACTIVE MEMBERS
              </span>
            </div>
          </div>
          <h2 className="font-display-lg text-display-lg text-primary max-w-2xl leading-tight">
            {society.name}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed italic">
            "{society.name.includes('Rumi') ? 'Awakening scholastic hearts through classic wisdom' : 'Building specialized engagement environments for Namal scholars.'}"
          </p>

          <div className="w-full h-80 relative rounded-lg overflow-hidden border border-outline-variant group">
            <img 
              alt={`${society.name} Lab Banner`} 
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
              src={bannerImage}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <p className="font-label-uppercase text-label-uppercase opacity-80">CAMPUS PILLAR</p>
              <p className="font-headline-sm text-headline-sm">{society.name}</p>
            </div>
          </div>
        </div>

        {/* Side Sidebar / Membership Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-gutter">
          {/* Join Console Card */}
          <div className="bg-white border-2 border-primary p-8 flex flex-col gap-6 relative shadow-sm">
            <div className="absolute top-0 right-0 w-12 h-12 bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-xl">verified</span>
            </div>
            <p className="font-label-uppercase text-label-uppercase text-primary font-bold">Membership Portal</p>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Join Our Student Collective</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Members gain active access to campus workspaces, regional events rosters, training budgets, and checking-in operations.
            </p>

            {submitSuccess && (
              <div className="p-3 bg-tertiary-container text-on-tertiary-container border border-tertiary rounded text-xs" role="alert">
                {submitSuccess}
              </div>
            )}
            {error && (
              <div className="p-3 bg-error-container text-on-error-container border border-error rounded text-xs" role="alert">
                {error}
              </div>
            )}

            {!user ? (
              <>
                <p className="text-body-sm text-on-surface-variant opacity-80">
                  Please sign in with your student account credentials to apply.
                </p>
                <Link to="/login" className="w-full py-4 bg-primary text-on-primary font-label-uppercase text-label-uppercase hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-2 text-center text-xs">
                  Sign In to Join <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </>
            ) : user.role !== 'student' ? (
              <div className="p-4 bg-surface-container-high border border-outline-variant text-body-sm text-on-surface-variant text-center rounded">
                Membership registration is reserved for student accounts. Current role: <strong className="uppercase">{user.role}</strong>.
              </div>
            ) : membershipStatus ? (
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded">
                <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-2">APPLICATION STATUS</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 font-bold rounded-sm uppercase tracking-wider text-[10px] ${
                    membershipStatus === 'approved' 
                      ? 'bg-tertiary-container text-on-tertiary-container' 
                      : membershipStatus === 'pending'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-error-container text-on-error-container'
                  }`}>
                    {membershipStatus}
                  </span>
                </div>
                <p className="text-body-sm text-on-surface-variant">
                  {membershipStatus === 'pending'
                    ? 'Your enrollment request is awaiting Rumi Admin review.'
                    : membershipStatus === 'approved'
                      ? 'You are an active approved member of this club.'
                      : 'Your join request was rejected. Contact coordinators for details.'}
                </p>
              </div>
            ) : (
              <>
                <p className="text-body-sm text-on-surface-variant opacity-80">
                  Your student name and batch registration info will automatically link.
                </p>
                <button 
                  onClick={handleJoinSociety} 
                  disabled={submitting}
                  className="w-full py-4 bg-primary text-on-primary font-label-uppercase text-label-uppercase tracking-[0.2em] hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-2 text-xs"
                >
                  {submitting ? 'SUBMITTING...' : 'JOIN SOCIETY'} <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </>
            )}
            <p className="font-body-sm text-[11px] text-center italic text-on-surface-variant/60">Recruitment verified via Rumi House committee</p>
          </div>

          {/* Structuring Info & Faculty Patron Cards */}
          <div className="bg-surface-container-low border border-outline-variant p-6 space-y-6">
            <div>
              <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-3">FACULTY PATRON</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-surface-container-highest flex items-center justify-center text-primary font-bold">🏛️</div>
                <div>
                  <p className="font-body-md font-bold text-on-surface">
                    {society.patronName || 'Faculty Patron'}
                  </p>
                  <p className="font-body-sm text-on-surface-variant">Namal University Faculty</p>
                </div>
              </div>
            </div>
            
            <div>
              <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-3">SOCIETY COORDINATOR</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-primary-container flex items-center justify-center text-on-primary-container font-bold">
                  {society.facultyCoordinator ? society.facultyCoordinator.slice(0, 2).toUpperCase() : 'SC'}
                </div>
                <div>
                  <p className="font-body-md font-bold text-on-surface">
                    {society.facultyCoordinator || 'Society Coordinator'}
                  </p>
                  <p className="font-body-sm text-on-surface-variant">Student Council Liaison</p>
                </div>
              </div>
            </div>

            {society.executiveBody && society.executiveBody.length > 0 && (
              <div>
                <p className="font-label-uppercase text-[10px] text-on-surface-variant mb-3">EXECUTIVE BODY</p>
                <div className="space-y-3">
                  {society.executiveBody.map((exec) => (
                    <div key={`${exec.position}-${exec.userId?._id || exec.userId?.name}`} className="flex items-center gap-3 border-t border-outline-variant/30 pt-2">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-primary uppercase">
                        {exec.userId?.name ? exec.userId.name.slice(0, 2) : 'EX'}
                      </div>
                      <div>
                        <p className="font-body-sm font-bold text-on-surface">{exec.userId?.name || 'Executive Lead'}</p>
                        <p className="text-[11px] text-on-surface-variant capitalize">{exec.position}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
