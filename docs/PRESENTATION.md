# Project Presentation: Rumi House Hub

This document contains the slide-by-slide content for your WAD Course Project Presentation. You can copy and paste these slides directly into Microsoft PowerPoint, Google Slides, or use a markdown-based presentation tool like Marp.

---

## Slide 1: Title Slide
### **Rumi House Hub**
*A Full-Stack MERN Portal for Namal University Student Engagement & Co-Curricular Operations*

* **Presented By:** Abu Bakar
* **Registration Number:** NUM-BSCS-2022-41
* **Course:** Web Application Development (WAD)
* **Institution:** Namal University, Mianwali

---

## Slide 2: Problem Statement
### **Challenges in Campus Co-Curricular Management**
* **Scattered Information:** No centralized digital calendar for campus events, causing students to miss important workshops and seminars.
* **Manual Approvals:** Executive club officers submit event proposals and membership requests via slow, paper-based administrative pipelines.
* **Overcrowded Venues:** Events exceed venue safety limits because there are no mechanisms for dynamic capacity checks or seat caps.
* **Unsecured Gate Checking:** Attendance verification relies on manual paper rosters, causing bottlenecks and allowing unauthorized entries.

---

## Slide 3: Objectives
### **What Rumi House Hub Aims to Solve**
1. **Unify Operations:** Create a single, role-restricted dashboard portal for students, executives, and administrators.
2. **Automate Society Enrollment:** Provide a simple "Join" button for societies with secure admin approval sheets.
3. **Capacity-Safe RSVP System:** Let students reserve seats dynamically; reservations are automatically capped at the event's capacity.
4. **Fast & Secure Check-in:** Generate unique digital QR passes for registered students, scanned instantly by organizers at the door.

---

## Slide 4: Target Users
### **Designed for Three Core Roles**
* **1. Students:**
  * Browse societies, apply to join clubs, RSVP to upcoming events, and view active QR entry passes.
* **2. Society Executives:**
  * Propose co-curricular events, view live attendance check-in sheets, and verify attendee tickets.
* **3. Administrators (Rumi Admin):**
  * Retain moderation rights to approve/reject events and membership applications, manage roles, and publish news bulletins.

---

## Slide 5: Technologies Used
### **Modern MERN Stack & Testing Ecosystem**
* **Frontend:**
  * **React 18** & **Vite** (Vibrant, modular Single Page App)
  * **React Router 6** (Dynamic client routing and redirects)
  * **Tailwind CSS & Custom CSS** (Primary responsive visual system)
  * **Bootstrap 5 Grid** (Scoped use in the administrative registry summary)
* **Backend:**
  * **Node.js** & **Express.js** (REST API endpoints)
* **Database:**
  * **MongoDB** & **Mongoose** (Relationship schemas & indexing)
* **Security & Quality:**
  * **JSON Web Tokens (JWT)** & **Bcrypt** password hashing
  * **Vitest** (30 frontend unit tests)
  * **Node Native Runner** (38 backend tests)

---

## Slide 6: System Architecture
### **Three-Tier Data Flow**
```text
  ┌──────────────────────────────────────────────────────────┐
  │                   React Client App (Vite)                │
  │     - React Router 6   - AuthContext & Token Storage     │
  └────────────────────────────┬─────────────────────────────┘
                               │ HTTP JSON requests
                               ▼
  ┌──────────────────────────────────────────────────────────┐
  │                 Node.js / Express Server                 │
  │     - Route Controllers  - JWT Authorization Guards      │
  └────────────────────────────┬─────────────────────────────┘
                               │ Mongoose ODM
                               ▼
  ┌──────────────────────────────────────────────────────────┐
  │                      MongoDB Database                    │
  │     - 7 Schema Collections    - Atomic Capacity Logic    │
  └──────────────────────────────────────────────────────────┘
```
* **Stateless Auth:** Client persists JWTs in `localStorage` and embeds them in HTTP `Authorization` headers.
* **Secure Gate Guards:** Requests check user roles (`student`, `executive`, `admin`) on both client and server sides.

---

