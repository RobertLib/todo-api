import { Response, NextFunction } from "express";
import { TodoController } from "../../controllers/todo.controller.js";
import { TodoService } from "../../services/todo.service.js";
import { AuthRequest } from "../../types/auth.types.js";

// Mock TodoService
jest.mock("../../services/todo.service.js");

describe("TodoController", () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      userId: 1,
      body: {},
      params: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a todo successfully", async () => {
      mockRequest.body = {
        title: "Test Todo",
        description: "Test Description",
      };

      const mockTodo = {
        id: 1,
        title: "Test Todo",
        description: "Test Description",
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (TodoService.createTodo as jest.Mock).mockResolvedValue(mockTodo);

      await TodoController.create(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(TodoService.createTodo).toHaveBeenCalledWith(1, mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodo);
    });

    it("should return 401 when userId is missing", async () => {
      mockRequest.userId = undefined;

      await TodoController.create(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Unauthorized",
      });
    });

    it("should return 400 for invalid data", async () => {
      mockRequest.body = {
        description: "Missing title",
      };

      await TodoController.create(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ errors: expect.any(Array) })
      );
    });

    it("should call next with error on service failure", async () => {
      mockRequest.body = {
        title: "Test Todo",
      };

      const error = new Error("Service error");
      (TodoService.createTodo as jest.Mock).mockRejectedValue(error);

      await TodoController.create(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getAll", () => {
    it("should return all todos for user", async () => {
      const mockTodos = [
        {
          id: 1,
          title: "Todo 1",
          description: null,
          completed: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          title: "Todo 2",
          description: null,
          completed: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (TodoService.getUserTodos as jest.Mock).mockResolvedValue(mockTodos);

      await TodoController.getAll(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(TodoService.getUserTodos).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodos);
    });

    it("should return 401 when userId is missing", async () => {
      mockRequest.userId = undefined;

      await TodoController.getAll(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });

  describe("getById", () => {
    it("should return a specific todo", async () => {
      mockRequest.params = { id: "1" };

      const mockTodo = {
        id: 1,
        title: "Test Todo",
        description: "Test",
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (TodoService.getTodoById as jest.Mock).mockResolvedValue(mockTodo);

      await TodoController.getById(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(TodoService.getTodoById).toHaveBeenCalledWith(1, 1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodo);
    });

    it("should return 401 when userId is missing", async () => {
      mockRequest.userId = undefined;
      mockRequest.params = { id: "1" };

      await TodoController.getById(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 for invalid id", async () => {
      mockRequest.params = { id: "invalid" };

      await TodoController.getById(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe("update", () => {
    it("should update a todo successfully", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = {
        title: "Updated Title",
        completed: true,
      };

      const mockTodo = {
        id: 1,
        title: "Updated Title",
        description: null,
        completed: true,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (TodoService.updateTodo as jest.Mock).mockResolvedValue(mockTodo);

      await TodoController.update(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(TodoService.updateTodo).toHaveBeenCalledWith(
        1,
        1,
        mockRequest.body
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTodo);
    });

    it("should return 400 for invalid data", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = {}; // No fields to update

      await TodoController.update(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });

  describe("delete", () => {
    it("should delete a todo successfully", async () => {
      mockRequest.params = { id: "1" };

      (TodoService.deleteTodo as jest.Mock).mockResolvedValue(undefined);

      await TodoController.delete(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(TodoService.deleteTodo).toHaveBeenCalledWith(1, 1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
    });

    it("should return 401 when userId is missing", async () => {
      mockRequest.userId = undefined;
      mockRequest.params = { id: "1" };

      await TodoController.delete(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 for invalid id", async () => {
      mockRequest.params = { id: "invalid" };

      await TodoController.delete(
        mockRequest as AuthRequest,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });
  });
});
