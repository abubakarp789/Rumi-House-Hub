import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api/api';
import LoadingState from '../components/LoadingState';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liveSocietiesCount, setLiveSocietiesCount] = useState(6);
  const [liveEventsCount, setLiveEventsCount] = useState(3);

  useEffect(() => {
    async function loadDataSummary() {
      try {
        setLoading(true);
        const [socs, evts] = await Promise.all([
          api.getSocieties(),
          api.getEvents('approved')
        ]);
        setLiveSocietiesCount(socs.length || 6);
        setLiveEventsCount(evts.length || 3);
      } catch (err) {
        console.error('MERN API is offline, using static fallback mockup data.', err);
      } finally {
        setLoading(false);
      }
    }
    loadDataSummary();
  }, []);

  return (
    <div className="font-body-md text-on-background antialiased pt-4">
      {/* Hero Section: Asymmetric Composition */}
      <section className="max-w-container-max mx-auto px-margin-desktop py-12 md:py-20">
        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center">
            <p className="font-label-uppercase text-label-uppercase text-secondary mb-6 tracking-[0.2em]">Institutional Engagement</p>
            <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-primary mb-8 leading-tight">
              Rumi House Hub: Your Gateway to Campus Engagement at Namal University.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
              A centralized digital landscape designed to foster collaboration, scholarship, and community spirit across our historic campus grounds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/societies"
                className="bg-primary text-white px-8 py-3 font-label-uppercase text-label-uppercase transition-all hover:bg-primary-container hover:text-on-primary-container border border-primary text-center"
              >
                Explore Societies
              </Link>
              <Link 
                to="/events"
                className="border border-outline text-primary px-8 py-3 font-label-uppercase text-label-uppercase hover:bg-surface-container-low transition-all text-center"
              >
                View Calendar
              </Link>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 relative mt-12 lg:mt-0">
            <div className="aspect-[4/5] bg-surface border border-outline-variant p-4 relative z-10">
              <img 
                className="w-full h-full object-cover" 
                alt="Namal Gothic Library Mockup"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIZqc0pne6wie6DCyogV3kdRfx7h15pWkYJ6FuAE4MLMfsuBpfaMSazIHIhvNqc6qYWJRVxCFbv3YJw4SjyK6WxFODC0DfLAvSyIcYDp5hh-rnd4nBzHPr6f9MmQUcK3KO-63_boHIavGXGNkD_YDvfgu0vdoy8rXoQ0BwmUGdjcWVi_fcnG0hhRDQR19H-XGvZs0pRx6bhBsMe5A_LxXujXgn0rheSSiRHMb11XOk9c58tYG0xev2ZuGaZK4HVfFLpmn5qYX_vGg_"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-secondary-container -z-0 opacity-20"></div>
          </div>
        </div>
      </section>

      <div className="max-w-container-max mx-auto px-margin-desktop py-8">
        <div className="editorial-line"></div>
      </div>

      {/* Active Societies: Bento Grid Style */}
      <section className="max-w-container-max mx-auto px-margin-desktop py-12 md:py-16">
        <div className="flex justify-between items-end mb-12 border-b border-outline-variant pb-6">
          <div>
            <h2 className="font-headline-md text-headline-md text-primary mb-2">Active Societies</h2>
            <p className="text-on-surface-variant font-body-sm">
              The pillars of our intellectual and social community. We currently have {liveSocietiesCount} active groups.
            </p>
          </div>
          <Link 
            to="/societies" 
            className="text-secondary font-label-uppercase text-label-uppercase hover:underline decoration-2 underline-offset-4 flex items-center gap-2"
          >
            Browse All <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Large Card */}
          <div className="md:col-span-2 md:row-span-2 bg-white border border-outline-variant p-8 flex flex-col group cursor-pointer transition-colors hover:border-primary">
            <span className="font-label-uppercase text-label-uppercase text-secondary mb-4">Literary Pillar</span>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-6 group-hover:text-primary-container transition-colors">
              Rumi Literary Society
            </h3>
            <p className="text-on-surface-variant font-body-md mb-8 flex-grow">
              A forum for critical inquiry, debate, poetry recitations, and literary evenings at Namal, keeping academic discourse and creative expression active. Bringing student thought leaders into conversational circles through classical and contemporary literary works.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#ffe08b] flex items-center justify-center text-[9px] font-bold text-on-secondary-fixed">ZS</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#abf3bb] flex items-center justify-center text-[9px] font-bold text-on-tertiary-fixed">AB</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#dbe2f8] flex items-center justify-center text-[9px] font-bold text-on-surface-variant">FK</div>
              </div>
              <span className="text-body-sm text-on-surface-variant font-medium">124 Members</span>
            </div>
          </div>

          {/* Regular Card 1 */}
          <Link to="/societies" className="bg-white border border-outline-variant p-6 transition-colors hover:border-primary block">
            <span className="material-symbols-outlined text-primary mb-4 text-3xl">terminal</span>
            <h4 className="font-headline-sm text-headline-sm text-primary text-lg mb-2">Namal Computing Society</h4>
            <p className="text-on-surface-variant text-body-sm">Innovating through coding competitions, hackathons, and hardware design workshops.</p>
          </Link>

          {/* Regular Card 2 */}
          <Link to="/societies" className="bg-white border border-outline-variant p-6 transition-colors hover:border-primary block">
            <span className="material-symbols-outlined text-primary mb-4 text-3xl">brush</span>
            <h4 className="font-headline-sm text-headline-sm text-primary text-lg mb-2">Namal Arts & Media Society</h4>
            <p className="text-on-surface-variant text-body-sm">Capturing the aesthetic essence of campus life through traditional decor and digital media.</p>
          </Link>

          {/* Regular Card 3 */}
          <Link to="/societies" className="bg-white border border-outline-variant p-6 transition-colors hover:border-primary block">
            <span className="material-symbols-outlined text-primary mb-4 text-3xl">eco</span>
            <h4 className="font-headline-sm text-headline-sm text-primary text-lg mb-2">Social Welfare Society</h4>
            <p className="text-on-surface-variant text-body-sm">Pioneering sustainable outreach, blood drives, and charity drives across the university.</p>
          </Link>

          {/* Regular Card 4 */}
          <Link to="/societies" className="bg-white border border-outline-variant p-6 transition-colors hover:border-primary block">
            <span className="material-symbols-outlined text-primary mb-4 text-3xl">sports_cricket</span>
            <h4 className="font-headline-sm text-headline-sm text-primary text-lg mb-2">Namal Sports Society</h4>
            <p className="text-on-surface-variant text-body-sm">Competitive excellence, physical wellness, and athletic sportsmanship in the heart of Namal.</p>
          </Link>
        </div>
      </section>

      {/* Upcoming Events: Data Table Style with High Contrast */}
      <section className="bg-surface-container-low py-16 md:py-20 border-y border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-4">
              <h2 className="font-headline-md text-headline-md text-primary mb-4">Upcoming Events</h2>
              <p className="text-on-surface-variant font-body-md mb-8">
                Mark your calendar for the {liveEventsCount} live events defining this semester.
              </p>
              <div className="aspect-square bg-white border border-outline-variant p-2 overflow-hidden shadow-sm">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Student Collaboration Mockup"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPfKfTNe2ocWd1ZYEGLoqBDkNwopwVUnQn461Wu9Kf210ptPwj2t1b_QXD3p70uDm63O1D-_sJ6AciMGB_ICDRgBaRN9IHsq-lndJuFHqVIisx7dlbJ6rZqx2Xc5zIazkkge4tcAZz1r5vcL6TBbtJcrJhK_Hp8OHBfPF_1xxJD-F0a2i9D9SpxaAmh9WiPVoukg0UlVMBhAmFjkS2HCe7gFQgjy6rhvRyixUQs1gj1OfccllmZ17L-hGx4bbzN9q3dsZor5a3SreQ"
                />
              </div>
            </div>
            <div className="lg:col-span-8">
              <div className="bg-white border border-outline-variant">
                <div className="grid grid-cols-12 bg-surface-container-high border-b border-outline-variant p-4 font-label-uppercase text-label-uppercase text-primary">
                  <div className="col-span-3 md:col-span-2">Date</div>
                  <div className="col-span-6 md:col-span-7">Event Narrative</div>
                  <div className="col-span-3 text-right">Status</div>
                </div>

                {/* Row 1 */}
                <Link to="/events" className="grid grid-cols-12 p-6 border-b border-outline-variant hover:bg-surface transition-colors items-center group">
                  <div className="col-span-3 md:col-span-2">
                    <span className="block font-bold text-primary">OCT 14</span>
                    <span className="text-xs text-on-surface-variant">2026</span>
                  </div>
                  <div className="col-span-6 md:col-span-7">
                    <h5 className="font-bold text-primary text-body-lg group-hover:text-primary-container">AI & Web Development Workshop</h5>
                    <p className="text-on-surface-variant text-body-sm">Hands-on technical workshop hosted by Namal Computing Society in CS Lab 3.</p>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="px-3 py-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold rounded-sm uppercase tracking-wider">RSVP Open</span>
                  </div>
                </Link>

                {/* Row 2 */}
                <Link to="/events" className="grid grid-cols-12 p-6 border-b border-outline-variant hover:bg-surface transition-colors items-center group">
                  <div className="col-span-3 md:col-span-2">
                    <span className="block font-bold text-primary">OCT 18</span>
                    <span className="text-xs text-on-surface-variant">2026</span>
                  </div>
                  <div className="col-span-6 md:col-span-7">
                    <h5 className="font-bold text-primary text-body-lg group-hover:text-primary-container">Inter-Society Coding Competition</h5>
                    <p className="text-on-surface-variant text-body-sm">Algorithmic speed challenge hosted by Namal Computing Society in the Central Hall.</p>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-sm uppercase tracking-wider">Limited Capacity</span>
                  </div>
                </Link>

                {/* Row 3 */}
                <Link to="/events" className="grid grid-cols-12 p-6 hover:bg-surface transition-colors items-center group">
                  <div className="col-span-3 md:col-span-2">
                    <span className="block font-bold text-primary">OCT 22</span>
                    <span className="text-xs text-on-surface-variant">2026</span>
                  </div>
                  <div className="col-span-6 md:col-span-7">
                    <h5 className="font-bold text-primary text-body-lg group-hover:text-primary-container">Rumi Literary Evening</h5>
                    <p className="text-on-surface-variant text-body-sm">Annual poetry declamation and classical ghazal evening in the main auditorium.</p>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="px-3 py-1 bg-outline-variant text-on-surface-variant text-[10px] font-bold rounded-sm uppercase tracking-wider">Members Only</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus News: Editorial Layout */}
      <section className="max-w-container-max mx-auto px-margin-desktop py-16 md:py-20">
        <h2 className="font-headline-md text-headline-md text-primary mb-12 border-l-4 border-secondary pl-6">Campus News</h2>
        <div className="grid grid-cols-12 gap-gutter">
          {/* Featured Article */}
          <article className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 bg-white border border-outline-variant overflow-hidden">
            <div className="h-64 md:h-auto">
              <img 
                className="w-full h-full object-cover" 
                alt="Namal Twilight Campus View Mockup"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5TAJP-TNMW6xQV-A4k9730zX2t288n0gTzgY0M30OtFfazFQcFF4mSI1iwE9LDY-UrkYfCjKsssOWYsZpz7Aac9WM02gf1UiumgfYyIMO4GVpAcdXjpDbSmH1WZwNR9LPzBWvAODBH9Z03yfuTNt6eRb01sLxgYeB8jbMd9_YLgQHCZQDENGUMG0Eui-Nv1mSMPgwbHaqN-WJAq5MPhVYAj3lhBTYREnpfzuxPUf_soX_m7iNwxFa9ksoDqrILgkFW7qOOceGDdYp"
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <span className="font-label-uppercase text-label-uppercase text-secondary mb-4">Strategic Vision</span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-6">Namal 2030: The Digital Transformation Roadmap</h3>
              <p className="text-on-surface-variant font-body-md mb-6 leading-relaxed">
                The Board of Governors has officially unveiled the infrastructure plan to integrate advanced AI labs into the Rumi House research wing.
              </p>
              <Link to="/news" className="text-primary font-bold hover:underline">Read the full report →</Link>
            </div>
          </article>
          
          {/* Sidebar News */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <article className="p-6 bg-white border border-outline-variant border-l-4 border-l-primary">
              <span className="text-xs font-bold text-on-surface-variant opacity-60 uppercase mb-2 block">2 Hours Ago</span>
              <h4 className="font-bold text-primary mb-2">Society Elections: Phase 1 Results Announced</h4>
              <p className="text-body-sm text-on-surface-variant line-clamp-2">The Electoral Commission has verified the votes for the following society leadership positions...</p>
            </article>
            <article className="p-6 bg-white border border-outline-variant border-l-4 border-l-secondary">
              <span className="text-xs font-bold text-on-surface-variant opacity-60 uppercase mb-2 block">Yesterday</span>
              <h4 className="font-bold text-primary mb-2">Campus Maintenance: East Wing Access</h4>
              <p className="text-body-sm text-on-surface-variant line-clamp-2">Scheduled maintenance for the high-performance computing cluster will begin on Monday...</p>
            </article>
            <article className="p-6 bg-white border border-outline-variant border-l-4 border-l-primary">
              <span className="text-xs font-bold text-on-surface-variant opacity-60 uppercase mb-2 block">2 Days Ago</span>
              <h4 className="font-bold text-primary mb-2">Faculty Spotlight: Dr. Sarah Khan</h4>
              <p className="text-body-sm text-on-surface-variant line-clamp-2">Exploring the recent breakthrough in sustainable water filtration systems published in Nature.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
