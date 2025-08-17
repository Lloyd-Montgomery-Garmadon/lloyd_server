import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UserModule } from '../users/user.module';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserSession } from './entities/user_sessions.entity';
import { FileModule } from '../files/file.module';
import { Bucket } from '../files/entities/file.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([User, UserSession,Bucket]),
    FileModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
