import pool from "../config/database.js";
import { User, UserCreateDto } from "../types/user.types.js";

export class UserModel {
  static async create(data: UserCreateDto): Promise<User> {
    const query = `
      INSERT INTO users (email, password)
      VALUES ($1, $2)
      RETURNING id, email, password, created_at
    `;

    const result = await pool.query(query, [data.email, data.password]);
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async emailExists(email: string): Promise<boolean> {
    const query = "SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)";
    const result = await pool.query(query, [email]);
    return result.rows[0].exists;
  }
}
