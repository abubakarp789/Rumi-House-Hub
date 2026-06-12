import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';

export default function Forbidden() {
  return (
    <section className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 md:px-8">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Visual Element (Asymmetric Left) */}
        <div className="md:col-span-5 order-2 md:order-1">
          <div className="relative aspect-square border border-outline-variant p-4 bg-white overflow-hidden group flex items-center justify-center">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
            <div className="w-full h-full flex items-center justify-center p-8 bg-surface-container-low">
              <img 
                className="max-w-[70%] max-h-[70%] object-contain transition-transform duration-1000 group-hover:scale-105" 
                alt="Namal Logo" 
                src={logoImg}
              />
            </div>
            <div className="absolute bottom-4 left-4 bg-error text-white px-4 py-2 text-xs font-bold uppercase tracking-wider font-label-uppercase">
              STATUS: ACCESS_FORBIDDEN
            </div>
          </div>
        </div>

        {/* Content Area (Asymmetric Right) */}
        <div className="md:col-span-6 md:col-start-7 order-1 md:order-2 space-y-6">
          <header>
            <div className="inline-block px-3 py-1 bg-error text-white font-bold text-[10px] tracking-wider uppercase mb-6">
              Access Restricted
            </div>
            <h1 className="font-display-lg text-4xl md:text-5xl text-primary mb-4 leading-tight">
              403 — <br/>Forbidden Corridor
            </h1>
          </header>
          
          <div className="space-y-4 max-w-lg">
            <p className="font-headline-sm text-lg text-primary font-bold">
              Your institutional credentials do not authorize access to this portal sector.
            </p>
            <p className="text-on-surface-variant leading-relaxed text-sm opacity-80">
              This area is reserved for authorized administrators or executive members. If you believe your role has been assigned incorrectly, please contact the Namal University co-curricular registry or return to your assigned dashboard.
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
            <span className="material-symbols-outlined text-sm text-error" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <div className="text-xs italic leading-relaxed text-on-surface-variant/80">
              Reference Code: NH-ERR-403-FORBIDDEN. <br/>
              Access attempts to this sector are logged for administrative audit.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
