export interface Todo {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TodoCreateDto {
  title: string;
  description?: string;
}

export interface TodoUpdateDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TodoResponseDto {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}
