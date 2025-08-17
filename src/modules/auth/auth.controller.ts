import {
  Body,
  Controller,
  Get,
  HttpCode,
  Ip,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from '../users/user.service';
import express from 'express';
import { AuthService } from './auth.service';
import { DeviceUtil, HashUtil } from 'lloyd_core';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('createUser')
  @HttpCode(201)
  async createUser(
    @Body() body: { email?: string; phone: string; password: string },
  ) {
    // 拼接要保存的数据
    const data = {
      email: body.email,
      phone: body.phone,
      password_hash: HashUtil.hashPassword(body.password, body.phone).hash,
    };
    const existUser = await this.userService.findUserByPhone(body.phone);
    if (existUser) {
      return { success: false, message: '手机号已注册' };
    }
    return await this.userService.createUser(data);
  }

  @Post('login')
  async login(
    @Body() body: { phone: string; password: string },
    @Res({ passthrough: true }) res: express.Response,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    const { phone, password } = body;
    const userAgent = `${req.headers['user-agent']}` || '';
    const deviceType = DeviceUtil.getDeviceType(userAgent); // PC 或 Mobile

    // 1. 查找用户
    const user = await this.userService.findUserByPhone(phone);
    if (!user) {
      return { message: '手机号未注册', status: 401 };
    }

    // 2. 校验密码
    const valid = HashUtil.verifyPassword(
      password,
      user.password_hash,
      user.phone,
    );
    if (!valid) {
      return { message: '密码错误', status: 401 };
    }

    // 3. 生成 JWT
    const token = this.authService.generateToken(user.id);
    await this.authService.createUserSession(user.id, deviceType, ip, token);
    // 4. 设置 Cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false, // 开发环境可为 false，生产环境建议 true
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    return { user, token };
  }

  @Get('getSession')
  async findSessionByUserId(@Query('userId') userId: number) {
    return await this.authService.findSessionByUserId(userId);
  }

  @Get('getSessions')
  async findSessions(
    @Query('pageNumber') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ) {
    return await this.authService.findSessions({
      pageNumber: pageNumber ?? 1,
      pageSize: pageSize ?? 10,
      order: { created_at: 'DESC' },
    });
  }
}
