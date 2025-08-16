import { Controller, Get } from '@nestjs/common';
import log, { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    log.debug('AppController');
    return this.appService.getHello();
  }
}
