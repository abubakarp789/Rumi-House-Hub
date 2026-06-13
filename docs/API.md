# Rumi House Hub API Documentation

All API requests target the `/api` prefix and expect JSON payloads and responses.

## Authentication (`/api/auth`)

### Register User
* **URL:** `/api/auth/register`
* **Method:** `POST`
* **Access:** Public (forces `student` role)
* **Payload:**
  ```json
  {
    "name": "Jalal al-Din Rumi",
    "email": "rumi@namal.edu.pk",
    "registrationNumber": "NUM-BSCS-2022-41",
    "department": "Computer Science",
    "batch": "2022",
    "password": "securepassword123"
  }
  ```
* **Success Response (201):**
  ```json
  {
    "success": true,
    "user": {
      "_id": "603d7e8b61a6b4b4b4b4b4b4",
      "name": "Jalal al-Din Rumi",
      "email": "rumi@namal.edu.pk",
      "registrationNumber": "NUM-BSCS-2022-41",
      "role": "student",
      "department": "Computer Science",
      "batch": "2022"
    }
  }
  ```

### Login User
* **URL:** `/api/auth/login`
* **Method:** `POST`
* **Access:** Public
* **Payload:**
  ```json
  {
    "email": "student@namal.edu.pk",
    "password": "student123"
  }
  ```
* **Success Response (200):**
  ```json
  {
    "success": true,
    "token": "ey...",
    "user": {
      "_id": "603d7e8b61a6b4b4b4b4b4b4",
      "name": "Namal Student",
      "email": "student@namal.edu.pk",
      "role": "student"
    }
  }
  ```

### Get Current User Profile
* **URL:** `/api/auth/me`
* **Method:** `GET`
* **Access:** Private (Bearer Token)
* **Success Response (200):**
  ```json
  {
    "_id": "603d7e8b61a6b4b4b4b4b4b4",
    "name": "Namal Student",
    "email": "student@namal.edu.pk",
    "role": "student",
    "memberships": [...],
    "rsvps": [...]
  }
  ```

---

## Societies (`/api/societies`)

### Get All Societies
* **URL:** `/api/societies`
* **Method:** `GET`
* **Access:** Public (supports optional `?category=technical` query filter)
* **Success Response (200):**
  ```json
  [
    {
      "_id": "603d7e8b61a6b4b4b4b4b4b5",
      "name": "Namal Computing Society",
      "slug": "namal-computing-society",
      "description": "...",
      "patronName": "Dr. Sajid Mahmood",
      "facultyCoordinator": "Mr. Ali Raza",
      "category": "technical",
      "memberCount": 12,
      "executiveBody": [...]
    }
  ]
  ```

### Apply to Join a Society
* **URL:** `/api/societies/:id/join`
* **Method:** `POST`
* **Access:** Private (Student only)
* **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Membership request submitted successfully! Pending approval from Rumi Admin.",
    "membership": {
      "_id": "603d7e8b61a6b4b4b4b4b4c1",
      "userId": "603d7e8b61a6b4b4b4b4b4b4",
      "societyId": "603d7e8b61a6b4b4b4b4b4b5",
      "status": "pending"
    }
  }
  ```

---

## Events (`/api/events`)

### Get All Events
* **URL:** `/api/events`
* **Method:** `GET`
* **Access:** Public
* **Query Params:** `?status=upcoming` (default), `?status=past`
* **Success Response (200):**
  ```json
  [
    {
      "_id": "603d7e8b61a6b4b4b4b4b4e1",
      "title": "Namal Hackathon 2026",
      "description": "...",
      "type": "competition",
      "location": "Academic Block Lab 3",
      "startDateTime": "2026-06-12T09:00:00.000Z",
      "endDateTime": "2026-06-12T18:00:00.000Z",
      "capacity": 100,
      "registered": 42,
      "status": "approved",
      "societyId": {
        "name": "Namal Computing Society"
      }
    }
  ]
  ```

### RSVP to an Event
* **URL:** `/api/events/:id/rsvp`
* **Method:** `POST`
* **Access:** Private (Student only)
* **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "RSVP submitted successfully.",
    "rsvp": {
      "_id": "603d7e8b61a6b4b4b4b4b4d1",
      "eventId": "...",
      "userId": "...",
      "status": "going"
    },
    "registered": 43,
    "capacity": 100
  }
  ```

### Get Personal Event QR Pass
* **URL:** `/api/events/:id/qr`
* **Method:** `GET`
* **Access:** Private (Student with valid RSVP)
* **Success Response (200):**
  ```json
  {
    "eventId": "603d7e8b61a6b4b4b4b4b4e1",
    "qrUrl": "data:image/png;base64,...",
    "passId": "ABCD1234",
    "message": "Present this individual pass to an event organizer."
  }
  ```

---

## Attendance & Check-in (`/api/events/:id/attendance`)

### Verify Attendee Pass (Check-in)
* **URL:** `/api/events/:id/attendance/checkin`
* **Method:** `POST`
* **Access:** Private (Admin or Hosting Executive)
* **Payload:**
  ```json
  {
    "token": "{\"eventId\":\"603d7e8b61a6b4b4b4b4b4e1\",\"passToken\":\"pass_token_value_here\"}"
  }
  ```
* **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Attendance recorded successfully.",
    "attendance": {
      "_id": "603d7e8b61a6b4b4b4b4b4f1",
      "eventId": "603d7e8b61a6b4b4b4b4b4e1",
      "userId": "603d7e8b61a6b4b4b4b4b4b4",
      "checkInTime": "2026-06-12T09:15:00.000Z",
      "checkInMethod": "qr"
    }
  }
  ```

### Get Live Attendance List
* **URL:** `/api/events/:id/attendance`
* **Method:** `GET`
* **Access:** Private (Admin or Hosting Executive)
* **Success Response (200):**
  ```json
  [
    {
      "_id": "603d7e8b61a6b4b4b4b4b4f1",
      "eventId": "603d7e8b61a6b4b4b4b4b4e1",
      "userId": {
        "_id": "603d7e8b61a6b4b4b4b4b4b4",
        "name": "Jalal al-Din Rumi",
        "email": "rumi@namal.edu.pk",
        "registrationNumber": "NUM-BSCS-2022-41",
        "department": "Computer Science",
        "batch": "2022"
      },
      "checkInTime": "2026-06-12T09:15:00.000Z",
      "checkInMethod": "qr"
    }
  ]
  ```

---

## News / Announcements (`/api/news`)

### Get All Bulletins
* **URL:** `/api/news`
* **Method:** `GET`
* **Access:** Public
* **Success Response (200):**
  ```json
  [
    {
      "_id": "603d7e8b61a6b4b4b4b4b4a1",
      "title": "Welcome to Rumi House Hub",
      "summary": "...",
      "content": "...",
      "category": "events",
      "publishedAt": "2026-06-12T12:00:00.000Z",
      "publishedBy": {
        "name": "Admin"
      }
    }
  ]
  ```
