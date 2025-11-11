import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types.js";
import { TodoService } from "../services/todo.service.js";
import {
  validateCreateTodo,
  validateUpdateTodo,
} from "../validators/todo.validator.js";

export class TodoController {
  static async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // Validate request body
      const validation = validateCreateTodo(req.body);
      if (!validation.isValid()) {
        res.status(400).json({ errors: validation.getErrors() });
        return;
      }

      // Create todo
      const todo = await TodoService.createTodo(req.userId, req.body);

      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  }

  static async getAll(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // Get all todos for user
      const todos = await TodoService.getUserTodos(req.userId);

      res.status(200).json(todos);
    } catch (error) {
      next(error);
    }
  }

  static async getById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const todoId = parseInt(req.params.id);
      if (isNaN(todoId)) {
        res.status(400).json({ error: "Invalid todo ID" });
        return;
      }

      // Get todo
      const todo = await TodoService.getTodoById(todoId, req.userId);

      res.status(200).json(todo);
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const todoId = parseInt(req.params.id);
      if (isNaN(todoId)) {
        res.status(400).json({ error: "Invalid todo ID" });
        return;
      }

      // Validate request body
      const validation = validateUpdateTodo(req.body);
      if (!validation.isValid()) {
        res.status(400).json({ errors: validation.getErrors() });
        return;
      }

      // Update todo
      const todo = await TodoService.updateTodo(todoId, req.userId, req.body);

      res.status(200).json(todo);
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const todoId = parseInt(req.params.id);
      if (isNaN(todoId)) {
        res.status(400).json({ error: "Invalid todo ID" });
        return;
      }

      // Delete todo
      await TodoService.deleteTodo(todoId, req.userId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
