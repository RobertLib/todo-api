import request from "supertest";
import { createApp } from "../../app.js";
import { UserModel } from "../../models/user.model.js";
import bcrypt from "bcrypt";

// Mock models
jest.mock("../../models/user.model.js");
jest.mock("bcrypt");

describe("Auth API", () => {
  const app = createApp();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (UserModel.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
        created_at: new Date(),
      });

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          password: "password123",
        })
        .expect(201);

      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe("test@example.com");
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("should return 400 for invalid email", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "invalid-email",
          password: "password123",
        })
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });

    it("should return 400 for short password", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          password: "short",
        })
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });

    it("should return 409 when user already exists", async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@example.com",
      });

      const response = await request(app)
        .post("/api/auth/register")
        .send({
          email: "test@example.com",
          password: "password123",
        })
        .expect(409);

      expect(response.body.error).toContain("already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should login successfully", async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashedPassword",
        created_at: new Date(),
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
    });

    it("should return 401 for invalid credentials", async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "wrongpassword",
        })
        .expect(401);

      expect(response.body.error).toContain("Invalid credentials");
    });

    it("should return 400 for missing fields", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
        })
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });
  });
});
