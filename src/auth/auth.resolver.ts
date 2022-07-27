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
import { GoogleAuthGuard } from 'src/common/guard/google-auth.guard';
import { User as ContextUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResponse)
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() context,
    @ContextUser() user: User,
  ) {
    const result = this.authService.login(context.user);

    context.res.cookie('some-cookie', 'some-value', {
      httpOnly: true,
      maxAge: 100000000000,
      domain: process.env.FRONT_END_DOMAIN,
      path: '/',
    });
    return result;
  }

  @Mutation(() => LoginResponse)
  // @UseGuards(GoogleAuthGuard)
  googleLogin(@Args('tokenId', { type: () => String }) tokenId: string) {
    return this.authService.googleLogin(tokenId);
  }
}
