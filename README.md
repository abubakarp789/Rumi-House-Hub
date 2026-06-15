# Rumi House Hub — Namal University Student Portal

Rumi House Hub is a full-stack MERN platform designed for student engagement, event participation, membership requests, news archives, digital RSVP passes, and organizer check-ins at Namal University.

## Technical Stack

* **Frontend:** React 18, Vite, React Router 6, Tailwind CSS, scoped Bootstrap 5 grid utilities, GSAP animations, Vitest.
* **Backend:** Node.js, Express, MongoDB (Mongoose), JWT authentication (24-hour expiry), bcrypt password hashing, Node native test runner.

---

## User Roles & Boundaries

* **Student:** Can browse societies and approved events, request society membership, RSVP to upcoming events, and access personal QR gate passes.
* **Executive:** Can propose events for their authorized societies, inspect live attendance check-in sheets, and verify attendee tickets using a pass token scanner.
* **Admin:** Retains moderation privileges to approve/reject proposed events and membership applications, manage user roles, and publish campus news bulletins.

The application exposes domain-appropriate CRUD operations for user profiles, accounts, societies, memberships, events, RSVPs, attendance records, and news bulletins. Destructive operations are protected by role and ownership checks and clean up dependent records where required.

---

## Workspace Structure

```text
Rumi-House-Hub/
├── frontend/             # React SPA (Vite + React Router)
│   ├── src/
│   │   ├── components/   # Reusable UI features & dashboard tabs
│   │   ├── pages/        # Views (Home, Login, Register, Dashboards)
│   │   └── styles/       # Global CSS stylesheets
├── backend/              # Node.js/Express REST server
│   ├── config/           # Database setup
│   ├── controllers/      # Route handler logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # REST endpoints mapping
│   └── utils/            # Access control policy files
└── docs/                 # Architectural specifications
```

---

## Local Setup & Configuration

### 1. Configure Environments
Copy the example environment variables in both directories:
```bash
# In backend/ directory
cp .env.example .env

# In frontend/ directory
cp .env.example .env
```
Ensure `MONGODB_URI` and `JWT_SECRET` are correctly configured inside `backend/.env`.

### 2. Dependency Resolution
Resolve packages inside both workspaces:
```bash
cd backend
npm install
cd ../frontend
npm install
```

### 3. Database Seeding
> [!WARNING]
> Running the seed command wipes all existing database collections and populates default datasets.

Run the seed command in the backend:
```bash
cd backend
npm run seed
```

### 4. Start Development Applications
Start both services in separate terminal sessions:
```bash
# In backend/ directory
npm run dev

# In frontend/ directory
npm run dev
```
Open `http://localhost:5173` to explore the application.

---

## Quality & Integration Verification

Execute the test suites and build scripts to verify correctness:

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests, Lint, & Build
```bash
cd frontend
npm test
npm run lint
npm run build
```

---

## Known System Assumptions
* **Registration Validation:** Public account sign-up is locked to `@namal.edu.pk` emails.
* **Registration Authorization:** All new accounts default to the `student` role. Promotion to `executive` or `admin` must be performed by an existing administrator.
* **Event Pass Lifetime:** Attendance check-in tickets are active from 24 hours prior to the event start time until 24 hours post-conclusion.
