import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import {
  validateRegister,
  validateLogin,
} from "../validators/auth.validator.js";

export class AuthController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Validate request body
      const validation = validateRegister(req.body);
      if (!validation.isValid()) {
        res.status(400).json({ errors: validation.getErrors() });
        return;
      }

      // Register user
      const result = await AuthService.register(req.body);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Validate request body
      const validation = validateLogin(req.body);
      if (!validation.isValid()) {
        res.status(400).json({ errors: validation.getErrors() });
        return;
      }

      // Login user
      const result = await AuthService.login(req.body.email, req.body.password);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
