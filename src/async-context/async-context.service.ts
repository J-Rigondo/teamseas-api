import { AsyncLocalStorage } from 'async_hooks';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AsyncContextService {
  private readonly asynsStorage = new AsyncLocalStorage();

  set(data) {
    this.asynsStorage.enterWith(data);
  }
  get() {
    return this.asynsStorage.getStore();
  }
}
