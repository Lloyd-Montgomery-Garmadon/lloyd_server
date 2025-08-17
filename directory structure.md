---

## 1️⃣ 项目根目录

```
lloyd-server/
│
├─ src/
│   ├─ main.ts                # NestJS 启动文件
│   ├─ app.module.ts          # 根模块，汇总各功能模块
│
├─ modules/                   # 功能模块目录，每个模块独立
│   ├─ auth/                  # 用户认证、登录注册
│   │   ├─ auth.controller.ts
│   │   ├─ auth.service.ts
│   │   ├─ auth.module.ts
│   │   ├─ dto/               # DTO 数据传输对象
│   │   └─ entities/          # JWT 黑名单、RefreshToken 等表
│   │
│   ├─ users/                 # 用户系统
│   │   ├─ user.controller.ts
│   │   ├─ user.service.ts
│   │   ├─ user.module.ts
│   │   ├─ dto/
│   │   └─ entities/
│   │       └─ user.entity.ts
│   │
│   ├─ files/                 # 文件管理
│   │   ├─ file.controller.ts
│   │   ├─ file.service.ts
│   │   ├─ file.module.ts
│   │   ├─ dto/
│   │   └─ entities/
│   │       └─ file.entity.ts
│   │
│   ├─ shares/                # 分享机制
│   │   ├─ share.controller.ts
│   │   ├─ share.service.ts
│   │   ├─ share.module.ts
│   │   ├─ dto/
│   │   └─ entities/
│   │       └─ share.entity.ts
│   │
│   ├─ uploads/               # 上传/下载管理
│   │   ├─ upload.service.ts
│   │   ├─ upload.module.ts
│   │   └─ entities/
│   │       └─ upload_task.entity.ts
│   │
│   ├─ security/              # 安全策略、审计
│   │   ├─ audit.service.ts
│   │   ├─ security.module.ts
│   │   └─ entities/
│   │       └─ audit_log.entity.ts
│   │
│   ├─ notifications/         # 推送/通知
│   │   ├─ notification.service.ts
│   │   ├─ notification.module.ts
│   │   └─ entities/
│   │       └─ notification.entity.ts
│   │
│   ├─ admin/                 # 后台管理系统
│   │   ├─ admin.controller.ts
│   │   ├─ admin.service.ts
│   │   ├─ admin.module.ts
│   │   └─ dto/
│   │
│   └─ common/                # 公共模块
│       ├─ filters/           # 异常过滤器
│       ├─ guards/            # 权限、JWT验证
│       ├─ interceptors/      # 日志、响应封装
│       ├─ pipes/             # 验证、转换
│       └─ utils/             # 公共工具函数
│
├─ config/                     # 配置文件
│   ├─ database.config.ts
│   ├─ jwt.config.ts
│   └─ upload.config.ts

```

---

## 2️⃣ 模块关系说明

| 模块              | 说明                                  |
|-----------------|-------------------------------------|
| `auth`          | 处理注册、登录、JWT、Refresh Token、第三方 OAuth |
| `users`         | 用户信息管理、容量、会员等级、登录日志、二步验证            |
| `files`         | 文件夹/文件操作、回收站、分类、标签、收藏               |
| `shares`        | 分享链接生成、访问权限、密码保护、有效期                |
| `uploads`       | 分片上传、秒传、断点续传、任务管理                   |
| `security`      | 审计日志、异常登录监控、敏感操作记录                  |
| `notifications` | 推送通知、邮件、消息中心                        |
| `admin`         | 后台管理控制台、数据看板、用户管理、内容审计              |
| `common`        | 全局通用工具、Pipe、Guard、Interceptor 等     |

---