## Slide 7: Database Overview
### **Mongoose Schemas & Data Model**
* **`User`**: Names, department, batches, hashed passwords, and roles.
* **`Society`**: Name, description, patron name, member counts, and executive body object arrays.
* **`Membership`**: Tracks club membership requests (`pending`, `approved`, `rejected`).
* **`Event`**: Title, location, capacity, registration count, and status (`draft`, `pendingApproval`, `approved`, `rejected`, `past`).
* **`RSVP`**: Compound index checks preventing duplicate tickets; contains secure `passToken`.
* **`Attendance`**: Verified entry logs mapping `eventId` and `userId`.
* **`News`**: Bulletins published by Admins.

---

## Slide 8: Major Features - Student Portal
### **Seamless Student Interface**
* **Society Directory:** Browse active societies and apply to join with a single click.
* **Interactive Events Hub:** View upcoming approved events and see real-time seat availability.
* **Digital Pass Generator:** View a personalized QR gate pass showing a dynamic token representation unique to the RSVP.
* **News Archives:** Read co-curricular news and announcements published by the administration.

---

## Slide 9: Major Features - Organizer & Admin Portals
### **Executive Panel & Admin Tools**
* **Co-Curricular Proposal Form:** Executives input event title, description, category type, location, start/end dates, and seat capacity.
* **Roster Check-in Portal:** Executives can check in students manually by entering pass keys, or view a real-time list of checked-in attendees.
* **Administrative Approvals:** Admins accept or reject event drafts (providing reasons) and review pending society memberships.
* **Role Promotions:** Admins search user lists and promote students to executive organizers.
* **News Bulletin Creator:** Admins publish announcements immediately.
* **Complete CRUD Workflows:** Authorized users can edit and delete societies, event proposals, bulletins, accounts, memberships, RSVPs, and incorrect attendance records.

---

## Slide 10: Robust Validation & Security
### **Strict Client & Server Controls**
* **Institutional Domain Locking:** Public sign-up is locked to `@namal.edu.pk` emails.
* **Regex Input Enforcement:** Student registration numbers must match the format `NUM-DEPT-YYYY-ID` (e.g. `NUM-BSCS-2022-41`).
* **Date & Capacity Assertions:** Event creation verifies end dates are after start dates and capacity is a positive integer.
* **Race Condition Protection:** Event RSVPs use atomic updates (`$inc`) to prevent over-booking when multiple students register for the final seat simultaneously.

---

## Slide 11: Demonstration Screenshots
### **Interactive System UI**
The project repository includes actual screenshots of the running application under `docs/screenshots`.
* **Login & Registration:** Clean, modern institutional portal with real-time validation alerts.
* **Student Dashboard:** View of registered events, active memberships, and the interactive QR code gate pass modal.
* **Admin Dashboard:** Moderation tables for approving events and student society enrollments.
* **Executive Dashboard:** Check-in scanner interface and live attendance rosters.

---

## Slide 12: Challenges Faced & Solutions
1. **Database Race Conditions:**
   * *Problem:* Two users booking the same final seat at the exact same millisecond could bypass capacity caps.
   * *Solution:* Implemented conditional atomic seat increments and immediate RSVP rollback when the final capacity check fails.
2. **Secure Pass Verification:**
   * *Problem:* Preventing students from fabricating passes by simply copy-pasting code parameters.
   * *Solution:* Generated randomized, database-stored `passToken` strings that are verified at the gate.
3. **Navigation Redirect Loops:**
   * *Problem:* Keeping users logged in while enforcing route guards.
   * *Solution:* Implemented a role-aware `RoleRoute` context that checks auth states dynamically.

---

## Slide 13: Future Enhancements
* **Nodemailer Integration:** Trigger automatic emails when an event is approved or when a membership application is accepted.
* **Webcam Scanning:** Embed a live QR webcam scanner on the Executive dashboard page to scan passes using a mobile/laptop camera.
* **Budget Tracking:** Add financial worksheets inside the dashboard so societies can track budgets and expenses.

---

## Slide 14: Conclusion
### **Summary of Outcomes**
* **Rumi House Hub** is a secure, responsive, and robust student portal built using standard MERN technologies.
* Fully meets all course project criteria: RESTful APIs, client-side validation, database integration, and role guards.
* Provides a complete, tested software engineering solution for Namal University's co-curricular operations.
