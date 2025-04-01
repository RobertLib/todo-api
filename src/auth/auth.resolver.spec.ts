import { AuthOutput } from './dto/auth.output';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { RegisterUserInput } from '../users/dto/register-user.input';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';

describe('AuthResolver', () => {
  let resolver: AuthResolver;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedPassword',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockAuthOutput: AuthOutput = {
    token: 'mock-jwt-token',
    user: mockUser,
  };

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('login', () => {
    it('should return auth output when login is successful', async () => {
      const loginUserInput: LoginUserInput = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.login.mockResolvedValue(mockAuthOutput);

      const result = await resolver.login(loginUserInput);

      expect(result).toEqual(mockAuthOutput);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginUserInput);
    });
  });

  describe('register', () => {
    it('should return auth output when registration is successful', async () => {
      const registerUserInput: RegisterUserInput = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      mockAuthService.register.mockResolvedValue(mockAuthOutput);

      const result = await resolver.register(registerUserInput);

      expect(result).toEqual(mockAuthOutput);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerUserInput);
    });
  });
});
