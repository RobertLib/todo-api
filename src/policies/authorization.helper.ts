import { AppError } from "../middleware/error.middleware.js";

export class AuthorizationHelper {
  /**
   * Authorize an action or throw 403 error
   */
  static authorize(
    condition: boolean,
    message: string = "Access denied"
  ): void {
    if (!condition) {
      throw new AppError(403, message);
    }
  }

  /**
   * Check if user is authenticated
   */
  static requireAuth(userId: number | undefined): asserts userId is number {
    if (!userId || userId <= 0) {
      throw new AppError(401, "Authentication required");
    }
  }
}
