# Rumi Atrium Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Replace the public home page with the approved Rumi Atrium design using authentic Namal assets, a lazy Three.js portal, scoped GSAP motion, and responsive editorial content while preserving routes and API behavior.

**Architecture:** Keep Home.jsx as the data-orchestration boundary, extract deterministic fallback and formatting logic into testable modules, and split presentation into focused landing components. Render semantic content and authentic photography immediately, then progressively enhance the hero with a dynamically imported React Three Fiber scene; scope every GSAP effect to its component and disable it for reduced motion.

**Tech Stack:** React 18, React Router 6, Vite 5, Three.js, React Three Fiber 8, Drei 9, GSAP 3, @gsap/react, Vitest 2, React Testing Library, CSS.

---

## File Map

### Create

- frontend/.eslintrc.cjs - React/Vite lint configuration.
- frontend/src/test/setup.js - shared test setup.
- frontend/src/data/homeFallbacks.js - authentic fallback societies, events, and news.
- frontend/src/utils/homeContent.js - normalization, dates, and entity links.
- frontend/src/utils/homeContent.test.js - utility tests.
- frontend/src/hooks/useReducedMotion.js - reactive media-query hook.
- frontend/src/hooks/useReducedMotion.test.jsx - reduced-motion tests.
- frontend/src/utils/webgl.js - WebGL capability probe.
- frontend/src/utils/webgl.test.js - capability tests.
- frontend/src/components/landing/LandingSectionHeading.jsx - numbered section heading.
- frontend/src/components/landing/PortalModel.jsx - generated arch geometry.
- frontend/src/components/landing/AtriumScene.jsx - Three.js canvas.
- frontend/src/components/landing/AtriumHero.jsx - semantic hero and lazy scene.
- frontend/src/components/landing/AtriumHero.test.jsx - hero tests.
- frontend/src/components/landing/SocietiesExhibition.jsx - society display.
- frontend/src/components/landing/EventsFeature.jsx - event display.
- frontend/src/components/landing/NewsEditorial.jsx - news display.
- frontend/src/components/landing/LandingSections.test.jsx - section tests.
- frontend/src/pages/Home.test.jsx - API success/fallback tests.
- frontend/src/components/Navbar.test.jsx - navigation tests.
- frontend/src/components/Footer.test.jsx - footer tests.
- frontend/src/styles/landing.css - approved visual system.

### Modify

- frontend/package.json and package-lock.json - dependencies and scripts.
- frontend/vite.config.js - Vitest and vendor chunks.
- frontend/src/main.jsx - import landing styles.
- frontend/src/pages/Home.jsx - data loading and composition only.
- frontend/src/components/Navbar.jsx - supplied crest and refined mobile menu.
- frontend/src/components/Footer.jsx - institutional footer and authentic image.
- frontend/src/components/PublicLayout.jsx - full-width public shell.
- frontend/src/styles/global.css - remove obsolete landing rules and generic main conflict.

### Existing Approved Assets

- frontend/src/assets/landing/rumi-house-hub-crest.png
- frontend/src/assets/landing/namal-academic-block.png
- frontend/src/assets/landing/namal-courtyard.png
- docs/superpowers/specs/assets/rumi-atrium-approved.png

---

### Task 1: Install Compatible Tooling and Establish the Test Baseline

**Files:**
- Modify: frontend/package.json
- Modify: frontend/package-lock.json
- Modify: frontend/vite.config.js
- Create: frontend/.eslintrc.cjs
- Create: frontend/src/test/setup.js

- [ ] **Step 1: Install React 18-compatible runtime dependencies**

Run from frontend:

~~~powershell
npm install three@0.184.0 @react-three/fiber@8.18.0 @react-three/drei@9.122.0 gsap@3.15.0 @gsap/react@2.1.2
~~~

Expected: React remains at 18.3.1 and npm reports no peer conflict for Fiber or Drei.

- [ ] **Step 2: Install tests and linting**

~~~powershell
npm install -D vitest@2.1.9 jsdom@25.0.1 @testing-library/react@16.3.0 @testing-library/jest-dom@6.9.1 @testing-library/user-event@14.6.1 eslint@8.57.1 eslint-plugin-react@7.37.5 eslint-plugin-react-hooks@4.6.2 eslint-plugin-react-refresh@0.4.20
~~~

- [ ] **Step 3: Add package scripts**

Use this scripts object:

~~~json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
  "test": "vitest run",
  "test:watch": "vitest",
  "preview": "vite preview"
}
~~~

