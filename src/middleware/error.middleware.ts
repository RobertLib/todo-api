import { Request, Response, NextFunction } from "express";
import logger from "../config/logger.js";

export class AppError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    this.name = "AppError";
  }
}

export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    logger.warn(
      {
        err,
        statusCode: err.statusCode,
        method: req.method,
        url: req.url,
        userId: (req as any).userId,
      },
      "Application error"
    );

    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  logger.error(
    {
      err,
      method: req.method,
      url: req.url,
      userId: (req as any).userId,
    },
    "Internal server error"
  );

  res.status(500).json({
    error: "Internal server error",
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  logger.warn(
    {
      method: req.method,
      url: req.url,
    },
    "Route not found"
  );

  res.status(404).json({
    error: "Route not found",
  });
}
