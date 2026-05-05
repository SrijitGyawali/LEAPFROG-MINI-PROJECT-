# Clinic Appointment Manager

**Leapfrog Student Partnership Program — Mini Project Submission**
**Project:** Clinic Appointment Manager
**Author:** Srijit Gyawali

---

## Business Need

Patients today still rely on phone calls, walk-ins, or third-party apps to schedule clinic visits — a process that is slow, error-prone, and unavailable outside office hours. Clinic staff manually track appointments on spreadsheets or basic tools with no real-time visibility into booking conflicts.

**This application solves three core problems:**

- Patients cannot book appointments digitally without calling the clinic
- Double-bookings happen because there is no system-level conflict prevention
- Clinic admins have no centralised view to track and update appointment statuses

The Clinic Appointment Manager gives patients a self-service portal to find doctors, pick available time slots, and manage their bookings — while giving clinic staff a dedicated admin dashboard to oversee all appointments in real time.

---

## Requirements

### Functional Requirements

| # | Requirement |
|---|-------------|
| FR-1 | A patient must be able to register an account, log in, and log out securely |
| FR-2 | A logged-in patient must be able to browse available doctors by specialty, select a date and time slot, and confirm a booking |
| FR-3 | The system must prevent double-booking — two patients cannot book the same doctor on the same date and slot; the second attempt must be rejected with a clear error |
| FR-4 | A patient must be able to view their upcoming and past appointments and cancel an upcoming one |
| FR-5 | An admin must be able to log in and view all appointments across all patients, then update each appointment's status (Pending → Confirmed → Completed / Cancelled) |

### Non-Functional Requirements

| # | Requirement |
|---|-------------|
| NFR-1 | **Security** — Passwords must be stored as bcrypt hashes (never plaintext); all protected API routes must validate a signed JWT before processing the request |
| NFR-2 | **Reliability** — The double-booking constraint must be enforced at the database level (unique compound index) so it holds even under concurrent requests, not just at the application layer |

---

## User Stories

### User Story 1 — Patient Registration & Login

> **As a** new patient,
> **I want to** create an account with my name, email, and password and then sign in,
> **So that** I can access the appointment booking features securely.

**Acceptance Criteria:**
- Registration fails with a clear message if the email is already taken
- Password is never stored in plain text
- On successful login, the system issues a JWT that is used for all subsequent requests
- An invalid email or wrong password returns a 401 with the message "Invalid credentials"

---

### User Story 2 — Book an Appointment

> **As a** logged-in patient,
> **I want to** browse doctors by specialty, pick an available date and time slot, and confirm my booking,
> **So that** I can schedule a clinic visit without calling the front desk.

**Acceptance Criteria:**
- The doctor list shows each doctor's name, specialty, and available time slots
- The date picker only allows future dates
- Selecting a slot and confirming creates an appointment with status "Pending"
- If the slot is already taken, the system returns a 409 error: "That slot is already booked for this doctor on this date"
- The confirmed appointment immediately appears in the patient's appointments list

---

### User Story 3 — Admin Status Management

> **As a** clinic admin,
> **I want to** see all appointments in a single dashboard and update their status,
> **So that** I can confirm, complete, or cancel bookings and keep the clinic schedule accurate.

**Acceptance Criteria:**
- The admin dashboard displays patient name, doctor, date, time slot, and current status for every appointment
- Admin can update status to: Pending, Confirmed, Completed, or Cancelled
- The table can be filtered by status to quickly find pending appointments
- Only users with the "admin" role can access this dashboard; patients are redirected

---

## Tech Stack Decision

