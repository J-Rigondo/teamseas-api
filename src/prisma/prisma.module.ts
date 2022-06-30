import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Global()
@Module({
  exports: [PrismaService],
  providers: [PrismaService],
})
export class PrismaModule {}
