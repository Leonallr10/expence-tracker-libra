# Expense Tracker Server - Supabase + Prisma

This is the backend server for the Expense Tracker application, now using **Supabase (PostgreSQL)** as the database and **Prisma** as the ORM.

## Prerequisites

- Node.js (v16 or higher)
- A Supabase account and project
- Environment variables configured

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
PORT=5000
DATABASE_URL=postgresql://postgres.[YOUR_PROJECT_ID]:[YOUR_PASSWORD]@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
JWT_SECRET=your_secret_key_here
CLIENT_URL=https://expence-tracker-libra.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```

### 3. Run Migrations

The migrations will automatically run when you start the server, but you can also run them manually:

```bash
npm run migrate
```

This creates the `User` and `Expense` tables in your Supabase PostgreSQL database.

## Development

Start the development server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Production

Build and start for production:

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Expenses
- `GET /api/expenses` - Get all expenses for authenticated user
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/summary` - Get expense summary (total, by category, monthly, recent)

## Database Schema

### User Table
- `id` (SERIAL PRIMARY KEY)
- `name` (TEXT)
- `email` (TEXT UNIQUE)
- `password` (TEXT)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

### Expense Table
- `id` (SERIAL PRIMARY KEY)
- `title` (TEXT)
- `amount` (DOUBLE PRECISION)
- `category` (VARCHAR(50)) - food, transport, entertainment, bills, other
- `date` (TIMESTAMP)
- `userId` (INTEGER) - references User(id)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

## Prisma Commands

- `npm run prisma:studio` - Open Prisma Studio to view/edit database
- `npm run prisma:push` - Push schema changes to database (development only)
- `npm run prisma:migrate` - Run pending migrations

## Technologies

- **Express.js** - Web framework
- **Prisma** - ORM for PostgreSQL
- **Supabase** - Managed PostgreSQL database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
