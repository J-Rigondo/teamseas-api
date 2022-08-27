import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }

  // handleRequest(err: any, user: any, info: any, context: any, status: any) {
  //   console.log('err', err);
  //   console.log('user', user);
  //   console.log('info', info);
  //   console.log('context', context);
  //   console.log('status', status);
  //   // if (err || !user) {
  //   //   throw new HttpException(err.message, err.status);
  //   // }
  //
  //   const ctx = GqlExecutionContext.create(context);
  //   const request = ctx.getContext().req;
  //
  //   console.log('intercept cookie', request.headers.cookie);
  //
  //   const refreshToken = request.headers.cookie;
  //
  //   const valid = this.jwtService.verify(refreshToken, {
  //     secret: process.env.JWT_REFRESH_SECRET,
  //   });
  //
  //   console.log('valid', valid);
  //
  //   return user;
  // }
}
