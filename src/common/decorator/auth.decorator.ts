import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from 'src/@generated/prisma-nestjs-graphql/prisma/role.enum';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { JwtAuthGuard } from 'src/common/guard/jwt-auth.guard';

export const Auth = (...roles: Role[]) => {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
};
