import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { AsyncContextService } from 'src/async-context/async-context.service';
import { loggingMiddleware } from 'src/common/middleware/logging-prisma.middleware';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly asyncContext: AsyncContextService) {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });

    this.$on('query' as any, (e: Prisma.QueryEvent) => {
      console.log(`\u001B[96m Query: `, `\x1b[0m${e.query}`);
      console.log(`\u001B[96m Params: `, `\x1b[0m${e.params}`);
      console.log('\u001B[96m Duration: ' + `\x1b[0m${e.duration} ms`);
    });

    this.$use(loggingMiddleware(asyncContext));
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
