import { Injectable } from '@nestjs/common';
import { Log } from 'lloyd_core';

const log = new Log({ tag: 'lloyd_server' });

@Injectable()
export class AppService {
  getHello(): string {
    log.debug('AppService');
    return 'Hello World!';
  }
}

export default log;
