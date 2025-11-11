import { Router } from "express";
import { TodoController } from "../controllers/todo.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  apiLimiter,
  createTodoLimiter,
} from "../middleware/rate-limit.middleware.js";

const router = Router();

// All todo routes require authentication
router.use(authMiddleware);

// Apply rate limiters
router.post("/", createTodoLimiter, TodoController.create);
router.get("/", apiLimiter, TodoController.getAll);
router.get("/:id", apiLimiter, TodoController.getById);
router.patch("/:id", apiLimiter, TodoController.update);
router.delete("/:id", apiLimiter, TodoController.delete);

export default router;
