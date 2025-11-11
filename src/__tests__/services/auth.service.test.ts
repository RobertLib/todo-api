import { AuthService } from "../../services/auth.service.js";
import { UserModel } from "../../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Mock dependencies
jest.mock("../../models/user.model.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService", () => {
  const mockUser = {
    id: 1,
    email: "test@example.com",
    password: "hashedPassword",
    created_at: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");

      const result = await AuthService.register({
        email: "test@example.com",
        password: "password123",
      });

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("token");
      expect(result.user.email).toBe("test@example.com");
      expect(result.user).not.toHaveProperty("password");
      expect(UserModel.create).toHaveBeenCalled();
    });

    it("should throw 409 when user already exists", async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        AuthService.register({
          email: "test@example.com",
          password: "password123",
        })
      ).rejects.toThrow("User with this email already exists");
    });

    it("should hash password before saving", async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
      (UserModel.create as jest.Mock).mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");

      await AuthService.register({
        email: "test@example.com",
        password: "password123",
      });

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    });
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mock-token");

      const result = await AuthService.login("test@example.com", "password123");

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("token");
      expect(result.user.email).toBe("test@example.com");
      expect(result.user).not.toHaveProperty("password");
    });

    it("should throw 401 when user not found", async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        AuthService.login("test@example.com", "password123")
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw 401 when password is incorrect", async () => {
      (UserModel.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        AuthService.login("test@example.com", "wrongpassword")
      ).rejects.toThrow("Invalid credentials");
    });
  });
});
