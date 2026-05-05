# Clinic Appointment Manager — Frontend

## Setup

```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000` (backend).

## Pages
- `/login` — login for patients and admin
- `/signup` — patient registration
- `/doctors` — browse doctors and book (patient)
- `/book/:doctorId` — select date + time slot
- `/my-appointments` — view and cancel appointments (patient)
- `/admin` — admin dashboard with status management