- [ ] **Step 4: Configure Vitest and stable vendor chunks**

Replace frontend/vite.config.js:

~~~js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          motion: ['gsap', '@gsap/react']
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: true,
    passWithNoTests: true
  }
});
~~~

- [ ] **Step 5: Create the test setup**

frontend/src/test/setup.js:

~~~js
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => cleanup());

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn()
});
~~~

- [ ] **Step 6: Create ESLint configuration**

frontend/.eslintrc.cjs:

~~~js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  },
  plugins: ['react-refresh'],
  settings: {
    react: { version: 'detect' }
  },
  rules: {
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
  },
  overrides: [
    {
      files: ['**/*.test.{js,jsx}', 'src/test/**/*.js'],
      env: { node: true, browser: true }
    }
  ]
};
~~~

Import Vitest globals explicitly in tests if ESLint reports undefined test functions.

- [ ] **Step 7: Verify commands start**

~~~powershell
npm run test
npm run lint
~~~

Expected: test reports no test files yet; lint identifies only existing issues to be fixed in files touched by this plan.

- [ ] **Step 8: Commit**

~~~powershell
git add frontend/package.json frontend/package-lock.json frontend/vite.config.js frontend/.eslintrc.cjs frontend/src/test/setup.js
git commit -m "test: add landing page test and animation tooling"
~~~

---

### Task 2: Extract Authentic Fallback Content and Home Utilities

**Files:**
- Create: frontend/src/data/homeFallbacks.js
- Create: frontend/src/utils/homeContent.js
- Create: frontend/src/utils/homeContent.test.js
- Modify: frontend/src/pages/Home.jsx

- [ ] **Step 1: Write failing utility tests**

frontend/src/utils/homeContent.test.js:

~~~js
import { describe, expect, it } from 'vitest';
import {
  formatEventDate,
  formatTimeAgo,
  getEntityHref,
  normalizeHomeContent
} from './homeContent';
import { fallbackEvents, fallbackNews, fallbackSocieties } from '../data/homeFallbacks';

describe('home content utilities', () => {
  it('formats event dates without browser-locale drift', () => {
    expect(formatEventDate('2026-06-15T09:00:00Z')).toEqual({
      day: '15',
      month: 'JUN',
      year: '2026'
    });
  });

  it('formats relative dates against an injected clock', () => {
    const now = new Date('2026-06-12T12:00:00Z').getTime();
    expect(formatTimeAgo('2026-06-12T08:00:00Z', now)).toBe('Today');
    expect(formatTimeAgo('2026-06-11T08:00:00Z', now)).toBe('Yesterday');
    expect(formatTimeAgo('2026-06-08T08:00:00Z', now)).toBe('4 days ago');
  });

  it('links live entities to details and fallbacks to indexes', () => {
    expect(getEntityHref('societies', { _id: 'live' })).toBe('/societies/live');
    expect(getEntityHref('societies', { _id: 'fallback', isFallback: true })).toBe('/societies');
  });

  it('sorts live data and fills missing collections', () => {
    const result = normalizeHomeContent({
      societies: [],
      events: [
        { _id: 'later', startDateTime: '2026-07-01' },
        { _id: 'sooner', startDateTime: '2026-06-20' }
      ],
      news: []
    });

    expect(result.societies).toEqual(fallbackSocieties);
    expect(result.events.map((event) => event._id)).toEqual(['sooner', 'later']);
    expect(result.news).toEqual(fallbackNews);
    expect(result.counts.societies).toBe(fallbackSocieties.length);
  });

  it('keeps fallback events chronological', () => {
    expect(fallbackEvents.map((event) => event._id)).toEqual([
      'fallback-sports-gala',
      'fallback-blood-drive',
      'fallback-ai-workshop'
    ]);
  });
});
~~~

- [ ] **Step 2: Run and confirm red**

~~~powershell
npm run test -- src/utils/homeContent.test.js
~~~

Expected: FAIL because the modules do not exist.

- [ ] **Step 3: Create fallback data**

Move the current authentic arrays out of Home.jsx. Use stable IDs and add isFallback, shortName, and categoryLabel. The five society IDs must be:

~~~js
'fallback-literary'
'fallback-computing'
'fallback-media'
'fallback-social-impact'
'fallback-sports'
~~~

The event IDs and order must be:

~~~js
'fallback-sports-gala'
'fallback-blood-drive'
'fallback-ai-workshop'
~~~

The four news IDs must be:

