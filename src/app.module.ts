import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './test/module';
import { FileController } from './file/controller';

@Module({
  imports: [HelloModule],
  controllers: [AppController,FileController],
  providers: [AppService],
})
export class AppModule {}
