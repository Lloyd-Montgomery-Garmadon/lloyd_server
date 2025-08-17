* 文件归系统所有，用户只是引用
* 文件夹属于用户，记录文件数量和总大小
* 上传支持分片、断点续传和秒传
* 删除文件只是逻辑删除

---

## 1️⃣ 用户表（users）

| 字段名            | 类型           | 主键/外键 | 默认值                | 备注         |
|----------------|--------------|-------|--------------------|------------|
| id             | SERIAL       | PK    | 自增                 | 用户唯一ID     |
| email          | VARCHAR(100) |       | NULL               | 邮箱         |
| phone          | VARCHAR(20)  |       | NULL               | 手机号        |
| password\_hash | VARCHAR(255) |       |                    | 密码哈希       |
| storage\_used  | BIGINT       |       | 0                  | 已用存储       |
| storage\_total | BIGINT       |       | 10737418240        | 总存储，默认10GB |
| 2fa\_enabled   | BOOL         |       | FALSE              | 二步验证是否启用   |
| created\_at    | TIMESTAMP    |       | CURRENT\_TIMESTAMP | 创建时间       |
| updated\_at    | TIMESTAMP    |       | CURRENT\_TIMESTAMP | 更新时间       |

---

## 2️⃣ 文件夹表（folders）

| 字段名          | 类型                      | 主键/外键          | 默认值                | 备注                 |
|--------------|-------------------------|----------------|--------------------|--------------------|
| id           | SERIAL                  | PK             | 自增                 | 文件夹ID              |
| user\_id     | INT                     | FK(users.id)   |                    | 所属用户               |
| name         | VARCHAR(255)            |                |                    | 文件夹名称              |
| parent\_id   | INT                     | FK(folders.id) | NULL               | 上级文件夹ID，NULL表示根目录  |
| type         | ENUM('folder','system') |                | 'folder'           | 文件夹类型，普通或系统        |
| file\_count  | INT                     |                | 0                  | 文件个数（逻辑存在的文件）      |
| folder\_size | BIGINT                  |                | 0                  | 文件夹总大小（逻辑存在的文件总大小） |
| created\_at  | TIMESTAMP               |                | CURRENT\_TIMESTAMP | 创建时间               |
| updated\_at  | TIMESTAMP               |                | CURRENT\_TIMESTAMP | 更新时间               |

---

## 3️⃣ 文件表（files）

| 字段名         | 类型                                 | 主键/外键 | 默认值                | 备注                |
|-------------|------------------------------------|-------|--------------------|-------------------|
| id          | SERIAL                             | PK    | 自增                 | 文件ID              |
| name        | VARCHAR(255)                       |       |                    | 文件名               |
| size        | BIGINT                             |       | 0                  | 文件大小              |
| hash        | CHAR(64)                           |       |                    | 文件 SHA-256        |
| status      | ENUM('uploading','done','deleted') |       | 'uploading'        | 上传状态              |
| ref\_count  | INT                                |       | 1                  | 引用计数（被多少用户/文件夹引用） |
| deleted\_at | TIMESTAMP                          |       | NULL               | 逻辑删除时间            |
| created\_at | TIMESTAMP                          |       | CURRENT\_TIMESTAMP | 创建时间              |
| updated\_at | TIMESTAMP                          |       | CURRENT\_TIMESTAMP | 更新时间              |

---

## 4️⃣ 用户文件引用表（user\_files）

| 字段名         | 类型        | 主键/外键          | 默认值                | 备注       |
|-------------|-----------|----------------|--------------------|----------|
| id          | SERIAL    | PK             | 自增                 | 引用ID     |
| user\_id    | INT       | FK(users.id)   |                    | 所属用户     |
| folder\_id  | INT       | FK(folders.id) |                    | 文件夹ID    |
| file\_id    | INT       | FK(files.id)   |                    | 文件ID     |
| created\_at | TIMESTAMP |                | CURRENT\_TIMESTAMP | 添加时间     |
| deleted\_at | TIMESTAMP |                | NULL               | 用户逻辑删除标记 |

---

## 5️⃣ 上传/分片管理表（uploads）

| 字段名              | 类型                                                                 | 主键/外键        | 默认值                | 备注                               |
|------------------|--------------------------------------------------------------------|--------------|--------------------|----------------------------------|
| id               | SERIAL                                                             | PK           | 自增                 | 上传任务ID                           |
| file\_id         | INT                                                                | FK(files.id) |                    | 文件ID                             |
| file\_hash       | CHAR(64)                                                           |              |                    | 文件 SHA-256，用于秒传                  |
| total\_chunks    | INT                                                                |              | 1                  | 总分片数                             |
| uploaded\_chunks | INT                                                                |              | 0                  | 已上传分片数量                          |
| chunk\_statuses  | JSONB                                                              |              | `[]`               | 每个分片状态数组，元素 `{index,status,url}` |
| status           | ENUM('pending','uploading','uploaded','merged','failed','skipped') |              | 'pending'          | 上传任务整体状态                         |
| created\_at      | TIMESTAMP                                                          |              | CURRENT\_TIMESTAMP | 创建时间                             |
| updated\_at      | TIMESTAMP                                                          |              | CURRENT\_TIMESTAMP | 更新时间                             |

