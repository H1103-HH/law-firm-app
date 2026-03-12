# 🚀 Railway 部署指南

本指南将指导你在 Railway 平台上部署律师名片小程序的后端服务。

## 📋 前置要求

- ✅ GitHub 账号
- ✅ Railway 账号（如果没有，需要注册）

---

## 🎯 部署步骤

### 第 1 步：注册 Railway 账号

1. 访问 Railway 官网：https://railway.app
2. 点击 **Start a New Project**
3. 使用 GitHub 账号登录

---

### 第 2 步：创建新项目

1. 登录后，点击 **New Project**
2. 选择 **Deploy from GitHub repo**

---

### 第 3 步：导入项目

1. 在 GitHub 仓库列表中找到 `law-firm-app` 仓库
2. 如果没有看到仓库，点击 **Configure GitHub App** 授权 Railway 访问你的 GitHub
3. 找到 `law-firm-app` 仓库，点击 **Import**

---

### 第 4 步：配置项目

Railway 会自动检测项目配置：
- **Build Command**: 会自动识别 `pnpm build`
- **Start Command**: 会自动识别 `pnpm start:prod`

如果配置不正确，可以手动修改：
- **Root Directory**: `server`
- **Build Command**: `pnpm build`
- **Start Command**: `pnpm start:prod`

---

### 第 5 步：配置环境变量

在 **Variables** 标签页添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NODE_ENV` | `production` | 运行环境 |
| `PORT` | `3000` | 服务端口 |
| `COZE_SUPABASE_URL` | `https://xcadxajiavehzzhqahd.supabase.co` | Supabase URL |
| `COZE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjYWR4YWppYXZlaHp6aHFhaGQiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTczNDUzNzU3OSwiZXhwIjoyMDUwMTEzNTc5fQ.XcVQfP8hK3rX5vY7rP2qK5tL8mN0jD5wG8hJ2kL5mN0` | Supabase 匿名密钥 |
| `DATABASE_URL` | `postgresql://postgres:gaoxinjing2000@aws-0-ap-northeast-1.pooler.supabase.co:6543/postgres` | 数据库连接字符串 |

---

### 第 6 步：部署

1. 点击 **Deploy** 按钮
2. 等待部署完成（通常需要 2-5 分钟）
3. 部署完成后，会显示 **Your service is live**

---

### 第 7 步：获取 API 地址

1. 部署完成后，点击项目名称进入详情页
2. 找到 **Domains** 标签页
3. 复制显示的域名，例如：`https://law-firm-app-server-xxx.railway.app`

---

## 🧪 测试 API

### 测试健康检查接口

在浏览器访问：
```
https://<你的-railway-域名>/api/health
```

预期返回：
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "status": "ok",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### 测试律师列表接口

在浏览器访问：
```
https://<你的-railway-域名>/api/lawyers
```

预期返回：
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "id": 1,
      "name": "张三",
      "title": "高级合伙人",
      ...
    }
  ]
}
```

---

## 📱 配置小程序

### 第 8 步：创建 `.env.local` 文件

在项目根目录创建 `.env.local` 文件：
```bash
# 项目根目录
cd /workspace/projects
cat > .env.local << EOF
PROJECT_DOMAIN=https://<你的-railway-域名>
EOF
```

### 第 9 步：重新构建小程序

```bash
# 构建微信小程序
pnpm build:weapp

# 构建完成后，上传小程序到微信开发者工具
```

---

## 🔐 配置微信小程序后台域名白名单

### 第 10 步：登录微信公众平台

访问：https://mp.weixin.qq.com

### 第 11 步：配置服务器域名

1. 进入 **开发管理**
2. 点击 **开发设置**
3. 找到 **服务器域名**
4. 在 **request 合法域名** 中添加：
   ```
   https://<你的-railway-域名>
   ```

---

## ✅ 完成检查清单

- [ ] Railway 项目创建成功
- [ ] 环境变量配置正确
- [ ] 部署成功，服务在线
- [ ] `/api/health` 接口返回正常
- [ ] `/api/lawyers` 接口返回正常
- [ ] 小程序 `.env.local` 文件已配置
- [ ] 小程序重新构建成功
- [ ] 微信小程序后台域名白名单已配置

---

## 🆘 常见问题

### Q: 部署失败怎么办？

A: 检查以下几点：
1. Dockerfile 配置是否正确
2. package.json 中的脚本是否正确
3. 环境变量是否配置完整
4. 查看部署日志定位错误

### Q: API 超时怎么办？

A: 检查以下几点：
1. Supabase 数据库连接是否正常
2. 端口配置是否正确（应为 3000）
3. 健康检查路径是否正确（`/api/health`）

### Q: 如何查看部署日志？

A: 在 Railway 项目详情页，点击 **Logs** 标签页查看实时日志。

---

## 📚 相关文档

- [Railway 官方文档](https://docs.railway.app)
- [Railway Node.js 部署指南](https://docs.railway.app/deploy/nodejs)
- [Railway 环境变量配置](https://docs.railway.app/develop/variables)

---

## 🎉 完成后

恭喜你！后端服务已成功部署到 Railway。

下一步：
1. 确保小程序已配置正确的 `PROJECT_DOMAIN`
2. 重新构建并上传小程序
3. 在微信小程序中测试所有功能

如果有任何问题，请查看部署日志或联系技术支持。
