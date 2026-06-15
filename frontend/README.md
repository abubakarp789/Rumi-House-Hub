# Rumi House Hub — Frontend Application

This is the React client application for Rumi House Hub, built with Vite, React Router, Tailwind CSS, a scoped Bootstrap 5 grid import, and GSAP.

## Getting Started

### 1. Installation
Install the development dependencies:
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file from the template:
```bash
cp .env.example .env
```
Ensure `VITE_API_BASE_URL` points to the active Express server (default: `http://localhost:5000/api`).

### 3. Development Server
Run Vite's fast dev server:
```bash
npm run dev
```
Open `http://localhost:5173` to view the portal.

### 4. Run Quality Tests
Execute Vitest suite run:
```bash
npm test
```

### 5. Production Build
Build the optimized production assets:
```bash
npm run build
```
The compiled output is saved under the `dist/` directory.

## Visual Design System
* **Primary Color (Atrium Green):** `#005026`
* **Secondary Color (Atrium Gold):** `#745b00`
* **Background (Atrium Cream):** `#faf9f6`
* **Typography:** `Playfair Display` for display headings and titles, `Inter` for layout labels and reading copy.
* **Layout Utilities:** Responsive grid and bento boxes aligned with Namal visual branding.
* **Bootstrap Scope:** Only `bootstrap-grid.min.css` is imported, before the project styles, and used for the Users & Roles summary grid. Existing Tailwind and custom CSS remain authoritative.
