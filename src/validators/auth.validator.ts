import {
  ValidationResult,
  isValidEmail,
  isValidPassword,
  isNonEmptyString,
} from "./validation.helper.js";

export function validateRegister(data: any): ValidationResult {
  const result = new ValidationResult();

  if (!data.email || !isNonEmptyString(data.email)) {
    result.addError("email", "Email is required");
  } else if (!isValidEmail(data.email)) {
    result.addError("email", "Invalid email format");
  }

  if (!data.password || !isNonEmptyString(data.password)) {
    result.addError("password", "Password is required");
  } else if (!isValidPassword(data.password)) {
    result.addError("password", "Password must be at least 6 characters long");
  }

  return result;
}

export function validateLogin(data: any): ValidationResult {
  const result = new ValidationResult();

  if (!data.email || !isNonEmptyString(data.email)) {
    result.addError("email", "Email is required");
  }

  if (!data.password || !isNonEmptyString(data.password)) {
    result.addError("password", "Password is required");
  }

  return result;
}
