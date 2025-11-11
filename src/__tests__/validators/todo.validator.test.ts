import {
  validateCreateTodo,
  validateUpdateTodo,
} from "../../validators/todo.validator.js";

describe("Todo Validators", () => {
  describe("validateCreateTodo", () => {
    it("should pass validation for valid data", () => {
      const data = {
        title: "Test Todo",
        description: "Test Description",
      };

      const result = validateCreateTodo(data);

      expect(result.isValid()).toBe(true);
      expect(result.getErrors()).toEqual([]);
    });

    it("should pass validation without description", () => {
      const data = {
        title: "Test Todo",
      };

      const result = validateCreateTodo(data);

      expect(result.isValid()).toBe(true);
    });

    it("should fail when title is missing", () => {
      const data = {
        description: "Test Description",
      };

      const result = validateCreateTodo(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()).toHaveLength(1);
      expect(result.getErrors()[0].field).toBe("title");
      expect(result.getErrors()[0].message).toBe("Title is required");
    });

    it("should fail when title is empty string", () => {
      const data = {
        title: "",
        description: "Test Description",
      };

      const result = validateCreateTodo(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("title");
    });

    it("should fail when title is too long", () => {
      const data = {
        title: "a".repeat(256),
        description: "Test Description",
      };

      const result = validateCreateTodo(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("title");
      expect(result.getErrors()[0].message).toContain("255 characters");
    });

    it("should fail when title is not a string", () => {
      const data = {
        title: 123,
        description: "Test Description",
      };

      const result = validateCreateTodo(data);

      expect(result.isValid()).toBe(false);
    });

    it("should fail when description is not a string", () => {
      const data = {
        title: "Test Todo",
        description: 123,
      };

      const result = validateCreateTodo(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("description");
      expect(result.getErrors()[0].message).toBe(
        "Description must be a string"
      );
    });

    it("should allow null description", () => {
      const data = {
        title: "Test Todo",
        description: null,
      };

      const result = validateCreateTodo(data);

      expect(result.isValid()).toBe(true);
    });
  });

  describe("validateUpdateTodo", () => {
    it("should pass validation for valid update with all fields", () => {
      const data = {
        title: "Updated Todo",
        description: "Updated Description",
        completed: true,
      };

      const result = validateUpdateTodo(data);

      expect(result.isValid()).toBe(true);
    });

    it("should pass validation for update with only title", () => {
      const data = {
        title: "Updated Todo",
      };

      const result = validateUpdateTodo(data);

      expect(result.isValid()).toBe(true);
    });

    it("should pass validation for update with only completed", () => {
      const data = {
        completed: true,
      };

      const result = validateUpdateTodo(data);

      expect(result.isValid()).toBe(true);
    });

    it("should pass validation for update with only description", () => {
      const data = {
        description: "Updated Description",
      };

      const result = validateUpdateTodo(data);

      expect(result.isValid()).toBe(true);
    });

    it("should fail when no fields provided", () => {
      const data = {};

      const result = validateUpdateTodo(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("body");
      expect(result.getErrors()[0].message).toContain("At least one field");
    });

    it("should fail when title is empty string", () => {
      const data = {
        title: "",
      };

      const result = validateUpdateTodo(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("title");
    });

    it("should fail when title is too long", () => {
      const data = {
        title: "a".repeat(256),
      };

      const result = validateUpdateTodo(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("title");
    });

    it("should fail when completed is not boolean", () => {
      const data = {
        completed: "true",
      };

      const result = validateUpdateTodo(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("completed");
      expect(result.getErrors()[0].message).toBe("Completed must be a boolean");
    });

    it("should fail when description is not a string", () => {
      const data = {
        description: 123,
      };

      const result = validateUpdateTodo(data);

      expect(result.isValid()).toBe(false);
      expect(result.getErrors()[0].field).toBe("description");
    });

    it("should allow null description", () => {
      const data = {
        title: "Test",
        description: null,
      };

      const result = validateUpdateTodo(data);

      expect(result.isValid()).toBe(true);
    });
  });
});
