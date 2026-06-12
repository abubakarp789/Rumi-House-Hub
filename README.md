# Rumi House Hub

Full-stack MERN portal for Namal University societies, events, membership moderation, individual event passes, and organizer-recorded attendance.

## Local setup

1. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` and a `JWT_SECRET` of at least 32 characters.
2. Optionally copy `frontend/.env.example` to `frontend/.env` when the API is not running at `http://localhost:5000/api`.
3. Install dependencies in both applications:

```powershell
cd backend
npm install
cd ..\frontend
npm install
```

4. Seed the database and start both development servers in separate terminals:

```powershell
cd backend
npm run seed
npm run dev
```

```powershell
cd frontend
npm run dev
```

## Verification

```powershell
cd backend
npm test
npm audit --omit=dev
```

```powershell
cd frontend
npm test
npm run lint
npm run build
npm audit --omit=dev
```

Public registration always creates a student account. Executive and administrator roles are assigned by an administrator. Students reveal an individual QR pass after RSVP; only the event creator or an administrator can use that pass to record attendance.
