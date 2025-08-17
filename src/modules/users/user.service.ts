import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { paginate, PaginationOptions } from '../../../utils/pagination';
import { HashUtil, TimeUtil } from 'lloyd_core';
import { FileService } from '../files/file.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly fileService: FileService,
  ) {}

  async createUser(data: Partial<User>): Promise<User> {
    // 自动生成用户名
    if (!data.username && data.phone) {
      data.username = HashUtil.generateHash({ phone: data.phone, prefix: 'u' });
    }

    // Step 1: 创建用户实体
    const user = this.userRepository.create({
      ...data,
      bucket_name: data.username,
      created_at: TimeUtil.getTimestamp(),
      updated_at: TimeUtil.getTimestamp(),
    });

    // Step 2: 保存用户到数据库
    const savedUser = await this.userRepository.save(user);

    // Step 3: 创建对应的 bucket
    await this.fileService.createBucket(
      `bucket-${savedUser.username}`,
      savedUser,
    );

    return savedUser;
  }

  /**
   * 分页查找用户
   * @param options
   */
  async findUsers(options: PaginationOptions<User>) {
    return await paginate(this.userRepository, options);
  }

  /**
   * 修改用户个人信息（不允许修改密码）
   * @param phone 用户ID
   * @param updateData 要更新的字段（仅允许 username、email、phone）
   */
  async updateUser(
    phone: string,
    updateData: Partial<Pick<User, 'username' | 'email' | 'phone'>>,
  ): Promise<User> {
    // 查找用户
    const user = await this.userRepository.findOne({ where: { phone: phone } });
    if (!user) {
      throw new Error('用户不存在');
    }

    // 只更新允许的字段
    if (updateData.username !== undefined) user.username = updateData.username;
    if (updateData.email !== undefined) user.email = updateData.email;
    if (updateData.phone !== undefined) user.phone = updateData.phone;

    // 保存到数据库
    return this.userRepository.save(user);
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { phone } });
  }
}
