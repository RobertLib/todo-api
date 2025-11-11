import { Request, Response, NextFunction } from "express";
import {
  AppError,
  errorHandler,
  notFoundHandler,
} from "../../middleware/error.middleware.js";
import logger from "../../config/logger.js";

describe("error.middleware", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let loggerWarnSpy: jest.SpyInstance;
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    mockReq = {
      method: "GET",
      url: "/test",
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    // Mock logger methods
    loggerWarnSpy = jest.spyOn(logger, "warn").mockImplementation();
    loggerErrorSpy = jest.spyOn(logger, "error").mockImplementation();

    jest.clearAllMocks();
  });

  afterEach(() => {
    loggerWarnSpy.mockRestore();
    loggerErrorSpy.mockRestore();
  });

  describe("AppError", () => {
    it("should create AppError with statusCode and message", () => {
      const error = new AppError(404, "Not found");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("Not found");
      expect(error.name).toBe("AppError");
    });

    it("should create AppError with different status codes", () => {
      const error400 = new AppError(400, "Bad request");
      const error401 = new AppError(401, "Unauthorized");
      const error403 = new AppError(403, "Forbidden");
      const error500 = new AppError(500, "Internal error");

      expect(error400.statusCode).toBe(400);
      expect(error401.statusCode).toBe(401);
      expect(error403.statusCode).toBe(403);
      expect(error500.statusCode).toBe(500);
    });
  });

  describe("errorHandler", () => {
    it("should handle AppError and return correct status and message", () => {
      const error = new AppError(404, "Resource not found");

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Resource not found",
      });
    });

    it("should handle AppError with 400 status", () => {
      const error = new AppError(400, "Invalid input");

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Invalid input",
      });
    });

    it("should handle AppError with 401 status", () => {
      const error = new AppError(401, "Unauthorized access");

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Unauthorized access",
      });
    });

    it("should handle AppError with 403 status", () => {
      const error = new AppError(403, "Forbidden resource");

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Forbidden resource",
      });
    });

    it("should handle generic Error and return 500", () => {
      const error = new Error("Something went wrong");

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });

    it("should handle TypeError and return 500", () => {
      const error = new TypeError("Type error occurred");

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });

    it("should handle ReferenceError and return 500", () => {
      const error = new ReferenceError("Reference error occurred");

      errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("notFoundHandler", () => {
    it("should return 404 with route not found message", () => {
      notFoundHandler(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Route not found",
      });
    });

    it("should handle requests with different paths", () => {
      const mockReqWithPath = {
        ...mockReq,
        path: "/api/nonexistent",
      };

      notFoundHandler(mockReqWithPath as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Route not found",
      });
    });

    it("should handle requests with different methods", () => {
      const mockReqWithMethod = {
        ...mockReq,
        method: "POST",
      };

      notFoundHandler(mockReqWithMethod as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Route not found",
      });
    });
  });
});
