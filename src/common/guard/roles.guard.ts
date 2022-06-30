import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);

    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());
    console.log(roles);

    if (!roles) {
      return true;
    }

    const request = ctx.getContext().req;
    const user = request.user;

    const isMatch = roles.includes(user.role);

    if (!isMatch) {
      throw new ForbiddenException();
    }

    return true;
  }
}
