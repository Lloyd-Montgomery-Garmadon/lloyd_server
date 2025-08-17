import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getUsers')
  async getUsers(
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.userService.findUsers({
      pageNumber: parseInt(pageNumber, 10),
      pageSize: parseInt(pageSize, 10),
      order: { created_at: 'DESC' },
    });
  }

  @Get('getUser')
  async getUser(@Query('phone') phone: string) {
    const user = await this.userService.findUserByPhone(phone);
    if (!user) return null;

    // 去掉敏感字段 password_hash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _password_hash, ...sanitizedUser } = user;

    return sanitizedUser;
  }

  @Post('update')
  async updateUser(
    @Body()
    body: {
      username?: string;
      email?: string;
      phone: string;
    },
  ) {
    // 构造只允许更新的字段
    const updateData: Partial<Pick<User, 'username' | 'email'>> = {
      username: body.username,
      email: body.email,
    };

    // 删除值为 undefined 的字段，避免覆盖
    Object.keys(updateData).forEach(
      (key) =>
        updateData[key as keyof typeof updateData] === undefined &&
        delete updateData[key as keyof typeof updateData],
    );

    const updatedUser = await this.userService.updateUser(
      body.phone,
      updateData,
    );

    // 去掉密码字段返回
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash: _password_hash, ...rest } = updatedUser;

    return {
      message: '更新成功',
      user: rest,
    };
  }
}
