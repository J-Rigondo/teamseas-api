import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AsyncContextService } from 'src/async-context/async-context.service';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AsyncContextInterceptor implements NestInterceptor {
  constructor(private readonly asyncContext: AsyncContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const request = gqlContext.getContext().req;
      console.log('ip', request.ip);

      this.asyncContext.set({ ip: request.ip });
    }
    return next.handle();
  }
}
