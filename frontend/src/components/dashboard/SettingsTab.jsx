import React from 'react';

export default function SettingsTab() {
  return (
    <div className="max-w-2xl mx-auto py-4 animate-fade-in">
      <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-lg shadow-sm">
        <h2 className="font-headline-sm text-2xl text-emerald-950 font-serif font-bold border-b border-slate-100 pb-4 mb-6">
          Portal System Configurations
        </h2>
        
        <div className="space-y-6 text-sm text-slate-600">
          <div className="flex justify-between items-start py-4 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-800 font-serif text-base">Mandatory Email Domain Verification</h4>
              <p className="text-xs text-slate-500 mt-1">
                Restrict student registrations exclusively to <code>@namal.edu.pk</code> addresses to preserve campus database security.
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Active
            </span>
          </div>

          <div className="flex justify-between items-start py-4 border-b border-slate-100">
            <div>
              <h4 className="font-bold text-slate-800 font-serif text-base">6-Digit Manual Fallback Tokens</h4>
              <p className="text-xs text-slate-500 mt-1">
                Allow campus house executives to verify event check-in entries manually via alphanumeric code tokens.
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Active
            </span>
          </div>

          <div className="flex justify-between items-start py-4">
            <div>
              <h4 className="font-bold text-slate-800 font-serif text-base">Protected Administrative Console</h4>
              <p className="text-xs text-slate-500 mt-1">
                Encrypt and restrict executive and super-admin registrations through formal council invitation desk exclusively.
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Active
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs leading-relaxed text-slate-500 mt-8 font-mono">
          Academic governance configurations are protected via hardcoded administrative parameters in the MERN boundary layer to guarantee secure co-curricular operations.
        </div>
      </div>
    </div>
  );
}
