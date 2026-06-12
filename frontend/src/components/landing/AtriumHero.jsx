import React, { Suspense, lazy, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import academicBlockImage from '../../assets/landing/namal-academic-block-display.jpg';
import crestImage from '../../assets/landing/rumi-house-hub-crest-display.png';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { supportsWebGL } from '../../utils/webgl';

const AtriumScene = lazy(() => import('./AtriumScene'));

export default function AtriumHero({ societyCount, eventCount }) {
  const rootRef = useRef(null);
  const [sceneReady, setSceneReady] = useState(false);
  const reducedMotion = useReducedMotion();
  const webglAvailable = useMemo(() => supportsWebGL(), []);
  const canRenderScene = !reducedMotion && webglAvailable;

  useGSAP(() => {
    if (reducedMotion) return;
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
    timeline
      .from('.atrium-hero__eyebrow', { opacity: 0, y: 18, duration: 0.55 })
      .from('.atrium-hero__title-line', { opacity: 0, yPercent: 110, duration: 0.85, stagger: 0.09 }, '-=0.25')
      .from('.atrium-hero__intro, .atrium-hero__actions', { opacity: 0, y: 22, duration: 0.65, stagger: 0.08 }, '-=0.45')
      .from('.atrium-hero__visual', { opacity: 0, scale: 0.96, duration: 1 }, '-=0.7')
      .from('.atrium-hero__metric', { opacity: 0, y: 14, duration: 0.45, stagger: 0.08 }, '-=0.45');
  }, { scope: rootRef, dependencies: [reducedMotion] });

  return (
    <section ref={rootRef} className={`atrium-hero${sceneReady ? ' atrium-hero--scene-ready' : ''}`} aria-labelledby="atrium-title">
      <div className="atrium-hero__glow" aria-hidden="true" />
      <div className="landing-container atrium-hero__grid">
        <div className="atrium-hero__content">
          <div className="atrium-hero__eyebrow">
            <img src={crestImage} alt="" aria-hidden="true" />
            <span>Rumi House Hub · Namal University</span>
          </div>
          <h1 id="atrium-title" className="atrium-hero__title">
            <span className="atrium-hero__title-mask"><span className="atrium-hero__title-line">Namal&apos;s Central</span></span>{' '}
            <span className="atrium-hero__title-mask"><span className="atrium-hero__title-line atrium-hero__title-line--gold">Societies Headquarters</span></span>
          </h1>
          <p className="atrium-hero__intro">
            A single home for every student society, campus event, and shared idea. Discover where Namal&apos;s communities meet, create, and lead.
          </p>
          <div className="atrium-hero__actions">
            <Link className="landing-button landing-button--gold" to="/societies">Explore Societies <span aria-hidden="true">↗</span></Link>
            <Link className="landing-button landing-button--ghost" to="/events">View Calendar <span aria-hidden="true">→</span></Link>
          </div>
          <dl className="atrium-hero__metrics" aria-label="Rumi House Hub activity">
            <div className="atrium-hero__metric"><dt>Active societies</dt><dd>{societyCount}</dd></div>
            <div className="atrium-hero__metric"><dt>Upcoming events</dt><dd>{eventCount}</dd></div>
            <div className="atrium-hero__metric"><dt>One student hub</dt><dd>∞</dd></div>
          </dl>
        </div>

        <div className="atrium-hero__visual" aria-label="Namal University academic block">
          <div className="atrium-hero__photo-card">
            <img src={academicBlockImage} alt="Namal Academic Block under a blue sky" />
            <span>Namal University · Mianwali</span>
          </div>
          <div className="atrium-hero__static-portal" aria-hidden="true">
            <div className="atrium-hero__static-portal-inner" />
          </div>
          {canRenderScene ? (
            <Suspense fallback={null}>
              <div className="atrium-hero__scene" data-testid="atrium-scene" aria-hidden="true">
                <AtriumScene onReady={() => setSceneReady(true)} />
              </div>
            </Suspense>
          ) : null}
          <p className="atrium-hero__visual-note">A digital atrium for campus life</p>
        </div>
      </div>
      <div className="atrium-hero__marquee" aria-hidden="true">
        <div>Societies · Events · Leadership · Creativity · Service · Sport · Societies · Events · Leadership · Creativity · Service · Sport ·</div>
      </div>
    </section>
  );
}
