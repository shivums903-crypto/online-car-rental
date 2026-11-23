# DriveEasy - Online Car Rental Management System

React + Node/Express + MySQL.

## Setup (Windows)
1. Import `database/driveeasy.sql` in MySQL Workbench (Server > Data Import, or open it and run all).
2. Edit `backend/.env` and set `DB_PASSWORD`.
3. Backend:   `cd backend`  -> `npm install` -> `npm run dev`   (http://localhost:5000)
4. Frontend:  `cd frontend` -> `npm install` -> `npm start`     (http://localhost:3000)

## Default admin (created on first backend start)
Email: admin@driveeasy.com  Password: admin123  (change it after first login)

## API
POST /api/auth/register, /api/auth/login
GET  /api/cars?type=&fuel=&maxPrice=&startDate=&endDate=
POST/PUT/DELETE /api/cars (admin)
POST /api/bookings, GET /api/bookings/mine, PUT /api/bookings/:id/cancel
GET /api/bookings (admin), PUT /api/bookings/:id/status (admin)
