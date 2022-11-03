import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { LoginResponse } from 'src/auth/dtos/login-response';
import { LoginUserInput } from 'src/auth/dtos/login-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/common/guard/gql-auth.guard';
import { User as ContextUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/@generated/prisma-nestjs-graphql/user/user.model';
import { MobileLoginResponse } from 'src/auth/dtos/mobile-login.response';
import { MobileJwtRefreshGuard } from 'src/common/guard/mobile-jwt-refresh.guard';

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

  @Mutation(() => MobileLoginResponse)
  @UseGuards(GqlAuthGuard)
  mobileLogin(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @ContextUser('local') user: User,
  ) {
    return this.authService.mobileLogin(user);
  }

  @Mutation(() => MobileLoginResponse)
  @UseGuards(MobileJwtRefreshGuard)
  refreshAccessToken(@ContextUser() user: User) {
    return this.authService.mobileLogin(user);
  }
}
