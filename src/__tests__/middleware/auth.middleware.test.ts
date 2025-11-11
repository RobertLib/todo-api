import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { AuthRequest } from "../../types/auth.types.js";

// Mock jsonwebtoken
jest.mock("jsonwebtoken");

const mockJwt = jwt as jest.Mocked<typeof jwt>;

describe("authMiddleware", () => {
  let mockReq: Partial<AuthRequest>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {
      headers: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    process.env.JWT_SECRET = "test-secret";
    jest.clearAllMocks();
  });

  it("should set userId and call next when valid token provided", () => {
    const token = "valid.jwt.token";
    const userId = 123;

    mockReq.headers = {
      authorization: `Bearer ${token}`,
    };

    mockJwt.verify.mockReturnValue({ userId } as any);

    authMiddleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(token, "test-secret");
    expect(mockReq.userId).toBe(userId);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it("should return 401 when no authorization header provided", () => {
    mockReq.headers = {};

    authMiddleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "No token provided",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 when authorization header does not start with Bearer", () => {
    mockReq.headers = {
      authorization: "Basic some-token",
    };

    authMiddleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "No token provided",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 when token is invalid", () => {
    const token = "invalid.jwt.token";

    mockReq.headers = {
      authorization: `Bearer ${token}`,
    };

    mockJwt.verify.mockImplementation(() => {
      throw new jwt.JsonWebTokenError("invalid token");
    });

    authMiddleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Invalid token",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 401 when token is expired", () => {
    const token = "expired.jwt.token";

    mockReq.headers = {
      authorization: `Bearer ${token}`,
    };

    // Create a proper JsonWebTokenError instance
    const error = new jwt.JsonWebTokenError("jwt expired");
    mockJwt.verify.mockImplementation(() => {
      throw error;
    });

    authMiddleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Invalid token",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 500 when JWT_SECRET is not defined", () => {
    delete process.env.JWT_SECRET;

    const token = "valid.jwt.token";
    mockReq.headers = {
      authorization: `Bearer ${token}`,
    };

    authMiddleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should return 500 when unexpected error occurs", () => {
    const token = "valid.jwt.token";

    mockReq.headers = {
      authorization: `Bearer ${token}`,
    };

    mockJwt.verify.mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    authMiddleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Internal server error",
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it("should extract token correctly from Bearer header", () => {
    const token = "my.jwt.token.with.many.parts";
    const userId = 456;

    mockReq.headers = {
      authorization: `Bearer ${token}`,
    };

    mockJwt.verify.mockReturnValue({ userId } as any);

    authMiddleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(jwt.verify).toHaveBeenCalledWith(token, "test-secret");
    expect(mockReq.userId).toBe(userId);
  });

  it("should handle authorization header with extra spaces", () => {
    const token = "  "; // Token is just spaces after "Bearer "

    mockReq.headers = {
      authorization: `Bearer ${token}`,
    };

    mockJwt.verify.mockImplementation(() => {
      throw new jwt.JsonWebTokenError("invalid token");
    });

    authMiddleware(mockReq as AuthRequest, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      error: "Invalid token",
    });
  });
});