---

## 6️⃣ 文件版本表（file\_versions）

| 字段名         | 类型        | 主键/外键        | 默认值                | 备注          |
|-------------|-----------|--------------|--------------------|-------------|
| id          | SERIAL    | PK           | 自增                 | 版本ID        |
| file\_id    | INT       | FK(files.id) |                    | 文件ID        |
| version     | INT       |              | 1                  | 版本号         |
| content     | TEXT      |              |                    | 文本内容（仅文本文件） |
| created\_at | TIMESTAMP |              | CURRENT\_TIMESTAMP | 创建时间        |

---

## 7️⃣ 分享表（shares）

| 字段名            | 类型           | 主键/外键        | 默认值                | 备注            |
|----------------|--------------|--------------|--------------------|---------------|
| id             | SERIAL       | PK           | 自增                 | 分享ID          |
| user\_id       | INT          | FK(users.id) |                    | 分享者           |
| target\_ids    | JSONB        |              |                    | 分享的文件/文件夹ID集合 |
| password\_hash | VARCHAR(255) |              | NULL               | 分享密码（可选）      |
| expire\_at     | TIMESTAMP    |              | NULL               | 分享过期时间        |
| max\_download  | INT          |              | NULL               | 最大下载次数        |
| created\_at    | TIMESTAMP    |              | CURRENT\_TIMESTAMP | 创建时间          |

---

## 8️⃣ 日志表（logs）

| 字段名       | 类型                          | 主键/外键        | 默认值                | 备注                 |
|-----------|-----------------------------|--------------|--------------------|--------------------|
| id        | SERIAL                      | PK           | 自增                 | 日志ID               |
| user\_id  | INT                         | FK(users.id) |                    | 操作用户               |
| action    | VARCHAR(50)                 |              |                    | 操作类型（上传/下载/删除/分享等） |
| target    | VARCHAR(255)                |              |                    | 操作对象               |
| level     | ENUM('info','warn','error') |              | 'info'             | 日志级别               |
| timestamp | TIMESTAMP                   |              | CURRENT\_TIMESTAMP | 记录时间               |

---

## 9️⃣ 离线文件表（offline\_files）

| 字段名        | 类型        | 主键/外键        | 默认值                | 备注     |
|------------|-----------|--------------|--------------------|--------|
| id         | SERIAL    | PK           | 自增                 | 记录ID   |
| user\_id   | INT       | FK(users.id) |                    | 用户ID   |
| file\_id   | INT       | FK(files.id) |                    | 文件ID   |
| cached\_at | TIMESTAMP |              | CURRENT\_TIMESTAMP | 离线标记时间 |

---

## 🔟 通知表（notifications）

| 字段名          | 类型          | 主键/外键        | 默认值                | 备注               |
|--------------|-------------|--------------|--------------------|------------------|
| id           | SERIAL      | PK           | 自增                 | 通知ID             |
| type         | VARCHAR(50) |              |                    | 通知类型（上传完成/分享访问等） |
| content      | TEXT        |              |                    | 通知内容             |
| user\_id     | INT         | FK(users.id) |                    | 用户ID             |
| read\_status | BOOL        |              | FALSE              | 是否已读             |
| created\_at  | TIMESTAMP   |              | CURRENT\_TIMESTAMP | 创建时间             |

---

## 1️⃣1️⃣ 后台存储节点表（nodes）

| 字段名            | 类型                       | 主键/外键 | 默认值                | 备注     |
|----------------|--------------------------|-------|--------------------|--------|
| id             | SERIAL                   | PK    | 自增                 | 节点ID   |
| status         | ENUM('online','offline') |       | 'online'           | 节点状态   |
| capacity\_used | BIGINT                   |       | 0                  | 已使用存储  |
| latency        | INT                      |       | 0                  | 延迟指标   |
| updated\_at    | TIMESTAMP                |       | CURRENT\_TIMESTAMP | 最近更新时间 |

---
明白，我帮你用表格的形式整理 `user_sessions` 表：

---

## 1️⃣2️⃣ 用户会话表（user\_sessions）

| 字段名          | 类型           | 主键/外键        | 默认值                | 备注           |
|--------------|--------------|--------------|--------------------|--------------|
| id           | SERIAL       | PK           | 自增                 | 会话ID         |
| user\_id     | INT          | FK(users.id) |                    | 所属用户ID       |
| token        | VARCHAR(512) |              |                    | JWT Token    |
| device\_info | VARCHAR(255) |              |                    | 设备信息（PC/手机等） |
| ip           | VARCHAR(45)  |              |                    | 登录IP地址       |
| created\_at  | TIMESTAMP    |              | CURRENT\_TIMESTAMP | 会话创建时间       |
| expires\_at  | TIMESTAMP    |              |                    | 会话过期时间       |

---
