import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

@Injectable()
export class MobileJwtRefreshGuard extends AuthGuard('mobile-jwt-refresh') {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }
  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    console.log('jwt mobile guard err==========', err);
    console.log('guard user', user);

    if (err || !user) {
      throw new ApolloError('Refresh Unauthorized', '401');
    }
    return user;
  }
}
