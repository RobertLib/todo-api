import { TodoService } from "../../services/todo.service.js";
import { TodoModel } from "../../models/todo.model.js";
import { AppError } from "../../middleware/error.middleware.js";

// Mock TodoModel
jest.mock("../../models/todo.model.js");

describe("TodoService", () => {
  const mockUserId = 1;
  const mockTodo = {
    id: 1,
    user_id: mockUserId,
    title: "Test Todo",
    description: "Test Description",
    completed: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTodo", () => {
    it("should create a todo successfully", async () => {
      (TodoModel.create as jest.Mock).mockResolvedValue(mockTodo);

      const result = await TodoService.createTodo(mockUserId, {
        title: "Test Todo",
        description: "Test Description",
      });

      expect(result).toEqual({
        id: mockTodo.id,
        title: mockTodo.title,
        description: mockTodo.description,
        completed: mockTodo.completed,
        created_at: mockTodo.created_at,
        updated_at: mockTodo.updated_at,
      });
      expect(result).not.toHaveProperty("user_id");
    });

    it("should throw error for invalid user id", async () => {
      await expect(
        TodoService.createTodo(0, { title: "Test" })
      ).rejects.toThrow(AppError);
    });
  });

  describe("getUserTodos", () => {
    it("should return all user todos", async () => {
      const mockTodos = [mockTodo, { ...mockTodo, id: 2, title: "Todo 2" }];
      (TodoModel.findAllByUserId as jest.Mock).mockResolvedValue(mockTodos);

      const result = await TodoService.getUserTodos(mockUserId);

      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty("user_id");
      expect(TodoModel.findAllByUserId).toHaveBeenCalledWith(mockUserId);
    });

    it("should return empty array when no todos", async () => {
      (TodoModel.findAllByUserId as jest.Mock).mockResolvedValue([]);

      const result = await TodoService.getUserTodos(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe("getTodoById", () => {
    it("should return todo when user owns it", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue(mockTodo);

      const result = await TodoService.getTodoById(1, mockUserId);

      expect(result).toEqual({
        id: mockTodo.id,
        title: mockTodo.title,
        description: mockTodo.description,
        completed: mockTodo.completed,
        created_at: mockTodo.created_at,
        updated_at: mockTodo.updated_at,
      });
    });

    it("should throw 404 when todo not found", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(TodoService.getTodoById(999, mockUserId)).rejects.toThrow(
        "Todo not found"
      );
    });

    it("should throw 403 when user does not own todo", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue({
        ...mockTodo,
        user_id: 2,
      });

      await expect(TodoService.getTodoById(1, mockUserId)).rejects.toThrow(
        AppError
      );
    });
  });

  describe("updateTodo", () => {
    it("should update todo successfully", async () => {
      const updatedTodo = { ...mockTodo, title: "Updated Title" };
      (TodoModel.findById as jest.Mock).mockResolvedValue(mockTodo);
      (TodoModel.update as jest.Mock).mockResolvedValue(updatedTodo);

      const result = await TodoService.updateTodo(1, mockUserId, {
        title: "Updated Title",
      });

      expect(result.title).toBe("Updated Title");
      expect(TodoModel.update).toHaveBeenCalledWith(1, {
        title: "Updated Title",
      });
    });

    it("should throw 404 when todo not found", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(
        TodoService.updateTodo(999, mockUserId, { title: "New Title" })
      ).rejects.toThrow("Todo not found");
    });

    it("should throw 403 when user does not own todo", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue({
        ...mockTodo,
        user_id: 2,
      });

      await expect(
        TodoService.updateTodo(1, mockUserId, { title: "New Title" })
      ).rejects.toThrow(AppError);
    });
  });

  describe("deleteTodo", () => {
    it("should delete todo successfully", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue(mockTodo);
      (TodoModel.delete as jest.Mock).mockResolvedValue(true);

      await TodoService.deleteTodo(1, mockUserId);

      expect(TodoModel.delete).toHaveBeenCalledWith(1);
    });

    it("should throw 404 when todo not found", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue(null);

      await expect(TodoService.deleteTodo(999, mockUserId)).rejects.toThrow(
        "Todo not found"
      );
    });

    it("should throw 403 when user does not own todo", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue({
        ...mockTodo,
        user_id: 2,
      });

      await expect(TodoService.deleteTodo(1, mockUserId)).rejects.toThrow(
        AppError
      );
    });

    it("should throw 500 when delete fails", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue(mockTodo);
      (TodoModel.delete as jest.Mock).mockResolvedValue(false);

      await expect(TodoService.deleteTodo(1, mockUserId)).rejects.toThrow(
        "Failed to delete todo"
      );
    });
  });
});
