import { Request, Response, NextFunction } from "express";
import { AuthController } from "../../controllers/auth.controller.js";
import { AuthService } from "../../services/auth.service.js";

// Mock AuthService
jest.mock("../../services/auth.service.js");

describe("AuthController", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      mockRequest.body = {
        email: "test@example.com",
        password: "password123",
      };

      const mockResult = {
        user: {
          id: 1,
          email: "test@example.com",
          created_at: new Date(),
        },
        token: "mock-token",
      };

      (AuthService.register as jest.Mock).mockResolvedValue(mockResult);

      await AuthController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(AuthService.register).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return 400 for invalid email", async () => {
      mockRequest.body = {
        email: "invalid-email",
        password: "password123",
      };

      await AuthController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ errors: expect.any(Array) })
      );
    });

    it("should return 400 for short password", async () => {
      mockRequest.body = {
        email: "test@example.com",
        password: "short",
      };

      await AuthController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 for missing fields", async () => {
      mockRequest.body = {};

      await AuthController.register(
        mockRequest as Request,
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
        email: "test@example.com",
        password: "password123",
      };

      const error = new Error("Service error");
      (AuthService.register as jest.Mock).mockRejectedValue(error);

      await AuthController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("login", () => {
    it("should login successfully", async () => {
      mockRequest.body = {
        email: "test@example.com",
        password: "password123",
      };

      const mockResult = {
        user: {
          id: 1,
          email: "test@example.com",
          created_at: new Date(),
        },
        token: "mock-token",
      };

      (AuthService.login as jest.Mock).mockResolvedValue(mockResult);

      await AuthController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(AuthService.login).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return 400 for missing email", async () => {
      mockRequest.body = {
        password: "password123",
      };

      await AuthController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 for missing password", async () => {
      mockRequest.body = {
        email: "test@example.com",
      };

      await AuthController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it("should call next with error on service failure", async () => {
      mockRequest.body = {
        email: "test@example.com",
        password: "password123",
      };

      const error = new Error("Service error");
      (AuthService.login as jest.Mock).mockRejectedValue(error);

      await AuthController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
