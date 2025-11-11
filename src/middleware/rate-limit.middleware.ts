import rateLimit from "express-rate-limit";
import logger from "../config/logger.js";

// General API rate limiter - more permissive
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(
      {
        ip: req.ip,
        method: req.method,
        url: req.url,
      },
      "Rate limit exceeded"
    );
    res.status(429).json({
      error: "Too many requests from this IP, please try again later",
    });
  },
});

// Stricter rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req, res) => {
    logger.warn(
      {
        ip: req.ip,
        method: req.method,
        url: req.url,
      },
      "Auth rate limit exceeded"
    );
    res.status(429).json({
      error: "Too many authentication attempts, please try again later",
    });
  },
});

// Rate limiter for creating todos - prevent spam
export const createTodoLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 todo creations per minute
  message: "Too many todos created, please slow down",
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(
      {
        ip: req.ip,
        userId: (req as any).userId,
      },
      "Todo creation rate limit exceeded"
    );
    res.status(429).json({
      error: "Too many todos created, please slow down",
    });
  },
});
