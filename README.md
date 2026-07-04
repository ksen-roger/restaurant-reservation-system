# Tavola — Restaurant Reservation Management System

A full-stack reservation system with role-based access (Customer / Admin), built with React, Node.js/Express, and MongoDB.

**Live Frontend:** https://restaurant-reservation-system-khaki.vercel.app
**Live Backend API:** https://tavola-backend.onrender.com/api
**GitHub Repo:** https://github.com/ksen-roger/restaurant-reservation-system

## Tech Stack
- **Frontend:** React (Vite) + React Router + Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose) — MongoDB Atlas in production, local MongoDB for development
- **Auth:** JWT
- **Deployment:** Render (backend), Vercel (frontend)

## Project Structure

restaurant-reservation/
├── backend/
│   ├── config/db.js
│   ├── models/              # User, Table, Reservation
│   ├── middleware/          # JWT auth, role guard, error handler
│   ├── controllers/
│   ├── routes/
│   └── server.js
└── frontend/
└── src/
├── api/axios.js
├── context/AuthContext.jsx
├── components/ProtectedRoute.jsx
└── pages/           # Login, Register, CustomerDashboard, AdminDashboard

## Setup Instructions (local development)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI (local: mongodb://127.0.0.1:27017/restaurant_db, or your own Atlas string)
# Fill in JWT_SECRET with any long random string
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm run dev
```

## Assumptions
- Single restaurant, fixed set of tables
- Reservations use **fixed time slots** (12:00–13:30, 13:30–15:00, 19:00–20:30, 20:30–22:00) rather than free-form times, to keep conflict detection simple and unambiguous
- A "conflict" is defined as: same table + same date + same time slot, with status `confirmed`
- **Admin accounts are provisioned manually, not through public registration.** The Register page always creates `role: "customer"` accounts — this is a deliberate security choice, not a limitation. Admin accounts are created by directly updating a user's `role` field to `"admin"` in the database (via MongoDB Atlas's Data Explorer, or `mongosh`), rather than exposing a role selector in the public sign-up form.

## Reservation & Availability Logic
1. On booking, the backend checks `guests <= table.capacity`.
2. It checks whether a **confirmed** reservation already exists for that `table + date + timeSlot` combination — if so, rejects with `409 Conflict`.
3. Dates are normalized to midnight UTC before comparison for exact matching.
4. Past dates are rejected.
5. Cancelling sets `status: "cancelled"` (soft delete) rather than removing the document, so the slot becomes bookable again and history is preserved for admins.

## Role-Based Access (Customer vs Admin)
- JWT issued on login/register, sent as `Authorization: Bearer <token>`.
- `protect` middleware verifies the token, attaches the user to `req.user`.
- `authorize('admin')` middleware checks `req.user.role` before allowing access to admin-only routes.
- Customers can only view/cancel their **own** reservations — enforced server-side by comparing `reservation.user` to `req.user._id`, not just hidden UI buttons.

## Known Limitations
- No email/SMS notifications
- No payment integration (out of scope per assignment)
- Fixed time slots rather than arbitrary start/end times
- Free-tier Render backend "spins down" after 15 minutes of inactivity — the first request after idle time may take 30-50 seconds to respond while it wakes up

## Areas for Improvement
- Refresh tokens / token expiry handling on the frontend
- Pagination on the admin reservations table
- Rate limiting on auth routes
- Automated tests (Jest/Supertest, React Testing Library)
- Table availability calendar view instead of a raw list
