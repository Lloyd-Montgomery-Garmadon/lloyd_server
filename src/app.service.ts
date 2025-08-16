import { Injectable } from '@nestjs/common';
import { Logger } from 'core';

const logger = new Logger({ tag: 'leo' });

@Injectable()
export class AppService {
  getHello(): string {
    logger.debug('qweewqew');
    return 'Hello World!';
  }
}
