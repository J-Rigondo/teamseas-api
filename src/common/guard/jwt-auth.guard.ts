import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    console.log('err', err);
    console.log('user', user);
    console.log('info', info);
    console.log('context', context);
    console.log('status', status);
    // if (err || !user) {
    //   throw new HttpException(err.message, err.status);
    // }
    return user;
  }
}
