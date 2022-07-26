import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AsyncContextService } from 'src/async-context/async-context.service';

@Injectable()
export class AsyncContextInterceptor implements NestInterceptor {
  constructor(private readonly asyncContext: AsyncContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      this.asyncContext.set(gqlContext.getContext().req.user);
    }
    return next.handle();
  }
}
