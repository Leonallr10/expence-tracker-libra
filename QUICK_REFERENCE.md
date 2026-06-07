# Quick Reference - Supabase + Prisma Setup

## 🚀 Getting Started

### 1. Setup Environment
```bash
cd server
npm install
echo 'DATABASE_URL=postgresql://...' > .env
```

### 2. Run Development Server
```bash
npm run dev
```
This automatically runs migrations and starts the server on port 5000.

### 3. Test the API
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"123456"}'

# Get expenses (requires Bearer token)
curl -X GET http://localhost:5000/api/expenses \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📚 Common Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server with auto-reload |
| `npm start` | Start production server |
| `npm run migrate` | Run database migrations manually |
| `npm run prisma:studio` | Open Prisma Studio GUI |

## 🗄️ Database Operations

### Add a New Column
1. Update `prisma/schema.prisma`
2. The migration script handles schema changes automatically

### Query Examples with Prisma

```javascript
const prisma = require('../config/prisma');

// Find user by email
const user = await prisma.user.findUnique({ where: { email } });

// Get expenses with filters
const expenses = await prisma.expense.findMany({
  where: { userId, category: 'food' },
  orderBy: { date: 'desc' },
});

// Group expenses by category
const byCategory = await prisma.expense.groupBy({
  by: ['category'],
  where: { userId },
  _sum: { amount: true },
});

// Update expense
await prisma.expense.update({
  where: { id },
  data: { title, amount, date },
});

// Delete expense
await prisma.expense.delete({ where: { id } });
```

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `server/prisma/schema.prisma` | Database schema definition |
| `server/config/prisma.js` | Prisma client singleton |
| `server/scripts/migrate.js` | Database migration script |
| `server/controllers/*.js` | Request handlers using Prisma |
| `.env` | Environment variables (local only) |

## 🚨 Common Issues

### Issue: "Database connection failed"
**Solution**: Check `DATABASE_URL` in `.env` file

### Issue: "Foreign key constraint error"
**Solution**: Ensure User is created before adding related Expenses

### Issue: "Port 5000 already in use"
**Solution**: Change `PORT` in `.env` or kill process using port 5000

## 📖 Useful Resources

- [Prisma Docs](https://www.prisma.io/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## 🔄 Migration to Production

1. Set `DATABASE_URL` in production environment
2. Ensure database is created on Supabase
3. Deploy server code
4. Server automatically runs migrations on startup

## 💡 Tips

- Use `npm run prisma:studio` to visually browse/edit data
- Check server logs for migration status
- Migrations are idempotent (safe to run multiple times)
- JWT tokens expire after 7 days - implement refresh if needed
