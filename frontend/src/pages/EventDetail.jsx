import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import * as api from '../api/api';

const EVENT_IMAGES = {
  workshops: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUGE0SnvzE6rhMNTe5-31ShGIHxg6ynDnHQEuty48elCHgP2cdZ1F6TH-RQMLj5r9JfwMW85YhJrbvGmq9V6ltlHtATNhp-I0HZNDGOAqUT9PwTBxnC8GWOa0gzLuV9IHN8MojYepknSUT0tImxiql2yZt253rAZDlZGGsJY7iotO_kkfY6uEFzUhRdl4SsuXi5kaBFh_2-OIjHJzLAg1_8fIUs_noNNFy_sSC1kD1djo_HcFSuYxbnknBLKYYflkdQolzLOrAuCHf',
  competitions: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjlFhPi232019Dcfa3ZEvRzcWgIKlRIZYovYEJW_AL7E6QED2ZfbfBmat2Z3x5gn1URLUsE8NThAJfeRvOYlWWbWQfUw8Yr-P6whRwgiKqyRoQIDLvVtzPpbbpT2i29YxbX0kmPwJKaGn6c8eWRnCa_kdW9BJLhSiQodZ3voJDnvU5-Ukb2sSpLc1M47D6limvIHNoCIKihMtnvqXzHxGqiAK5JUKtNT2rs3FituGHyynMEcx-wlv-x967ukdLdUqZ_ViB4DfyThTs',
  seminars: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEqQbdhVkVmYb2QOfWuStYZQMcGPvCbdY0cpCMzgQxDyCE883o-CkmG5bTiePsw56-yCi-rU7Ym3vcl77B9fON2yy618S25Xj6iPUDVpXNXRxdGEP3mMK8SQPPJ3Jxan-SFv7jfW_VFstU_SQ5GiWfQP9KobzE4CHmTAUy321w6t8nxfH2Mu3Z0wUws3p4CDYWC2gzRb3NAYVk3uyepjJtm3wXcrPwVxwcc2i4RuB-GfvHbQRMaRiKx3eBk77gN7RzyASxp1zY56hk',
  sports: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1fZLuBawnslIobqeH6KLsBvZLsTyXBRRMmlcpK2zBdyjMkeNY0C1HeW1AleYStwcFEqBw6JG3brI08mKh9CCtUB9j7RYwZBqHZIt-QYLApAIaDMiFXfkPvRXE37BdWhVmUTozXwmj9b8HVvH8aiDJObx_xFbtvms-dH4NOaT5IPzMCQacq5kUDVBbpr0D3IE7Tv3AfckFZb-Rdt0KtystFV9JMx3wZ7ZqBgsZhyJd7XDAmxOgNynIOwYUuoMyYH6JuxGm8AkzSBm4',
  default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR71oqRq2rNvLaycrOGB1Xkz7oGP1p1JhS5Q0707Fxa95FCsqr_wrCxtjJ3lHtmEdtyLsc6bEDNWCx7I3rB9I66VJg7KNJiggb0t5eEvSbDFRoMVfq3pzcyujK5D6uHKup5bd6s-89q-ycWJzj3a-GWdxgccr5el00OCGLLdZFP6GCqv_FNG3h6fAy3jH9BytabFLKMcFu6SrA22EaS16DWog67kyTFsZ7PjaTz7qAj3Anq1yTDpe5QE2xL-TXhuICy-1MXdQWJR_b'
};

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [qrCodeData, setQrCodeData] = useState(null);

  useEffect(() => {
    async function loadEventAndRsvp() {
      try {
        setLoading(true);
        setError('');
        const evtData = await api.getEventById(id);
        setEvent(evtData);

        if (user && user.role === 'student') {
          const profile = await api.getCurrentUser();
          const activeRsvp = (profile.rsvps || []).find((r) => r.eventId._id === id || r.eventId === id);
          if (activeRsvp) {
            setIsRegistered(true);
            setQrCodeData(await api.getEventQr(id));
          }
        }
      } catch (err) {
        console.error(err);
        setError(err.message || 'Event details not found.');
      } finally {
        setLoading(false);
      }
    }
    loadEventAndRsvp();
  }, [id, user]);

  const handleRsvpSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');
      setSubmitSuccess('');
      await api.submitRsvp(id);
      setSubmitSuccess('RSVP recorded successfully. Seat reserved.');
      setIsRegistered(true);
      setEvent((prev) => ({ ...prev, registered: (prev.registered || 0) + 1 }));
      setQrCodeData(await api.getEventQr(id));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to submit RSVP request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-desktop py-20 animate-pulse">
        <div className="h-10 bg-surface-container-high w-1/3 mb-6 rounded"></div>
        <div className="h-80 bg-surface-container-high w-full mb-12 rounded"></div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white border border-outline-variant text-center">
        <div className="mb-6 p-4 bg-error-container text-on-error-container border border-error text-sm rounded">
          {error}
        </div>
        <Link to="/events" className="px-6 py-3 bg-primary text-white font-label-uppercase text-label-uppercase hover:bg-primary-container transition-all">
          Back to Calendar
        </Link>
      </div>
    );
  }

  const fillPercentage = Math.min(100, Math.round(((event.registered || 0) / (event.capacity || 50)) * 100));
  const isSoldOut = (event.registered || 0) >= (event.capacity || 50);
  const isPast = event.status.toLowerCase() === 'past' || new Date(event.startDateTime) < new Date();
  const societyName = event.societyId && typeof event.societyId === 'object' ? event.societyId.name : 'Rumi Club';

  const typeLower = event.type ? event.type.toLowerCase() + 's' : 'default';
  const bannerImage = EVENT_IMAGES[typeLower] || EVENT_IMAGES.default;

  const dateObj = event.startDateTime ? new Date(event.startDateTime) : null;
  const formattedDate = dateObj
    ? dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : 'Date TBD';
  const formattedTime = dateObj
    ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : 'Time TBD';

  return (
    <div className="min-h-screen relative overflow-hidden pt-10">
      {/* Back navigation header */}
      <div className="max-w-container-max mx-auto px-margin-desktop mb-6 flex items-center gap-4">
        <button 
          onClick={() => navigate('/events')} 
          className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded bg-white hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="h-8 w-px bg-outline-variant"></div>
        <nav className="flex gap-6">
          <span className="font-label-uppercase text-label-uppercase text-primary border-b-2 border-primary pb-1 cursor-default">Details</span>
        </nav>
      </div>

      {/* Main Details Canvas */}
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-4 relative z-10">
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-12 items-end">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary text-white font-label-uppercase text-[10px] px-3 py-1 rounded-full tracking-widest uppercase font-bold">
                {event.status || 'Active'}
              </span>
              <span className="text-on-surface-variant font-label-uppercase text-[10px] tracking-widest font-semibold uppercase">
                ID: {String(event._id || 'EVENT').slice(-8).toUpperCase()}
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-primary leading-tight mb-4">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-on-surface-variant text-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">groups</span>
                <span>Hosted by <strong className="text-on-surface">{societyName}</strong></span>
              </div>
              <span className="hidden md:inline h-4 w-[1px] bg-outline-variant"></span>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                <span>{event.location}</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col justify-end items-start lg:items-end">
            <div className="lg:text-right">
              <p className="font-label-uppercase text-label-uppercase text-on-surface-variant mb-1 text-xs">DATE &amp; TIME</p>
              <p className="font-headline-sm text-headline-sm text-primary font-bold">{formattedDate}</p>
              <p className="font-body-sm text-on-surface-variant font-semibold">{formattedTime}</p>
            </div>
          </div>
        </header>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Main info pane */}
          <div className="lg:col-span-8 space-y-12">
            <div className="w-full h-96 bg-surface-container overflow-hidden rounded-lg border border-outline-variant group">
              <img 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                src={bannerImage} 
                alt={event.title} 
              />
            </div>

            <section>
              <h2 className="font-headline-md text-headline-md text-primary mb-6 border-b-2 border-outline-variant pb-2">Event Brief</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                {event.description}
              </p>
            </section>

          </div>

          {/* Sticky Side RSVP and Passes card */}
          <aside className="lg:col-span-4 sticky top-28 space-y-8">
            <div className="bg-white border border-outline-variant p-8 space-y-8 shadow-sm">
              {/* Seat counter */}
              <div>
                <div className="flex justify-between items-end mb-3 text-sm">
                  <p className="font-label-uppercase text-label-uppercase text-on-surface-variant uppercase font-bold">Availability</p>
                  <p className="font-body-md text-primary font-bold">
                    {event.registered || 0} / {event.capacity || 50} <span className="text-on-surface-variant font-normal">Seats Filled</span>
                  </p>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full transition-all duration-1000" 
                    style={{ 
                      width: `${fillPercentage}%`,
                      backgroundColor: isSoldOut ? '#ba1a1a' : '#005026'
                    }}
                  ></div>
                </div>
                <p className="font-body-sm text-on-surface-variant mt-3 italic text-xs">
                  {isSoldOut 
                    ? 'Maximum capacity reached. RSVPs are closed.' 
                    : `Only ${(event.capacity || 50) - (event.registered || 0)} spots remaining for student delegates.`}
                </p>
              </div>

              {/* Action Console Section */}
              <div className="space-y-4">
                {isPast ? (
                  <div className="p-4 bg-surface-container-low border border-outline-variant text-center rounded">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Event Concluded</h3>
                    <p className="text-body-sm text-on-surface-variant">This event has already occurred. RSVPs are locked.</p>
                  </div>
                ) : isRegistered && qrCodeData ? (
                  <div className="flex flex-col items-center p-6 border-2 border-dashed border-primary bg-surface-container-low rounded-lg" aria-live="polite">
                    <span className="font-label-uppercase text-label-uppercase text-primary mb-4 font-bold tracking-widest text-[10px]">YOUR DIGITAL PASS</span>
                    <div className="w-48 h-48 bg-white border border-outline-variant p-4 flex items-center justify-center">
                      <img 
                        src={qrCodeData.qrUrl} 
                        alt={`Attendance check-in QR code for ${event.title}`} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <p className="mt-4 font-body-sm text-on-surface font-bold text-center">RSVP CONFIRMED</p>
                    <p className="text-[10px] text-on-surface-variant mt-1 uppercase tracking-widest">Valid for Venue Access</p>
                    {qrCodeData.message && (
                      <p className="text-[9px] text-on-surface-variant mt-2 bg-white px-2 py-1 border border-outline-variant text-center rounded max-w-full truncate">
                        {qrCodeData.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    {submitSuccess && (
                      <div className="p-3 mb-3 bg-tertiary-container text-on-tertiary-container border border-tertiary rounded text-xs" role="alert">
                        {submitSuccess}
                      </div>
                    )}
                    {error && (
                      <div className="p-3 mb-3 bg-error-container text-on-error-container border border-error rounded text-xs" role="alert">
                        {error}
                      </div>
                    )}

                    {!user ? (
                      <>
                        <p className="text-body-sm text-on-surface-variant opacity-80 text-center mb-4">
                          Please sign in with your student credentials to reserve your seat at this event.
                        </p>
                        <Link to="/login" className="w-full py-4 bg-primary text-on-primary font-label-uppercase text-label-uppercase hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-2 text-center text-xs">
                          Sign In to RSVP <span className="material-symbols-outlined">arrow_forward</span>
                        </Link>
                      </>
                    ) : user.role !== 'student' ? (
                      <div className="p-4 bg-surface-container-high border border-outline-variant text-body-sm text-on-surface-variant text-center rounded">
                        RSVP is restricted to student accounts. Current role: <strong className="uppercase">{user.role}</strong>.
                      </div>
                    ) : (
                      <>
                        <p className="text-body-sm text-on-surface-variant opacity-80 text-center mb-4">
                          Reserve your seat now. Your digital attendance credential will be generated automatically.
                        </p>
                        <button 
                          onClick={handleRsvpSubmit} 
                          disabled={submitting || isSoldOut}
                          className="w-full py-4 bg-primary text-on-primary font-bold hover:bg-primary-container hover:text-white transition-all flex items-center justify-center gap-2 font-label-uppercase text-label-uppercase tracking-widest text-xs"
                        >
                          {submitting ? 'PROCESSING RSVP...' : isSoldOut ? 'SOLD OUT' : 'CONFIRM RSVP'}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
