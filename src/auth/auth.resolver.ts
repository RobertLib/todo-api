import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthOutput } from './dto/auth.output';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { RegisterUserInput } from '../users/dto/register-user.input';

@Resolver(() => AuthOutput)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthOutput)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
  ): Promise<AuthOutput> {
    return this.authService.login(loginUserInput);
  }

  @Mutation(() => AuthOutput)
  async register(
    @Args('registerUserInput') registerUserInput: RegisterUserInput,
  ): Promise<AuthOutput> {
    return this.authService.register(registerUserInput);
  }
}
