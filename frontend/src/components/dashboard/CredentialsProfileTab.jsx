import React from 'react';

export default function CredentialsProfileTab({ user }) {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-white border border-outline-variant p-8 md:p-10 shadow-sm">
        <h2 className="font-headline-sm text-headline-sm text-primary font-bold border-b border-outline-variant pb-4 mb-6">
          Executive Profile Credentials
        </h2>
        
        <div className="space-y-4 text-sm text-on-surface-variant">
          <div className="grid grid-cols-3 py-3 border-b border-outline-variant/40">
            <span className="font-bold">Executive Bearer</span>
            <span className="col-span-2 text-on-surface font-semibold">{user.name}</span>
          </div>
          <div className="grid grid-cols-3 py-3 border-b border-outline-variant/40">
            <span className="font-bold">Institutional Email</span>
            <span className="col-span-2 text-on-surface font-mono">{user.email}</span>
          </div>
          <div className="grid grid-cols-3 py-3 border-b border-outline-variant/40">
            <span className="font-bold">Registration ID</span>
            <span className="col-span-2 text-on-surface font-mono">{user.registrationNumber}</span>
          </div>
          <div className="grid grid-cols-3 py-3 border-b border-outline-variant/40">
            <span className="font-bold">Department Office</span>
            <span className="col-span-2 text-on-surface font-semibold">{user.department}</span>
          </div>
          <div className="grid grid-cols-3 py-3">
            <span className="font-bold">Desk Clearance</span>
            <span className="col-span-2">
              <span className="bg-primary/10 text-primary font-bold text-[10px] px-3 py-1 border border-primary/20 rounded uppercase">
                Executive Authority
              </span>
            </span>
          </div>
        </div>

        <div className="p-4 bg-surface-container-low border border-outline-variant/60 rounded text-xs leading-relaxed text-on-surface-variant mt-8">
          Your executive privileges have been formally cleared and assigned by the Namal University IT Council. Contact Admin if you require society reassignments.
        </div>
      </div>
    </div>
  );
}