~~~js
'fallback-convocation'
'fallback-admissions'
'fallback-plantation'
'fallback-net'
~~~

Keep the existing Namal descriptions, locations, and categories. Use June 15, June 18, and June 22, 2026 for the three fallback events so the exported array is chronological. Export all arrays as named constants.

- [ ] **Step 4: Implement deterministic helpers**

frontend/src/utils/homeContent.js:

~~~js
import { fallbackEvents, fallbackNews, fallbackSocieties } from '../data/homeFallbacks';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export function formatEventDate(value) {
  const date = new Date(value);
  return {
    day: String(date.getUTCDate()).padStart(2, '0'),
    month: MONTHS[date.getUTCMonth()],
    year: String(date.getUTCFullYear())
  };
}

export function formatTimeAgo(value, now = Date.now()) {
  const dayMs = 24 * 60 * 60 * 1000;
  const days = Math.max(0, Math.floor((now - new Date(value).getTime()) / dayMs));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export function getEntityHref(collection, entity) {
  if (!entity?._id || entity.isFallback) return `/${collection}`;
  return `/${collection}/${entity._id}`;
}

export function normalizeHomeContent({ societies, events, news }) {
  const resolvedSocieties = societies?.length ? societies : fallbackSocieties;
  const resolvedEvents = events?.length
    ? [...events].sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
    : fallbackEvents;
  const resolvedNews = news?.length
    ? [...news].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    : fallbackNews;

  return {
    societies: resolvedSocieties.slice(0, 5),
    events: resolvedEvents.slice(0, 4),
    news: resolvedNews.slice(0, 4),
    counts: {
      societies: societies?.length || fallbackSocieties.length,
      events: events?.length || fallbackEvents.length
    }
  };
}
~~~

- [ ] **Step 5: Run green**

~~~powershell
npm run test -- src/utils/homeContent.test.js
~~~

Expected: five passing tests.

- [ ] **Step 6: Remove inline fallback arrays and formatting helpers from Home.jsx**

Import normalizeHomeContent. Do not change the visual markup in this step.

- [ ] **Step 7: Commit**

~~~powershell
git add frontend/src/data/homeFallbacks.js frontend/src/utils/homeContent.js frontend/src/utils/homeContent.test.js frontend/src/pages/Home.jsx
git commit -m "refactor: extract landing page content utilities"
~~~

---

### Task 3: Add Reduced-Motion and WebGL Boundaries

**Files:**
- Create: frontend/src/hooks/useReducedMotion.js
- Create: frontend/src/hooks/useReducedMotion.test.jsx
- Create: frontend/src/utils/webgl.js
- Create: frontend/src/utils/webgl.test.js

- [ ] **Step 1: Write failing tests**

frontend/src/hooks/useReducedMotion.test.jsx:

~~~jsx
import { act, renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { useReducedMotion } from './useReducedMotion';

it('tracks prefers-reduced-motion changes', () => {
  let listener;
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: (_event, callback) => { listener = callback; },
    removeEventListener: vi.fn()
  });

  const { result } = renderHook(() => useReducedMotion());
  expect(result.current).toBe(false);

  act(() => listener({ matches: true }));
  expect(result.current).toBe(true);
});
~~~

frontend/src/utils/webgl.test.js:

~~~js
import { expect, it, vi } from 'vitest';
import { supportsWebGL } from './webgl';

it('returns false when a WebGL context cannot be created', () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  expect(supportsWebGL()).toBe(false);
});

it('returns true when WebGL2 is available', () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation((name) => (
    name === 'webgl2' ? {} : null
  ));
  expect(supportsWebGL()).toBe(true);
});
~~~

- [ ] **Step 2: Confirm red**

~~~powershell
npm run test -- src/hooks/useReducedMotion.test.jsx src/utils/webgl.test.js
~~~

- [ ] **Step 3: Implement the hook**

frontend/src/hooks/useReducedMotion.js:

