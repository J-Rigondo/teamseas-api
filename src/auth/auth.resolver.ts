import {
  Args,
  Context,
  GqlExecutionContext,
  GraphQLExecutionContext,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { LoginResponse } from 'src/auth/dtos/login-response';
import { LoginUserInput } from 'src/auth/dtos/login-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/common/guard/gql-auth.guard';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context,
  ) {
    return this.authService.login(context.user);
  }
}
