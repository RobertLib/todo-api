export interface User {
  id: number;
  email: string;
  password: string;
  created_at: Date;
}

export interface UserCreateDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: number;
  email: string;
  created_at: Date;
}
