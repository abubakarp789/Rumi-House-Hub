import React from 'react';
import { Link } from 'react-router-dom';

const EVENT_IMAGES = {
  workshops: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUGE0SnvzE6rhMNTe5-31ShGIHxg6ynDnHQEuty48elCHgP2cdZ1F6TH-RQMLj5r9JfwMW85YhJrbvGmq9V6ltlHtATNhp-I0HZNDGOAqUT9PwTBxnC8GWOa0gzLuV9IHN8MojYepknSUT0tImxiql2yZt253rAZDlZGGsJY7iotO_kkfY6uEFzUhRdl4SsuXi5kaBFh_2-OIjHJzLAg1_8fIUs_noNNFy_sSC1kD1djo_HcFSuYxbnknBLKYYflkdQolzLOrAuCHf',
  competitions: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjlFhPi232019Dcfa3ZEvRzcWgIKlRIZYovYEJW_AL7E6QED2ZfbfBmat2Z3x5gn1URLUsE8NThAJfeRvOYlWWbWQfUw8Yr-P6whRwgiKqyRoQIDLvVtzPpbbpT2i29YxbX0kmPwJKaGn6c8eWRnCa_kdW9BJLhSiQodZ3voJDnvU5-Ukb2sSpLc1M47D6limvIHNoCIKihMtnvqXzHxGqiAK5JUKtNT2rs3FituGHyynMEcx-wlv-x967ukdLdUqZ_ViB4DfyThTs',
  seminars: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEqQbdhVkVmYb2QOfWuStYZQMcGPvCbdY0cpCMzgQxDyCE883o-CkmG5bTiePsw56-yCi-rU7Ym3vcl77B9fON2yy618S25Xj6iPUDVpXNXRxdGEP3mMK8SQPPJ3Jxan-SFv7jfW_VFstU_SQ5GiWfQP9KobzE4CHmTAUy321w6t8nxfH2Mu3Z0wUws3p4CDYWC2gzRb3NAYVk3uyepjJtm3wXcrPwVxwcc2i4RuB-GfvHbQRMaRiKx3eBk77gN7RzyASxp1zY56hk',
  sports: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1fZLuBawnslIobqeH6KLsBvZLsTyXBRRMmlcpK2zBdyjMkeNY0C1HeW1AleYStwcFEqBw6JG3brI08mKh9CCtUB9j7RYwZBqHZIt-QYLApAIaDMiFXfkPvRXE37BdWhVmUTozXwmj9b8HVvH8aiDJObx_xFbtvms-dH4NOaT5IPzMCQacq5kUDVBbpr0D3IE7Tv3AfckFZb-Rdt0KtystFV9JMx3wZ7ZqBgsZhyJd7XDAmxOgNynIOwYUuoMyYH6JuxGm8AkzSBm4',
  default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR71oqRq2rNvLaycrOGB1Xkz7oGP1p1JhS5Q0707Fxa95FCsqr_wrCxtjJ3lHtmEdtyLsc6bEDNWCx7I3rB9I66VJg7KNJiggb0t5eEvSbDFRoMVfq3pzcyujK5D6uHKup5bd6s-89q-ycWJzj3a-GWdxgccr5el00OCGLLdZFP6GCqv_FNG3h6fAy3jH9BytabFLKMcFu6SrA22EaS16DWog67kyTFsZ7PjaTz7qAj3Anq1yTDpe5QE2xL-TXhuICy-1MXdQWJR_b'
};

const CATEGORY_COLORS = {
  workshops: 'text-primary border-primary',
  competitions: 'text-secondary border-secondary',
  seminars: 'text-tertiary border-tertiary',
  sports: 'text-on-tertiary-fixed-variant border-on-tertiary-fixed-variant',
  default: 'text-primary border-primary'
};

export default function EventCard({ event }) {
  const { id, _id, title, startDateTime, location, status, type, societyId, maxSeats, rsvpsCount } = event;
  const targetId = _id || id;
  const societyName = societyId && typeof societyId === 'object' ? societyId.name : 'Rumi House Society';

  const typeLower = type ? type.toLowerCase() + 's' : 'default';
  const cardImage = EVENT_IMAGES[typeLower] || EVENT_IMAGES.default;
  const badgeColor = CATEGORY_COLORS[typeLower] || CATEGORY_COLORS.default;

  const dateObj = startDateTime ? new Date(startDateTime) : null;
  const dayStr = dateObj ? dateObj.getDate().toString().padStart(2, '0') : '24';
  const monthStr = dateObj 
    ? dateObj.toLocaleDateString('en-US', { month: 'short' })
    : 'Oct';
  const yearStr = dateObj 
    ? dateObj.getFullYear()
    : '2024';

  const formattedTime = dateObj
    ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : '02:00 PM';

  const totalSeats = maxSeats || 50;
  const takenSeats = rsvpsCount || 0;
  const filledPercent = Math.min(100, Math.round((takenSeats / totalSeats) * 100));

  return (
    <article className="bg-white border border-outline-variant/60 p-0 flex flex-col bento-card-premium shadow-tight justify-between h-full rounded-lg group">
      <div>
        <div className="relative h-48 overflow-hidden">
          <img 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" 
            src={cardImage}
          />
          <div className="absolute top-4 left-4 bg-white px-3 py-1.5 border border-outline-variant/60 shadow-sm rounded-sm">
            <span className={`font-label-uppercase text-label-uppercase text-[9px] font-bold uppercase tracking-wider ${badgeColor}`}>
              {type || 'General'}
            </span>
          </div>
        </div>

        <div className="p-6 pb-0 text-left">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <span className="font-display-lg text-[38px] text-primary leading-none font-bold">
                {dayStr}
              </span>
              <div className="flex flex-col">
                <span className="font-label-uppercase text-label-uppercase text-[10px] text-on-surface-variant font-bold tracking-wider leading-none">
                  {monthStr}
                </span>
                <span className="font-body-sm text-[12px] text-on-surface-variant font-semibold mt-0.5 leading-none">
                  {yearStr}
                </span>
              </div>
            </div>
            <div className="bg-tertiary/10 border border-tertiary/20 px-3 py-1 rounded-full">
              <span className="font-label-uppercase text-label-uppercase text-tertiary text-[9px] uppercase font-bold tracking-wide">
                {status || 'Upcoming'}
              </span>
            </div>
          </div>

          <h3 className="font-headline-sm text-headline-sm group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-body-sm text-on-surface-variant font-semibold mt-1">
            Host: {societyName}
          </p>

          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span className="font-body-sm text-body-sm">{formattedTime}</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span className="font-body-sm text-body-sm truncate">{location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 text-left">
        <div className="flex flex-col gap-2 mt-6">
          <div className="flex justify-between font-label-uppercase text-[9px] text-on-surface-variant font-semibold tracking-wider">
            <span>Seats Reserved</span>
            <span>{takenSeats}/{totalSeats} Seats</span>
          </div>
          <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden border border-outline-variant/30">
            <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${filledPercent}%` }}></div>
          </div>
        </div>

        <Link 
          to={`/events/${targetId}`} 
          className="mt-6 w-full py-3 bg-primary text-white font-semibold hover:bg-primary-container hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 rounded shadow-tight"
        >
          <span className="font-label-uppercase text-label-uppercase">DETAILS & RSVP</span>
          <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
        </Link>
      </div>
    </article>
  );
}
