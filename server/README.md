# 律师事务所名片小程序 - 后端服务

基于 NestJS 10 + Supabase 的后端 API 服务。

## 📋 项目信息

- **框架**: NestJS 10.4.15
- **语言**: TypeScript 5.7.2
- **数据库**: Supabase (PostgreSQL)
- **包管理器**: pnpm

## 🚀 快速开始

### 本地开发

```bash
# 1. 安装依赖
pnpm install

# 2. 创建环境变量文件
cp .env.example .env
nano .env  # 编辑并填入 Supabase 配置

# 3. 启动开发服务器
pnpm dev

# 服务将在 http://localhost:3000 启动
```

### 使用部署脚本（推荐）

```bash
# 一键部署（自动安装依赖、构建、启动）
./deploy.sh
```

## 📦 部署到生产环境

我们提供了三种部署方案，根据你的需求选择：

### 方案 1: Vercel 部署（推荐新手）

✅ **优点**: 免费、全自动、无需服务器、自动 HTTPS

📖 **详细指南**: 查看 [QUICK_START.md](./QUICK_START.md) 的"方案一"部分

**快速步骤**:
1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 点击部署

---

### 方案 2: Docker 部署（推荐生产环境）

✅ **优点**: 可自定义、可控性强、一次配置永久使用

📖 **详细指南**: 查看 [QUICK_START.md](./QUICK_START.md) 的"方案二"部分

**快速步骤**:
```bash
# 1. 配置 .env 文件
cp .env.example .env
nano .env

# 2. 使用 Docker Compose 启动
docker-compose up -d

# 3. 查看日志
docker-compose logs -f
```

---

### 方案 3: 云服务器部署

✅ **优点**: 完全控制、可扩展

📖 **详细指南**: 查看 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🔧 环境变量配置

必需的环境变量（在 `.env` 文件中配置）:

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `NODE_ENV` | 运行环境 | `production` |
| `DATABASE_URL` | 数据库连接字符串 | `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres` |
| `SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | Supabase anon key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

**如何获取这些配置？**

1. 登录 [Supabase](https://supabase.com/)
2. 进入你的项目
3. 点击左侧 `Settings` → `API`
4. 复制以下信息:
   - **Project URL**: `SUPABASE_URL`
   - **anon public**: `SUPABASE_KEY`
   - **Connection string**: `DATABASE_URL` (选择 "URI" 标签页)

## 📚 API 接口文档

### 基础信息

- **基础路径**: `/api`
- **响应格式**: JSON

### 主要接口

#### 1. 律师管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/lawyers` | 获取所有律师列表 |
| GET | `/api/lawyers/:id` | 获取律师详情 |
| POST | `/api/lawyers` | 创建律师（管理员） |
| PUT | `/api/lawyers/:id` | 更新律师（管理员） |
| DELETE | `/api/lawyers/:id` | 删除律师（管理员） |

#### 2. 用户认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 微信登录 |

**请求示例**:
```json
{
  "userId": "123456",
  "avatarUrl": "https://example.com/avatar.jpg",
  "nickname": "张三",
  "userType": "customer"
}
```

#### 3. 咨询消息

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/consultations` | 获取咨询列表 |
| GET | `/api/consultations/:id` | 获取咨询详情 |
| POST | `/api/consultations` | 创建咨询 |
| POST | `/api/consultations/:id/reply` | 回复咨询 |

#### 4. 名片收藏

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/saved-cards/save` | 收藏名片 |
| GET | `/api/saved-cards` | 获取收藏列表 |
| POST | `/api/saved-cards/unsave` | 取消收藏 |

#### 5. 浏览记录

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/viewed-lawyers` | 获取浏览历史 |

#### 6. 文件上传

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/upload` | 文件上传 |

#### 7. 后台管理

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/admin/login` | 管理员登录 |
| POST | `/api/admin/init` | 初始化默认管理员 |
| GET | `/api/admin/list` | 获取管理员列表 |

### 响应格式

成功响应:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": { ... }
}
```

