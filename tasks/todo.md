# Rumi House Hub — Implementation and Verification Plan

## Phase 1: Safety and Baseline Verification ✅
- [x] Run `git status` to verify clean working tree
- [x] Run `npm install` in frontend and backend
- [x] Run `npm test` in frontend (31 passing)
- [x] Run `npm test` in backend (34 passing)
- [x] Run `npm run lint` in frontend (passing)
- [x] Run `npm run build` in frontend (passing)

## Phase 2: UI Theme and Layout Standardization ✅
- [x] Inspect existing styling files (`index.html`, global CSS, tailwind setup, any CSS frameworks)
- [x] Identify and clean up any runtime Tailwind CDN usage if present (none used, local Vite/Tailwind configured)
- [x] Create or standardize shared UI tokens and components:
  - [x] Standardized buttons (primary, secondary, outline, danger)
  - [x] Standardized card styles (Atrium theme)
  - [x] Standardized form inputs and validation errors
  - [x] Standardized status badges/pills
  - [x] Standardized loading/skeleton states
  - [x] Standardized tables and dashboard layout
- [x] Verify build and tests pass after changes

## Phase 3: Page-by-Page Frontend Cleanup ✅
- [x] Fix fields mismatch in `EventCard.jsx` (`capacity`/`registered`)
- [x] Fix fields mismatch in `SocietyCard.jsx` (`patronName`/`facultyCoordinator`)
- [x] Fix loading skeleton nesting in list pages
- [x] Fix nested `<main>` landmark issue in `EventDetail.jsx`
- [x] Fix news cards accessibility and links in `/news`
- [x] Fix `NotFound.jsx` page wording and imagery
- [x] Remove/implement inert controls (forgot password, remember me, global search, newsletter signup, fake social links)
- [x] Remove fake/invented details (benefits, schedule, certification, etc.) from details pages
- [x] Ensure all pages use real backend/API-supported fields

## Phase 4: Navigation and Route Fixes ✅
- [x] Restrict `/dashboard` to student-only
- [x] Restrict `/executive` to executive-only (or admin if required)
- [x] Restrict `/admin` to admin-only
- [x] Fix role-aware navbar, footer, sidebar, and dashboard redirect links
- [x] Clean up broken/unused routes (e.g. `/about`, `/guide`, `/handbook`, `/guidelines`, `/contact`, `/privacy`, `/terms`)
- [x] Add/improve a proper `403` Unauthorized page
- [x] Preserve original route destination in state during login redirect
- [x] Handle logout navigation correctly
- [x] Fix mobile drawer accessibility and focus management

## Phase 5: Backend Bug Fixes and API Consistency ✅
- [x] Force public registration to assign `student` role only
- [x] Validate JWT secret configuration at startup
- [x] Protect public event routes from showing drafts/pending/rejected events (status filters and ID queries)
- [x] Restrict executives from creating events for unauthorized societies
- [x] Restrict executives from inspecting attendance for unauthorized events
- [x] Redesign event check-in/pass contract to be secure (avoid shared secrets or undefined tokens)
- [x] Ensure RSVP creation and seat count updates are transactional or atomic
- [x] Ensure membership counts and status updates are atomic/consistent
- [x] Align backend API response shapes with frontend expectations

## Phase 6: Dead Code and Dead File Cleanup ✅
- [x] Search and verify unused components, helper functions, and assets
- [x] Reconnect approved landing page helpers (`AtriumScene.jsx`, `PortalModel.jsx`, `useReducedMotion.js`, `webgl.js`, `normalizeHomeContent()`)
- [x] Safely remove only confirmed dead selectors and files
- [x] Report each deleted item with justification

## Phase 7: Performance Optimization ✅
- [x] Optimize/compress heavy visual assets
- [x] Implement route-level code splitting (`React.lazy`)
- [x] Optimize lazy loading of heavy visual or 3D sections
- [x] Avoid duplicate API requests and unnecessary dashboard refetching

## Phase 8: Testing Expansion ✅
- [x] Add/update tests for route guards and role redirects
- [x] Add/update tests for registration safety, RSVP capacity, and membership moderation
- [x] Add/update tests for check-in validation and event status privacy

## Phase 9: Documentation ✅
- [x] Create/update root `README.md`
- [x] Create/update `frontend/README.md` and `backend/README.md`
- [x] Create `docs/API.md`, `docs/DATA_MODEL.md`, and `docs/DEPLOYMENT.md`
- [x] Create `.env.example` files for both frontend and backend

## Phase 10: Final Verification ✅
- [x] Run full test suites (frontend and backend)
- [x] Run build and lint checks
- [x] Manually test all roles (student, executive, admin)
- [x] Final git status and git diff sanity check
