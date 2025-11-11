import {
  ValidationResult,
  isNonEmptyString,
  isBoolean,
} from "./validation.helper.js";

export function validateCreateTodo(data: any): ValidationResult {
  const result = new ValidationResult();

  if (!data.title || !isNonEmptyString(data.title)) {
    result.addError("title", "Title is required");
  } else if (data.title.length > 255) {
    result.addError("title", "Title must not exceed 255 characters");
  }

  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== "string") {
      result.addError("description", "Description must be a string");
    }
  }

  return result;
}

export function validateUpdateTodo(data: any): ValidationResult {
  const result = new ValidationResult();

  if (data.title !== undefined) {
    if (!isNonEmptyString(data.title)) {
      result.addError("title", "Title must be a non-empty string");
    } else if (data.title.length > 255) {
      result.addError("title", "Title must not exceed 255 characters");
    }
  }

  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== "string") {
      result.addError("description", "Description must be a string");
    }
  }

  if (data.completed !== undefined) {
    if (!isBoolean(data.completed)) {
      result.addError("completed", "Completed must be a boolean");
    }
  }

  // At least one field must be present
  if (
    data.title === undefined &&
    data.description === undefined &&
    data.completed === undefined
  ) {
    result.addError(
      "body",
      "At least one field (title, description, or completed) must be provided"
    );
  }

  return result;
}
