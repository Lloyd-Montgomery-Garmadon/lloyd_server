import {
  Body,
  Controller,
  Get,
  Module,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { IsNumber, IsString } from 'class-validator';
/** ------------------ Module ------------------ */
import { HelloController, LoggingInterceptor } from './controller';

/** ------------------ DTO ------------------ */
export class CreateUserBody {
  @IsString({ message: '缺少 name 参数' })
  name!: string;

  @IsNumber({}, { message: '缺少 age 参数' })
  age!: number;
}

/** ------------------ 动态 Controller ------------------ */
interface ControllerLogic {
  get?: () => any;
  create?: (body: any) => any;
}

export function createController(path: string, logic: ControllerLogic) {
  @Controller(path)
  @UseInterceptors(LoggingInterceptor)
  class DynamicController {
    @Get()
    get(): any {
      return logic.get ? logic.get() : null;
    }

    @Post('create')
    create(@Body() rawBody?: object): any {
      if (!rawBody || Object.keys(rawBody).length === 0) {
        return { success: false, message: '缺少请求体' };
      }

      // 如果逻辑里有 DTO 校验，自己在 create 方法里做
      return logic.create ? logic.create(rawBody) : null;
    }
  }

  return DynamicController;
}

/** ------------------ 使用示例 ------------------ */
const UserController = createController('users', {
  get: () => ['Alice', 'Bob'],
  create: (body: CreateUserBody) => `已创建用户：${body.name}`,
});

const OrderController = createController('orders', {
  get: () => ['Order1', 'Order2'],
  create: (body: CreateUserBody) => [
    `已创建订单，年龄：${body.age}`,
    {
      name: body.name,
    },
    5,
  ],
});

@Module({
  imports: [],
  providers: [],
  controllers: [HelloController, UserController, OrderController],
})
export class HelloModule {}
