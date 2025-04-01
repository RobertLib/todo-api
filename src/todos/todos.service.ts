import { CreateTodoInput } from './dto/create-todo.input';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { UpdateTodoInput } from './dto/update-todo.input';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  create(createTodoInput: CreateTodoInput, user: User): Promise<Todo> {
    const todo = this.todoRepository.create({
      ...createTodoInput,
      user,
      userId: user.id,
    });
    return this.todoRepository.save(todo);
  }

  findAll(user: User): Promise<Todo[]> {
    return this.todoRepository.find({ where: { userId: user.id } });
  }

  async findOne(id: number, user: User): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(
    id: number,
    updateTodoInput: UpdateTodoInput,
    user: User,
  ): Promise<Todo> {
    await this.findOne(id, user);
    await this.todoRepository.update({ id, userId: user.id }, updateTodoInput);
    return this.findOne(id, user);
  }

  async remove(id: number, user: User): Promise<Todo> {
    const todo = await this.findOne(id, user);
    await this.todoRepository.delete({ id, userId: user.id });
    return todo;
  }
}
