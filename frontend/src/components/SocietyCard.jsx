import React from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_IMAGES = {
  technical: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYQinggRrFw8Gks7uyF_RlhdoBQypkHhrafFcMGizEpXShRIlkZU4yC_HuEzFCH16DPV_JVPdEHcQNpJzxhSEfdnxmKidOM7zRrhuQCkZC4lSTEJsMAGNfr8qTPdAqhEMhemCA0J8i9RaMxKOr5iGbGkVjWYwzyMsxMWKukfX5RNiUZTPp52meOFG_7aiIHnY7uclS_2PLlLWoTE91qXOh_xRf8Du17uFHB9nMgLoMfA-GE21okRZVujrGoYMdKFwtgiP_3kmgezBL',
  arts: 'https://lh3.googleusercontent.com/aida-public/AB6AXuHeZ0qHPm2HQHGB_14LwI4xAGuGpQp8f3pW6HD-xN7OsWRzNVNvYjGw4NRrLOh0JZWGp5Sg440rnAWrjXRwgfyq6dfPB0mzfHgDTuVdLsgln7xl4c58Kyj3xaXgRGwNU1KGiHsAEwaIvvL57lBiUyp6Fh7t4OrktFy96b7VoUzGtH4-7I6qAfKon-PjeIfYtOMimoLS1VzjLrDTqwRa5fiQwIBVkxeukpjg8EVCRLC471DdKKTSwM3HJbOkGdcV1K3PTQQ9TR7mXAZ',
  literary: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy8aSZASA66VrZoS7DP4tfi0_EJAtwprjrc3CSREPojoBBkSPZsakwKzEcQvJHnIw7pH4bJfDmONhrODzABfQQRU6qTa6PFgYi2kSEvyPAeYgvErAb9MfCR7RDwpgZn8gi5R2IdbyPOLt96-EYd5S60XYcZUN81KotVfANQ7qeuGYHO9WITUW6vt6O9WMcxmdsbZWHNaw978wd5CzdVhHFiHJy0Ps3Fz0NY9JTRDyVugziBjNw0JPWVL33jt4zAPXX6CmIESVzPKBI',
  sports: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkPxw89IuNpc0MQcKSB7kJJr-zo_6Xu1Xu_iDV9_CdTHxvyJthJr2zYDxtcY9VkmRGq7sJFzHvh9zSCeGJXfqZ1Dk43XoJC6_j7RP2AYw0JzSLxc3zhW-K68AAZ7OpLZJ2BC_kR-EaYkSmqfMRO_J5bpTNekONTAEeOemnVTHQe8mEQI7gCYLC_fHVzmWNNBncDjyI-7Y5Yad3RQnbS_ETbd7wBZzcVe0Fd8rI8nhw6kbOeiSKntS_frPNuGyUrV5esK3LbDB2-IJ6',
  social: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDHCXfIr0XsWyJgc9TlwYrdMU9lp4Tr0ZUlfFUFgIDD_tCNbs0wgyVC_81ZmJknFaRC7-UMW8Xx5i6dkbsb7Z37Dd48FgHbs0ACpQNFfuN5FDGWxeHgZlv8DRauf7GeYy4RJ-B0DhGQ-3B8mPZT56WWnS8h3ml2ubSPW8Lgu12x64BQ2Lle-qmFxVytVSIA9T-ReLGlS_SVHpPxQmCbo5x4ozzIOJM8uT4Alx8eIXhWt2GXs9-v7fvbLYxy6gRalBGXylrTUJ1vY3s5',
  default: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC20N6sdr1VYNsyL18k2Ncy0WKUtg00NktExF4GPuNKPkXibnLadck0UmvivEw2PJvVQE2tRjwClle7sqry1WwzRO4oxhrBOKDGkMkZjBqFCWsG1VjRqBb3mUfwCIkdAZ_-4MUdtDaSpYWntkwh28oQOaJGH4hVCJXryL08tmDyogDueJBPo6R5NLdT4aqiaX06Vocp6rolmz6VUE8rPQ032-zEUJt79G25iTS4-7TodZGDL9mp5wJAUgeg3X6ILCjXFXmm0oLyShZ4'
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
  const { id, _id, name, category, description, memberCount, patron, coordinator } = society;
  const targetId = _id || id;

  const catLower = category ? category.toLowerCase() : 'default';
  const cardImage = CATEGORY_IMAGES[catLower] || CATEGORY_IMAGES.default;
  const badgeClass = CATEGORY_BADGES[catLower] || CATEGORY_BADGES.default;

  return (
    <article className="bg-white border border-outline-variant/60 overflow-hidden bento-card-premium flex flex-col justify-between h-full rounded-lg shadow-tight group">
      <div>
        <div className="h-48 overflow-hidden relative">
          <img 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" 
            src={cardImage} 
            alt={`${name}`} 
          />
          <div className="absolute top-4 left-4 shadow-sm">
            <span className={`${badgeClass} px-3 py-1 font-label-uppercase text-[9px] tracking-widest rounded-sm uppercase font-bold`}>
              {category || 'General'}
            </span>
          </div>
        </div>
        
        <div className="p-6 pb-0 text-left">
          <h3 className="font-headline-sm text-headline-sm text-primary mb-2 transition-colors group-hover:text-primary-container">
            {name}
          </h3>
          <p className="font-body-sm text-on-surface-variant line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0 text-left">
        <div className="grid grid-cols-2 gap-4 mb-6 border-y border-outline-variant/60 py-4 mt-4">
          <div>
            <p className="font-label-uppercase text-[9px] text-on-surface-variant mb-1 font-semibold tracking-wider">Faculty Patron</p>
            <p className="font-body-sm font-semibold text-on-surface truncate">
              {patron || coordinator || 'Faculty Patron'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-label-uppercase text-[9px] text-on-surface-variant mb-1 font-semibold tracking-wider">MEMBERS</p>
            <p className="font-body-sm font-semibold text-on-surface">
              {memberCount || 0} Active
            </p>
          </div>
        </div>

        <Link 
          to={`/societies/${targetId}`} 
          className="w-full py-3 border border-outline text-primary font-label-uppercase text-label-uppercase hover:bg-primary hover:text-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 font-semibold shadow-tight rounded"
        >
          View Details <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
        </Link>
      </div>
    </article>
  );
}
