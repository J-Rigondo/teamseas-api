import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';

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
    if (err || !user) {
      throw new ApolloError('Access Unauthorized', '401');
    }
    return user;
  }
}
