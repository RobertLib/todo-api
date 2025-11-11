import { TodoPolicy } from "../../policies/todo.policy.js";
import { Todo } from "../../types/todo.types.js";

describe("TodoPolicy", () => {
  const mockTodo: Todo = {
    id: 1,
    user_id: 1,
    title: "Test todo",
    description: "Test description",
    completed: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  describe("canView", () => {
    it("should return true when user owns the todo", () => {
      expect(TodoPolicy.canView(1, mockTodo)).toBe(true);
    });

    it("should return false when user does not own the todo", () => {
      expect(TodoPolicy.canView(2, mockTodo)).toBe(false);
    });
  });

  describe("canUpdate", () => {
    it("should return true when user owns the todo", () => {
      expect(TodoPolicy.canUpdate(1, mockTodo)).toBe(true);
    });

    it("should return false when user does not own the todo", () => {
      expect(TodoPolicy.canUpdate(2, mockTodo)).toBe(false);
    });
  });

  describe("canDelete", () => {
    it("should return true when user owns the todo", () => {
      expect(TodoPolicy.canDelete(1, mockTodo)).toBe(true);
    });

    it("should return false when user does not own the todo", () => {
      expect(TodoPolicy.canDelete(2, mockTodo)).toBe(false);
    });
  });

  describe("canCreate", () => {
    it("should return true for authenticated user", () => {
      expect(TodoPolicy.canCreate(1)).toBe(true);
    });

    it("should return false for invalid user id", () => {
      expect(TodoPolicy.canCreate(0)).toBe(false);
    });

    it("should return false for negative user id", () => {
      expect(TodoPolicy.canCreate(-1)).toBe(false);
    });
  });
});
