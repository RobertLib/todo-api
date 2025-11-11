require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  const client = await pool.connect();

  try {
    console.log("🌱 Starting database seeding...");

    const seedFile = path.join(__dirname, "../database/seeds/seed.sql");
    const sql = fs.readFileSync(seedFile, "utf8");

    await client.query(sql);

    console.log("✅ Seeding completed successfully!");
    console.log("\nTest credentials:");
    console.log("  Email: test@example.com");
    console.log("  Password: password123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
