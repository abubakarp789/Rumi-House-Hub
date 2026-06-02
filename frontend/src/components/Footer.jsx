import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-surface-container-highest to-surface border-t border-outline-variant/60 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-margin-desktop py-margin-tablet max-w-container-max mx-auto">
        <div className="col-span-1 md:col-span-1 animate-fade-in-up">
          <div className="font-headline-sm text-headline-sm text-primary mb-6">Rumi House Hub</div>
          <p className="text-on-surface-variant font-body-sm leading-relaxed">
            An Institutional Engagement Portal facilitating student agency and academic excellence at Namal University.
          </p>
        </div>
        <div className="animate-fade-in-up animate-delay-100">
          <h6 className="font-label-uppercase text-label-uppercase text-primary mb-6 font-semibold">Institutional Info</h6>
          <ul className="space-y-3">
            <li><span className="text-on-surface-variant hover:text-primary transition-all duration-300 hover:translate-x-1 text-body-sm block cursor-pointer">About Namal</span></li>
            <li><span className="text-on-surface-variant hover:text-primary transition-all duration-300 hover:translate-x-1 text-body-sm block cursor-pointer">Governance</span></li>
            <li><span className="text-on-surface-variant hover:text-primary transition-all duration-300 hover:translate-x-1 text-body-sm block cursor-pointer">Accreditation</span></li>
          </ul>
        </div>
        <div className="animate-fade-in-up animate-delay-100">
          <h6 className="font-label-uppercase text-label-uppercase text-primary mb-6 font-semibold">Quick Links</h6>
          <ul className="space-y-3">
            <li><Link className="text-on-surface-variant hover:text-primary transition-all duration-300 hover:translate-x-1 text-body-sm block" to="/events">Event Calendar</Link></li>
            <li><Link className="text-on-surface-variant hover:text-primary transition-all duration-300 hover:translate-x-1 text-body-sm block" to="/societies">Society Directory</Link></li>
            <li><span className="text-on-surface-variant hover:text-primary transition-all duration-300 hover:translate-x-1 text-body-sm block cursor-pointer">Campus Map</span></li>
          </ul>
        </div>
        <div className="animate-fade-in-up animate-delay-200">
          <h6 className="font-label-uppercase text-label-uppercase text-primary mb-6 font-semibold">Engagement</h6>
          <ul className="space-y-3">
            <li><span className="text-on-surface-variant hover:text-primary transition-all duration-300 hover:translate-x-1 text-body-sm block cursor-pointer">Privacy Policy</span></li>
            <li><span className="text-on-surface-variant hover:text-primary transition-all duration-300 hover:translate-x-1 text-body-sm block cursor-pointer">Contact Details</span></li>
            <li><span className="text-on-surface-variant hover:text-primary transition-all duration-300 hover:translate-x-1 text-body-sm block cursor-pointer">Social Media</span></li>
          </ul>
        </div>
      </div>
      <div className="max-w-container-max mx-auto px-margin-desktop py-8 border-t border-outline-variant flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-on-surface-variant font-body-sm text-center md:text-left">© {new Date().getFullYear()} Namal University. All rights reserved. An Institutional Engagement Portal.</p>
        <div className="flex gap-6 text-primary">
          <span className="material-symbols-outlined cursor-pointer hover:opacity-70 transition-opacity">school</span>
          <span className="material-symbols-outlined cursor-pointer hover:opacity-70 transition-opacity">public</span>
          <span className="material-symbols-outlined cursor-pointer hover:opacity-70 transition-opacity">description</span>
        </div>
      </div>
    </footer>
  );
}
