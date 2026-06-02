import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api/api';
import LoadingState from '../components/LoadingState';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liveSocietiesCount, setLiveSocietiesCount] = useState(15);
  const [liveEventsCount, setLiveEventsCount] = useState(6);
  const [societies, setSocieties] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);

  // Fallbacks using authentic Namal University data
  const fallbackSocieties = [
    {
      _id: 'featured',
      name: "Namal Literary & Debating Society (LDS)",
      description: "A forum for critical inquiry, debate, poetry recitations, and literary evenings at Namal, keeping academic discourse and creative expression active. Bringing student thought leaders into conversational circles through classical and contemporary literary works.",
      memberCount: 110
    },
    {
      _id: 'computing',
      name: "Namal Computing Society (NCS)",
      description: "Drives competitive coding championships, technical programming sprints, neural network workshops, and tech expos inside the Huawei Lab."
    },
    {
      _id: 'media',
      name: "Namal Media Club (VoN)",
      description: "Captures and logs all university events, providing digital photography courses and editing newsletters."
    },
    {
      _id: 'social',
      name: "Namal Society for Social Impact (NSSI)",
      description: "Champions community welfare, student financial support, blood donation drives, and educational initiatives."
    },
    {
      _id: 'sports',
      name: "Namal Sports & Adventure Club (NSAC)",
      description: "Ensures students participate in physical drills, recreational games on and off campus, and Sports Gala campaigns."
    }
  ];

  const fallbackEvents = [
    {
      _id: 'evt1',
      title: "Namal Sports Gala 2026",
      location: "Namal Sports Facility",
      startDateTime: new Date("2026-06-15T09:00:00"),
      description: "The premier athletic league of Namal University where house teams compete fiercely in athletics, cricket, football, and badminton near Namal Lake.",
      status: "approved"
    },
    {
      _id: 'evt2',
      title: "Blood Donation Drive (Sundas Foundation)",
      location: "Academic Block",
      startDateTime: new Date("2026-06-08T10:00:00"),
      description: "Namal Society for Social Impact in collaboration with Sundas Foundation is organizing a voluntary blood donation drive. Come forward and save a life!",
      status: "approved"
    },
    {
      _id: 'evt3',
      title: "NCS LLM & Generative AI Workshop",
      location: "Huawei Lab",
      startDateTime: new Date("2026-06-05T14:30:00"),
      description: "A comprehensive, hands-on workshop on Large Language Models, prompt engineering, and building agentic AI applications inside the Huawei Lab.",
      status: "approved"
    }
  ];

  const fallbackNews = [
    {
      _id: 'news1',
      title: "Namal University Mianwali Convocation, Class of 2023",
      category: "newsletter",
      summary: "Celebrating the success, perseverance, and achievements of our graduates at the 11th Convocation Ceremony of Namal University.",
      publishedAt: new Date("2024-02-18T10:00:00")
    },
    {
      _id: 'news2',
      title: "Step Into Excellence | Admissions 2026",
      category: "alert",
      summary: "Namal University's undergraduate admissions are officially open. Apply online for BS Computer Science, BS Software Engineering, BS EE, and BBA programs.",
      publishedAt: new Date("2026-05-20T10:00:00")
    },
    {
      _id: 'news3',
      title: "A Step Towards Sustainability | Plantation Drive 2026",
      category: "visit",
      summary: "In collaboration with the Namal Environmental Club, Rumi House successfully planted 500 indigenous saplings in the Salt Range.",
      publishedAt: new Date("2026-03-30T10:00:00")
    },
    {
      _id: 'news4',
      title: "NUST NET (Series-4) Valid for Admission at Namal University",
      category: "alert",
      summary: "Great news for prospective engineering and computing students! Namal University will accept NUST NET Series-4 scores for undergraduate admissions.",
      publishedAt: new Date("2026-05-05T10:00:00")
    }
  ];

  useEffect(() => {
    async function loadDataSummary() {
      try {
        setLoading(true);
        const [socs, evts, nws] = await Promise.all([
          api.getSocieties(),
          api.getEvents('approved'),
          api.getNews()
        ]);
        
        setSocieties(socs || []);
        // Sort events by date ascending
        const sortedEvts = (evts || []).sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
        setEvents(sortedEvts);
        
        // Sort news by publishedAt descending
        const sortedNws = (nws || []).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        setNews(sortedNws);
        
        setLiveSocietiesCount(socs.length || 15);
        setLiveEventsCount(evts.length || 6);
      } catch (err) {
        console.error('MERN API is offline, using static fallback mockup data.', err);
      } finally {
        setLoading(false);
      }
    }
    loadDataSummary();
  }, []);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      monthDay: `${months[d.getMonth()]} ${d.getDate()}`,
      year: d.getFullYear()
    };
  };

  const formatTimeAgo = (dateString) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} Days Ago`;
  };

  // Determine items to display
  const displaySocieties = societies.length > 0 ? societies : fallbackSocieties;
  
  // Find specific societies for bento layout mapping
  const featuredSoc = displaySocieties.find(s => s.name.includes("Literary") || s.name.includes("LDS")) || displaySocieties[0];
  const computingSoc = displaySocieties.find(s => s.name.includes("Computing") || s.name.includes("NCS")) || displaySocieties[1];
  const mediaSoc = displaySocieties.find(s => s.name.includes("Media") || s.name.includes("VoN") || s.name.includes("Arts")) || displaySocieties[2];
  const socialSoc = displaySocieties.find(s => s.name.includes("Social") || s.name.includes("Impact") || s.name.includes("NSSI")) || displaySocieties[3];
  const sportsSoc = displaySocieties.find(s => s.name.includes("Sports") || s.name.includes("NSAC")) || displaySocieties[4];

  const getSocLink = (soc) => {
    return soc && soc._id && soc._id !== 'featured' && soc._id !== 'computing' && soc._id !== 'media' && soc._id !== 'social' && soc._id !== 'sports'
      ? `/societies/${soc._id}` 
      : `/societies`;
  };

  const displayEvents = events.length > 0 ? events.slice(0, 3) : fallbackEvents;
  const displayNews = news.length > 0 ? news : fallbackNews;
  
  const featuredArticle = displayNews[0] || fallbackNews[0];
  const sidebarArticles = displayNews.slice(1, 4).length > 0 ? displayNews.slice(1, 4) : fallbackNews.slice(1, 4);

  return (
    <div className="font-body-md text-on-background antialiased pt-4">
      {/* Hero Section: Asymmetric Composition */}
      <section className="max-w-container-max mx-auto px-margin-desktop py-12 md:py-20 overflow-hidden">
        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-7 flex flex-col justify-center animate-fade-in-up">
            <p className="font-label-uppercase text-label-uppercase text-secondary mb-6 tracking-[0.2em] font-semibold">Institutional Engagement</p>
            <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-primary mb-8 leading-tight">
              Rumi House Hub: Namal's Central Societies Headquarters
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-xl">
              Serving as the official coordination office and creative community hub for all Namal student societies, clubs, and co-curricular programs overlooking Namal Lake.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/societies"
                className="bg-primary text-white px-8 py-3 font-label-uppercase text-label-uppercase transition-all hover:bg-primary-container hover:text-on-primary-container border border-primary text-center shadow-tight hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Explore Societies
              </Link>
              <Link 
                to="/events"
                className="border border-outline text-primary px-8 py-3 font-label-uppercase text-label-uppercase hover:bg-surface-container-low transition-all text-center shadow-tight hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                View Calendar
              </Link>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 relative mt-12 lg:mt-0 animate-fade-in-up animate-delay-200">
            <div className="hero-image-container group">
              <div className="aspect-[4/5] bg-surface border border-outline-variant p-4 relative z-10 overflow-hidden shadow-tight transition-all duration-500 group-hover:border-primary group-hover:shadow-lg">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" 
                  alt="Namal Twilight Campus View"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIZqc0pne6wie6DCyogV3kdRfx7h15pWkYJ6FuAE4MLMfsuBpfaMSazIHIhvNqc6qYWJRVxCFbv3YJw4SjyK6WxFODC0DfLAvSyIcYDp5hh-rnd4nBzHPr6f9MmQUcK3KO-63_boHIavGXGNkD_YDvfgu0vdoy8rXoQ0BwmUGdjcWVi_fcnG0hhRDQR19H-XGvZs0pRx6bhBsMe5A_LxXujXgn0rheSSiRHMb11XOk9c58tYG0xev2ZuGaZK4HVfFLpmn5qYX_vGg_"
                />
                {/* Glassmorphic border pill overlap */}
                <div className="hero-glass-badge px-4 py-2 font-label-uppercase text-label-uppercase text-[10px] text-primary tracking-wider rounded-sm border border-primary/20 flex items-center gap-1.5 shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  Namal Library
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-secondary-container -z-0 opacity-20 blur-sm rounded-full transition-transform duration-500 hover:scale-105"></div>
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
            <h2 className="font-headline-md text-headline-md text-primary mb-2 animate-fade-in-up">Active Societies</h2>
            <p className="text-on-surface-variant font-body-sm animate-fade-in-up animate-delay-100">
              The pillars of our intellectual and social community. We currently have {liveSocietiesCount} active groups.
            </p>
          </div>
          <Link 
            to="/societies" 
            className="text-secondary font-label-uppercase text-label-uppercase hover:underline decoration-2 underline-offset-4 flex items-center gap-2 group transition-colors hover:text-primary animate-fade-in-up animate-delay-100"
          >
            Browse All <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up animate-delay-200">
          {/* Large Card */}
          <Link to={getSocLink(featuredSoc)} className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-white to-surface-warm/30 border border-outline-variant p-8 flex flex-col group cursor-pointer bento-card-premium rounded-lg relative overflow-hidden block">
            {/* Decorative Gold Editorial Accent */}
            <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-gold/30 transition-all duration-300 group-hover:border-gold group-hover:scale-110"></div>
            </div>
            
            <span className="font-label-uppercase text-label-uppercase text-secondary mb-4 tracking-wider font-semibold">Literary Pillar</span>
            <h3 className="font-headline-sm text-headline-sm text-primary mb-6 transition-colors group-hover:text-primary-container">
              {featuredSoc.name}
            </h3>
            <p className="text-on-surface-variant font-body-md mb-8 flex-grow leading-relaxed">
              {featuredSoc.description}
            </p>
            <div className="flex items-center gap-4 border-t border-outline-variant/60 pt-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#ffe08b] flex items-center justify-center text-[9px] font-bold text-on-secondary-fixed transition-transform duration-300 hover:scale-110 hover:z-20 cursor-default shadow-sm hover:shadow-md">ZS</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#abf3bb] flex items-center justify-center text-[9px] font-bold text-on-tertiary-fixed transition-transform duration-300 hover:scale-110 hover:z-20 cursor-default shadow-sm hover:shadow-md">AB</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#dbe2f8] flex items-center justify-center text-[9px] font-bold text-on-surface-variant transition-transform duration-300 hover:scale-110 hover:z-20 cursor-default shadow-sm hover:shadow-md">FK</div>
              </div>
              <span className="text-body-sm text-on-surface-variant font-medium">{featuredSoc.memberCount || 110} Members</span>
            </div>
          </Link>

          {/* Regular Card 1 */}
          <Link to={getSocLink(computingSoc)} className="bg-white border border-outline-variant p-6 bento-card-premium block rounded-lg shadow-tight group">
            <span className="material-symbols-outlined text-primary mb-4 text-3xl icon-hover-rotate inline-block">terminal</span>
            <h4 className="font-headline-sm text-headline-sm text-primary text-lg mb-2 transition-colors group-hover:text-primary-container">{computingSoc.name}</h4>
            <p className="text-on-surface-variant text-body-sm leading-relaxed">{computingSoc.description.slice(0, 95)}...</p>
          </Link>

          {/* Regular Card 2 */}
          <Link to={getSocLink(mediaSoc)} className="bg-white border border-outline-variant p-6 bento-card-premium block rounded-lg shadow-tight group">
            <span className="material-symbols-outlined text-primary mb-4 text-3xl icon-hover-rotate inline-block">brush</span>
            <h4 className="font-headline-sm text-headline-sm text-primary text-lg mb-2 transition-colors group-hover:text-primary-container">{mediaSoc.name}</h4>
            <p className="text-on-surface-variant text-body-sm leading-relaxed">{mediaSoc.description.slice(0, 95)}...</p>
          </Link>

          {/* Regular Card 3 */}
          <Link to={getSocLink(socialSoc)} className="bg-white border border-outline-variant p-6 bento-card-premium block rounded-lg shadow-tight group">
            <span className="material-symbols-outlined text-primary mb-4 text-3xl icon-hover-rotate inline-block">eco</span>
            <h4 className="font-headline-sm text-headline-sm text-primary text-lg mb-2 transition-colors group-hover:text-primary-container">{socialSoc.name}</h4>
            <p className="text-on-surface-variant text-body-sm leading-relaxed">{socialSoc.description.slice(0, 95)}...</p>
          </Link>

          {/* Regular Card 4 */}
          <Link to={getSocLink(sportsSoc)} className="bg-white border border-outline-variant p-6 bento-card-premium block rounded-lg shadow-tight group">
            <span className="material-symbols-outlined text-primary mb-4 text-3xl icon-hover-rotate inline-block">sports_cricket</span>
            <h4 className="font-headline-sm text-headline-sm text-primary text-lg mb-2 transition-colors group-hover:text-primary-container">{sportsSoc.name}</h4>
            <p className="text-on-surface-variant text-body-sm leading-relaxed">{sportsSoc.description.slice(0, 95)}...</p>
          </Link>
        </div>
      </section>

      {/* Upcoming Events: Data Table Style with High Contrast */}
      <section className="bg-surface-container-low py-16 md:py-20 border-y border-outline-variant">
        <div className="max-w-container-max mx-auto px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary mb-4 animate-fade-in-up">Upcoming Events</h2>
                <p className="text-on-surface-variant font-body-md mb-8 animate-fade-in-up animate-delay-100">
                  Mark your calendar for the {liveEventsCount} live events defining this semester.
                </p>
              </div>
              <div className="aspect-square bg-white border border-outline-variant p-2 overflow-hidden shadow-sm group cursor-pointer rounded-lg animate-fade-in-up animate-delay-200">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt="Student Collaboration Mockup"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPfKfTNe2ocWd1ZYEGLoqBDkNwopwVUnQn461Wu9Kf210ptPwj2t1b_QXD3p70uDm63O1D-_sJ6AciMGB_ICDRgBaRN9IHsq-lndJuFHqVIisx7dlbJ6rZqx2Xc5zIazkkge4tcAZz1r5vcL6TBbtJcrJhK_Hp8OHBfPF_1xxJD-F0a2i9D9SpxaAmh9WiPVoukg0UlVMBhAmFjkS2HCe7gFQgjy6rhvRyixUQs1gj1OfccllmZ17L-hGx4bbzN9q3dsZor5a3SreQ"
                />
              </div>
            </div>
            <div className="lg:col-span-8 animate-fade-in-up animate-delay-200">
              <div className="bg-white border border-outline-variant rounded-lg overflow-hidden shadow-tight">
                <div className="grid grid-cols-12 bg-surface-container-high/60 border-b border-outline-variant p-4 font-label-uppercase text-label-uppercase text-primary font-semibold">
                  <div className="col-span-3 md:col-span-2">Date</div>
                  <div className="col-span-6 md:col-span-7">Event Narrative</div>
                  <div className="col-span-3 text-right">Status</div>
                </div>

                {displayEvents.map((evt) => {
                  const { monthDay, year } = formatDate(evt.startDateTime);
                  const eventLink = evt._id && !evt._id.startsWith('evt') ? `/events/${evt._id}` : `/events`;
                  const isPast = new Date(evt.startDateTime) < new Date();
                  const rsvpText = isPast ? 'Past Event' : 'RSVP Open';
                  const badgeColor = isPast 
                    ? 'bg-on-surface-variant/10 text-on-surface-variant border-on-surface-variant/20' 
                    : evt.type === 'sports' 
                      ? 'bg-secondary/10 text-secondary border-secondary/20'
                      : 'bg-tertiary/10 text-tertiary border-tertiary/20';

                  return (
                    <Link key={evt._id} to={eventLink} className="grid grid-cols-12 p-6 border-b border-outline-variant hover:bg-surface-container-lowest transition-colors items-center group event-row-premium">
                      <div className="col-span-3 md:col-span-2 transition-transform group-hover:translate-x-1.5 duration-300">
                        <span className="block font-bold text-primary">{monthDay}</span>
                        <span className="text-xs text-on-surface-variant font-medium">{year}</span>
                      </div>
                      <div className="col-span-6 md:col-span-7 transition-transform group-hover:translate-x-1.5 duration-300">
                        <h5 className="font-bold text-primary text-body-lg group-hover:text-primary-container transition-colors">{evt.title}</h5>
                        <p className="text-on-surface-variant text-body-sm mt-1">{evt.description}</p>
                        <div className="text-[10px] text-primary/70 font-semibold uppercase tracking-wider mt-1.5 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-xs">location_on</span> {evt.location}
                        </div>
                      </div>
                      <div className="col-span-3 text-right flex items-center justify-end gap-2 transition-transform group-hover:-translate-x-1 duration-300">
                        <span className={`px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider shadow-sm ${badgeColor}`}>{rsvpText}</span>
                        <span className="material-symbols-outlined text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">chevron_right</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus News: Editorial Layout */}
      <section className="max-w-container-max mx-auto px-margin-desktop py-16 md:py-20">
        <h2 className="font-headline-md text-headline-md text-primary mb-12 border-l-4 border-secondary pl-6 animate-fade-in-up">Campus News</h2>
        <div className="grid grid-cols-12 gap-gutter">
          {/* Featured Article */}
          <article className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 bg-white border border-outline-variant overflow-hidden rounded-lg shadow-tight news-card-premium group cursor-pointer animate-fade-in-up animate-delay-100">
            <div className="h-64 md:h-auto overflow-hidden">
              <img 
                className="w-full h-full object-cover news-image-zoom" 
                alt="Namal Twilight Campus View"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5TAJP-TNMW6xQV-A4k9730zX2t288n0gTzgY0M30OtFfazFQcFF4mSI1iwE9LDY-UrkYfCjKsssOWYsZpz7Aac9WM02gf1UiumgfYyIMO4GVpAcdXjpDbSmH1WZwNR9LPzBWvAODBH9Z03yfuTNt6eRb01sLxgYeB8jbMd9_YLgQHCZQDENGUMG0Eui-Nv1mSMPgwbHaqN-WJAq5MPhVYAj3lhBTYREnpfzuxPUf_soX_m7iNwxFa9ksoDqrILgkFW7qOOceGDdYp"
              />
            </div>
            <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-white to-surface-warm/20">
              <span className="font-label-uppercase text-label-uppercase text-secondary mb-4 tracking-wider font-semibold">Strategic Vision</span>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-6 transition-colors group-hover:text-primary-container">
                {featuredArticle.title}
              </h3>
              <p className="text-on-surface-variant font-body-md mb-6 leading-relaxed">
                {featuredArticle.summary}
              </p>
              <Link to={featuredArticle._id && !featuredArticle._id.startsWith('news') ? `/news/${featuredArticle._id}` : `/news`} className="text-primary font-bold hover:text-primary-container flex items-center gap-1 group/link transition-colors">
                Read the full report <span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">arrow_forward</span>
              </Link>
            </div>
          </article>
          
          {/* Sidebar News */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 animate-fade-in-up animate-delay-200">
            {sidebarArticles.map((art) => {
              const artLink = art._id && !art._id.startsWith('news') ? `/news/${art._id}` : `/news`;
              return (
                <Link key={art._id} to={artLink} className="p-6 bg-white border border-outline-variant border-l-4 border-l-primary rounded-lg shadow-tight group cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 block">
                  <span className="text-xs font-bold text-on-surface-variant opacity-60 uppercase mb-2 block tracking-wider">
                    {formatTimeAgo(art.publishedAt)}
                  </span>
                  <h4 className="font-bold text-primary mb-2 transition-colors group-hover:text-primary-container">{art.title}</h4>
                  <p className="text-body-sm text-on-surface-variant line-clamp-2 leading-relaxed">{art.summary}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
