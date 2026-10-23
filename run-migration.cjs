
const fs = require("node:fs");
const path = require("node:path");
const { Client } = require("pg");

async function main() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is missing.");
  }

  const sqlPath = path.join(
    process.cwd(),
    "prisma",
    "migrations",
    "20261013210000_restore_content_management",
    "migration.sql"
  );

  const sql = fs.readFileSync(sqlPath, "utf8");
  const client = new Client({ connectionString });

  await client.connect();

  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
    console.log("Migration SQL executed successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
});
