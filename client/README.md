# Expense Tracker

Expense Tracker is a full-stack web app for managing personal expenses, viewing summaries, and tracking spending by category. The frontend is built with React + Vite and the backend is built with Express.js, Prisma, and PostgreSQL on Supabase.

## Project Overview

- Register and log in with JWT-based authentication
- Add, edit, delete, filter, and search expenses
- View dashboard summaries, category breakdowns, and recent activity
- Responsive UI for desktop and mobile use

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- Recharts
- Tailwind CSS

### Backend
- Node.js + Express.js
- Prisma ORM
- PostgreSQL (Supabase)
- JWT authentication
- bcryptjs for password hashing
- express-validator for request validation

## Deployment

### Frontend (Vercel)
- Production URL: https://expence-tracker-libra-o7cqegpb3-leonallr10s-projects.vercel.app
- Build command: npm run build
- Start command: npm run dev

### Backend (Render)
- Production URL: https://expence-tracker-libra.onrender.com
- Server runs with Express and Prisma
- Auto-migration script runs on startup

## Folder Structure

```text
expense-tracker/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── api/            # Axios config and API calls
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Login, register, dashboard, expenses
│   │   └── context/        # Auth and theme context
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/        # Auth and expense logic
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── prisma/             # Prisma schema and migrations
│   └── package.json
└── QUICK_REFERENCE.md      # Local setup and commands
```

## API Documentation

Base URL (local): http://localhost:5000/api
Base URL (production): https://expence-tracker-libra.onrender.com/api

### Authentication

#### POST /auth/register
Create a new user account.

Request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456"
}
```

Success response (201):
```json
{
  "token": "<jwt-token>",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Error response (400):
```json
{
  "message": "Email already registered"
}
```

#### POST /auth/login
Authenticate an existing user.

Request body:
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

Success response (200):
```json
{
  "token": "<jwt-token>",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Expenses

#### GET /expenses
Get all expenses for the logged-in user.

Query params:
- q: search by expense title
- category: filter by category
- month: filter by month in YYYY-MM format

Success response (200):
```json
[
  {
    "id": 1,
    "title": "Lunch",
    "amount": 25,
    "category": "food",
    "date": "2026-06-01T00:00:00.000Z",
    "userId": 1
  }
]
```

#### GET /expenses/summary
Get dashboard summary data.

Success response (200):
```json
{
  "total": 320.5,
  "byCategory": [
    { "category": "food", "total": 120 },
    { "category": "transport", "total": 80 }
  ],
  "monthly": [
    { "month": "2026-06", "total": 320.5 }
  ],
  "recent": []
}
```

#### POST /expenses
Create a new expense.

Request body:
```json
{
  "title": "Train ticket",
  "amount": 18.5,
  "category": "transport",
  "date": "2026-06-07"
}
```

Success response (201):
```json
{
  "id": 2,
  "title": "Train ticket",
  "amount": 18.5,
  "category": "transport",
  "date": "2026-06-07T00:00:00.000Z",
  "userId": 1
}
```

#### PUT /expenses/:id
Update an existing expense.

#### DELETE /expenses/:id
Delete an expense by ID.

## Request and Response Notes

- All protected expense routes require a Bearer token in the Authorization header.
- The frontend automatically attaches the token from localStorage.
- Validation errors return a JSON message such as:
```json
{ "message": "Valid email is required" }
```
- Server errors return:
```json
{ "message": "Server error" }
```

## Local Development

```bash
cd client
npm install
npm run dev
```

```bash
cd server
npm install
npm run dev
```

## Notes

- The frontend is deployed on Vercel.
- The backend API is deployed on Render.
- CORS is enabled for local development and deployed frontend origins.

