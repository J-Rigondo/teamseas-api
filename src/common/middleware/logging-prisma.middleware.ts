import { Prisma } from '@prisma/client';

export function loggingMiddleware(asyncContext: any): Prisma.Middleware {
  return async (params, next) => {
    const before = Date.now();

    console.log('in prisma===============', asyncContext.get());

    console.log(params);
    const result = await next(params);
    console.log(result);

    const after = Date.now();

    console.log(
      `Prisma Query ${params.model}.${params.action} took ${after - before}ms`,
    );

    return result;
  };
}
