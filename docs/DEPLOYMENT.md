# Rumi House Hub Deployment Guide

This document describes how to deploy the **Rumi House Hub** full-stack MERN application to production.

## 1. MongoDB Atlas Setup
1. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free shared cluster (M0) in your preferred region.
3. Under **Database Access**, create a user with read/write privileges.
4. Under **Network Access**, whitelist the IP addresses of your hosting environments (or `0.0.0.0/0` for public serverless host access).
5. Copy the standard connection string (e.g. `mongodb+srv://...`).

## 2. Backend Deployment

The Node.js/Express backend can be deployed to Render, Railway, Heroku, or Google Cloud Run.

### Configuration Variables
Set these environment variables on your server console:
* `MONGODB_URI`: The MongoDB Atlas connection string.
* `JWT_SECRET`: A long cryptographically secure secret (minimum 32 characters).
* `PORT`: `5000` (or leave default if the platform overrides it).
* `NODE_ENV`: `production`.
* `CLIENT_ORIGIN`: Your deployed frontend domain URL (e.g. `https://rumi-house.vercel.app`).

### Startup Command
Define the startup command as:
```bash
npm start
```

---

## 3. Frontend Deployment

The React/Vite frontend can be deployed to Vercel, Netlify, or GitHub Pages.

### Production Build
Build the production bundle locally or inside the CI pipeline:
```bash
cd frontend
npm run build
```
This generates the optimized static assets in the `dist` directory.

### Configuration Variables
Define this env variable during building:
* `VITE_API_BASE_URL`: Your deployed backend API URL (e.g. `https://rumi-backend.onrender.com/api`).

---

## 4. Production Security Recommendations
1. Ensure all communications run over HTTPS.
2. Maintain strong password policies.
3. Configure CORS using the `CLIENT_ORIGIN` to deny unauthorized origin fetch requests.
4. Set rate limits on critical endpoints (e.g., authentication routes).
