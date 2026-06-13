# Rumi House Hub — Backend REST API

This is the Node.js / Express backend server that powers Rumi House Hub.

## Getting Started

### 1. Installation
Install the backend dependencies:
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file from the template:
```bash
cp .env.example .env
```
Configure `MONGODB_URI` and define a cryptographically secure `JWT_SECRET` with at least 32 characters.

### 3. Database Seeding
> [!WARNING]
> Running the seed script deletes all existing documents in your MongoDB database and recreates them. Use caution when running in production.

Seed the database with default Namal societies, events, users, and news bulletins:
```bash
npm run seed
```

### 4. Development Server
Start the Express server with Nodemon watcher:
```bash
npm run dev
```
The API is served locally at `http://localhost:5000/api`.

### 5. Run Quality Tests
Execute the Node.js native test suite:
```bash
npm test
```

## Security Design
* **Registration Role Safety:** Public registration forces the user's role to `student` regardless of payload injection.
* **Filter Security:** Public callers can only query `approved` or `past` events. Pending, rejected, and draft events are hidden behind authorization guards.
* **Token Protection:** Check-in credentials use secure cryptographically generated prefixes to prevent spoofing or unauthorized gate access.
