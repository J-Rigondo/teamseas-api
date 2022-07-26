import { Global, Module } from '@nestjs/common';
import { AsyncContextService } from 'src/async-context/async-context.service';

@Global()
@Module({
  providers: [AsyncContextService],
  exports: [AsyncContextService],
})
export class AsyncContextModule {}
