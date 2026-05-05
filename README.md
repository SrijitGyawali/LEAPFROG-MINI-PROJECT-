# 🏥 Clinic Appointment Manager

A full-stack web application for booking and managing clinic appointments — built as a 1-day student project.

---

## 📸 Overview

Patients can browse doctors, book time slots, and manage their appointments. Clinic admins get a dedicated dashboard to track and update every booking. Double-bookings are blocked at the database level.

---

## 🎯 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6, Axios |
| Backend | Node.js, Express |
| Database | MongoDB (Atlas) + Mongoose |
| Auth | JWT + bcryptjs |

---

## 📁 Project Structure

```
clinic-appointment-manager/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Route handlers
│   ├── middleware/      # JWT protect + adminOnly
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── seed.js         # Database seeder
│   ├── server.js       # Entry point
│   └── .env.example
└── frontend/
    └── src/
        ├── api/        # Axios instance
        ├── components/ # Navbar, ProtectedRoute
        ├── context/    # AuthContext (JWT state)
        └── pages/      # All route pages
```

---

## 🔑 Features

1. **Auth** — Patient signup/login/logout · Admin login (seeded)
2. **Browse Doctors** — Grid of doctor cards with specialty and available slots
3. **Book Appointment** — Pick a date + time slot; double-booking rejected by DB unique index
4. **My Appointments** — Upcoming + past appointments; cancel with one click
5. **Admin Dashboard** — Table of all appointments; update status via dropdown

---

## 🗄️ Data Models

### User
```js
{ name, email (unique), password (bcrypt), role: "patient" | "admin" }
```

### Doctor
```js
{ name, specialty, availableSlots: [String] }
```

### Appointment
```js
{
  patient: ObjectId → User,
  doctor:  ObjectId → Doctor,
  date:    Date,
  slot:    String,   // e.g. "09:30"
  status:  "Pending" | "Confirmed" | "Cancelled" | "Completed"
}
// Unique compound index on { doctor, date, slot }
```

---

## 🌐 API Endpoints

```
POST   /api/auth/signup              Public   → { token, user }
POST   /api/auth/login               Public   → { token, user }

GET    /api/doctors                  Patient  → list of doctors
POST   /api/doctors                  Admin    → create doctor

GET    /api/appointments/me          Patient  → my appointments
POST   /api/appointments             Patient  → book { doctorId, date, slot }
PATCH  /api/appointments/:id/cancel  Patient  → cancel own appointment
GET    /api/appointments             Admin    → all appointments
PATCH  /api/appointments/:id/status  Admin    → update { status }
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1 · Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — paste your MongoDB Atlas URI and a JWT secret string
node seed.js        # Wipes DB and seeds admin + patient + 4 doctors
npm run dev         # Starts on http://localhost:5000
```

### 2 · Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev         # Starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## 🌱 Seed Data

After running `node seed.js`:

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| Patient | patient@clinic.com     | patient123  |
| Admin   | admin@clinic.com       | admin123    |

**4 Doctors seeded:**
- Dr. Sarah Mitchell — General Physician
- Dr. James Patel — Pediatrician
- Dr. Anika Sharma — Dermatologist
- Dr. Robert Chen — Cardiologist

Each with 10 slots: `09:00 → 11:30` and `14:00 → 15:30`

---

## ⚙️ Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/clinic?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string
```

---

## 🎨 Design System

The frontend follows a Cal.com-inspired design system:
- **Canvas:** `#ffffff` white background
- **Primary CTA:** `#111111` near-black buttons
- **Cards:** `#f5f5f5` light-gray surface cards
- **Footer:** `#101010` dark navy
- **Display font:** Manrope 600 (Cal Sans substitute) with negative letter-spacing
- **Body font:** Inter 400/500/600

---

