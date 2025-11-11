import dotenv from "dotenv";
import { createApp } from "./app.js";
import pool from "./config/database.js";
import logger from "./config/logger.js";

// Load environment variables
dotenv.config();

// Validate required environment variables
function validateEnvironment(): void {
  const required = ["DATABASE_URL", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    logger.error({ missing }, "Missing required environment variables");
    process.exit(1);
  }

  // Warn if JWT_SECRET is too short
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    logger.warn(
      "JWT_SECRET is shorter than 32 characters. Consider using a longer secret for better security."
    );
  }

  // Warn if default CORS settings in production
  if (
    process.env.NODE_ENV === "production" &&
    (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === "*")
  ) {
    logger.warn(
      "CORS_ORIGIN is not set or set to '*' in production. This is a security risk."
    );
  }
}

const PORT = process.env.PORT || 3000;

const app = createApp();

// Test database connection
async function testDatabaseConnection(): Promise<void> {
  try {
    await pool.query("SELECT NOW()");
    logger.info("Database connected successfully");
  } catch (error) {
    logger.error({ err: error }, "Database connection failed");
    process.exit(1);
  }
}

// Start server
async function startServer(): Promise<void> {
  try {
    validateEnvironment();
    await testDatabaseConnection();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info(`API: http://localhost:${PORT}/api`);
      logger.info(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to start server");
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, closing server...");
  await pool.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, closing server...");
  await pool.end();
  process.exit(0);
});

startServer();
