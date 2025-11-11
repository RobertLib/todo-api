import request from "supertest";
import { createApp } from "../../app.js";
import { TodoModel } from "../../models/todo.model.js";
import jwt from "jsonwebtoken";

// Mock models and jwt
jest.mock("../../models/todo.model.js");
jest.mock("jsonwebtoken");

describe("Todo API", () => {
  const app = createApp();
  const mockToken = "mock-jwt-token";
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
    process.env.JWT_SECRET = "test-secret";

    // Mock JWT verification
    (jwt.verify as jest.Mock).mockReturnValue({ userId: mockUserId });
  });

  describe("POST /api/todos", () => {
    it("should create a todo", async () => {
      (TodoModel.create as jest.Mock).mockResolvedValue(mockTodo);

      const response = await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          title: "Test Todo",
          description: "Test Description",
        })
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.title).toBe("Test Todo");
      expect(response.body).not.toHaveProperty("user_id");
    });

    it("should return 401 without auth token", async () => {
      await request(app)
        .post("/api/todos")
        .send({
          title: "Test Todo",
        })
        .expect(401);
    });

    it("should return 400 for invalid data", async () => {
      await request(app)
        .post("/api/todos")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          description: "Missing title",
        })
        .expect(400);
    });
  });

  describe("GET /api/todos", () => {
    it("should return all user todos", async () => {
      const mockTodos = [mockTodo, { ...mockTodo, id: 2, title: "Todo 2" }];
      (TodoModel.findAllByUserId as jest.Mock).mockResolvedValue(mockTodos);

      const response = await request(app)
        .get("/api/todos")
        .set("Authorization", `Bearer ${mockToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).not.toHaveProperty("user_id");
    });

    it("should return 401 without auth token", async () => {
      await request(app).get("/api/todos").expect(401);
    });
  });

  describe("GET /api/todos/:id", () => {
    it("should return a specific todo", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue(mockTodo);

      const response = await request(app)
        .get("/api/todos/1")
        .set("Authorization", `Bearer ${mockToken}`)
        .expect(200);

      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe("Test Todo");
      expect(response.body).not.toHaveProperty("user_id");
    });

    it("should return 404 for non-existent todo", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue(null);

      await request(app)
        .get("/api/todos/999")
        .set("Authorization", `Bearer ${mockToken}`)
        .expect(404);
    });

    it("should return 403 for todo owned by another user", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue({
        ...mockTodo,
        user_id: 2,
      });

      await request(app)
        .get("/api/todos/1")
        .set("Authorization", `Bearer ${mockToken}`)
        .expect(403);
    });
  });

  describe("PATCH /api/todos/:id", () => {
    it("should update a todo", async () => {
      const updatedTodo = { ...mockTodo, title: "Updated Title" };
      (TodoModel.findById as jest.Mock).mockResolvedValue(mockTodo);
      (TodoModel.update as jest.Mock).mockResolvedValue(updatedTodo);

      const response = await request(app)
        .patch("/api/todos/1")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          title: "Updated Title",
        })
        .expect(200);

      expect(response.body.title).toBe("Updated Title");
    });

    it("should return 404 for non-existent todo", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue(null);

      await request(app)
        .patch("/api/todos/999")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          title: "Updated Title",
        })
        .expect(404);
    });

    it("should return 403 for todo owned by another user", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue({
        ...mockTodo,
        user_id: 2,
      });

      await request(app)
        .patch("/api/todos/1")
        .set("Authorization", `Bearer ${mockToken}`)
        .send({
          title: "Updated Title",
        })
        .expect(403);
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("should delete a todo", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue(mockTodo);
      (TodoModel.delete as jest.Mock).mockResolvedValue(true);

      await request(app)
        .delete("/api/todos/1")
        .set("Authorization", `Bearer ${mockToken}`)
        .expect(204);
    });

    it("should return 404 for non-existent todo", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue(null);

      await request(app)
        .delete("/api/todos/999")
        .set("Authorization", `Bearer ${mockToken}`)
        .expect(404);
    });

    it("should return 403 for todo owned by another user", async () => {
      (TodoModel.findById as jest.Mock).mockResolvedValue({
        ...mockTodo,
        user_id: 2,
      });

      await request(app)
        .delete("/api/todos/1")
        .set("Authorization", `Bearer ${mockToken}`)
        .expect(403);
    });
  });
});
