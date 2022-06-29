import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';

const hashMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const value = await next();

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(value, salt);

  return hash;
};
