import pool from "../config/database.js";
import { Todo, TodoCreateDto, TodoUpdateDto } from "../types/todo.types.js";

export class TodoModel {
  static async create(userId: number, data: TodoCreateDto): Promise<Todo> {
    const query = `
      INSERT INTO todos (user_id, title, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(query, [
      userId,
      data.title,
      data.description || null,
    ]);

    return result.rows[0];
  }

  static async findAllByUserId(userId: number): Promise<Todo[]> {
    const query = `
      SELECT * FROM todos
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findById(id: number): Promise<Todo | null> {
    const query = "SELECT * FROM todos WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async update(id: number, data: TodoUpdateDto): Promise<Todo | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramCount}`);
      values.push(data.title);
      paramCount++;
    }

    if (data.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(data.description);
      paramCount++;
    }

    if (data.completed !== undefined) {
      fields.push(`completed = $${paramCount}`);
      values.push(data.completed);
      paramCount++;
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE todos
      SET ${fields.join(", ")}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const query = "DELETE FROM todos WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  static async belongsToUser(todoId: number, userId: number): Promise<boolean> {
    const query =
      "SELECT EXISTS(SELECT 1 FROM todos WHERE id = $1 AND user_id = $2)";
    const result = await pool.query(query, [todoId, userId]);
    return result.rows[0].exists;
  }
}
