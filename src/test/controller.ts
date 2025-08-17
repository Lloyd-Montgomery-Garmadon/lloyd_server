import {
  Body,
  CallHandler,
  Controller,
  ExecutionContext,
  Get,
  Injectable,
  Ip,
  NestInterceptor,
  Param,
  Req,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

/** ------------------ 返回数据接口 ------------------ */
export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  total?: number; // 可选列表总数
}

/** ------------------ 拦截器 ------------------ */
@Injectable()
export class LoggingInterceptor<T = any>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    console.log('Before...');
    const now = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`After... ${Date.now() - now}ms`)),
      map(
        (data: T | T[]): ApiResponse<T> => ({
          success: true,
          total: Array.isArray(data) ? data.length : 1, // 自动计算数量
          data: Array.isArray(data) ? data : [data], // 使用接口
        }),
      ),
    );
  }
}

export class CreateUserDto {
  name: string;

  age: number;

  hobby: string[] = [];

  sayHello(): void {
    console.log('hello world', this);
  }

  toString(): string {
    return `name: ${this.name}, age: ${this.age},hobby:${this.hobby.join(', ')}`;
  }
}

@Controller('hello') // 路由前缀 /hello
export class HelloController {
  @Get(':id/orders') // GET /hello/:id/orders
  getUser(
    @Req() request: Request,
    @Param('id') id: number,
    @Ip() ip: string,
    @Body() body: object,
  ) {
    // @ts-expect-error
    console.log(request.cookies);
    return { id, ip, body };
  }
}
