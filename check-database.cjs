const { Client } = require("pg");
require("dotenv").config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  console.log("\n=== DATABASE TABLES ===");
  const tables = await client.query(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `);
  console.table(tables.rows);

  console.log("\n=== PRISMA MIGRATION HISTORY ===");
  const migrations = await client.query(`
    SELECT migration_name, finished_at, rolled_back_at
    FROM public."_prisma_migrations"
    ORDER BY started_at;
  `);
  console.table(migrations.rows);

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
