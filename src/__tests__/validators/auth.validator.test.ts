import {
  validateRegister,
  validateLogin,
} from "../../validators/auth.validator.js";

describe("Auth Validators", () => {
  describe("validateRegister", () => {
    it("should pass validation for valid data", () => {
      const data = {
        email: "test@example.com",
        password: "password123",
      };

      const result = validateRegister(data);

      expect(result.isValid()).toBe(true);
      expect(result.getErrors()).toEqual([]);
    });

    it("should fail when email is missing", () => {
      const data = {
        password: "password123",
      };

      const result = validateRegister(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("email");
      expect(result.getErrors()[0].message).toBe("Email is required");
    });

    it("should fail when email is empty", () => {
      const data = {
        email: "",
        password: "password123",
      };

      const result = validateRegister(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("email");
    });

    it("should fail when email format is invalid", () => {
      const data = {
        email: "invalid-email",
        password: "password123",
      };

      const result = validateRegister(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("email");
      expect(result.getErrors()[0].message).toBe("Invalid email format");
    });

    it("should fail when password is missing", () => {
      const data = {
        email: "test@example.com",
      };

      const result = validateRegister(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("password");
      expect(result.getErrors()[0].message).toBe("Password is required");
    });

    it("should fail when password is empty", () => {
      const data = {
        email: "test@example.com",
        password: "",
      };

      const result = validateRegister(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("password");
    });

    it("should fail when password is too short", () => {
      const data = {
        email: "test@example.com",
        password: "short",
      };

      const result = validateRegister(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("password");
      expect(result.getErrors()[0].message).toContain("at least 6 characters");
    });

    it("should fail for multiple validation errors", () => {
      const data = {
        email: "invalid-email",
        password: "short",
      };

      const result = validateRegister(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()).toHaveLength(2);
    });
  });

  describe("validateLogin", () => {
    it("should pass validation for valid data", () => {
      const data = {
        email: "test@example.com",
        password: "password123",
      };

      const result = validateLogin(data);

      expect(result.isValid()).toBe(true);
      expect(result.getErrors()).toEqual([]);
    });

    it("should fail when email is missing", () => {
      const data = {
        password: "password123",
      };

      const result = validateLogin(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("email");
    });

    it("should fail when password is missing", () => {
      const data = {
        email: "test@example.com",
      };

      const result = validateLogin(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("password");
    });

    it("should fail when both fields are missing", () => {
      const data = {};

      const result = validateLogin(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()).toHaveLength(2);
    });

    it("should allow any email format (validation happens in service)", () => {
      const data = {
        email: "any-string",
        password: "password123",
      };

      const result = validateLogin(data);

      // Login validator doesn't check email format, only presence
      expect(result.isValid()).toBe(true);
    });
  });
});
