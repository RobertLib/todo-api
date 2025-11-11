require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log("Starting database migration...");

    const migrationFile = path.join(
      __dirname,
      "../database/migrations/001_initial_schema.sql"
    );
    const sql = fs.readFileSync(migrationFile, "utf8");

    await client.query(sql);

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
