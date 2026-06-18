import React from 'react';
import { Link } from 'react-router-dom';
import academicImg from '../assets/landing/namal-academic-block-display.jpg';
import courtyardImg from '../assets/landing/namal-courtyard-display.jpg';

const CATEGORY_IMAGES = {
  technical: '/societies/ncs_banner.png',
  arts: '/societies/lds_banner.png',
  literary: '/societies/lds_banner.png',
  sports: courtyardImg,
  social: '/societies/von_banner.png',
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

export default function SocietyCard({ society }) {
  const { id, _id, name, category, description, memberCount, patronName, facultyCoordinator, imageUrl } = society;
  const targetId = _id || id;

  const catLower = category ? category.toLowerCase() : 'default';
  const cardImage = imageUrl || CATEGORY_IMAGES[catLower] || CATEGORY_IMAGES.default;
  const badgeClass = CATEGORY_BADGES[catLower] || CATEGORY_BADGES.default;

  const hasCustomImage = !!imageUrl;

  return (
    <article className="atrium-card flex flex-col justify-between h-full group">
      <div>
        <div className={`w-full overflow-hidden relative ${hasCustomImage ? 'h-auto' : 'h-48'}`}>
          <img 
            className={`w-full transition-transform duration-700 group-hover:scale-[1.03] ${hasCustomImage ? 'h-auto block' : 'h-full object-cover'}`} 
            src={cardImage} 
            alt={`${name}`} 
          />
        </div>
        
        <div className="p-6 pb-0 text-left">
          <div className="flex items-center gap-2 mb-2">
            <span className="atrium-badge px-2 py-0.5 text-[9px] tracking-widest uppercase font-bold">
              {category || 'General'}
            </span>
          </div>
          <h3 className="atrium-card-title text-[1.35rem] font-semibold mb-2 group-hover:text-[var(--atrium-gold)] transition-colors duration-300">
            {name}
          </h3>
          <p className="font-body-sm text-[#50665b] line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0 text-left">
        <div className="grid grid-cols-2 gap-4 mb-6 border-y border-[#e5e9e7] py-4 mt-4">
          <div>
            <p className="font-label-uppercase text-[9px] text-[#71887e] mb-1 font-semibold tracking-wider">Faculty Patron</p>
            <p className="font-body-sm font-semibold text-[#1a2f26] truncate">
              {patronName || facultyCoordinator || 'Faculty Patron'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-label-uppercase text-[9px] text-[#71887e] mb-1 font-semibold tracking-wider">MEMBERS</p>
            <p className="font-body-sm font-semibold text-[#1a2f26]">
              {memberCount || 0} Active
            </p>
          </div>
        </div>

        <Link 
          to={`/societies/${targetId}`} 
          className="atrium-btn-outline w-full py-3 flex items-center justify-center gap-2 rounded"
        >
          View Details <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
        </Link>
      </div>
    </article>
  );
}
