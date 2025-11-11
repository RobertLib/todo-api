import { AuthorizationHelper } from "../../policies/authorization.helper.js";
import { AppError } from "../../middleware/error.middleware.js";

describe("AuthorizationHelper", () => {
  describe("authorize", () => {
    it("should not throw when condition is true", () => {
      expect(() => {
        AuthorizationHelper.authorize(true);
      }).not.toThrow();
    });

    it("should throw AppError with 403 when condition is false", () => {
      expect(() => {
        AuthorizationHelper.authorize(false);
      }).toThrow(AppError);

      try {
        AuthorizationHelper.authorize(false);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(403);
        expect((error as AppError).message).toBe("Access denied");
      }
    });

    it("should throw AppError with custom message", () => {
      const customMessage = "Custom error message";

      try {
        AuthorizationHelper.authorize(false, customMessage);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).message).toBe(customMessage);
      }
    });
  });

  describe("requireAuth", () => {
    it("should not throw for valid user id", () => {
      expect(() => {
        AuthorizationHelper.requireAuth(1);
      }).not.toThrow();
    });

    it("should throw AppError for undefined user id", () => {
      expect(() => {
        AuthorizationHelper.requireAuth(undefined);
      }).toThrow(AppError);
    });

    it("should throw AppError for zero user id", () => {
      expect(() => {
        AuthorizationHelper.requireAuth(0);
      }).toThrow(AppError);
    });

    it("should throw AppError for negative user id", () => {
      expect(() => {
        AuthorizationHelper.requireAuth(-1);
      }).toThrow(AppError);
    });

    it("should throw with 401 status code", () => {
      try {
        AuthorizationHelper.requireAuth(undefined);
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);
        expect((error as AppError).statusCode).toBe(401);
      }
    });
  });
});
