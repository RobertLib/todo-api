import { UserModel } from "../../models/user.model.js";
import pool from "../../config/database.js";
import { User, UserCreateDto } from "../../types/user.types.js";

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

describe("UserModel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const data: UserCreateDto = {
        email: "test@example.com",
        password: "hashedPassword123",
      };

      const mockUser: User = {
        id: 1,
        email: data.email,
        password: data.password,
        created_at: new Date(),
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockUser],
        command: "INSERT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await UserModel.create(data);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO users"),
        [data.email, data.password]
      );
      expect(result).toEqual(mockUser);
      expect(result.email).toBe(data.email);
    });

    it("should create user with correct return fields", async () => {
      const data: UserCreateDto = {
        email: "newuser@example.com",
        password: "hashedPassword456",
      };

      const mockUser: User = {
        id: 2,
        email: data.email,
        password: data.password,
        created_at: new Date(),
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockUser],
        command: "INSERT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await UserModel.create(data);

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("email");
      expect(result).toHaveProperty("password");
      expect(result).toHaveProperty("created_at");
    });
  });

  describe("findByEmail", () => {
    it("should return user when found by email", async () => {
      const email = "test@example.com";
      const mockUser: User = {
        id: 1,
        email: email,
        password: "hashedPassword123",
        created_at: new Date(),
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockUser],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await UserModel.findByEmail(email);

      expect(mockPool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      expect(result).toEqual(mockUser);
    });

    it("should return null when user not found by email", async () => {
      const email = "nonexistent@example.com";

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [],
        command: "SELECT",
        rowCount: 0,
        oid: 0,
        fields: [],
      });

      const result = await UserModel.findByEmail(email);

      expect(result).toBeNull();
    });

    it("should handle case-sensitive email search", async () => {
      const email = "Test@Example.com";
      const mockUser: User = {
        id: 1,
        email: email,
        password: "hashedPassword123",
        created_at: new Date(),
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockUser],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await UserModel.findByEmail(email);

      expect(result).toEqual(mockUser);
      expect(result?.email).toBe(email);
    });
  });

  describe("findById", () => {
    it("should return user when found by id", async () => {
      const userId = 1;
      const mockUser: User = {
        id: userId,
        email: "test@example.com",
        password: "hashedPassword123",
        created_at: new Date(),
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockUser],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await UserModel.findById(userId);

      expect(mockPool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE id = $1",
        [userId]
      );
      expect(result).toEqual(mockUser);
    });

    it("should return null when user not found by id", async () => {
      const userId = 999;

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [],
        command: "SELECT",
        rowCount: 0,
        oid: 0,
        fields: [],
      });

      const result = await UserModel.findById(userId);

      expect(result).toBeNull();
    });

    it("should handle different user ids", async () => {
      const userId = 42;
      const mockUser: User = {
        id: userId,
        email: "user42@example.com",
        password: "hashedPassword123",
        created_at: new Date(),
      };

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [mockUser],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await UserModel.findById(userId);

      expect(result?.id).toBe(userId);
    });
  });

  describe("emailExists", () => {
    it("should return true when email exists", async () => {
      const email = "existing@example.com";

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ exists: true }],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await UserModel.emailExists(email);

      expect(mockPool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT EXISTS"),
        [email]
      );
      expect(result).toBe(true);
    });

    it("should return false when email does not exist", async () => {
      const email = "nonexistent@example.com";

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ exists: false }],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await UserModel.emailExists(email);

      expect(result).toBe(false);
    });

    it("should check email existence correctly", async () => {
      const email = "check@example.com";

      (mockPool.query as jest.Mock).mockResolvedValueOnce({
        rows: [{ exists: false }],
        command: "SELECT",
        rowCount: 1,
        oid: 0,
        fields: [],
      });

      const result = await UserModel.emailExists(email);

      expect(mockPool.query).toHaveBeenCalledWith(
        "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)",
        [email]
      );
      expect(result).toBe(false);
    });
  });
});
