require('dotenv').config();
const { Client } = require('pg');

const USER_TABLE_SQL = `
  CREATE TABLE "User" (
      "id" SERIAL NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

const EXPENSE_TABLE_SQL = `
  CREATE TABLE "Expense" (
      "id" SERIAL NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "amount" DOUBLE PRECISION NOT NULL,
      "category" VARCHAR(50) NOT NULL,
      "date" TIMESTAMP NOT NULL,
      "userId" INTEGER NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`;

const quoteIdentifier = (name) => `"${name.replace(/"/g, '""')}"`;

const tableExists = async (client, tableName) => {
  const result = await client.query(
    `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1) AS exists`,
    [tableName]
  );
  return result.rows[0].exists;
};

const getColumnInfo = async (client, tableName, columnName) => {
  const result = await client.query(
    `SELECT data_type, column_default FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1 AND column_name = $2`,
    [tableName, columnName]
  );
  return result.rows[0] || null;
};

const renameTable = async (client, tableName) => {
  const backupName = `${tableName}_backup_${Date.now()}`;
  console.log(`✱ Renaming incompatible table "${tableName}" to "${backupName}"`);
  await client.query(`ALTER TABLE ${quoteIdentifier(tableName)} RENAME TO ${quoteIdentifier(backupName)}`);
};

async function runMigrations() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Connecting to Supabase database...');
    await client.connect();
    console.log('✓ Connected to Supabase!');

    if (await tableExists(client, 'User')) {
      const idInfo = await getColumnInfo(client, 'User', 'id');
      const hasValidId = idInfo && idInfo.data_type === 'integer' && idInfo.column_default;
      if (!hasValidId) {
        await renameTable(client, 'User');
        console.log('Recreating User table with expected schema...');
        await client.query(USER_TABLE_SQL);
      } else {
        console.log('User table schema appears valid. Leaving it in place.');
      }
    } else {
      console.log('Creating User table...');
      await client.query(USER_TABLE_SQL);
    }

    if (await tableExists(client, 'Expense')) {
      const idInfo = await getColumnInfo(client, 'Expense', 'id');
      const userIdInfo = await getColumnInfo(client, 'Expense', 'userId');
      const hasValidExpense =
        idInfo && idInfo.data_type === 'integer' && idInfo.column_default &&
        userIdInfo && userIdInfo.data_type === 'integer';

      if (!hasValidExpense) {
        await renameTable(client, 'Expense');
        console.log('Recreating Expense table with expected schema...');
        await client.query(EXPENSE_TABLE_SQL);
      } else {
        console.log('Expense table schema appears valid. Leaving it in place.');
      }
    } else {
      console.log('Creating Expense table...');
      await client.query(EXPENSE_TABLE_SQL);
    }

    console.log('Creating index...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS "Expense_userId_date_idx" ON "Expense"("userId", "date")
    `);
    console.log('✓ Index created!');

    console.log('✓ All migrations applied successfully!');
  } catch (error) {
    console.error('✗ Migration error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
