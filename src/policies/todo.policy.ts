import { Todo } from "../types/todo.types.js";

export class TodoPolicy {
  /**
   * Determine if the user can view the todo
   */
  static canView(userId: number, todo: Todo): boolean {
    return todo.user_id === userId;
  }

  /**
   * Determine if the user can update the todo
   */
  static canUpdate(userId: number, todo: Todo): boolean {
    return todo.user_id === userId;
  }

  /**
   * Determine if the user can delete the todo
   */
  static canDelete(userId: number, todo: Todo): boolean {
    return todo.user_id === userId;
  }

  /**
   * Determine if the user can create a todo
   * (V tomto případě může každý přihlášený uživatel)
   */
  static canCreate(userId: number): boolean {
    return userId > 0;
  }
}
