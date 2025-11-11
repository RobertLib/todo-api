import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { UserCreateDto, UserResponseDto } from "../types/user.types.js";
import { AppError } from "../middleware/error.middleware.js";

export class AuthService {
  private static readonly SALT_ROUNDS = 10;

  static async register(
    data: UserCreateDto
  ): Promise<{ user: UserResponseDto; token: string }> {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(data.email);
    if (existingUser) {
      throw new AppError(409, "User with this email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    // Create user
    const user = await UserModel.create({
      email: data.email,
      password: hashedPassword,
    });

    // Generate token
    const token = this.generateToken(user.id);

    // Return user without password
    const userResponse: UserResponseDto = {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    };

    return { user: userResponse, token };
  }

  static async login(
    email: string,
    password: string
  ): Promise<{ user: UserResponseDto; token: string }> {
    // Find user
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new AppError(401, "Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, "Invalid credentials");
    }

    // Generate token
    const token = this.generateToken(user.id);

    // Return user without password
    const userResponse: UserResponseDto = {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    };

    return { user: userResponse, token };
  }

  private static generateToken(userId: number): string {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign({ userId }, secret, { expiresIn } as jwt.SignOptions);
  }
}
