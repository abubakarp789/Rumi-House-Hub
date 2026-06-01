import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 md:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Visual Element (Asymmetric Left) */}
        <div className="md:col-span-5 order-2 md:order-1">
          <div className="relative aspect-square border border-outline-variant p-4 bg-white overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
            <img 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
              alt="A sophisticated architectural photograph of a minimalist university corridor with stark shadows and light play." 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdBOtW4414eyU5ShBSuqywW41gvrAXkAu7IRat4nP5j6-ZQDkbWSZ1ZAqqmERgh2bo_V9YgJoil2H1wNuMh2w6xka7lL_HBKoos5FdX7QLQQ7nO0GEr5-gCKRsI8T1ijKWcVXOZ0fFVybBcMfz9sOmUk9KvJfn1dxqmVT7R17Wvr3TWNvo5hU0i0M5E15SYAnJT8Kdty9gpFjovdlJfEeVeT3ZDx5s_pgdrbYmxb1mEUlJPYTHq1tr8RLb9nFY7D-pMoGagpfqckEE" 
            />
            <div className="absolute bottom-4 left-4 bg-primary text-white px-4 py-2 text-xs font-bold uppercase tracking-wider font-label-uppercase">
              STATUS: ACCESS_DENIED
            </div>
          </div>
        </div>

        {/* Content Area (Asymmetric Right) */}
        <div className="md:col-span-6 md:col-start-7 order-1 md:order-2 space-y-6">
          <header>
            <div className="inline-block px-3 py-1 bg-secondary text-on-secondary font-bold text-[10px] tracking-wider uppercase mb-6">
              Entry Restricted
            </div>
            <h1 className="font-display-lg text-4xl md:text-5xl text-primary mb-4 leading-tight">
              404 — <br/>Access Restricted
            </h1>
          </header>
          
          <div className="space-y-4 max-w-lg">
            <p className="font-headline-sm text-lg text-primary font-bold">
              It seems you've wandered into a restricted corridor of the campus portal.
            </p>
            <p className="text-on-surface-variant leading-relaxed text-sm opacity-80">
              The archives you are seeking might have been relocated to a secure repository, or your current credentials do not permit entry to this specific institutional sector. Please verify the URL or consult the administrative dashboard.
            </p>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-4">
            <Link 
              to="/" 
              className="inline-flex items-center justify-center bg-primary text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-primary-container transition-all duration-200 group"
            >
              <span className="material-symbols-outlined mr-2 group-hover:-translate-x-1 transition-transform text-sm">arrow_back</span>
              Return Home
            </Link>
            <button 
              className="inline-flex items-center justify-center border border-outline text-on-surface px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-surface-container-high transition-all duration-200" 
              onClick={() => window.history.back()}
            >
              Previous Corridor
            </button>
          </div>

          {/* Marginalia / Institutional Detail */}
          <div className="pt-10 border-t border-outline-variant/30 flex items-start gap-4 text-on-surface-variant/60">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <div className="text-xs italic leading-relaxed text-on-surface-variant/80">
              Reference Code: NH-ERR-404-RESTRICTED. <br/>
              If you believe this is an error, please contact the Namal University IT Support Desk.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
