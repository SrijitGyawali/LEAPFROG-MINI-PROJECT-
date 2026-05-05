# Clinic Appointment Manager — Backend

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — paste your MongoDB Atlas URI and a JWT_SECRET string
node seed.js      # seeds admin, patient, and 4 doctors
npm run dev       # starts on http://localhost:5000
```

## Credentials (after seed)
- Admin:   admin@clinic.com / admin123
- Patient: patient@clinic.com / patient123

## API
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/signup | — | Patient signup |
| POST | /api/auth/login | — | Login (patient or admin) |
| GET | /api/doctors | patient/admin | List doctors |
| POST | /api/doctors | admin | Add doctor |
| GET | /api/appointments/me | patient | My appointments |
| POST | /api/appointments | patient | Book appointment |
| PATCH | /api/appointments/:id/cancel | patient | Cancel own appointment |
| GET | /api/appointments | admin | All appointments |
| PATCH | /api/appointments/:id/status | admin | Update status |
