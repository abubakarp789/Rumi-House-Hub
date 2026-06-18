import React from 'react';
import { Link } from 'react-router-dom';
import academicImg from '../assets/landing/namal-academic-block-display.jpg';
import courtyardImg from '../assets/landing/namal-courtyard-display.jpg';

const EVENT_IMAGES = {
  workshops: '/events/ai_workshop.png',
  competitions: academicImg,
  seminars: '/events/math_carnival.png',
  sports: courtyardImg,
  default: '/events/blood_drive.png'
};

const CATEGORY_COLORS = {
  workshops: 'text-primary border-primary',
  competitions: 'text-secondary border-secondary',
  seminars: 'text-tertiary border-tertiary',
  sports: 'text-on-tertiary-fixed-variant border-on-tertiary-fixed-variant',
  default: 'text-primary border-primary'
};

export default function EventCard({ event }) {
  const { id, _id, title, startDateTime, location, status, type, societyId, capacity, registered, imageUrl } = event;
  const targetId = _id || id;
  const societyName = societyId && typeof societyId === 'object' ? societyId.name : 'Rumi House Society';

  const typeLower = type ? type.toLowerCase() + 's' : 'default';
  const cardImage = imageUrl || EVENT_IMAGES[typeLower] || EVENT_IMAGES.default;
  const badgeColor = CATEGORY_COLORS[typeLower] || CATEGORY_COLORS.default;

  const dateObj = startDateTime ? new Date(startDateTime) : null;
  const dayStr = dateObj ? dateObj.getDate().toString().padStart(2, '0') : '24';
  const monthStr = dateObj 
    ? dateObj.toLocaleDateString('en-US', { month: 'short' })
    : 'Oct';
  const yearStr = dateObj 
    ? dateObj.getFullYear()
    : '--';

  const formattedTime = dateObj
    ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '02:00 PM';

  const totalSeats = capacity || 0;
  const takenSeats = registered || 0;
  const filledPercent = totalSeats ? Math.min(100, Math.round((takenSeats / totalSeats) * 100)) : 0;

  const hasCustomImage = !!imageUrl;

  return (
    <article className="atrium-card p-0 flex flex-col justify-between h-full group">
      <div>
        <div className={`relative overflow-hidden ${hasCustomImage ? 'h-auto' : 'h-48'}`}>
          <img 
            alt={title} 
            className={`w-full transition-transform duration-700 group-hover:scale-[1.03] ${hasCustomImage ? 'h-auto block' : 'h-full object-cover'}`} 
            src={cardImage}
          />
        </div>

        <div className="p-6 pb-0 text-left">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <span className="font-serif text-[38px] text-[var(--atrium-green)] leading-none font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                {dayStr}
              </span>
              <div className="flex flex-col">
                <span className="font-label-uppercase text-label-uppercase text-[10px] text-[#71887e] font-bold tracking-wider leading-none">
                  {monthStr}
                </span>
                <span className="font-body-sm text-[12px] text-[#71887e] font-semibold mt-0.5 leading-none">
                  {yearStr}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="atrium-badge px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                {type || 'General'}
              </span>
              <div className="bg-[#b58a46]/10 border border-[#b58a46]/20 px-3 py-1 rounded-full">
                <span className="font-label-uppercase text-label-uppercase text-[#b58a46] text-[9px] uppercase font-bold tracking-wide">
                  {status || 'Upcoming'}
                </span>
              </div>
            </div>
          </div>

          <h3 className="atrium-card-title text-[1.35rem] font-semibold mb-2 group-hover:text-[var(--atrium-gold)] transition-colors duration-300 line-clamp-2">
            {title}
          </h3>
          <p className="text-body-sm text-[#50665b] font-semibold mt-1">
            Host: {societyName}
          </p>

          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2 text-[#50665b]">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span className="font-body-sm text-body-sm">{formattedTime}</span>
            </div>
            <div className="flex items-center gap-2 text-[#50665b]">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span className="font-body-sm text-body-sm truncate">{location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 text-left">
        <div className="flex flex-col gap-2 mt-6">
          <div className="flex justify-between font-label-uppercase text-[9px] text-[#71887e] font-semibold tracking-wider">
            <span>Seats Reserved</span>
            <span>{takenSeats}/{totalSeats} Seats</span>
          </div>
          <div className="w-full h-1.5 bg-[#e5e9e7] rounded-full overflow-hidden border border-[#d2d9d6]">
            <div className="h-full bg-gradient-to-r from-[var(--atrium-green)] to-[var(--atrium-gold)]" style={{ width: `${filledPercent}%` }}></div>
          </div>
        </div>

        <Link 
          to={`/events/${targetId}`} 
          className="atrium-btn-primary w-full py-3 mt-6 flex items-center justify-center gap-2 rounded"
        >
          <span className="font-label-uppercase text-label-uppercase">DETAILS & RSVP</span>
          <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
        </Link>
      </div>
    </article>
  );
}
