import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, of, map } from 'rxjs';
import { Request } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string | string[];
}

@Injectable()
export class GlobalResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  // 不需要验证 cookie 的接口
  private excludedPaths = ['/auth/login', '/auth/createUser'];

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const path = request.path;

    // 全局 cookie 验证（排除指定接口）
    const shouldCheckCookie = this.excludedPaths.every(
      (p) => !path.startsWith(p),
    );
    if (shouldCheckCookie && !request.cookies?.auth_token) {
      return of({ success: false, message: '缺少 Cookie 或未登录' });
    }

    return next.handle().pipe(
      map((res) => {
        // 如果业务已经返回 success/message，直接返回
        if (
          res &&
          typeof res === 'object' &&
          ('success' in res || 'message' in res)
        ) {
          return res as ApiResponse<T>;
        }
        // 否则包装为默认 success:true
        return { success: true, data: res } as ApiResponse<T>;
      }),
      catchError((err: unknown) => {
        let message: string | string[] = '内部服务器错误';
        if (err instanceof Error) message = err.message;
        if (Array.isArray(err)) message = err;
        return of({ success: false, message } as ApiResponse<T>);
      }),
    );
  }
}
