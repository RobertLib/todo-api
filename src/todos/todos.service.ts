import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  create(createTodoInput: CreateTodoInput): Promise<Todo> {
    const todo = this.todoRepository.create(createTodoInput);
    return this.todoRepository.save(todo);
  }

  findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(id: number, updateTodoInput: UpdateTodoInput): Promise<Todo> {
    await this.todoRepository.update(id, updateTodoInput);
    return this.findOne(id);
  }

  async remove(id: number): Promise<Todo> {
    const todo = await this.findOne(id);
    await this.todoRepository.delete(id);
    return todo;
  }
}
