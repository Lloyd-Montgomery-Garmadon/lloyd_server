import { FileController } from './controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [FileController],
})
export class FileModule {}
