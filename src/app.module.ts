import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelloModule } from './test/module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/entities/user.entity';
import { AuthModule } from './modules/auth/auth.module';
import { UserSession } from './modules/auth/entities/user_sessions.entity';
import { Bucket } from './modules/files/entities/file.entity';
import { FileController } from './modules/files/file.controller';

@Module({
  imports: [
    HelloModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '5205617',
      database: 'lloyd',
      entities: [User, UserSession, Bucket],
      synchronize: true, // 开发环境用，生产环境不要用
    }),
    TypeOrmModule.forFeature([User, UserSession]),
    AuthModule,
  ],
  controllers: [AppController, FileController],
  providers: [AppService],
})
export class AppModule {}
