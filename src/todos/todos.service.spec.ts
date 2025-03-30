import { Test, TestingModule } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Todo } from './entities/todo.entity';

describe('TodosService', () => {
  let service: TodosService;

  const mockTodo: Todo = {
    id: 1,
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
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

      expect(await service.create(createTodoInput)).toEqual({
        id: 1,
        ...createTodoInput,
      });
      expect(mockRepository.create).toHaveBeenCalledWith(createTodoInput);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      expect(await service.findAll()).toEqual([mockTodo]);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single todo', async () => {
      mockRepository.findOne.mockResolvedValue(mockTodo);

      expect(await service.findOne(1)).toEqual(mockTodo);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw a NotFoundException if todo is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
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

      expect(await service.update(1, updateTodoInput)).toEqual({
        ...mockTodo,
        title: 'Updated Title',
      });

      expect(mockRepository.update).toHaveBeenCalledWith(1, updateTodoInput);
      expect(mockRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a todo', async () => {
      mockRepository.findOne.mockResolvedValue(mockTodo);

      expect(await service.remove(1)).toEqual(mockTodo);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if todo to delete is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });
});
