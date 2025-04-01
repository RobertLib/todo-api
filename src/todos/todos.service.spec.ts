import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Todo } from './entities/todo.entity';
import { TodosService } from './todos.service';
import { User } from '../users/entities/user.entity';

describe('TodosService', () => {
  let service: TodosService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'password',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockTodo: Todo = {
    id: 1,
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    userId: mockUser.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto as unknown),
    save: jest
      .fn()
      .mockImplementation((todo) => Promise.resolve({ id: 1, ...todo })),
    find: jest.fn().mockResolvedValue([mockTodo]),
    findOne: jest.fn(),
    update: jest.fn().mockResolvedValue(true),
    delete: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      const createTodoInput = {
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
      };

      expect(await service.create(createTodoInput, mockUser)).toEqual({
        id: 1,
        ...createTodoInput,
        user: mockUser,
        userId: mockUser.id,
      });
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...createTodoInput,
        user: mockUser,
        userId: mockUser.id,
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      expect(await service.findAll(mockUser)).toEqual([mockTodo]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      mockRepository.findOne.mockResolvedValue(mockTodo);

      expect(await service.findOne(1, mockUser)).toEqual(mockTodo);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
    });

    it('should throw a NotFoundException if todo is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999, mockUser)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999, userId: mockUser.id },
      });
    });
  });

  describe('update', () => {
    it('should update a todo', async () => {
      const updateTodoInput = {
        id: 1,
        title: 'Updated Title',
      };

      mockRepository.findOne.mockResolvedValue({
        ...mockTodo,
        title: 'Updated Title',
      });

      expect(await service.update(1, updateTodoInput, mockUser)).toEqual({
        ...mockTodo,
        title: 'Updated Title',
      });

      expect(mockRepository.update).toHaveBeenCalledWith(
        { id: 1, userId: mockUser.id },
        updateTodoInput,
      );
      expect(mockRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      mockRepository.findOne.mockResolvedValue(mockTodo);

      expect(await service.remove(1, mockUser)).toEqual(mockTodo);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, userId: mockUser.id },
      });
      expect(mockRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it('should throw a NotFoundException if todo to delete is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999, mockUser)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999, userId: mockUser.id },
      });
    });
  });
});
