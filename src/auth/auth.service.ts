import { AuthOutput } from './dto/auth.output';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from './dto/login-user.input';
import { RegisterUserInput } from '../users/dto/register-user.input';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(loginUserInput: LoginUserInput): Promise<AuthOutput> {
    const { email, password } = loginUserInput;
    const user = await this.validateUser(email, password);

    const payload = { email: user.email, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(registerUserInput: RegisterUserInput): Promise<AuthOutput> {
    const user = await this.usersService.register(registerUserInput);

    const payload = { email: user.email, sub: user.id };

    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }
}
