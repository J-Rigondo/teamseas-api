import { AsyncLocalStorage } from 'async_hooks';
import { Injectable } from '@nestjs/common';

const storage = new AsyncLocalStorage();

@Injectable()
export class AsyncContextService {
  set(req) {
    storage.enterWith(req);
  }
  get() {
    return storage.getStore();
  }
}
