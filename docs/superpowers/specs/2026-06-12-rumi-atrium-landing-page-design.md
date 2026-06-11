# Rumi Atrium Landing Page Design

**Date:** June 12, 2026  
**Status:** Approved visual direction  
**Surface:** Public landing page at `/`  
**Visual target:** [rumi-atrium-approved.png](assets/rumi-atrium-approved.png)

## Objective

Replace the existing conventional landing page with a premium, balanced experience that makes Rumi House Hub feel like Namal University's central student-engagement institution. The redesign must combine a memorable Three.js hero with fast access to societies, events, and news, while preserving all existing routes, API-backed data, authentication behavior, and the established green, gold, cream, and editorial identity.

## Approved Direction

The selected direction is **The Rumi Atrium**. Its defining device is a monumental centered portal inspired by Namal's arches and cream-stone architecture. The portal uses warm limestone surfaces, deep institutional-green glazed insets, and restrained gold detailing. It frames the real Namal Academic Block and acts as the spatial transition into the rest of the page.

The final implementation will use the supplied files directly rather than using rasterized details from the concept image:

- `frontend/src/assets/landing/rumi-house-hub-crest.png`
- `frontend/src/assets/landing/namal-academic-block.png`
- `frontend/src/assets/landing/namal-courtyard.png`

## Experience Principles

1. **Institutional, not corporate:** The page should feel like a cultural and academic institution, not a SaaS dashboard.
2. **Cinematic, not obstructive:** The 3D hero establishes identity without delaying navigation or hiding primary calls to action.
3. **Authentic, not generic:** Supplied Namal photography and the exact RH crest replace external stock imagery and invented marks.
4. **Editorial, not card-heavy:** Typography, spacing, imagery, dividers, and numbered sections create hierarchy before borders or shadows.
5. **Motion with purpose:** Animation explains depth, progression, and relationships. It must not compete with content or cause motion discomfort.

## Information Architecture

### 1. Navigation

Preserve the current public navigation and authentication behavior:

- RH crest and `Rumi House Hub` link to `/`.
- `Societies`, `Events`, and `News` link to their existing routes.
- Existing authenticated dashboard links and logout behavior remain unchanged.
- Search remains present as a compact desktop control; no new global search backend is introduced.
- Mobile navigation remains a functional drawer with focusable controls and a clear close action.

The visual treatment becomes lighter and more architectural: cream translucent surface, thin divider, tighter type, and a larger authentic crest.

### 2. Hero: The Atrium

The hero fills approximately the first viewport below navigation. Its layers are:

- Oversized headline: `Namal's Central Societies Headquarters`.
- Short institutional description and two existing CTAs: `Explore Societies` and `View Calendar`.
- A centered 3D portal rendered with Three.js through React Three Fiber.
- The real Academic Block photograph visible through the portal opening.
- A restrained metadata row for active societies, upcoming events, and student engagement.
- The RH crest used in the navbar and as a subtle portal medallion.

The portal is built from simple reusable geometry rather than a downloaded 3D model. Nested extruded arch shapes create the limestone body, green inset, and gold trim. This keeps the scene small, editable, and consistent with the approved art direction.

### 3. Active Societies Exhibition

Present the first five societies as a numbered exhibition instead of a conventional bento grid:

- A section introduction and `Browse All Societies` link.
- One horizontal sequence of society panels on desktop.
- Each panel exposes name, short description, category label, and link.
- The first society receives slightly stronger emphasis without becoming a nested card.
- On smaller screens the sequence becomes a single-column list with clear separators.

Data continues to come from `getSocieties()`, with the current authentic fallback data used when the API is unavailable.

### 4. Upcoming Events Editorial Band

Create a high-contrast green and photographic band:

- Left: section label, oversized nearest-event date, title, time, and location.
- Right: the authentic Namal courtyard photograph with a restrained dark gradient for readable event text.
- Remaining events appear as compact rows below or adjacent depending on viewport width.
- `View Full Calendar` links to `/events`.

Data continues to come from `getEvents('approved')`, sorted chronologically as it is now.

### 5. Latest News

Use an editorial three-column layout on desktop and a stacked list on mobile:

- Section introduction and `View All News` link.
- One lead story and up to three supporting stories.
- Authentic campus imagery is preferred; where an API item has no image, use one of the supplied Namal photographs with deliberate crops rather than remote stock.
- Dates and categories remain visible but subordinate to headlines.

Data continues to come from `getNews()`, sorted by publication date descending.

### 6. Footer

The footer becomes a deep-green institutional close:

- Exact RH crest and concise Rumi House Hub description.
- Existing route links.
- Contact and institutional information already present in the product.
- A wide crop of the supplied Academic Block or courtyard image blended into the background.
- Current year generated at runtime.

## Component Architecture

`Home.jsx` currently owns data loading, fallback content, formatting, and all presentation in one 406-line component. The redesign will keep its data orchestration but split visual responsibilities into focused landing-page components:

- `pages/Home.jsx`: data loading, sorting, fallback selection, and composition.
- `components/landing/AtriumHero.jsx`: semantic hero content, CTAs, fallback image, and lazy 3D boundary.
- `components/landing/AtriumScene.jsx`: React Three Fiber canvas and portal scene only.
- `components/landing/PortalModel.jsx`: reusable arch geometry, materials, and pointer response.
- `components/landing/SocietiesExhibition.jsx`: society display and links.
- `components/landing/EventsFeature.jsx`: featured and supporting event layout.
- `components/landing/NewsEditorial.jsx`: lead and supporting news layout.
- `components/landing/LandingSectionHeading.jsx`: consistent numbered section heading.
- `hooks/useReducedMotion.js`: shared media-query state for CSS, GSAP, and 3D decisions.
- `styles/landing.css`: page-scoped tokens, responsive layout, and non-animated states.