| Layer | Technology | Reasoning |
|-------|-----------|-----------|
| **Frontend** | React 18 + Vite | React's component model fits a multi-page app with shared auth state. Vite gives near-instant HMR in development with minimal config overhead |
| **Routing** | React Router v6 | Industry-standard client-side routing; nested route protection via a `ProtectedRoute` wrapper pattern |
| **Styling** | Tailwind CSS | Utility-first CSS eliminates context-switching between files; responsive design is handled inline without writing custom media queries |
| **HTTP Client** | Axios | Interceptors allow the JWT to be attached to every request in one place rather than in each component |
| **Backend** | Node.js + Express | JavaScript across the full stack reduces mental overhead; Express is minimal and easy to structure by feature (routes → controllers → models) |
| **Database** | MongoDB Atlas + Mongoose | Document model maps naturally to the appointment schema. A unique compound index on `{ doctor, date, slot }` enforces the no-double-booking rule at the DB engine level — a constraint that cannot be bypassed by application bugs |
| **Auth** | JWT + bcryptjs | Stateless JWT auth fits a REST API well (no session store needed). bcrypt's adaptive cost factor protects passwords against brute-force if the DB is ever leaked |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        BROWSER                          │
│                                                         │
│   React SPA (Vite)                                      │
│   ├── React Router  →  page-level route guards          │
│   ├── AuthContext   →  JWT stored in localStorage       │
│   └── Axios instance → Authorization: Bearer <token>   │
└───────────────────────┬─────────────────────────────────┘
                        │  HTTP/JSON  (port 5173 dev proxy)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                        │
│                    (Node.js · port 5000)                 │
│                                                         │
│   Middleware layer                                      │
│   ├── cors()          → allow frontend origin           │
│   ├── express.json()  → parse request bodies            │
│   ├── protect()       → verify JWT, attach req.user     │
│   └── adminOnly()     → guard admin-only routes         │
│                                                         │
│   Route handlers                                        │
│   ├── POST  /api/auth/signup   /login                   │
│   ├── GET   /api/doctors                                │
│   ├── POST  /api/appointments                           │
│   ├── GET   /api/appointments/me                        │
│   ├── PATCH /api/appointments/:id/cancel                │
│   ├── GET   /api/appointments        (admin)            │
│   └── PATCH /api/appointments/:id/status  (admin)       │
└───────────────────────┬─────────────────────────────────┘
                        │  Mongoose ODM (TCP)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  MONGODB ATLAS (cloud)                   │
│                                                         │
│   Collections                                           │
│   ├── users        { name, email, passwordHash, role }  │
│   ├── doctors      { name, specialty, slots[] }         │
│   └── appointments { patient, doctor, date, slot,       │
│                      status }                           │
│                      ↳ unique index: {doctor,date,slot} │
└─────────────────────────────────────────────────────────┘
```

### Request Flow (Booking Example)

```
Patient clicks "Confirm Booking"
  → Axios POST /api/appointments  { doctorId, date, slot }
    → protect() middleware verifies JWT
      → appointmentController.bookAppointment()
        → normalize date to midnight UTC
          → Appointment.create()  ← Mongoose
            → MongoDB checks unique index { doctor, date, slot }
              ✓ Insert succeeds  → 201 + appointment object
              ✗ Duplicate key    → 409 "Slot already booked"
```

---

## Sprint 1 Backlog

| Priority | Task | Description |
|----------|------|-------------|
| 1 | **Project scaffolding** | Initialise Express backend and Vite + React frontend; wire up folder structure, environment variables, and MongoDB connection |
| 2 | **Auth module** | Build User model with bcrypt hashing, JWT sign/verify helpers, signup + login controllers, and the `protect` / `adminOnly` middleware |
| 3 | **Doctor & Appointment models** | Define Mongoose schemas; add the unique compound index on `{ doctor, date, slot }`; seed 4 doctors and test credentials |
| 4 | **Booking API** | Implement all appointment endpoints (create, list-mine, cancel, list-all, update-status); write manual tests via Postman or curl |
| 5 | **Core frontend pages** | Build Login, Signup, Doctors list, and Book Appointment pages with the Axios instance and AuthContext; verify the full patient booking flow end-to-end |

---

## Project Setup

### Prerequisites
- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### Backend

```bash
cd backend
npm install
cp .env.example .env        # fill in MONGO_URI and JWT_SECRET
node seed.js                # seed admin, patient, and 4 doctors
npm run dev                 # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@clinic.com | patient123 |
| Admin | admin@clinic.com | admin123 |

---

## API Reference

```
POST   /api/auth/signup              →  { token, user }
POST   /api/auth/login               →  { token, user }

GET    /api/doctors           [auth] →  doctor[]
POST   /api/doctors          [admin] →  doctor

GET    /api/appointments/me  [auth]  →  appointment[]
POST   /api/appointments     [auth]  →  appointment
PATCH  /api/appointments/:id/cancel  →  appointment
GET    /api/appointments     [admin] →  appointment[]
PATCH  /api/appointments/:id/status  →  appointment
```