~~~js
import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => (
    typeof window !== 'undefined' && Boolean(window.matchMedia?.(QUERY).matches)
  ));

  useEffect(() => {
    const media = window.matchMedia?.(QUERY);
    if (!media) return undefined;
    const update = (event) => setReduced(event.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduced;
}
~~~

- [ ] **Step 4: Implement the WebGL probe**

frontend/src/utils/webgl.js:

~~~js
export function supportsWebGL() {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}
~~~

- [ ] **Step 5: Run green and commit**

~~~powershell
npm run test -- src/hooks/useReducedMotion.test.jsx src/utils/webgl.test.js
git add frontend/src/hooks frontend/src/utils/webgl.js frontend/src/utils/webgl.test.js
git commit -m "feat: add landing motion capability checks"
~~~

---

### Task 4: Build the Generated Three.js Atrium Portal

**Files:**
- Create: frontend/src/components/landing/PortalModel.jsx
- Create: frontend/src/components/landing/AtriumScene.jsx

- [ ] **Step 1: Implement reusable arch geometry**

PortalModel.jsx must create a THREE.Shape with an arched hole, extrude three nested layers, and use transform-only pointer response. Use this geometry contract:

~~~jsx
function createArchShape(width, height, openingWidth, openingHeight) {
  const shape = new THREE.Shape();
  const outerRadius = width / 2;
  const outerSpring = height / 2 - outerRadius;

  shape.moveTo(-outerRadius, -height / 2);
  shape.lineTo(-outerRadius, outerSpring);
  shape.absarc(0, outerSpring, outerRadius, Math.PI, 0, true);
  shape.lineTo(outerRadius, -height / 2);
  shape.closePath();

  const hole = new THREE.Path();
  const innerRadius = openingWidth / 2;
  const innerSpring = -height / 2 + openingHeight - innerRadius;
  hole.moveTo(innerRadius, -height / 2);
  hole.lineTo(innerRadius, innerSpring);
  hole.absarc(0, innerSpring, innerRadius, 0, Math.PI, false);
  hole.lineTo(-innerRadius, -height / 2);
  hole.closePath();

  shape.holes.push(hole);
  return shape;
}
~~~

Build these layers:

~~~jsx
<ArchLayer width={4.45} height={5.45} openingWidth={2.68} openingHeight={4.25} depth={0.36} color="#eee5d2" z={-0.12} />
<ArchLayer width={3.95} height={5.05} openingWidth={2.85} openingHeight={4.32} depth={0.24} color="#006b35" z={0.26} />
<ArchLayer width={3.55} height={4.72} openingWidth={2.96} openingHeight={4.34} depth={0.11} color="#d3ab45" z={0.54} />
~~~

In useFrame, damp rotation toward pointer.y * 0.045 and pointer.x * 0.07. Return immediately when reducedMotion is true.

- [ ] **Step 2: Implement the scene**

frontend/src/components/landing/AtriumScene.jsx:

~~~jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import PortalModel from './PortalModel';

export default function AtriumScene({ reducedMotion = false }) {
  return (
    <Canvas
      aria-hidden="true"
      className="atrium-canvas"
      camera={{ position: [0, 0.15, 8.6], fov: 35 }}
      dpr={[1, 1.65]}
      frameloop={reducedMotion ? 'demand' : 'always'}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      shadows
    >
      <ambientLight intensity={1.8} />
      <directionalLight position={[4, 6, 7]} intensity={3.2} castShadow />
      <directionalLight position={[-5, 1, 4]} intensity={1.1} color="#f5c400" />
      <PortalModel reducedMotion={reducedMotion} />
      <ContactShadows position={[0, -3, 0]} opacity={0.22} scale={8} blur={2.5} far={5} />
    </Canvas>
  );
}
~~~

- [ ] **Step 3: Verify compilation**

~~~powershell
npm run build
~~~

Expected: no React peer warning; Vite creates a distinct Three vendor chunk.

- [ ] **Step 4: Commit**

~~~powershell
git add frontend/src/components/landing/PortalModel.jsx frontend/src/components/landing/AtriumScene.jsx
git commit -m "feat: add generated Rumi Atrium 3d portal"
~~~

---

### Task 5: Build the Semantic Hero and GSAP Choreography

**Files:**
- Create: frontend/src/components/landing/AtriumHero.jsx
- Create: frontend/src/components/landing/AtriumHero.test.jsx

- [ ] **Step 1: Write the failing semantic test**

~~~jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { it, expect, vi } from 'vitest';
import AtriumHero from './AtriumHero';

vi.mock('../../hooks/useReducedMotion', () => ({ useReducedMotion: () => true }));
vi.mock('../../utils/webgl', () => ({ supportsWebGL: () => true }));

it('keeps the complete hero usable without animation', () => {
  render(
    <MemoryRouter>
      <AtriumHero societyCount={15} eventCount={6} />
    </MemoryRouter>
  );

  expect(screen.getByRole('heading', {
    level: 1,
    name: /Namal's Central Societies Headquarters/i
  })).toBeVisible();
  expect(screen.getByRole('link', { name: /Explore Societies/i })).toHaveAttribute('href', '/societies');
  expect(screen.getByRole('link', { name: /View Calendar/i })).toHaveAttribute('href', '/events');
  expect(screen.getByAltText(/Namal Academic Block/i)).toBeVisible();
  expect(screen.queryByTestId('atrium-scene')).not.toBeInTheDocument();
});
~~~

- [ ] **Step 2: Confirm red**

~~~powershell
npm run test -- src/components/landing/AtriumHero.test.jsx
~~~

- [ ] **Step 3: Implement AtriumHero**

Required implementation details:

- Lazy import AtriumScene with React.lazy.
- Register useGSAP and ScrollTrigger once at module scope.
- Render one h1 with two display spans.
- Render exact routes /societies and /events.
- Render namal-academic-block.png immediately with fetchPriority="high".
- Render a CSS static arch whether or not WebGL is available.
- Render the canvas only when reducedMotion is false and supportsWebGL() is true.
- Render the exact RH crest as a decorative medallion.
- Add atrium-stage--enhanced when the canvas renders, and set the CSS static arch to opacity: 0 in that state so the fallback and WebGL arches never double-render.
- Render societyCount, eventCount, and One house metadata.
- Scope the load timeline and desktop scroll transform to a root ref.
- Use gsap.matchMedia() and return media.revert().

Hero animation body:

~~~js
useGSAP(() => {
  if (reducedMotion) return undefined;
  const media = gsap.matchMedia();

  media.add('(min-width: 900px)', () => {
    gsap.from('[data-hero-reveal]', {
      autoAlpha: 0,
      y: 28,
      duration: 0.85,
      stagger: 0.09,
      ease: 'power3.out'
    });

    gsap.to('[data-atrium-stage]', {
      yPercent: 6,
      scale: 1.035,
      ease: 'none',
      scrollTrigger: {
        trigger: root.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });
  });

  return () => media.revert();
}, { scope: root, dependencies: [reducedMotion] });
~~~

Do not pin the page or animate width, height, top, or left.

- [ ] **Step 4: Run green and commit**

~~~powershell
npm run test -- src/components/landing/AtriumHero.test.jsx
git add frontend/src/components/landing/AtriumHero.jsx frontend/src/components/landing/AtriumHero.test.jsx
git commit -m "feat: add semantic animated Rumi Atrium hero"
~~~

---

### Task 6: Implement the Editorial Society, Event, and News Sections

**Files:**
- Create: frontend/src/components/landing/LandingSectionHeading.jsx
- Create: frontend/src/components/landing/SocietiesExhibition.jsx
- Create: frontend/src/components/landing/EventsFeature.jsx
- Create: frontend/src/components/landing/NewsEditorial.jsx
- Create: frontend/src/components/landing/LandingSections.test.jsx

- [ ] **Step 1: Write failing section tests**

Test these contracts:

~~~jsx
expect(screen.getAllByRole('article')).toHaveLength(5);
expect(screen.getByRole('link', { name: /Browse All Societies/i })).toHaveAttribute('href', '/societies');
expect(screen.getByRole('heading', { name: /Namal Sports Gala 2026/i })).toBeVisible();
expect(screen.getByRole('link', { name: /View Full Calendar/i })).toHaveAttribute('href', '/events');
expect(screen.getByRole('heading', { name: /Namal University Convocation/i })).toBeVisible();
expect(screen.getByRole('link', { name: /View All News/i })).toHaveAttribute('href', '/news');
~~~

Render components inside MemoryRouter using fallbackSocieties, fallbackEvents, and fallbackNews.

- [ ] **Step 2: Confirm red**

~~~powershell
npm run test -- src/components/landing/LandingSections.test.jsx
~~~

- [ ] **Step 3: Create LandingSectionHeading**

It accepts number, eyebrow, title, body, linkTo, linkLabel, and inverse. It renders a semantic header, h2, description, and React Router Link.

- [ ] **Step 4: Create SocietiesExhibition**

Required markup:

~~~jsx
<section className="landing-section societies-exhibition" aria-labelledby="societies-title">
  <LandingSectionHeading
    number="01"
    eyebrow="Active societies"
    title="Ideas become communities."
    body="Explore the student groups shaping intellectual, creative, social, and athletic life at Namal."
    linkTo="/societies"
    linkLabel="Browse All Societies"
  />
  <div className="societies-exhibition__list">
    {societies.map((society, index) => (
      <article className="society-exhibit" key={society._id} data-section-reveal>
        <span className="society-exhibit__index">{String(index + 1).padStart(2, '0')}</span>
        <p className="society-exhibit__category">{society.categoryLabel || 'Student society'}</p>
        <h3>{society.shortName || society.name}</h3>
        <p>{society.description}</p>
        <Link to={getEntityHref('societies', society)}>View society <span aria-hidden="true">&rarr;</span></Link>
      </article>
    ))}
  </div>
</section>
~~~

- [ ] **Step 5: Create EventsFeature**

Use namal-courtyard.png as the large feature image. The first event is featured; up to three remaining events render as compact links. Use formatEventDate and getEntityHref. The section heading is inverse on deep green. The image alt is "Namal University courtyard before an upcoming campus event".

- [ ] **Step 6: Create NewsEditorial**

Use up to four items. The first story spans two desktop columns. Use API imageUrl when present; otherwise alternate namal-academic-block.png and namal-courtyard.png. Decorative repeated images use empty alt text. Use getEntityHref so fallback items link to /news.

- [ ] **Step 7: Add scoped section reveal and event parallax**

At the Home page boundary, create one useGSAP scope for [data-section-reveal]. Each element animates once from autoAlpha 0 and y 26 when its top reaches 88% of the viewport.

Inside EventsFeature, use gsap.matchMedia() to animate only the feature image yPercent from -4 to 4 on screens at least 900px wide and only when reduced motion is not requested. Return media.revert().

- [ ] **Step 8: Run green and commit**

~~~powershell
npm run test -- src/components/landing/LandingSections.test.jsx
git add frontend/src/components/landing
git commit -m "feat: add editorial landing content sections"
~~~

---

### Task 7: Recompose Home.jsx Around Parallel Data Loading

**Files:**
- Modify: frontend/src/pages/Home.jsx
- Create: frontend/src/pages/Home.test.jsx

- [ ] **Step 1: Write API success and fallback tests**

Mock ../api/api. Verify:

1. Live society, event, and news values replace fallbacks.
2. Rejected requests render Literary & Debating, Namal Sports Gala 2026, and Namal University Convocation.
3. getSocieties(), getEvents('approved'), and getNews() are all called immediately.
4. Hero receives live counts.

- [ ] **Step 2: Confirm red**

~~~powershell
npm run test -- src/pages/Home.test.jsx
~~~

- [ ] **Step 3: Replace Home.jsx with orchestration only**

Use this structure:

~~~jsx
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import * as api from '../api/api';
import AtriumHero from '../components/landing/AtriumHero';
import SocietiesExhibition from '../components/landing/SocietiesExhibition';
import EventsFeature from '../components/landing/EventsFeature';
import NewsEditorial from '../components/landing/NewsEditorial';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { normalizeHomeContent } from '../utils/homeContent';

const EMPTY = normalizeHomeContent({ societies: [], events: [], news: [] });
gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Home() {
  const root = useRef(null);
  const reducedMotion = useReducedMotion();
  const [content, setContent] = useState(EMPTY);

  useEffect(() => {
    let active = true;
    const societiesPromise = api.getSocieties();
    const eventsPromise = api.getEvents('approved');
    const newsPromise = api.getNews();

    Promise.all([societiesPromise, eventsPromise, newsPromise])
      .then(([societies, events, news]) => {
        if (active) setContent(normalizeHomeContent({ societies, events, news }));
      })
      .catch((error) => {
        console.error('Landing page API unavailable; using authentic fallback content.', error);
        if (active) setContent(EMPTY);
      });

    return () => { active = false; };
  }, []);

  useGSAP(() => {
    if (reducedMotion) return undefined;
    const elements = gsap.utils.toArray('[data-section-reveal]');
    elements.forEach((element) => {
      gsap.from(element, {
        autoAlpha: 0,
        y: 26,
        duration: 0.72,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          once: true
        }
      });
    });
  }, { scope: root, dependencies: [reducedMotion] });

  return (
    <div ref={root} className="landing-page">
      <AtriumHero societyCount={content.counts.societies} eventCount={content.counts.events} />
      <SocietiesExhibition societies={content.societies} />
      <EventsFeature events={content.events} />
      <NewsEditorial news={content.news} />
    </div>
  );
}
~~~

- [ ] **Step 4: Run page tests**

~~~powershell
npm run test -- src/pages/Home.test.jsx src/utils/homeContent.test.js
~~~

Expected: PASS and no state-update-after-unmount warning.

- [ ] **Step 5: Commit**

~~~powershell
git add frontend/src/pages/Home.jsx frontend/src/pages/Home.test.jsx
git commit -m "refactor: compose home page from landing sections"
~~~

---

### Task 8: Refine Navigation, Footer, Public Shell, and Landing Styles

**Files:**
- Modify: frontend/src/components/Navbar.jsx
- Modify: frontend/src/components/Footer.jsx
- Modify: frontend/src/components/PublicLayout.jsx
- Create: frontend/src/components/Navbar.test.jsx
- Create: frontend/src/components/Footer.test.jsx
- Create: frontend/src/styles/landing.css
- Modify: frontend/src/styles/global.css
- Modify: frontend/src/main.jsx

- [ ] **Step 1: Write shared-chrome tests**

Navbar tests must verify:

- Authentic image alt "Rumi House Hub crest".
- /societies, /events, and /news routes.
- Open menu button sets aria-expanded.
- Mobile drawer opens and closes.

Footer tests must verify:

- Authentic crest.
- Society Directory and Event Calendar routes.
- Current year.
- mailto:info@namal.edu.pk.

- [ ] **Step 2: Update Navbar without changing auth logic**

Change the logo import to assets/landing/rumi-house-hub-crest.png. Replace the broken anonymous initials value with RH. Retain every role-based dashboard link and logout behavior. Move inline keyframes to landing.css. Add aria-expanded and aria-controls to the mobile-menu button, and role="dialog" plus aria-modal="true" to the open drawer shell.

- [ ] **Step 3: Replace Footer with an institutional close**

Use the exact crest, Academic Block image, valid React Router links, Mianwali address, info@namal.edu.pk mail link, current year, and the line "Built for student agency and shared purpose." The building image is decorative and uses empty alt text.

- [ ] **Step 4: Make PublicLayout full-width**

Use:

~~~jsx
export default function PublicLayout() {
  return (
    <div className="public-shell">
      <Navbar />
      <main id="main-content" className="public-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
~~~

- [ ] **Step 5: Import landing.css after global.css**

frontend/src/main.jsx:

~~~js
import './styles/global.css';
import './styles/landing.css';
~~~

- [ ] **Step 6: Create the approved CSS system**

landing.css must define these page-scoped colors:

~~~css
.landing-page {
  --landing-green: #006b35;
  --landing-green-deep: #033c25;
  --landing-gold: #cfa83a;
  --landing-cream: #faf7ef;
  --landing-ink: #102019;
  overflow: clip;
  background: var(--landing-cream);
  color: var(--landing-ink);
}
~~~

Required desktop layout contracts:

- .public-main has 80px top padding.
- .atrium-hero uses a three-column grid and min-height calc(100vh - 80px).
- .atrium-hero__headline spans all columns and uses clamp(4.5rem, 8.2vw, 8.8rem).
- .atrium-stage is centered, at least 610px tall, and layers photo, static arch, canvas, and crest.
- .atrium-stage__photo uses object-fit: cover and an arched clip path.
- .societies-exhibition is a 0.82fr / 2.18fr grid.
- .societies-exhibition__list is five columns; the first exhibit is deep green.
- .events-feature is a 0.92fr / 1.5fr grid with deep green intro and photographic lead.
- .news-editorial is a 0.72fr / 2.28fr grid; the lead story spans two columns.
- .site-footer is deep green with a right-side building photograph and gradient scrim.

Required responsive contracts:

~~~css
@media (max-width: 1199px) {
  .atrium-hero { grid-template-columns: 1fr 1.2fr; }
  .societies-exhibition,
  .news-editorial { grid-template-columns: 1fr; }
  .societies-exhibition__list { grid-template-columns: repeat(2, 1fr); }
  .events-feature { grid-template-columns: 1fr; }
}

@media (max-width: 767px) {
  .public-main { padding-top: 72px; }
  .atrium-hero { min-height: auto; display: flex; flex-direction: column; padding: 44px 16px 56px; }
  .atrium-hero__headline h1 { font-size: clamp(3.5rem, 17vw, 5.4rem); line-height: 0.88; }
  .atrium-hero__actions { flex-direction: column; }
  .atrium-stage { min-height: 430px; }
  .societies-exhibition__list,
  .events-feature__supporting,
  .news-editorial__grid,
  .site-footer__inner { grid-template-columns: 1fr; }
  .society-exhibit { min-height: auto; border-left: 0; border-top: 1px solid #cdd8d0; }
  .site-footer__photo { width: 100%; opacity: 0.18; }
}

@media (prefers-reduced-motion: reduce) {
  .landing-page *,
  .landing-page *::before,
  .landing-page *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .atrium-stage__canvas { display: none; }
}
~~~

- [ ] **Step 7: Remove old landing styles from global.css**

Delete the block headed PREMIUM LANDING PAGE UPGRADE STYLES, including hero-image-container, bento-card-premium, event-row-premium, and news-card-premium.

Change the generic main rule so it does not constrain .public-main or .app-main-content.

- [ ] **Step 8: Run all automated checks**

~~~powershell
npm run test
npm run lint
npm run build
~~~

Expected: all tests pass; lint has zero warnings; Vite creates three, motion, and application chunks.

- [ ] **Step 9: Commit**

~~~powershell
git add frontend/src/components frontend/src/styles frontend/src/main.jsx
git commit -m "style: complete the responsive Rumi Atrium experience"
~~~

---

### Task 9: Browser QA Against the Approved Visual Target

**Files to inspect and correct if a verification step fails:**
- frontend/src/components/landing/AtriumHero.jsx
- frontend/src/components/landing/SocietiesExhibition.jsx
- frontend/src/components/landing/EventsFeature.jsx
- frontend/src/components/landing/NewsEditorial.jsx
- frontend/src/components/Navbar.jsx
- frontend/src/components/Footer.jsx
- frontend/src/styles/landing.css

- [ ] **Step 1: Start the frontend with backend unavailable**

~~~powershell
npm run dev -- --host 127.0.0.1 --port 4173
~~~

Expected: / renders fallback content immediately and does not show a blocking error state.

- [ ] **Step 2: Compare desktop at 1440x1024**

Use the in-app Browser and compare to docs/superpowers/specs/assets/rumi-atrium-approved.png.

Verify:

- Exact RH crest in navigation and hero.
- Academic Block framed inside the portal.
- Headline is not clipped under fixed navigation.
- Portal does not hide CTAs or metadata.
- Five society exhibits are readable.
- Courtyard image fills the event feature without distortion.
- No horizontal overflow.

- [ ] **Step 3: Verify tablet at 834x1112**

Check the two-column hero, two-column societies, stacked event band, navigation, and type wrapping.

- [ ] **Step 4: Verify mobile at 390x844**

Check the static portal fallback, full-width CTAs, menu open/close, single-column societies, event content, news, and footer.

- [ ] **Step 5: Verify routes and states**

Activate:

- Brand link to /.
- Main navigation to /societies, /events, and /news.
- Hero CTAs.
- A live detail link when API data is available.
- A fallback item link when API data is unavailable; it must stay on the collection index.
- Mobile close button and backdrop.

- [ ] **Step 6: Verify accessibility and failure modes**

Check:

- Visible keyboard focus.
- Skip link targets #main-content.
- Reduced-motion emulation hides the canvas and removes scroll motion.
- WebGL-disabled mode keeps the photo, static portal, heading, CTAs, and content.
- Console has no React, Three.js, GSAP, image, or routing errors.
- Navigating away from and back to / does not duplicate ScrollTriggers.

- [ ] **Step 7: Run final verification**

~~~powershell
npm run test
npm run lint
npm run build
git diff --check
git status --short
~~~

Expected: all commands pass; diff check is silent; only intentional implementation changes remain.

- [ ] **Step 8: Commit browser corrections when the QA steps produced changes**

~~~powershell
git add frontend
git commit -m "fix: complete Rumi Atrium responsive QA"
~~~

---

## Plan Self-Review

- **Spec coverage:** Authentic assets, 3D portal, GSAP motion, API and fallback content, navigation, footer, responsive layouts, reduced motion, no-WebGL fallback, automated tests, lint, build, and three viewport checks all map to tasks.
- **Scope control:** No backend, dashboard, detail-page, authentication, or routing architecture changes are included.
- **Compatibility:** React remains at 18.3.1; Fiber 8.18.0 and Drei 9.122.0 match React 18.
- **Performance:** The semantic hero is independent from the lazy Three.js chunk; pixel ratio is capped; no post-processing or downloaded model is introduced.
- **Naming consistency:** AtriumHero, AtriumScene, PortalModel, SocietiesExhibition, EventsFeature, NewsEditorial, useReducedMotion, supportsWebGL, and normalizeHomeContent are consistent throughout.
- **No unresolved placeholders:** Commands, files, routes, assets, fallbacks, motion behavior, and verification states are explicit.
