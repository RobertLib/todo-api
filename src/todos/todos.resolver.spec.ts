import { CreateTodoInput } from './dto/create-todo.input';
import { Test, TestingModule } from '@nestjs/testing';
import { TodosResolver } from './todos.resolver';
import { TodosService } from './todos.service';
import { UpdateTodoInput } from './dto/update-todo.input';
import { User } from '../users/entities/user.entity';

describe('TodosResolver', () => {
  let resolver: TodosResolver;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'password',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockTodo = {
    id: 1,
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    userId: mockUser.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockTodoService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosResolver,
        {
          provide: TodosService,
          useValue: mockTodoService,
        },
      ],
    }).compile();

    resolver = module.get<TodosResolver>(TodosResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createTodo', () => {
    it('should create a todo', async () => {
      const createTodoInput: CreateTodoInput = {
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
      };

      mockTodoService.create.mockResolvedValue(mockTodo);

      expect(await resolver.createTodo(createTodoInput, mockUser)).toEqual(
        mockTodo,
      );
      expect(mockTodoService.create).toHaveBeenCalledWith(
        createTodoInput,
        mockUser,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      mockTodoService.findAll.mockResolvedValue([mockTodo]);

      expect(await resolver.findAll(mockUser)).toEqual([mockTodo]);
      expect(mockTodoService.findAll).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      mockTodoService.findOne.mockResolvedValue(mockTodo);

      expect(await resolver.findOne(1, mockUser)).toEqual(mockTodo);
      expect(mockTodoService.findOne).toHaveBeenCalledWith(1, mockUser);
    });
  });

  describe('updateTodo', () => {
    it('should update a todo', async () => {
      const updateTodoInput: UpdateTodoInput = {
        id: 1,
        title: 'Updated Title',
      };

      const updatedTodo = { ...mockTodo, title: 'Updated Title' };
      mockTodoService.update.mockResolvedValue(updatedTodo);

      expect(await resolver.updateTodo(updateTodoInput, mockUser)).toEqual(
        updatedTodo,
      );
      expect(mockTodoService.update).toHaveBeenCalledWith(
        1,
        updateTodoInput,
        mockUser,
      );
    });
  });

  describe('removeTodo', () => {
    it('should remove a todo', async () => {
      mockTodoService.remove.mockResolvedValue(mockTodo);

      expect(await resolver.removeTodo(1, mockUser)).toEqual(mockTodo);
      expect(mockTodoService.remove).toHaveBeenCalledWith(1, mockUser);
    });
  });
});
