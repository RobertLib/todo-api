import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

router.post("/register", authLimiter, AuthController.register);
router.post("/login", authLimiter, AuthController.login);

export default router;
