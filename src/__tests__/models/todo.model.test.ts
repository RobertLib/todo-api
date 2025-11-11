import { TodoModel } from "../../models/todo.model.js";
import pool from "../../config/database.js";
import { Todo, TodoCreateDto, TodoUpdateDto } from "../../types/todo.types.js";

// Mock the database pool
jest.mock("../../config/database.js", () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

const mockPool = pool as jest.Mocked<typeof pool> & {
  query: jest.MockedFunction<typeof pool.query>;
};

describe("TodoModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new todo with title and description", async () => {
      const userId = 1;
      const data: TodoCreateDto = {
        title: "Test Todo",
        description: "Test Description",
      };

      const mockTodo: Todo = {
        id: 1,
        user_id: userId,
        title: data.title,
        description: data.description || null,
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockTodo],
        command: "INSERT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.create(userId, data);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO todos"),
        [userId, data.title, data.description]
      );
      expect(result).toEqual(mockTodo);
    });

    it("should create a new todo with null description when not provided", async () => {
      const userId = 1;
      const data: TodoCreateDto = {
        title: "Test Todo",
      };

      const mockTodo: Todo = {
        id: 1,
        user_id: userId,
        title: data.title,
        description: null,
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockTodo],
        command: "INSERT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.create(userId, data);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO todos"),
        [userId, data.title, null]
      );
      expect(result).toEqual(mockTodo);
    });
  });

  describe("findAllByUserId", () => {
    it("should return all todos for a user", async () => {
      const userId = 1;
      const mockTodos: Todo[] = [
        {
          id: 1,
          user_id: userId,
          title: "Todo 1",
          description: "Description 1",
          completed: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          user_id: userId,
          title: "Todo 2",
          description: null,
          completed: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: mockTodos,
        command: "SELECT",
        rowCount: 2,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.findAllByUserId(userId);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM todos"),
        [userId]
      );
      expect(result).toEqual(mockTodos);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when user has no todos", async () => {
      const userId = 1;

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [],
        command: "SELECT",
        rowCount: 0,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.findAllByUserId(userId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe("findById", () => {
    it("should return a todo by id", async () => {
      const todoId = 1;
      const mockTodo: Todo = {
        id: todoId,
        user_id: 1,
        title: "Test Todo",
        description: "Test Description",
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockTodo],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.findById(todoId);

      expect(mockPool.query).toHaveBeenCalledWith(
        "SELECT * FROM todos WHERE id = $1",
        [todoId]
      );
      expect(result).toEqual(mockTodo);
    });

    it("should return null when todo not found", async () => {
      const todoId = 999;

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [],
        command: "SELECT",
        rowCount: 0,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.findById(todoId);

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update todo title", async () => {
      const todoId = 1;
      const data: TodoUpdateDto = {
        title: "Updated Title",
      };

      const mockUpdatedTodo: Todo = {
        id: todoId,
        user_id: 1,
        title: data.title!,
        description: "Old Description",
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockUpdatedTodo],
        command: "UPDATE",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.update(todoId, data);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE todos"),
        [data.title, todoId]
      );
      expect(result).toEqual(mockUpdatedTodo);
    });

    it("should update todo description", async () => {
      const todoId = 1;
      const data: TodoUpdateDto = {
        description: "Updated Description",
      };

      const mockUpdatedTodo: Todo = {
        id: todoId,
        user_id: 1,
        title: "Old Title",
        description: data.description!,
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockUpdatedTodo],
        command: "UPDATE",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.update(todoId, data);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE todos"),
        [data.description, todoId]
      );
      expect(result).toEqual(mockUpdatedTodo);
    });

    it("should update todo completed status", async () => {
      const todoId = 1;
      const data: TodoUpdateDto = {
        completed: true,
      };

      const mockUpdatedTodo: Todo = {
        id: todoId,
        user_id: 1,
        title: "Test Todo",
        description: "Test Description",
        completed: data.completed!,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockUpdatedTodo],
        command: "UPDATE",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.update(todoId, data);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE todos"),
        [data.completed, todoId]
      );
      expect(result).toEqual(mockUpdatedTodo);
    });

    it("should update multiple fields at once", async () => {
      const todoId = 1;
      const data: TodoUpdateDto = {
        title: "Updated Title",
        description: "Updated Description",
        completed: true,
      };

      const mockUpdatedTodo: Todo = {
        id: todoId,
        user_id: 1,
        title: data.title!,
        description: data.description!,
        completed: data.completed!,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockUpdatedTodo],
        command: "UPDATE",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.update(todoId, data);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("UPDATE todos"),
        [data.title, data.description, data.completed, todoId]
      );
      expect(result).toEqual(mockUpdatedTodo);
    });

    it("should return existing todo when no fields to update", async () => {
      const todoId = 1;
      const data: TodoUpdateDto = {};

      const mockTodo: Todo = {
        id: todoId,
        user_id: 1,
        title: "Test Todo",
        description: "Test Description",
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockTodo],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.update(todoId, data);

      expect(mockPool.query).toHaveBeenCalledWith(
        "SELECT * FROM todos WHERE id = $1",
        [todoId]
      );
      expect(result).toEqual(mockTodo);
    });

    it("should return null when todo not found during update", async () => {
      const todoId = 999;
      const data: TodoUpdateDto = {
        title: "Updated Title",
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [],
        command: "UPDATE",
        rowCount: 0,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.update(todoId, data);

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete a todo and return true", async () => {
      const todoId = 1;

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [],
        command: "DELETE",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.delete(todoId);

      expect(mockPool.query).toHaveBeenCalledWith(
        "DELETE FROM todos WHERE id = $1",
        [todoId]
      );
      expect(result).toBe(true);
    });

    it("should return false when todo not found", async () => {
      const todoId = 999;

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [],
        command: "DELETE",
        rowCount: 0,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.delete(todoId);

      expect(result).toBe(false);
    });

    it("should return false when rowCount is null", async () => {
      const todoId = 1;

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [],
        command: "DELETE",
        rowCount: null,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.delete(todoId);

      expect(result).toBe(false);
    });
  });

  describe("belongsToUser", () => {
    it("should return true when todo belongs to user", async () => {
      const todoId = 1;
      const userId = 1;

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ exists: true }],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.belongsToUser(todoId, userId);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT EXISTS"),
        [todoId, userId]
      );
      expect(result).toBe(true);
    });

    it("should return false when todo does not belong to user", async () => {
      const todoId = 1;
      const userId = 2;

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ exists: false }],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.belongsToUser(todoId, userId);

      expect(result).toBe(false);
    });

    it("should return false when todo does not exist", async () => {
      const todoId = 999;
      const userId = 1;

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ exists: false }],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await TodoModel.belongsToUser(todoId, userId);

      expect(result).toBe(false);
    });
  });
});
