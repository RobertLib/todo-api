import { TodoModel } from "../models/todo.model.js";
import {
  TodoCreateDto,
  TodoUpdateDto,
  TodoResponseDto,
} from "../types/todo.types.js";
import { AppError } from "../middleware/error.middleware.js";
import { TodoPolicy } from "../policies/todo.policy.js";
import { AuthorizationHelper } from "../policies/authorization.helper.js";

export class TodoService {
  static async createTodo(
    userId: number,
    data: TodoCreateDto
  ): Promise<TodoResponseDto> {
    // Check authorization using policy
    AuthorizationHelper.authorize(
      TodoPolicy.canCreate(userId),
      "You are not authorized to create todos"
    );

    const todo = await TodoModel.create(userId, data);
    return this.mapToResponse(todo);
  }

  static async getUserTodos(userId: number): Promise<TodoResponseDto[]> {
    const todos = await TodoModel.findAllByUserId(userId);
    return todos.map((todo) => this.mapToResponse(todo));
  }

  static async getTodoById(
    todoId: number,
    userId: number
  ): Promise<TodoResponseDto> {
    const todo = await TodoModel.findById(todoId);

    if (!todo) {
      throw new AppError(404, "Todo not found");
    }

    // Check authorization using policy
    AuthorizationHelper.authorize(
      TodoPolicy.canView(userId, todo),
      "You are not authorized to view this todo"
    );

    return this.mapToResponse(todo);
  }

  static async updateTodo(
    todoId: number,
    userId: number,
    data: TodoUpdateDto
  ): Promise<TodoResponseDto> {
    // Check if todo exists
    const existingTodo = await TodoModel.findById(todoId);

    if (!existingTodo) {
      throw new AppError(404, "Todo not found");
    }

    // Check authorization using policy
    AuthorizationHelper.authorize(
      TodoPolicy.canUpdate(userId, existingTodo),
      "You are not authorized to update this todo"
    );

    // Update todo
    const updatedTodo = await TodoModel.update(todoId, data);

    if (!updatedTodo) {
      throw new AppError(500, "Failed to update todo");
    }

    return this.mapToResponse(updatedTodo);
  }

  static async deleteTodo(todoId: number, userId: number): Promise<void> {
    // Check if todo exists
    const todo = await TodoModel.findById(todoId);

    if (!todo) {
      throw new AppError(404, "Todo not found");
    }

    // Check authorization using policy
    AuthorizationHelper.authorize(
      TodoPolicy.canDelete(userId, todo),
      "You are not authorized to delete this todo"
    );

    // Delete todo
    const deleted = await TodoModel.delete(todoId);

    if (!deleted) {
      throw new AppError(500, "Failed to delete todo");
    }
  }

  private static mapToResponse(todo: any): TodoResponseDto {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      created_at: todo.created_at,
      updated_at: todo.updated_at,
    };
  }
}
