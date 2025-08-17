import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { Bucket } from '../files/entities/file.entity';
import { FileModule } from '../files/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Bucket]), FileModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
