import { Request } from "express";

export interface AuthRequest extends Request {
  userId?: number;
}

export interface JwtPayload {
  userId: number;
}