Static fallback arrays may move to `data/homeFallbacks.js` so presentation components stay small and the values are testable without rendering the whole page.

## Animation System

### GSAP

Use GSAP with `@gsap/react` and ScrollTrigger for DOM animation. Every animation is scoped to a component and reverted on unmount.

- Hero load: eyebrow, headline lines, description, CTAs, and metadata reveal in a short stagger.
- Hero scroll: portal shifts slightly forward while headline layers separate vertically; avoid long scroll-jacking.
- Section entrances: headings and content reveal once with small vertical movement and opacity.
- Society panels: staggered reveal with no continuous animation.
- Event image: subtle vertical parallax limited to transform-only motion.

Use `gsap.matchMedia()` for desktop/mobile variants and `prefers-reduced-motion`. Do not animate layout properties such as width, height, top, or left.

### Three.js

Use `three`, React Three Fiber 8, and Drei 9 versions compatible with the existing React 18 application. Do not upgrade React solely for this redesign.

- The canvas is dynamically imported and loaded after the semantic hero content.
- Rendering uses `frameloop="demand"` where practical; pointer movement invalidates frames.
- Pixel ratio is capped to reduce GPU cost on high-density displays.
- Pointer response is subtle: a few degrees of portal rotation and a small camera offset.
- Materials use physically plausible roughness and metalness without expensive post-processing.
- No continuous particle systems, bloom pipeline, or large model downloads.
- Canvas and scene resources are disposed through component teardown.

## Progressive Enhancement

The hero must remain complete without WebGL or JavaScript-heavy animation:

- Semantic headline, copy, CTAs, metadata, and Academic Block image render immediately.
- The 3D canvas enhances the image when supported.
- Canvas failure leaves the static photo composition intact.
- Reduced-motion users see a static portal with no pinned scroll sequence, parallax, or pointer tracking.
- Touch devices receive minimal automatic depth movement and no hover-dependent information.

## Data Flow and Failure Behavior

The page starts the societies, events, and news requests in parallel with `Promise.all`, preserving the current behavior. Successful responses are normalized and sorted before being passed to sections.

If one or more requests fail, the landing page uses the existing authentic fallback content and still renders every section. The UI does not expose a blocking error screen for public marketing content. Development logging may identify the failed request, but visible content remains stable.

Loading should not replace the whole page with a spinner. The hero renders immediately, while content sections use stable-height skeletons or fallback data to avoid layout shifts.

## Responsive Behavior

- **Desktop, 1200px and above:** Full centered portal, oversized headline, horizontal societies exhibition, split event band, three-column news.
- **Tablet, 768px to 1199px:** Portal scales down, headline remains layered but no longer overlaps navigation, societies become a two-column grid, event band stacks.
- **Mobile, below 768px:** Static or lightweight portal treatment, left-aligned headline, full-width CTAs, numbered society list, stacked events and news. No pinned hero.
- Preserve a minimum 320px viewport and avoid horizontal scrolling.

## Accessibility

- Maintain logical heading order with one page `h1`.
- Keep all navigation and CTAs as real links or buttons.
- Provide descriptive alt text for supplied campus photographs; mark decorative 3D canvas content hidden from assistive technology.
- Preserve the skip link and visible keyboard focus styles.
- Keep text contrast at WCAG AA or better.
- Respect `prefers-reduced-motion` in CSS, GSAP, and Three.js behavior.
- Mobile drawer must trap neither focus nor scrolling after close.

## Performance Budget

- Keep the initial semantic landing-page JavaScript independent from the Three.js chunk.
- Lazy-load the 3D scene and avoid importing Drei through a barrel where direct imports are available.
- Use responsive image sizing and modern browser decoding behavior for the supplied high-resolution PNGs.
- Avoid remote hero assets and remove the current third-party image dependencies from `Home.jsx`.
- Target smooth interaction on integrated laptop GPUs and current mid-range mobile devices.
- Verify the production build has no unexpectedly duplicated Three.js or GSAP bundles.

## Testing and Verification

### Automated

- Add Vitest and React Testing Library if the frontend has no existing test runner.
- Test fallback data rendering when API calls reject.
- Test that live API data replaces fallback content.
- Test society, event, news, and CTA route targets.
- Test reduced-motion rendering without creating the animated scene.
- Test date formatting utilities independently.
- Run `npm run lint` and `npm run build`.

### Browser QA

Use the in-app browser to verify:

- Desktop at 1440x1024 against the approved visual target.
- Tablet around 834x1112.
- Mobile around 390x844.
- Navigation, mobile drawer, CTAs, and society/event/news links.
- Console errors and WebGL failures.
- Reduced-motion emulation.
- Layout with backend unavailable and fallback content active.
- No image distortion, clipped headline text, horizontal overflow, or overlapping fixed navigation.

## Out of Scope

- Redesigning authenticated dashboards or public detail pages.
- Adding new backend endpoints or a functional global-search backend.
- Creating a photogrammetric or exact 3D model of Namal buildings.
- Adding audio, autoplay video, or scroll-jacked multi-minute storytelling.
- Replacing the existing authentication or routing architecture.

## Acceptance Criteria

The redesign is complete when the `/` route visually follows the approved Rumi Atrium target, uses the supplied crest and both supplied Namal building images, preserves live and fallback content behavior, includes a responsive lazy-loaded Three.js portal and scoped GSAP motion, remains functional with reduced motion or no WebGL, passes lint and production build, and is verified at desktop, tablet, and mobile sizes in the in-app browser.
