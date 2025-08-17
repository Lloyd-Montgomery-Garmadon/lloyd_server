import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSession } from './entities/user_sessions.entity';
import { User } from '../users/entities/user.entity';
import { paginate, PaginationOptions } from '../../../utils/pagination';
import { TimeUtil } from 'lloyd_core';

@Injectable()
export class AuthService {
  private readonly jwtSecret = 'your_jwt_secret'; // 可以从配置中读取

  constructor(
    @InjectRepository(UserSession)
    private readonly sessionRepository: Repository<UserSession>, // 注入 session 仓库
  ) {}

  /**
   * 根据用户 ID 生成 JWT
   * @param userId 用户ID
   * @param expiresInHours 过期时间，可选，默认 24h
   * @returns JWT 字符串
   */
  generateToken(userId: number, expiresInHours = 24): string {
    const payload = { userId };
    const options: SignOptions = { expiresIn: expiresInHours * 60 * 60 }; // 小时转换为秒
    return jwt.sign(payload, this.jwtSecret, options);
  }

  /**
   * 保存用户会话
   * @param userId 用户ID
   * @param deviceInfo 设备信息
   * @param ip 登录IP
   * @param token
   * @param expiresInHours 过期时间（小时）
   */
  async createUserSession(
    userId: number,
    deviceInfo: string,
    ip: string,
    token: string,
    expiresInHours = 24,
  ): Promise<UserSession> {
    const session = this.sessionRepository.create({
      user: { id: userId } as User,
      token,
      device_info: deviceInfo,
      ip,
      created_at: TimeUtil.getTimestamp(),
      expires_at: TimeUtil.getTimestamp() + expiresInHours * 3600 * 1000,
    });

    return this.sessionRepository.save(session);
  }

  async findSessionByUserId(userId: number): Promise<UserSession | null> {
    return this.sessionRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findSessions(options: PaginationOptions<User>) {
    return await paginate(this.sessionRepository, options);
  }
}