错误响应:
```json
{
  "code": 500,
  "msg": "错误信息",
  "data": null
}
```

## 🛠️ 开发脚本

```bash
# 安装依赖
pnpm install

# 开发模式（带热更新）
pnpm dev

# 构建
pnpm build

# 生产模式启动
pnpm start:prod

# 运行数据库迁移
pnpm db:push

# 生成数据库迁移文件
pnpm db:generate

# ESLint 检查
pnpm lint

# TypeScript 类型检查
pnpm tsc
```

## 📁 项目结构

```
server/
├── src/
│   ├── auth/              # 用户认证
│   ├── admin/             # 后台管理
│   ├── lawyer/            # 律师管理
│   ├── consultations/     # 咨询消息
│   ├── saved-cards/       # 名片收藏
│   ├── viewed-lawyers/    # 浏览记录
│   ├── upload/            # 文件上传
│   ├── interceptors/      # 拦截器
│   ├── main.ts            # 应用入口
│   └── app.module.ts      # 根模块
├── dist/                  # 构建输出
├── migrations/            # 数据库迁移文件
├── .env.example           # 环境变量模板
├── docker-compose.yml     # Docker 配置
├── Dockerfile             # Docker 镜像配置
├── deploy.sh              # 一键部署脚本
├── QUICK_START.md         # 快速部署指南
└── DEPLOYMENT_GUIDE.md    # 详细部署指南
```

## 🔒 认证机制

### Token 格式

```
token_{userId}_{randomString}
```

示例: `token_123_abc123xyz`

### 使用方式

前端在请求头中携带 token:

```typescript
Authorization: Bearer token_123_abc123xyz
```

后端自动解析 token 并获取用户 ID。

## 📊 数据库表结构

主要数据表:

- `users` - 用户信息
- `lawyers` - 律师信息
- `consultations` - 咨询消息
- `saved_cards` - 名片收藏
- `viewed_lawyers` - 浏览记录
- `admins` - 管理员账号

详细表结构请查看 `migrations/` 目录。

## 🧪 测试

### 本地测试

```bash
# 启动服务
pnpm dev

# 测试接口
curl http://localhost:3000/api/lawyers
```

### 生产环境测试

```bash
# 测试 API 是否正常
curl https://your-api-domain.com/api/lawyers
```

## 📝 更新部署

### Vercel

- 推送代码到 GitHub，自动部署

### Docker

```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker-compose down
docker-compose up -d --build

# 查看日志
docker-compose logs -f
```

### PM2

```bash
# 拉取最新代码
git pull
pnpm install
pnpm build

# 重启服务
pm2 restart law-firm-api
```

## ❓ 常见问题

### Q: 如何获取 Supabase 配置？

A: 登录 Supabase → 进入项目 → Settings → API → 复制配置

### Q: 部署后小程序无法访问 API？

A: 检查以下几点:
1. 后端服务是否正常运行
2. 域名是否正确解析
3. 微信小程序后台是否配置了 request 合法域名

### Q: 数据库连接失败？

A: 检查 `DATABASE_URL` 是否正确，确保 Supabase 项目正常运行

### Q: 如何查看服务日志？

A:
- Vercel: 在 Vercel 控制台查看部署日志
- Docker: `docker-compose logs -f`
- PM2: `pm2 logs law-firm-api`

## 📖 相关文档

- [快速部署指南](./QUICK_START.md) - 推荐新手阅读
- [详细部署指南](./DEPLOYMENT_GUIDE.md) - 完整的部署文档
- [生产环境配置](../PRODUCTION_CONFIG.md) - 小程序上线配置

## 🆘 需要帮助？

如果遇到问题，请检查:
1. 环境变量是否正确配置
2. 数据库连接是否正常
3. 防火墙规则是否正确
4. SSL 证书是否有效

---

**祝你部署顺利！🎉**
